import React, { Component } from "react";

import { ExampleComplex } from "./";
import { Example } from "../Example.jsx";

/* eslint import/no-webpack-loader-syntax: off */
const { default: exampleComplexCode } = require("!!raw-loader!./ExampleComplex.jsx");

const cellSize = 100;
const padding = cellSize * 0.25;

export class Complex extends Component {
    description = `<i>Library renders graphs with any complexity.<br>
        Supported features:</i><br>
        <br>
        <b>loops</b> - backward references between nodes<br>
        <b>split-joins</b> - nodes with more then one income and outcome<br>
        <b>multigraphs</b> - multiple graphs in one view and graphs with more then one root`;

    render() {
        return (
            <Example
                code={exampleComplexCode}
                title={"Complex graphs"}
                description={this.description}
            >
                <ExampleComplex cellSize={cellSize} padding={padding} />
            </Example>
        );
    }
}
