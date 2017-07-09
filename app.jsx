import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import fetchJSON from './Helpers/fetchJson.js';

import SearchForm from 'SearchForm';
import SearchResult from 'SearchResult';
import Pagination from 'Pagination';

var $$ = document.querySelector.bind(document);
// var serialize = obj => Object.keys(obj).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`).join('&');

export default class SearchApp extends React.Component {

    constructor(props) {
        super(props);
        this.src = props.src;
        this.state = {
            data: [],
            cols: []
        };
    }

    componentWillMount() {
        this.loadColumns();
    }

    loadColumns() {
        fetchJSON(this.src + '/columns/selected').then(cols => this.setState({cols}));
    }

    loadResults({limit, offset}) {
        evt.preventDefault();

        let
            thisNode = ReactDOM.findDOMNode(this),
            $$       = thisNode.querySelector.bind(thisNode);

        // @TODO get these 2 values from SearchForm somehow
        var q = $$("input[name=q]").value;
        var type = ($$("input[name=type]:checked") || {
            value: 'any'
        }).value;

        this.setState({
            loading: true // @TODO ...SearchResult is loading its data!
        });

        let params = `?q=${q}&type=${type}`;
        // if(limit)
        //let pagination = serialize(this.state.pagination);
        //this.state.pagination.join()
        //if (this.state.paginaton.limit) params += '&limit=' +

        // @TODO have previous "data" and append if paginating ...
        // use Redux!
        fetchJSON(this.src + 'search?' + params).then(data => this.setState({
            loading: false,
            data: data // @TODO backend should respond  limit, offset !
        }));
    }

    render() {
        // @TODO handle pagination via REDUX
        let formSubmit = (evt) => {
            evt.preventDefault();
            // dispatch action "SEARCH"
            this.loadResults();
        };
        let Pagination = {
            loadNextPage: () => {},
            loadPrevPage: () => {},
            setLimit: () => {}
        };
        return (
            <div>
                <div className="well">
                    <SearchForm onSubmit={formSubmit} />
                </div>
                <SearchResult cols={this.state.cols} rows={this.state.data} {...Pagination} />
            </div>
        );
    }
}
