import {
    INodeInput,
    NodeType,
    AnchorType,
    INodeOutput
} from "./node.interface"
import { TraverseQueue } from "./traverse-queue.class"
import { Matrix } from "./matrix.class"
import { GraphStruct } from "./graph-struct.class"

const MAX_ITERATIONS = 10000

/**
 * Holds iteration state of the graph
 */
interface State<T> {
    mtx: Matrix<T>
    queue: TraverseQueue<T>
    x: number
    y: number
}

/**
 * @class Graph
 * Main compute class used to transform
 * linked list of nodes to coordinate matrix
 */
export class Graph<T> extends GraphStruct<T> {
    protected _list: INodeInput<T>[] = []
    constructor(list: INodeInput<T>[]) {
        super(list)
        this.applyList(list)
    }
    /**
     * Check if item has unresolved incomes
     * @param item item to check
     */
    private _joinHasUnresolvedIncomes(item: INodeOutput<T>) {
        return item.passedIncomes.length != this.incomes(item.id).length
    }
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
    private _insertOrSkipNodeOnMatrix(
        item: INodeOutput<T>,
        state: State<T>,
        checkCollision: boolean
    ): boolean {
        const { mtx } = state
        // if point collides by x vertex, insert new row before y position
        if (checkCollision && mtx.hasHorizontalCollision([state.x, state.y])) {
            mtx.insertRowBefore(state.y)
        }
        mtx.insert([state.x, state.y], item)
        return true
    }
    /**
     * Get all items incomes and find parent Y with the lowest
     * Y coordinate on the matrix
     * @param item target item
     * @param mtx matrix to use as source
     */
    private _getLowestYAmongIncomes(
        item: INodeOutput<T>,
        mtx: Matrix<T>
    ): number {
        const incomes = item.passedIncomes
        if (incomes && incomes.length) {
            // get lowest income y
            const items = incomes.map(id => {
                const coords = mtx.find(item => item.id === id)
                if (!coords) {
                    throw new Error(
                        `Cannot find coordinates for passed income: "${id}"`
                    )
                }
                return coords[1]
            })
            const y = Math.min(...items)
            return y
        }
        return 0
    }

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
    private _processOrSkipNodeOnMatrix(item: INodeOutput<T>, state: State<T>) {
        const { mtx, queue } = state
        if (item.passedIncomes && item.passedIncomes.length) {
            state.y = this._getLowestYAmongIncomes(item, mtx)
        }
        // if point collides by y vertex, skipp it to next x
        if (mtx.hasVerticalCollision([state.x, state.y])) {
            queue.push(item)
            return false
        }
        return this._insertOrSkipNodeOnMatrix(item, state, false)
    }
    /**
     * Insert outcomes of split node
     * @param item item to handle
     * @param state current state of iteration
     */
    private _insertSplitOutcomes(
        item: INodeOutput<T>,
        state: State<T>,
        levelQueue: TraverseQueue<T>
    ) {
        const { queue } = state
        const outcomes = this.outcomes(item.id)
        // first will be on the same y level as parent split
        const firstOutcomeId = outcomes.shift()
        if (!firstOutcomeId)
            throw new Error(`Split "${item.id}" has no outcomes`)
        const first = this.node(firstOutcomeId)
        queue.add(item.id, levelQueue, {
            id: first.id,
            next: first.next,
            payload: first.payload
        })
        // rest will create anchor with shift down by one
        outcomes.forEach(outcomeId => {
            state.y++
            const id = `${item.id}-${outcomeId}`

            this._insertOrSkipNodeOnMatrix(
                {
                    id: id,
                    anchorType: AnchorType.Split,
                    anchorFrom: item.id,
                    anchorTo: outcomeId,
                    isAnchor: true,
                    renderIncomes: [item.id],
                    passedIncomes: [item.id],
                    payload: item.payload,
                    next: [outcomeId]
                },
                state,
                true
            )
            queue.add(id, levelQueue, {...this.node(outcomeId)})
        })
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
        let isInserted = this._processOrSkipNodeOnMatrix(item, state)
        if (isInserted) {
            this._insertSplitOutcomes(item, state, levelQueue)
        }
        return isInserted
    }
    /**
     * Insert incomes of join node
     * @param item item to handle
     * @param state current state of iteration
     */
    private _insertJoinIncomes(
        item: INodeOutput<T>,
        state: State<T>,
        levelQueue: TraverseQueue<T>
    ) {
        const {mtx, queue} = state
        const incomes = item.passedIncomes
        const lowestY = this._getLowestYAmongIncomes(item, mtx)
        incomes.forEach(incomeId => {
            const p = mtx.find(item => item.id === incomeId)
            if (!p) throw Error(`Income ${incomeId} not found`)
            const [, y] = p
            if (lowestY === y) {
                item.renderIncomes.push(incomeId)
                return
            }
            state.y = y
            const id = `${incomeId}-${item.id}`
            item.renderIncomes.push(id)
            this._insertOrSkipNodeOnMatrix(
                {
                    id: id,
                    anchorType: AnchorType.Join,
                    anchorFrom: incomeId,
                    anchorTo: item.id,
                    isAnchor: true,
                    renderIncomes: [incomeId],
                    passedIncomes: [incomeId],
                    payload: item.payload,
                    next: [item.id]
                },
                state,
                false
            )
        })
        queue.add(
            item.id,
            levelQueue,
            ...this.getOutcomesArray(item.id)
        )
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
        const { queue } = state
        let isInserted = false
        if (this._joinHasUnresolvedIncomes(item)) {
            queue.push(item)
        } else {
            isInserted = this._processOrSkipNodeOnMatrix(item, state)
            item.renderIncomes = []
            if (isInserted) {
                this._insertJoinIncomes(item, state, levelQueue)
            }
        }
        return isInserted
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
        const { queue } = state
        let isInserted = this._processOrSkipNodeOnMatrix(item, state)
        if (isInserted) {
            queue.add(item.id, levelQueue, ...this.getOutcomesArray(item.id))
        }
        return isInserted
    }
    /**
     * get outcomes inputs helper
     * @param itemId node id
     */
    private getOutcomesArray(itemId: string): INodeInput<T>[] {
        return this.outcomes(itemId).map(outcomeId => {
            const out = this.node(outcomeId)
            return {
                id: out.id,
                next: out.next,
                payload: out.payload
            }
        })
    }
    /**
     * Method to handle single iteration item
     * @param item queue item to process
     * @param state state of iteration
     */
    private _traverseItem(item: INodeOutput<T>, state: State<T>, levelQueue: TraverseQueue<T>) {
        const {mtx} = state
        switch (this.nodeType(item.id)) {
            case NodeType.RootSimple:
                // find free column and fallthrough
                state.y = mtx.getFreeRowForColumn(0)
            case NodeType.Simple:
                this._handleSimpleNode(item, state, levelQueue)
                break
            case NodeType.RootSplit:
                // find free column and fallthrough
                state.y = mtx.getFreeRowForColumn(0)
            case NodeType.Split:
                this._handleSplitNode(item, state, levelQueue)
                break
            case NodeType.Join:
                this._handleJoinNode(item, state, levelQueue)
                break
        }
    }
    /**
     * Iterate over one level of graph 
     * starting from queue top item
     */
    private _traverseLevel(iterations:number, state: State<T>):number {
        const { queue } = state
        const levelQueue = queue.drain()
        while (levelQueue.length) {
            iterations++
            const item = levelQueue.shift()
            if (!item) throw new Error("Cannot shift from buffer queue")
            this._traverseItem(item, state, levelQueue)
            if (iterations > MAX_ITERATIONS) {
                throw new Error(`Infinite loop`)
            }
        }
        return iterations
    }
    /**
     * Iterate over graph 
     * starting from queue root items
     */
    private _traverseList(state: State<T>): Matrix<T> {
        let _safe = 0
        const { mtx, queue } = state
        while (queue.length) {
            _safe = this._traverseLevel(_safe, state)
            state.x++
        }
        return mtx
    }
    /**
     * traverse main method to get coordinates matrix from graph
     * @returns 2D matrix containing all nodes and anchors
     */
    traverse(): Matrix<T> {
        const roots = this.roots()
        const state: State<T> = {
            mtx: new Matrix<T>(),
            queue: new TraverseQueue(),
            x: 0,
            y: 0
        }
        if (!roots.length) {
            if (this._list.length) throw new Error(`No roots in graph`)
            return state.mtx
        }
        const { mtx, queue } = state
        queue.add(
            null,
            null,
            ...roots.map(r => ({ id: r.id, payload: r.payload, next: r.next }))
        )
        this._traverseList(state)
        return mtx
    }
}
