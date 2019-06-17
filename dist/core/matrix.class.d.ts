import { INodeOutput, IMatrixNode } from "./node.interface";
/**
 * @class Matrix
 * Low level class used to compute 2D polar coordinates for each node
 * and anchor. Use this class if you want to skip D3 rendering in favor of
 * something else, for example, HTML or Canvas drawing.
 */
export declare class Matrix<T> {
    private _;
    /**
     * Get with of matrix
     */
    readonly width: number;
    /**
     * Get height of matrix
     */
    readonly height: number;
    /**
     * Checks whether or not candidate point collides
     * with present points by X vertex.
     * @param point coordinates of point to check
     */
    hasHorizontalCollision([_, y]: number[]): boolean;
    /**
     * Checks whether or not candidate point collides
     * with present points by Y vertex.
     * @param point coordinates of point to check
     */
    hasVerticalCollision([x, y]: number[]): boolean;
    /**
     * Inspects matrix by Y vertex from top to bottom to
     * search first unused Y coordinate (row).
     * If there no free row on the matrix it returns
     * matrix height (Which is equal to first unused row,
     * that currently not exist).
     * @param x column coordinate to use for search
     */
    getFreeRowForColumn(x: number): number;
    /**
     * Extend matrix with empty rows
     * @param toValue rows to add to matrix
     */
    private _extendHeight;
    /**
     * Extend matrix with empty columns
     * @param toValue columns to add to matrix
     */
    private _extendWidth;
    /**
     * Insert row before y
     * @param y coordinate
     */
    insertRowBefore(y: number): void;
    /**
     * Insert column before x
     * @param x coordinate
     */
    insertColumnBefore(x: number): void;
    /**
     * Find x, y coordinate of first point item that
     * satisfies condition defined in callback
     * @param callback similar to [].find. Returns boolean
     */
    find(callback: (item: INodeOutput<T>) => boolean): number[] | null;
    /**
     * Paste item to particular cell
     * @param coords x and y coordinates for item
     * @param item item to insert
     */
    insert([x, y]: number[], item: INodeOutput<T>): void;
    /**
     * @returns key value object where key is node id and
     * value is node with its coordinates
     */
    normalize(): {
        [id: string]: IMatrixNode<T>;
    };
}
