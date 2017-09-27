# React based frontend for [customsearch](http://github.com/tincho/customsearch)

This is a React component that features a search form, results table and simple pagination.

CustomSearch finds given terms in all (or specified) fields from a MySql table with 3 different strategies: **any** (matches any term in any of the fields), **all** (matches rows containing all the given terms in one or any of the fields, in any order) or **full** (matches the full exact phrase in any of the fields).

Soon it will have a backend configuration tool.

API Endpoins used:
* `/columns/selected` Columns configured to search in
* `/search?q=terms separated by spaces`
 * `&type=any|all|full` (default: any)
 * `&offset=N` Used by pagination (in the future will pass "page" and pagination logic will be in backend)
 * `&order=column ASC|DESC` Used

Search form simply performs GET requests to the specified endpoint

## Usage

```jsx
<CustomSearch
  src="http://my.server/customsearch"
  columnNames={ field1: "Label 1", field2: "Label 2", ... }
  fieldFormatters={ field1: value => value.replace("exam", "ple") }
 />
```

# License

MIT
