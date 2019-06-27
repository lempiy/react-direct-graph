export const exampleEventsCode =
    `import React, { Component, Fragment } from "react";

import DirectGraph from "react-direct-graph";
import graph from "../../data/graph";

export class ExampleEvents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            event: \`Click event info will be here...\`
        };
    }
    onNodeClick = (event, node, incomes) => {
        this.setState({
            event: \`Click on node "\${node.id}"\`
        });
    };

    onEdgeClick = (event, node, incomes) => {
        this.setState({
            event: \`Click on edge from income "\${incomes[0].id}" to node "\${node.id}"\`
        });
    };

    onNodeMouseEnter = (event, node, incomes) => {
        const path = event.currentTarget.querySelector(
            ".node-icon-default path"
        );
        path.style.stroke = "#f00";
        path.style.fill = "#f00";
    };

    onNodeMouseLeave = (event, node, incomes) => {
        const path = event.currentTarget.querySelector(
            ".node-icon-default path"
        );
        path.style.stroke = null;
        path.style.fill = null;
    };

    onEdgeMouseEnter = (event, node, incomes) => {
        event.currentTarget.style.stroke = "#f00";
    };

    onEdgeMouseLeave = (event, node, incomes) => {
        event.currentTarget.style.stroke = null;
    };

    render() {
        const { cellSize, padding } = this.props;
        return (
            <Fragment>
                <p>{this.state.event}</p>
                <DirectGraph
                    list = {
                        graph.map(n => ({
                            ...n,
                            next: [...n.next]
                        }))
                    }
                    cellSize={cellSize}
                    padding={padding}
                    onNodeClick={this.onNodeClick}
                    onEdgeClick={this.onEdgeClick}
                    onNodeMouseEnter={this.onNodeMouseEnter}
                    onNodeMouseLeave={this.onNodeMouseLeave}
                    onEdgeMouseEnter={this.onEdgeMouseEnter}
                    onEdgeMouseLeave={this.onEdgeMouseLeave}
                />
            </Fragment>
        );
    }
}
`
