import { GraphNodeIconComponentProps } from "./node-icon";
import { INodeInput } from "../core";
import * as React from "react";
import styles from "./node-icon-default.css";

export class DefaultNodeIcon<T> extends React.Component<
    GraphNodeIconComponentProps<T>
> {
    getClass(node: INodeInput<T>, incomes: INodeInput<T>[]): string {
        if (incomes && incomes.length > 1) return styles.nodeOrange;
        if (node.next && node.next.length > 1) return styles.nodeGreen;
        return styles.nodeBlue;
    }
    renderText(id: string) {
        return (
            <g>
                <text
                    strokeWidth="1"
                    x="0"
                    y="0"
                    dx="26"
                    dy="30"
                    textAnchor="middle"
                >
                    {id}
                </text>
            </g>
        );
    }
    render() {
        const { node, incomes } = this.props;
        return (
            <svg
                version="1.1"
                x="0px"
                y="0px"
                viewBox="0 0 52 52"
                className={styles.nodeDefaultIcon}
            >
                <g
                    className={`node-icon-default ${
                        styles.nodeDefaultIconGroup
                    } ${this.getClass(node, incomes)}`}
                >
                    <path d="M40.824,52H11.176C5.003,52,0,46.997,0,40.824V11.176C0,5.003,5.003,0,11.176,0h29.649   C46.997,0,52,5.003,52,11.176v29.649C52,46.997,46.997,52,40.824,52z" />
                    {this.renderText(node.id)}
                </g>
            </svg>
        );
    }
}
