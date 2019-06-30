import * as React from "react";
import { IMatrixNode, AnchorMargin } from "../core";
import {
    VectorDirection,
    getVectorDirection,
    getEdgeMargins,
    getCellCenter,
    getCellEntry,
    uniqueId
} from "../utils";
import { GraphEventFunc, DataProps } from "./element.types";
import { DefaultMarker } from "./marker-default";

export type ViewProps<T> = {
    onEdgeMouseEnter?: GraphEventFunc<T>;
    onEdgeMouseLeave?: GraphEventFunc<T>;
    onEdgeClick?: GraphEventFunc<T>;
    cellSize: number;
    padding: number;
};

interface LineBranch<T> {
    node: IMatrixNode<T>;
    income: IMatrixNode<T>;
    line: number[][];
}

function getPointWithResolver<T>(
    direction: VectorDirection,
    cellSize: number,
    padding: number,
    item: IMatrixNode<T>,
    margin: AnchorMargin
): number[] {
    let x1, y1;
    if (item.isAnchor) {
        [x1, y1] = getCellCenter(cellSize, padding, item.x, item.y, margin);
    } else {
        [x1, y1] = getCellEntry(
            direction,
            cellSize,
            padding,
            item.x,
            item.y,
            margin
        );
    }
    return [x1, y1];
}

const pointResolversMap: { [key in VectorDirection]: VectorDirection[] } = {
    [VectorDirection.Top]: [VectorDirection.Top, VectorDirection.Bottom],
    [VectorDirection.Bottom]: [VectorDirection.Bottom, VectorDirection.Top],
    [VectorDirection.Right]: [VectorDirection.Right, VectorDirection.Left],
    [VectorDirection.Left]: [VectorDirection.Left, VectorDirection.Right]
};

export class GraphPolyline<T> extends React.Component<
    DataProps<T> & ViewProps<T>
> {
    getPolyline(
        cellSize: number,
        padding: number,
        branch: IMatrixNode<T>[]
    ): number[][] {
        return branch
            .filter((_, i) => {
                return i + 1 !== branch.length;
            })
            .reduce((result: number[][], node, i) => {
                const nextNode = branch[i + 1];
                const line = this.getLineToIncome(
                    cellSize,
                    padding,
                    node,
                    nextNode
                );
                const [x1, y1, x2, y2] = line.line;
                if (i === 0) {
                    result.push([x1, y1], [x2, y2]);
                } else {
                    result.push([x2, y2]);
                }
                return result;
            }, []);
    }
    getLineToIncome(
        cellSize: number,
        padding: number,
        node: IMatrixNode<T>,
        income: IMatrixNode<T>
    ) {
        const margins = getEdgeMargins(node, income);
        const direction = getVectorDirection(
            node.x,
            node.y,
            income.x,
            income.y
        );
        const [from, to] = pointResolversMap[direction];
        const [nodeMargin, incomeMargin] = margins;
        const [x1, y1] = getPointWithResolver(
            from,
            cellSize,
            padding,
            node,
            nodeMargin
        );
        const [x2, y2] = getPointWithResolver(
            to,
            cellSize,
            padding,
            income,
            incomeMargin
        );
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
        nodesMap: { [id: string]: IMatrixNode<T> }
    ): LineBranch<T>[] {
        const branches = this.getNodeBranches(node, nodesMap);
        return branches.map(branch => ({
            node: node,
            income: branch[branch.length - 1],
            line: this.getPolyline(cellSize, padding, branch)
        }));
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

    diveToNodeIncome = (
        node: IMatrixNode<T>,
        nodesMap: { [id: string]: IMatrixNode<T> }
    ): IMatrixNode<T> => {
        if (!node.isAnchor) return node;
        this.checkAnchorRenderIncomes(node);
        return this.diveToNodeIncome(nodesMap[node.renderIncomes[0]], nodesMap);
    };

    getNodeBranches = (
        node: IMatrixNode<T>,
        nodesMap: { [id: string]: IMatrixNode<T> }
    ): IMatrixNode<T>[][] => {
        return this.getAllIncomes(node, nodesMap).map(n => [
            node,
            ...this.getIncomeBranch(n, nodesMap)
        ]);
    };

    getIncomeBranch = (
        lastIncome: IMatrixNode<T>,
        nodesMap: { [id: string]: IMatrixNode<T> }
    ): IMatrixNode<T>[] => {
        const branch: IMatrixNode<T>[] = [];
        while (lastIncome.isAnchor) {
            this.checkAnchorRenderIncomes(lastIncome);
            branch.push(lastIncome);
            lastIncome = nodesMap[lastIncome.renderIncomes[0]];
        }
        branch.push(lastIncome);
        return branch;
    };

    checkAnchorRenderIncomes(node: IMatrixNode<T>) {
        if (node.renderIncomes.length != 1)
            throw new Error(
                `Anchor has non 1 income: ${
                    node.id
                }. Incomes ${node.renderIncomes.join(",")}`
            );
    }

    getAllIncomes = (
        node: IMatrixNode<T>,
        nodesMap: { [id: string]: IMatrixNode<T> }
    ): IMatrixNode<T>[] => node.renderIncomes.map(id => nodesMap[id]);

    getLineHandlers(
        node: IMatrixNode<T>,
        income: IMatrixNode<T>
    ): { [eventName: string]: (e: React.MouseEvent) => void } {
        const { onEdgeClick, onEdgeMouseEnter, onEdgeMouseLeave } = this.props;
        const handlers: {
            [eventName: string]: (e: React.MouseEvent) => void;
        } = {};
        if (onEdgeClick)
            handlers.onClick = this.wrapEventHandler(onEdgeClick, node, [
                income
            ]);
        if (onEdgeMouseEnter)
            handlers.onMouseEnter = this.wrapEventHandler(
                onEdgeMouseEnter,
                node,
                [income]
            );
        if (onEdgeMouseLeave)
            handlers.onMouseLeave = this.wrapEventHandler(
                onEdgeMouseLeave,
                node,
                [income]
            );
        return handlers;
    }

    getMarker(markerHash: string, incomeId: string): { [key: string]: string } {
        const markerId = this.getMarkerId(markerHash, incomeId);
        return markerId ? { markerEnd: `url(#${markerId})` } : {};
    }

    getMarkerId(markerHash: string, incomeId: string): string {
        const { node } = this.props;
        return `${markerHash}-${node.id.trim()}-${incomeId.trim()}`;
    }

    renderLines(node: IMatrixNode<T>, lines: LineBranch<T>[]) {
        const markerHash = uniqueId("marker-");
        return lines.map(line => (
            <g
                key={`line-${node.id}-${line.income.id}`}
                {...this.getLineHandlers(line.node, line.income)}
                style={{
                    strokeWidth: 2,
                    fill: "#2d578b",
                    stroke: "#2d578b"
                }}
            >
                <DefaultMarker
                    id={this.getMarkerId(markerHash, line.income.id)}
                    width={12}
                    height={12}
                />
                <polyline
                    {...this.getMarker(markerHash, line.income.id)}
                    fill={"none"}
                    className="node-line"
                    points={line.line
                        .reverse()
                        .map(point => point.join(","))
                        .join(" ")}
                />
            </g>
        ));
    }

    render() {
        const { node, nodesMap, cellSize, padding } = this.props;
        const lines = this.getLines(cellSize, padding, node, nodesMap);
        return (
            lines.length && (
                <g className="line-group">{this.renderLines(node, lines)}</g>
            )
        );
    }
}
