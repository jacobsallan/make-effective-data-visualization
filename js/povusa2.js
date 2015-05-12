/**
 * 
 */
"use strict";
var povusa = {
    margin : 75,
    width : 1035 - 75,
    height : 675 - 75,
    nativeWidth : 1035 - 75,
    nativeHeight : 675 - 75,
    nativeScale : 1280,
    svg : {},
    map : {},
    states : {},
    counties : {},
    poverty_data : {},
    minRate : 20.0,
    maxRate : 60.0,
    minColor : "orange",
    maxColor : "black",
    county_data : {},
    year : 2013,
    rate : "rateAll",
    readDone : false
};

povusa.projection = d3.geo.albersUsa().precision(1);
povusa.path = d3.geo.path().projection(povusa.projection);
povusa.color = d3.scale.linear().domain([ povusa.minRate, povusa.maxRate ])
        .range([ povusa.minColor, povusa.maxColor ]);
povusa.tooltip = function() {
}

povusa.fipsToId = function(stateFIPS, countyFIPS) {
    return 100 * countyFIPS + stateFIPS;
};

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

function readOldPovertyData(pdata) {
    var out = {};
    var pValue = {};
    for (var i = 0; i < pdata.length; i++) {
        pValue = pdata[i];
        var name = pValue["Name"];
        var mHIncome = pValue.slice(133, 139);
        var povAge0to4 = pValue.slice(154, 160);
        var povAge0to17 = pValue.slice(76, 80);
        var povAge5to17 = pValue.slice(91, 99);
        var povAgeAll = pValue.slice(34, 38);
        var stateFips = pValue.slice(0, 2);
        var countyFips = pValue.slice(3, 6);
        var obj = new povusa.PovertyData(pdata[i]["Name"], +pValue[stateFips],
            +pValue[countyFips], mHIncome, +pValue[povAge0to4], +pValue[povAge0to17],
            +pValue[povAge5to17], +pValue[povAgeAll]);
        var id = obj["id"];
        out[id] = obj;
    }
    povusa.poverty_data = out;
};

function readPovertyData(pdata) {
    var out = {};
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
        var obj = new povusa.PovertyData(pdata[i]["Name"], +pValue[stateFips],
            +pValue[countyFips], mIncome, +pValue[povAge0to4], +pValue[povAge0to17],
            +pValue[povAge5to17], +pValue[povAgeAll]);
        var id = obj["id"];
        out[id] = obj;
    }
    povusa.poverty_data = out;
};

function updatePovertyData(pdata) {
    readPovertyData(pdata);
    povusa.updateCounties();
    d3.select("body").select("h1").text(
        "Poverty rate of the United States by county for the year " + povusa.year);
};

function updateOldPovertyData(pdata) {
    readOldPovertyData(pdata);
    povusa.updateCounties();
};

povusa.svgsetup = function() {
    d3.selectAll(".formp").style("width",povusa.nativeWidth);
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
};

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

povusa.county_key = function(d) {
    return povusa.fipsToId(+d.properties.STATEFP,
            +d.properties.COUNTYFP);
};

povusa.mouseOverTooltip = function(d, i) {
    var myId = povusa.fipsToId(+d.properties.STATEFP,
            +d.properties.COUNTYFP);
    // d is undefined
    // i is 0
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
        // tooltipText += "<dt>Poverty rate (0 to 17):</dt><dd>"
        // if (isNaN(county.rateAll)) {
        //    tooltipText = tooltipText + "Missing data</dd>";
        // } else {
        //    tooltipText = tooltipText + county.rate0to17;
        //            + "</dd>";
        // }
        // tooltipText += "<dt>Poverty rate (0 to 4):</dt><dd>"
        // if (isNaN(county.rate0to4)) {
        //    tooltipText = tooltipText + "Missing data</dd>";
        // } else {
        //    tooltipText = tooltipText + county.rate0to4
        //            + "</dd>";
        // }
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

povusa.updateCounties = function() {
    povusa.counties.selectAll("path").data(
        povusa.county_data.features, povusa.county_key)
        .style("fill", povusa.countyFill);
}

function changeYear(yr) {
    povusa.year = yr;
    d3.csv("data/uspov" + povusa.year + ".csv", updatePovertyData);
};

function animateYears() {
    var years = ["2003", "2004", "2005", "2006", "2007", "2008","2009", "2010", "2011", "2012", "2013"];
    var i = 0;
    for (i = 0; i < years.length; i++) {
        changeYear(years[i]);
    }
}

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
