import * as React from "react";
import { DefaultMarker } from "../marker-default";
import { getPointWithResolver } from "./getPointWithResolver";
import {
    getSize,
    uniqueId,
    getCoords,
    getAllIncomes,
    getEdgeMargins,
    wrapEventHandler,
    getVectorDirection,
    checkAnchorRenderIncomes,
} from "../../utils";
import { IMatrixNode } from "../../core";
import { DataProps } from "../element";
import { LineBranch, pointResolversMap, ViewProps } from "./polyline.types";

export class GraphPolyline<T> extends React.Component<
    DataProps<T> & ViewProps<T>
> {
    getPolyline = (
        cellSize: number,
        padding: number,
        branch: IMatrixNode<T>[]
    ): number[][] => branch
        .filter((_, i) => (i + 1) !== branch.length)
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

    getLines = (
        cellSize: number,
        padding: number,
        node: IMatrixNode<T>,
        nodesMap: { [id: string]: IMatrixNode<T> }
    ): LineBranch<T>[] => this.getNodeBranches(node, nodesMap).map(branch => ({
        node: node,
        income: branch[branch.length - 1],
        line: this.getPolyline(cellSize, padding, branch)
    }));

    getNodeBranches = (
        node: IMatrixNode<T>,
        nodesMap: { [id: string]: IMatrixNode<T> }
    ): IMatrixNode<T>[][] => getAllIncomes<T>(node, nodesMap).map(n => [
        node,
        ...this.getIncomeBranch(n, nodesMap)
    ]);

    getIncomeBranch = (
        lastIncome: IMatrixNode<T>,
        nodesMap: { [id: string]: IMatrixNode<T> }
    ): IMatrixNode<T>[] => {
        const branch: IMatrixNode<T>[] = [];
        while (lastIncome.isAnchor) {
            checkAnchorRenderIncomes<T>(lastIncome);
            branch.push(lastIncome);
            lastIncome = nodesMap[lastIncome.renderIncomes[0]];
        }
        branch.push(lastIncome);
        return branch;
    };

    getLineHandlers(
        node: IMatrixNode<T>,
        income: IMatrixNode<T>
    ): { [eventName: string]: (e: React.MouseEvent) => void } {
        const { onEdgeClick, onEdgeMouseEnter, onEdgeMouseLeave } = this.props;
        const handlers: {
            [eventName: string]: (e: React.MouseEvent) => void;
        } = {};
        if (onEdgeClick)
            handlers.onClick = wrapEventHandler<T>(onEdgeClick, node, [
                income
            ]);
        if (onEdgeMouseEnter)
            handlers.onMouseEnter = wrapEventHandler<T>(
                onEdgeMouseEnter,
                node,
                [income]
            );
        if (onEdgeMouseLeave)
            handlers.onMouseLeave = wrapEventHandler<T>(
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

    getLineNameCoords(income: IMatrixNode<T>): number[] {
        const { node, node: {id}, cellSize, padding } = this.props;
        const index = income.next.findIndex(uuid => uuid === id);

        const [, nodeY] = getCoords<T>(cellSize, padding, node);
        const [x, incomeY] = getCoords<T>(cellSize, padding, income);

        let y = nodeY;
        if (incomeY > nodeY) {
            y = incomeY;
        }
        if (incomeY === nodeY) {
            y = y + cellSize * index;
        }

        return [x, y];
    };

    getLineComponentCoords(income: IMatrixNode<T>): number[] {
        const { node, node: {id}, cellSize, padding } = this.props;
        const index = income.next.findIndex(uuid => uuid === id);

        const [nodeX, nodeY] = getCoords<T>(cellSize, padding, node);
        const [incomeX, incomeY] = getCoords<T>(cellSize, padding, income);

        const x = incomeX/2 + nodeX/2;

        let y = nodeY;
        if (incomeY > nodeY) {
            y = incomeY;
        }
        if (incomeY === nodeY) {
            y = y + cellSize * index;
        }

        return [x, y];
    };

    lineComponent(income: IMatrixNode<T>) {
        const { cellSize, padding, edgeComponent } = this.props;
        const [x, y] = this.getLineComponentCoords(income);
        const size = getSize(cellSize, padding);

        if (!edgeComponent) {
            return null;
        }

        const Component = edgeComponent;
        return (
            <foreignObject
                className="edge-icon"
                x={x + size * 0.5 - cellSize * 0.1}
                y={y + size * 0.5 - cellSize * 0.1}
                width={cellSize * 0.2}
                height={cellSize * 0.2}
                style={{ display: "none" }}
            >
                <Component />
            </foreignObject>
        );
    }

    lineName(income: IMatrixNode<T>) {
        const { node: {id}, cellSize, padding } = this.props;
        const { next, edgeNames = [] } = income;

        const [nameX, nameY] = this.getLineNameCoords(income);
        const [circleX, circleY] = this.getLineComponentCoords(income);
        const size = getSize(cellSize, padding);
        const index = next.findIndex(uuid => uuid === id);
        return (
            <>
                <circle
                    cx={circleX + size * 0.5}
                    cy={circleY + size * 0.5}
                    r={cellSize * 0.15}
                    style={{
                        stroke: "none",
                        fill: "fff",
                        opacity: 0.01
                    }}
                />
                {!!edgeNames[index] && (
                    <text
                        x={nameX + size * 1.5}
                        y={nameY + size * 0.3}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{
                            stroke: "#fff",
                            strokeWidth: 3,
                            fill: "#2d578b",
                            paintOrder: "stroke"
                        }}
                    >
                        {edgeNames[index]}
                    </text>
                )}
            </>
        )
    }

    getLinePoints = (line: LineBranch<T>): string => line.line
        .map(point => point.join(","))
        .reverse()
        .join(" ");

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
                {this.lineName(line.income)}
                <DefaultMarker
                    id={this.getMarkerId(markerHash, line.income.id)}
                    width={12}
                    height={12}
                />
                <polyline
                    fill={"none"}
                    className="node-line"
                    points={this.getLinePoints(line)}
                    style={{
                        strokeWidth: 6,
                        stroke: "#ffffff"
                    }}
                />
                <polyline
                    {...this.getMarker(markerHash, line.income.id)}
                    fill={"none"}
                    className="node-line"
                    points={this.getLinePoints(line)}
                />
                {this.lineComponent(line.income)}
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
