import React from 'react';
import Pagination from './Pagination.jsx';

const identity = v => v;
const get = (haystack, needle, spoon) => haystack[needle] || spoon;
const invertDirection = d => get({
  ASC: "DESC",
  DESC: "ASC"
}, d, "ASC");

function SortHeader(props) {
  let {field, direction, colName, text} = props,
    className = (field === colName)
      ? "orderField orderField--" + direction
      : "",
    onChangeOrder = props.onChangeOrder,
    onClick = evt => {
      evt.preventDefault();
      let newDirection = (field === colName)
         ? invertDirection(direction.trim())
         : "ASC";
      onChangeOrder(colName, newDirection);
    };
  return <a href="#" className={className} onClick={onClick}>{text}</a>;
};

function ColumnHeader(props) {
  let content = (props.resultsCount > 0)
    ? <SortHeader {...props.order} text={props.text} colName={props.colName} />
    : props.text;
  return (
    <th style={{ textTransform: 'capitalize' }}>
      {content}
    </th>
  );
}

function ResultRow(props) {
    let
      {cols, rowId, displayCols, fieldFormatters} = props,
      showColumn = displayCols.length
        ? columnName => displayCols.indexOf(columnName) !== -1
        : () => true,
      getValue     = columnName => get(cols, columnName),
      getFormatter = columnName => get(fieldFormatters, columnName, identity),
      formatValue  = columnName => {
        let f = getFormatter(columnName);
        return f(getValue(columnName))
      },
      data_cols = Object.keys(cols).filter(showColumn)
        .map(columnName => <td key={rowId + "-" + columnName}>{formatValue(columnName)}</td>);
    return <tr>{data_cols}</tr>;
}

export default function SearchResult(props) {
  let {
    columnNames,
    cols,
    rows,

    limit = 20,
    offset = 0,
    total,

    onPaginate,
    onChangeOrder,
    fieldFormatters,

    orderField,
    orderDirection
  } = props;

  let pagination = {
    onPaginate,
    limit,
    offset,
    total,
    count: rows.length || 0
  };
  let order = {
    field: orderField,
    direction: orderDirection,
    onChangeOrder
  };

  let data_ths = cols.map((col, i) => <ColumnHeader key={i} colName={col} text={get(columnNames,col, col)} order={order} resultsCount={rows.length}/>);

  // @TODO let action_ths = actions.map((action,i) => <th key={i}>{action}</th>); then render after data_ths

  let noResultsText = 'Sin resultados',
    noResultsRow = (
      <tr>
        <td colSpan={cols.length} className="text-center">
          <span className="text-muted">{noResultsText}</span>
        </td>
      </tr>
    );

  let
    count = rows.length,
    resume = (count > 0)
      ? <small className="text-muted">{(offset + 1) + ' - ' + (offset + count) + ' / ' + total}</small>
      : '',
    data_rows = count
      ? rows.map((row, i) => <ResultRow row={i} key={i} cols={row} displayCols={cols} fieldFormatters={fieldFormatters} />)
      : noResultsRow;

  return (
    <div>
      <Pagination {...pagination} />
      {resume}
      <table className="table table-stripped table-bordered table-hover">
        <thead>
          <tr>{data_ths}</tr>
        </thead>
        <tbody>{data_rows}</tbody>
      </table>
      <Pagination {...pagination} />
    </div>
  );
}
