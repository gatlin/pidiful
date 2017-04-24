/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, alm_1) {
	    "use strict";
	    exports.__esModule = true;
	    var canvasMailbox = new alm_1.Mailbox(null);
	    var ArrowKey;
	    (function (ArrowKey) {
	        ArrowKey[ArrowKey["Left"] = 0] = "Left";
	        ArrowKey[ArrowKey["Right"] = 1] = "Right";
	    })(ArrowKey || (ArrowKey = {}));
	    ;
	    var Actions;
	    (function (Actions) {
	        Actions[Actions["Tick"] = 0] = "Tick";
	        Actions[Actions["CanvasUpdate"] = 1] = "CanvasUpdate";
	        Actions[Actions["Push"] = 2] = "Push";
	        Actions[Actions["UpdateKP"] = 3] = "UpdateKP";
	        Actions[Actions["UpdateKI"] = 4] = "UpdateKI";
	        Actions[Actions["UpdateKD"] = 5] = "UpdateKD";
	        Actions[Actions["UpdateForce"] = 6] = "UpdateForce";
	    })(Actions || (Actions = {}));
	    ;
	    function new_appstate() {
	        return {
	            canvasCtx: null,
	            pos: 0,
	            desired: 0,
	            canvasWidth: 400,
	            canvasHeight: 400,
	            i: 0,
	            d: 0,
	            kP: 0.2,
	            kI: 0.01,
	            kD: 0.5,
	            lastFrameTime: Date.now(),
	            force: 20,
	            lastPushTime: Date.now()
	        };
	    }
	    function draw(model) {
	        var ctx = model.canvasCtx;
	        var cW = model.canvasWidth;
	        var cH = model.canvasHeight;
	        // draw a line
	        ctx.clearRect(0, 0, cW, cH);
	        ctx.beginPath();
	        ctx.lineWidth = 14;
	        ctx.strokeStyle = '#325FA2';
	        ctx.arc((cW / 2) + model.pos, cH / 2, 50, 0, Math.PI * 2, true);
	        ctx.stroke();
	    }
	    function update_model(action, model) {
	        var dispatch = {};
	        dispatch[Actions.Tick] = function () {
	            if (!model.canvasCtx) {
	                return model;
	            }
	            var time = Date.now();
	            var dt = time - model.lastFrameTime;
	            draw(model);
	            var e_t = model.desired - model.pos;
	            model.i = Math.floor(model.i + e_t * dt);
	            model.d = Math.floor((e_t - model.d) / dt);
	            var dP = model.kP * e_t +
	                model.kI * model.i +
	                model.kD * model.d;
	            model.pos = Math.floor(model.pos + (dP / 5));
	            model.lastFrameTime = time;
	            return model;
	        };
	        dispatch[Actions.CanvasUpdate] = function () {
	            var canvasEl = action.data;
	            model.canvasCtx = canvasEl.getContext('2d');
	            return model;
	        };
	        dispatch[Actions.Push] = function () {
	            model.pos = action.data === ArrowKey.Left
	                ? model.pos - model.force
	                : model.pos + model.force;
	            model.lastPushTime = Date.now();
	            return model;
	        };
	        dispatch[Actions.UpdateKP] = function () {
	            model.kP = action.data;
	            return model;
	        };
	        dispatch[Actions.UpdateKI] = function () {
	            model.kI = action.data;
	            return model;
	        };
	        dispatch[Actions.UpdateKD] = function () {
	            model.kD = action.data;
	            return model;
	        };
	        dispatch[Actions.UpdateForce] = function () {
	            model.force = action.data;
	            return model;
	        };
	        if (isNaN(model.pos)) {
	            model.pos = 0;
	            model.i = 0;
	            model.d = 0;
	        }
	        return dispatch[action.type]();
	    }
	    function main(scope) {
	        scope.ports.inbound.tick
	            .map(function () { return ({ type: Actions.Tick }); })
	            .connect(scope.actions);
	        // left arrow
	        scope.events.keydown
	            .filter(function (evt) { return evt.getRaw().keyCode === 37; })
	            .map(function (evt) { return ({
	            type: Actions.Push,
	            data: ArrowKey.Left
	        }); })
	            .connect(scope.actions);
	        // right arrow
	        scope.events.keydown
	            .filter(function (evt) { return evt.getRaw().keyCode === 39; })
	            .map(function (evt) { return ({
	            type: Actions.Push,
	            data: ArrowKey.Right
	        }); })
	            .connect(scope.actions);
	        scope.events.change
	            .filter(function (evt) { return evt.getId() === 'inp-kP'; })
	            .map(function (evt) { return ({
	            type: Actions.UpdateKP,
	            data: evt.getValue()
	        }); })
	            .connect(scope.actions);
	        scope.events.change
	            .filter(function (evt) { return evt.getId() === 'inp-kI'; })
	            .map(function (evt) { return ({
	            type: Actions.UpdateKI,
	            data: evt.getValue()
	        }); })
	            .connect(scope.actions);
	        scope.events.change
	            .filter(function (evt) { return evt.getId() === 'inp-kD'; })
	            .map(function (evt) { return ({
	            type: Actions.UpdateKD,
	            data: evt.getValue()
	        }); })
	            .connect(scope.actions);
	        scope.events.change
	            .filter(function (evt) { return evt.getId() === 'inp-force'; })
	            .map(function (evt) { return ({
	            type: Actions.UpdateForce,
	            data: parseInt(evt.getValue())
	        }); })
	            .connect(scope.actions);
	        canvasMailbox
	            .filter(function (cnvs) { return cnvs !== null; })
	            .map(function (cnvs) { return ({
	            type: Actions.CanvasUpdate,
	            data: cnvs
	        }); })
	            .connect(scope.actions);
	    }
	    function render(state) {
	        var ctrl_bar = alm_1.el('div', {
	            'class': 'horizontal-bar',
	            'id': 'ctrl-bar'
	        }, [
	            alm_1.el('span', {}, [
	                alm_1.el('label', { 'for': 'inp-kP' }, ['kP =']),
	                alm_1.el('input', {
	                    'type': 'text',
	                    'value': state.kP,
	                    'id': 'inp-kP'
	                }, [])
	            ]),
	            alm_1.el('span', {}, [
	                alm_1.el('label', { 'for': 'inp-kI' }, ['kI =']),
	                alm_1.el('input', {
	                    'type': 'text',
	                    'value': state.kI,
	                    'id': 'inp-kI'
	                }, [])
	            ]),
	            alm_1.el('span', {}, [
	                alm_1.el('label', { 'for': 'inp-kD' }, ['kD =']),
	                alm_1.el('input', {
	                    'type': 'text',
	                    'value': state.kD,
	                    'id': 'inp-kD'
	                }, [])
	            ])
	        ]);
	        var force_bar = alm_1.el('div', {
	            'class': 'horizontal-bar',
	            'id': 'force-bar'
	        }, [
	            alm_1.el('span', {}, [
	                alm_1.el('label', { 'for': 'inp-force' }, ['Force =']),
	                alm_1.el('input', {
	                    'type': 'text',
	                    'value': state.force,
	                    'id': 'inp-force'
	                }, [])
	            ])
	        ]);
	        return alm_1.el('div', { 'id': 'main' }, [
	            alm_1.el('canvas', {
	                'id': 'the_canvas',
	                'height': state.canvasHeight,
	                'width': state.canvasWidth
	            }, [])
	                .subscribe(canvasMailbox),
	            ctrl_bar,
	            force_bar
	        ]);
	    }
	    var app = new alm_1.App({
	        domRoot: 'app',
	        state: new_appstate(),
	        update: update_model,
	        render: render,
	        ports: {
	            inbound: ['tick']
	        },
	        main: main
	    });
	    var runtime = app.start();
	    runtime.state.recv(function (st) {
	        //console.log('state updated');
	    });
	    function tick() {
	        runtime.ports.inbound.tick.send(null);
	        window.requestAnimationFrame(tick);
	    }
	    tick();
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(2), __webpack_require__(3), __webpack_require__(2), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, base_1, vdom_1, base_2, vdom_2) {
	    "use strict";
	    function __export(m) {
	        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	    }
	    exports.__esModule = true;
	    __export(base_1);
	    exports.el = vdom_1.el;
	    /**
	     * Wraps system events and provides some convenience methods.
	     * @constructor
	     * @param evt - The raw browser event value.
	     */
	    var AlmEvent = (function () {
	        function AlmEvent(evt) {
	            this.raw = evt;
	            this.classes = evt.target.className.trim().split(/\s+/g) || [];
	            this.id = evt.target.id;
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
	            return this.raw.target.value;
	        };
	        AlmEvent.prototype.getRaw = function () {
	            return this.raw;
	        };
	        return AlmEvent;
	    }());
	    exports.AlmEvent = AlmEvent;
	    /**
	     * Constructs signals emitting whichever browser event names you pass in.
	     * @param {Array<string>} evts - The event names you want signals for.
	     * @return {Array<Signal>} The event signals.
	     */
	    function makeEvents(evts) {
	        var events = {};
	        for (var i = 0; i < evts.length; i++) {
	            var evtName = evts[i];
	            events[evtName] = new base_2.Signal(function (evt) { return new AlmEvent(evt); });
	        }
	        return events;
	    }
	    /**
	     * Builds the port signals for an App.
	     * @param {Object} portCfg - An object whose keys name arrays of desired port
	     *                           names.
	     *                           Eg, { outbound: ['port1','port2' ],
	     *                                 inbound: ['port3'] }.
	     *
	     * @return {Object} ports - An object with the same keys but this time they
	     *                          point to objects whose keys were in the original
	     *                          arrays and whose values are signals.
	     */
	    function makePorts(portCfg) {
	        // If it is simply an array then make ports for each string
	        if (Array.isArray(portCfg)) {
	            var _ports = {};
	            for (var i = 0; i < portCfg.length; i++) {
	                var portName = portCfg[i];
	                _ports[portName] = base_2.Signal.make();
	            }
	            return _ports;
	        }
	        var ports = (typeof portCfg === 'undefined' || portCfg === null)
	            ? { outbound: [], inbound: [] }
	            : portCfg;
	        for (var key in ports) {
	            var portNames = ports[key];
	            var portSpace = {};
	            for (var i = 0; i < portNames.length; i++) {
	                var portName = portNames[i];
	                portSpace[portName] = base_2.Signal.make();
	            }
	            ports[key] = portSpace;
	        }
	        return ports;
	    }
	    var standardEvents = [
	        'click',
	        'dblclick',
	        'keyup',
	        'keydown',
	        'keypress',
	        'blur',
	        'focusout',
	        'input',
	        'change',
	        'load'
	    ];
	    /**
	     * A self-contained application.
	     * @constructor
	     * @param {AppConfig} cfg - the configuration object.
	     */
	    var App = (function () {
	        function App(cfg) {
	            this.gui = typeof cfg.gui === 'undefined'
	                ? true
	                : cfg.gui;
	            this.eventRoot = typeof cfg.eventRoot === 'string'
	                ? document.getElementById(cfg.eventRoot)
	                : typeof cfg.eventRoot === 'undefined'
	                    ? document
	                    : cfg.eventRoot;
	            this.domRoot = typeof cfg.domRoot === 'string'
	                ? document.getElementById(cfg.domRoot)
	                : typeof cfg.domRoot === 'undefined'
	                    ? document.body
	                    : cfg.domRoot;
	            var events = standardEvents.concat(typeof cfg.extraEvents !== 'undefined'
	                ? cfg.extraEvents
	                : []);
	            this.events = makeEvents(events);
	            this.ports = makePorts(cfg.ports);
	            // create the signal graph
	            var actions = new base_2.Mailbox(null);
	            var state = actions.reduce(cfg.state, function (action, model) {
	                if (action === null) {
	                    return model;
	                }
	                return cfg.update(action, model);
	            });
	            this.scope = Object.seal({
	                events: this.events,
	                ports: this.ports,
	                actions: actions,
	                state: state
	            });
	            cfg.main(this.scope);
	            this.render = this.gui ? cfg.render : null;
	        }
	        /**
	         * Internal method which registers a given signal to emit upstream browser
	         * events.
	         */
	        App.prototype.registerEvent = function (evtName, sig) {
	            var fn = function (evt) { return sig.send(evt); };
	            this.eventRoot.addEventListener(evtName, fn, true);
	        };
	        /**
	         * Provides access to the application scope for any other configuration.
	         *
	         * @param f - A function which accepts a scope and returns nothing.
	         * @return @this
	         */
	        App.prototype.editScope = function (cb) {
	            cb(this.scope);
	            return this;
	        };
	        /**
	         * Set the root element in the page to which we will attach listeners.
	         * @param er - Either an HTML element, the whole document, or an element ID
	         *             as a string.
	         * @return @this
	         */
	        App.prototype.setEventRoot = function (er) {
	            this.eventRoot = typeof er === 'string'
	                ? document.getElementById(er)
	                : er;
	            return this;
	        };
	        /**
	         * Set the root element in the page in which we will render.
	         * @param er - Either an HTML element, the whole document, or an element ID
	         *             as a string.
	         * @return @this
	         */
	        App.prototype.setDomRoot = function (dr) {
	            this.domRoot = typeof dr === 'string'
	                ? document.getElementById(dr)
	                : dr;
	            return this;
	        };
	        /**
	         * This method actually registers the desired events and creates the ports.
	         * @return An object containing the App's port signals and a state update
	         * signal.
	         */
	        App.prototype.start = function () {
	            /* Find all the event listeners the user cared about and bind those */
	            for (var evtName in this.events) {
	                var sig = this.events[evtName];
	                if (sig.numListeners() > 0) {
	                    this.registerEvent(evtName, sig);
	                }
	            }
	            if (this.gui) {
	                var view = this.scope.state.map(this.render);
	                vdom_2.render(view, this.domRoot);
	            }
	            return {
	                ports: this.scope.ports,
	                state: this.scope.state
	            };
	        };
	        return App;
	    }());
	    exports.App = App;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	/*
	[1]: The proper thing for it to wrap would be the type `Event`. However I also
	want to be able to make assumptions about the target because I'll be getting
	them exclusively from the browser. I do not know the proper TypeScript-fu yet
	for expressing this properly.

	[2]: I don't know the typescript way of saying "an object of string literal keys
	which point to arrays of names. any number of such keys, or none at all."
	*/


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    exports.__esModule = true;
	    /**
	     * Permits something akin to traits and automatically derived functions. The
	     * type receiving the traits must implement stub properties with the correct
	     * names.
	     *
	     * @param derivedCtor - the constructor you want to add traits to.
	     * @param baseCtors - the parent constructors you wish to inherit traits from.
	     */
	    function derive(derivedCtor, baseCtors) {
	        baseCtors.forEach(function (baseCtor) {
	            Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
	                derivedCtor.prototype[name] = baseCtor.prototype[name];
	            });
	        });
	    }
	    exports.derive = derive;
	    /**
	     * Using `derive` you can get an implementation of flatMap for free by
	     * implementing this class as an interface with a null return value for flatMap.
	     */
	    var FlatMap = (function () {
	        function FlatMap() {
	        }
	        FlatMap.pipe = function (ms) {
	            var v = ms[0];
	            for (var i = 1; i < ms.length; i++) {
	                v = v.flatMap(ms[i]);
	            }
	            return v;
	        };
	        FlatMap.prototype.flatMap = function (f) {
	            return this.map(f).flatten();
	        };
	        FlatMap.prototype.pipe = function (ms) {
	            var me = this;
	            for (var i = 0; i < ms.length; i++) {
	                me = me.flatMap(ms[i]);
	            }
	            return me;
	        };
	        return FlatMap;
	    }());
	    exports.FlatMap = FlatMap;
	    /** Utility function to perform some function asynchronously. */
	    function async(f) {
	        setTimeout(f, 0);
	    }
	    exports.async = async;
	    /**
	     * Signals route data through an application.
	    
	     * A signal is a unary function paired with an array of listeners. When a signal
	     * receives a value it computes a result using its function and then sends that
	     * to each of its listeners.
	     *
	     * @constructor
	     * @param fn - A unary function.
	     */
	    var Signal = (function () {
	        function Signal(fn) {
	            this.fn = fn;
	            this.listeners = [];
	        }
	        /** Attaches the argument as a listener and then returns the argument. */
	        Signal.prototype.connect = function (sig) {
	            this.listeners.push(sig);
	            return sig;
	        };
	        /** Convenience constructor. */
	        Signal.make = function () {
	            return new Signal(function (x) { return x; });
	        };
	        /**
	         * Gives the argument to the signal's internal function and then sends the
	         * result to all its listeners.
	         *
	         * @param x - The value to send.
	         * @return Nothing
	         */
	        Signal.prototype.send = function (x) {
	            var v = this.fn(x);
	            if (typeof v !== 'undefined') {
	                for (var i = 0; i < this.listeners.length; i++) {
	                    var r = this.listeners[i];
	                    r.send(v);
	                }
	            }
	        };
	        Signal.prototype.recv = function (f) {
	            this.connect(new Signal(function (v) { return f(v); }));
	        };
	        /**
	         * Creates a new signal with the specified function, attaches it to this
	         * signal, and returns the newly created signal.
	         *
	         * @param f - A unary function with which to create a new signal.
	         * @return a new signal attached to this one.
	         */
	        Signal.prototype.map = function (f) {
	            var sig = new Signal(f);
	            return this.connect(sig);
	        };
	        /**
	         * Creates a new signal which will only propagate a value if a condition
	         * is met. The new signal will be attached as a listener to this one.
	         *
	         * @param cond - A unary function returning a boolean.
	         * @return a new Signal attached as a listener to this Signal.
	         */
	        Signal.prototype.filter = function (cond) {
	            var r = new Signal(function (v) {
	                if (cond(v)) {
	                    return v;
	                }
	            });
	            return this.connect(r);
	        };
	        /**
	         * Creates a new signal which reduces incoming values using a supplied
	         * function and an initial value. The new signal will be attached as a
	         * listener to this one.
	         *
	         * @param initial - An initial value for the reduction.
	         * @param reducer - A function accepting new signal values and the old
	         *                  reduced value.
	         * @return a new Signal attached as a listener to this Signal.
	         */
	        Signal.prototype.reduce = function (initial, reducer) {
	            var state = initial;
	            var r = new Signal(function (v) {
	                state = reducer(v, state);
	                return state;
	            });
	            return this.connect(r);
	        };
	        Signal.prototype.numListeners = function () {
	            return this.listeners.length;
	        };
	        return Signal;
	    }());
	    exports.Signal = Signal;
	    /**
	     * A signal to which you may send and receive values. Messages are sent
	     * asynchronously. You must supply an initial value to send.
	     *
	     * This makes Mailboxes useful for kicking off any initial actions that must
	     * be taken. Internally a Mailbox is used for initial state reduction by App.
	     */
	    var Mailbox = (function (_super) {
	        __extends(Mailbox, _super);
	        function Mailbox(t) {
	            var _this = _super.call(this, function (x) { return x; }) || this;
	            _this.send(t);
	            return _this;
	        }
	        Mailbox.prototype.send = function (t) {
	            var _this = this;
	            async(function () {
	                _super.prototype.send.call(_this, t);
	            });
	        };
	        Mailbox.prototype.recv = function (k) {
	            _super.prototype.recv.call(this, k);
	        };
	        return Mailbox;
	    }(Signal));
	    exports.Mailbox = Mailbox;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    exports.__esModule = true;
	    /** Helper function for creating VTrees exported to the top level. */
	    function el(tag, attrs, children) {
	        var children_trees = (typeof children === 'undefined')
	            ? []
	            : children.map(function (kid, idx) {
	                return typeof kid === 'string'
	                    ? new VTree(kid, [], VTreeType.Text)
	                    : kid;
	            });
	        return new VTree({
	            tag: tag,
	            attrs: attrs
	        }, children_trees, VTreeType.Node);
	    }
	    exports.el = el;
	    var VTreeType;
	    (function (VTreeType) {
	        VTreeType[VTreeType["Text"] = 0] = "Text";
	        VTreeType[VTreeType["Node"] = 1] = "Node";
	    })(VTreeType || (VTreeType = {}));
	    ;
	    /**
	     * A rose tree representing DOM elements. Can represent either an element node
	     * or a text node.
	     *
	     * Because VTree is lighter weight than actual DOM elements an efficient diff
	     * procedure can be used to compare old and new trees and determine what needs
	     * to be done to the actual DOM.
	     *
	     * The {@link VTree#key} property is used to determine equality. If a `key`
	     * attribute is provided, it will be used. If there is not one, then `id` will
	     * be used. Failing that the tag name will be used. If this is a text node, the
	     * text itself will be used. I'm open to other possibilities, especially
	     * regarding that last one.
	     */
	    var VTree = (function () {
	        function VTree(content, children, treeType) {
	            this.content = content;
	            this.children = children;
	            this.treeType = treeType;
	            this.mailbox = null;
	            /* There must be a key */
	            if (treeType === VTreeType.Node) {
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
	        /**
	         * Whenever this VTree is re-rendered the DOM node will be sent to this
	         * Mailbox. This is useful in case an important element is recreated and you
	         * need an up to date reference to it.
	         */
	        VTree.prototype.subscribe = function (mailbox) {
	            this.mailbox = mailbox;
	            return this;
	        };
	        /** Equality based on the key. */
	        VTree.prototype.eq = function (other) {
	            if (!other) {
	                return false;
	            }
	            return (this.key === other.key);
	        };
	        return VTree;
	    }());
	    exports.VTree = VTree;
	    /** Constructs an actual DOM node from a {@link VTree}. */
	    function makeDOMNode(tree) {
	        if (tree === null) {
	            return null;
	        }
	        if (tree.treeType === VTreeType.Text) {
	            return document.createTextNode(tree.content);
	        }
	        var el = document.createElement(tree.content.tag);
	        for (var key in tree.content.attrs) {
	            el.setAttribute(key, tree.content.attrs[key]);
	        }
	        for (var i = 0; i < tree.children.length; i++) {
	            var child = makeDOMNode(tree.children[i]);
	            el.appendChild(child);
	        }
	        // if a mailbox was subscribed, notify it the element was re-rendered
	        if (tree.mailbox !== null) {
	            tree.mailbox.send(el);
	        }
	        return el;
	    }
	    /** Constructs an initial DOM from a {@link VTree}. */
	    function initialDOM(domRoot, tree) {
	        var root = domRoot;
	        var domTree = makeDOMNode(tree);
	        while (root.firstChild) {
	            root.removeChild(root.firstChild);
	        }
	        root.appendChild(domTree);
	    }
	    /**
	     * A simple enum representing three kinds of array edit operations.
	     */
	    var Op;
	    (function (Op) {
	        Op[Op["Merge"] = 0] = "Merge";
	        Op[Op["Delete"] = 1] = "Delete";
	        Op[Op["Insert"] = 2] = "Insert";
	    })(Op || (Op = {}));
	    ;
	    /**
	     * Computes an array of edit operations allowing the first argument to be
	     * transformed into the second argument.
	     *
	     * @param a - The original array
	     * @param b - The the desired array
	     * @param eq - An equality testing function for elements in the arrays.
	     * @return An array of {@link Op} values.
	     */
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
	                    d[i_2 * n + j_2] = Math.min(d[(i_2 - 1) * n + j_2], d[i_2 * n + (j_2 - 1)])
	                        + 1;
	                }
	            }
	        }
	        var i = m - 1, j = n - 1;
	        while (!(i === 0 && j === 0)) {
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
	        return moves;
	    }
	    exports.diff_array = diff_array;
	    /**
	     * The name is a little misleading. This takes an old and a current
	     * {@link VTree}, the parent node of the one the old tree represents,
	     * and an (optional) index into that parent's childNodes array.
	     *
	     * If either of the trees is null or undefined this triggers DOM node creation
	     * or destruction.
	     *
	     * If both are nodes then attributes are reconciled followed by children.
	     *
	     * Otherwise the new tree simply overwrites the old one.
	     *
	     * While this does not perform a perfect tree diff it doesn't need to and
	     * performance is (probably) the better for it. In typical cases a DOM node will
	     * add or remove a few children at once, and the grandchildren will not need to
	     * be recovered from their parents. Meaning starting from the root node we can
	     * treat this as a list diff problem for the children and then, once children
	     * are paired up, we can recurse on them.
	     */
	    function diff_dom(parent, a, b, index) {
	        if (index === void 0) { index = 0; }
	        if (typeof b === 'undefined' || b === null) {
	            parent.removeChild(parent.childNodes[index]);
	            return;
	        }
	        if (typeof a === 'undefined' || a === null) {
	            parent.insertBefore(makeDOMNode(b), parent.childNodes[index]);
	            return;
	        }
	        if (b.treeType === VTreeType.Node) {
	            if (a.treeType === VTreeType.Node) {
	                if (a.content.tag === b.content.tag) {
	                    // contend with attributes. only necessary changes.
	                    var dom = parent.childNodes[index];
	                    for (var attr in a.content.attrs) {
	                        if (!(attr in b.content.attrs)) {
	                            dom.removeAttribute(attr);
	                            delete dom[attr];
	                        }
	                    }
	                    for (var attr in b.content.attrs) {
	                        var v = b.content.attrs[attr];
	                        if (!(attr in a.content.attrs) ||
	                            v !== a.content.attrs[attr]) {
	                            dom[attr] = v;
	                            dom.setAttribute(attr, v);
	                        }
	                    }
	                    // contend with the children.
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
	            // different types of nodes, `b` is a text node, or they have different
	            // tags. in all cases just replace the DOM element.
	            parent.replaceChild(makeDOMNode(b), parent.childNodes[index]);
	        }
	    }
	    exports.diff_dom = diff_dom;
	    /**
	     * This reduces a Signal producing VTrees.
	     *
	     * @param view_signal - the Signal of VTrees coming from the App.
	     * @param domRoot - The root element we will be rendering the VTree in.
	     */
	    function render(view_signal, domRoot) {
	        view_signal.reduce(null, function (update, tree) {
	            if (tree === null) {
	                initialDOM(domRoot, update);
	            }
	            else {
	                diff_dom(domRoot, tree, update);
	            }
	            return update;
	        });
	    }
	    exports.render = render;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ })
/******/ ]);