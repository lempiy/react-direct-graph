import * as React from "react";
import { GraphNodeIconComponentProps, DefaultNodeIcon } from "../node-icon";
import { withForeignObject } from "../with-foreign-object";
import {
    getSize,
    getCoords,
    getAllIncomes,
    wrapEventHandler,
    checkAnchorRenderIncomes
} from "../../utils";
import { IMatrixNode } from "../../core";
import { GraphEventFunc, DataProps } from "./element.types";

export type ViewProps<T> = {
    component?: React.ComponentType<GraphNodeIconComponentProps<T>>;
    onNodeMouseEnter?: GraphEventFunc<T>;
    onNodeMouseLeave?: GraphEventFunc<T>;
    onNodeClick?: GraphEventFunc<T>;
    cellSize: number;
    padding: number;
};

export class GraphElement<T> extends React.Component<
    DataProps<T> & ViewProps<T>
> {
    diveToNodeIncome = (
        node: IMatrixNode<T>,
        nodesMap: { [id: string]: IMatrixNode<T> }
    ): IMatrixNode<T> => {
        if (!node.isAnchor) return node;
        checkAnchorRenderIncomes<T>(node);
        return this.diveToNodeIncome(nodesMap[node.renderIncomes[0]], nodesMap);
    };

    getNodeIncomes = (
        node: IMatrixNode<T>,
        nodesMap: { [id: string]: IMatrixNode<T> }
    ): IMatrixNode<T>[] => getAllIncomes<T>(node, nodesMap).map(n =>
        this.diveToNodeIncome(n, nodesMap)
    );

    getNodeHandlers(): { [eventName: string]: (e: React.MouseEvent) => void } {
        const {
            node,
            nodesMap,
            onNodeClick,
            onNodeMouseEnter,
            onNodeMouseLeave
        } = this.props;
        const incomes = this.getNodeIncomes(node, nodesMap);
        const handlers: {
            [eventName: string]: (e: React.MouseEvent) => void;
        } = {};
        if (onNodeClick)
            handlers.onClick = wrapEventHandler<T>(
                onNodeClick,
                node,
                incomes
            );
        if (onNodeMouseEnter)
            handlers.onMouseEnter = wrapEventHandler<T>(
                onNodeMouseEnter,
                node,
                incomes
            );
        if (onNodeMouseLeave)
            handlers.onMouseLeave = wrapEventHandler<T>(
                onNodeMouseLeave,
                node,
                incomes
            );
        return handlers;
    }

    renderNode() {
        const { node, node: { isAnchor, name, nameOrientation = "bottom" }, nodesMap, cellSize, padding } = this.props;
        const [x, y] = getCoords<T>(cellSize, padding, node);
        const size = getSize(cellSize, padding);
        const NodeIcon = withForeignObject<GraphNodeIconComponentProps<T>>(
            this.props.component ? this.props.component : DefaultNodeIcon
        );
        const incomes = this.getNodeIncomes(node, nodesMap);
        const textY = nameOrientation === "top"
            ? y - size * 0.2
            : y + size * 1.2;
        return (
            !isAnchor && (
                <g className="node-icon-group" {...this.getNodeHandlers()}>
                    <NodeIcon
                        x={x}
                        y={y}
                        height={size}
                        width={size}
                        node={node}
                        incomes={incomes}
                    />
                    {!!name && (
                        <text
                            x={x + size * 0.5}
                            y={textY}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            style={{
                                stroke: "#fff",
                                strokeWidth: 3,
                                fill: "#2d578b",
                                paintOrder: "stroke"
                            }}
                        >
                            {name}
                        </text>
                    )}
                </g>
            )
        );
    }

    render() {
        return (
            <g
                className="node-group"
                style={{
                    strokeWidth: 2,
                    fill: "#ffffff",
                    stroke: "#2d578b"
                }}
            >
                {this.renderNode()}
            </g>
        );
    }
}
