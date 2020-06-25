import React, { Component } from "react";

import { ExampleWithNames } from "./";
import { Example } from "../Example.jsx";

/* eslint import/no-webpack-loader-syntax: off */
const { default: exampleWithNamesCode } = require("!!raw-loader!./ExampleWithNames.jsx");

const cellSize = 100;
const padding = cellSize * 0.25;

export class WithNames extends Component {
    description = `<i>You can give the name of the nodes and edges.<br>
        Node object can has following additional properties:</i><br>
        <br>
        <b>name</b> - name of the node<br>
        <b>edgeNames</b> array of names - outcome edges`;

    render() {
        return (
            <Example
                code={exampleWithNamesCode}
                title={"Graph with names"}
                description={this.description}
            >
                <ExampleWithNames cellSize={cellSize} padding={padding} />
            </Example>
        );
    }
}
