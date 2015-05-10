/**
 * 
 */
"use strict";

// Namespace to avoid pollution of the global namespace.
var povusa = {
    margin : 75,
    nativeWidth : 1035 - 75,
    nativeHeight : 525 - 75,
    svg : {},
    map : {},
    states : {},
    counties : {},
    poverty_data : [],
    minRate : 20.0,
    maxRate : 60.0,
    minColor : "orange",
    maxColor : "black",
    county_data : {},
    year : 2013,
    rate : "rateAll",
    readDone : false
};

// Map projection.  AlbersUsa is a map projection that treats Alaska and
// Hawaii as special cases.
povusa.projection = d3.geo.albersUsa().precision(1);

// Path function for scaling county and state boundaries.
povusa.path = d3.geo.path().projection(povusa.projection);

// Color scale object used to assign colors to counties based on the county's
// poverty rate.
povusa.color = d3.scale.linear().domain([ povusa.minRate, povusa.maxRate ])
        .range([ povusa.minColor, povusa.maxColor ]);

// Tooltip object for county annotations.
povusa.tooltip = function() { }

// Create a county identifier from census data.
povusa.fipsToId = function(stateFIPS, countyFIPS) {
    return 100 * countyFIPS + stateFIPS;
};

// Constructor for poverty data objects.  The id field is used to
// match objects to counties.  The id field is contructed from the
// FIPS identifiers assigned by the census bureau.
povusa.PovertyData = function(name, stateFIPS, countyFIPS, mhi, rate0to4,
        rate0to17, rate5to17, rateAll) {
    this.name = name;
    this.id = povusa.fipsToId(stateFIPS, countyFIPS);
    this.STATEFP = stateFIPS;
    this.COUNTYFP = countyFIPS;
    this.medianHouseholdIncome = mhi;
    this.rate0to4 = rate0to4;
    this.rate0to17 = rate0to17;
    this.rate5to17 = rate5to17;
    this.rateAll = rateAll;
};

// Read in the input data from the file specified by pdata.  The
// poverty data is in eleven distinct CSV files.
// Populate the object povusa.poverty_data with income and poverty
// rate data for all US counties.
function readPovertyData(pdata) {
    var out = [];
    var pValue = {};
    for (var i = 0; i < pdata.length; i++) {
        pValue = pdata[i];
        var name = pValue["Name"];
        var mHIncome = "";
        var povAge0to4 = "";
        var povAge0to17 = "";
        var povAge5to17 = "";
        var povAgeAll = "";
        var stateFips = "";
        var countyFips = "";
        if (pValue["State FIPS Code"]) {
            stateFips = "State FIPS Code";
        } else if (pValue["State FIPS"]) {
            stateFips = "State FIPS";
        }
        if (pValue["County FIPS Code"]) {
            countyFips = "County FIPS Code";
        } else if (pValue["County FIPS"]) {
            countyFips = "County FIPS";
        }
        if (pValue["Median Household Income"]) {
            mHIncome = "Median Household Income";
        }
        if (pValue["Poverty Percent, Age 0-4"]) {
            povAge0to4 = "Poverty Percent, Age 0-4";
        } else if (pValue["Poverty Percent Ages 0-4"]) {
            povAge0to4 = "Poverty Percent Ages 0-4";
        }
        if (pValue["Poverty Percent, Age 0-17"]) {
            povAge0to17 = "Poverty Percent, Age 0-17";
        } else if (pValue["Poverty Percent Under Age 18"]) {
            povAge0to17 = "Poverty Percent Ages 0-17";
        }
        if (pValue["Poverty Percent, Age 5-17 in Families"]) {
            povAge5to17 = "Poverty Percent, Age 5-17 in Families";
        } else if (pValue["Poverty Percent, Ages 5-17 in Families"]) {
            povAge5to17 = "Poverty Percent, Ages 5-17 in Families";
        } else if (pValue["Poverty Percent Ages 5-17"]) {
            povAge5to17 = "Poverty Percent Ages 5-17";
        }
        if (pValue["Poverty Percent, All Ages"]) {
            povAgeAll = "Poverty Percent, All Ages";
        } else if (pValue["Poverty Percent All Ages"]) {
            povAgeAll = "Poverty Percent All Ages";
        }
        var mIncome = "";
        if (typeof (pValue[mHIncome]) === "string") {
            mIncome = +(pValue[mHIncome].replace(",", ""));
        } else {
            mIncome = pValue[mHIncome];
        }
        // Create a new PovertyData object, including FIPS attributes hidden from
        // the user that go into the key "id".  Convert string values to numbers...
        var obj = new povusa.PovertyData(pdata[i]["Name"], +pValue[stateFips],
            +pValue[countyFips], mIncome, +pValue[povAge0to4], +pValue[povAge0to17],
            +pValue[povAge5to17], +pValue[povAgeAll]);
        var id = obj["id"];
        out[id] = obj;
    }
    povusa.poverty_data = out;
};

// Map update function.  Read in poverty data, reconnect that data to the
// counties array, and update the overall title.
function updatePovertyData(pdata) {
    readPovertyData(pdata);
    povusa.updateCounties();
    d3.select("body").select("h1").text(
        "Poverty rate of the United States by county for the year " + povusa.year);
};

// Map initialization: Add the colorscale legend using custom SVG.
// Add a distinct SVG element for the map.  Append two G elements to hold
// state and county paths.  Enable map zoom and pan.  Place map text below
// the map.
povusa.svgsetup = function() {
    var svg1 = d3.select("body").append("svg").attr("width",
        povusa.nativeWidth + povusa.margin).attr("height", "40");
    // Color scale legend.
    var defs = svg1.append("defs");
    var lgrad = defs.append("linearGradient").attr("id", "uspovColor");
    lgrad.append("stop").style("stop-color", povusa.minColor).attr("offset",
        "0%");
    lgrad.append("stop").style("stop-color", povusa.maxColor).attr("offset",
        "100%");
    svg1.append("rect").attr("class", "swatch").attr("width", 200).attr(
        "height", 20).style("fill", "url(#uspovColor)");
    svg1.append("text").attr("x", "0").attr("y", "40").attr("font-size", "14")
        .text(povusa.minRate + "%");
    svg1.append("text").attr("x", "200").attr("y", "40")
        .attr("font-size", "14").text(povusa.maxRate + "%");

    // SVG element for the map.
    povusa.svg = d3.select("body").append("svg").attr("width",
        povusa.nativeWidth + povusa.margin).attr("height",
        povusa.nativeHeight + povusa.margin);

    povusa.counties = povusa.svg.append("g").attr("class", "county");
    povusa.states = povusa.svg.append("g").attr("class", "state");
    povusa.svg.call(povusa.zoom).call(povusa.zoom.event);
    povusa.tooltip = d3.select("body").append("div").attr("class", "tooltip");

    d3.select("body").append("p").text("The poverty rates when 'All' is selected are the number of persons of low income in a" +
"county divided by the total population of that county.  The poverty rates when '5 to 17' is selected are" +
"the number of children in low income families 5 to 17 years old in a county divided by the population of" +
"that county and age ange.  Poverty is defined on a per family basis.  The definition is complex.  Roughly speaking" +
"poverty is defined in a way that depends on income and family size.  For the definition, refer to").append("a")
        .attr("href","http://www.census.gov/hhes/www/poverty/about/overview/measure.html")
        .text("How the Census Bureau Measures Poverty.");
};

// Assign a color to a county using the appropriate poverty rate.
// The input to this call back is a county object with FIPS data for
// state and county that is mapped to a poverty object id.  The rate
// is taken from the appropriate poverty data element using the id.
// The rate is mapped to a color using the povusa.color scale.
// Missing data is mapped to white.
povusa.countyFill = function(d) {
    var myId = povusa.fipsToId(+d.properties.STATEFP, +d.properties.COUNTYFP);
    var c = "white";
    if (povusa.poverty_data[myId] && povusa.poverty_data[myId][povusa.rate]) {
        var myVal = povusa.poverty_data[myId][povusa.rate];
        if (!isNaN(myVal)) {
            c = povusa.color(myVal);
        }
    }
    return c;
};

// Callback to assign a key to each county.
povusa.county_key = function(d) {
    return povusa.fipsToId(+d.properties.STATEFP,
            +d.properties.COUNTYFP);
};

// Display a tooltip when the user mouses over a county.
povusa.mouseOverTooltip = function(d, i) {
    var myId = povusa.fipsToId(+d.properties.STATEFP,
            +d.properties.COUNTYFP);
    var mouse = d3.mouse(povusa.svg.node()).map(
        function(d) {
            return parseInt(d);
        });
    var county = povusa.poverty_data[myId];
    if (county) {
        var tooltipText = "<dl>";
        // tooltipText += "<dt>Id:</dt><dd>" + myId + "</dd>";
        // tooltipText += "<dt>StateFIP:</dt><dd>"
        //     + d.properties.STATEFP + "</dd>";
        // tooltipText += "<dt>CountyFIP:</dt><dd>"
        //     + d.properties.COUNTYFP + "</dd>";
        tooltipText += "<dt>Name:</dt><dd>" + county.name
            + "</dd>";
        tooltipText += "<dt>Median household income:</dt><dd>";
        if (isNaN(county.medianHouseholdIncome)) {
            tooltipText = tooltipText + "Missing data</dd>";
        } else {
            tooltipText += county.medianHouseholdIncome
                + "</dd>";
        }
        tooltipText += "<dt>Poverty rate (5 to 17):</dt><dd>"
        if (isNaN(county.rate5to17)) {
            tooltipText = tooltipText + "Missing data</dd>";
        } else {
            tooltipText = tooltipText + county.rate5to17
                + "</dd>";
        }
        tooltipText += "<dt>Poverty rate (all ages):</dt><dd>"
        if (isNaN(county.rateAll)) {
            tooltipText = tooltipText + "Missing data</dd>";
        } else {
            tooltipText = tooltipText + county.rateAll
                + "</dd>";
        }
        tooltipText = tooltipText + "</dl>";
        povusa.tooltip.classed("hidden", false).attr(
            "style",
            "left:" + (mouse[0] + 25) + "px;top:"
                    + mouse[1] + "px;").html(
                tooltipText);
    }
};

// Add county boundaries to the map.  This is a callback for d3.json to use.
// Mouseover event callbacks are assigned to each of the county objects.
povusa.addCounties = function(cdata) {
    povusa.county_data = cdata;
    povusa.counties
        .selectAll("path")
        .data(
                povusa.county_data.features,
                povusa.county_key)
        .enter()
        .append("path")
        .attr("d", povusa.path)
        .attr("stateFP", function(d) {
            return +d.properties.STATEFP;
        })
        .attr("countyFP", function(d) {
            return +d.properties.COUNTYFP
        })
        .attr("name", function(d) {
            return d.properties.NAME;
        })
        .attr(
            "id",
            function(d) {
                return povusa.fipsToId(d.properties.STATEFP,
                        d.properties.COUNTYFP);
            })
        .style("fill", povusa.countyFill)
        .on(
            "mouseover", povusa.mouseOverTooltip)
        .on("mouseout", function(d, i) {
            povusa.tooltip.classed("hidden", true);
        })
};

// Add state boundaries to the map.  This is a callback for d3.json to use.
povusa.addStates = function(state_data) {
    povusa.states.selectAll("path").data(state_data.features).enter().append(
            "path").attr("d", povusa.path).attr("name", function(d) {
        return d.properties.NAME;
    }).attr("stateFP", function(d) {
        return +d.properties.STATEFP;
    }).attr("id", function(d) {
        return povusa.fipsToId(d.properties.STATEFP, 0);
    });
};

// Attach poverty data poverty data for the counties to the
// county objects.
povusa.updateCounties = function() {
    povusa.counties.selectAll("path").data(
        povusa.county_data.features, povusa.county_key)
        .style("fill", povusa.countyFill);
}

// Update the map by changing the year.  This is done by changing
// the povusa.year member used in the title and by reading in the
// poverty data for all of the counties for the given year.
// The data input method takes a callback, set to updatePovertyData,
// that connects the poverty data to the counties in the map.
function changeYear(yr) {
    povusa.year = yr;
    d3.csv("data/uspov" + povusa.year + ".csv", updatePovertyData);
};

// Animate by year.
function animateYears() {
    var ybuttons = document.getElementsByClassName("yearbutton");
    var button = 0;
    for (button = 0; button < ybuttons.length; button++) {
        ybuttons[button].checked = false;
        ybuttons[button].disabled = true;
    }
    var years = ["2003", "2004", "2005", "2006", "2007", "2008","2009", "2010", "2011", "2012", "2013"];
    var i = 0;
    var year_interval = setInterval(function() {
        changeYear(years[i]);
        i++;
        if (i >= years.length) {
            for (button = 0; button < ybuttons.length; button++) {
                ybuttons[button].disabled = false;
            }
            ybuttons[ybuttons.length - 1].checked = true;
            clearInterval(year_interval);
        }
    }, 1500);
}

// Change the rate based on user selection.
function changeRate(rt) {
    povusa.rate = rt;
    povusa.updateCounties();
};

povusa.zoomed = function() {
    povusa.counties.attr("transform", "translate("
        + d3.event.translate.join(",") + ")scale(" + d3.event.scale + ")");
    povusa.states.attr("transform", "translate(" + d3.event.translate.join(",")
        + ")scale(" + d3.event.scale + ")");
};

povusa.zoom = d3.behavior.zoom().scaleExtent([ 1, 10 ]).on("zoom",
    povusa.zoomed);
