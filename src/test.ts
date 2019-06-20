import { Graph } from "./core"
import {
    withJoinsAndSplitsFixture,
    withJoinsAndSplitsFixtureOneRoot
} from "./fixtures"

describe("Graph traverse", () => {
    describe(`with one node`, () => {
        const graph = new Graph([{ id: "A", next: [], payload: null }])
        const mtx = graph.traverse()
        const nodeMap = mtx.normalize()
        it("returns 2d matrix", () => {
            expect(mtx).toBeTruthy()
        })
        it("should return non empty matrix", () => {
            expect(mtx.height).toBeGreaterThan(0)
            expect(mtx.width).toBeGreaterThan(0)
        })
        it("should contain matrix with all nodes", () => {
            expect(nodeMap).toBeTruthy()
            expect(nodeMap).toHaveProperty("A")
        })
    })
    describe(`with empty`, () => {
        const graph = new Graph([])
        const mtx = graph.traverse()
        const nodeMap = mtx.normalize()
        it("returns 2d matrix", () => {
            expect(mtx).toBeTruthy()
        })
        it("should return empty matrix", () => {
            expect(mtx.height).toEqual(0)
            expect(mtx.width).toEqual(0)
        })
        it("should contain empty matrix values", () => {
            expect(nodeMap).toBeTruthy()
            expect(Object.values(nodeMap)).toHaveLength(0)
        })
    });
    [withJoinsAndSplitsFixture, withJoinsAndSplitsFixtureOneRoot].forEach(
        (fixture, i) => {
            describe(`with joins and splits version ${i + 1}`, () => {
                const graph = new Graph(fixture)
                const mtx = graph.traverse()
                const nodeMap = mtx.normalize()
                it("returns 2d matrix", () => {
                    expect(mtx).toBeTruthy()
                })
                it("should return non empty matrix", () => {
                    expect(mtx.height).toBeGreaterThan(0)
                    expect(mtx.width).toBeGreaterThan(0)
                })
                it("should contain matrix with all nodes", () => {
                    expect(nodeMap).toBeTruthy()
                    fixture.forEach(node => {
                        expect(nodeMap).toHaveProperty(node.id)
                    })
                })
                it("should contain anchors for splits", () => {
                    const splits = fixture.filter(node => node.next.length > 1)
                    splits.forEach(split => {
                        const [, ...outcomesWithAnchors] = [split.next]
                        outcomesWithAnchors.forEach(outcomeId => {
                            const anchorId = `${split}-${outcomeId}`
                            const anchor = nodeMap[anchorId]
                            expect(anchor).toBeTruthy()
                            expect(anchor.isAnchor).toBeTruthy()
                            expect(anchor.anchorFrom).toEqual(split.id)
                            expect(anchor.anchorTo).toEqual(outcomeId)
                        })
                    })
                })
                it("should contain anchors for joins", () => {
                    const { joins } = fixture.reduce(
                        (
                            {
                                joins,
                                _map
                            }: {
                                joins: string[]
                                _map: { [_id: string]: boolean }
                            },
                            node
                        ) => {
                            node.next.forEach(outcomeId => {
                                if (_map[outcomeId]) {
                                    joins.push(outcomeId)
                                } else {
                                    _map[outcomeId] = true
                                }
                            })
                            return { joins, _map }
                        },
                        { joins: [], _map: {} }
                    )
                    joins.forEach(joinId => {
                        const join = fixture.find(n => n.id === joinId)
                        if (!join) {
                            throw new Error(`Join ${joinId} not found`)
                        }
                        const incomes = fixture.filter(n =>
                            n.next.includes(joinId)
                        )
                        let nonAnchorJoinPassed = false
                        incomes.forEach(income => {
                            const anchorId = `${income.id}-${join.id}`
                            const anchor = nodeMap[anchorId]
                            if (!anchor && !nonAnchorJoinPassed) {
                                nonAnchorJoinPassed = true
                                return
                            }
                            expect(anchor).toBeTruthy()
                            expect(anchor.isAnchor).toBeTruthy()
                            expect(anchor.anchorFrom).toEqual(income.id)
                            expect(anchor.anchorTo).toEqual(join.id)
                        })
                    })
                })
            })
        }
    )
})
