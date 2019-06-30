import React, { Component } from "react";

import DirectGraph from "react-direct-graph";
import graph from "../../data/graph.json";

let counter = 1;

export class ExampleEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            graph: graph.map(n => ({ ...n, next: [...n.next] })),
            inSelect: false,
            selected: []
        };
    }

    componentDidMount() {
        window.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("keyup", this.onKeyUp);
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.onKeyDown);
        window.removeEventListener("keyup", this.onKeyUp);
    }

    onNodeClick = (event, node, incomes) => {
        if (this.state.inSelect) {
            this.connectNode(event, node, incomes);
        } else {
            this.softDeleteNode(event, node, incomes);
        }
    };

    onEdgeClick = (event, node, incomes) => {
        this.insertNode(node, incomes[0]);
    };

    onEdgeMouseEnter = (event, node, incomes) => {
        event.currentTarget.style.stroke = "#f00";
        event.currentTarget.style.fill = "#f00";
    };

    onEdgeMouseLeave = (event, node, incomes) => {
        event.currentTarget.style.stroke = "rgb(45, 87, 139)";
        event.currentTarget.style.fill = "rgb(45, 87, 139)";
    };

    onKeyDown = event => {
        if (event.which === 16) {
            this.setState({
                ...this.state,
                ...{
                    inSelect: true
                }
            });
        }
    };

    onKeyUp = event => {
        if (event.which === 16) {
            this.setState({
                ...this.state,
                ...{
                    inSelect: false,
                    selected: []
                }
            });
        }
    };

    addToNodeToSelectBuffer = (node, incomes) => {
        this.setState({
            ...this.state,
            ...{
                selected: [node]
            }
        });
    };

    connectNode = (event, node, incomes) => {
        event.preventDefault();
        if (!this.state.selected.length) {
            this.addToNodeToSelectBuffer(node, incomes);
        } else {
            this.applyNodeConnection(node, incomes);
        }
    };

    applyNodeConnection = (node, incomes) => {
        const target = this.state.selected[0];
        if (target.id === node.id) return;
        const outcome = node;
        const newGraph = [...this.state.graph];
        const targetInArray = newGraph.find(n => n.id === target.id);
        if (targetInArray.next.find(outcomeId => outcomeId === outcome.id))
            return;
        targetInArray.next.push(outcome.id);
        this.setState({
            ...this.state,
            ...{
                selected: [],
                graph: newGraph
            }
        });
    };

    softDeleteNode = (event, node, incomes) => {
        const nodeIndex = this.state.graph.findIndex(n => n.id === node.id);
        incomes.forEach((income, index) => {
            const find = n => n.id === income.anchorFrom;
            while (income.isAnchor) {
                income = this.state.graph.find(find);
            }
            const inc = this.state.graph.find(n => n.id === income.id);
            const i = inc.next.findIndex(outcomeId => outcomeId === node.id);
            const incNext = node.next.filter(nextId => nextId !== inc.id);
            if (!index) inc.next.splice(i, 1, ...incNext);
            else inc.next.splice(i, 1);
        });
        const newGraph = [...this.state.graph];
        newGraph.splice(nodeIndex, 1);
        this.setState({
            ...this.state,
            ...{
                graph: newGraph
            }
        });
    };

    insertNode = (node, income) => {
        const newId = `#${counter}`;
        const nodeIndex = this.state.graph.findIndex(n => n.id === node.id);
        const inc = this.state.graph.find(n => n.id === income.id);
        const newGraph = [...this.state.graph];
        newGraph.splice(nodeIndex, 0, {
            id: newId,
            next: [node.id],
            payload: {
                exist: true
            }
        });
        const i = inc.next.findIndex(outcomeId => outcomeId === node.id);
        inc.next.splice(i, 1, newId);
        this.setState({
            ...this.state,
            ...{
                graph: newGraph
            }
        });
        counter++;
    };

    render() {
        const { cellSize, padding } = this.props;
        return (
            <DirectGraph
                list={this.state.graph}
                cellSize={cellSize}
                padding={padding}
                onNodeClick={this.onNodeClick}
                onEdgeClick={this.onEdgeClick}
                onEdgeMouseEnter={this.onEdgeMouseEnter}
                onEdgeMouseLeave={this.onEdgeMouseLeave}
            />
        );
    }
}
