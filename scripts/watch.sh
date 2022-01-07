#!/bin/sh

node_modules/.bin/watchify src/index.js \
	--require react \
	--require react-dom \
	--standalone SolrFacetedSearch \
	--transform [ babelify --presets [ react es2015 stage-2 ] ] \
	--verbose \
	-o src/web.js 
