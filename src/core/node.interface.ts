/**
 * Types of nodes for internal usage
 */
export enum NodeType {
    RootSimple = "ROOT-SIMPLE",
    RootSplit = "ROOT-SPLIT",
    Simple = "SIMPLE",
    Split = "SPLIT",
    Join = "JOIN",
    SplitJoin = "SPLIT-JOIN"
}
/**
 * Types of anchors.
 * Join is anchor (vertex) between node and its join outcome:
 * N-J
 * N_|
 * N_|
 * Split is anchor (vertex) between node and its split income:
 * S-N
 * |_N
 * |_N
 */
export enum AnchorType {
    Join = "JOIN",
    Split = "SPLIT",
    Loop = "LOOP"
}

export enum AnchorMargin {
    None = "NONE",
    Left = "LEFT",
    Right = "RIGHT"
}

export interface INodeInput<T> {
    /**
     * Unique key for node. Duplicates are not allowed.
     */
    id: string;
    /**
     * Outcomes of current node. Empty array if node is leaf.
     */
    next: string[];
    /**
     * Name of current node.
     */
    name?: string;
    /**
     * Name of node edges.
     */
    edges?: string[];
    /**
     * Payload data to transfer with current node events. Use whatever you want here.
     */
    payload: T;
}

export interface INodeOutput<T> extends INodeInput<T> {
    /**
     * Defines whether or not node is pseudo-node - anchor.
     * Which is used to draw split and join edges.
     * @default false
     */
    isAnchor?: boolean;
    /**
     * Type of anchor. Only exists if isAnchor is true.
     */
    anchorType?: AnchorType;
    /**
     * Id if the anchor income. Only exists if isAnchor is true.
     */
    anchorFrom?: string;
    /**
     * Id if the anchor outcome. Only exists if isAnchor is true.
     */
    anchorTo?: string;
    /**
     * Anchor position inside cell over x axis.
     */
    anchorMargin?: AnchorMargin;
    /**
     * First level node incomes passed during travesal. Ignores join
     * anchor. Mostly for tech usage. To recognize rendering parents
     * Use renderIncomes.
     */
    passedIncomes: string[];
    /**
     * First level node incomes in rendering context. Can be used for
     * backward travesal. Includes both types of anchors.
     */
    renderIncomes: string[];
    /**
     * Number of outcomes that already been placed on matrix
     */
    childrenOnMatrix: number;
}

export interface IMatrixNode<T> extends INodeOutput<T> {
    /**
     * X coordinate of node
     */
    x: number;
    /**
     * Y coordinate of node
     */
    y: number;
}
