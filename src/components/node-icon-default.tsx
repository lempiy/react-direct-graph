import { GraphNodeIconComponentProps } from "./node-icon";
import { INodeInput } from "../core";
import * as React from "react";

export class DefaultNodeIcon<T> extends React.Component<
    GraphNodeIconComponentProps<T>
> {
    getColor(node: INodeInput<T>, incomes: INodeInput<T>[]): string {
        if (incomes && incomes.length > 1) return "#e25300";
        if (node.next && node.next.length > 1) return "#008c15";
        return "#193772";
    }
    render() {
        const { node, incomes } = this.props;
        return (
            <svg version="1.1" x="0px" y="0px" viewBox="0 0 52 52">
                <g>
                    <path
                        style={{
                            fill: this.getColor(node, incomes),
                            stroke: this.getColor(node, incomes)
                        }}
                        d="M40.824,52H11.176C5.003,52,0,46.997,0,40.824V11.176C0,5.003,5.003,0,11.176,0h29.649   C46.997,0,52,5.003,52,11.176v29.649C52,46.997,46.997,52,40.824,52z"
                    />
                    <g fill="#ffffff" stroke="#ffffff">
                        <text
                            strokeWidth="1"
                            x="0"
                            y="0"
                            dx="26"
                            dy="30"
                            textAnchor="middle"
                            fontSize="14px"
                        >
                            {node.id}
                        </text>
                    </g>
                </g>
            </svg>
        );
    }
}
