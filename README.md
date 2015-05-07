make-effective-data-visualization

Summary
=======

The interaction of geography, pre-existing poverty, and the Great Recession is
the subject of the visualization.

The recession increased the poverty rate most dramatically in the southeastern
United States and this effect preceded the financial crash of 2007 by two
years.  There were some cities, including some in the midwest that had their
poverty rates increase dramatically in the years 2003-2013; but this effect
is not uniform.

Design
======

The chart type is a chlorpleth of the United States.  The data is census data
taken for all the counties of the United States.  Color isused to encode the
overall poverty rates and the rates for families with children in the age range
5-17.  The color scale is chosen so that the data can be represented without
clipping.

State boundaries are plotted on top of the county map because most users are
much more familiar with state boundaries than they are with counties.

A radio group is placed above the map that allows users to choose to map data
for each of the years between 2003 and 2013, inclusive.  A second radio group
allows users to choose between a map of the overall poverty rate and a map of
the 5-17 age range poverty rate.

Below the radio groups is a color scale so that the colors make sense.

The counties in the maps are associated with tooltips to allow users to
examine data in numeric form and to find the names of selected counties.

Some of the counties are geographically small; to see them users will need pan
and zoom features.  Mouse double click and mouse wheel motion controls the
zoom.  Mouse click and move control map pan.
 

Feedback
========

Reviewer: Ian F.

What do you notice in the visualization?

I notice that you can see the poverty rate for both all ages, and for the age
group 5 - 17 for any given year between 2003 and 2013.  This data is broken up
by county, and if you scroll over any county in the graphic, the data will
follow the mouse cursor.  If you double click, you can zoom in make sure you
are selecting the correct county.

What questions do you have about the data?

The color range above that says "20 .....60" with the light to dark color
rectangle...what does it represent exactly?  I couldn't tell.  Also, when you
are scrolling over the different countys, the poverty rate is shown.  I am
assuming it is a percentage, but I wanted to double check.  The State and
County FIP shows too, but I am not sure what the purpose of this is.  The
county name, household income, and poverty rates are shown which and end user
would be interested in, but I don't know how significant FIP really is...
unless it relates to something else in the graphic that I am not seeing.
Also, if I click on "5 - 17" for 2012, the screen is blank.  You might want
to take a look.

What relationships do you notice?

There is definitely a positive correlation between household income and poverty
rate.  Also, the poverty rate for the age group 5 - 17 is definitely higher
than "all ages".  I also notice much more darker coloration for the "5-17"
group as the years get larger, but for "All Ages", it gets darker during the
middle years, but a little lighter at the ends. 

Is there something you don’t understand in the graphic?

As far as the poverty rate goes, is it possible to define "Poverty Rate"?  I
see that the graphic shows the poverty rate of all age groups, and a select
age group of 5-17, but what exactly does that mean?  Is there a dollar amount
or household income that would encompass "poverty"?  Also, is the poverty
rate for the age groups for individuals or families?  For example...if the
poverty rate is 15.7 for "5-17", does that mean that 15.7% of kids between ages
5 and 17 live in poverty, or is it 15.7% of families with kids between 5-17
live in poverty?  Its hard for me to wrap my head around a poverty rate for an
age group 5-17, because when I think of poverty, I don't think of kids in
poverty, I think of families with kids in poverty.


Resources
=========

"Cartographic Boundary Shapefiles - Counties"
https://www.census.gov/geo/maps-data/data/cbf/cbf_counties.html

"Cartographic Boundary Shapefiles - Counties"
https://www.census.gov/geo/maps-data/data/cbf/cbf_counties.html

"Small Area Income and Poverty Estimates"
http://www.census.gov/did/www/saipe/data/statecounty/data/2003.html

"d3.js Chloropleth"
https://strongriley.github.io/d3/ex/choropleth.html

"Where Are the Hardest Places to Live in the U.S.?"
http://graphics8.nytimes.com/newsgraphics/2014/06/16/worst-places/d92796c59951a5cccb3ad6411f599ad302a5c4bd/build.js

https://gist.github.com/patricksurry/6621971

"click-to-zoom via transform"
http://bl.ocks.org/mbostock/2206590

"Every ColorBrewer Scale"
http://bl.ocks.org/mbostock/5577023

"How the Census Bureau Measures Poverty"
http://www.census.gov/hhes/www/poverty/about/overview/measure.html
