import React from 'react';

const identity = v => v;
const get = (haystack, needle, spoon) => haystack[needle] || spoon;

export default function SearchResultRow(props) {
    let
      {cols, rowId, displayCols, fieldFormatters} = props,
      showColumn = displayCols.length
        ? columnName => displayCols.indexOf(columnName) !== -1
        : () => true,
      Field = columnName => {
          let formatter = get(fieldFormatters, columnName, identity),
              value = formatter(get(cols, columnName));
          return <td key={rowId + "-" + columnName}>{value}</td>;
      },
      data_cols = Object.keys(cols).filter(showColumn).map(Field);
    return <tr>{data_cols}</tr>;
}
