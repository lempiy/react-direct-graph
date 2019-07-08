import React, { Component } from "react";

import DirectGraph from "react-direct-graph";

const graph = [
    {
        id: "A",
        next: ["B"]
    },
    {
        id: "B",
        next: ["C", "D", "E"]
    },
    {
        id: "C",
        next: ["F"]
    },
    {
        id: "D",
        next: ["J"]
    },
    {
        id: "E",
        next: ["J"]
    },
    {
        id: "J",
        next: ["I"]
    },
    {
        id: "I",
        next: ["H"]
    },
    {
        id: "F",
        next: ["K"]
    },
    {
        id: "K",
        next: ["L"]
    },
    {
        id: "H",
        next: ["L"]
    },
    {
        id: "L",
        next: ["P"]
    },
    {
        id: "P",
        next: ["M", "N"]
    },
    {
        id: "M",
        next: []
    },
    {
        id: "N",
        next: []
    }
];

export class ExampleBasic extends Component {
    render() {
        const { cellSize, padding } = this.props;
        return <DirectGraph list={graph} cellSize={cellSize} padding={padding} />;
    }
}
