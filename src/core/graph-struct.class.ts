import { INodeInput, NodeType } from "./node.interface";

const isMultiple = (obj: { [id: string]: string[] }, id: string): boolean =>
    obj[id] && obj[id].length > 1;

/**
 * @class GraphStruct
 * Frame parent-class to simplify graph
 * elements recognition
 */
export class GraphStruct<T> {
    protected _list: INodeInput<T>[] = [];
    private _nodesMap: { [id: string]: INodeInput<T> } = {};
    private _incomesByNodeIdMap: { [id: string]: string[] } = {};
    private _outcomesByNodeIdMap: { [id: string]: string[] } = {};
    private _loopsByNodeIdMap: { [id: string]: string[] } = {};
    constructor(list: INodeInput<T>[]) {
        this.applyList(list);
    }
    /**
     * Fill graph with new nodes
     * @param list input linked list of nodes
     */
    applyList(list: INodeInput<T>[]): void {
        this._incomesByNodeIdMap = {};
        this._outcomesByNodeIdMap = {};
        this._nodesMap = {};
        this._loopsByNodeIdMap = {};
        this._list = list;
        list.forEach(node => {
            if (this._nodesMap[node.id])
                throw new Error(`Duplicate id ${node.id}`);
            this._nodesMap[node.id] = node;
            node.next.forEach(outcomeId => {
                this._incomesByNodeIdMap[outcomeId] = this._incomesByNodeIdMap[
                    outcomeId
                ]
                    ? [...this._incomesByNodeIdMap[outcomeId], node.id]
                    : [node.id];
                const incomes = this._incomesByNodeIdMap[outcomeId];
                if (new Set(incomes).size !== incomes.length) {
                    throw new Error(`Duplicate incomes for node id ${node.id}`);
                }
            });
            this._outcomesByNodeIdMap[node.id] = [...node.next];
            const outcomes = this._outcomesByNodeIdMap[node.id];
            if (new Set(outcomes).size !== outcomes.length) {
                throw new Error(`Duplicate outcomes for node id ${node.id}`);
            }
        });
    }
    detectIncomesAndOutcomes() {
        const usedBuffer = {};
    }
    traverseVertically(
        node: INodeInput<T>,
        usedBuffer: { [id: string]: INodeInput<T> }
    ) {
        if (usedBuffer[node.id])
            throw new Error(`Duplicate incomes for node id ${node.id}`);
        node.next.forEach(outcomeId => {
            if (usedBuffer[outcomeId]) {
                this._loopsByNodeIdMap[outcomeId] = this._loopsByNodeIdMap[
                    outcomeId
                ]
                    ? [...this._loopsByNodeIdMap[outcomeId], node.id]
                    : [node.id];
                return;
            }
            this._incomesByNodeIdMap[outcomeId] = this._incomesByNodeIdMap[
                outcomeId
            ]
                ? [...this._incomesByNodeIdMap[outcomeId], node.id]
                : [node.id];
            const incomes = this._incomesByNodeIdMap[outcomeId];
            if (new Set(incomes).size !== incomes.length) {
                throw new Error(`Duplicate incomes for node id ${node.id}`);
            }
            this._outcomesByNodeIdMap[node.id] = this._outcomesByNodeIdMap[
                node.id
            ]
                ? [...this._outcomesByNodeIdMap[node.id], outcomeId]
                : [outcomeId];
        });
        const outcomes = this._outcomesByNodeIdMap[node.id];
        if (new Set(outcomes).size !== outcomes.length) {
            throw new Error(`Duplicate outcomes for node id ${node.id}`);
        }
    }
    /**
     * Get graph roots.
     * Roots is nodes without incomes
     */
    roots(): INodeInput<T>[] {
        return this._list.filter(node => this.isRoot(node.id));
    }
    /**
     * Get type of node
     * @param id id of node
     * @returns type of the node
     */
    protected nodeType(id: string): NodeType {
        let nodeType = NodeType.Simple;
        switch (true) {
            case this.isRoot(id) && this.isSplit(id):
                nodeType = NodeType.RootSplit;
                break;
            case this.isRoot(id):
                nodeType = NodeType.RootSimple;
                break;
            case this.isSplit(id):
                nodeType = NodeType.Split;
                break;
            case this.isJoin(id):
                nodeType = NodeType.Join;
                break;
        }
        return nodeType;
    }
    /**
     * Whether or node is split
     * @param id id of node
     */
    private isSplit(id: string): boolean {
        return isMultiple(this._outcomesByNodeIdMap, id);
    }
    /**
     * Whether or node is join
     * @param id id of node
     */
    private isJoin(id: string): boolean {
        return isMultiple(this._incomesByNodeIdMap, id);
    }
    /**
     * Whether or node is root
     * @param id id of node
     */
    private isRoot(id: string): boolean {
        return (
            !this._incomesByNodeIdMap[id] ||
            !this._incomesByNodeIdMap[id].length
        );
    }
    /**
     * Get outcomes of node by id
     * @param id id of node
     */
    protected outcomes(id: string): string[] {
        return this._outcomesByNodeIdMap[id];
    }
    /**
     * Get incomes of node by id
     * @param id id of node
     */
    protected incomes(id: string): string[] {
        return this._incomesByNodeIdMap[id];
    }
    /**
     * Get node by id
     * @param id node id
     */
    protected node(id: string): INodeInput<T> {
        return this._nodesMap[id];
    }
    /**
     * Check if item has unresolved incomes
     * @param item item to check
     */
}
