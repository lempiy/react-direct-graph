import {
    INodeInput,
    NodeType,
    AnchorType,
    INodeOutput
} from "./node.interface";
import { TraverseQueue } from "./traverse-queue.class";
import { Matrix } from "./matrix.class";

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
 * Main compute class used to transform
 * linked list of nodes to coordinate matrix
 */
export class Graph<T> {
    private _list: INodeInput<T>[] = [];
    private _nodesMap: { [id: string]: INodeInput<T> } = {};
    private _incomesByNodeIdMap: { [id: string]: string[] } = {};
    private _outcomesByNodeIdMap: { [id: string]: string[] } = {};
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
        this._list = list;
        list.forEach(node => {
            if (this._nodesMap[node.id]) {
                throw new Error(`Duplicate node id ${node.id}`);
            }
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
    private nodeType(id: string): NodeType {
        if (this.isRoot(id) && this.isSplit(id)) return NodeType.RootSplit;
        if (this.isRoot(id)) return NodeType.RootSimple;
        if (this.isSplit(id)) return NodeType.Split;
        if (this.isJoin(id)) return NodeType.Join;
        return NodeType.Simple;
    }
    /**
     * Whether or node is split
     * @param id id of node
     */
    private isSplit(id: string): boolean {
        return (
            this._outcomesByNodeIdMap[id] &&
            this._outcomesByNodeIdMap[id].length > 1
        );
    }
    /**
     * Whether or node is join
     * @param id id of node
     */
    private isJoin(id: string): boolean {
        return (
            this._incomesByNodeIdMap[id] &&
            this._incomesByNodeIdMap[id].length > 1
        );
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
    private outcomes(id: string): string[] {
        return this._outcomesByNodeIdMap[id];
    }
    /**
     * Get incomes of node by id
     * @param id id of node
     */
    private incomes(id: string): string[] {
        return this._incomesByNodeIdMap[id];
    }
    /**
     * Get node by id
     * @param id node id
     */
    private node(id: string): INodeInput<T> {
        return this._nodesMap[id];
    }
    /**
     * Check if item has unresolved incomes
     * @param item item to check
     */
    private _joinHasUnresolvedIncomes(item: INodeOutput<T>) {
        return item.passedIncomes.length != this.incomes(item.id).length;
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
        const { mtx } = state;
        // if point collides by x vertex, insert new row before y position
        if (checkCollision && mtx.hasHorizontalCollision([state.x, state.y])) {
            mtx.insertRowBefore(state.y);
        }
        mtx.insert([state.x, state.y], item);
        return true;
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
        const incomes = item.passedIncomes;
        if (incomes && incomes.length) {
            // get lowest income y
            const items = incomes.map(id => {
                const coords = mtx.find(item => item.id === id);
                if (!coords) {
                    throw new Error(
                        `Cannot find coordinates for passed income: "${id}"`
                    );
                }
                return coords[1];
            });
            const y = Math.min(...items);
            return y;
        }
        return 0;
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
        const { mtx, queue } = state;
        if (item.passedIncomes && item.passedIncomes.length) {
            state.y = this._getLowestYAmongIncomes(item, mtx);
        }
        // if point collides by y vertex, skipp it to next x
        if (mtx.hasVerticalCollision([state.x, state.y])) {
            queue.push(item);
            return false;
        }
        return this._insertOrSkipNodeOnMatrix(item, state, false);
    }
    /**
     * traverse main method to get coordinates matrix from graph
     * @returns 2D matrix containing all nodes and anchors
     */
    traverse() {
        const roots = this.roots();
        const state: State<T> = {
            mtx: new Matrix<T>(),
            queue: new TraverseQueue(),
            x: 0,
            y: 0
        };
        let _safe = 0;
        const { mtx, queue } = state;
        queue.add(
            null,
            null,
            ...roots.map(r => ({ id: r.id, payload: r.payload, next: r.next }))
        );
        let isInserted = false;
        while (queue.length) {
            const levelQueue = queue.drain();
            while (levelQueue.length) {
                _safe++;
                const item = levelQueue.shift();
                if (!item) throw new Error("Cannot shift from buffer queue");
                switch (this.nodeType(item.id)) {
                    case NodeType.RootSimple:
                        state.y = mtx.getFreeRowForColumn(0);
                    case NodeType.Simple:
                        isInserted = this._processOrSkipNodeOnMatrix(
                            item,
                            state
                        );
                        if (isInserted) {
                            queue.add(
                                item.id,
                                levelQueue,
                                ...this.outcomes(item.id).map(outcomeId => {
                                    const out = this.node(outcomeId);
                                    return {
                                        id: out.id,
                                        next: out.next,
                                        payload: out.payload
                                    };
                                })
                            );
                        }
                        break;
                    case NodeType.RootSplit:
                        state.y = mtx.getFreeRowForColumn(0);
                    case NodeType.Split:
                        isInserted = this._processOrSkipNodeOnMatrix(
                            item,
                            state
                        );
                        if (isInserted) {
                            const outcomes = this.outcomes(item.id);
                            // first will be on the same y level as parent split
                            const firstOutcomeId = outcomes.shift();
                            if (!firstOutcomeId)
                                throw new Error(
                                    `Split "${item.id}" has no outcomes`
                                );
                            const first = this.node(firstOutcomeId);
                            queue.add(item.id, levelQueue, {
                                id: first.id,
                                next: first.next,
                                payload: first.payload
                            });
                            // rest will create anchor with shift down by one
                            outcomes.forEach(outcomeId => {
                                state.y++;
                                const id = `${item.id}-${outcomeId}`;

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
                                );
                                const out = this.node(outcomeId);
                                queue.add(id, levelQueue, {
                                    id: out.id,
                                    next: out.next,
                                    payload: out.payload
                                });
                            });
                        }
                        break;
                    case NodeType.Join:
                        if (this._joinHasUnresolvedIncomes(item)) {
                            queue.push(item);
                        } else {
                            isInserted = this._processOrSkipNodeOnMatrix(
                                item,
                                state
                            );
                            item.renderIncomes = [];
                            if (isInserted) {
                                const incomes = item.passedIncomes;
                                const lowestY = this._getLowestYAmongIncomes(
                                    item,
                                    mtx
                                );
                                incomes.forEach(incomeId => {
                                    const point = mtx.find(
                                        item => item.id === incomeId
                                    );
                                    if (!point)
                                        throw new Error(
                                            `Income ${incomeId} not found on matrix`
                                        );
                                    const [, y] = point;
                                    if (lowestY === y) {
                                        item.renderIncomes.push(incomeId);
                                        return;
                                    }
                                    state.y = y;
                                    const id = `${incomeId}-${item.id}`;
                                    item.renderIncomes.push(id);
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
                                    );
                                });
                                queue.add(
                                    item.id,
                                    levelQueue,
                                    ...this.outcomes(item.id).map(outcomeId => {
                                        const out = this.node(outcomeId);
                                        return {
                                            id: out.id,
                                            next: out.next,
                                            payload: out.payload
                                        };
                                    })
                                );
                            }
                        }
                        break;
                }
                if (_safe > MAX_ITERATIONS) {
                    throw new Error(`Infinite loop`);
                    return mtx;
                }
            }
            state.x++;
        }
        return mtx;
    }
}
