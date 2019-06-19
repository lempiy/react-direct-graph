import { INodeInput } from "./node.interface";
import { Matrix } from "./matrix.class";
/**
 * @class Graph
 * Main compute class used to transform
 * linked list of nodes to coordinate matrix
 */
export declare class Graph<T> {
    private _list;
    private _nodesMap;
    private _incomesByNodeIdMap;
    private _outcomesByNodeIdMap;
    constructor(list: INodeInput<T>[]);
    /**
     * Fill graph with new nodes
     * @param list input linked list of nodes
     */
    applyList(list: INodeInput<T>[]): void;
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
    private nodeType;
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
    /**
     * Get outcomes of node by id
     * @param id id of node
     */
    private outcomes;
    /**
     * Get incomes of node by id
     * @param id id of node
     */
    private incomes;
    /**
     * Get node by id
     * @param id node id
     */
    private node;
    /**
     * Check if item has unresolved incomes
     * @param item item to check
     */
    private _joinHasUnresolvedIncomes;
    /**
     * Main insertion method - inserts item on matrix using state x and y
     * or skips if it has collision on current row. Skipping is done
     * by passing item back to the end of the queue
     * @param item item to insert
     * @param state state of current iteration
     * @param checkCollision whether to check horizontal collision with existing point
     * on 2D matrix
     * @returns true if item was inserted false if skipped
     */
    private _insertOrSkipNodeOnMatrix;
    /**
     * Get all items incomes and find parent Y with the lowest
     * Y coordinate on the matrix
     * @param item target item
     * @param mtx matrix to use as source
     */
    private _getLowestYAmongIncomes;
    /**
     * Main processing nodes method.
     * If node has incomes it finds lowest Y among them and
     * sets state.y as lowest income Y value.
     * Then inserts item on matrix using state x and y
     * or skips if it has collision on current column. Skipping is done
     * by passing item back to the end of the queue
     * @param item item to insert
     * @param state state of current iteration
     * on 2D matrix
     * @returns true if item was inserted false if skipped
     */
    private _processOrSkipNodeOnMatrix;
    /**
     * Function to handle split nodes
     * @param item item to handle
     * @param state current state of iteration
     * @param levelQueue buffer subqueue of iteration
     */
    private _handleSplitNode;
    /**
     * Function to handle join nodes
     * @param item item to handle
     * @param state current state of iteration
     * @param levelQueue buffer subqueue of iteration
     */
    private _handleJoinNode;
    /**
     * Function to handle simple nodes
     * @param item item to handle
     * @param state current state of iteration
     * @param levelQueue buffer subqueue of iteration
     */
    private _handleSimpleNode;
    /**
     * get outcomes inputs helper
     * @param itemId node id
     */
    private getOutcomesArray;
    /**
     * traverse main method to get coordinates matrix from graph
     * @returns 2D matrix containing all nodes and anchors
     */
    traverse(): Matrix<T>;
}
