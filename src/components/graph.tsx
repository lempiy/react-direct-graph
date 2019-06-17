import * as React from "react";
import { IMatrixNode } from "../core";
import { GraphElement, ViewProps } from "./element";

export type Props<T> = {
    nodesMap: { [id: string]: IMatrixNode<T> };
    sellSize: number;
    padding: number;
    widthInCells: number;
    heightInCells: number;
};

interface INodeElementInput<T> {
    node: IMatrixNode<T>;
    incomes: IMatrixNode<T>[];
}

export class Graph<T> extends React.Component<Props<T> & ViewProps<T>> {
    getNodeElementInputs = (nodesMap: {
        [id: string]: IMatrixNode<T>;
    }): INodeElementInput<T>[] => {
        return Object.entries(nodesMap).map(([_, node]) => ({
            node,
            incomes: node.renderIncomes.map(id => nodesMap[id])
        }));
    };
    render() {
        const {
            nodesMap,
            sellSize,
            padding,
            widthInCells,
            heightInCells,
            ...restProps
        } = this.props;
        const elements = this.getNodeElementInputs(nodesMap);

        return (
            <svg
                version="1"
                width={widthInCells * sellSize}
                height={heightInCells * sellSize}
            >
                {elements.map(props => (
                    <GraphElement
                        key={props.node.id}
                        sellSize={sellSize}
                        padding={padding}
                        {...props}
                        {...restProps}
                    />
                ))}
            </svg>
        );
    }
}
