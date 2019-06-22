import React, { Component } from "react";

import { ExampleCustom, exampleCustomCode } from "./";
import { Example } from "../Example.jsx";

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
                code={exampleCustomCode}
                example={this.exampleComponent()}
                title={"Graph Custom"}
                description={this.description}
            />
        );
    }
}
