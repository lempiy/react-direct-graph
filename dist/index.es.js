import { createElement, Component, Fragment, PureComponent } from 'react';

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
    NodeType["SplitJoin"] = "SPLIT-JOIN";
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
    AnchorType["Loop"] = "LOOP";
})(AnchorType || (AnchorType = {}));
var AnchorMargin;
(function (AnchorMargin) {
    AnchorMargin["None"] = "NONE";
    AnchorMargin["Left"] = "LEFT";
    AnchorMargin["Right"] = "RIGHT";
})(AnchorMargin || (AnchorMargin = {}));
//# sourceMappingURL=node.interface.js.map

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
     * @param bufferQueue buffer queue to also check for duplicates
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
                name: itm.name,
                nameOrientation: itm.nameOrientation,
                edgeNames: itm.edgeNames,
                payload: itm.payload,
                passedIncomes: incomeId ? [incomeId] : [],
                renderIncomes: incomeId ? [incomeId] : [],
                childrenOnMatrix: 0
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
//# sourceMappingURL=traverse-queue.class.js.map

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
            return this._.reduce(function (length, row) { return (row.length > length ? row.length : length); }, 0) || 0;
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
        var _this = this;
        var _ = _a[0], y = _a[1];
        var row = this._[y];
        if (!row)
            return false;
        return row.some(function (point) {
            return !!point && !_this.isAllChildrenOnMatrix(point);
        });
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
     * Check if all next items of node already placed in matrix
     */
    Matrix.prototype.isAllChildrenOnMatrix = function (item) {
        return item.next.length === item.childrenOnMatrix;
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
     * Find first node item that
     * satisfies condition defined in callback
     * @param callback similar to [].find. Returns boolean
     */
    Matrix.prototype.findNode = function (callback) {
        var result = null;
        this._.forEach(function (row, y) {
            row.some(function (point, x) {
                if (!point)
                    return false;
                if (callback(point)) {
                    result = [[x, y], point];
                    return true;
                }
                return false;
            });
        });
        return result;
    };
    /**
     * Return point by x, y coordinate
     */
    Matrix.prototype.getByCoords = function (x, y) {
        return this._[y][x];
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
//# sourceMappingURL=matrix.class.js.map

var isMultiple = function (obj, id) { return obj[id] && obj[id].length > 1; };
/**
 * @class GraphStruct
 * Frame parent-class to simplify graph
 * elements recognition
 */
var GraphStruct = /** @class */ (function () {
    function GraphStruct(list) {
        this._list = [];
        this._nodesMap = {};
        this._incomesByNodeIdMap = {};
        this._outcomesByNodeIdMap = {};
        this._loopsByNodeIdMap = {};
        this.applyList(list);
    }
    /**
     * Fill graph with new nodes
     * @param list input linked list of nodes
     */
    GraphStruct.prototype.applyList = function (list) {
        this._incomesByNodeIdMap = {};
        this._outcomesByNodeIdMap = {};
        this._nodesMap = {};
        this._loopsByNodeIdMap = {};
        this._list = list;
        this._nodesMap = list.reduce(function (map, node) {
            if (map[node.id])
                throw new Error("Duplicate id " + node.id);
            map[node.id] = node;
            return map;
        }, {});
        this.detectIncomesAndOutcomes();
    };
    GraphStruct.prototype.detectIncomesAndOutcomes = function () {
        var _this = this;
        this._list.reduce(function (totalSet, node) {
            if (totalSet.has(node.id))
                return totalSet;
            return _this.traverseVertically(node, new Set(), totalSet);
        }, new Set());
    };
    GraphStruct.prototype.traverseVertically = function (node, branchSet, totalSet) {
        var _this = this;
        if (branchSet.has(node.id))
            throw new Error("Duplicate incomes for node id " + node.id);
        branchSet.add(node.id);
        totalSet.add(node.id);
        node.next.forEach(function (outcomeId) {
            // skip loops which are already detected
            if (_this.isLoopEdge(node.id, outcomeId))
                return;
            // detect loops
            if (branchSet.has(outcomeId)) {
                _this._loopsByNodeIdMap[node.id] = _this._loopsByNodeIdMap[node.id]
                    ? Array.from(new Set(_this._loopsByNodeIdMap[node.id].concat([outcomeId])))
                    : [outcomeId];
                return;
            }
            _this._incomesByNodeIdMap[outcomeId] = _this._incomesByNodeIdMap[outcomeId]
                ? Array.from(new Set(_this._incomesByNodeIdMap[outcomeId].concat([node.id])))
                : [node.id];
            _this._outcomesByNodeIdMap[node.id] = _this._outcomesByNodeIdMap[node.id]
                ? Array.from(new Set(_this._outcomesByNodeIdMap[node.id].concat([outcomeId])))
                : [outcomeId];
            totalSet = _this.traverseVertically(_this._nodesMap[outcomeId], new Set(branchSet), totalSet);
            return;
        });
        return totalSet;
    };
    /**
     * Get graph roots.
     * Roots is nodes without incomes
     */
    GraphStruct.prototype.roots = function () {
        var _this = this;
        return this._list.filter(function (node) { return _this.isRoot(node.id); });
    };
    /**
     * Get type of node
     * @param id id of node
     * @returns type of the node
     */
    GraphStruct.prototype.nodeType = function (id) {
        var nodeType = NodeType.Simple;
        switch (true) {
            case this.isRoot(id) && this.isSplit(id):
                nodeType = NodeType.RootSplit;
                break;
            case this.isRoot(id):
                nodeType = NodeType.RootSimple;
                break;
            case this.isSplit(id) && this.isJoin(id):
                nodeType = NodeType.SplitJoin;
                break;
            case this.isSplit(id):
                nodeType = NodeType.Split;
                break;
            case this.isJoin(id):
                nodeType = NodeType.Join;
                break;
        }
        return nodeType;
    };
    /**
     * Whether or node is split
     * @param id id of node
     */
    GraphStruct.prototype.isSplit = function (id) {
        return isMultiple(this._outcomesByNodeIdMap, id);
    };
    /**
     * Whether or node is join
     * @param id id of node
     */
    GraphStruct.prototype.isJoin = function (id) {
        return isMultiple(this._incomesByNodeIdMap, id);
    };
    /**
     * Whether or node is root
     * @param id id of node
     */
    GraphStruct.prototype.isRoot = function (id) {
        return !this._incomesByNodeIdMap[id] || !this._incomesByNodeIdMap[id].length;
    };
    GraphStruct.prototype.isLoopEdge = function (nodeId, outcomeId) {
        return this._loopsByNodeIdMap[nodeId] && this._loopsByNodeIdMap[nodeId].includes(outcomeId);
    };
    /**
     * Get loops of node by id
     * @param id id of node
     */
    GraphStruct.prototype.loops = function (id) {
        return this._loopsByNodeIdMap[id];
    };
    /**
     * Get outcomes of node by id
     * @param id id of node
     */
    GraphStruct.prototype.outcomes = function (id) {
        return this._outcomesByNodeIdMap[id] || [];
    };
    /**
     * Get incomes of node by id
     * @param id id of node
     */
    GraphStruct.prototype.incomes = function (id) {
        return this._incomesByNodeIdMap[id];
    };
    /**
     * Get node by id
     * @param id node id
     */
    GraphStruct.prototype.node = function (id) {
        return this._nodesMap[id];
    };
    /**
     * get outcomes inputs helper
     * @param itemId node id
     */
    GraphStruct.prototype.getOutcomesArray = function (itemId) {
        var _this = this;
        return this.outcomes(itemId).map(function (outcomeId) {
            var out = _this.node(outcomeId);
            return {
                id: out.id,
                next: out.next,
                name: out.name,
                nameOrientation: out.nameOrientation,
                edgeNames: out.edgeNames,
                payload: out.payload
            };
        });
    };
    return GraphStruct;
}());
//# sourceMappingURL=graph-struct.class.js.map

/**
 * @class GraphMatrix
 * Compute graph subclass used to interact with matrix
 */
var GraphMatrix = /** @class */ (function (_super) {
    __extends(GraphMatrix, _super);
    function GraphMatrix(list) {
        return _super.call(this, list) || this;
    }
    /**
     * Check if item has unresolved incomes
     * @param item item to check
     */
    GraphMatrix.prototype._joinHasUnresolvedIncomes = function (item) {
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
    GraphMatrix.prototype._insertOrSkipNodeOnMatrix = function (item, state, checkCollision) {
        var mtx = state.mtx;
        // if point collides by x vertex, insert new row before y position
        if (checkCollision && mtx.hasHorizontalCollision([state.x, state.y])) {
            mtx.insertRowBefore(state.y);
        }
        mtx.insert([state.x, state.y], item);
        this._markIncomesAsPassed(mtx, item);
    };
    /**
     * Get all items incomes and find parent Y with the lowest
     * Y coordinate on the matrix
     * @param item target item
     * @param mtx matrix to use as source
     */
    GraphMatrix.prototype._getLowestYAmongIncomes = function (item, mtx) {
        var incomes = item.passedIncomes;
        if (incomes && incomes.length) {
            // get lowest income y
            var items = incomes.map(function (id) {
                var coords = mtx.find(function (item) { return item.id === id; });
                if (!coords)
                    throw new Error("Cannot find coordinates for passed income: \"" + id + "\"");
                return coords[1];
            });
            return Math.min.apply(Math, items);
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
    GraphMatrix.prototype._processOrSkipNodeOnMatrix = function (item, state) {
        var mtx = state.mtx, queue = state.queue;
        if (item.passedIncomes && item.passedIncomes.length) {
            state.y = this._getLowestYAmongIncomes(item, mtx);
        }
        var hasLoops = this.hasLoops(item);
        var loopNodes = hasLoops ? this._handleLoopEdges(item, state) : null;
        var needsLoopSkip = hasLoops && !loopNodes;
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
    };
    GraphMatrix.prototype.hasLoops = function (item) {
        return !!this.loops(item.id);
    };
    GraphMatrix.prototype._handleLoopEdges = function (item, state) {
        var mtx = state.mtx;
        var loops = this.loops(item.id);
        if (!loops)
            throw new Error("No loops found for node " + item.id);
        var loopNodes = loops.map(function (incomeId) {
            if (item.id === incomeId) {
                return {
                    id: incomeId,
                    node: item,
                    coords: [state.x, state.y],
                    isSelfLoop: true
                };
            }
            var coords = mtx.find(function (n) { return n.id === incomeId; });
            if (!coords)
                throw new Error("Loop target '" + incomeId + "' not found on matrix");
            var node = mtx.getByCoords(coords[0], coords[1]);
            if (!node)
                throw new Error("Loop target node'" + incomeId + "' not found on matrix");
            return {
                id: incomeId,
                node: node,
                coords: coords
            };
        });
        var skip = loopNodes.some(function (income) {
            var coords = income.coords;
            return mtx.hasVerticalCollision([state.x, coords[1] ? coords[1] - 1 : 0]);
        });
        if (skip)
            return null;
        return loopNodes;
    };
    GraphMatrix.prototype._markIncomesAsPassed = function (mtx, item) {
        item.renderIncomes.forEach(function (incomeId) {
            var found = mtx.findNode(function (n) { return n.id === incomeId; });
            if (!found)
                throw new Error("Income " + incomeId + " is not on matrix yet");
            var coords = found[0], income = found[1];
            income.childrenOnMatrix = Math.min(income.childrenOnMatrix + 1, income.next.length);
            mtx.insert(coords, income);
        });
    };
    GraphMatrix.prototype._resolveCurrentJoinIncomes = function (mtx, join) {
        this._markIncomesAsPassed(mtx, join);
        join.renderIncomes = [];
    };
    GraphMatrix.prototype._insertLoopEdges = function (item, state, loopNodes) {
        var _this = this;
        var mtx = state.mtx;
        var initialX = state.x;
        var initialY = state.y;
        loopNodes.forEach(function (income) {
            var id = income.id, coords = income.coords, node = income.node;
            var renderIncomeId = item.id;
            if (income.isSelfLoop) {
                state.y = initialY;
                state.x = initialX + 1;
                var selfLoopId = id + "-self";
                renderIncomeId = selfLoopId;
                _this._insertOrSkipNodeOnMatrix({
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
                }, state, false);
            }
            state.y = coords[1];
            var initialHeight = mtx.height;
            var fromId = id + "-" + item.id + "-from";
            var idTo = id + "-" + item.id + "-to";
            node.renderIncomes = node.renderIncomes ? node.renderIncomes.concat([fromId]) : [fromId];
            _this._insertOrSkipNodeOnMatrix({
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
            }, state, true);
            if (initialHeight !== mtx.height)
                initialY++;
            state.x = coords[0];
            _this._insertOrSkipNodeOnMatrix({
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
            }, state, false);
            state.x = initialX;
        });
        state.y = initialY;
        return false;
    };
    /**
     * Insert outcomes of split node
     * @param item item to handle
     * @param state current state of iteration
     * @param levelQueue
     */
    GraphMatrix.prototype._insertSplitOutcomes = function (item, state, levelQueue) {
        var _this = this;
        var queue = state.queue;
        var outcomes = this.outcomes(item.id);
        // first will be on the same y level as parent split
        var firstOutcomeId = outcomes.shift();
        if (!firstOutcomeId)
            throw new Error("Split \"" + item.id + "\" has no outcomes");
        var first = this.node(firstOutcomeId);
        queue.add(item.id, levelQueue, {
            id: first.id,
            next: first.next,
            name: first.name,
            nameOrientation: first.nameOrientation,
            edgeNames: first.edgeNames,
            payload: first.payload
        });
        // rest will create anchor with shift down by one
        outcomes.forEach(function (outcomeId) {
            state.y++;
            var id = item.id + "-" + outcomeId;
            _this._insertOrSkipNodeOnMatrix({
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
            }, state, true);
            queue.add(id, levelQueue, __assign({}, _this.node(outcomeId)));
        });
    };
    /**
     * Insert incomes of join node
     * @param item item to handle
     * @param state current state of iteration
     * @param levelQueue
     * @param addItemToQueue
     */
    GraphMatrix.prototype._insertJoinIncomes = function (item, state, levelQueue, addItemToQueue) {
        var _this = this;
        var mtx = state.mtx, queue = state.queue;
        var incomes = item.passedIncomes;
        var lowestY = this._getLowestYAmongIncomes(item, mtx);
        incomes.forEach(function (incomeId) {
            var found = mtx.findNode(function (n) { return n.id === incomeId; });
            if (!found)
                throw new Error("Income " + incomeId + " is not on matrix yet");
            var _a = found[0], y = _a[1], income = found[1];
            if (lowestY === y) {
                item.renderIncomes.push(incomeId);
                income.childrenOnMatrix = Math.min(income.childrenOnMatrix + 1, income.next.length);
                return;
            }
            state.y = y;
            var id = incomeId + "-" + item.id;
            item.renderIncomes.push(id);
            _this._insertOrSkipNodeOnMatrix({
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
            }, state, false);
        });
        if (addItemToQueue)
            queue.add.apply(queue, [item.id, levelQueue].concat(this.getOutcomesArray(item.id)));
    };
    return GraphMatrix;
}(GraphStruct));
//# sourceMappingURL=graph-matrix.class.js.map

var MAX_ITERATIONS = 10000;
/**
 * @class Graph
 * Main iteration class used to transform
 * linked list of nodes to coordinate matrix
 */
var Graph = /** @class */ (function (_super) {
    __extends(Graph, _super);
    function Graph(list) {
        return _super.call(this, list) || this;
    }
    /**
     * Function to handle split nodes
     * @param item item to handle
     * @param state current state of iteration
     * @param levelQueue buffer subqueue of iteration
     */
    Graph.prototype._handleSplitNode = function (item, state, levelQueue) {
        var isInserted = this._processOrSkipNodeOnMatrix(item, state);
        if (isInserted) {
            this._insertSplitOutcomes(item, state, levelQueue);
        }
    };
    /**
     * Function to handle splitjoin nodes
     * @param item item to handle
     * @param state current state of iteration
     * @param levelQueue buffer subqueue of iteration
     */
    Graph.prototype._handleSplitJoinNode = function (item, state, levelQueue) {
        var queue = state.queue, mtx = state.mtx;
        var isInserted = false;
        if (this._joinHasUnresolvedIncomes(item)) {
            queue.push(item);
        }
        else {
            this._resolveCurrentJoinIncomes(mtx, item);
            isInserted = this._processOrSkipNodeOnMatrix(item, state);
            if (isInserted) {
                this._insertJoinIncomes(item, state, levelQueue, false);
                this._insertSplitOutcomes(item, state, levelQueue);
            }
        }
        return isInserted;
    };
    /**
     * Function to handle join nodes
     * @param item item to handle
     * @param state current state of iteration
     * @param levelQueue buffer subqueue of iteration
     */
    Graph.prototype._handleJoinNode = function (item, state, levelQueue) {
        var queue = state.queue, mtx = state.mtx;
        var isInserted = false;
        if (this._joinHasUnresolvedIncomes(item)) {
            queue.push(item);
        }
        else {
            this._resolveCurrentJoinIncomes(mtx, item);
            isInserted = this._processOrSkipNodeOnMatrix(item, state);
            if (isInserted) {
                this._insertJoinIncomes(item, state, levelQueue, true);
            }
        }
        return isInserted;
    };
    /**
     * Function to handle simple nodes
     * @param item item to handle
     * @param state current state of iteration
     * @param levelQueue buffer subqueue of iteration
     */
    Graph.prototype._handleSimpleNode = function (item, state, levelQueue) {
        var queue = state.queue;
        var isInserted = this._processOrSkipNodeOnMatrix(item, state);
        if (isInserted) {
            queue.add.apply(queue, [item.id, levelQueue].concat(this.getOutcomesArray(item.id)));
        }
        return isInserted;
    };
    /**
     * Method to handle single iteration item
     * @param item queue item to process
     * @param state state of iteration
     * @param levelQueue
     */
    Graph.prototype._traverseItem = function (item, state, levelQueue) {
        var mtx = state.mtx;
        switch (this.nodeType(item.id)) {
            case NodeType.RootSimple:
                // find free column and fallthrough
                state.y = mtx.getFreeRowForColumn(0);
            case NodeType.Simple:
                this._handleSimpleNode(item, state, levelQueue);
                break;
            case NodeType.RootSplit:
                // find free column and fallthrough
                state.y = mtx.getFreeRowForColumn(0);
            case NodeType.Split:
                this._handleSplitNode(item, state, levelQueue);
                break;
            case NodeType.Join:
                this._handleJoinNode(item, state, levelQueue);
                break;
            case NodeType.SplitJoin:
                this._handleSplitJoinNode(item, state, levelQueue);
                break;
        }
    };
    /**
     * Iterate over one level of graph
     * starting from queue top item
     */
    Graph.prototype._traverseLevel = function (iterations, state) {
        var queue = state.queue;
        var levelQueue = queue.drain();
        while (levelQueue.length) {
            iterations++;
            var item = levelQueue.shift();
            if (!item)
                throw new Error("Cannot shift from buffer queue");
            this._traverseItem(item, state, levelQueue);
            if (iterations > MAX_ITERATIONS) {
                throw new Error("Infinite loop");
            }
        }
        return iterations;
    };
    /**
     * Iterate over graph
     * starting from queue root items
     */
    Graph.prototype._traverseList = function (state) {
        var _safe = 0;
        var mtx = state.mtx, queue = state.queue;
        while (queue.length) {
            _safe = this._traverseLevel(_safe, state);
            state.x++;
        }
        return mtx;
    };
    /**
     * traverse main method to get coordinates matrix from graph
     * @returns 2D matrix containing all nodes and anchors
     */
    Graph.prototype.traverse = function () {
        var roots = this.roots();
        var state = {
            mtx: new Matrix(),
            queue: new TraverseQueue(),
            x: 0,
            y: 0
        };
        if (!roots.length) {
            if (this._list.length)
                throw new Error("No roots in graph");
            return state.mtx;
        }
        var mtx = state.mtx, queue = state.queue;
        queue.add.apply(queue, [null,
            null].concat(roots.map(function (r) { return ({
            id: r.id,
            next: r.next,
            name: r.name,
            nameOrientation: r.nameOrientation,
            edgeNames: r.edgeNames,
            payload: r.payload
        }); })));
        this._traverseList(state);
        return mtx;
    };
    return Graph;
}(GraphMatrix));
//# sourceMappingURL=graph.class.js.map

//# sourceMappingURL=index.js.map

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = ".node-icon-default_nodeOrange__2pzZe path {\n    fill: #e25300;\n    stroke: #e25300;\n}\n\n.node-icon-default_nodeGreen__2fWrs path {\n    fill: #008c15;\n    stroke: #008c15;\n}\n\n.node-icon-default_nodeBlue__2rASh path {\n    fill: #193772;\n    stroke: #193772;\n}\n\n.node-icon-default_nodePurple__2Ilol {\n    fill: #6304a3;\n    stroke: #6304a3;\n}\n\n.node-icon-default_nodeDefaultIcon__3r8qv text {\n    font-size: 14px;\n}\n\n.node-icon-default_nodeDefaultIconGroup__2mmJl g {\n    fill: #ffffff;\n    stroke: #ffffff;\n}\n";
var styles = {"nodeOrange":"node-icon-default_nodeOrange__2pzZe","nodeGreen":"node-icon-default_nodeGreen__2fWrs","nodeBlue":"node-icon-default_nodeBlue__2rASh","nodePurple":"node-icon-default_nodePurple__2Ilol","nodeDefaultIcon":"node-icon-default_nodeDefaultIcon__3r8qv","nodeDefaultIconGroup":"node-icon-default_nodeDefaultIconGroup__2mmJl"};
styleInject(css);

var DefaultNodeIcon = /** @class */ (function (_super) {
    __extends(DefaultNodeIcon, _super);
    function DefaultNodeIcon() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DefaultNodeIcon.prototype.getClass = function (node, incomes) {
        if (incomes && incomes.length > 1 && node.next && node.next.length > 1)
            return styles.nodePurple;
        if (incomes && incomes.length > 1)
            return styles.nodeOrange;
        if (node.next && node.next.length > 1)
            return styles.nodeGreen;
        return styles.nodeBlue;
    };
    DefaultNodeIcon.prototype.renderText = function (id) {
        return (createElement("g", null,
            createElement("text", { strokeWidth: "1", x: "0", y: "0", dx: "26", dy: "30", textAnchor: "middle" }, id)));
    };
    DefaultNodeIcon.prototype.render = function () {
        var _a = this.props, node = _a.node, incomes = _a.incomes;
        return (createElement("svg", { version: "1.1", x: "0px", y: "0px", viewBox: "0 0 52 52", className: styles.nodeDefaultIcon },
            createElement("g", { className: "node-icon-default " + styles.nodeDefaultIconGroup + " " + this.getClass(node, incomes) },
                createElement("path", { d: "M40.824,52H11.176C5.003,52,0,46.997,0,40.824V11.176C0,5.003,5.003,0,11.176,0h29.649   C46.997,0,52,5.003,52,11.176v29.649C52,46.997,46.997,52,40.824,52z" }),
                this.renderText(node.id))));
    };
    return DefaultNodeIcon;
}(Component));
//# sourceMappingURL=node-icon-default.js.map

var withForeignObject = function (WrappedSVGComponent) { return function (_a) {
    var width = _a.width, height = _a.height, x = _a.x, y = _a.y, props = __rest(_a, ["width", "height", "x", "y"]);
    return (createElement("foreignObject", { x: x, y: y, width: width, height: height, className: "node-icon" },
        createElement(WrappedSVGComponent, __assign({}, props))));
}; };
//# sourceMappingURL=with-foreign-object.js.map

var GraphElement = /** @class */ (function (_super) {
    __extends(GraphElement, _super);
    function GraphElement() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.wrapEventHandler = function (cb, node, incomes) {
            return function (e) { return cb(e, node, incomes); };
        };
        _this.diveToNodeIncome = function (node, nodesMap) {
            if (!node.isAnchor)
                return node;
            _this.checkAnchorRenderIncomes(node);
            return _this.diveToNodeIncome(nodesMap[node.renderIncomes[0]], nodesMap);
        };
        _this.getNodeIncomes = function (node, nodesMap) {
            return _this.getAllIncomes(node, nodesMap).map(function (n) {
                return _this.diveToNodeIncome(n, nodesMap);
            });
        };
        _this.getAllIncomes = function (node, nodesMap) { return node.renderIncomes.map(function (id) { return nodesMap[id]; }); };
        return _this;
    }
    GraphElement.prototype.getCoords = function (cellSize, padding, node) {
        return [node.x * cellSize + padding, node.y * cellSize + padding];
    };
    GraphElement.prototype.getSize = function (cellSize, padding) {
        return cellSize - padding * 2;
    };
    GraphElement.prototype.checkAnchorRenderIncomes = function (node) {
        if (node.renderIncomes.length != 1)
            throw new Error("Anchor has non 1 income: " + node.id + ". Incomes " + node.renderIncomes.join(","));
    };
    GraphElement.prototype.getNodeHandlers = function () {
        var _a = this.props, node = _a.node, nodesMap = _a.nodesMap, onNodeClick = _a.onNodeClick, onNodeMouseEnter = _a.onNodeMouseEnter, onNodeMouseLeave = _a.onNodeMouseLeave;
        var incomes = this.getNodeIncomes(node, nodesMap);
        var handlers = {};
        if (onNodeClick)
            handlers.onClick = this.wrapEventHandler(onNodeClick, node, incomes);
        if (onNodeMouseEnter)
            handlers.onMouseEnter = this.wrapEventHandler(onNodeMouseEnter, node, incomes);
        if (onNodeMouseLeave)
            handlers.onMouseLeave = this.wrapEventHandler(onNodeMouseLeave, node, incomes);
        return handlers;
    };
    GraphElement.prototype.renderNode = function () {
        var _a = this.props, node = _a.node, _b = _a.node, isAnchor = _b.isAnchor, name = _b.name, _c = _b.nameOrientation, nameOrientation = _c === void 0 ? "bottom" : _c, nodesMap = _a.nodesMap, cellSize = _a.cellSize, padding = _a.padding;
        var _d = this.getCoords(cellSize, padding, node), x = _d[0], y = _d[1];
        var size = this.getSize(cellSize, padding);
        var NodeIcon = withForeignObject(this.props.component ? this.props.component : DefaultNodeIcon);
        var incomes = this.getNodeIncomes(node, nodesMap);
        var textY = nameOrientation === "top"
            ? y - size * 0.2
            : y + size * 1.2;
        return (!isAnchor && (createElement("g", __assign({ className: "node-icon-group" }, this.getNodeHandlers()),
            createElement(NodeIcon, { x: x, y: y, height: size, width: size, node: node, incomes: incomes }),
            !!name && (createElement("text", { x: x + size * 0.5, y: textY, textAnchor: "middle", dominantBaseline: "middle", style: {
                    stroke: "#fff",
                    strokeWidth: 3,
                    fill: "#2d578b",
                    paintOrder: "stroke"
                } }, name)))));
    };
    GraphElement.prototype.render = function () {
        return (createElement("g", { className: "node-group", style: {
                strokeWidth: 2,
                fill: "#ffffff",
                stroke: "#2d578b"
            } }, this.renderNode()));
    };
    return GraphElement;
}(Component));
//# sourceMappingURL=element.js.map

var VectorDirection;
(function (VectorDirection) {
    VectorDirection["Top"] = "top";
    VectorDirection["Bottom"] = "bottom";
    VectorDirection["Right"] = "right";
    VectorDirection["Left"] = "left";
})(VectorDirection || (VectorDirection = {}));
var getXVertexDirection = function (x1, x2) {
    return x1 < x2 ? VectorDirection.Right : VectorDirection.Left;
};
var getYVertexDirection = function (y1, y2) {
    return y1 < y2 ? VectorDirection.Bottom : VectorDirection.Top;
};
var getEdgeMargins = function (node, income) {
    var result = [AnchorMargin.None, AnchorMargin.None];
    switch (true) {
        case node.isAnchor && income.isAnchor:
            result = [
                node.anchorMargin,
                income.anchorMargin
            ];
            break;
        case node.isAnchor:
            result = [
                node.anchorMargin,
                node.anchorMargin
            ];
            break;
        case income.isAnchor:
            result = [
                income.anchorMargin,
                income.anchorMargin
            ];
            break;
    }
    return result;
};
var getVectorDirection = function (x1, y1, x2, y2) {
    return y1 === y2
        ? getXVertexDirection(x1, x2)
        : getYVertexDirection(y1, y2);
};
var getMargin = function (margin, padding, cellSize) {
    if (margin === AnchorMargin.None)
        return 0;
    var size = Math.round((cellSize - padding * 2) * 0.15);
    return margin === AnchorMargin.Left ? -size : size;
};
var getCellCenter = function (cellSize, padding, cellX, cellY, margin) {
    var outset = getMargin(margin, padding, cellSize);
    var x = cellX * cellSize + cellSize * 0.5 + outset;
    var y = cellY * cellSize + cellSize * 0.5;
    return [x, y];
};
var getCellEntry = function (direction, cellSize, padding, cellX, cellY, margin) {
    switch (direction) {
        case VectorDirection.Top:
            var x = getCellCenter(cellSize, padding, cellX, cellY, margin)[0];
            var y = cellY * cellSize + padding;
            return [x, y];
        case VectorDirection.Bottom:
            var x = getCellCenter(cellSize, padding, cellX, cellY, margin)[0];
            var y = cellY * cellSize + (cellSize - padding);
            return [x, y];
        case VectorDirection.Right:
            var _a = getCellCenter(cellSize, padding, cellX, cellY, margin), y = _a[1];
            var x = cellX * cellSize + (cellSize - padding);
            return [x, y];
        case VectorDirection.Left:
            var _b = getCellCenter(cellSize, padding, cellX, cellY, margin), y = _b[1];
            var x = cellX * cellSize + padding;
            return [x, y];
    }
};
function gen4() {
    return Math.random()
        .toString(16)
        .slice(-4);
}
function uniqueId(prefix) {
    return (prefix || "").concat([gen4(), gen4(), gen4(), gen4()].join("-"));
}
//# sourceMappingURL=index.js.map

var DefaultMarkerBody = /** @class */ (function (_super) {
    __extends(DefaultMarkerBody, _super);
    function DefaultMarkerBody() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DefaultMarkerBody.prototype.render = function () {
        return (createElement("defs", null,
            createElement("symbol", { id: "markerPoly" },
                createElement("polyline", { stroke: "none", points: "0,0 20,9 20,11 0,20 5,10" }))));
    };
    return DefaultMarkerBody;
}(PureComponent));
var DefaultMarker = /** @class */ (function (_super) {
    __extends(DefaultMarker, _super);
    function DefaultMarker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DefaultMarker.prototype.render = function () {
        var _a = this.props, id = _a.id, width = _a.width, height = _a.height;
        return (createElement("marker", { id: id, viewBox: "0 0 20 20", refX: 20, refY: 10, markerUnits: "userSpaceOnUse", orient: "auto", markerWidth: width, markerHeight: height },
            createElement("use", { xlinkHref: "#markerPoly" })));
    };
    return DefaultMarker;
}(PureComponent));
//# sourceMappingURL=marker-default.js.map

var _a;
function getPointWithResolver(direction, cellSize, padding, item, margin) {
    var _a, _b;
    var x1, y1;
    if (item.isAnchor) {
        _a = getCellCenter(cellSize, padding, item.x, item.y, margin), x1 = _a[0], y1 = _a[1];
    }
    else {
        _b = getCellEntry(direction, cellSize, padding, item.x, item.y, margin), x1 = _b[0], y1 = _b[1];
    }
    return [x1, y1];
}
var pointResolversMap = (_a = {},
    _a[VectorDirection.Top] = [VectorDirection.Top, VectorDirection.Bottom],
    _a[VectorDirection.Bottom] = [VectorDirection.Bottom, VectorDirection.Top],
    _a[VectorDirection.Right] = [VectorDirection.Right, VectorDirection.Left],
    _a[VectorDirection.Left] = [VectorDirection.Left, VectorDirection.Right],
    _a);
var GraphPolyline = /** @class */ (function (_super) {
    __extends(GraphPolyline, _super);
    function GraphPolyline() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.wrapEventHandler = function (cb, node, incomes) {
            return function (e) { return cb(e, node, incomes); };
        };
        _this.diveToNodeIncome = function (node, nodesMap) {
            if (!node.isAnchor)
                return node;
            _this.checkAnchorRenderIncomes(node);
            return _this.diveToNodeIncome(nodesMap[node.renderIncomes[0]], nodesMap);
        };
        _this.getNodeBranches = function (node, nodesMap) {
            return _this.getAllIncomes(node, nodesMap).map(function (n) { return [
                node
            ].concat(_this.getIncomeBranch(n, nodesMap)); });
        };
        _this.getIncomeBranch = function (lastIncome, nodesMap) {
            var branch = [];
            while (lastIncome.isAnchor) {
                _this.checkAnchorRenderIncomes(lastIncome);
                branch.push(lastIncome);
                lastIncome = nodesMap[lastIncome.renderIncomes[0]];
            }
            branch.push(lastIncome);
            return branch;
        };
        _this.getAllIncomes = function (node, nodesMap) { return node.renderIncomes.map(function (id) { return nodesMap[id]; }); };
        return _this;
    }
    GraphPolyline.prototype.getPolyline = function (cellSize, padding, branch) {
        var _this = this;
        return branch
            .filter(function (_, i) {
            return i + 1 !== branch.length;
        })
            .reduce(function (result, node, i) {
            var nextNode = branch[i + 1];
            var line = _this.getLineToIncome(cellSize, padding, node, nextNode);
            var _a = line.line, x1 = _a[0], y1 = _a[1], x2 = _a[2], y2 = _a[3];
            if (i === 0) {
                result.push([x1, y1], [x2, y2]);
            }
            else {
                result.push([x2, y2]);
            }
            return result;
        }, []);
    };
    GraphPolyline.prototype.getLineToIncome = function (cellSize, padding, node, income) {
        var margins = getEdgeMargins(node, income);
        var direction = getVectorDirection(node.x, node.y, income.x, income.y);
        var _a = pointResolversMap[direction], from = _a[0], to = _a[1];
        var nodeMargin = margins[0], incomeMargin = margins[1];
        var _b = getPointWithResolver(from, cellSize, padding, node, nodeMargin), x1 = _b[0], y1 = _b[1];
        var _c = getPointWithResolver(to, cellSize, padding, income, incomeMargin), x2 = _c[0], y2 = _c[1];
        return {
            node: node,
            income: income,
            line: [x1, y1, x2, y2]
        };
    };
    GraphPolyline.prototype.getLines = function (cellSize, padding, node, nodesMap) {
        var _this = this;
        var branches = this.getNodeBranches(node, nodesMap);
        return branches.map(function (branch) { return ({
            node: node,
            income: branch[branch.length - 1],
            line: _this.getPolyline(cellSize, padding, branch)
        }); });
    };
    GraphPolyline.prototype.getCoords = function (cellSize, padding, node) {
        return [node.x * cellSize + padding, node.y * cellSize + padding];
    };
    GraphPolyline.prototype.getSize = function (cellSize, padding) {
        return cellSize - padding * 2;
    };
    GraphPolyline.prototype.checkAnchorRenderIncomes = function (node) {
        if (node.renderIncomes.length != 1)
            throw new Error("Anchor has non 1 income: " + node.id + ". Incomes " + node.renderIncomes.join(","));
    };
    GraphPolyline.prototype.getLineHandlers = function (node, income) {
        var _a = this.props, onEdgeClick = _a.onEdgeClick, onEdgeMouseEnter = _a.onEdgeMouseEnter, onEdgeMouseLeave = _a.onEdgeMouseLeave;
        var handlers = {};
        if (onEdgeClick)
            handlers.onClick = this.wrapEventHandler(onEdgeClick, node, [
                income
            ]);
        if (onEdgeMouseEnter)
            handlers.onMouseEnter = this.wrapEventHandler(onEdgeMouseEnter, node, [income]);
        if (onEdgeMouseLeave)
            handlers.onMouseLeave = this.wrapEventHandler(onEdgeMouseLeave, node, [income]);
        return handlers;
    };
    GraphPolyline.prototype.getMarker = function (markerHash, incomeId) {
        var markerId = this.getMarkerId(markerHash, incomeId);
        return markerId ? { markerEnd: "url(#" + markerId + ")" } : {};
    };
    GraphPolyline.prototype.getMarkerId = function (markerHash, incomeId) {
        var node = this.props.node;
        return markerHash + "-" + node.id.trim() + "-" + incomeId.trim();
    };
    GraphPolyline.prototype.getLineNameCoords = function (income) {
        var _a = this.props, node = _a.node, id = _a.node.id, cellSize = _a.cellSize, padding = _a.padding;
        var index = income.next.findIndex(function (uuid) { return uuid === id; });
        var _b = this.getCoords(cellSize, padding, node), nodeY = _b[1];
        var _c = this.getCoords(cellSize, padding, income), x = _c[0], incomeY = _c[1];
        var y = nodeY;
        if (incomeY > nodeY) {
            y = incomeY;
        }
        if (incomeY === nodeY) {
            y = y + cellSize * index;
        }
        return [x, y];
    };
    GraphPolyline.prototype.lineName = function (income) {
        var _a = this.props, id = _a.node.id, cellSize = _a.cellSize, padding = _a.padding;
        var next = income.next, _b = income.edgeNames, edgeNames = _b === void 0 ? [] : _b;
        var _c = this.getLineNameCoords(income), x = _c[0], y = _c[1];
        var size = this.getSize(cellSize, padding);
        var index = next.findIndex(function (uuid) { return uuid === id; });
        return (createElement(Fragment, null,
            createElement("circle", { cx: x + size * 1.5, cy: y + size * 0.5, r: cellSize * 0.15, style: {
                    stroke: "none",
                    fill: "fff"
                } }),
            !!edgeNames[index] && (createElement("text", { x: x + size * 1.5, y: y + size * 0.3, textAnchor: "middle", dominantBaseline: "middle", style: {
                    stroke: "none",
                    fill: "#2d578b"
                } }, edgeNames[index]))));
    };
    GraphPolyline.prototype.getLinePoints = function (line) {
        return line.line
            .map(function (point) { return point.join(","); })
            .reverse()
            .join(" ");
    };
    GraphPolyline.prototype.stroke = function (lines, index) {
        if (lines.length > 1 && index) {
            return null;
        }
        return createElement("polyline", { fill: "none", className: "node-line", points: this.getLinePoints(lines[index]), style: {
                strokeWidth: 6,
                stroke: "#ffffff"
            } });
    };
    GraphPolyline.prototype.renderLines = function (node, lines) {
        var _this = this;
        var markerHash = uniqueId("marker-");
        return lines.map(function (line, index) { return (createElement("g", __assign({ key: "line-" + node.id + "-" + line.income.id }, _this.getLineHandlers(line.node, line.income), { style: {
                strokeWidth: 2,
                fill: "#2d578b",
                stroke: "#2d578b"
            } }),
            _this.lineName(line.income),
            createElement(DefaultMarker, { id: _this.getMarkerId(markerHash, line.income.id), width: 12, height: 12 }),
            _this.stroke(lines, index),
            createElement("polyline", __assign({}, _this.getMarker(markerHash, line.income.id), { fill: "none", className: "node-line", points: _this.getLinePoints(line) })))); });
    };
    GraphPolyline.prototype.render = function () {
        var _a = this.props, node = _a.node, nodesMap = _a.nodesMap, cellSize = _a.cellSize, padding = _a.padding;
        var lines = this.getLines(cellSize, padding, node, nodesMap);
        return (lines.length && (createElement("g", { className: "line-group" }, this.renderLines(node, lines))));
    };
    return GraphPolyline;
}(Component));

var Graph$1 = /** @class */ (function (_super) {
    __extends(Graph, _super);
    function Graph() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.getNodeElementInputs = function (nodesMap) {
            return Object.entries(nodesMap)
                .filter(function (_a) {
                var _ = _a[0], node = _a[1];
                return !node.isAnchor;
            })
                .map(function (_a) {
                var _ = _a[0], node = _a[1];
                return ({
                    node: node
                });
            });
        };
        return _this;
    }
    Graph.prototype.renderElements = function () {
        var _a = this.props, nodesMap = _a.nodesMap, cellSize = _a.cellSize, padding = _a.padding, widthInCells = _a.widthInCells, heightInCells = _a.heightInCells, restProps = __rest(_a, ["nodesMap", "cellSize", "padding", "widthInCells", "heightInCells"]);
        var elements = this.getNodeElementInputs(nodesMap);
        return (createElement(Fragment, null,
            elements.map(function (props) { return (createElement(GraphPolyline, __assign({ key: "polyline__" + props.node.id, cellSize: cellSize, padding: padding, nodesMap: nodesMap }, props, restProps))); }),
            elements.map(function (props) { return (createElement(GraphElement, __assign({ key: "element__" + props.node.id, cellSize: cellSize, padding: padding, nodesMap: nodesMap }, props, restProps))); })));
    };
    Graph.prototype.render = function () {
        var _a = this.props, cellSize = _a.cellSize, widthInCells = _a.widthInCells, heightInCells = _a.heightInCells;
        return (createElement("svg", { xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", version: "1", width: widthInCells * cellSize, height: heightInCells * cellSize },
            createElement(DefaultMarkerBody, null),
            this.renderElements()));
    };
    return Graph;
}(Component));
//# sourceMappingURL=graph.js.map

//# sourceMappingURL=index.js.map

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
        return createElement(Graph$1, __assign({}, dataProps, viewProps));
    };
    return DirectGraph;
}(Component));
//# sourceMappingURL=index.js.map

export default DirectGraph;
//# sourceMappingURL=index.es.js.map
