import { INodeOutput } from "./node.interface";
export interface IQueueItem<T> {
    id: string;
    payload: T;
    next: string[];
    name?: string;
    edges?: string[];
}
/**
 * @class TraverseQueue
 * Special queue that is used for horizontal
 * graph traversing
 */
export declare class TraverseQueue<T> {
    private _;
    /**
     * Add items to queue. If items already exist in this queue
     * or bufferQueue do nothing but push new passed income to
     * existing queue item
     * @param incomeId income id for each element
     * @param bufferQueue buffer queue to also check for duplicates
     * @param items queue items to add
     */
    add(incomeId: string | null, bufferQueue: TraverseQueue<T> | null, ...items: IQueueItem<T>[]): void;
    find(cb: (item: INodeOutput<T>) => boolean): INodeOutput<T> | void;
    /**
     * Push item to queue. Skipping `add` method additional phases.
     * @param item node item to add
     */
    push(item: INodeOutput<T>): void;
    /**
     * get current queue length
     */
    readonly length: number;
    /**
     * @param cb callback with condition to check
     * @returns true if at list one item satified condition in callback
     */
    some(cb: (item: INodeOutput<T>) => boolean): boolean;
    /**
     * Shift first element
     * @returns first element from the queue
     */
    shift(): INodeOutput<T> | void;
    /**
     * Create new queue and extract of current
     * elements of this queue new clone
     * @returns newQueue new queue with items from old queue
     */
    drain(): TraverseQueue<T>;
}
