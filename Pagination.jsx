import React from 'react';
class Limit extends React.Component {
    render() {
        return <div></div>;
    }
}
class Prev extends React.Component {
    render() {
        return <div></div>;
    }
}
class Next extends React.Component {
    render() {
        return <div></div>;
    }
}

export default function Pagination()  {
    let page = 1;
    return <div>
        Page {page} (of ?). <Limit /> <Prev /> <Next /> </div>;
}
