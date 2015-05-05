cb_2013_us_county_500k.geojson:
	ogr2ogr -f GeoJSON -t_srs crs:84 cb_2013_us_county_500k.geojson cb_2013_us_county_500k.shp

cb_2013_us_state_500k.geojson:
	ogr2ogr -f GeoJSON -t_srs crs:84 cb_2013_us_state_500k.geojson cb_2013_us_state_500k.shp

cb_2013_us_county_5m.geojson:
	ogr2ogr -f GeoJSON -t_srs crs:84 cb_2013_us_county_5m.geojson cb_2013_us_county_5m.shp

cb_2013_us_state_5m.geojson:
	ogr2ogr -f GeoJSON -t_srs crs:84 cb_2013_us_state_5m.geojson cb_2013_us_state_5m.shp

uspov20xx: uspov2003.csv uspov2004.csv uspov2005.csv uspov2006.csv uspov2007.csv uspov2008.csv uspov2009.csv uspov2010.csv uspov2011.csv uspov2012.csv uspov2013.csv

uspov2003.csv:
	tail -n +2  est03ALL.csv > uspov2003.csv

uspov2004.csv:
	tail -n +2  est04ALL.csv > uspov2004.csv

uspov2005.csv:
	tail -n +2  est05ALL.csv > uspov2005.csv

uspov2006.csv:
	tail -n +2  est06ALL.csv > uspov2006.csv

uspov2007.csv:
	tail -n +2  est07ALL.csv > uspov2007.csv

uspov2008.csv:
	tail -n +2  est08ALL.csv > uspov2008.csv

uspov2009.csv:
	tail -n +2  est09ALL.csv > uspov2009.csv

uspov2010.csv:
	tail -n +2  est10ALL.csv > uspov2010.csv

uspov2011.csv:
	tail -n +2  est11ALL.csv > uspov2011.csv

uspov2012.csv:
	tail -n +2  est12ALL.csv > uspov2012.csv

uspov2013.csv:
	tail -n +2  est13ALL.csv > uspov2013.csv

