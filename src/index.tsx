/**
 * @class DirectGraph
 */

import * as React from "react";
import { INodeInput, IMatrixNode, Graph } from "./core";
import { Graph as GraphView, ViewProps } from "./components";

export type Props<T> = {
    list: INodeInput<T>[];
    sellSize: number;
    padding: number;
};

type GraphViewData<T> = {
    nodesMap: { [id: string]: IMatrixNode<T> };
    widthInCells: number;
    heightInCells: number;
};

export default class DirectGraph<T> extends React.Component<
    Props<T> & ViewProps<T>
> {
    getNodesMap = (list: INodeInput<T>[]): GraphViewData<T> => {
        const graph = new Graph(list);
        const mtx = graph.traverse();
        return {
            nodesMap: mtx.normalize(),
            widthInCells: mtx.width,
            heightInCells: mtx.height
        };
    };

    render() {
        const { list, ...viewProps } = this.props;
        const dataProps = this.getNodesMap(list);

        return <GraphView {...dataProps} {...viewProps} />;
    }
}
