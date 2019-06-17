'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

/**
 * Types of nodes for internal usage
 */
var NodeType;
(function (NodeType) {
    NodeType["RootSimple"] = "ROOT-SIMPLE";
    NodeType["RootSplit"] = "ROOT-SPLIT";
    NodeType["Simple"] = "SIMPLE";
    NodeType["Split"] = "SPLIT";
    NodeType["Join"] = "JOIN";
})(NodeType || (NodeType = {}));
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
var AnchorType;
(function (AnchorType) {
    AnchorType["Join"] = "JOIN";
    AnchorType["Split"] = "SPLIT";
})(AnchorType || (AnchorType = {}));

/**
 * @class TraverseQueue
 * Special queue that is used for horizontal
 * graph traversing
 */
var TraverseQueue = /** @class */ (function () {
    function TraverseQueue() {
        this._ = [];
    }
    /**
     * Add items to queue. If items already exist in this queue
     * or bufferQueue do nothing but push new passed income to
     * existing queue item
     * @param incomeId income id for each element
     * @param bufferQueue buffer queue to also check for dulicates
     * @param items queue items to add
     */
    TraverseQueue.prototype.add = function (incomeId, bufferQueue) {
        var _this = this;
        var items = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            items[_i - 2] = arguments[_i];
        }
        items.forEach(function (itm) {
            var item = _this.find(function (item) { return item.id === itm.id; }) ||
                (bufferQueue
                    ? bufferQueue.find(function (item) { return item.id === itm.id; })
                    : null);
            if (item && incomeId) {
                item.passedIncomes.push(incomeId);
                return;
            }
            _this._.push({
                id: itm.id,
                next: itm.next,
                payload: itm.payload,
                passedIncomes: incomeId ? [incomeId] : [],
                renderIncomes: incomeId ? [incomeId] : []
            });
        });
    };
    TraverseQueue.prototype.find = function (cb) {
        return this._.find(cb);
    };
    /**
     * Push item to queue. Skipping `add` method additional phases.
     * @param item node item to add
     */
    TraverseQueue.prototype.push = function (item) {
        this._.push(item);
    };
    Object.defineProperty(TraverseQueue.prototype, "length", {
        /**
         * get current queue length
         */
        get: function () {
            return this._.length;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param cb callback with condition to check
     * @returns true if at list one item satified condition in callback
     */
    TraverseQueue.prototype.some = function (cb) {
        return this._.some(cb);
    };
    /**
     * Shift first element
     * @returns first element from the queue
     */
    TraverseQueue.prototype.shift = function () {
        return this._.shift();
    };
    /**
     * Create new queue and extract of current
     * elements of this queue new clone
     * @returns newQueue new queue with items from old queue
     */
    TraverseQueue.prototype.drain = function () {
        var newQueue = new TraverseQueue();
        newQueue._ = newQueue._.concat(this._);
        this._ = [];
        return newQueue;
    };
    return TraverseQueue;
}());

/**
 * @class Matrix
 * Low level class used to compute 2D polar coordinates for each node
 * and anchor. Use this class if you want to skip D3 rendering in favor of
 * something else, for example, HTML or Canvas drawing.
 */
var Matrix = /** @class */ (function () {
    function Matrix() {
        this._ = [];
    }
    Object.defineProperty(Matrix.prototype, "width", {
        /**
         * Get with of matrix
         */
        get: function () {
            return (this._.reduce(function (length, row) { return (row.length > length ? row.length : length); }, 0) || 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Matrix.prototype, "height", {
        /**
         * Get height of matrix
         */
        get: function () {
            return this._.length;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Checks whether or not candidate point collides
     * with present points by X vertex.
     * @param point coordinates of point to check
     */
    Matrix.prototype.hasHorizontalCollision = function (_a) {
        var _ = _a[0], y = _a[1];
        var row = this._[y];
        if (!row)
            return false;
        return row.some(function (point) { return !!point; });
    };
    /**
     * Checks whether or not candidate point collides
     * with present points by Y vertex.
     * @param point coordinates of point to check
     */
    Matrix.prototype.hasVerticalCollision = function (_a) {
        var x = _a[0], y = _a[1];
        if (x >= this.width) {
            return false;
        }
        return this._.some(function (row, index) {
            if (index < y) {
                return false;
            }
            return !!row[x];
        });
    };
    /**
     * Inspects matrix by Y vertex from top to bottom to
     * search first unused Y coordinate (row).
     * If there no free row on the matrix it returns
     * matrix height (Which is equal to first unused row,
     * that currently not exist).
     * @param x column coordinate to use for search
     */
    Matrix.prototype.getFreeRowForColumn = function (x) {
        if (this.height === 0)
            return 0;
        var y = this._.findIndex(function (row) {
            return !row[x];
        });
        if (y === -1) {
            y = this.height;
        }
        return y;
    };
    /**
     * Extend matrix with empty rows
     * @param toValue rows to add to matrix
     */
    Matrix.prototype._extendHeight = function (toValue) {
        while (this.height < toValue) {
            var row = [];
            row.length = this.width;
            row.fill(null);
            this._.push(row);
        }
    };
    /**
     * Extend matrix with empty columns
     * @param toValue columns to add to matrix
     */
    Matrix.prototype._extendWidth = function (toValue) {
        this._.forEach(function (row) {
            while (row.length < toValue) {
                row.push(null);
            }
        });
    };
    /**
     * Insert row before y
     * @param y coordinate
     */
    Matrix.prototype.insertRowBefore = function (y) {
        var row = [];
        row.length = this.width;
        row.fill(null);
        this._.splice(y, 0, row);
    };
    /**
     * Insert column before x
     * @param x coordinate
     */
    Matrix.prototype.insertColumnBefore = function (x) {
        this._.forEach(function (row) {
            row.splice(x, 0, null);
        });
    };
    /**
     * Find x, y coordinate of first point item that
     * satisfies condition defined in callback
     * @param callback similar to [].find. Returns boolean
     */
    Matrix.prototype.find = function (callback) {
        var result = null;
        this._.forEach(function (row, y) {
            row.some(function (point, x) {
                if (!point)
                    return false;
                if (callback(point)) {
                    result = [x, y];
                    return true;
                }
                return false;
            });
        });
        return result;
    };
    /**
     * Paste item to particular cell
     * @param coords x and y coordinates for item
     * @param item item to insert
     */
    Matrix.prototype.insert = function (_a, item) {
        var x = _a[0], y = _a[1];
        if (this.height <= y) {
            this._extendHeight(y + 1);
        }
        if (this.width <= x) {
            this._extendWidth(x + 1);
        }
        this._[y][x] = item;
    };
    /**
     * @returns key value object where key is node id and
     * value is node with its coordinates
     */
    Matrix.prototype.normalize = function () {
        return this._.reduce(function (acc, row, y) {
            row.forEach(function (item, x) {
                if (!item)
                    return;
                acc[item.id] = __assign({}, item, { x: x, y: y });
            });
            return acc;
        }, {});
    };
    return Matrix;
}());

var MAX_ITERATIONS = 10000;
/**
 * @class Graph
 * Main compute class used to transform
 * linked list of nodes to coordinate matrix
 */
var Graph = /** @class */ (function () {
    function Graph(list) {
        this._list = [];
        this._nodesMap = {};
        this._incomesByNodeIdMap = {};
        this._outcomesByNodeIdMap = {};
        this.applyList(list);
    }
    /**
     * Fill graph with new nodes
     * @param list input linked list of nodes
     */
    Graph.prototype.applyList = function (list) {
        var _this = this;
        this._incomesByNodeIdMap = {};
        this._outcomesByNodeIdMap = {};
        this._nodesMap = {};
        this._list = list;
        list.forEach(function (node) {
            if (_this._nodesMap[node.id]) {
                throw new Error("Duplicate node id " + node.id);
            }
            _this._nodesMap[node.id] = node;
            node.next.forEach(function (outcomeId) {
                _this._incomesByNodeIdMap[outcomeId] = _this._incomesByNodeIdMap[outcomeId]
                    ? _this._incomesByNodeIdMap[outcomeId].concat([node.id]) : [node.id];
                var incomes = _this._incomesByNodeIdMap[outcomeId];
                if (new Set(incomes).size !== incomes.length) {
                    throw new Error("Duplicate incomes for node id " + node.id);
                }
            });
            _this._outcomesByNodeIdMap[node.id] = node.next.slice();
            var outcomes = _this._outcomesByNodeIdMap[node.id];
            if (new Set(outcomes).size !== outcomes.length) {
                throw new Error("Duplicate outcomes for node id " + node.id);
            }
        });
    };
    /**
     * Get graph roots.
     * Roots is nodes without incomes
     */
    Graph.prototype.roots = function () {
        var _this = this;
        return this._list.filter(function (node) { return _this.isRoot(node.id); });
    };
    /**
     * Get type of node
     * @param id id of node
     * @returns type of the node
     */
    Graph.prototype.nodeType = function (id) {
        if (this.isRoot(id) && this.isSplit(id))
            return NodeType.RootSplit;
        if (this.isRoot(id))
            return NodeType.RootSimple;
        if (this.isSplit(id))
            return NodeType.Split;
        if (this.isJoin(id))
            return NodeType.Join;
        return NodeType.Simple;
    };
    /**
     * Whether or node is split
     * @param id id of node
     */
    Graph.prototype.isSplit = function (id) {
        return (this._outcomesByNodeIdMap[id] &&
            this._outcomesByNodeIdMap[id].length > 1);
    };
    /**
     * Whether or node is join
     * @param id id of node
     */
    Graph.prototype.isJoin = function (id) {
        return (this._incomesByNodeIdMap[id] &&
            this._incomesByNodeIdMap[id].length > 1);
    };
    /**
     * Whether or node is root
     * @param id id of node
     */
    Graph.prototype.isRoot = function (id) {
        return (!this._incomesByNodeIdMap[id] ||
            !this._incomesByNodeIdMap[id].length);
    };
    /**
     * Get outcomes of node by id
     * @param id id of node
     */
    Graph.prototype.outcomes = function (id) {
        return this._outcomesByNodeIdMap[id];
    };
    /**
     * Get incomes of node by id
     * @param id id of node
     */
    Graph.prototype.incomes = function (id) {
        return this._incomesByNodeIdMap[id];
    };
    /**
     * Get node by id
     * @param id node id
     */
    Graph.prototype.node = function (id) {
        return this._nodesMap[id];
    };
    /**
     * Check if item has unresolved incomes
     * @param item item to check
     */
    Graph.prototype._joinHasUnresolvedIncomes = function (item) {
        return item.passedIncomes.length != this.incomes(item.id).length;
    };
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
    Graph.prototype._insertOrSkipNodeOnMatrix = function (item, state, checkCollision) {
        var mtx = state.mtx;
        // if point collides by x vertex, insert new row before y position
        if (checkCollision && mtx.hasHorizontalCollision([state.x, state.y])) {
            mtx.insertRowBefore(state.y);
        }
        mtx.insert([state.x, state.y], item);
        return true;
    };
    /**
     * Get all items incomes and find parent Y with the lowest
     * Y coordinate on the matrix
     * @param item target item
     * @param mtx matrix to use as source
     */
    Graph.prototype._getLowestYAmongIncomes = function (item, mtx) {
        var incomes = item.passedIncomes;
        if (incomes && incomes.length) {
            // get lowest income y
            var items = incomes.map(function (id) {
                var coords = mtx.find(function (item) { return item.id === id; });
                if (!coords) {
                    throw new Error("Cannot find coordinates for passed income: \"" + id + "\"");
                }
                return coords[1];
            });
            var y = Math.min.apply(Math, items);
            return y;
        }
        return 0;
    };
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
    Graph.prototype._processOrSkipNodeOnMatrix = function (item, state) {
        var mtx = state.mtx, queue = state.queue;
        if (item.passedIncomes && item.passedIncomes.length) {
            state.y = this._getLowestYAmongIncomes(item, mtx);
        }
        // if point collides by y vertex, skipp it to next x
        if (mtx.hasVerticalCollision([state.x, state.y])) {
            queue.push(item);
            return false;
        }
        return this._insertOrSkipNodeOnMatrix(item, state, false);
    };
    /**
     * traverse main method to get coordinates matrix from graph
     * @returns 2D matrix containing all nodes and anchors
     */
    Graph.prototype.traverse = function () {
        var _this = this;
        var roots = this.roots();
        var state = {
            mtx: new Matrix(),
            queue: new TraverseQueue(),
            x: 0,
            y: 0
        };
        var _safe = 0;
        var mtx = state.mtx, queue = state.queue;
        queue.add.apply(queue, [null,
            null].concat(roots.map(function (r) { return ({ id: r.id, payload: r.payload, next: r.next }); })));
        var isInserted = false;
        var _loop_1 = function () {
            var levelQueue = queue.drain();
            var _loop_2 = function () {
                _safe++;
                var item = levelQueue.shift();
                if (!item)
                    throw new Error("Cannot shift from buffer queue");
                switch (this_1.nodeType(item.id)) {
                    case NodeType.RootSimple:
                        state.y = mtx.getFreeRowForColumn(0);
                    case NodeType.Simple:
                        isInserted = this_1._processOrSkipNodeOnMatrix(item, state);
                        if (isInserted) {
                            queue.add.apply(queue, [item.id,
                                levelQueue].concat(this_1.outcomes(item.id).map(function (outcomeId) {
                                var out = _this.node(outcomeId);
                                return {
                                    id: out.id,
                                    next: out.next,
                                    payload: out.payload
                                };
                            })));
                        }
                        break;
                    case NodeType.RootSplit:
                        state.y = mtx.getFreeRowForColumn(0);
                    case NodeType.Split:
                        isInserted = this_1._processOrSkipNodeOnMatrix(item, state);
                        if (isInserted) {
                            var outcomes = this_1.outcomes(item.id);
                            // first will be on the same y level as parent split
                            var firstOutcomeId = outcomes.shift();
                            if (!firstOutcomeId)
                                throw new Error("Split \"" + item.id + "\" has no outcomes");
                            var first = this_1.node(firstOutcomeId);
                            queue.add(item.id, levelQueue, {
                                id: first.id,
                                next: first.next,
                                payload: first.payload
                            });
                            // rest will create anchor with shift down by one
                            outcomes.forEach(function (outcomeId) {
                                state.y++;
                                var id = item.id + "-" + outcomeId;
                                _this._insertOrSkipNodeOnMatrix({
                                    id: id,
                                    anchorType: AnchorType.Split,
                                    anchorFrom: item.id,
                                    anchorTo: outcomeId,
                                    isAnchor: true,
                                    renderIncomes: [item.id],
                                    passedIncomes: [item.id],
                                    payload: item.payload,
                                    next: [outcomeId]
                                }, state, true);
                                var out = _this.node(outcomeId);
                                queue.add(id, levelQueue, {
                                    id: out.id,
                                    next: out.next,
                                    payload: out.payload
                                });
                            });
                        }
                        break;
                    case NodeType.Join:
                        if (this_1._joinHasUnresolvedIncomes(item)) {
                            queue.push(item);
                        }
                        else {
                            isInserted = this_1._processOrSkipNodeOnMatrix(item, state);
                            item.renderIncomes = [];
                            if (isInserted) {
                                var incomes = item.passedIncomes;
                                var lowestY_1 = this_1._getLowestYAmongIncomes(item, mtx);
                                incomes.forEach(function (incomeId) {
                                    var point = mtx.find(function (item) { return item.id === incomeId; });
                                    if (!point)
                                        throw new Error("Income " + incomeId + " not found on matrix");
                                    var y = point[1];
                                    if (lowestY_1 === y) {
                                        item.renderIncomes.push(incomeId);
                                        return;
                                    }
                                    state.y = y;
                                    var id = incomeId + "-" + item.id;
                                    item.renderIncomes.push(id);
                                    _this._insertOrSkipNodeOnMatrix({
                                        id: id,
                                        anchorType: AnchorType.Join,
                                        anchorFrom: incomeId,
                                        anchorTo: item.id,
                                        isAnchor: true,
                                        renderIncomes: [incomeId],
                                        passedIncomes: [incomeId],
                                        payload: item.payload,
                                        next: [item.id]
                                    }, state, false);
                                });
                                queue.add.apply(queue, [item.id,
                                    levelQueue].concat(this_1.outcomes(item.id).map(function (outcomeId) {
                                    var out = _this.node(outcomeId);
                                    return {
                                        id: out.id,
                                        next: out.next,
                                        payload: out.payload
                                    };
                                })));
                            }
                        }
                        break;
                }
                if (_safe > MAX_ITERATIONS) {
                    throw new Error("Infinite loop");
                    return { value: mtx };
                }
            };
            while (levelQueue.length) {
                var state_2 = _loop_2();
                if (typeof state_2 === "object")
                    return state_2;
            }
            state.x++;
        };
        var this_1 = this;
        while (queue.length) {
            var state_1 = _loop_1();
            if (typeof state_1 === "object")
                return state_1.value;
        }
        return mtx;
    };
    return Graph;
}());

var VectorDirection;
(function (VectorDirection) {
    VectorDirection["Top"] = "top";
    VectorDirection["Bottom"] = "bottom";
    VectorDirection["Right"] = "right";
    VectorDirection["Left"] = "left";
})(VectorDirection || (VectorDirection = {}));
var getVectorDirection = function (x1, y1, x2, y2) {
    if (y1 === y2) {
        if (x1 < x2)
            return VectorDirection.Right;
        else
            return VectorDirection.Left;
    }
    else {
        if (y1 < y2)
            return VectorDirection.Bottom;
        else
            return VectorDirection.Top;
    }
};
var getCellCenter = function (sellSize, cellX, cellY) {
    var x = cellX * sellSize + sellSize * 0.5;
    var y = cellY * sellSize + sellSize * 0.5;
    return [x, y];
};
var getCellTopEntry = function (sellSize, padding, cellX, cellY) {
    var x = getCellCenter(sellSize, cellX, cellY)[0];
    var y = cellY * sellSize + padding;
    return [x, y];
};
var getCellBottomEntry = function (sellSize, padding, cellX, cellY) {
    var x = getCellCenter(sellSize, cellX, cellY)[0];
    var y = cellY * sellSize + (sellSize - padding);
    return [x, y];
};
var getCellRightEntry = function (sellSize, padding, cellX, cellY) {
    var _a = getCellCenter(sellSize, cellX, cellY), y = _a[1];
    var x = cellX * sellSize + (sellSize - padding);
    return [x, y];
};
var getCellLeftEntry = function (sellSize, padding, cellX, cellY) {
    var _a = getCellCenter(sellSize, cellX, cellY), y = _a[1];
    var x = cellX * sellSize + padding;
    return [x, y];
};

var DefaultNodeIcon = /** @class */ (function (_super) {
    __extends(DefaultNodeIcon, _super);
    function DefaultNodeIcon() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DefaultNodeIcon.prototype.getColor = function (node, incomes) {
        if (incomes && incomes.length > 1)
            return "#e25300";
        if (node.next && node.next.length > 1)
            return "#008c15";
        return "#193772";
    };
    DefaultNodeIcon.prototype.render = function () {
        var _a = this.props, node = _a.node, incomes = _a.incomes;
        return (React.createElement("svg", { version: "1.1", x: "0px", y: "0px", viewBox: "0 0 52 52" },
            React.createElement("g", null,
                React.createElement("path", { style: {
                        fill: this.getColor(node, incomes),
                        stroke: this.getColor(node, incomes)
                    }, d: "M40.824,52H11.176C5.003,52,0,46.997,0,40.824V11.176C0,5.003,5.003,0,11.176,0h29.649   C46.997,0,52,5.003,52,11.176v29.649C52,46.997,46.997,52,40.824,52z" }),
                React.createElement("g", { fill: "#ffffff", stroke: "#ffffff" },
                    React.createElement("text", { strokeWidth: "1", x: "0", y: "0", dx: "26", dy: "30", textAnchor: "middle", fontSize: "14px" }, node.id)))));
    };
    return DefaultNodeIcon;
}(React.Component));

var withForeignObject = function (WrappedSVGComponent) { return function (_a) {
    var width = _a.width, height = _a.height, x = _a.x, y = _a.y, props = __rest(_a, ["width", "height", "x", "y"]);
    return (React.createElement("foreignObject", { x: x, y: y, width: width, height: height, className: "node-icon" },
        React.createElement(WrappedSVGComponent, __assign({}, props))));
}; };

var GraphElement = /** @class */ (function (_super) {
    __extends(GraphElement, _super);
    function GraphElement() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.wrapEventHandler = function (cb, node, incomes) {
            return function (e) { return cb(e, node, incomes); };
        };
        return _this;
    }
    GraphElement.prototype.getLineToIncome = function (sellSize, padding, node, income) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        var direction = getVectorDirection(node.x, node.y, income.x, income.y);
        var x1, y1, x2, y2;
        switch (direction) {
            case VectorDirection.Top:
                if (node.isAnchor) {
                    _a = getCellCenter(sellSize, node.x, node.y), x1 = _a[0], y1 = _a[1];
                }
                else {
                    _b = getCellTopEntry(sellSize, padding, node.x, node.y), x1 = _b[0], y1 = _b[1];
                }
                if (income.isAnchor) {
                    _c = getCellCenter(sellSize, income.x, income.y), x2 = _c[0], y2 = _c[1];
                }
                else {
                    _d = getCellBottomEntry(sellSize, padding, income.x, income.y), x2 = _d[0], y2 = _d[1];
                }
                break;
            case VectorDirection.Bottom:
                if (node.isAnchor) {
                    _e = getCellCenter(sellSize, node.x, node.y), x1 = _e[0], y1 = _e[1];
                }
                else {
                    _f = getCellBottomEntry(sellSize, padding, node.x, node.y), x1 = _f[0], y1 = _f[1];
                }
                if (income.isAnchor) {
                    _g = getCellCenter(sellSize, income.x, income.y), x2 = _g[0], y2 = _g[1];
                }
                else {
                    _h = getCellTopEntry(sellSize, padding, income.x, income.y), x2 = _h[0], y2 = _h[1];
                }
                break;
            case VectorDirection.Right:
                if (node.isAnchor) {
                    _j = getCellCenter(sellSize, node.x, node.y), x1 = _j[0], y1 = _j[1];
                }
                else {
                    _k = getCellRightEntry(sellSize, padding, node.x, node.y), x1 = _k[0], y1 = _k[1];
                }
                if (income.isAnchor) {
                    _l = getCellCenter(sellSize, income.x, income.y), x2 = _l[0], y2 = _l[1];
                }
                else {
                    _m = getCellLeftEntry(sellSize, padding, income.x, income.y), x2 = _m[0], y2 = _m[1];
                }
                break;
            case VectorDirection.Left:
                if (node.isAnchor) {
                    _o = getCellCenter(sellSize, node.x, node.y), x1 = _o[0], y1 = _o[1];
                }
                else {
                    _p = getCellLeftEntry(sellSize, padding, node.x, node.y), x1 = _p[0], y1 = _p[1];
                }
                if (income.isAnchor) {
                    _q = getCellCenter(sellSize, income.x, income.y), x2 = _q[0], y2 = _q[1];
                }
                else {
                    _r = getCellRightEntry(sellSize, padding, income.x, income.y), x2 = _r[0], y2 = _r[1];
                }
                break;
        }
        return {
            node: node,
            income: income,
            line: [x1, y1, x2, y2]
        };
    };
    GraphElement.prototype.getLines = function (sellSize, padding, node, incomes) {
        var _this = this;
        return node.isAnchor
            ? incomes.map(function (income) {
                return _this.getLineToIncome(sellSize, padding, income, node);
            })
            : incomes.map(function (income) {
                return _this.getLineToIncome(sellSize, padding, node, income);
            });
    };
    GraphElement.prototype.getCoords = function (sellSize, padding, node) {
        return [node.x * sellSize + padding, node.y * sellSize + padding];
    };
    GraphElement.prototype.getSize = function (sellSize, padding) {
        return sellSize - padding * 2;
    };
    GraphElement.prototype.render = function () {
        var _this = this;
        var _a = this.props, node = _a.node, incomes = _a.incomes, sellSize = _a.sellSize, padding = _a.padding, onNodeClick = _a.onNodeClick, onNodeMouseEnter = _a.onNodeMouseEnter, onNodeMouseLeave = _a.onNodeMouseLeave, onEdgeClick = _a.onEdgeClick, onEdgeMouseEnter = _a.onEdgeMouseEnter, onEdgeMouseLeave = _a.onEdgeMouseLeave;
        var _b = this.getCoords(sellSize, padding, node), x = _b[0], y = _b[1];
        var lines = this.getLines(sellSize, padding, node, incomes);
        var size = this.getSize(sellSize, padding);
        var NodeIcon = withForeignObject(this.props.component ? this.props.component : DefaultNodeIcon);
        return (React.createElement("g", { className: "node-group", style: {
                strokeWidth: 2,
                fill: "#ffffff",
                stroke: "#2d578b"
            } },
            !node.isAnchor && (React.createElement("g", __assign({ className: "node-icon-group" }, {
                onClick: onNodeClick &&
                    this.wrapEventHandler(onNodeClick, node, incomes),
                onMouseEnter: onNodeMouseEnter &&
                    this.wrapEventHandler(onNodeMouseEnter, node, incomes),
                onMouseLeave: onNodeMouseLeave &&
                    this.wrapEventHandler(onNodeMouseLeave, node, incomes)
            }),
                React.createElement(NodeIcon, { x: x, y: y, height: size, width: size, node: node, incomes: incomes }))),
            lines.map(function (l, i) { return (React.createElement("line", __assign({}, {
                onClick: onEdgeClick &&
                    _this.wrapEventHandler(onEdgeClick, l.node, [
                        l.income
                    ]),
                onMouseEnter: onEdgeMouseEnter &&
                    _this.wrapEventHandler(onEdgeMouseEnter, l.node, [l.income]),
                onMouseLeave: onEdgeMouseLeave &&
                    _this.wrapEventHandler(onEdgeMouseLeave, l.node, [l.income])
            }, { key: "line-" + node.id + "-" + i, className: "node-line", x1: l.line[0], y1: l.line[1], x2: l.line[2], y2: l.line[3] }))); })));
    };
    return GraphElement;
}(React.Component));

var Graph$1 = /** @class */ (function (_super) {
    __extends(Graph, _super);
    function Graph() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.getNodeElementInputs = function (nodesMap) {
            return Object.entries(nodesMap).map(function (_a) {
                var _ = _a[0], node = _a[1];
                return ({
                    node: node,
                    incomes: node.renderIncomes.map(function (id) { return nodesMap[id]; })
                });
            });
        };
        return _this;
    }
    Graph.prototype.render = function () {
        var _a = this.props, nodesMap = _a.nodesMap, sellSize = _a.sellSize, padding = _a.padding, widthInCells = _a.widthInCells, heightInCells = _a.heightInCells, restProps = __rest(_a, ["nodesMap", "sellSize", "padding", "widthInCells", "heightInCells"]);
        var elements = this.getNodeElementInputs(nodesMap);
        return (React.createElement("svg", { version: "1", width: widthInCells * sellSize, height: heightInCells * sellSize }, elements.map(function (props) { return (React.createElement(GraphElement, __assign({ key: props.node.id, sellSize: sellSize, padding: padding }, props, restProps))); })));
    };
    return Graph;
}(React.Component));

/**
 * @class DirectGraph
 */
var DirectGraph = /** @class */ (function (_super) {
    __extends(DirectGraph, _super);
    function DirectGraph() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.getNodesMap = function (list) {
            var graph = new Graph(list);
            var mtx = graph.traverse();
            return {
                nodesMap: mtx.normalize(),
                widthInCells: mtx.width,
                heightInCells: mtx.height
            };
        };
        return _this;
    }
    DirectGraph.prototype.render = function () {
        var _a = this.props, list = _a.list, viewProps = __rest(_a, ["list"]);
        var dataProps = this.getNodesMap(list);
        return React.createElement(Graph$1, __assign({}, dataProps, viewProps));
    };
    return DirectGraph;
}(React.Component));

exports.default = DirectGraph;
//# sourceMappingURL=index.js.map
