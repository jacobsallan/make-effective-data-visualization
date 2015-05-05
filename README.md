make-effective-data-visualization

Summary

The interaction of geography, pre-existing poverty, and the Great Recession is the subject of
the visualization.

The recession increased the poverty rate most dramatically in the southeastern United States
and this effect preceded the financial crash of 2007 by two years.  There were some cities,
including some in the midwest that had their poverty rates increase dramatically in the years
2003-2013; but this effect is not uniform.

Design

The chart type is a chlorpleth of the United States.  The data is census data taken for all the counties of the
United States.  Color isused to encode the overall poverty rates and the rates for families with children in the
age range 5-17.  The color scale is chosen so that the data can be represented without clipping.

State boundaries are plotted on top of the county map because most users are much more familiar with state
boundaries than they are with counties.

A radio group is placed above the map that allows users to choose to map data for each of the years
between 2003 and 2013, inclusive.  A second radio group allows users to choose between a map of the
overall poverty rate and a map of the 5-17 age range poverty rate.

Below the radio groups is a color scale so that the colors make sense.

The counties in the maps are associated with tooltips to allow users to examine data in numeric form
and to find the names of selected counties.

Some of the counties are geographically small; to see them users will need pan and zoom features. 
Mouse double click and mouse wheel motion controls the zoom.  Mouse click and move control map pan.
 

Feedback



Resources

https://www.census.gov/geo/maps-data/data/cbf/cbf_counties.html "Cartographic Boundary Shapefiles - Counties"
https://www.census.gov/geo/maps-data/data/cbf/cbf_counties.html "Cartographic Boundary Shapefiles - Counties"
http://www.census.gov/did/www/saipe/data/statecounty/data/2003.html "Small Area Income and Poverty Estimates"
https://strongriley.github.io/d3/ex/choropleth.html  "d3.js Chloropleth"
http://graphics8.nytimes.com/newsgraphics/2014/06/16/worst-places/d92796c59951a5cccb3ad6411f599ad302a5c4bd/build.js  "Where Are the Hardest Places to Live in the U.S.?"
https://gist.github.com/patricksurry/6621971
http://bl.ocks.org/mbostock/2206590  "click-to-zoom via transform"
http://bl.ocks.org/mbostock/5577023  "Every ColorBrewer Scale"

