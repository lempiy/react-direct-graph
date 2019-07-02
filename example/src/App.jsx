import React, { Component } from "react";

import { Editor, Basic, Complex, Custom, Events, Title } from "./components";
const cellSize = 130;
const padding = cellSize * 0.125;
export default class App extends Component {
    render() {
        return (
            <main>
                {/* <Title cellSize={cellSize} padding={padding} />
                <h1>Examples</h1>
                <Basic /> */}
                <Custom />
                {/* <Complex />
                <Events />
                <Editor /> */}
            </main>
        );
    }
}
