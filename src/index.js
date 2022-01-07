import React from "react";
import ReactDOM from "react-dom";
import {
	SolrFacetedSearch,
	SolrClient
} from "solr-faceted-search-react";

import solrReducer from "./solr-reducer";
import { createStore } from "redux"

// Create a store for the reducer.
const store = createStore(solrReducer);

// The search fields and filterable facets you want
const fields = [
	{label: "Text", field: "searchText", type: "text"},
	{label: "Source", field: "source", type: "list-facet", facetSort:"index"},
	{label: "Context", field: "hasContextCategory", type: "list-facet", facetSort:"count"},
	{label: "Material", field: "hasMaterialCategory", type: "list-facet", facetSort:"count"},
	{label: "Specimen", field: "hasSpecimenCategory", type: "list-facet", facetSort:"count"},
	{label: "Registrant", field: "registrant", type: "list-facet", facetSort:"count"},
];

// The sortable fields you want
const sortFields = [
	{label: "Name", field: "koppelnaam_s"},
	{label: "Date of birth", field: "birthDate_i"},
	{label: "Date of death", field: "deathDate_i"}
];

const solrClient = new SolrClient({
	// The solr index url to be queried by the client
	//url: "http://localhost:8985/solr/isb_core_records/select",
	url: "https://mars.cyverse.org/thing/select",
	//idField: "id",
	//pageStrategy: "cursor",
	rows: 50,
	searchFields: fields,
	sortFields: sortFields,
	fields: "*",

	onChange: (state) => store.dispatch({type: "SET_SOLR_STATE", state: state}),

	// The change handler passes the current query- and result state for render
	// as well as the default handlers for interaction with the search component
	onChange: (state, handlers) =>
		// Render the faceted search component
		ReactDOM.render(
			<SolrFacetedSearch 
				{...state}
				{...handlers}
				bootstrapCss={true}
				onSelectDoc={(doc) => console.log(doc)}
			/>,
			document.getElementById("app")
		)
});

store.subscribe(() => {
	// In stead of using the handlers passed along in the onChange callback of SolrClient
	// use the .getHandlers() method to get the default click / change handlers
	ReactDOM.render(
		<SolrFacetedSearch
			{...store.getState()}
			{...solrClient.getHandlers()}
			bootstrapCss={true}
			onSelectDoc={(doc) => console.log(doc)}
		/>,
		document.getElementById("app")
	)	
});

document.addEventListener("DOMContentLoaded", () => {
	// this will send an initial search initializing the app
	solrClient.initialize();
});