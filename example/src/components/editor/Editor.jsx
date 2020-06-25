import React, { Component } from "react";

import { ExampleEdit } from "./";
import { Example } from "../Example.jsx";

/* eslint import/no-webpack-loader-syntax: off */
const { default: exampleEditCode } = require("!!raw-loader!./ExampleEdit.jsx");

const cellSize = 100;
const padding = cellSize * 0.25;

export class Editor extends Component {
    description = `<i>Taking advantage of graph rendering loop and event listeners it's possible to create graph editor</i>.<br>
        <br>
        <b>Click</b> on edge to insert node<br>
        <b>Click</b> on node to delete node<br>
        <b>Shift+Click</b> on two node to create new edge`;

    render() {
        return (
            <Example
                code={exampleEditCode}
                title={"Graph Editor"}
                description={this.description}
            >
                <ExampleEdit cellSize={cellSize} padding={padding} />
            </Example>
        );
    }
}
