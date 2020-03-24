import {AnchorMargin, AnchorType, INodeInput, INodeOutput} from "./node.interface";
import {TraverseQueue} from "./traverse-queue.class";
import {Matrix} from "./matrix.class";
import {GraphStruct} from "./graph-struct.class";

/**
 * Holds iteration state of the graph
 */
interface State<T> {
    mtx: Matrix<T>;
    queue: TraverseQueue<T>;
    x: number;
    y: number;
}

interface LoopNode<T> {
    id: string;
    node: INodeOutput<T>;
    coords: number[];
    isSelfLoop?: boolean;
}

/**
 * @class GraphMatrix
 * Compute graph subclass used to interact with matrix
 */
export class GraphMatrix<T> extends GraphStruct<T> {
    constructor(list: INodeInput<T>[]) {
        super(list);
    }
    /**
     * Check if item has unresolved incomes
     * @param item item to check
     */
    protected _joinHasUnresolvedIncomes(item: INodeOutput<T>): boolean {
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
    private _insertOrSkipNodeOnMatrix(item: INodeOutput<T>, state: State<T>, checkCollision: boolean) {
        const { mtx } = state;
        // if point collides by x vertex, insert new row before y position
        if (checkCollision && mtx.hasHorizontalCollision([state.x, state.y])) {
            mtx.insertRowBefore(state.y);
        }
        mtx.insert([state.x, state.y], item);
        this._markIncomesAsPassed(mtx, item);
    }
    /**
     * Get all items incomes and find parent Y with the lowest
     * Y coordinate on the matrix
     * @param item target item
     * @param mtx matrix to use as source
     */
    private _getLowestYAmongIncomes(item: INodeOutput<T>, mtx: Matrix<T>): number {
        const incomes = item.passedIncomes;
        if (incomes && incomes.length) {
            // get lowest income y
            const items = incomes.map(id => {
                const coords = mtx.find(item => item.id === id);
                if (!coords) throw new Error(`Cannot find coordinates for passed income: "${id}"`);
                return coords[1];
            });
            return Math.min(...items);
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
    protected _processOrSkipNodeOnMatrix(item: INodeOutput<T>, state: State<T>): boolean {
        const { mtx, queue } = state;
        if (item.passedIncomes && item.passedIncomes.length) {
            state.y = this._getLowestYAmongIncomes(item, mtx);
        }
        const hasLoops = this.hasLoops(item);
        const loopNodes = hasLoops ? this._handleLoopEdges(item, state) : null;
        const needsLoopSkip = hasLoops && !loopNodes;
        // if point collides by y vertex, skip it to next x
        if (mtx.hasVerticalCollision([state.x, state.y]) || needsLoopSkip) {
            queue.push(item);
            return false;
        }
        this._insertOrSkipNodeOnMatrix(item, state, false);
        if (loopNodes) {
            this._insertLoopEdges(item, state, loopNodes);
        }
        return true;
    }

    private hasLoops(item: INodeOutput<T>): boolean {
        return !!this.loops(item.id);
    }

    private _handleLoopEdges(item: INodeOutput<T>, state: State<T>): LoopNode<T>[] | null {
        const { mtx } = state;
        const loops = this.loops(item.id);
        if (!loops) throw new Error(`No loops found for node ${item.id}`);
        const loopNodes = loops.map(incomeId => {
            if (item.id === incomeId) {
                return {
                    id: incomeId,
                    node: item,
                    coords: [state.x, state.y],
                    isSelfLoop: true
                };
            }
            const coords = mtx.find(n => n.id === incomeId);
            if (!coords) throw new Error(`Loop target '${incomeId}' not found on matrix`);
            const node = mtx.getByCoords(coords[0], coords[1]);
            if (!node) throw new Error(`Loop target node'${incomeId}' not found on matrix`);
            return {
                id: incomeId,
                node,
                coords
            };
        });
        const skip = loopNodes.some(income => {
            const { coords } = income;
            return mtx.hasVerticalCollision([state.x, coords[1] ? coords[1] - 1 : 0]);
        });
        if (skip) return null;
        return loopNodes;
    }

    private _markIncomesAsPassed(mtx: Matrix<T>, item: INodeOutput<T>) {
        item.renderIncomes.forEach(incomeId => {
            const found = mtx.findNode(n => n.id === incomeId);
            if (!found) throw new Error(`Income ${incomeId} is not on matrix yet`);
            const [coords, income] = found;
            income.childrenOnMatrix = Math.min(income.childrenOnMatrix + 1, income.next.length);
            mtx.insert(coords, income);
        });
    }

    protected _resolveCurrentJoinIncomes(mtx: Matrix<T>, join: INodeOutput<T>) {
        this._markIncomesAsPassed(mtx, join);
        join.renderIncomes = [];
    }

    private _insertLoopEdges(item: INodeOutput<T>, state: State<T>, loopNodes: LoopNode<T>[]): boolean {
        const { mtx } = state;
        const initialX = state.x;
        let initialY = state.y;
        loopNodes.forEach(income => {
            const { id, coords, node } = income;
            let renderIncomeId = item.id;
            if (income.isSelfLoop) {
                state.y = initialY;
                state.x = initialX + 1;
                const selfLoopId = `${id}-self`;
                renderIncomeId = selfLoopId;
                this._insertOrSkipNodeOnMatrix(
                    {
                        id: selfLoopId,
                        anchorType: AnchorType.Loop,
                        anchorMargin: AnchorMargin.Left,
                        anchorFrom: item.id,
                        anchorTo: id,
                        isAnchor: true,
                        renderIncomes: [node.id],
                        passedIncomes: [item.id],
                        payload: item.payload,
                        next: [id],
                        childrenOnMatrix: 0
                    },
                    state,
                    false
                );
            }
            state.y = coords[1];
            const initialHeight = mtx.height;
            const fromId = `${id}-${item.id}-from`;
            const idTo = `${id}-${item.id}-to`;
            node.renderIncomes = node.renderIncomes ? [...node.renderIncomes, fromId] : [fromId];
            this._insertOrSkipNodeOnMatrix(
                {
                    id: idTo,
                    anchorType: AnchorType.Loop,
                    anchorMargin: AnchorMargin.Left,
                    anchorFrom: item.id,
                    anchorTo: id,
                    isAnchor: true,
                    renderIncomes: [renderIncomeId],
                    passedIncomes: [item.id],
                    payload: item.payload,
                    next: [id],
                    childrenOnMatrix: 0
                },
                state,
                true
            );
            if (initialHeight !== mtx.height) initialY++;
            state.x = coords[0];
            this._insertOrSkipNodeOnMatrix(
                {
                    id: fromId,
                    anchorType: AnchorType.Loop,
                    anchorMargin: AnchorMargin.Right,
                    anchorFrom: item.id,
                    anchorTo: id,
                    isAnchor: true,
                    renderIncomes: [idTo],
                    passedIncomes: [item.id],
                    payload: item.payload,
                    next: [id],
                    childrenOnMatrix: 0
                },
                state,
                false
            );
            state.x = initialX;
        });
        state.y = initialY;
        return false;
    }
    /**
     * Insert outcomes of split node
     * @param item item to handle
     * @param state current state of iteration
     * @param levelQueue
     */
    protected _insertSplitOutcomes(item: INodeOutput<T>, state: State<T>, levelQueue: TraverseQueue<T>) {
        const { queue } = state;
        const outcomes = this.outcomes(item.id);
        // first will be on the same y level as parent split
        const firstOutcomeId = outcomes.shift();
        if (!firstOutcomeId) throw new Error(`Split "${item.id}" has no outcomes`);
        const first = this.node(firstOutcomeId);
        queue.add(item.id, levelQueue, {
            id: first.id,
            next: first.next,
            name: first.name,
            edges: first.edges,
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
                    anchorMargin: AnchorMargin.Right,
                    anchorFrom: item.id,
                    anchorTo: outcomeId,
                    isAnchor: true,
                    renderIncomes: [item.id],
                    passedIncomes: [item.id],
                    payload: item.payload,
                    next: [outcomeId],
                    childrenOnMatrix: 0
                },
                state,
                true
            );
            queue.add(id, levelQueue, { ...this.node(outcomeId) });
        });
    }
    /**
     * Insert incomes of join node
     * @param item item to handle
     * @param state current state of iteration
     * @param levelQueue
     * @param addItemToQueue
     */
    protected _insertJoinIncomes(
        item: INodeOutput<T>,
        state: State<T>,
        levelQueue: TraverseQueue<T>,
        addItemToQueue: boolean
    ) {
        const { mtx, queue } = state;
        const incomes = item.passedIncomes;

        const lowestY = this._getLowestYAmongIncomes(item, mtx);
        incomes.forEach(incomeId => {
            const found = mtx.findNode(n => n.id === incomeId);
            if (!found) throw new Error(`Income ${incomeId} is not on matrix yet`);
            const [[, y], income] = found;
            if (lowestY === y) {
                item.renderIncomes.push(incomeId);
                income.childrenOnMatrix = Math.min(income.childrenOnMatrix + 1, income.next.length);
                return;
            }
            state.y = y;
            const id = `${incomeId}-${item.id}`;
            item.renderIncomes.push(id);
            this._insertOrSkipNodeOnMatrix(
                {
                    id: id,
                    anchorType: AnchorType.Join,
                    anchorMargin: AnchorMargin.Left,
                    anchorFrom: incomeId,
                    anchorTo: item.id,
                    isAnchor: true,
                    renderIncomes: [incomeId],
                    passedIncomes: [incomeId],
                    payload: item.payload,
                    next: [item.id],
                    childrenOnMatrix: 1 // if we're adding income - join is allready on matrix
                },
                state,
                false
            );
        });
        if (addItemToQueue) queue.add(item.id, levelQueue, ...this.getOutcomesArray(item.id));
    }
}
