import React, {Component} from 'react';

// another way to define React component
export default function SearchResultRow(props) {

    let {cols, rowId, displayCols} = props;
    let data_cols = Object.keys(cols).map((columnName) => {
        let showColumn = displayCols.length
            ? displayCols.indexOf(columnName) !== -1
            : true;
        return showColumn
            ? <td key={rowId + "-" + columnName}>{trim(cols[columnName])}</td>
            : null;
    });
    let action_cols = null;
    // @TODO action columns :)
    return <tr>{data_cols + action_cols}</tr>;

    function trim(s) {
        return s;
    }
}
