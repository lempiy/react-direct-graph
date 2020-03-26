import * as React from "react";
import { IMatrixNode } from "../core";
import { GraphNodeIconComponentProps } from "./node-icon";
import { DefaultNodeIcon } from "./node-icon-default";
import { withForeignObject } from "./with-foreign-object";
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
    getCoords(
        cellSize: number,
        padding: number,
        node: IMatrixNode<T>
    ): number[] {
        return [node.x * cellSize + padding, node.y * cellSize + padding];
    }

    getSize(cellSize: number, padding: number): number {
        return cellSize - padding * 2;
    }

    wrapEventHandler = (
        cb: GraphEventFunc<T>,
        node: IMatrixNode<T>,
        incomes: IMatrixNode<T>[]
    ): ((e: React.MouseEvent) => void) => {
        return (e: React.MouseEvent) => cb(e, node, incomes);
    };

    diveToNodeIncome = (
        node: IMatrixNode<T>,
        nodesMap: { [id: string]: IMatrixNode<T> }
    ): IMatrixNode<T> => {
        if (!node.isAnchor) return node;
        this.checkAnchorRenderIncomes(node);
        return this.diveToNodeIncome(nodesMap[node.renderIncomes[0]], nodesMap);
    };

    checkAnchorRenderIncomes(node: IMatrixNode<T>) {
        if (node.renderIncomes.length != 1)
            throw new Error(
                `Anchor has non 1 income: ${
                    node.id
                }. Incomes ${node.renderIncomes.join(",")}`
            );
    }

    getNodeIncomes = (
        node: IMatrixNode<T>,
        nodesMap: { [id: string]: IMatrixNode<T> }
    ): IMatrixNode<T>[] => {
        return this.getAllIncomes(node, nodesMap).map(n =>
            this.diveToNodeIncome(n, nodesMap)
        );
    };

    getAllIncomes = (
        node: IMatrixNode<T>,
        nodesMap: { [id: string]: IMatrixNode<T> }
    ): IMatrixNode<T>[] => node.renderIncomes.map(id => nodesMap[id]);

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
            handlers.onClick = this.wrapEventHandler(
                onNodeClick,
                node,
                incomes
            );
        if (onNodeMouseEnter)
            handlers.onMouseEnter = this.wrapEventHandler(
                onNodeMouseEnter,
                node,
                incomes
            );
        if (onNodeMouseLeave)
            handlers.onMouseLeave = this.wrapEventHandler(
                onNodeMouseLeave,
                node,
                incomes
            );
        return handlers;
    }

    renderNode() {
        const { node, nodesMap, cellSize, padding } = this.props;
        const [x, y] = this.getCoords(cellSize, padding, node);
        const size = this.getSize(cellSize, padding);
        const NodeIcon = withForeignObject<GraphNodeIconComponentProps<T>>(
            this.props.component ? this.props.component : DefaultNodeIcon
        );
        const incomes = this.getNodeIncomes(node, nodesMap);
        return (
            !node.isAnchor && (
                <g className="node-icon-group" {...this.getNodeHandlers()}>
                    <NodeIcon
                        x={x}
                        y={y}
                        height={size}
                        width={size}
                        node={node}
                        incomes={incomes}
                    />
                    {!!node.name && (
                        <text
                            x={x + size * 0.5}
                            y={y + size * 1.2}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            style={{
                                stroke: "none",
                                fill: "#2d578b"
                            }}
                        >
                            {node.name}
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
