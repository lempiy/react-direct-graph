import React, { Component } from "react";

import { ExampleCustom } from "./";
import { Example } from "../Example.jsx";

/* eslint import/no-webpack-loader-syntax: off */
const exampleCustomCode = require("!!raw-loader!./ExampleCustom.jsx");

const cellSize = 100;
const padding = cellSize * 0.25;

export class Custom extends Component {
    exampleComponent() {
        return <ExampleCustom cellSize={cellSize} padding={padding} />;
    }
    description = `<i>You can specify custom component for icon of graph elements using "component" prop.<br>
        Custom icon component receives following props:</i><br>
        <br>
        <b>node</b> - graph node<br>
        <b>incomes</b> - incomes of graph node or empty array if node is root`;
    render() {
        return (
            <Example
                code={exampleCustomCode.default}
                example={this.exampleComponent()}
                title={"Graph Custom"}
                description={this.description}
            />
        );
    }
}
