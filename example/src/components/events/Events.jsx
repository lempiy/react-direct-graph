import React, { Component } from "react";

import { ExampleEvents } from "./";
import { Example } from "../Example.jsx";

/* eslint import/no-webpack-loader-syntax: off */
const { default: exampleEventsCode } = require("!!raw-loader!./ExampleEvents.jsx");

const cellSize = 100;
const padding = cellSize * 0.25;

export class Events extends Component {
    description = `<i>It's possible to handle mouse events on nodes and edges.<br>All event handlers recieve three arguments:</i><br>
        <br>
        <b>event</b> React synthetic event<br>
        <b>node</b> node object bound to event target<br>
        <b>incomes</b> incomes of bound event object<br>
        <br>
        <i>Following event handlers available:</i><br>
        <br>
        <b>onNodeClick</b> - click on node<br>
        <b>onEdgeClick</b> - click on edge<br>
        <b>onNodeMouseEnter</b> - mouseenter on node<br>
        <b>onNodeMouseLeave</b> - mouseleave on node<br>
        <b>onEdgeMouseEnter</b> - mouseenter on edge<br>
        <b>onEdgeMouseLeave</b> - mouseleave on edge<br>`;

    render() {
        return (
            <Example
                code={exampleEventsCode}
                title={"Graph Events"}
                description={this.description}
            >
                <ExampleEvents cellSize={cellSize} padding={padding} />
            </Example>
        );
    }
}
