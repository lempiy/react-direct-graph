import React, { Component } from "react";

import DirectGraph from "react-direct-graph";

const graph = [
    {
        id: "1",
        next: ["2"]
    },
    {
        id: "2",
        next: ["3", "4"]
    },
    {
        id: "3",
        next: ["5"]
    },
    {
        id: "6",
        next: []
    },
    {
        id: "7",
        next: ["4"]
    },
    {
        id: "4",
        next: ["8"]
    },
    {
        id: "8",
        next: ["9"]
    },
    {
        id: "10",
        next: ["11"]
    },
    {
        id: "11",
        next: ["12", "13"]
    },
    {
        id: "12",
        next: ["14"]
    },
    {
        id: "14",
        next: ["15", "16"]
    },
    {
        id: "15",
        next: ["17", "12"]
    },
    {
        id: "16",
        next: ["17"]
    },
    {
        id: "17",
        next: []
    },
    {
        id: "13",
        next: []
    },
    {
        id: "9",
        next: ["18"]
    },
    {
        id: "5",
        next: ["19"]
    },
    {
        id: "19",
        next: ["20"]
    },
    {
        id: "18",
        next: ["20"]
    },
    {
        id: "20",
        next: ["21", "6"]
    },
    {
        id: "21",
        next: ["21"]
    }
];

export class ExampleComplex extends Component {
    render() {
        const { cellSize, padding } = this.props;
        return <DirectGraph list={graph} cellSize={cellSize} padding={padding} />;
    }
}
