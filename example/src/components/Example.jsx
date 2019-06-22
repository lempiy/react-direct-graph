import React, { Component } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";

export class Example extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showCode: false
        };
    }
    toggleCode = () => {
        this.setState({
            showCode: !this.state.showCode
        });
    };
    render() {
        const { example, title, code, description } = this.props;
        return (
            <section className="example">
                <h2>{title}</h2>
                <div
                    className="description"
                    dangerouslySetInnerHTML={{ __html: description }}
                />
                <button
                    className={this.state.showCode ? "hide-code" : "show-code"}
                    onClick={this.toggleCode}
                >
                    {this.state.showCode ? "Hide code" : "Show code"}
                </button>
                <SyntaxHighlighter
                    className={this.state.showCode ? "" : "hidden"}
                    language="jsx"
                    style={darcula}
                >
                    {code}
                </SyntaxHighlighter>
                <p>
                    <b>Output:</b>
                </p>
                {example}
            </section>
        );
    }
}
