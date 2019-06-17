import React, {
    Component
} from 'react'

import DirectGraph from 'react-direct-graph'
import graph from './graph'

const sellSize = 150
const padding = sellSize * 0.25

export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            graph
        }
    }
    onNodeClick = (event, node, incomes) => {
        alert(`Clicked on node ${node.id}`)
    }
    onEdgeMouseEnter = (event, node, incomes) => {
        event.currentTarget.style.stroke = "#f00"
    }
    onEdgeMouseLeave = (event, node, incomes) => {
        event.currentTarget.style.stroke = null
    }
    onEdgeClick = (event, node, incomes) => {
        let income = incomes[0]
        if (node.isAnchor) {
            const {
                anchorFrom,
                anchorTo
            } = node;
            node = this.state.graph.find(n => n.id === anchorTo)
            income = this.state.graph.find(n => n.id === anchorFrom)
        }
        if (income.isAnchor) {
            const {
                anchorFrom,
                anchorTo
            } = income;
            node = this.state.graph.find(n => n.id === anchorTo)
            income = this.state.graph.find(n => n.id === anchorFrom)
        }
        const newId = window.prompt(`Insert new node between ${income.id} and ${node.id}: Use id:`)
        if (!newId) return
        const nodeIndex = this.state.graph.findIndex(n => n.id === node.id)
        const inc = this.state.graph.find(n => n.id === income.id)
        const newGraph = [
            ...this.state.graph
        ]
        newGraph.splice(nodeIndex, 0, {
            id: newId,
            next: [node.id],
            payload: {
                exist: true
            }
        })
        const i = inc.next.findIndex(outcomeId => outcomeId === node.id)
        inc.next.splice(i, 1, newId)
        this.setState({
            graph: newGraph
        })
    }
    render() {
        return ( <
            DirectGraph list = {
                this.state.graph
            }
            sellSize = {
                sellSize
            }
            padding = {
                padding
            }
            onNodeClick = {
                this.onNodeClick
            }
            onEdgeClick = {
                this.onEdgeClick
            }
            onEdgeMouseEnter = {
                this.onEdgeMouseEnter
            }
            onEdgeMouseLeave = {
                this.onEdgeMouseLeave
            }
            /> 
        )
    }
}
