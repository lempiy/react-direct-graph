import { INodeOutput } from "./node.interface"

export interface IQueueItem<T> {
    id: string
    payload: T
    next: string[]
    name?: string
    nameOrientation?: "bottom" | "top"
    edgeNames?: string[]
}

/**
 * @class TraverseQueue
 * Special queue that is used for horizontal
 * graph traversing
 */
export class TraverseQueue<T> {
    private _: INodeOutput<T>[] = [];
    /**
     * Add items to queue. If items already exist in this queue
     * or bufferQueue do nothing but push new passed income to
     * existing queue item
     * @param incomeId income id for each element
     * @param bufferQueue buffer queue to also check for duplicates
     * @param items queue items to add
     */
    add(
        incomeId: string | null,
        bufferQueue: TraverseQueue<T> | null,
        ...items: IQueueItem<T>[]
    ) {
        items.forEach(itm => {
            const item =
                this.find(item => item.id === itm.id) ||
                (bufferQueue
                    ? bufferQueue.find(item => item.id === itm.id)
                    : null);
            if (item && incomeId) {
                item.passedIncomes.push(incomeId);
                return
            }
            this._.push({
                id: itm.id,
                next: itm.next,
                name: itm.name,
                nameOrientation: itm.nameOrientation,
                edgeNames: itm.edgeNames,
                payload: itm.payload,
                passedIncomes: incomeId ? [incomeId] : [],
                renderIncomes: incomeId ? [incomeId] : [],
                childrenOnMatrix: 0
            })
        })
    }

    find(cb: (item: INodeOutput<T>) => boolean): INodeOutput<T> | void {
        return this._.find(cb)
    }
    /**
     * Push item to queue. Skipping `add` method additional phases.
     * @param item node item to add
     */
    push(item: INodeOutput<T>): void {
        this._.push(item)
    }
    /**
     * get current queue length
     */
    get length(): number {
        return this._.length
    }
    /**
     * @param cb callback with condition to check
     * @returns true if at list one item satified condition in callback
     */
    some(cb: (item: INodeOutput<T>) => boolean): boolean {
        return this._.some(cb)
    }
    /**
     * Shift first element
     * @returns first element from the queue
     */
    shift(): INodeOutput<T> | void {
        return this._.shift()
    }
    /**
     * Create new queue and extract of current
     * elements of this queue new clone
     * @returns newQueue new queue with items from old queue
     */
    drain(): TraverseQueue<T> {
        const newQueue = new TraverseQueue<T>();
        newQueue._ = newQueue._.concat(this._);
        this._ = [];
        return newQueue
    }
}
