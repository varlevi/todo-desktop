import React from 'react';
import ReactDOM from 'react-dom';


class List extends React.Component {
    render() {
        return <p>Hello, world!</p>
    }
}


ReactDOM.render(
    <List />,
    document.getElementById("container")
)
