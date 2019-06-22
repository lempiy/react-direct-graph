import React, { Component } from "react";

import DirectGraph from "react-direct-graph";

const graph = [
    {
        id: "A",
        next: ["B"]
    },
    {
        id: "B",
        next: ["C", "J"]
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
        next: ["H", "K"]
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
        next: ["N"]
    },
    {
        id: "L",
        next: ["P"]
    },
    {
        id: "P",
        next: ["M"]
    },
    {
        id: "M",
        next: []
    },
    {
        id: "N",
        next: ["P"]
    }
];

class CustomNodeIcon extends Component {
    getColor(node, incomes) {
        if (incomes && incomes.length > 1) return "#501570";
        if (node.next && node.next.length > 1) return "#501570";
        return "#169676";
    }
    renderText(id) {
        return (
            <g fill="#fff" stroke="#fff">
                <text
                    strokeWidth="1"
                    x="0"
                    y="0"
                    dx="256"
                    dy="310"
                    textAnchor="middle"
                    fontSize="160"
                >
                    {id}
                </text>
            </g>
        );
    }
    render() {
        const { node, incomes } = this.props;
        return (
            <svg version="1.1" x="0px" y="0px" viewBox="0 0 512 512">
                <path
                    style={{
                        fill: this.getColor(node, incomes),
                        stroke: this.getColor(node, incomes)
                    }}
                    d="M504.1,256C504.1,119,393,7.9,256,7.9C119,7.9,7.9,119,7.9,
                        256C7.9,393,119,504.1,256,504.1 C393,504.1,504.1,393,504.1,256z"
                />
                <path
                    fill="#FFFFFF"
                    d="
                    M416.2,275.3v-38.6l-36.6-11.5c-3.1-12.4-8-24.1-14.5-34.8l17.8-34.1L355.6,
                    129l-34.2,17.8c-10.6-6.4-22.2-11.2-34.6-14.3l-11.6-36.8h-38.7l-11.6,
                    36.8c-12.3,3.1-24,7.9-34.6,14.3L156.4,129L129,156.4l17.8,34.1
                    c-6.4,10.7-11.4,22.3-14.5,34.8l-36.6,11.5v38.6l36.4,
                    11.5c3.1,12.5,8,24.3,14.5,35.1L129,355.6l27.3,27.3l33.7-17.6
                    c10.8,6.5,22.7,11.5,35.3,14.6l11.4,36.2h38.7l11.4-36.2c12.6-3.1,
                    24.4-8.1,35.3-14.6l33.7,17.6l27.3-27.3l-17.6-33.8
                    c6.5-10.8,11.4-22.6,14.5-35.1L416.2,275.3z M256,340.8c-46.7,
                    0-84.6-37.9-84.6-84.6c0-46.7,37.9-84.6,84.6-84.6
                    c46.7,0,84.5,37.9,84.5,84.6C340.5,303,302.7,340.8,256,340.8z"
                />
                <g>{this.renderText(node.id)}</g>
            </svg>
        );
    }
}

export class ExampleCustom extends Component {
    render() {
        const { cellSize, padding } = this.props;
        return (
            <DirectGraph
                list={graph}
                cellSize={cellSize}
                padding={padding}
                component={CustomNodeIcon}
            />
        );
    }
}
