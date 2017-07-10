import React from 'react';

class Limit extends React.Component {
    render() {
        return <div></div>;
    }
}

function Prev({total, count, limit, offset = 0, onPrev}) {
    offset = parseInt(offset, 10);
    limit = parseInt(limit, 10);
    let btn = '';
    if (offset >= limit) {
        let onClick = (ev) => {
            ev.preventDefault();
            onPrev(limit, offset - limit);
        }
        btn = <a className="btn" onClick={onClick}>&laquo;</a>;
    }
    return <li>{btn}</li>;
}
function Next({total, count, limit, offset = 0, onNext}) {
    offset = parseInt(offset, 10);
    limit = parseInt(limit, 10);
    let btn = '';
    if (total > count + offset) {
        let onClick = (ev) => {
            ev.preventDefault();
            onNext(limit, offset + limit);
        }
        btn = <a className="btn" onClick={onClick}>&raquo;</a>;
    } else {
        console.log(total, count, offset);
    }
    return <li>{btn}</li>;
}

export default function Pagination(props)  {
    //let page = 1;
    let offset = parseInt(props.offset);
    let resume = props.count != 0
        ? (offset + 1) + ' - ' + (offset + props.count) + ' / ' + props.total
        : '';

    return <div>
        {resume}
        <ul className="pager">
            <Prev {...props} />
            <Next {...props} />
        </ul>
    </div>;
}
