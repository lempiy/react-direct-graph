import {getCellCenter, getCellEntry, VectorDirection} from "../../utils";
import {AnchorMargin, IMatrixNode} from "../../core";

export function getPointWithResolver<T>(
    direction: VectorDirection,
    cellSize: number,
    padding: number,
    item: IMatrixNode<T>,
    margin: AnchorMargin
): number[] {
    let x1, y1;
    if (item.isAnchor) {
        [x1, y1] = getCellCenter(cellSize, padding, item.x, item.y, margin);
    } else {
        [x1, y1] = getCellEntry(
            direction,
            cellSize,
            padding,
            item.x,
            item.y,
            margin
        );
    }
    return [x1, y1];
}
