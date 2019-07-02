import { INodeInput, NodeType, INodeOutput } from "./node.interface";
import { TraverseQueue } from "./traverse-queue.class";
import { Matrix } from "./matrix.class";
import { GraphMatrix } from "./graph-matrix.class";

const MAX_ITERATIONS = 10000;

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
 * @class Graph
 * Main iteration class used to transform
 * linked list of nodes to coordinate matrix
 */
export class Graph<T> extends GraphMatrix<T> {
    protected _list: INodeInput<T>[] = [];
    constructor(list: INodeInput<T>[]) {
        super(list);
        this.applyList(list);
    }
    /**
     * Function to handle split nodes
     * @param item item to handle
     * @param state current state of iteration
     * @param levelQueue buffer subqueue of iteration
     */
    private _handleSplitNode(
        item: INodeOutput<T>,
        state: State<T>,
        levelQueue: TraverseQueue<T>
    ): boolean {
        let isInserted = this._processOrSkipNodeOnMatrix(item, state);
        if (isInserted) {
            this._insertSplitOutcomes(item, state, levelQueue);
        }
        return isInserted;
    }
    /**
     * Function to handle splitjoin nodes
     * @param item item to handle
     * @param state current state of iteration
     * @param levelQueue buffer subqueue of iteration
     */
    private _handleSplitJoinNode(
        item: INodeOutput<T>,
        state: State<T>,
        levelQueue: TraverseQueue<T>
    ): boolean {
        const { queue, mtx } = state;
        let isInserted = false;
        if (this._joinHasUnresolvedIncomes(item)) {
            queue.push(item);
        } else {
            this._resolveCurrentJoinIncomes(mtx, item)
            isInserted = this._processOrSkipNodeOnMatrix(item, state);
            if (isInserted) {
                this._insertJoinIncomes(item, state, levelQueue, false);
                this._insertSplitOutcomes(item, state, levelQueue);
            }
        }
        return isInserted;
    }
    /**
     * Function to handle join nodes
     * @param item item to handle
     * @param state current state of iteration
     * @param levelQueue buffer subqueue of iteration
     */
    private _handleJoinNode(
        item: INodeOutput<T>,
        state: State<T>,
        levelQueue: TraverseQueue<T>
    ): boolean {
        const { queue, mtx } = state;
        let isInserted = false;
        if (this._joinHasUnresolvedIncomes(item)) {
            queue.push(item);
        } else {
            this._resolveCurrentJoinIncomes(mtx, item)
            isInserted = this._processOrSkipNodeOnMatrix(item, state);
            if (isInserted) {
                this._insertJoinIncomes(item, state, levelQueue, true);
            }
        }
        return isInserted;
    }
    /**
     * Function to handle simple nodes
     * @param item item to handle
     * @param state current state of iteration
     * @param levelQueue buffer subqueue of iteration
     */
    private _handleSimpleNode(
        item: INodeOutput<T>,
        state: State<T>,
        levelQueue: TraverseQueue<T>
    ): boolean {
        const { queue } = state;
        let isInserted = this._processOrSkipNodeOnMatrix(item, state);
        if (isInserted) {
            queue.add(item.id, levelQueue, ...this.getOutcomesArray(item.id));
        }
        return isInserted;
    }
    /**
     * Method to handle single iteration item
     * @param item queue item to process
     * @param state state of iteration
     */
    private _traverseItem(
        item: INodeOutput<T>,
        state: State<T>,
        levelQueue: TraverseQueue<T>
    ) {
        const { mtx } = state;
        switch (this.nodeType(item.id)) {
            case NodeType.RootSimple:
                // find free column and fallthrough
                state.y = mtx.getFreeRowForColumn(0);
            case NodeType.Simple:
                this._handleSimpleNode(item, state, levelQueue);
                break;
            case NodeType.RootSplit:
                // find free column and fallthrough
                state.y = mtx.getFreeRowForColumn(0);
            case NodeType.Split:
                this._handleSplitNode(item, state, levelQueue);
                break;
            case NodeType.Join:
                this._handleJoinNode(item, state, levelQueue);
                break;
            case NodeType.SplitJoin:
                this._handleSplitJoinNode(item, state, levelQueue);
                break;
        }
    }
    /**
     * Iterate over one level of graph
     * starting from queue top item
     */
    private _traverseLevel(iterations: number, state: State<T>): number {
        const { queue } = state;
        const levelQueue = queue.drain();
        while (levelQueue.length) {
            iterations++;
            const item = levelQueue.shift();
            if (!item) throw new Error("Cannot shift from buffer queue");
            this._traverseItem(item, state, levelQueue);
            if (iterations > MAX_ITERATIONS) {
                throw new Error(`Infinite loop`);
            }
        }
        return iterations;
    }
    /**
     * Iterate over graph
     * starting from queue root items
     */
    private _traverseList(state: State<T>): Matrix<T> {
        let _safe = 0;
        const { mtx, queue } = state;
        while (queue.length) {
            _safe = this._traverseLevel(_safe, state);
            state.x++;
        }
        return mtx;
    }
    /**
     * traverse main method to get coordinates matrix from graph
     * @returns 2D matrix containing all nodes and anchors
     */
    traverse(): Matrix<T> {
        const roots = this.roots();
        const state: State<T> = {
            mtx: new Matrix<T>(),
            queue: new TraverseQueue(),
            x: 0,
            y: 0
        };
        if (!roots.length) {
            if (this._list.length) throw new Error(`No roots in graph`);
            return state.mtx;
        }
        const { mtx, queue } = state;
        queue.add(
            null,
            null,
            ...roots.map(r => ({ id: r.id, payload: r.payload, next: r.next }))
        );
        this._traverseList(state);
        return mtx;
    }
}
