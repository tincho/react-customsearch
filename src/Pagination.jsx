/**
 * Pagination component for react-customSearch
 * @TODO: needs simplifying
 */

import React from 'react';

const firstAndLastPage = ({current, side, pages}) => {
    let
        pWindow = 2 * side,
        first = Math.max(1, Math.min(current - side, pages - pWindow)),
        last  = Math.min(pages, first + pWindow);
    return [ first, last ];
}

// calculate offset from page (and limit)
export const getOffset = (lim, p) => ~~lim * Math.max(~~p - 1, 0);
// calculate page from offset (and limit)
// export const getPage = (lim, o) => 1 + Math.ceil(o / lim);

function PaginationLink(limit, currentPage, onClick, {page, text, disabled}) {
  let isCurrent = !text && page === currentPage,
      liClass = disabled
        ? 'disabled' :
        isCurrent
          ? 'active'
          : '',
      aClass = (isCurrent || disabled)
        ? 'disabled'
        : '';
  return (<li className={liClass}>
      <a onClick={ () => onClick(page) } className={aClass} href="#">{text || page}</a>
  </li>);
}

function PageNumbers({firstPage, lastPage, pages, Link}) {
  let
    pageButtons = [],
    hellip = <li key={+new Date()} className="disabled"><a>&hellip;</a></li>;
  for (let page = firstPage; page <= lastPage; page++) {
      let moreBefore = (page > 1),
          moreAfter  = (pages > lastPage);
      if (page == firstPage && moreBefore && !moreAfter)  {
           pageButtons.push(hellip)
      }

      let btnProps = { page, key: page };
      pageButtons.push(<Link {...btnProps} />);

      if ( page == lastPage && moreAfter ) {
          pageButtons.push(hellip)
      }
  }
  return pageButtons;
}

/**
 @param props {total, limit, page, count, onPaginate}
 */
export default function Pagination(props) {
    let {total, limit} = props,
        pages = Math.floor(total / limit) + 1;

    if (pages <= 1) {
      return null;
    }

    let
      {page, count, onPaginate} = props,
      prev = Math.max(1, page - 1),
      next = Math.min(pages, page + 1),
      [
        firstPage = 1,
        lastPage = pages
      ] = firstAndLastPage({current: page, pages, side: 2});

    const Link = PaginationLink.bind(null, limit, page, onPaginate);

    let pageButtons = PageNumbers({firstPage, lastPage, pages, Link});

    return (
        <div>
          <ul className="pagination">
            <Link text="&laquo;" page="1" disabled={page === 1} />
            <Link text="&lsaquo;" page={prev} disabled={page === 1} />
            {pageButtons}
            <Link text="&rsaquo;" page={next} disabled={page === pages} />
            <Link text="&raquo;" page={pages} disabled={page === pages} />
          </ul>
        </div>
      );
}
