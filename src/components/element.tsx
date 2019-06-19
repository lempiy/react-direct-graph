import * as React from "react";
import { IMatrixNode } from "../core";
import {
    VectorDirection,
    getVectorDirection,
    getCellCenter,
    getCellTopEntry,
    getCellBottomEntry,
    getCellRightEntry,
    getCellLeftEntry
} from "../utils";
import { GraphNodeIconComponentProps } from "./node-icon";
import { DefaultNodeIcon } from "./node-icon-default";
import { withForeignObject } from "./with-foreign-object";

export type GraphEventFunc<T> = (
    event: React.MouseEvent,
    node: IMatrixNode<T>,
    incomes: IMatrixNode<T>[]
) => void;

export type ViewProps<T> = {
    component?: React.ComponentType<GraphNodeIconComponentProps<T>>;
    onNodeMouseEnter?: GraphEventFunc<T>;
    onNodeMouseLeave?: GraphEventFunc<T>;
    onEdgeMouseEnter?: GraphEventFunc<T>;
    onEdgeMouseLeave?: GraphEventFunc<T>;
    onNodeClick?: GraphEventFunc<T>;
    onEdgeClick?: GraphEventFunc<T>;
    cellSize: number;
    padding: number;
};

export type DataProps<T> = {
    node: IMatrixNode<T>;
    incomes: IMatrixNode<T>[];
};

type pointResolver = (cellSize: number, padding: number, x:number, y:number) => number[]
function getPointWithResolver <T>(resolver: pointResolver, cellSize: number, padding: number, item: IMatrixNode<T>):number[] {
    let x1, y1;
    if (item.isAnchor) {
        [x1, y1] = getCellCenter(cellSize, item.x, item.y);
    } else {
        [x1, y1] = resolver(
            cellSize,
            padding,
            item.x,
            item.y
        );
    }
    console.log(x1, y1, cellSize, padding)
    return [x1, y1]
}

const pointResolversMap: {[key in VectorDirection]:pointResolver[]} = {
    [VectorDirection.Top]: [getCellTopEntry, getCellBottomEntry],
    [VectorDirection.Bottom]: [getCellBottomEntry, getCellTopEntry],
    [VectorDirection.Right]: [getCellRightEntry, getCellLeftEntry],
    [VectorDirection.Left]: [getCellLeftEntry, getCellRightEntry],
}

export class GraphElement<T> extends React.Component<
    DataProps<T> & ViewProps<T>
> {
    getLineToIncome(
        cellSize: number,
        padding: number,
        node: IMatrixNode<T>,
        income: IMatrixNode<T>
    ) {
        const direction = getVectorDirection(
            node.x,
            node.y,
            income.x,
            income.y
        );
        const [from, to] = pointResolversMap[direction]
        const [x1, y1] = getPointWithResolver(from, cellSize, padding, node)
        const [x2, y2] = getPointWithResolver(to, cellSize, padding, income)
        return {
            node,
            income,
            line: [x1, y1, x2, y2]
        };
    }

    getLines(
        cellSize: number,
        padding: number,
        node: IMatrixNode<T>,
        incomes: IMatrixNode<T>[]
    ) {
        return node.isAnchor
            ? incomes.map(income =>
                  this.getLineToIncome(cellSize, padding, income, node)
              )
            : incomes.map(income =>
                  this.getLineToIncome(cellSize, padding, node, income)
              );
    }

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

    renderNode() {
        const {
            node,
            incomes,
            cellSize,
            padding,
            onNodeClick,
            onNodeMouseEnter,
            onNodeMouseLeave,
        } = this.props;
        const [x, y] = this.getCoords(cellSize, padding, node);
        const size = this.getSize(cellSize, padding);
        const NodeIcon = withForeignObject<GraphNodeIconComponentProps<T>>(
            this.props.component ? this.props.component : DefaultNodeIcon
        );

        return (
            !node.isAnchor && (
                <g
                    className="node-icon-group"
                    {...{
                        onClick:
                            onNodeClick &&
                            this.wrapEventHandler(
                                onNodeClick,
                                node,
                                incomes
                            ),
                        onMouseEnter:
                            onNodeMouseEnter &&
                            this.wrapEventHandler(
                                onNodeMouseEnter,
                                node,
                                incomes
                            ),
                        onMouseLeave:
                            onNodeMouseLeave &&
                            this.wrapEventHandler(
                                onNodeMouseLeave,
                                node,
                                incomes
                            )
                    }}
                >
                    <NodeIcon
                        x={x}
                        y={y}
                        height={size}
                        width={size}
                        node={node}
                        incomes={incomes}
                    />
                </g>
            )
        )
    }

    renderLines() {
        const {
            node,
            incomes,
            cellSize,
            padding,
            onEdgeClick,
            onEdgeMouseEnter,
            onEdgeMouseLeave
        } = this.props;
        const lines = this.getLines(cellSize, padding, node, incomes);
        return (
            lines.map(l => (
                <line
                    {...{
                        onClick:
                            onEdgeClick &&
                            this.wrapEventHandler(onEdgeClick, l.node, [
                                l.income
                            ]),
                        onMouseEnter:
                            onEdgeMouseEnter &&
                            this.wrapEventHandler(
                                onEdgeMouseEnter,
                                l.node,
                                [l.income]
                            ),
                        onMouseLeave:
                            onEdgeMouseLeave &&
                            this.wrapEventHandler(
                                onEdgeMouseLeave,
                                l.node,
                                [l.income]
                            )
                    }}
                    key={`line-${node.id}-${l.income.id}`}
                    className="node-line"
                    x1={l.line[0]}
                    y1={l.line[1]}
                    x2={l.line[2]}
                    y2={l.line[3]}
                />
            ))
        )
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
                {this.renderLines()}
            </g>
        );
    }
}
