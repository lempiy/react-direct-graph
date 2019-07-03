import { INodeOutput, IMatrixNode } from "./node.interface";

/**
 * @class Matrix
 * Low level class used to compute 2D polar coordinates for each node
 * and anchor. Use this class if you want to skip D3 rendering in favor of
 * something else, for example, HTML or Canvas drawing.
 */
export class Matrix<T> {
    private _: Array<Array<INodeOutput<T> | null>> = [];

    /**
     * Get with of matrix
     */
    get width(): number {
        return (
            this._.reduce(
                (length, row) => (row.length > length ? row.length : length),
                0
            ) || 0
        );
    }
    /**
     * Get height of matrix
     */
    get height(): number {
        return this._.length;
    }
    /**
     * Checks whether or not candidate point collides
     * with present points by X vertex.
     * @param point coordinates of point to check
     */
    hasHorizontalCollision([_, y]: number[]): boolean {
        const row = this._[y];
        if (!row) return false;
        return row.some((point: INodeOutput<T> | null) => {
            return !!point && !this.isAllChildrenOnMatrix(point);
        });
    }

    /**
     * Checks whether or not candidate point collides
     * with present points by Y vertex.
     * @param point coordinates of point to check
     */
    hasVerticalCollision([x, y]: number[]): boolean {
        if (x >= this.width) {
            return false;
        }
        return this._.some((row, index) => {
            if (index < y) {
                return false;
            }
            return !!row[x];
        });
    }

    /**
     * Check if all next items of node already placed in matrix
     */
    private isAllChildrenOnMatrix(item: INodeOutput<T>) {
        return item.next.length === item.childrenOnMatrix
    }

    /**
     * Inspects matrix by Y vertex from top to bottom to
     * search first unused Y coordinate (row).
     * If there no free row on the matrix it returns
     * matrix height (Which is equal to first unused row,
     * that currently not exist).
     * @param x column coordinate to use for search
     */
    getFreeRowForColumn(x: number): number {
        if (this.height === 0) return 0;
        let y = this._.findIndex(row => {
            return !row[x];
        });
        if (y === -1) {
            y = this.height;
        }
        return y;
    }
    /**
     * Extend matrix with empty rows
     * @param toValue rows to add to matrix
     */
    private _extendHeight(toValue: number): void {
        while (this.height < toValue) {
            const row: Array<INodeOutput<T> | null> = [];
            row.length = this.width;
            row.fill(null);
            this._.push(row);
        }
    }
    /**
     * Extend matrix with empty columns
     * @param toValue columns to add to matrix
     */
    private _extendWidth(toValue: number): void {
        this._.forEach(row => {
            while (row.length < toValue) {
                row.push(null);
            }
        });
    }
    /**
     * Insert row before y
     * @param y coordinate
     */
    insertRowBefore(y: number) {
        const row: Array<INodeOutput<T> | null> = [];
        row.length = this.width;
        row.fill(null);
        this._.splice(y, 0, row);
    }
    /**
     * Insert column before x
     * @param x coordinate
     */
    insertColumnBefore(x: number) {
        this._.forEach(row => {
            row.splice(x, 0, null);
        });
    }
    /**
     * Find x, y coordinate of first point item that
     * satisfies condition defined in callback
     * @param callback similar to [].find. Returns boolean
     */
    find(callback: (item: INodeOutput<T>) => boolean): number[] | null {
        let result = null;
        this._.forEach((row, y) => {
            row.some((point, x) => {
                if (!point) return false;
                if (callback(point)) {
                    result = [x, y];
                    return true;
                }
                return false;
            });
        });
        return result;
    }
    /**
     * Find first node item that
     * satisfies condition defined in callback
     * @param callback similar to [].find. Returns boolean
     */
    findNode(callback: (item: INodeOutput<T>) => boolean): [number[],INodeOutput<T>] | null {
        let result = null;
        this._.forEach((row, y) => {
            row.some((point, x) => {
                if (!point) return false;
                if (callback(point)) {
                    result = [[x, y], point];
                    return true;
                }
                return false;
            });
        });
        return result;
    }
    /**
     * Return point by x, y coordinate
     */
    getByCoords(x: number, y: number): INodeOutput<T> | null {
        return this._[y][x];
    }
    /**
     * Paste item to particular cell
     * @param coords x and y coordinates for item
     * @param item item to insert
     */
    insert([x, y]: number[], item: INodeOutput<T>) {
        if (this.height <= y) {
            this._extendHeight(y + 1);
        }
        if (this.width <= x) {
            this._extendWidth(x + 1);
        }

        this._[y][x] = item;
    }
    /**
     * @returns key value object where key is node id and
     * value is node with its coordinates
     */
    normalize(): { [id: string]: IMatrixNode<T> } {
        return this._.reduce((acc, row, y) => {
            row.forEach((item, x) => {
                if (!item) return;
                acc[item.id] = { ...item, x, y };
            });
            return acc;
        }, {});
    }
}
