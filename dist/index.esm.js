import React, { forwardRef, useRef, useState, useEffect, useImperativeHandle } from 'react';

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = true,
      o = false;
    try {
      if (i = (t = t.call(r)).next, 0 === l) ; else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = true, n = r;
    } finally {
      try {
        if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _slicedToArray(r, e) {
  return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}

/*!
 * Signature Pad v5.1.3 | https://github.com/szimek/signature_pad
 * (c) 2025 Szymon Nowak | Released under the MIT license
 */


// src/point.ts
var Point = class {
  x;
  y;
  pressure;
  time;
  constructor(x, y, pressure, time) {
    if (isNaN(x) || isNaN(y)) {
      throw new Error(`Point is invalid: (${x}, ${y})`);
    }
    this.x = +x;
    this.y = +y;
    this.pressure = pressure || 0;
    this.time = time || Date.now();
  }
  distanceTo(start) {
    return Math.sqrt(
      Math.pow(this.x - start.x, 2) + Math.pow(this.y - start.y, 2)
    );
  }
  equals(other) {
    return this.x === other.x && this.y === other.y && this.pressure === other.pressure && this.time === other.time;
  }
  velocityFrom(start) {
    return this.time !== start.time ? this.distanceTo(start) / (this.time - start.time) : 0;
  }
};

// src/bezier.ts
var Bezier = class _Bezier {
  constructor(startPoint, control2, control1, endPoint, startWidth, endWidth) {
    this.startPoint = startPoint;
    this.control2 = control2;
    this.control1 = control1;
    this.endPoint = endPoint;
    this.startWidth = startWidth;
    this.endWidth = endWidth;
  }
  static fromPoints(points, widths) {
    const c2 = this.calculateControlPoints(points[0], points[1], points[2]).c2;
    const c3 = this.calculateControlPoints(points[1], points[2], points[3]).c1;
    return new _Bezier(points[1], c2, c3, points[2], widths.start, widths.end);
  }
  static calculateControlPoints(s1, s2, s3) {
    const dx1 = s1.x - s2.x;
    const dy1 = s1.y - s2.y;
    const dx2 = s2.x - s3.x;
    const dy2 = s2.y - s3.y;
    const m1 = { x: (s1.x + s2.x) / 2, y: (s1.y + s2.y) / 2 };
    const m2 = { x: (s2.x + s3.x) / 2, y: (s2.y + s3.y) / 2 };
    const l1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    const l2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
    const dxm = m1.x - m2.x;
    const dym = m1.y - m2.y;
    const k = l1 + l2 == 0 ? 0 : l2 / (l1 + l2);
    const cm = { x: m2.x + dxm * k, y: m2.y + dym * k };
    const tx = s2.x - cm.x;
    const ty = s2.y - cm.y;
    return {
      c1: new Point(m1.x + tx, m1.y + ty),
      c2: new Point(m2.x + tx, m2.y + ty)
    };
  }
  // Returns approximated length. Code taken from https://www.lemoda.net/maths/bezier-length/index.html.
  length() {
    const steps = 10;
    let length = 0;
    let px;
    let py;
    for (let i = 0; i <= steps; i += 1) {
      const t = i / steps;
      const cx = this.point(
        t,
        this.startPoint.x,
        this.control1.x,
        this.control2.x,
        this.endPoint.x
      );
      const cy = this.point(
        t,
        this.startPoint.y,
        this.control1.y,
        this.control2.y,
        this.endPoint.y
      );
      if (i > 0) {
        const xdiff = cx - px;
        const ydiff = cy - py;
        length += Math.sqrt(xdiff * xdiff + ydiff * ydiff);
      }
      px = cx;
      py = cy;
    }
    return length;
  }
  // Calculate parametric value of x or y given t and the four point coordinates of a cubic bezier curve.
  point(t, start, c1, c2, end) {
    return start * (1 - t) * (1 - t) * (1 - t) + 3 * c1 * (1 - t) * (1 - t) * t + 3 * c2 * (1 - t) * t * t + end * t * t * t;
  }
};

// src/signature_event_target.ts
var SignatureEventTarget = class {
  /* tslint:disable: variable-name */
  _et;
  /* tslint:enable: variable-name */
  constructor() {
    try {
      this._et = new EventTarget();
    } catch {
      this._et = document;
    }
  }
  addEventListener(type, listener, options) {
    this._et.addEventListener(type, listener, options);
  }
  dispatchEvent(event) {
    return this._et.dispatchEvent(event);
  }
  removeEventListener(type, callback, options) {
    this._et.removeEventListener(type, callback, options);
  }
};

// src/throttle.ts
function throttle(fn, wait = 250) {
  let previous = 0;
  let timeout = null;
  let result;
  let storedContext;
  let storedArgs;
  const later = () => {
    previous = Date.now();
    timeout = null;
    result = fn.apply(storedContext, storedArgs);
    if (!timeout) {
      storedContext = null;
      storedArgs = [];
    }
  };
  return function wrapper(...args) {
    const now = Date.now();
    const remaining = wait - (now - previous);
    storedContext = this;
    storedArgs = args;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = fn.apply(storedContext, storedArgs);
      if (!timeout) {
        storedContext = null;
        storedArgs = [];
      }
    } else if (!timeout) {
      timeout = window.setTimeout(later, remaining);
    }
    return result;
  };
}

// src/signature_pad.ts
var SignaturePad = class _SignaturePad extends SignatureEventTarget {
  /* tslint:enable: variable-name */
  constructor(canvas, options = {}) {
    super();
    this.canvas = canvas;
    this.velocityFilterWeight = options.velocityFilterWeight || 0.7;
    this.minWidth = options.minWidth || 0.5;
    this.maxWidth = options.maxWidth || 2.5;
    this.throttle = options.throttle ?? 16;
    this.minDistance = options.minDistance ?? 5;
    this.dotSize = options.dotSize || 0;
    this.penColor = options.penColor || "black";
    this.backgroundColor = options.backgroundColor || "rgba(0,0,0,0)";
    this.compositeOperation = options.compositeOperation || "source-over";
    this.canvasContextOptions = options.canvasContextOptions ?? {};
    this._strokeMoveUpdate = this.throttle ? throttle(_SignaturePad.prototype._strokeUpdate, this.throttle) : _SignaturePad.prototype._strokeUpdate;
    this._handleMouseDown = this._handleMouseDown.bind(this);
    this._handleMouseMove = this._handleMouseMove.bind(this);
    this._handleMouseUp = this._handleMouseUp.bind(this);
    this._handleTouchStart = this._handleTouchStart.bind(this);
    this._handleTouchMove = this._handleTouchMove.bind(this);
    this._handleTouchEnd = this._handleTouchEnd.bind(this);
    this._handlePointerDown = this._handlePointerDown.bind(this);
    this._handlePointerMove = this._handlePointerMove.bind(this);
    this._handlePointerUp = this._handlePointerUp.bind(this);
    this._handlePointerCancel = this._handlePointerCancel.bind(this);
    this._handleTouchCancel = this._handleTouchCancel.bind(this);
    this._ctx = canvas.getContext(
      "2d",
      this.canvasContextOptions
    );
    this.clear();
    this.on();
  }
  // Public stuff
  dotSize;
  minWidth;
  maxWidth;
  penColor;
  minDistance;
  velocityFilterWeight;
  compositeOperation;
  backgroundColor;
  throttle;
  canvasContextOptions;
  // Private stuff
  /* tslint:disable: variable-name */
  _ctx;
  _drawingStroke = false;
  _isEmpty = true;
  _dataUrl;
  _dataUrlOptions;
  _lastPoints = [];
  // Stores up to 4 most recent points; used to generate a new curve
  _data = [];
  // Stores all points in groups (one group per line or dot)
  _lastVelocity = 0;
  _lastWidth = 0;
  _strokeMoveUpdate;
  _strokePointerId;
  clear() {
    const { _ctx: ctx, canvas } = this;
    ctx.fillStyle = this.backgroundColor;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    this._data = [];
    this._reset(this._getPointGroupOptions());
    this._isEmpty = true;
    this._dataUrl = void 0;
    this._dataUrlOptions = void 0;
    this._strokePointerId = void 0;
  }
  redraw() {
    const data = this._data;
    const dataUrl = this._dataUrl;
    const dataUrlOptions = this._dataUrlOptions;
    this.clear();
    if (dataUrl) {
      this.fromDataURL(dataUrl, dataUrlOptions);
    }
    this.fromData(data, { clear: false });
  }
  fromDataURL(dataUrl, options = {}) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const ratio = options.ratio || window.devicePixelRatio || 1;
      const width = options.width || this.canvas.width / ratio;
      const height = options.height || this.canvas.height / ratio;
      const xOffset = options.xOffset || 0;
      const yOffset = options.yOffset || 0;
      this._reset(this._getPointGroupOptions());
      image.onload = () => {
        this._ctx.drawImage(image, xOffset, yOffset, width, height);
        resolve();
      };
      image.onerror = (error) => {
        reject(error);
      };
      image.crossOrigin = "anonymous";
      image.src = dataUrl;
      this._isEmpty = false;
      this._dataUrl = dataUrl;
      this._dataUrlOptions = { ...options };
    });
  }
  toDataURL(type = "image/png", encoderOptions) {
    switch (type) {
      case "image/svg+xml":
        if (typeof encoderOptions !== "object") {
          encoderOptions = void 0;
        }
        return `data:image/svg+xml;base64,${btoa(
          this.toSVG(encoderOptions)
        )}`;
      default:
        if (typeof encoderOptions !== "number") {
          encoderOptions = void 0;
        }
        return this.canvas.toDataURL(type, encoderOptions);
    }
  }
  on() {
    this.canvas.style.touchAction = "none";
    this.canvas.style.msTouchAction = "none";
    this.canvas.style.userSelect = "none";
    this.canvas.style.webkitUserSelect = "none";
    const isIOS = /Macintosh/.test(navigator.userAgent) && "ontouchstart" in document;
    if (window.PointerEvent && !isIOS) {
      this._handlePointerEvents();
    } else {
      this._handleMouseEvents();
      if ("ontouchstart" in window) {
        this._handleTouchEvents();
      }
    }
  }
  off() {
    this.canvas.style.touchAction = "auto";
    this.canvas.style.msTouchAction = "auto";
    this.canvas.style.userSelect = "auto";
    this.canvas.style.webkitUserSelect = "auto";
    this.canvas.removeEventListener("pointerdown", this._handlePointerDown);
    this.canvas.removeEventListener("mousedown", this._handleMouseDown);
    this.canvas.removeEventListener("touchstart", this._handleTouchStart);
    this._removeMoveUpEventListeners();
  }
  _getListenerFunctions() {
    const canvasWindow = window.document === this.canvas.ownerDocument ? window : this.canvas.ownerDocument.defaultView ?? this.canvas.ownerDocument;
    return {
      addEventListener: canvasWindow.addEventListener.bind(
        canvasWindow
      ),
      removeEventListener: canvasWindow.removeEventListener.bind(
        canvasWindow
      )
    };
  }
  _removeMoveUpEventListeners() {
    const { removeEventListener } = this._getListenerFunctions();
    removeEventListener("pointermove", this._handlePointerMove);
    removeEventListener("pointerup", this._handlePointerUp);
    removeEventListener("pointercancel", this._handlePointerCancel);
    removeEventListener("mousemove", this._handleMouseMove);
    removeEventListener("mouseup", this._handleMouseUp);
    removeEventListener("touchmove", this._handleTouchMove);
    removeEventListener("touchend", this._handleTouchEnd);
    removeEventListener("touchcancel", this._handleTouchCancel);
  }
  isEmpty() {
    return this._isEmpty;
  }
  fromData(pointGroups, { clear = true } = {}) {
    if (clear) {
      this.clear();
    }
    this._fromData(
      pointGroups,
      this._drawCurve.bind(this),
      this._drawDot.bind(this)
    );
    this._data = this._data.concat(pointGroups);
  }
  toData() {
    return this._data;
  }
  _isLeftButtonPressed(event, only) {
    if (only) {
      return event.buttons === 1;
    }
    return (event.buttons & 1) === 1;
  }
  _pointerEventToSignatureEvent(event) {
    return {
      event,
      type: event.type,
      x: event.clientX,
      y: event.clientY,
      pressure: "pressure" in event ? event.pressure : 0
    };
  }
  _touchEventToSignatureEvent(event) {
    const touch = event.changedTouches[0];
    return {
      event,
      type: event.type,
      x: touch.clientX,
      y: touch.clientY,
      pressure: touch.force
    };
  }
  // Event handlers
  _handleMouseDown(event) {
    if (!this._isLeftButtonPressed(event, true) || this._drawingStroke) {
      return;
    }
    this._strokeBegin(this._pointerEventToSignatureEvent(event));
  }
  _handleMouseMove(event) {
    if (!this._isLeftButtonPressed(event, true) || !this._drawingStroke) {
      this._strokeEnd(this._pointerEventToSignatureEvent(event), false);
      return;
    }
    this._strokeMoveUpdate(this._pointerEventToSignatureEvent(event));
  }
  _handleMouseUp(event) {
    if (this._isLeftButtonPressed(event)) {
      return;
    }
    this._strokeEnd(this._pointerEventToSignatureEvent(event));
  }
  _handleTouchStart(event) {
    if (event.targetTouches.length !== 1 || this._drawingStroke) {
      return;
    }
    if (event.cancelable) {
      event.preventDefault();
    }
    this._strokeBegin(this._touchEventToSignatureEvent(event));
  }
  _handleTouchMove(event) {
    if (event.targetTouches.length !== 1) {
      return;
    }
    if (event.cancelable) {
      event.preventDefault();
    }
    if (!this._drawingStroke) {
      this._strokeEnd(this._touchEventToSignatureEvent(event), false);
      return;
    }
    this._strokeMoveUpdate(this._touchEventToSignatureEvent(event));
  }
  _handleTouchEnd(event) {
    if (event.targetTouches.length !== 0) {
      return;
    }
    if (event.cancelable) {
      event.preventDefault();
    }
    this._strokeEnd(this._touchEventToSignatureEvent(event));
  }
  _handlePointerCancel(event) {
    if (!this._allowPointerId(event)) {
      return;
    }
    event.preventDefault();
    this._strokeEnd(this._pointerEventToSignatureEvent(event), false);
  }
  _handleTouchCancel(event) {
    if (event.cancelable) {
      event.preventDefault();
    }
    this._strokeEnd(this._touchEventToSignatureEvent(event), false);
  }
  _getPointerId(event) {
    return event.persistentDeviceId || event.pointerId;
  }
  _allowPointerId(event, allowUndefined = false) {
    if (typeof this._strokePointerId === "undefined") {
      return allowUndefined;
    }
    return this._getPointerId(event) === this._strokePointerId;
  }
  _handlePointerDown(event) {
    if (this._drawingStroke || !this._isLeftButtonPressed(event) || !this._allowPointerId(event, true)) {
      return;
    }
    this._strokePointerId = this._getPointerId(event);
    event.preventDefault();
    this._strokeBegin(this._pointerEventToSignatureEvent(event));
  }
  _handlePointerMove(event) {
    if (!this._allowPointerId(event)) {
      return;
    }
    if (!this._isLeftButtonPressed(event, true) || !this._drawingStroke) {
      this._strokeEnd(this._pointerEventToSignatureEvent(event), false);
      return;
    }
    event.preventDefault();
    this._strokeMoveUpdate(this._pointerEventToSignatureEvent(event));
  }
  _handlePointerUp(event) {
    if (this._isLeftButtonPressed(event) || !this._allowPointerId(event)) {
      return;
    }
    event.preventDefault();
    this._strokeEnd(this._pointerEventToSignatureEvent(event));
  }
  _getPointGroupOptions(group) {
    return {
      penColor: group && "penColor" in group ? group.penColor : this.penColor,
      dotSize: group && "dotSize" in group ? group.dotSize : this.dotSize,
      minWidth: group && "minWidth" in group ? group.minWidth : this.minWidth,
      maxWidth: group && "maxWidth" in group ? group.maxWidth : this.maxWidth,
      velocityFilterWeight: group && "velocityFilterWeight" in group ? group.velocityFilterWeight : this.velocityFilterWeight,
      compositeOperation: group && "compositeOperation" in group ? group.compositeOperation : this.compositeOperation
    };
  }
  // Private methods
  _strokeBegin(event) {
    const cancelled = !this.dispatchEvent(
      new CustomEvent("beginStroke", { detail: event, cancelable: true })
    );
    if (cancelled) {
      return;
    }
    const { addEventListener } = this._getListenerFunctions();
    switch (event.event.type) {
      case "mousedown":
        addEventListener("mousemove", this._handleMouseMove, {
          passive: false
        });
        addEventListener("mouseup", this._handleMouseUp, { passive: false });
        break;
      case "touchstart":
        addEventListener("touchmove", this._handleTouchMove, {
          passive: false
        });
        addEventListener("touchend", this._handleTouchEnd, { passive: false });
        addEventListener("touchcancel", this._handleTouchCancel, { passive: false });
        break;
      case "pointerdown":
        addEventListener("pointermove", this._handlePointerMove, {
          passive: false
        });
        addEventListener("pointerup", this._handlePointerUp, {
          passive: false
        });
        addEventListener("pointercancel", this._handlePointerCancel, {
          passive: false
        });
        break;
    }
    this._drawingStroke = true;
    const pointGroupOptions = this._getPointGroupOptions();
    const newPointGroup = {
      ...pointGroupOptions,
      points: []
    };
    this._data.push(newPointGroup);
    this._reset(pointGroupOptions);
    this._strokeUpdate(event);
  }
  _strokeUpdate(event) {
    if (!this._drawingStroke) {
      return;
    }
    if (this._data.length === 0) {
      this._strokeBegin(event);
      return;
    }
    this.dispatchEvent(
      new CustomEvent("beforeUpdateStroke", { detail: event })
    );
    const point = this._createPoint(event.x, event.y, event.pressure);
    const lastPointGroup = this._data[this._data.length - 1];
    const lastPoints = lastPointGroup.points;
    const lastPoint = lastPoints.length > 0 && lastPoints[lastPoints.length - 1];
    const isLastPointTooClose = lastPoint ? point.distanceTo(lastPoint) <= this.minDistance : false;
    const pointGroupOptions = this._getPointGroupOptions(lastPointGroup);
    if (!lastPoint || !(lastPoint && isLastPointTooClose)) {
      const curve = this._addPoint(point, pointGroupOptions);
      if (!lastPoint) {
        this._drawDot(point, pointGroupOptions);
      } else if (curve) {
        this._drawCurve(curve, pointGroupOptions);
      }
      lastPoints.push({
        time: point.time,
        x: point.x,
        y: point.y,
        pressure: point.pressure
      });
    }
    this.dispatchEvent(new CustomEvent("afterUpdateStroke", { detail: event }));
  }
  _strokeEnd(event, shouldUpdate = true) {
    this._removeMoveUpEventListeners();
    if (!this._drawingStroke) {
      return;
    }
    if (shouldUpdate) {
      this._strokeUpdate(event);
    }
    this._drawingStroke = false;
    this._strokePointerId = void 0;
    this.dispatchEvent(new CustomEvent("endStroke", { detail: event }));
  }
  _handlePointerEvents() {
    this._drawingStroke = false;
    this.canvas.addEventListener("pointerdown", this._handlePointerDown, {
      passive: false
    });
  }
  _handleMouseEvents() {
    this._drawingStroke = false;
    this.canvas.addEventListener("mousedown", this._handleMouseDown, {
      passive: false
    });
  }
  _handleTouchEvents() {
    this.canvas.addEventListener("touchstart", this._handleTouchStart, {
      passive: false
    });
  }
  // Called when a new line is started
  _reset(options) {
    this._lastPoints = [];
    this._lastVelocity = 0;
    this._lastWidth = (options.minWidth + options.maxWidth) / 2;
    this._ctx.fillStyle = options.penColor;
    this._ctx.globalCompositeOperation = options.compositeOperation;
  }
  _createPoint(x, y, pressure) {
    const rect = this.canvas.getBoundingClientRect();
    return new Point(
      x - rect.left,
      y - rect.top,
      pressure,
      (/* @__PURE__ */ new Date()).getTime()
    );
  }
  // Add point to _lastPoints array and generate a new curve if there are enough points (i.e. 3)
  _addPoint(point, options) {
    const { _lastPoints } = this;
    _lastPoints.push(point);
    if (_lastPoints.length > 2) {
      if (_lastPoints.length === 3) {
        _lastPoints.unshift(_lastPoints[0]);
      }
      const widths = this._calculateCurveWidths(
        _lastPoints[1],
        _lastPoints[2],
        options
      );
      const curve = Bezier.fromPoints(_lastPoints, widths);
      _lastPoints.shift();
      return curve;
    }
    return null;
  }
  _calculateCurveWidths(startPoint, endPoint, options) {
    const velocity = options.velocityFilterWeight * endPoint.velocityFrom(startPoint) + (1 - options.velocityFilterWeight) * this._lastVelocity;
    const newWidth = this._strokeWidth(velocity, options);
    const widths = {
      end: newWidth,
      start: this._lastWidth
    };
    this._lastVelocity = velocity;
    this._lastWidth = newWidth;
    return widths;
  }
  _strokeWidth(velocity, options) {
    return Math.max(options.maxWidth / (velocity + 1), options.minWidth);
  }
  _drawCurveSegment(x, y, width) {
    const ctx = this._ctx;
    ctx.moveTo(x, y);
    ctx.arc(x, y, width, 0, 2 * Math.PI, false);
    this._isEmpty = false;
  }
  _drawCurve(curve, options) {
    const ctx = this._ctx;
    const widthDelta = curve.endWidth - curve.startWidth;
    const drawSteps = Math.ceil(curve.length()) * 2;
    ctx.beginPath();
    ctx.fillStyle = options.penColor;
    for (let i = 0; i < drawSteps; i += 1) {
      const t = i / drawSteps;
      const tt = t * t;
      const ttt = tt * t;
      const u = 1 - t;
      const uu = u * u;
      const uuu = uu * u;
      let x = uuu * curve.startPoint.x;
      x += 3 * uu * t * curve.control1.x;
      x += 3 * u * tt * curve.control2.x;
      x += ttt * curve.endPoint.x;
      let y = uuu * curve.startPoint.y;
      y += 3 * uu * t * curve.control1.y;
      y += 3 * u * tt * curve.control2.y;
      y += ttt * curve.endPoint.y;
      const width = Math.min(
        curve.startWidth + ttt * widthDelta,
        options.maxWidth
      );
      this._drawCurveSegment(x, y, width);
    }
    ctx.closePath();
    ctx.fill();
  }
  _drawDot(point, options) {
    const ctx = this._ctx;
    const width = options.dotSize > 0 ? options.dotSize : (options.minWidth + options.maxWidth) / 2;
    ctx.beginPath();
    this._drawCurveSegment(point.x, point.y, width);
    ctx.closePath();
    ctx.fillStyle = options.penColor;
    ctx.fill();
  }
  _fromData(pointGroups, drawCurve, drawDot) {
    for (const group of pointGroups) {
      const { points } = group;
      const pointGroupOptions = this._getPointGroupOptions(group);
      if (points.length > 1) {
        for (let j = 0; j < points.length; j += 1) {
          const basicPoint = points[j];
          const point = new Point(
            basicPoint.x,
            basicPoint.y,
            basicPoint.pressure,
            basicPoint.time
          );
          if (j === 0) {
            this._reset(pointGroupOptions);
          }
          const curve = this._addPoint(point, pointGroupOptions);
          if (curve) {
            drawCurve(curve, pointGroupOptions);
          }
        }
      } else {
        this._reset(pointGroupOptions);
        drawDot(points[0], pointGroupOptions);
      }
    }
  }
  toSVG({ includeBackgroundColor = false, includeDataUrl = false } = {}) {
    const pointGroups = this._data;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    const minX = 0;
    const minY = 0;
    const maxX = this.canvas.width / ratio;
    const maxY = this.canvas.height / ratio;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
    svg.setAttribute("viewBox", `${minX} ${minY} ${maxX} ${maxY}`);
    svg.setAttribute("width", maxX.toString());
    svg.setAttribute("height", maxY.toString());
    if (includeBackgroundColor && this.backgroundColor) {
      const rect = document.createElement("rect");
      rect.setAttribute("width", "100%");
      rect.setAttribute("height", "100%");
      rect.setAttribute("fill", this.backgroundColor);
      svg.appendChild(rect);
    }
    if (includeDataUrl && this._dataUrl) {
      const ratio2 = this._dataUrlOptions?.ratio || window.devicePixelRatio || 1;
      const width = this._dataUrlOptions?.width || this.canvas.width / ratio2;
      const height = this._dataUrlOptions?.height || this.canvas.height / ratio2;
      const xOffset = this._dataUrlOptions?.xOffset || 0;
      const yOffset = this._dataUrlOptions?.yOffset || 0;
      const image = document.createElement("image");
      image.setAttribute("x", xOffset.toString());
      image.setAttribute("y", yOffset.toString());
      image.setAttribute("width", width.toString());
      image.setAttribute("height", height.toString());
      image.setAttribute("preserveAspectRatio", "none");
      image.setAttribute("href", this._dataUrl);
      svg.appendChild(image);
    }
    this._fromData(
      pointGroups,
      (curve, { penColor }) => {
        const path = document.createElement("path");
        if (!isNaN(curve.control1.x) && !isNaN(curve.control1.y) && !isNaN(curve.control2.x) && !isNaN(curve.control2.y)) {
          const attr = `M ${curve.startPoint.x.toFixed(3)},${curve.startPoint.y.toFixed(
            3
          )} C ${curve.control1.x.toFixed(3)},${curve.control1.y.toFixed(3)} ${curve.control2.x.toFixed(3)},${curve.control2.y.toFixed(3)} ${curve.endPoint.x.toFixed(3)},${curve.endPoint.y.toFixed(3)}`;
          path.setAttribute("d", attr);
          path.setAttribute("stroke-width", (curve.endWidth * 2.25).toFixed(3));
          path.setAttribute("stroke", penColor);
          path.setAttribute("fill", "none");
          path.setAttribute("stroke-linecap", "round");
          svg.appendChild(path);
        }
      },
      (point, { penColor, dotSize, minWidth, maxWidth }) => {
        const circle = document.createElement("circle");
        const size = dotSize > 0 ? dotSize : (minWidth + maxWidth) / 2;
        circle.setAttribute("r", size.toString());
        circle.setAttribute("cx", point.x.toString());
        circle.setAttribute("cy", point.y.toString());
        circle.setAttribute("fill", penColor);
        svg.appendChild(circle);
      }
    );
    return svg.outerHTML;
  }
};

var Signature = /*#__PURE__*/forwardRef(function (_ref, ref) {
  var _ref$style = _ref.style,
    style = _ref$style === void 0 ? {} : _ref$style,
    _ref$className = _ref.className,
    className = _ref$className === void 0 ? "" : _ref$className,
    value = _ref.value,
    onChange = _ref.onChange,
    _ref$height = _ref.height,
    height = _ref$height === void 0 ? "300px" : _ref$height;
  var canvasRef = useRef(null);
  var sigPadRef = useRef(null);
  var undoDataRef = useRef([]);
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    menuOpen = _useState2[0],
    setMenuOpen = _useState2[1];
  var _useState3 = useState("#000000"),
    _useState4 = _slicedToArray(_useState3, 2),
    penColor = _useState4[0],
    setPenColor = _useState4[1];
  var _useState5 = useState("#ffffff"),
    _useState6 = _slicedToArray(_useState5, 2),
    bgColor = _useState6[0],
    setBgColor = _useState6[1];
  var _useState7 = useState(2),
    _useState8 = _slicedToArray(_useState7, 2),
    strokeWidth = _useState8[0],
    setStrokeWidth = _useState8[1];

  // ✅ INIT ONLY ONCE
  useEffect(function () {
    var canvas = canvasRef.current;
    sigPadRef.current = new SignaturePad(canvas, {
      penColor: penColor,
      backgroundColor: bgColor,
      minWidth: strokeWidth,
      maxWidth: strokeWidth + 1
    });
    var resizeCanvas = function resizeCanvas() {
      var ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext("2d").scale(ratio, ratio);
      sigPadRef.current.clear();
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // ✅ TRACK DRAWING
    sigPadRef.current.addEventListener("endStroke", function () {
      undoDataRef.current = [];
      var dataUrl = sigPadRef.current.toDataURL();
      onChange && onChange(dataUrl);
    });
    return function () {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // ✅ UPDATE PEN SETTINGS (NO RE-CREATE)
  useEffect(function () {
    if (!sigPadRef.current) return;
    sigPadRef.current.penColor = penColor;
    sigPadRef.current.minWidth = strokeWidth;
    sigPadRef.current.maxWidth = strokeWidth + 1;
  }, [penColor, strokeWidth]);

  // ✅ BACKGROUND CHANGE (SAFE WAY)
  useEffect(function () {
    if (!sigPadRef.current) return;
    var data = sigPadRef.current.toData();
    sigPadRef.current.clear();
    sigPadRef.current.backgroundColor = bgColor;
    sigPadRef.current.fromData(data);
  }, [bgColor]);

  // ✅ CONTROLLED MODE
  useEffect(function () {
    if (!sigPadRef.current) return;
    if (value) {
      sigPadRef.current.fromDataURL(value);
    } else {
      sigPadRef.current.clear();
    }
  }, [value]);

  // ✅ Undo
  var undo = function undo() {
    if (!sigPadRef.current.isEmpty()) {
      var data = sigPadRef.current.toData();
      if (data.length > 0) {
        undoDataRef.current.push(data.pop());
        sigPadRef.current.fromData(data);
      }
    }
  };

  // ✅ Redo
  var redo = function redo() {
    var data = sigPadRef.current.toData();
    if (undoDataRef.current.length > 0) {
      data.push(undoDataRef.current.pop());
      sigPadRef.current.fromData(data);
    }
  };

  // ✅ Clear
  var clear = function clear() {
    sigPadRef.current.clear();
    undoDataRef.current = [];
    onChange && onChange(""); // controlled sync
  };

  // ✅ Download
  var download = function download() {
    if (sigPadRef.current.isEmpty()) return;
    var dataURL = sigPadRef.current.toDataURL();
    var a = document.createElement("a");
    a.href = dataURL;
    a.download = "signature.png";
    a.click();
  };

  // ✅ Check empty
  var isEmpty = function isEmpty() {
    return sigPadRef.current.isEmpty();
  };
  useImperativeHandle(ref, function () {
    return {
      undo: undo,
      redo: redo,
      clear: clear,
      download: download,
      isEmpty: isEmpty
    };
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "rsl-signature-con"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rsl-menu-con"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rsl-menu-icon",
    onClick: function onClick() {
      return setMenuOpen(true);
    }
  }, "\u2630"), menuOpen && /*#__PURE__*/React.createElement("div", {
    className: "rsl-signature-menu"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rsl-menu-header"
  }, /*#__PURE__*/React.createElement("span", null, "Tools"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "rsl-close-btn",
    onClick: function onClick() {
      return setMenuOpen(false);
    }
  }, "\u2715")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: undo
  }, "Undo"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: redo
  }, "Redo"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: clear
  }, "Clear"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: download
  }, "Download"), /*#__PURE__*/React.createElement("div", {
    className: "rsl-menu-group"
  }, /*#__PURE__*/React.createElement("label", null, "Pen Color"), /*#__PURE__*/React.createElement("input", {
    type: "color",
    value: penColor,
    onChange: function onChange(e) {
      return setPenColor(e.target.value);
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "rsl-menu-group"
  }, /*#__PURE__*/React.createElement("label", null, "Background"), /*#__PURE__*/React.createElement("input", {
    type: "color",
    value: bgColor,
    onChange: function onChange(e) {
      return setBgColor(e.target.value);
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "rsl-menu-group"
  }, /*#__PURE__*/React.createElement("label", null, "Stroke"), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "1",
    max: "10",
    value: strokeWidth,
    onChange: function onChange(e) {
      return setStrokeWidth(Number(e.target.value));
    }
  })))), /*#__PURE__*/React.createElement("canvas", {
    ref: canvasRef,
    className: "rsl-canvas ".concat(className),
    style: _objectSpread2({
      height: height,
      background: bgColor
    }, style)
  }));
});

var dataURLtoBlob = function dataURLtoBlob(dataURL) {
  var arr = dataURL.split(",");
  var mime = arr[0].match(/:(.*?);/)[1];
  var bstr = atob(arr[1]);
  var n = bstr.length;
  var u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {
    type: mime
  });
};

export { Signature, dataURLtoBlob };
