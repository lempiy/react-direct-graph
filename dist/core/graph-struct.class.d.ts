import { INodeInput, NodeType } from "./node.interface";
/**
 * @class GraphStruct
 * Frame parent-class to simplify graph
 * elements recognition
 */
export declare class GraphStruct<T> {
    protected _list: INodeInput<T>[];
    private _nodesMap;
    private _incomesByNodeIdMap;
    private _outcomesByNodeIdMap;
    private _loopsByNodeIdMap;
    constructor(list: INodeInput<T>[]);
    /**
     * Fill graph with new nodes
     * @param list input linked list of nodes
     */
    applyList(list: INodeInput<T>[]): void;
    detectIncomesAndOutcomes(): void;
    traverseVertically(node: INodeInput<T>, branchSet: Set<string>, totalSet: Set<string>): Set<string>;
    /**
     * Get graph roots.
     * Roots is nodes without incomes
     */
    roots(): INodeInput<T>[];
    /**
     * Get type of node
     * @param id id of node
     * @returns type of the node
     */
    protected nodeType(id: string): NodeType;
    /**
     * Whether or node is split
     * @param id id of node
     */
    private isSplit;
    /**
     * Whether or node is join
     * @param id id of node
     */
    private isJoin;
    /**
     * Whether or node is root
     * @param id id of node
     */
    private isRoot;
    private isLoopEdge;
    /**
     * Get outcomes of node by id
     * @param id id of node
     */
    protected outcomes(id: string): string[];
    /**
     * Get incomes of node by id
     * @param id id of node
     */
    protected incomes(id: string): string[];
    /**
     * Get node by id
     * @param id node id
     */
    protected node(id: string): INodeInput<T>;
}
