/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var vdom_1 = __webpack_require__(5);
function makeReducer(reducers) {
    var reducerKeys = Object.keys(reducers);
    return function (state, action) {
        var hasChanged = false;
        var newState = {};
        for (var i = 0; i < reducerKeys.length; i++) {
            var key = reducerKeys[i];
            var reducer = reducers[key];
            var previousState = state[key];
            var nextState = reducer(previousState, action);
            newState[key] = nextState;
            hasChanged = hasChanged || nextState !== previousState;
        }
        return hasChanged ? newState : state;
    };
}
exports.makeReducer = makeReducer;
var Store = (function () {
    function Store(state, reducer) {
        this.state = state;
        this.reducer = reducer;
        this.subscribers = [];
    }
    Store.prototype.dispatch = function (action) {
        this.state = this.reducer(this.state, typeof action === 'function'
            ? action(this.dispatch.bind(this), this.getState.bind(this))
            : action);
        this.subscribers.forEach(function (update) { update(); });
        return this;
    };
    Store.prototype.subscribe = function (subscriber) {
        var _this = this;
        this.subscribers.push(subscriber);
        return function () {
            var idx = _this.subscribers.indexOf(subscriber);
            _this.subscribers.splice(idx, 1);
        };
    };
    Store.prototype.getState = function () {
        return Object.seal(this.state);
    };
    return Store;
}());
exports.Store = Store;
;
function flatten(ary) {
    return ary.reduce(function (a, b) { return a.concat(b); }, []);
}
function el(ctor, props) {
    if (props === void 0) { props = {}; }
    var _children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        _children[_i - 2] = arguments[_i];
    }
    return function (ctx) {
        props = props === null ? {} : props;
        var eventHandlers = {};
        if (props.on) {
            eventHandlers = props.on;
            delete props.on;
        }
        if (props.className) {
            props['class'] = props.className;
            delete props['className'];
        }
        if (props.ref) {
            eventHandlers['ref'] = props['ref'];
            delete props['ref'];
        }
        _children = Array.isArray(_children) && Array.isArray(_children[0])
            ? _children[0]
            : _children;
        var children = _children
            ? _children
                .filter(function (child) { return typeof child !== 'undefined'; })
                .map(function (child, idx) {
                if (!child || child instanceof Array) {
                    return null;
                }
                return typeof child === 'string'
                    ? new vdom_1.VDom(child, [], vdom_1.VDomType.Text)
                    : child(ctx);
            })
                .filter(function (child) { return child !== null; })
            : [];
        var handler = function (e) { ctx.handle(e, eventHandlers); };
        var view = typeof ctor === 'string'
            ? new vdom_1.VDom({
                tag: ctor,
                attrs: props
            }, children, vdom_1.VDomType.Node, handler)
            : ctor(__assign({}, props, { children: children }))(ctx);
        return view;
    };
}
exports.el = el;
var AlmEvent = (function () {
    function AlmEvent(evt) {
        this.raw = evt;
        this.classes = evt.target.className.trim().split(/\s+/g) || [];
        this.id = evt.target.id || '';
        this.value = evt.target.value;
    }
    AlmEvent.prototype.hasClass = function (klass) {
        return (this.classes.indexOf(klass) !== -1);
    };
    AlmEvent.prototype.getClasses = function () {
        return this.classes;
    };
    AlmEvent.prototype.getId = function () {
        return this.id;
    };
    AlmEvent.prototype.getValue = function () {
        return this.value;
    };
    AlmEvent.prototype.getRaw = function () {
        return this.raw;
    };
    AlmEvent.prototype.class_in_ancestry = function (klass) {
        var result = null;
        var done = false;
        var elem = this.raw.target;
        while (!done) {
            if (!elem.className) {
                done = true;
                break;
            }
            var klasses = elem.className.trim().split(/\s+/g) || [];
            if (klasses.indexOf(klass) !== -1) {
                result = elem;
                done = true;
            }
            else if (elem.parentNode) {
                elem = elem.parentNode;
            }
            else {
                done = true;
            }
        }
        return result;
    };
    return AlmEvent;
}());
exports.AlmEvent = AlmEvent;
var Alm = (function () {
    function Alm(cfg) {
        var _this = this;
        this.gensymnumber = 0;
        this.handleEvent = function (evt) {
            var evtName = evt.type;
            if (_this.events[evtName]) {
                if (evt.target.hasAttribute('data-alm-id')) {
                    var almId = evt.target.getAttribute('data-alm-id');
                    if (_this.events[evtName][almId]) {
                        _this.events[evtName][almId](new AlmEvent(evt));
                    }
                }
            }
        };
        this.store = new Store(cfg.model, cfg.update);
        this.eventRoot = typeof cfg.eventRoot === 'string'
            ? document.getElementById(cfg.eventRoot)
            : typeof cfg.eventRoot === 'undefined'
                ? document
                : cfg.eventRoot;
        this.domRoot = typeof cfg.domRoot === 'string'
            ? document.getElementById(cfg.domRoot)
            : cfg.domRoot;
        this.view = cfg.view;
        this.events = {};
    }
    Alm.prototype.start = function () {
        var _this = this;
        this.events = {};
        var store = this.store;
        var handle = function (e, handlers) {
            window.setTimeout(function () {
                var eId;
                if (e.hasAttribute('data-alm-id')) {
                    eId = e.getAttribute('data-alm-id');
                }
                else {
                    eId = _this.gensym();
                    e.setAttribute('data-alm-id', eId);
                }
                if (handlers.ref) {
                    handlers.ref(e);
                    delete handlers['ref'];
                }
                for (var evtName in handlers) {
                    if (!(evtName in _this.events)) {
                        _this.events[evtName] = {};
                        _this.registerEvent(evtName, _this.handleEvent);
                    }
                    _this.events[evtName][eId] = handlers[evtName];
                }
                return function () {
                    for (var evtName in handlers) {
                        delete _this.events[evtName][eId];
                    }
                };
            }, 0);
        };
        var context = { store: store, handle: handle };
        var vtree = this.view(context);
        vdom_1.initialDOM(this.domRoot, vtree);
        this.store.subscribe(function () {
            var updated = _this.view(context);
            vdom_1.diff_dom(_this.domRoot, vtree, updated);
            vtree = updated;
        });
    };
    Alm.prototype.gensym = function () {
        return 'node-' + (this.gensymnumber++).toString();
    };
    Alm.prototype.registerEvent = function (evtName, cb) {
        this.eventRoot.addEventListener(evtName, cb, true);
    };
    return Alm;
}());
exports.Alm = Alm;
function connect(mapState, mapDispatch) {
    if (mapState === void 0) { mapState = null; }
    if (mapDispatch === void 0) { mapDispatch = null; }
    return function (component) { return function (props) {
        if (props === void 0) { props = {}; }
        return function (ctx) {
            var store = ctx.store;
            var state = store.getState();
            var mappedState = mapState ? mapState(state) : {};
            var mappedDispatch = mapDispatch
                ? mapDispatch(store.dispatch.bind(store))
                : {};
            var finalProps = __assign({}, props, mappedState, mappedDispatch);
            return component(finalProps)(ctx);
        };
    }; };
}
exports.connect = connect;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var vector_1 = __webpack_require__(2);
var ball_1 = __webpack_require__(6);
var Direction;
(function (Direction) {
    Direction[Direction["Left"] = 0] = "Left";
    Direction[Direction["Right"] = 1] = "Right";
    Direction[Direction["Up"] = 2] = "Up";
    Direction[Direction["Down"] = 3] = "Down";
    Direction[Direction["None"] = 4] = "None";
})(Direction = exports.Direction || (exports.Direction = {}));
;
function window_geometry() {
    var winSize = Math.min(window.innerWidth, window.innerHeight - 50);
    var viewHeight;
    if (winSize >= 480) {
        viewHeight = 0.75 * winSize;
    }
    else {
        viewHeight = 0.95 * winSize;
    }
    if (viewHeight < 480) {
        viewHeight = window.innerWidth;
    }
    var pixelRatio = window.devicePixelRatio || 1;
    return {
        viewHeight: viewHeight,
        viewWidth: window.innerWidth,
        pixelRation: pixelRatio
    };
}
exports.window_geometry = window_geometry;
exports.initialState = function () {
    var geometry = window_geometry();
    return {
        geometry: geometry,
        canvasCtx: null,
        ball: new ball_1.default(20, 1.0, new vector_1.default(0, 20), new vector_1.default(0, 20)).toggleRunning(),
        canvasWidth: geometry.viewWidth - 10,
        canvasHeight: geometry.viewHeight,
        lastFrameTime: Date.now(),
        lastPushTime: 0,
        push_force: 500,
        show_log: true,
        refresh_rate: 1000.0 / 60.0
    };
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Vector = (function () {
    function Vector(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    Vector.prototype.length = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    Vector.prototype.add = function (vec) {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    };
    Vector.prototype.subtract = function (vec) {
        this.x -= vec.x;
        this.y -= vec.y;
        return this;
    };
    Vector.prototype.multiply = function (vec) {
        this.x *= vec.x;
        this.y *= vec.y;
        return this;
    };
    Vector.prototype.divide = function (vec) {
        this.x /= vec.x;
        this.y /= vec.y;
        return this;
    };
    Vector.prototype.addScalar = function (scalar) {
        this.x += scalar;
        this.y += scalar;
        return this;
    };
    Vector.prototype.subtractScalar = function (scalar) {
        this.x -= scalar;
        this.y -= scalar;
        return this;
    };
    Vector.prototype.multiplyScalar = function (scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    };
    Vector.prototype.divideScalar = function (scalar) {
        this.x /= scalar;
        this.y /= scalar;
        return this;
    };
    Vector.prototype.floor = function () {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this;
    };
    Vector.prototype.invertX = function () {
        this.x *= -1;
        return this;
    };
    Vector.prototype.invertY = function () {
        this.y *= -1;
        return this;
    };
    Vector.prototype.invert = function () {
        return this.invertX().invertY();
    };
    Vector.prototype.normalize = function () {
        var len = this.length();
        if (0 === len) {
            this.x = 1;
            this.y = 0;
        }
        else {
            this.divide(new Vector(len, len));
        }
        return this;
    };
    Vector.prototype.square = function () {
        this.x = this.x * this.x;
        this.y = this.y * this.y;
        return this;
    };
    Vector.prototype.clone = function () {
        return new Vector(this.x, this.y);
    };
    Vector.prototype.dot = function (vec) {
        return this.x * vec.x + this.y * vec.y;
    };
    Vector.prototype.cross = function (vec) {
        return (this.x * vec.y) - (this.y * vec.x);
    };
    Vector.prototype.toString = function () {
        var x = Number(this.x.toFixed(3));
        var y = Number(this.y.toFixed(3));
        return "<" + x + " , " + y + ">";
    };
    return Vector;
}());
exports.default = Vector;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Actions;
(function (Actions) {
    Actions[Actions["Tick"] = 0] = "Tick";
    Actions[Actions["CanvasUpdate"] = 1] = "CanvasUpdate";
    Actions[Actions["ToggleShowLog"] = 2] = "ToggleShowLog";
    Actions[Actions["ToggleRun"] = 3] = "ToggleRun";
    Actions[Actions["SetPoint"] = 4] = "SetPoint";
})(Actions = exports.Actions || (exports.Actions = {}));
;
exports.tick = function () { return ({
    type: Actions.Tick
}); };
exports.canvasUpdate = function (data) { return ({
    type: Actions.CanvasUpdate,
    data: data
}); };
exports.toggleShowLog = function () { return ({
    type: Actions.ToggleShowLog
}); };
exports.toggleRun = function () { return ({
    type: Actions.ToggleRun
}); };
exports.setPoint = function (data) { return ({
    type: Actions.SetPoint,
    data: data
}); };


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var alm_1 = __webpack_require__(0);
var store_1 = __webpack_require__(1);
var actions_1 = __webpack_require__(3);
var MainComponent_1 = __webpack_require__(7);
var reducer_1 = __webpack_require__(13);
var app = new alm_1.Alm({
    model: store_1.initialState(),
    update: reducer_1.default,
    view: MainComponent_1.default(),
    domRoot: 'main',
    eventRoot: 'main'
});
function tock(ts) {
    app.store.dispatch(actions_1.tick());
    window.requestAnimationFrame(tock);
}
document.title = 'PIDiful';
app.start();
window.requestAnimationFrame(tock);


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var VDomType;
(function (VDomType) {
    VDomType[VDomType["Text"] = 0] = "Text";
    VDomType[VDomType["Node"] = 1] = "Node";
})(VDomType = exports.VDomType || (exports.VDomType = {}));
;
var VDom = (function () {
    function VDom(content, children, treeType, handler) {
        if (handler === void 0) { handler = null; }
        this.content = content;
        this.children = children;
        this.treeType = treeType;
        this.onCreate = handler;
        this.onDestroy = null;
        if (treeType === VDomType.Node) {
            if ('key' in this.content.attrs) {
                this.key = this.content.attrs.key;
                delete this.content.attrs.key;
            }
            else if ('id' in this.content.attrs) {
                this.key = this.content.attrs.id;
            }
            else {
                this.key = this.content.tag;
            }
        }
        else {
            this.key = 'text-node';
        }
    }
    VDom.prototype.setChildren = function (children) {
        this.children = children;
        return this;
    };
    VDom.prototype.eq = function (other) {
        if (!other) {
            return false;
        }
        return (this.key === other.key);
    };
    return VDom;
}());
exports.VDom = VDom;
function makeDOMNode(tree) {
    if (tree === null) {
        return null;
    }
    if (tree.treeType === VDomType.Text) {
        return document.createTextNode(tree.content);
    }
    var el = document.createElement(tree.content.tag);
    for (var key in tree.content.attrs) {
        if (tree.content.attrs[key] !== null) {
            el.setAttribute(key, tree.content.attrs[key]);
        }
    }
    for (var i = 0; i < tree.children.length; i++) {
        var child = makeDOMNode(tree.children[i]);
        el.appendChild(child);
    }
    tree.onDestroy = tree.onCreate(el);
    return el;
}
function initialDOM(domRoot, tree) {
    var root = domRoot;
    var domTree = makeDOMNode(tree);
    while (root.firstChild) {
        root.removeChild(root.firstChild);
    }
    root.appendChild(domTree);
}
exports.initialDOM = initialDOM;
var Op;
(function (Op) {
    Op[Op["Merge"] = 0] = "Merge";
    Op[Op["Delete"] = 1] = "Delete";
    Op[Op["Insert"] = 2] = "Insert";
})(Op = exports.Op || (exports.Op = {}));
;
function diff_array(a, b, eq) {
    if (!a.length) {
        return b.map(function (c) { return [Op.Insert, null, c]; });
    }
    if (!b.length) {
        return a.map(function (c) { return [Op.Delete, c, null]; });
    }
    var m = a.length + 1;
    var n = b.length + 1;
    var d = new Array(m * n);
    var moves = [];
    for (var i_1 = 0; i_1 < m; i_1++) {
        d[i_1 * n] = i_1;
    }
    for (var j_1 = 0; j_1 < n; j_1++) {
        d[j_1] = j_1;
    }
    for (var j_2 = 1; j_2 < n; j_2++) {
        for (var i_2 = 1; i_2 < m; i_2++) {
            if (eq(a[i_2 - 1], b[j_2 - 1])) {
                d[i_2 * n + j_2] = d[(i_2 - 1) * n + (j_2 - 1)];
            }
            else {
                d[i_2 * n + j_2] = Math.min(d[(i_2 - 1) * n + j_2], d[i_2 * n + (j_2 - 1)]) + 1;
            }
        }
    }
    var i = m - 1;
    var j = n - 1;
    while (i > 0 && j > 0) {
        if (eq(a[i - 1], b[j - 1])) {
            i--;
            j--;
            moves.unshift([Op.Merge, a[i], b[j]]);
        }
        else {
            if (d[i * n + (j - 1)] <= d[(i - 1) * n + j]) {
                j--;
                moves.unshift([Op.Insert, null, b[j]]);
            }
            else {
                i--;
                moves.unshift([Op.Delete, a[i], null]);
            }
        }
    }
    if (i > 0 && j === 0) {
        for (; i >= 0; i--) {
            moves.unshift([Op.Delete, a[i], null]);
        }
    }
    if (j > 0 && i === 0) {
        for (; j >= 0; j--) {
            moves.unshift([Op.Insert, null, b[j]]);
        }
    }
    return moves;
}
exports.diff_array = diff_array;
function diff_dom(parent, a, b, index) {
    if (index === void 0) { index = 0; }
    if (typeof b === 'undefined' || b === null) {
        if (parent.childNodes[index]) {
            if (parent.childNodes[index].onDestroy) {
                parent.childNodes[index].onDestroy();
            }
            parent.removeChild(parent.childNodes[index]);
        }
        return;
    }
    if (typeof a === 'undefined' || a === null) {
        parent.insertBefore(makeDOMNode(b), parent.childNodes[index]);
        return;
    }
    if (b.treeType === VDomType.Node) {
        if (a.treeType === VDomType.Node) {
            if (a.content.tag === b.content.tag) {
                var dom_1 = parent.childNodes[index];
                for (var attr in a.content.attrs) {
                    if (!(attr in b.content.attrs)) {
                        dom_1.removeAttribute(attr);
                        delete dom_1[attr];
                    }
                }
                for (var attr in b.content.attrs) {
                    var v = b.content.attrs[attr];
                    if (!(attr in a.content.attrs) ||
                        v !== a.content.attrs[attr]) {
                        dom_1[attr] = v;
                        dom_1.setAttribute(attr, v);
                    }
                }
                window.setTimeout(function () {
                    if (dom_1.hasAttribute('value')) {
                        dom_1.value = dom_1.getAttribute('value');
                    }
                }, 0);
                var moves = diff_array(a.children, b.children, function (a, b) {
                    if (typeof a === 'undefined')
                        return false;
                    return a.eq(b);
                });
                var domIndex = 0;
                for (var i = 0; i < moves.length; i++) {
                    var move = moves[i];
                    diff_dom(parent.childNodes[index], move[1], move[2], domIndex);
                    if (move[0] !== Op.Delete) {
                        domIndex++;
                    }
                }
            }
        }
    }
    else {
        if (parent.childNodes[index].onDestroy) {
            parent.childNodes[index].onDestroy();
        }
        parent.replaceChild(makeDOMNode(b), parent.childNodes[index]);
    }
}
exports.diff_dom = diff_dom;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var vector_1 = __webpack_require__(2);
var Ball = (function () {
    function Ball(radius, mass, pos, desired, vel, acc, run, kP, kI, kD) {
        if (desired === void 0) { desired = new vector_1.default(0, 0); }
        if (vel === void 0) { vel = new vector_1.default(0, 0); }
        if (acc === void 0) { acc = new vector_1.default(0, 0); }
        if (run === void 0) { run = false; }
        if (kP === void 0) { kP = new vector_1.default(0.8, 0.85); }
        if (kI === void 0) { kI = new vector_1.default(0.05, 0.15); }
        if (kD === void 0) { kD = new vector_1.default(0.01, 0.05); }
        this.radius = radius;
        this.mass = mass;
        this.pos = pos;
        this.desired = desired;
        this.vel = vel;
        this.acc = acc;
        this.run = run;
        this.kP = kP;
        this.kI = kI;
        this.kD = kD;
        this.C_d = 0.27;
        this.i = new vector_1.default();
        this.lastPos = new vector_1.default();
    }
    Ball.prototype.move = function (vec) {
        this.acc.add(vec);
        return this;
    };
    Ball.prototype.activate = function () {
        this.run = true;
        this.lastPos = this.pos.clone();
        this.i = new vector_1.default();
        return this;
    };
    Ball.prototype.deactivate = function () {
        this.run = false;
        this.desired = this.pos.clone();
        return this;
    };
    Ball.prototype.toggleRunning = function () {
        if (this.run) {
            return this.deactivate();
        }
        return this.activate();
    };
    Ball.prototype.update = function (dt, otherForces) {
        if (this.run) {
            var err_t = this.desired.clone().subtract(this.pos);
            var inp_t = this.pos.clone().subtract(this.lastPos);
            this.i.add(err_t.clone().multiplyScalar(dt).multiply(this.kI));
            var correction = err_t
                .multiply(this.kP)
                .add(this.i)
                .subtract(inp_t.multiply(this.kD));
            this.acc.add(correction);
        }
        else {
            this.desired = this.pos.clone();
        }
        this.lastPos = this.pos.clone();
        this.pos.add(this.vel.clone()
            .multiplyScalar(dt)
            .add(this.acc.clone()
            .multiplyScalar(0.5 * dt * dt)));
        var drag_area = Math.PI * this.radius * this.radius;
        var air_density = 0.75;
        var drag = drag_area * this.C_d * air_density * 0.5;
        var horiz_multiplier = this.vel.x === 0
            ? 0 : this.vel.x > 0
            ? -1
            : 1;
        var vert_multiplier = this.vel.y === 0
            ? 0 : this.vel.y > 0
            ? -1
            : 1;
        otherForces
            .multiplyScalar(this.mass)
            .add(new vector_1.default(horiz_multiplier * drag, vert_multiplier * drag));
        var avg_acc = otherForces
            .divideScalar(this.mass)
            .add(this.acc.clone())
            .divideScalar(2);
        this.vel.add(avg_acc.multiplyScalar(dt));
        if (Math.abs(this.acc.x) <= 0.001) {
            this.acc.floor();
        }
        if (Math.abs(this.vel.x) < 0.001 ||
            Math.abs(this.vel.y) < 0.001) {
            this.vel.floor();
        }
        return this;
    };
    Ball.prototype.bounds_check = function (t, r, b, l) {
        if (this.pos.y + this.radius > t) {
            this.pos.y = t - this.radius;
            this.vel.y *= -0.5;
        }
        if (this.pos.x + this.radius > r) {
            this.pos.x = r - this.radius - 1;
            this.vel.x *= -0.5;
            this.acc.x *= 0.9;
        }
        if (this.pos.y - this.radius < b) {
            this.vel.y *= -0.5;
            this.pos.y = this.radius;
        }
        if (this.pos.x - this.radius < l) {
            this.pos.x = l + this.radius;
            this.vel.x *= -0.5;
            this.acc.x *= 0.9;
        }
        return this;
    };
    Ball.prototype.draw = function (ctx, cW, cH) {
        ctx.beginPath();
        ctx.lineWidth = 7;
        ctx.strokeStyle = '#325FA2';
        ctx.arc((cW / 2) + this.pos.x, (cH - this.pos.y), this.radius - 7, 0, Math.PI * 2, true);
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#000000';
        ctx.arc((cW / 2) + this.desired.x, (cH - this.desired.y), 5, 0, Math.PI * 2, true);
        ctx.stroke();
    };
    return Ball;
}());
exports.default = Ball;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Alm = __webpack_require__(0);
var alm_1 = __webpack_require__(0);
var actions_1 = __webpack_require__(3);
__webpack_require__(8);
var shownCount = 0;
var RunCtrl = function (props) { return (Alm.el("div", { className: 'ctrl' },
    Alm.el("label", { for: 'run-ctrl' },
        "Running",
        Alm.el("input", { type: 'checkbox', id: 'run-ctrl', checked: props.run ? 'checked' : null, on: {
                change: function (evt) {
                    props.toggleRun();
                }
            } })))); };
var ShowLogCtrl = function (props) { return (Alm.el("div", { className: 'ctrl' },
    Alm.el("label", { for: 'show-log-ctrl' },
        "Show Log",
        Alm.el("input", { type: 'checkbox', id: 'show-log-ctrl', on: {
                change: function (evt) {
                    props.toggleShowLog();
                }
            }, checked: props.show
                ? 'checked'
                : null })))); };
var LogBar = function (props) { return !props.show ? Alm.el("span", null) : (Alm.el("div", { id: 'log-bar' },
    Alm.el("p", null,
        "Position: ",
        props.ball.pos.toString()),
    Alm.el("p", null,
        "Velocity: ",
        props.ball.vel.toString()),
    Alm.el("p", null,
        "Acceleration: ",
        props.ball.acc.toString()))); };
var MainComponent = function (props) { return (Alm.el("section", { id: "the_app", className: "app", tabindex: 1, on: {
        keydown: function (evt) {
            if (evt.getRaw().keyCode === 32) {
                props.toggleRun();
            }
        }
    } },
    Alm.el("canvas", { id: 'the_canvas', height: props.canvasHeight, width: props.canvasWidth, on: {
            click: function (evt) {
                props.setPoint(evt.getRaw());
            }
        }, ref: function (cnvs) {
            props.canvasUpdate(cnvs);
        } }),
    Alm.el(RunCtrl, { run: props.ball.run, toggleRun: props.toggleRun }),
    Alm.el(ShowLogCtrl, { toggleShowLog: props.toggleShowLog, show: props.show_log }),
    Alm.el(LogBar, { show: props.show_log, ball: props.ball }))); };
exports.default = alm_1.connect(function (_a) {
    var ball = _a.ball, show_log = _a.show_log, canvasWidth = _a.canvasWidth, canvasHeight = _a.canvasHeight;
    return ({
        ball: ball,
        show_log: show_log,
        canvasWidth: canvasWidth,
        canvasHeight: canvasHeight
    });
}, function (dispatch) { return ({
    toggleShowLog: function () { return dispatch(actions_1.toggleShowLog()); },
    toggleRun: function () { return dispatch(actions_1.toggleRun()); },
    setPoint: function (d) { return dispatch(actions_1.setPoint(d)); },
    canvasUpdate: function (d) { return dispatch(actions_1.canvasUpdate(d)); }
}); })(MainComponent);


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(9);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(11)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./MainComponent.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./MainComponent.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(10)(false);
// imports


// module
exports.push([module.i, "body {\n    padding: 5px;\n    font-family: sans-serif;\n}\n\n#the_app {\n    outline: 0;\n    display: flex;\n    flex-direction: column;\n    justify-content: flex-start;\n    align-items: flex-start;\n    align-content: flex-start;\n}\n\n#the_canvas {\n    display: block;\n    align-self: center;\n    border: 1px solid #b9b9b9;\n}\n\n.horizontal-bar {\n    display: block;\n    margin: 10px auto;\n    text-align: center;\n}\n\n.horizontal-bar span {\n    display: block;\n    margin: 0 auto;\n    width: 800px;\n    border-left: 1px solid #b9b9b9;\n    border-right: 1px solid #b9b9b9;\n}\n\nlabel {\n    margin-right: 5px;\n}\n\n#ctrl-bar span:first-child {\n    border-top: 1px solid #b9b9b9;\n}\n\n#ctrl-bar span:last-child {\n    border-bottom: 1px solid #b9b9b9;\n}\n\n#ctrl-bar span label {\n    line-height: 22px;\n}\n\n#push-bar button {\n    border-top: 1px solid #b9b9b9;\n    border-bottom: 1px solid #b9b9b9;\n    height: 40px;\n    width: 400px;\n}\n\n#left-btn {\n    border-left: 1px solid #b9b9b9;\n    border-right: 0;\n}\n\n#right-btn {\n    border-right: 1px solid #b9b9b9;\n    border-left: 0;\n}\n\ninput {\n    border: 3px solid rgba(0,0,0,0);\n    padding: 13px 13px 13px 34px;\n    box-sizing: border-box;\n    line-height: 22px;\n    text-align: right;\n}\n\n.ctrl {\n    width: 100%;\n}\n\n.ctrl label{\n    padding: 2px;\n    display: flex;\n    flex-direction: row;\n    justify-content: space-between;\n    width: 100%;\n}\n\n.ctrl label:hover {\n    background-color: #b9b9b9;\n}\n\n#log-bar {\n    padding: 2px;\n}\n", ""]);

// exports


/***/ }),
/* 10 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(12);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 12 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var actions_1 = __webpack_require__(3);
var vector_1 = __webpack_require__(2);
function draw(_a) {
    var canvasCtx = _a.canvasCtx, canvasWidth = _a.canvasWidth, canvasHeight = _a.canvasHeight, ball = _a.ball;
    canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    ball.draw(canvasCtx, canvasWidth, canvasHeight);
}
var reducer = function (state, action) {
    switch (action.type) {
        case actions_1.Actions.Tick: {
            if (!state.canvasCtx) {
                return state;
            }
            var currentTime = Date.now();
            var dt = (currentTime - state.lastFrameTime) / 1000;
            var bound_left = -1 * (state.canvasWidth / 2);
            var bound_right = state.canvasWidth / 2;
            var gravity = new vector_1.default(0, -980);
            var ball = state.ball
                .update(dt, gravity)
                .bounds_check(state.canvasHeight, bound_right, 0, bound_left);
            var acc = state.ball.acc;
            if (currentTime - state.lastPushTime > 500) {
                acc.multiplyScalar(0.75);
            }
            draw(state);
            return __assign({}, state, { lastFrameTime: currentTime, ball: ball });
        }
        case actions_1.Actions.CanvasUpdate: {
            var canvasEl = action.data;
            var canvasCtx = canvasEl.getContext('2d');
            return __assign({}, state, { canvasCtx: canvasCtx });
        }
        case actions_1.Actions.ToggleShowLog:
            return __assign({}, state, { show_log: !state.show_log });
        case actions_1.Actions.ToggleRun: {
            var ball = state.ball;
            ball.toggleRunning();
            return state;
        }
        case actions_1.Actions.SetPoint: {
            var ball = state.ball;
            if (!ball.run) {
                return __assign({}, state);
            }
            var evt = action.data;
            var rect = evt.target.getBoundingClientRect();
            var xCoord = evt.clientX - rect.left;
            var yCoord = evt.clientY - rect.top;
            ball.desired = new vector_1.default(xCoord - (state.canvasWidth / 2), state.canvasHeight - yCoord);
            return __assign({}, state, { ball: ball });
        }
        default:
            return state;
    }
};
exports.default = reducer;


/***/ })
/******/ ]);