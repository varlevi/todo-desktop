import React from 'react';
import ReactDOM from 'react-dom';


function ListItem(props) {
    let className = props.finished ? "todo-done" : "todo";
    return (
        <p className={className}>
          <i className="fi-check check"></i>
          {props.text}
        </p>
    );
}


function ListSection(props) {
    let items = [];
    for (let item of props.items) {
        items.push(<ListItem finished={item.finished} text={item.text} />);
    }
    return (
        <div>
          <h2>
            {props.title}
            <span role="button" className="section-control section-control-left">(rename)</span>
            <span role="button" className="section-control">(delete)</span>
          </h2>
          <hr />
          {items}
          <div className="inline-form">
            <i className="fi-plus"></i>
            <input placeholder="Add item to section"></input>
          </div>
          <hr className="bottom-hr" />
        </div>
    );
}


class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sections: [
                {
                    title: "Thursday",
                    items: [
                        {
                            text: "Read chapter 3 of Sculpting in Time",
                            finished: false,
                        },
                        {
                            text: "Finish CS240 midterm",
                            finished: true,
                        },
                    ],
                },
                {
                    title: "Friday",
                    items: [
                        {
                            text: "LING399 presentation",
                            finished: false,
                        },
                        {
                            text: "Submit request for reimbursement",
                            finished: false,
                        },
                    ],
                },
            ]
        };
    }

    render() {
        let sections = [];
        for (let section of this.state.sections) {
            sections.push(<ListSection title={section.title} items={section.items} />);
        }
        return (
            <div>
              {sections}

              <div className="inline-form" id="form-new-section">
                <i className="fi-plus"></i>
                <input placeholder="Create new section"></input>
              </div>
            </div>
        );
    }
}


ReactDOM.render(
    <List />,
    document.getElementById("container")
);
