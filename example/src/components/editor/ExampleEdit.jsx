import React, { Component } from "react";

import DirectGraph from "react-direct-graph";
import graph from "../../data/graph";

export class ExampleEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            graph,
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
        const original = this.resolveDataNodes(node, incomes);
        this.insertNode(original.node, original.income);
    };

    onEdgeMouseEnter = (event, node, incomes) => {
        event.currentTarget.style.stroke = "#f00";
    };

    onEdgeMouseLeave = (event, node, incomes) => {
        event.currentTarget.style.stroke = null;
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
        if (incomes.length > 1 && node.next.length) return;
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
        if (node.next.length > 1 && incomes.length) return;
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
            if (!index) inc.next.splice(i, 1, ...node.next);
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

    /**
     * Get original nodes from anchor edges
     * return unchanged data if edge is not anchor edge
     */
    resolveDataNodes = (node, incomes) => {
        let income = incomes[0];
        if (node.isAnchor) {
            return this.extractAnchor(node);
        }
        if (income.isAnchor) {
            return this.extractAnchor(income);
        }
        return { node, income };
    };

    insertNode = (node, income) => {
        const newId = window.prompt(
            `Insert new node between ${income.id} and ${node.id}: Use id:`
        );
        if (!newId) return;
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
    };

    extractAnchor(n) {
        const { anchorFrom, anchorTo } = n;
        const node = this.state.graph.find(n => n.id === anchorTo);
        const income = this.state.graph.find(n => n.id === anchorFrom);
        return {
            node,
            income
        };
    }

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
