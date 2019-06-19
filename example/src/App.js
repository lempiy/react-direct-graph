import React, {
    Component
} from 'react'

import DirectGraph from 'react-direct-graph'
import graph from './graph'

const cellSize = 200
const padding = cellSize * 0.25

export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            graph,
            inSelect: false,
            selected: []
        }
    }
    componentDidMount() {
        window.addEventListener('keydown', this.onKeyDown)
        window.addEventListener('keyup', this.onKeyUp)
    }
    onNodeClick = (event, node, incomes) => {
        if (this.state.inSelect) {
            this.connectNode(event, node, incomes)
        } else {
            this.softDeleteNode(event, node, incomes)
        }
    }

    connectNode = (event, node, incomes) => {
        event.preventDefault()
        console.log('connectNode')
        if (!this.state.selected.length) {
            if (incomes.length > 1 && node.next.length) return
            this.setState({...this.state, ...{
                selected: [node],
            }})
        } else {
            if (node.next.length > 1 && incomes.length) return
            const target = this.state.selected[0]
            if (target.id === node.id) return
            const outcome = node
            const newGraph = [
                ...this.state.graph
            ]
            const targetInArray = newGraph.find(n => n.id === target.id)
            if (targetInArray.next.find(outcomeId => outcomeId === outcome.id)) return
            targetInArray.next.push(outcome.id)
            this.setState({...this.state, ...{
                selected: [],
                graph: newGraph,
            }})
        }
    }

    softDeleteNode = (event, node, incomes) => { 
        const nodeIndex = this.state.graph.findIndex(n => n.id === node.id)
        incomes.forEach((income, index) => {
            const find = n => n.id === income.anchorFrom
            while (income.isAnchor) {
                income = this.state.graph.find(find)
            }
            const inc = this.state.graph.find(n => n.id === income.id)
            const i = inc.next.findIndex(outcomeId => outcomeId === node.id)
            if (!index) inc.next.splice(i, 1, ...node.next)
            else inc.next.splice(i, 1)
        });
        const newGraph = [
            ...this.state.graph
        ]
        newGraph.splice(nodeIndex, 1)
        this.setState({...this.state, ...{
            graph: newGraph,
        }})
    }

    onKeyDown = (event) => {
        if (event.which === 16) {
            this.setState({...this.state, ...{
                inSelect: true
            }})
        }
    }

    onKeyUp = (event) => {
        if (event.which === 16) {
            this.setState({...this.state, ...{
                inSelect: false,
                selected: []
            }})
            console.log(this.state.inSelect)
        }
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
        this.setState({...this.state, ...{
            graph: newGraph
        }})
    }
    render() {
        return ( 
            <div>
            <DirectGraph list = {
                    this.state.graph
                }
                cellSize = {
                    cellSize
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
            </div>
        )
    }
}
