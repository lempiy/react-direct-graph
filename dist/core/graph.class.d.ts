import { INodeInput } from "./node.interface";
import { Matrix } from "./matrix.class";
import { GraphMatrix } from "./graph-matrix.class";
/**
 * @class Graph
 * Main iteration class used to transform
 * linked list of nodes to coordinate matrix
 */
export declare class Graph<T> extends GraphMatrix<T> {
    constructor(list: INodeInput<T>[]);
    /**
     * Function to handle split nodes
     * @param item item to handle
     * @param state current state of iteration
     * @param levelQueue buffer subqueue of iteration
     */
    private _handleSplitNode;
    /**
     * Function to handle splitjoin nodes
     * @param item item to handle
     * @param state current state of iteration
     * @param levelQueue buffer subqueue of iteration
     */
    private _handleSplitJoinNode;
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
     * Method to handle single iteration item
     * @param item queue item to process
     * @param state state of iteration
     * @param levelQueue
     */
    private _traverseItem;
    /**
     * Iterate over one level of graph
     * starting from queue top item
     */
    private _traverseLevel;
    /**
     * Iterate over graph
     * starting from queue root items
     */
    private _traverseList;
    /**
     * traverse main method to get coordinates matrix from graph
     * @returns 2D matrix containing all nodes and anchors
     */
    traverse(): Matrix<T>;
}
