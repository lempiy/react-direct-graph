import { Graph } from "./core";
import { withJoinsAndSplitsFixture } from "./fixtures";

describe("Graph traverse", () => {
    describe("with joins and splits", () => {
        const graph = new Graph(withJoinsAndSplitsFixture);
        const mtx = graph.traverse();
        it("returns 2d matrix", () => {
            expect(mtx).toBeTruthy();
        });
        it("should return non empty matrix", () => {
            expect(mtx.height).toBeGreaterThan(0);
            expect(mtx.width).toBeGreaterThan(0);
        });
    });
});
