import * as React from "react"
import { IMatrixNode } from "../core"
import { GraphElement, ViewProps } from "./element"

export type Props<T> = {
    nodesMap: { [id: string]: IMatrixNode<T> }
    cellSize: number
    padding: number
    widthInCells: number
    heightInCells: number
}

interface INodeElementInput<T> {
    node: IMatrixNode<T>
    incomes: IMatrixNode<T>[]
}

export class Graph<T> extends React.Component<Props<T> & ViewProps<T>> {
    getNodeElementInputs = (nodesMap: {
        [id: string]: IMatrixNode<T>
    }): INodeElementInput<T>[] => {
        return Object.entries(nodesMap).map(([_, node]) => ({
            node,
            incomes: node.renderIncomes.map(id => nodesMap[id])
        }))
    }
    renderElements() {
        const {
            nodesMap,
            cellSize,
            padding,
            widthInCells,
            heightInCells,
            ...restProps
        } = this.props
        const elements = this.getNodeElementInputs(nodesMap)
        return (
            elements.map(props => (
                <GraphElement
                    key={props.node.id}
                    cellSize={cellSize}
                    padding={padding}
                    {...props}
                    {...restProps}
                />
            ))
        )
    }
    render() {
        const {
            cellSize,
            widthInCells,
            heightInCells
        } = this.props
        return (
            <svg
                version="1"
                width={widthInCells * cellSize}
                height={heightInCells * cellSize}
            >
                {
                    this.renderElements()
                }
            </svg>
        )
    }
}
