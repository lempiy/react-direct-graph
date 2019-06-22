import React, { Component } from "react";

import { ExampleBasic, exampleBasicCode } from "./";
import { Example } from "../Example.jsx";

const cellSize = 100;
const padding = cellSize * 0.25;

export class Basic extends Component {
    exampleComponent() {
        return <ExampleBasic cellSize={cellSize} padding={padding} />;
    }
    description = `<i>Basic graph rendering requires array of nodes, dimensions of cell and padding of node icon as props.<br>
        Node object should has following properties:</i><br>
        <br>
        <b>id</b> - unique identifier of the node<br>
        <b>next</b> array of id's - node outcomes<br>
        <b>payload</b> some additional data to hold in`;
    render() {
        return (
            <Example
                code={exampleBasicCode}
                example={this.exampleComponent()}
                title={"Graph Basic"}
                description={this.description}
            />
        );
    }
}
