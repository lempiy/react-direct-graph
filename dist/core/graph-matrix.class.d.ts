import { INodeInput, INodeOutput } from "./node.interface";
import { TraverseQueue } from "./traverse-queue.class";
import { Matrix } from "./matrix.class";
import { GraphStruct } from "./graph-struct.class";
/**
 * Holds iteration state of the graph
 */
interface State<T> {
    mtx: Matrix<T>;
    queue: TraverseQueue<T>;
    x: number;
    y: number;
}
/**
 * @class GraphMatrix
 * Compute graph subclass used to interact with matrix
 */
export declare class GraphMatrix<T> extends GraphStruct<T> {
    constructor(list: INodeInput<T>[]);
    /**
     * Check if item has unresolved incomes
     * @param item item to check
     */
    protected _joinHasUnresolvedIncomes(item: INodeOutput<T>): boolean;
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
    protected _processOrSkipNodeOnMatrix(item: INodeOutput<T>, state: State<T>): boolean;
    private hasLoops;
    private _handleLoopEdges;
    private _markIncomesAsPassed;
    protected _resolveCurrentJoinIncomes(mtx: Matrix<T>, join: INodeOutput<T>): void;
    private _insertLoopEdges;
    /**
     * Insert outcomes of split node
     * @param item item to handle
     * @param state current state of iteration
     * @param levelQueue
     */
    protected _insertSplitOutcomes(item: INodeOutput<T>, state: State<T>, levelQueue: TraverseQueue<T>): void;
    /**
     * Insert incomes of join node
     * @param item item to handle
     * @param state current state of iteration
     * @param levelQueue
     * @param addItemToQueue
     */
    protected _insertJoinIncomes(item: INodeOutput<T>, state: State<T>, levelQueue: TraverseQueue<T>, addItemToQueue: boolean): void;
}
export {};
