import React, { Component, Fragment } from "react";

import DirectGraph from "react-direct-graph";

const react = [
    {
        id: "R",
        next: ["E"]
    },
    {
        id: "E",
        next: ["A"]
    },
    {
        id: "A",
        next: ["C"]
    },
    {
        id: "C",
        next: ["T"]
    },
    {
        id: "T",
        next: []
    }
];

const direct = [
    {
        id: "D",
        next: ["I"]
    },
    {
        id: "I",
        next: ["R"]
    },
    {
        id: "R",
        next: ["E"]
    },
    {
        id: "E",
        next: ["C"]
    },
    {
        id: "C",
        next: ["T"]
    },
    {
        id: "T",
        next: []
    }
];

const graph = [
    {
        id: "G",
        next: ["R"]
    },
    {
        id: "R",
        next: ["A"]
    },
    {
        id: "A",
        next: ["P"]
    },
    {
        id: "P",
        next: ["H"]
    },
    {
        id: "H",
        next: []
    }
];

export class Title extends Component {
    render() {
        const { cellSize, padding } = this.props;
        return (
            <Fragment>
                <DirectGraph
                    list={react}
                    cellSize={cellSize}
                    padding={padding}
                />
                <DirectGraph
                    list={direct}
                    cellSize={cellSize}
                    padding={padding}
                />
                <DirectGraph
                    list={graph}
                    cellSize={cellSize}
                    padding={padding}
                />
            </Fragment>
        );
    }
}
