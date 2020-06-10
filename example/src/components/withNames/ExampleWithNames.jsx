import React, { Component } from "react";

import DirectGraph from "react-direct-graph";

const graph = [
    {
        id: "A",
        next: ["B"],
        name: "Node A",
        edgeNames: ["Edge AB"]
    },
    {
        id: "B",
        next: ["C", "D", "E"],
        name: "Node B",
        edgeNames: ["Edge BC", "Edge BD", "Edge BE"]
    },
    {
        id: "C",
        next: ["F"],
        name: "Node C",
        edgeNames: ["Edge CF"]
    },
    {
        id: "D",
        next: ["J"],
        name: "Node D",
        edgeNames: ["Edge DJ"]
    },
    {
        id: "E",
        next: ["J"],
        name: "Node E",
        edgeNames: ["Edge EJ"]
    },
    {
        id: "J",
        next: ["I"],
        name: "Node J",
        edgeNames: ["Edge JI"]
    },
    {
        id: "I",
        next: ["H"],
        name: "Node I",
        edgeNames: ["Edge IH"]
    },
    {
        id: "F",
        next: ["K"],
        name: "Node F",
        edgeNames: ["Edge FK"]
    },
    {
        id: "K",
        next: ["L"],
        name: "Node K",
        edgeNames: ["Edge KL"]
    },
    {
        id: "H",
        next: ["L"],
        name: "Node H",
        edgeNames: ["Edge HL"]
    },
    {
        id: "L",
        next: ["P"],
        name: "Node L",
        edgeNames: ["Edge LP"]
    },
    {
        id: "P",
        next: ["M", "N"],
        name: "Node P",
        edgeNames: ["Edge PM", "Edge PN"]
    },
    {
        id: "M",
        next: [],
        name: "Node M"
    },
    {
        id: "N",
        next: [],
        name: "Node N"
    }
];

export class ExampleWithNames extends Component {
    render() {
        const { cellSize, padding } = this.props;
        return (
            <div style={{ 'font-size': '11px ' }}>
                <DirectGraph list={graph} cellSize={cellSize} padding={padding} />;
            </div>
        )
    }
}
