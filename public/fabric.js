var jsdom,
  virtualWindow,
  fabric = fabric || { version: '5.3.0' }
function resizeCanvasIfNeeded(t) {
  var e = t.targetCanvas,
    i = e.width,
    r = e.height,
    n = t.destinationWidth,
    t = t.destinationHeight
  ;(i === n && r === t) || ((e.width = n), (e.height = t))
}
function copyGLTo2DDrawImage(t, e) {
  var t = t.canvas,
    e = e.targetCanvas,
    i = e.getContext('2d'),
    r = (i.translate(0, e.height), i.scale(1, -1), t.height - e.height)
  i.drawImage(t, 0, r, e.width, e.height, 0, 0, e.width, e.height)
}
function copyGLTo2DPutImageData(t, e) {
  var i = e.targetCanvas.getContext('2d'),
    r = e.destinationWidth,
    e = e.destinationHeight,
    n = r * e * 4,
    s = new Uint8Array(this.imageBuffer, 0, n),
    n = new Uint8ClampedArray(this.imageBuffer, 0, n),
    t =
      (t.readPixels(0, 0, r, e, t.RGBA, t.UNSIGNED_BYTE, s),
      new ImageData(n, r, e))
  i.putImageData(t, 0, 0)
}
'undefined' != typeof exports
  ? (exports.fabric = fabric)
  : 'function' == typeof define &&
    define.amd &&
    define([], function () {
      return fabric
    }),
  'undefined' != typeof document && 'undefined' != typeof window
    ? (document instanceof
      ('undefined' != typeof HTMLDocument ? HTMLDocument : Document)
        ? (fabric.document = document)
        : (fabric.document = document.implementation.createHTMLDocument('')),
      (fabric.window = window))
    : ((jsdom = require('jsdom')),
      (virtualWindow = new jsdom.JSDOM(
        decodeURIComponent(
          '%3C!DOCTYPE%20html%3E%3Chtml%3E%3Chead%3E%3C%2Fhead%3E%3Cbody%3E%3C%2Fbody%3E%3C%2Fhtml%3E'
        ),
        { features: { FetchExternalResources: ['img'] }, resources: 'usable' }
      ).window),
      (fabric.document = virtualWindow.document),
      (fabric.jsdomImplForWrapper =
        require('jsdom/lib/jsdom/living/generated/utils').implForWrapper),
      (fabric.nodeCanvas = require('jsdom/lib/jsdom/utils').Canvas),
      (fabric.window = virtualWindow),
      (DOMParser = fabric.window.DOMParser)),
  (fabric.isTouchSupported =
    'ontouchstart' in fabric.window ||
    'ontouchstart' in fabric.document ||
    (fabric.window &&
      fabric.window.navigator &&
      0 < fabric.window.navigator.maxTouchPoints)),
  (fabric.isLikelyNode =
    'undefined' != typeof Buffer && 'undefined' == typeof window),
  (fabric.SHARED_ATTRIBUTES = [
    'display',
    'transform',
    'fill',
    'fill-opacity',
    'fill-rule',
    'opacity',
    'stroke',
    'stroke-dasharray',
    'stroke-linecap',
    'stroke-dashoffset',
    'stroke-linejoin',
    'stroke-miterlimit',
    'stroke-opacity',
    'stroke-width',
    'id',
    'paint-order',
    'vector-effect',
    'instantiated_by_use',
    'clip-path',
  ]),
  (fabric.DPI = 96),
  (fabric.reNum = '(?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:[eE][-+]?\\d+)?)'),
  (fabric.commaWsp = '(?:\\s+,?\\s*|,\\s*)'),
  (fabric.rePathCommand =
    /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:[eE][-+]?\d+)?)/gi),
  (fabric.reNonWord = /[ \n\.,;!\?\-]/),
  (fabric.fontPaths = {}),
  (fabric.iMatrix = [1, 0, 0, 1, 0, 0]),
  (fabric.svgNS = 'http://www.w3.org/2000/svg'),
  (fabric.perfLimitSizeTotal = 2097152),
  (fabric.maxCacheSideLimit = 4096),
  (fabric.minCacheSideLimit = 256),
  (fabric.charWidthsCache = {}),
  (fabric.textureSize = 2048),
  (fabric.disableStyleCopyPaste = !1),
  (fabric.enableGLFiltering = !0),
  (fabric.devicePixelRatio =
    fabric.window.devicePixelRatio ||
    fabric.window.webkitDevicePixelRatio ||
    fabric.window.mozDevicePixelRatio ||
    1),
  (fabric.browserShadowBlurConstant = 1),
  (fabric.arcToSegmentsCache = {}),
  (fabric.boundsOfCurveCache = {}),
  (fabric.cachesBoundsOfCurve = !0),
  (fabric.forceGLPutImageData = !1),
  (fabric.initFilterBackend = function () {
    return fabric.enableGLFiltering &&
      fabric.isWebglSupported &&
      fabric.isWebglSupported(fabric.textureSize)
      ? (console.log('max texture size: ' + fabric.maxTextureSize),
        new fabric.WebglFilterBackend({ tileSize: fabric.textureSize }))
      : fabric.Canvas2dFilterBackend
      ? new fabric.Canvas2dFilterBackend()
      : void 0
  }),
  'undefined' != typeof document &&
    'undefined' != typeof window &&
    (window.fabric = fabric),
  (function () {
    function r(t, e) {
      this.__eventListeners[t] &&
        ((t = this.__eventListeners[t]),
        e ? (t[t.indexOf(e)] = !1) : fabric.util.array.fill(t, !1))
    }
    function n(t, e) {
      var i = function () {
        e.apply(this, arguments), this.off(t, i)
      }.bind(this)
      this.on(t, i)
    }
    fabric.Observable = {
      fire: function (t, e) {
        if (!this.__eventListeners) return this
        var i = this.__eventListeners[t]
        if (!i) return this
        for (var r = 0, n = i.length; r < n; r++)
          i[r] && i[r].call(this, e || {})
        return (
          (this.__eventListeners[t] = i.filter(function (t) {
            return !1 !== t
          })),
          this
        )
      },
      on: function (t, e) {
        if (
          (this.__eventListeners || (this.__eventListeners = {}),
          1 === arguments.length)
        )
          for (var i in t) this.on(i, t[i])
        else
          this.__eventListeners[t] || (this.__eventListeners[t] = []),
            this.__eventListeners[t].push(e)
        return this
      },
      once: function (t, e) {
        if (1 === arguments.length) for (var i in t) n.call(this, i, t[i])
        else n.call(this, t, e)
        return this
      },
      off: function (t, e) {
        if (!this.__eventListeners) return this
        if (0 === arguments.length)
          for (t in this.__eventListeners) r.call(this, t)
        else if (1 === arguments.length && 'object' == typeof arguments[0])
          for (var i in t) r.call(this, i, t[i])
        else r.call(this, t, e)
        return this
      },
    }
  })(),
  (fabric.Collection = {
    _objects: [],
    add: function () {
      if (
        (this._objects.push.apply(this._objects, arguments),
        this._onObjectAdded)
      )
        for (var t = 0, e = arguments.length; t < e; t++)
          this._onObjectAdded(arguments[t])
      return this.renderOnAddRemove && this.requestRenderAll(), this
    },
    insertAt: function (t, e, i) {
      var r = this._objects
      return (
        i ? (r[e] = t) : r.splice(e, 0, t),
        this._onObjectAdded && this._onObjectAdded(t),
        this.renderOnAddRemove && this.requestRenderAll(),
        this
      )
    },
    remove: function () {
      for (
        var t, e = this._objects, i = !1, r = 0, n = arguments.length;
        r < n;
        r++
      )
        -1 !== (t = e.indexOf(arguments[r])) &&
          ((i = !0),
          e.splice(t, 1),
          this._onObjectRemoved && this._onObjectRemoved(arguments[r]))
      return this.renderOnAddRemove && i && this.requestRenderAll(), this
    },
    forEachObject: function (t, e) {
      for (var i = this.getObjects(), r = 0, n = i.length; r < n; r++)
        t.call(e, i[r], r, i)
      return this
    },
    getObjects: function (e) {
      return void 0 === e
        ? this._objects.concat()
        : this._objects.filter(function (t) {
            return t.type === e
          })
    },
    item: function (t) {
      return this._objects[t]
    },
    isEmpty: function () {
      return 0 === this._objects.length
    },
    size: function () {
      return this._objects.length
    },
    contains: function (e, t) {
      return (
        -1 < this._objects.indexOf(e) ||
        (!!t &&
          this._objects.some(function (t) {
            return 'function' == typeof t.contains && t.contains(e, !0)
          }))
      )
    },
    complexity: function () {
      return this._objects.reduce(function (t, e) {
        return (t += e.complexity ? e.complexity() : 0)
      }, 0)
    },
  }),
  (fabric.CommonMethods = {
    _setOptions: function (t) {
      for (var e in t) this.set(e, t[e])
    },
    _initGradient: function (t, e) {
      !t ||
        !t.colorStops ||
        t instanceof fabric.Gradient ||
        this.set(e, new fabric.Gradient(t))
    },
    _initPattern: function (t, e, i) {
      !t || !t.source || t instanceof fabric.Pattern
        ? i && i()
        : this.set(e, new fabric.Pattern(t, i))
    },
    _setObject: function (t) {
      for (var e in t) this._set(e, t[e])
    },
    set: function (t, e) {
      return 'object' == typeof t ? this._setObject(t) : this._set(t, e), this
    },
    _set: function (t, e) {
      this[t] = e
    },
    toggle: function (t) {
      var e = this.get(t)
      return 'boolean' == typeof e && this.set(t, !e), this
    },
    get: function (t) {
      return this[t]
    },
  }),
  (function (s) {
    var o = Math.sqrt,
      a = Math.atan2,
      c = Math.pow,
      h = Math.PI / 180,
      i = Math.PI / 2
    fabric.util = {
      cos: function (t) {
        if (0 === t) return 1
        switch ((t = t < 0 ? -t : t) / i) {
          case 1:
          case 3:
            return 0
          case 2:
            return -1
        }
        return Math.cos(t)
      },
      sin: function (t) {
        if (0 === t) return 0
        var e = t < 0 ? -1 : 1
        switch (t / i) {
          case 1:
            return e
          case 2:
            return 0
          case 3:
            return -e
        }
        return Math.sin(t)
      },
      removeFromArray: function (t, e) {
        e = t.indexOf(e)
        return -1 !== e && t.splice(e, 1), t
      },
      getRandomInt: function (t, e) {
        return Math.floor(Math.random() * (e - t + 1)) + t
      },
      degreesToRadians: function (t) {
        return t * h
      },
      radiansToDegrees: function (t) {
        return t / h
      },
      rotatePoint: function (t, e, i) {
        ;(t = new fabric.Point(t.x - e.x, t.y - e.y)),
          (t = fabric.util.rotateVector(t, i))
        return new fabric.Point(t.x, t.y).addEquals(e)
      },
      rotateVector: function (t, e) {
        var i = fabric.util.sin(e),
          e = fabric.util.cos(e)
        return { x: t.x * e - t.y * i, y: t.x * i + t.y * e }
      },
      createVector: function (t, e) {
        return new fabric.Point(e.x - t.x, e.y - t.y)
      },
      calcAngleBetweenVectors: function (t, e) {
        return Math.acos(
          (t.x * e.x + t.y * e.y) /
            (Math.hypot(t.x, t.y) * Math.hypot(e.x, e.y))
        )
      },
      getHatVector: function (t) {
        return new fabric.Point(t.x, t.y).multiply(1 / Math.hypot(t.x, t.y))
      },
      getBisector: function (t, e, i) {
        ;(e = fabric.util.createVector(t, e)),
          (t = fabric.util.createVector(t, i)),
          (i = fabric.util.calcAngleBetweenVectors(e, t)),
          (t = fabric.util.calcAngleBetweenVectors(
            fabric.util.rotateVector(e, i),
            t
          ))
        return {
          vector: fabric.util.getHatVector(
            fabric.util.rotateVector(e, (i * (0 === t ? 1 : -1)) / 2)
          ),
          angle: i,
        }
      },
      projectStrokeOnPoints: function (o, a, c) {
        function h(t) {
          var e = u / Math.hypot(t.x, t.y)
          return new fabric.Point(t.x * e * f.x, t.y * e * f.y)
        }
        var l = [],
          u = a.strokeWidth / 2,
          f = a.strokeUniform
            ? new fabric.Point(1 / a.scaleX, 1 / a.scaleY)
            : new fabric.Point(1, 1)
        return (
          o.length <= 1 ||
            o.forEach(function (t, e) {
              var i,
                r,
                t = new fabric.Point(t.x, t.y),
                e =
                  (0 === e
                    ? ((s = o[e + 1]),
                      (n = c
                        ? h(fabric.util.createVector(s, t)).addEquals(t)
                        : o[o.length - 1]))
                    : (s =
                        e === o.length - 1
                          ? ((n = o[e - 1]),
                            c
                              ? h(fabric.util.createVector(n, t)).addEquals(t)
                              : o[0])
                          : ((n = o[e - 1]), o[e + 1])),
                  fabric.util.getBisector(t, n, s)),
                n = e.vector,
                s = e.angle
              if (
                'miter' === a.strokeLineJoin &&
                ((i = -u / Math.sin(s / 2)),
                (r = new fabric.Point(n.x * i * f.x, n.y * i * f.y)),
                Math.hypot(r.x, r.y) / u <= a.strokeMiterLimit)
              )
                return l.push(t.add(r)), void l.push(t.subtract(r))
              ;(i = -u * Math.SQRT2),
                (r = new fabric.Point(n.x * i * f.x, n.y * i * f.y)),
                l.push(t.add(r)),
                l.push(t.subtract(r))
            }),
          l
        )
      },
      transformPoint: function (t, e, i) {
        return i
          ? new fabric.Point(e[0] * t.x + e[2] * t.y, e[1] * t.x + e[3] * t.y)
          : new fabric.Point(
              e[0] * t.x + e[2] * t.y + e[4],
              e[1] * t.x + e[3] * t.y + e[5]
            )
      },
      makeBoundingBoxFromPoints: function (t, e) {
        if (e)
          for (var i = 0; i < t.length; i++)
            t[i] = fabric.util.transformPoint(t[i], e)
        var r = [t[0].x, t[1].x, t[2].x, t[3].x],
          n = fabric.util.array.min(r),
          r = fabric.util.array.max(r) - n,
          s = [t[0].y, t[1].y, t[2].y, t[3].y],
          o = fabric.util.array.min(s)
        return {
          left: n,
          top: o,
          width: r,
          height: fabric.util.array.max(s) - o,
        }
      },
      invertTransform: function (t) {
        var e = 1 / (t[0] * t[3] - t[1] * t[2]),
          e = [e * t[3], -e * t[1], -e * t[2], e * t[0]],
          t = fabric.util.transformPoint({ x: t[4], y: t[5] }, e, !0)
        return (e[4] = -t.x), (e[5] = -t.y), e
      },
      toFixed: function (t, e) {
        return parseFloat(Number(t).toFixed(e))
      },
      parseUnit: function (t, e) {
        var i = /\D{0,2}$/.exec(t),
          r = parseFloat(t)
        switch (((e = e || fabric.Text.DEFAULT_SVG_FONT_SIZE), i[0])) {
          case 'mm':
            return (r * fabric.DPI) / 25.4
          case 'cm':
            return (r * fabric.DPI) / 2.54
          case 'in':
            return r * fabric.DPI
          case 'pt':
            return (r * fabric.DPI) / 72
          case 'pc':
            return ((r * fabric.DPI) / 72) * 12
          case 'em':
            return r * e
          default:
            return r
        }
      },
      falseFunction: function () {
        return !1
      },
      getKlass: function (t, e) {
        return (
          (t = fabric.util.string.camelize(
            t.charAt(0).toUpperCase() + t.slice(1)
          )),
          fabric.util.resolveNamespace(e)[t]
        )
      },
      getSvgAttributes: function (t) {
        var e = ['instantiated_by_use', 'style', 'id', 'class']
        switch (t) {
          case 'linearGradient':
            e = e.concat([
              'x1',
              'y1',
              'x2',
              'y2',
              'gradientUnits',
              'gradientTransform',
            ])
            break
          case 'radialGradient':
            e = e.concat([
              'gradientUnits',
              'gradientTransform',
              'cx',
              'cy',
              'r',
              'fx',
              'fy',
              'fr',
            ])
            break
          case 'stop':
            e = e.concat(['offset', 'stop-color', 'stop-opacity'])
        }
        return e
      },
      resolveNamespace: function (t) {
        if (!t) return fabric
        for (
          var e = t.split('.'), i = e.length, r = s || fabric.window, n = 0;
          n < i;
          ++n
        )
          r = r[e[n]]
        return r
      },
      loadImage: function (t, e, i, r) {
        var n, s
        t
          ? (((n = fabric.util.createImage()).onload = s =
              function () {
                e && e.call(i, n, !1), (n = n.onload = n.onerror = null)
              }),
            (n.onerror = function () {
              fabric.log('Error loading ' + n.src),
                e && e.call(i, null, !0),
                (n = n.onload = n.onerror = null)
            }),
            0 !== t.indexOf('data') && null != r && (n.crossOrigin = r),
            'data:image/svg' === t.substring(0, 14) &&
              ((n.onload = null), fabric.util.loadImageInDom(n, s)),
            (n.src = t))
          : e && e.call(i, t)
      },
      loadImageInDom: function (t, e) {
        var i = fabric.document.createElement('div')
        ;(i.style.width = i.style.height = '1px'),
          (i.style.left = i.style.top = '-100%'),
          (i.style.position = 'absolute'),
          i.appendChild(t),
          fabric.document.querySelector('body').appendChild(i),
          (t.onload = function () {
            e(), i.parentNode.removeChild(i), (i = null)
          })
      },
      enlivenObjects: function (t, e, n, s) {
        var o = [],
          i = 0,
          r = (t = t || []).length
        function a() {
          ++i === r &&
            e &&
            e(
              o.filter(function (t) {
                return t
              })
            )
        }
        r
          ? t.forEach(function (i, r) {
              i && i.type
                ? fabric.util
                    .getKlass(i.type, n)
                    .fromObject(i, function (t, e) {
                      e || (o[r] = t), s && s(i, t, e), a()
                    })
                : a()
            })
          : e && e(o)
      },
      enlivenObjectEnlivables: function (e, n, t) {
        var s = fabric.Object.ENLIVEN_PROPS.filter(function (t) {
          return !!e[t]
        })
        fabric.util.enlivenObjects(
          s.map(function (t) {
            return e[t]
          }),
          function (i) {
            var r = {}
            s.forEach(function (t, e) {
              ;(r[t] = i[e]), n && (n[t] = i[e])
            }),
              t && t(r)
          }
        )
      },
      enlivenPatterns: function (t, e) {
        function i() {
          ++n === s && e && e(r)
        }
        var r = [],
          n = 0,
          s = (t = t || []).length
        s
          ? t.forEach(function (t, e) {
              t && t.source
                ? new fabric.Pattern(t, function (t) {
                    ;(r[e] = t), i()
                  })
                : ((r[e] = t), i())
            })
          : e && e(r)
      },
      groupSVGElements: function (t, e, i) {
        return t && 1 === t.length
          ? (void 0 !== i && (t[0].sourcePath = i), t[0])
          : (e &&
              (e.width && e.height
                ? (e.centerPoint = { x: e.width / 2, y: e.height / 2 })
                : (delete e.width, delete e.height)),
            (t = new fabric.Group(t, e)),
            void 0 !== i && (t.sourcePath = i),
            t)
      },
      populateWithProperties: function (t, e, i) {
        if (i && Array.isArray(i))
          for (var r = 0, n = i.length; r < n; r++)
            i[r] in t && (e[i[r]] = t[i[r]])
      },
      createCanvasElement: function () {
        return fabric.document.createElement('canvas')
      },
      copyCanvasElement: function (t) {
        var e = fabric.util.createCanvasElement()
        return (
          (e.width = t.width),
          (e.height = t.height),
          e.getContext('2d').drawImage(t, 0, 0),
          e
        )
      },
      toDataURL: function (t, e, i) {
        return t.toDataURL('image/' + e, i)
      },
      createImage: function () {
        return fabric.document.createElement('img')
      },
      multiplyTransformMatrices: function (t, e, i) {
        return [
          t[0] * e[0] + t[2] * e[1],
          t[1] * e[0] + t[3] * e[1],
          t[0] * e[2] + t[2] * e[3],
          t[1] * e[2] + t[3] * e[3],
          i ? 0 : t[0] * e[4] + t[2] * e[5] + t[4],
          i ? 0 : t[1] * e[4] + t[3] * e[5] + t[5],
        ]
      },
      qrDecompose: function (t) {
        var e = a(t[1], t[0]),
          i = c(t[0], 2) + c(t[1], 2),
          r = o(i),
          n = (t[0] * t[3] - t[2] * t[1]) / r,
          i = a(t[0] * t[2] + t[1] * t[3], i)
        return {
          angle: e / h,
          scaleX: r,
          scaleY: n,
          skewX: i / h,
          skewY: 0,
          translateX: t[4],
          translateY: t[5],
        }
      },
      calcRotateMatrix: function (t) {
        if (!t.angle) return fabric.iMatrix.concat()
        var t = fabric.util.degreesToRadians(t.angle),
          e = fabric.util.cos(t),
          t = fabric.util.sin(t)
        return [e, t, -t, e, 0, 0]
      },
      calcDimensionsMatrix: function (t) {
        var e = void 0 === t.scaleX ? 1 : t.scaleX,
          i = void 0 === t.scaleY ? 1 : t.scaleY,
          e = [t.flipX ? -e : e, 0, 0, t.flipY ? -i : i, 0, 0],
          i = fabric.util.multiplyTransformMatrices,
          r = fabric.util.degreesToRadians
        return (
          t.skewX && (e = i(e, [1, 0, Math.tan(r(t.skewX)), 1], !0)),
          (e = t.skewY ? i(e, [1, Math.tan(r(t.skewY)), 0, 1], !0) : e)
        )
      },
      composeMatrix: function (t) {
        var e = [1, 0, 0, 1, t.translateX || 0, t.translateY || 0],
          i = fabric.util.multiplyTransformMatrices
        return (
          t.angle && (e = i(e, fabric.util.calcRotateMatrix(t))),
          (e =
            1 !== t.scaleX ||
            1 !== t.scaleY ||
            t.skewX ||
            t.skewY ||
            t.flipX ||
            t.flipY
              ? i(e, fabric.util.calcDimensionsMatrix(t))
              : e)
        )
      },
      resetObjectTransform: function (t) {
        ;(t.scaleX = 1),
          (t.scaleY = 1),
          (t.skewX = 0),
          (t.skewY = 0),
          (t.flipX = !1),
          (t.flipY = !1),
          t.rotate(0)
      },
      saveObjectTransform: function (t) {
        return {
          scaleX: t.scaleX,
          scaleY: t.scaleY,
          skewX: t.skewX,
          skewY: t.skewY,
          angle: t.angle,
          left: t.left,
          flipX: t.flipX,
          flipY: t.flipY,
          top: t.top,
        }
      },
      isTransparent: function (t, e, i, r) {
        0 < r && (r < e ? (e -= r) : (e = 0), r < i ? (i -= r) : (i = 0))
        for (
          var n = !0,
            s = t.getImageData(e, i, 2 * r || 1, 2 * r || 1),
            o = s.data.length,
            a = 3;
          a < o && !1 != (n = s.data[a] <= 0);
          a += 4
        );
        return (s = null), n
      },
      parsePreserveAspectRatioAttribute: function (t) {
        var e,
          i = 'meet',
          t = t.split(' ')
        return (
          t &&
            t.length &&
            ('meet' !== (i = t.pop()) && 'slice' !== i
              ? ((e = i), (i = 'meet'))
              : t.length && (e = t.pop())),
          {
            meetOrSlice: i,
            alignX: 'none' !== e ? e.slice(1, 4) : 'none',
            alignY: 'none' !== e ? e.slice(5, 8) : 'none',
          }
        )
      },
      clearFabricFontCache: function (t) {
        ;(t = (t || '').toLowerCase())
          ? fabric.charWidthsCache[t] && delete fabric.charWidthsCache[t]
          : (fabric.charWidthsCache = {})
      },
      limitDimsByArea: function (t, e) {
        ;(t = Math.sqrt(e * t)), (e = Math.floor(e / t))
        return { x: Math.floor(t), y: e }
      },
      capValue: function (t, e, i) {
        return Math.max(t, Math.min(e, i))
      },
      findScaleToFit: function (t, e) {
        return Math.min(e.width / t.width, e.height / t.height)
      },
      findScaleToCover: function (t, e) {
        return Math.max(e.width / t.width, e.height / t.height)
      },
      matrixToSVG: function (t) {
        return (
          'matrix(' +
          t
            .map(function (t) {
              return fabric.util.toFixed(t, fabric.Object.NUM_FRACTION_DIGITS)
            })
            .join(' ') +
          ')'
        )
      },
      removeTransformFromObject: function (t, e) {
        ;(e = fabric.util.invertTransform(e)),
          (e = fabric.util.multiplyTransformMatrices(e, t.calcOwnMatrix()))
        fabric.util.applyTransformToObject(t, e)
      },
      addTransformToObject: function (t, e) {
        fabric.util.applyTransformToObject(
          t,
          fabric.util.multiplyTransformMatrices(e, t.calcOwnMatrix())
        )
      },
      applyTransformToObject: function (t, e) {
        var e = fabric.util.qrDecompose(e),
          i = new fabric.Point(e.translateX, e.translateY)
        ;(t.flipX = !1),
          (t.flipY = !1),
          t.set('scaleX', e.scaleX),
          t.set('scaleY', e.scaleY),
          (t.skewX = e.skewX),
          (t.skewY = e.skewY),
          (t.angle = e.angle),
          t.setPositionByOrigin(i, 'center', 'center')
      },
      sizeAfterTransform: function (t, e, i) {
        ;(t /= 2),
          (e /= 2),
          (t = [
            { x: -t, y: -e },
            { x: t, y: -e },
            { x: -t, y: e },
            { x: t, y: e },
          ]),
          (e = fabric.util.calcDimensionsMatrix(i)),
          (i = fabric.util.makeBoundingBoxFromPoints(t, e))
        return { x: i.width, y: i.height }
      },
      mergeClipPaths: function (t, e) {
        var i = t,
          r = e,
          e =
            (i.inverted && !r.inverted && ((i = e), (r = t)),
            fabric.util.applyTransformToObject(
              r,
              fabric.util.multiplyTransformMatrices(
                fabric.util.invertTransform(i.calcTransformMatrix()),
                r.calcTransformMatrix()
              )
            ),
            i.inverted && r.inverted)
        return (
          e && (i.inverted = r.inverted = !1),
          new fabric.Group([i], { clipPath: r, inverted: e })
        )
      },
      hasStyleChanged: function (t, e, i) {
        return (
          (i = i || !1),
          t.fill !== e.fill ||
            t.stroke !== e.stroke ||
            t.strokeWidth !== e.strokeWidth ||
            t.fontSize !== e.fontSize ||
            t.fontFamily !== e.fontFamily ||
            t.fontWeight !== e.fontWeight ||
            t.fontStyle !== e.fontStyle ||
            t.textBackgroundColor !== e.textBackgroundColor ||
            t.deltaY !== e.deltaY ||
            (i &&
              (t.overline !== e.overline ||
                t.underline !== e.underline ||
                t.linethrough !== e.linethrough))
        )
      },
      stylesToArray: function (t, e) {
        for (
          var t = fabric.util.object.clone(t, !0),
            i = e.split('\n'),
            r = -1,
            n = {},
            s = [],
            o = 0;
          o < i.length;
          o++
        )
          if (t[o])
            for (var a = 0; a < i[o].length; a++) {
              r++
              var c = t[o][a]
              c &&
                0 < Object.keys(c).length &&
                (fabric.util.hasStyleChanged(n, c, !0)
                  ? s.push({ start: r, end: r + 1, style: c })
                  : s[s.length - 1].end++),
                (n = c || {})
            }
          else r += i[o].length
        return s
      },
      stylesFromArray: function (t, e) {
        if (!Array.isArray(t)) return t
        for (
          var i = e.split('\n'), r = -1, n = 0, s = {}, o = 0;
          o < i.length;
          o++
        )
          for (var a = 0; a < i[o].length; a++)
            r++,
              t[n] &&
                t[n].start <= r &&
                r < t[n].end &&
                ((s[o] = s[o] || {}),
                (s[o][a] = Object.assign({}, t[n].style)),
                r === t[n].end - 1 && n++)
        return s
      },
    }
  })('undefined' != typeof exports ? exports : this),
  (function () {
    var w = Array.prototype.join,
      T = { m: 2, l: 2, h: 1, v: 1, c: 6, s: 4, q: 4, t: 2, a: 7 },
      O = { m: 'l', M: 'L' }
    function d(t, e, i, r, n, s, o) {
      for (
        var a,
          c,
          h,
          l,
          u,
          f,
          d,
          g,
          p,
          m,
          v,
          b,
          y,
          _ = Math.PI,
          o = (o * _) / 180,
          x = fabric.util.sin(o),
          C = fabric.util.cos(o),
          S = 0,
          T = 0,
          o = -C * t * 0.5 - x * e * 0.5,
          w = -C * e * 0.5 + x * t * 0.5,
          O = (i = Math.abs(i)) * i,
          P = (r = Math.abs(r)) * r,
          L = w * w,
          R = o * o,
          k = O * P - O * L - P * R,
          E = 0,
          j =
            (k < 0
              ? ((i *= j = Math.sqrt(1 - k / (O * P))), (r *= j))
              : (E = (n === s ? -1 : 1) * Math.sqrt(k / (O * L + P * R))),
            (E * i * w) / r),
          n = (-E * r * o) / i,
          B = C * j - x * n + 0.5 * t,
          X = x * j + C * n + 0.5 * e,
          A = H(1, 0, (o - j) / i, (w - n) / r),
          k = H((o - j) / i, (w - n) / r, (-o - j) / i, (-w - n) / r),
          W =
            (0 === s && 0 < k ? (k -= 2 * _) : 1 === s && k < 0 && (k += 2 * _),
            Math.ceil(Math.abs((k / _) * 2))),
          D = [],
          M = k / W,
          Y = ((8 / 3) * Math.sin(M / 4) * Math.sin(M / 4)) / Math.sin(M / 2),
          F = A + M,
          I = 0;
        I < W;
        I++
      )
        (D[I] =
          ((a = A),
          (c = F),
          (h = C),
          (l = x),
          (u = i),
          (f = r),
          (d = B),
          (g = X),
          (p = Y),
          (m = S),
          (v = T),
          (y = b = void 0),
          (b = fabric.util.cos(a)),
          (a = fabric.util.sin(a)),
          (y = fabric.util.cos(c)),
          (c = fabric.util.sin(c)),
          [
            'C',
            m + p * (-h * u * a - l * f * b),
            v + p * (-l * u * a + h * f * b),
            (d = h * u * y - l * f * c + d) + p * (h * u * c + l * f * y),
            (g = l * u * y + h * f * c + g) + p * (l * u * c - h * f * y),
            d,
            g,
          ])),
          (S = D[I][5]),
          (T = D[I][6]),
          (A = F),
          (F += M)
      return D
    }
    function H(t, e, i, r) {
      ;(e = Math.atan2(e, t)), (t = Math.atan2(r, i))
      return e <= t ? t - e : 2 * Math.PI - (e - t)
    }
    function g(t, e, i, r) {
      return Math.sqrt((i - t) * (i - t) + (r - e) * (r - e))
    }
    function p(t, e, i) {
      for (var r, n = { x: e, y: i }, s = 0, o = 1; o <= 100; o += 1)
        (r = t(o / 100)), (s += g(n.x, n.y, r.x, r.y)), (n = r)
      return s
    }
    function h(t, e) {
      for (
        var i,
          r,
          n,
          s = 0,
          o = 0,
          a = t.iterator,
          c = { x: t.x, y: t.y },
          h = 0.01,
          t = t.angleFinder;
        o < e && 1e-4 < h;

      )
        (i = a(s)),
          (n = s),
          e < (r = g(c.x, c.y, i.x, i.y)) + o
            ? ((s -= h), (h /= 2))
            : ((c = i), (s += h), (o += r))
      return (i.angle = t(n)), i
    }
    function l(t) {
      for (
        var e,
          i,
          r,
          n,
          s = 0,
          o = t.length,
          a = 0,
          c = 0,
          h = 0,
          l = 0,
          u = [],
          f = 0;
        f < o;
        f++
      ) {
        switch (((r = { x: a, y: c, command: (e = t[f])[0] }), e[0])) {
          case 'M':
            ;(r.length = 0), (h = a = e[1]), (l = c = e[2])
            break
          case 'L':
            ;(r.length = g(a, c, e[1], e[2])), (a = e[1]), (c = e[2])
            break
          case 'C':
            ;(i = (function (n, s, o, a, c, h, l, u) {
              return function (t) {
                var e = t * t * t,
                  i = 3 * t * t * (1 - t),
                  r = 3 * t * (1 - t) * (1 - t),
                  t = (1 - t) * (1 - t) * (1 - t)
                return {
                  x: l * e + c * i + o * r + n * t,
                  y: u * e + h * i + a * r + s * t,
                }
              }
            })(a, c, e[1], e[2], e[3], e[4], e[5], e[6])),
              (n = (function (i, r, n, s, o, a, c, h) {
                return function (t) {
                  var e = 1 - t
                  return Math.atan2(
                    3 * e * e * (s - r) +
                      6 * e * t * (a - s) +
                      3 * t * t * (h - a),
                    3 * e * e * (n - i) +
                      6 * e * t * (o - n) +
                      3 * t * t * (c - o)
                  )
                }
              })(a, c, e[1], e[2], e[3], e[4], e[5], e[6])),
              (r.iterator = i),
              (r.angleFinder = n),
              (r.length = p(i, a, c)),
              (a = e[5]),
              (c = e[6])
            break
          case 'Q':
            ;(i = (function (r, n, s, o, a, c) {
              return function (t) {
                var e = t * t,
                  i = 2 * t * (1 - t),
                  t = (1 - t) * (1 - t)
                return { x: a * e + s * i + r * t, y: c * e + o * i + n * t }
              }
            })(a, c, e[1], e[2], e[3], e[4])),
              (n = (function (i, r, n, s, o, a) {
                return function (t) {
                  var e = 1 - t
                  return Math.atan2(
                    2 * e * (s - r) + 2 * t * (a - s),
                    2 * e * (n - i) + 2 * t * (o - n)
                  )
                }
              })(a, c, e[1], e[2], e[3], e[4])),
              (r.iterator = i),
              (r.angleFinder = n),
              (r.length = p(i, a, c)),
              (a = e[3]),
              (c = e[4])
            break
          case 'Z':
          case 'z':
            ;(r.destX = h),
              (r.destY = l),
              (r.length = g(a, c, h, l)),
              (a = h),
              (c = l)
        }
        ;(s += r.length), u.push(r)
      }
      return u.push({ length: s, x: a, y: c }), u
    }
    ;(fabric.util.joinPath = function (t) {
      return t
        .map(function (t) {
          return t.join(' ')
        })
        .join(' ')
    }),
      (fabric.util.parsePath = function (t) {
        var e,
          i,
          r,
          n,
          s = [],
          o = [],
          a = fabric.rePathCommand,
          c = '[-+]?(?:\\d*\\.\\d+|\\d+\\.?)(?:[eE][-+]?\\d+)?\\s*',
          h = '(' + c + ')' + fabric.commaWsp,
          l = '([01])' + fabric.commaWsp + '?',
          u = new RegExp(
            h + '?' + h + '?' + h + l + l + h + '?(' + c + ')',
            'g'
          )
        if (!t || !t.match) return s
        for (
          var f,
            d = 0,
            g = (f = t.match(/[mzlhvcsqta][^mzlhvcsqta]*/gi)).length;
          d < g;
          d++
        ) {
          ;(n = (e = f[d]).slice(1).trim()), (o.length = 0)
          var p,
            m = e.charAt(0),
            v = [m]
          if ('a' === m.toLowerCase())
            for (; (p = u.exec(n)); )
              for (var b = 1; b < p.length; b++) o.push(p[b])
          else for (; (r = a.exec(n)); ) o.push(r[0])
          for (var b = 0, y = o.length; b < y; b++)
            (i = parseFloat(o[b])), isNaN(i) || v.push(i)
          var _ = T[m.toLowerCase()],
            x = O[m] || m
          if (v.length - 1 > _)
            for (var C = 1, S = v.length; C < S; C += _)
              s.push([m].concat(v.slice(C, C + _))), (m = x)
          else s.push(v)
        }
        return s
      }),
      (fabric.util.makePathSimpler = function (t) {
        for (
          var e,
            i,
            r,
            n,
            s,
            o = 0,
            a = 0,
            c = t.length,
            h = 0,
            l = 0,
            u = [],
            f = 0;
          f < c;
          ++f
        ) {
          switch (((i = !1), (e = t[f].slice(0))[0])) {
            case 'l':
              ;(e[0] = 'L'), (e[1] += o), (e[2] += a)
            case 'L':
              ;(o = e[1]), (a = e[2])
              break
            case 'h':
              e[1] += o
            case 'H':
              ;(e[0] = 'L'), (e[2] = a), (o = e[1])
              break
            case 'v':
              e[1] += a
            case 'V':
              ;(e[0] = 'L'), (a = e[1]), (e[1] = o), (e[2] = a)
              break
            case 'm':
              ;(e[0] = 'M'), (e[1] += o), (e[2] += a)
            case 'M':
              ;(o = e[1]), (a = e[2]), (h = e[1]), (l = e[2])
              break
            case 'c':
              ;(e[0] = 'C'),
                (e[1] += o),
                (e[2] += a),
                (e[3] += o),
                (e[4] += a),
                (e[5] += o),
                (e[6] += a)
            case 'C':
              ;(n = e[3]), (s = e[4]), (o = e[5]), (a = e[6])
              break
            case 's':
              ;(e[0] = 'S'), (e[1] += o), (e[2] += a), (e[3] += o), (e[4] += a)
            case 'S':
              ;(s = 'C' === r ? ((n = 2 * o - n), 2 * a - s) : ((n = o), a)),
                (o = e[3]),
                (a = e[4]),
                (e[0] = 'C'),
                (e[5] = e[3]),
                (e[6] = e[4]),
                (e[3] = e[1]),
                (e[4] = e[2]),
                (e[1] = n),
                (e[2] = s),
                (n = e[3]),
                (s = e[4])
              break
            case 'q':
              ;(e[0] = 'Q'), (e[1] += o), (e[2] += a), (e[3] += o), (e[4] += a)
            case 'Q':
              ;(n = e[1]), (s = e[2]), (o = e[3]), (a = e[4])
              break
            case 't':
              ;(e[0] = 'T'), (e[1] += o), (e[2] += a)
            case 'T':
              ;(s = 'Q' === r ? ((n = 2 * o - n), 2 * a - s) : ((n = o), a)),
                (e[0] = 'Q'),
                (o = e[1]),
                (a = e[2]),
                (e[1] = n),
                (e[2] = s),
                (e[3] = o),
                (e[4] = a)
              break
            case 'a':
              ;(e[0] = 'A'), (e[6] += o), (e[7] += a)
            case 'A':
              ;(i = !0),
                (u = u.concat(
                  (function (t, e, i) {
                    for (
                      var r = i[1],
                        n = i[2],
                        s = i[3],
                        o = i[4],
                        a = i[5],
                        c = d(i[6] - t, i[7] - e, r, n, o, a, s),
                        h = 0,
                        l = c.length;
                      h < l;
                      h++
                    )
                      (c[h][1] += t),
                        (c[h][2] += e),
                        (c[h][3] += t),
                        (c[h][4] += e),
                        (c[h][5] += t),
                        (c[h][6] += e)
                    return c
                  })(o, a, e)
                )),
                (o = e[6]),
                (a = e[7])
              break
            case 'z':
            case 'Z':
              ;(o = h), (a = l)
          }
          i || u.push(e), (r = e[0])
        }
        return u
      }),
      (fabric.util.getSmoothPathFromPoints = function (t, e) {
        var i,
          r,
          n = [],
          s = new fabric.Point(t[0].x, t[0].y),
          o = new fabric.Point(t[1].x, t[1].y),
          a = t.length,
          c = 1,
          h = 0,
          l = 2 < a
        for (
          l &&
            ((c = t[2].x < o.x ? -1 : t[2].x === o.x ? 0 : 1),
            (h = t[2].y < o.y ? -1 : t[2].y === o.y ? 0 : 1)),
            n.push(['M', s.x - c * (e = e || 0), s.y - h * e]),
            i = 1;
          i < a;
          i++
        )
          s.eq(o) ||
            ((r = s.midPointFrom(o)), n.push(['Q', s.x, s.y, r.x, r.y])),
            (s = t[i]),
            i + 1 < t.length && (o = t[i + 1])
        return (
          l &&
            ((c = s.x > t[i - 2].x ? 1 : s.x === t[i - 2].x ? 0 : -1),
            (h = s.y > t[i - 2].y ? 1 : s.y === t[i - 2].y ? 0 : -1)),
          n.push(['L', s.x + c * e, s.y + h * e]),
          n
        )
      }),
      (fabric.util.getPathSegmentsInfo = l),
      (fabric.util.getBoundsOfCurve = function (t, e, i, r, n, s, o, a) {
        var c
        if (
          fabric.cachesBoundsOfCurve &&
          ((c = w.call(arguments)), fabric.boundsOfCurveCache[c])
        )
          return fabric.boundsOfCurveCache[c]
        for (
          var h,
            l,
            u,
            f = Math.sqrt,
            d = Math.min,
            g = Math.max,
            p = Math.abs,
            m = [],
            v = [[], []],
            b = 6 * t - 12 * i + 6 * n,
            y = -3 * t + 9 * i - 9 * n + 3 * o,
            _ = 3 * i - 3 * t,
            x = 0;
          x < 2;
          ++x
        )
          0 < x &&
            ((b = 6 * e - 12 * r + 6 * s),
            (y = -3 * e + 9 * r - 9 * s + 3 * a),
            (_ = 3 * r - 3 * e)),
            p(y) < 1e-12
              ? p(b) < 1e-12 || (0 < (h = -_ / b) && h < 1 && m.push(h))
              : (u = b * b - 4 * _ * y) < 0 ||
                (0 < (l = (-b + (u = f(u))) / (2 * y)) && l < 1 && m.push(l),
                0 < (l = (-b - u) / (2 * y)) && l < 1 && m.push(l))
        for (var C, S = m.length, T = S; S--; )
          (h = m[S]),
            (v[0][S] =
              (C = 1 - h) * C * C * t +
              3 * C * C * h * i +
              3 * C * h * h * n +
              h * h * h * o),
            (v[1][S] =
              C * C * C * e +
              3 * C * C * h * r +
              3 * C * h * h * s +
              h * h * h * a)
        return (
          (v[0][T] = t),
          (v[1][T] = e),
          (v[0][T + 1] = o),
          (v[1][T + 1] = a),
          (T = [
            { x: d.apply(null, v[0]), y: d.apply(null, v[1]) },
            { x: g.apply(null, v[0]), y: g.apply(null, v[1]) },
          ]),
          fabric.cachesBoundsOfCurve && (fabric.boundsOfCurveCache[c] = T),
          T
        )
      }),
      (fabric.util.getPointOnPath = function (t, e, i) {
        i = i || l(t)
        for (var r = 0; 0 < e - i[r].length && r < i.length - 2; )
          (e -= i[r].length), r++
        var n,
          s = i[r],
          o = e / s.length,
          a = s.command,
          c = t[r]
        switch (a) {
          case 'M':
            return { x: s.x, y: s.y, angle: 0 }
          case 'Z':
          case 'z':
            return (
              ((n = new fabric.Point(s.x, s.y).lerp(
                new fabric.Point(s.destX, s.destY),
                o
              )).angle = Math.atan2(s.destY - s.y, s.destX - s.x)),
              n
            )
          case 'L':
            return (
              ((n = new fabric.Point(s.x, s.y).lerp(
                new fabric.Point(c[1], c[2]),
                o
              )).angle = Math.atan2(c[2] - s.y, c[1] - s.x)),
              n
            )
          case 'C':
          case 'Q':
            return h(s, e)
        }
      }),
      (fabric.util.transformPath = function (t, n, e) {
        return (
          e &&
            (n = fabric.util.multiplyTransformMatrices(n, [
              1,
              0,
              0,
              1,
              -e.x,
              -e.y,
            ])),
          t.map(function (t) {
            for (var e = t.slice(0), i = {}, r = 1; r < t.length - 1; r += 2)
              (i.x = t[r]),
                (i.y = t[r + 1]),
                (i = fabric.util.transformPoint(i, n)),
                (e[r] = i.x),
                (e[r + 1] = i.y)
            return e
          })
        )
      })
  })(),
  (function () {
    var o = Array.prototype.slice
    function i(t, e, i) {
      if (t && 0 !== t.length) {
        var r = t.length - 1,
          n = e ? t[r][e] : t[r]
        if (e) for (; r--; ) i(t[r][e], n) && (n = t[r][e])
        else for (; r--; ) i(t[r], n) && (n = t[r])
        return n
      }
    }
    fabric.util.array = {
      fill: function (t, e) {
        for (var i = t.length; i--; ) t[i] = e
        return t
      },
      invoke: function (t, e) {
        for (
          var i = o.call(arguments, 2), r = [], n = 0, s = t.length;
          n < s;
          n++
        )
          r[n] = i.length ? t[n][e].apply(t[n], i) : t[n][e].call(t[n])
        return r
      },
      min: function (t, e) {
        return i(t, e, function (t, e) {
          return t < e
        })
      },
      max: function (t, e) {
        return i(t, e, function (t, e) {
          return e <= t
        })
      },
    }
  })(),
  (function () {
    function o(t, e, i) {
      if (i)
        if (!fabric.isLikelyNode && e instanceof Element) t = e
        else if (e instanceof Array) {
          t = []
          for (var r = 0, n = e.length; r < n; r++) t[r] = o({}, e[r], i)
        } else if (e && 'object' == typeof e)
          for (var s in e)
            'canvas' === s || 'group' === s
              ? (t[s] = null)
              : e.hasOwnProperty(s) && (t[s] = o({}, e[s], i))
        else t = e
      else for (var s in e) t[s] = e[s]
      return t
    }
    ;(fabric.util.object = {
      extend: o,
      clone: function (t, e) {
        return o({}, t, e)
      },
    }),
      fabric.util.object.extend(fabric.util, fabric.Observable)
  })(),
  (fabric.util.string = {
    camelize: function (t) {
      return t.replace(/-+(.)?/g, function (t, e) {
        return e ? e.toUpperCase() : ''
      })
    },
    capitalize: function (t, e) {
      return (
        t.charAt(0).toUpperCase() + (e ? t.slice(1) : t.slice(1).toLowerCase())
      )
    },
    escapeXml: function (t) {
      return t
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
    },
    graphemeSplit: function (t) {
      for (var e, i = 0, r = [], i = 0; i < t.length; i++)
        !1 !==
          (e = (function (t, e) {
            var i = t.charCodeAt(e)
            if (isNaN(i)) return ''
            if (i < 55296 || 57343 < i) return t.charAt(e)
            if (55296 <= i && i <= 56319) {
              if (t.length <= e + 1)
                throw 'High surrogate without following low surrogate'
              i = t.charCodeAt(e + 1)
              if (i < 56320 || 57343 < i)
                throw 'High surrogate without following low surrogate'
              return t.charAt(e) + t.charAt(e + 1)
            }
            if (0 === e) throw 'Low surrogate without preceding high surrogate'
            i = t.charCodeAt(e - 1)
            if (i < 55296 || 56319 < i)
              throw 'Low surrogate without preceding high surrogate'
            return !1
          })(t, i)) && r.push(e)
      return r
    },
  }),
  (function () {
    function s() {}
    var o = Array.prototype.slice,
      a = (function () {
        for (var t in { toString: 1 }) if ('toString' === t) return !1
        return !0
      })()
    function c() {}
    function h(t) {
      for (var e = null, i = this; i.constructor.superclass; ) {
        var r = i.constructor.superclass.prototype[t]
        if (i[t] !== r) {
          e = r
          break
        }
        i = i.constructor.superclass.prototype
      }
      return e
        ? 1 < arguments.length
          ? e.apply(this, o.call(arguments, 1))
          : e.call(this)
        : console.log(
            'tried to callSuper ' + t + ', method not found in prototype chain',
            this
          )
    }
    fabric.util.createClass = function () {
      var t = null,
        e = o.call(arguments, 0)
      function i() {
        this.initialize.apply(this, arguments)
      }
      'function' == typeof e[0] && (t = e.shift()),
        (i.superclass = t),
        (i.subclasses = []),
        t &&
          ((c.prototype = t.prototype),
          (i.prototype = new c()),
          t.subclasses.push(i))
      for (var r = 0, n = e.length; r < n; r++)
        !(function (t, r, n) {
          for (var e in r)
            e in t.prototype &&
            'function' == typeof t.prototype[e] &&
            -1 < (r[e] + '').indexOf('callSuper')
              ? (t.prototype[e] = (function (i) {
                  return function () {
                    var t = this.constructor.superclass,
                      e =
                        ((this.constructor.superclass = n),
                        r[i].apply(this, arguments))
                    if (((this.constructor.superclass = t), 'initialize' !== i))
                      return e
                  }
                })(e))
              : (t.prototype[e] = r[e]),
              a &&
                (r.toString !== Object.prototype.toString &&
                  (t.prototype.toString = r.toString),
                r.valueOf !== Object.prototype.valueOf &&
                  (t.prototype.valueOf = r.valueOf))
        })(i, e[r], t)
      return (
        i.prototype.initialize || (i.prototype.initialize = s),
        ((i.prototype.constructor = i).prototype.callSuper = h),
        i
      )
    }
  })(),
  (function () {
    var n = !!fabric.document.createElement('div').attachEvent,
      e = ['touchstart', 'touchmove', 'touchend']
    ;(fabric.util.addListener = function (t, e, i, r) {
      t && t.addEventListener(e, i, !n && r)
    }),
      (fabric.util.removeListener = function (t, e, i, r) {
        t && t.removeEventListener(e, i, !n && r)
      }),
      (fabric.util.getPointer = function (t) {
        var e = t.target,
          e = fabric.util.getScrollLeftTop(e),
          i = (i = (t = t).changedTouches) && i[0] ? i[0] : t
        return { x: i.clientX + e.left, y: i.clientY + e.top }
      }),
      (fabric.util.isTouchEvent = function (t) {
        return -1 < e.indexOf(t.type) || 'touch' === t.pointerType
      })
  })(),
  (function () {
    var t = fabric.document.createElement('div'),
      e = 'string' == typeof t.style.opacity,
      t = 'string' == typeof t.style.filter,
      r = /alpha\s*\(\s*opacity\s*=\s*([^\)]+)\)/,
      s = function (t) {
        return t
      }
    e
      ? (s = function (t, e) {
          return (t.style.opacity = e), t
        })
      : t &&
        (s = function (t, e) {
          var i = t.style
          return (
            t.currentStyle && !t.currentStyle.hasLayout && (i.zoom = 1),
            r.test(i.filter)
              ? (i.filter = i.filter.replace(
                  r,
                  (e = 0.9999 <= e ? '' : 'alpha(opacity=' + 100 * e + ')')
                ))
              : (i.filter += ' alpha(opacity=' + 100 * e + ')'),
            t
          )
        }),
      (fabric.util.setStyle = function (t, e) {
        var i,
          r,
          n = t.style
        if (!n) return t
        if ('string' == typeof e)
          return (
            (t.style.cssText += ';' + e),
            -1 < e.indexOf('opacity')
              ? s(t, e.match(/opacity:\s*(\d?\.?\d*)/)[1])
              : t
          )
        for (i in e)
          'opacity' === i
            ? s(t, e[i])
            : ((r =
                'float' === i || 'cssFloat' === i
                  ? void 0 === n.styleFloat
                    ? 'cssFloat'
                    : 'styleFloat'
                  : i),
              n.setProperty(r, e[i]))
        return t
      })
  })(),
  (function () {
    var e = Array.prototype.slice
    var a,
      t,
      i,
      r = function (t) {
        return e.call(t, 0)
      }
    try {
      t = r(fabric.document.childNodes) instanceof Array
    } catch (t) {}
    function n(t, e) {
      var i,
        r = fabric.document.createElement(t)
      for (i in e)
        'class' === i
          ? (r.className = e[i])
          : 'for' === i
          ? (r.htmlFor = e[i])
          : r.setAttribute(i, e[i])
      return r
    }
    function c(t) {
      for (
        var e = 0,
          i = 0,
          r = fabric.document.documentElement,
          n = fabric.document.body || { scrollLeft: 0, scrollTop: 0 };
        t &&
        (t.parentNode || t.host) &&
        ((t = t.parentNode || t.host) === fabric.document
          ? ((e = n.scrollLeft || r.scrollLeft || 0),
            (i = n.scrollTop || r.scrollTop || 0))
          : ((e += t.scrollLeft || 0), (i += t.scrollTop || 0)),
        1 !== t.nodeType || 'fixed' !== t.style.position);

      );
      return { left: e, top: i }
    }
    t ||
      (r = function (t) {
        for (var e = new Array(t.length), i = t.length; i--; ) e[i] = t[i]
        return e
      }),
      (a =
        fabric.document.defaultView &&
        fabric.document.defaultView.getComputedStyle
          ? function (t, e) {
              t = fabric.document.defaultView.getComputedStyle(t, null)
              return t ? t[e] : void 0
            }
          : function (t, e) {
              var i = t.style[e]
              return (i = !i && t.currentStyle ? t.currentStyle[e] : i)
            }),
      (t = fabric.document.documentElement.style),
      (i =
        'userSelect' in t
          ? 'userSelect'
          : 'MozUserSelect' in t
          ? 'MozUserSelect'
          : 'WebkitUserSelect' in t
          ? 'WebkitUserSelect'
          : 'KhtmlUserSelect' in t
          ? 'KhtmlUserSelect'
          : ''),
      (fabric.util.makeElementUnselectable = function (t) {
        return (
          void 0 !== t.onselectstart &&
            (t.onselectstart = fabric.util.falseFunction),
          i
            ? (t.style[i] = 'none')
            : 'string' == typeof t.unselectable && (t.unselectable = 'on'),
          t
        )
      }),
      (fabric.util.makeElementSelectable = function (t) {
        return (
          void 0 !== t.onselectstart && (t.onselectstart = null),
          i
            ? (t.style[i] = '')
            : 'string' == typeof t.unselectable && (t.unselectable = ''),
          t
        )
      }),
      (fabric.util.setImageSmoothing = function (t, e) {
        ;(t.imageSmoothingEnabled =
          t.imageSmoothingEnabled ||
          t.webkitImageSmoothingEnabled ||
          t.mozImageSmoothingEnabled ||
          t.msImageSmoothingEnabled ||
          t.oImageSmoothingEnabled),
          (t.imageSmoothingEnabled = e)
      }),
      (fabric.util.getById = function (t) {
        return 'string' == typeof t ? fabric.document.getElementById(t) : t
      }),
      (fabric.util.toArray = r),
      (fabric.util.addClass = function (t, e) {
        t &&
          -1 === (' ' + t.className + ' ').indexOf(' ' + e + ' ') &&
          (t.className += (t.className ? ' ' : '') + e)
      }),
      (fabric.util.makeElement = n),
      (fabric.util.wrapElement = function (t, e, i) {
        return (
          'string' == typeof e && (e = n(e, i)),
          t.parentNode && t.parentNode.replaceChild(e, t),
          e.appendChild(t),
          e
        )
      }),
      (fabric.util.getScrollLeftTop = c),
      (fabric.util.getElementOffset = function (t) {
        var e,
          i,
          r = t && t.ownerDocument,
          n = { left: 0, top: 0 },
          s = { left: 0, top: 0 },
          o = {
            borderLeftWidth: 'left',
            borderTopWidth: 'top',
            paddingLeft: 'left',
            paddingTop: 'top',
          }
        if (!r) return s
        for (i in o) s[o[i]] += parseInt(a(t, i), 10) || 0
        return (
          (r = r.documentElement),
          void 0 !== t.getBoundingClientRect && (n = t.getBoundingClientRect()),
          (e = c(t)),
          {
            left: n.left + e.left - (r.clientLeft || 0) + s.left,
            top: n.top + e.top - (r.clientTop || 0) + s.top,
          }
        )
      }),
      (fabric.util.getNodeCanvas = function (t) {
        return (t = fabric.jsdomImplForWrapper(t))._canvas || t._image
      }),
      (fabric.util.cleanUpJsdomNode = function (t) {
        !fabric.isLikelyNode ||
          ((t = fabric.jsdomImplForWrapper(t)) &&
            ((t._image = null),
            (t._canvas = null),
            (t._currentSrc = null),
            (t._attributes = null),
            (t._classList = null)))
      })
  })(),
  (function () {
    function a() {}
    fabric.util.request = function (t, e) {
      var i,
        r = (e = e || {}).method ? e.method.toUpperCase() : 'GET',
        n = e.onComplete || function () {},
        s = new fabric.window.XMLHttpRequest(),
        o = e.body || e.parameters
      return (
        (s.onreadystatechange = function () {
          4 === s.readyState && (n(s), (s.onreadystatechange = a))
        }),
        'GET' === r &&
          ((o = null),
          'string' == typeof e.parameters &&
            ((i = t),
            (e = e.parameters),
            (t = i + (/\?/.test(i) ? '&' : '?') + e))),
        s.open(r, t, !0),
        ('POST' !== r && 'PUT' !== r) ||
          s.setRequestHeader(
            'Content-Type',
            'application/x-www-form-urlencoded'
          ),
        s.send(o),
        s
      )
    }
  })(),
  (fabric.log = console.log),
  (fabric.warn = console.warn),
  (function () {
    var t = fabric.util.object.extend,
      i = fabric.util.object.clone,
      e = []
    function r() {
      return !1
    }
    function n(t, e, i, r) {
      return -i * Math.cos((t / r) * (Math.PI / 2)) + i + e
    }
    fabric.util.object.extend(e, {
      cancelAll: function () {
        var t = this.splice(0)
        return (
          t.forEach(function (t) {
            t.cancel()
          }),
          t
        )
      },
      cancelByCanvas: function (e) {
        if (!e) return []
        var t = this.filter(function (t) {
          return 'object' == typeof t.target && t.target.canvas === e
        })
        return (
          t.forEach(function (t) {
            t.cancel()
          }),
          t
        )
      },
      cancelByTarget: function (t) {
        t = this.findAnimationsByTarget(t)
        return (
          t.forEach(function (t) {
            t.cancel()
          }),
          t
        )
      },
      findAnimationIndex: function (t) {
        return this.indexOf(this.findAnimation(t))
      },
      findAnimation: function (e) {
        return this.find(function (t) {
          return t.cancel === e
        })
      },
      findAnimationsByTarget: function (e) {
        return e
          ? this.filter(function (t) {
              return t.target === e
            })
          : []
      },
    })
    var s =
        fabric.window.requestAnimationFrame ||
        fabric.window.webkitRequestAnimationFrame ||
        fabric.window.mozRequestAnimationFrame ||
        fabric.window.oRequestAnimationFrame ||
        fabric.window.msRequestAnimationFrame ||
        function (t) {
          return fabric.window.setTimeout(t, 1e3 / 60)
        },
      o = fabric.window.cancelAnimationFrame || fabric.window.clearTimeout
    function _() {
      return s.apply(fabric.window, arguments)
    }
    ;(fabric.util.animate = function (e) {
      function v() {
        var t = fabric.runningAnimations.indexOf(y)
        return -1 < t && fabric.runningAnimations.splice(t, 1)[0]
      }
      var b = !1,
        y = t(i((e = e || {})), {
          cancel: function () {
            return (b = !0), v()
          },
          currentValue: 'startValue' in e ? e.startValue : 0,
          completionRate: 0,
          durationRate: 0,
        })
      return (
        fabric.runningAnimations.push(y),
        _(function (t) {
          var s,
            o = t || +new Date(),
            a = e.duration || 500,
            c = o + a,
            h = e.onChange || r,
            l = e.abort || r,
            u = e.onComplete || r,
            f = e.easing || n,
            d = 'startValue' in e && 0 < e.startValue.length,
            g = 'startValue' in e ? e.startValue : 0,
            p = 'endValue' in e ? e.endValue : 100,
            m =
              e.byValue ||
              (d
                ? g.map(function (t, e) {
                    return p[e] - g[e]
                  })
                : p - g)
          e.onStart && e.onStart(),
            (function t(e) {
              s = e || +new Date()
              var i = c < s ? a : s - o,
                e = i / a,
                r = d
                  ? g.map(function (t, e) {
                      return f(i, g[e], m[e], a)
                    })
                  : f(i, g, m, a),
                n = d ? Math.abs((r[0] - g[0]) / m[0]) : Math.abs((r - g) / m)
              ;(y.currentValue = d ? r.slice() : r),
                (y.completionRate = n),
                (y.durationRate = e),
                b ||
                  (l(r, n, e)
                    ? v()
                    : c < s
                    ? ((y.currentValue = d ? p.slice() : p),
                      (y.completionRate = 1),
                      (y.durationRate = 1),
                      h(d ? p.slice() : p, 1, 1),
                      u(p, 1, 1),
                      v())
                    : (h(r, n, e), _(t)))
            })(o)
        }),
        y.cancel
      )
    }),
      (fabric.util.requestAnimFrame = _),
      (fabric.util.cancelAnimFrame = function () {
        return o.apply(fabric.window, arguments)
      }),
      (fabric.runningAnimations = e)
  })(),
  (function () {
    function a(t, e, i) {
      var r =
        'rgba(' +
        parseInt(t[0] + i * (e[0] - t[0]), 10) +
        ',' +
        parseInt(t[1] + i * (e[1] - t[1]), 10) +
        ',' +
        parseInt(t[2] + i * (e[2] - t[2]), 10)
      return (
        r + (',' + (t && e ? parseFloat(t[3] + i * (e[3] - t[3])) : 1)) + ')'
      )
    }
    fabric.util.animateColor = function (t, e, i, n) {
      var t = new fabric.Color(t).getSource(),
        r = new fabric.Color(e).getSource(),
        s = n.onComplete,
        o = n.onChange
      return (
        (n = n || {}),
        fabric.util.animate(
          fabric.util.object.extend(n, {
            duration: i || 500,
            startValue: t,
            endValue: r,
            byValue: r,
            easing: function (t, e, i, r) {
              return a(
                e,
                i,
                n.colorEasing
                  ? n.colorEasing(t, r)
                  : 1 - Math.cos((t / r) * (Math.PI / 2))
              )
            },
            onComplete: function (t, e, i) {
              if (s) return s(a(r, r, 0), e, i)
            },
            onChange: function (t, e, i) {
              if (o) {
                if (Array.isArray(t)) return o(a(t, t, 0), e, i)
                o(t, e, i)
              }
            },
          })
        )
      )
    }
  })(),
  (function () {
    function s(t, e, i, r) {
      return (
        (r =
          t < Math.abs(e)
            ? ((t = e), i / 4)
            : 0 === e && 0 === t
            ? (i / (2 * Math.PI)) * Math.asin(1)
            : (i / (2 * Math.PI)) * Math.asin(e / t)),
        { a: t, c: e, p: i, s: r }
      )
    }
    function o(t, e, i) {
      return (
        t.a *
        Math.pow(2, 10 * --e) *
        Math.sin(((e * i - t.s) * (2 * Math.PI)) / t.p)
      )
    }
    function n(t, e, i, r) {
      return i - a(r - t, 0, i, r) + e
    }
    function a(t, e, i, r) {
      return (t /= r) < 1 / 2.75
        ? i * (7.5625 * t * t) + e
        : t < 2 / 2.75
        ? i * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + e
        : t < 2.5 / 2.75
        ? i * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + e
        : i * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + e
    }
    fabric.util.ease = {
      easeInQuad: function (t, e, i, r) {
        return i * (t /= r) * t + e
      },
      easeOutQuad: function (t, e, i, r) {
        return -i * (t /= r) * (t - 2) + e
      },
      easeInOutQuad: function (t, e, i, r) {
        return (t /= r / 2) < 1
          ? (i / 2) * t * t + e
          : (-i / 2) * (--t * (t - 2) - 1) + e
      },
      easeInCubic: function (t, e, i, r) {
        return i * (t /= r) * t * t + e
      },
      easeOutCubic: function (t, e, i, r) {
        return i * ((t = t / r - 1) * t * t + 1) + e
      },
      easeInOutCubic: function (t, e, i, r) {
        return (t /= r / 2) < 1
          ? (i / 2) * t * t * t + e
          : (i / 2) * ((t -= 2) * t * t + 2) + e
      },
      easeInQuart: function (t, e, i, r) {
        return i * (t /= r) * t * t * t + e
      },
      easeOutQuart: function (t, e, i, r) {
        return -i * ((t = t / r - 1) * t * t * t - 1) + e
      },
      easeInOutQuart: function (t, e, i, r) {
        return (t /= r / 2) < 1
          ? (i / 2) * t * t * t * t + e
          : (-i / 2) * ((t -= 2) * t * t * t - 2) + e
      },
      easeInQuint: function (t, e, i, r) {
        return i * (t /= r) * t * t * t * t + e
      },
      easeOutQuint: function (t, e, i, r) {
        return i * ((t = t / r - 1) * t * t * t * t + 1) + e
      },
      easeInOutQuint: function (t, e, i, r) {
        return (t /= r / 2) < 1
          ? (i / 2) * t * t * t * t * t + e
          : (i / 2) * ((t -= 2) * t * t * t * t + 2) + e
      },
      easeInSine: function (t, e, i, r) {
        return -i * Math.cos((t / r) * (Math.PI / 2)) + i + e
      },
      easeOutSine: function (t, e, i, r) {
        return i * Math.sin((t / r) * (Math.PI / 2)) + e
      },
      easeInOutSine: function (t, e, i, r) {
        return (-i / 2) * (Math.cos((Math.PI * t) / r) - 1) + e
      },
      easeInExpo: function (t, e, i, r) {
        return 0 === t ? e : i * Math.pow(2, 10 * (t / r - 1)) + e
      },
      easeOutExpo: function (t, e, i, r) {
        return t === r ? e + i : i * (1 - Math.pow(2, (-10 * t) / r)) + e
      },
      easeInOutExpo: function (t, e, i, r) {
        return 0 === t
          ? e
          : t === r
          ? e + i
          : (t /= r / 2) < 1
          ? (i / 2) * Math.pow(2, 10 * (t - 1)) + e
          : (i / 2) * (2 - Math.pow(2, -10 * --t)) + e
      },
      easeInCirc: function (t, e, i, r) {
        return -i * (Math.sqrt(1 - (t /= r) * t) - 1) + e
      },
      easeOutCirc: function (t, e, i, r) {
        return i * Math.sqrt(1 - (t = t / r - 1) * t) + e
      },
      easeInOutCirc: function (t, e, i, r) {
        return (t /= r / 2) < 1
          ? (-i / 2) * (Math.sqrt(1 - t * t) - 1) + e
          : (i / 2) * (Math.sqrt(1 - (t -= 2) * t) + 1) + e
      },
      easeInElastic: function (t, e, i, r) {
        var n = 0
        return 0 === t
          ? e
          : 1 === (t /= r)
          ? e + i
          : -o(s(i, i, (n = n || 0.3 * r), 1.70158), t, r) + e
      },
      easeOutElastic: function (t, e, i, r) {
        return 0 === t
          ? e
          : 1 === (t /= r)
          ? e + i
          : (i = s(i, i, 0 || 0.3 * r, 1.70158)).a *
              Math.pow(2, -10 * t) *
              Math.sin(((t * r - i.s) * (2 * Math.PI)) / i.p) +
            i.c +
            e
      },
      easeInOutElastic: function (t, e, i, r) {
        return 0 === t
          ? e
          : 2 === (t /= r / 2)
          ? e + i
          : ((i = s(i, i, 0 || r * (0.3 * 1.5), 1.70158)),
            t < 1
              ? -0.5 * o(i, t, r) + e
              : i.a *
                  Math.pow(2, -10 * --t) *
                  Math.sin(((t * r - i.s) * (2 * Math.PI)) / i.p) *
                  0.5 +
                i.c +
                e)
      },
      easeInBack: function (t, e, i, r, n) {
        return (
          i * (t /= r) * t * (((n = void 0 === n ? 1.70158 : n) + 1) * t - n) +
          e
        )
      },
      easeOutBack: function (t, e, i, r, n) {
        return (
          i *
            ((t = t / r - 1) *
              t *
              (((n = void 0 === n ? 1.70158 : n) + 1) * t + n) +
              1) +
          e
        )
      },
      easeInOutBack: function (t, e, i, r, n) {
        return (
          void 0 === n && (n = 1.70158),
          (t /= r / 2) < 1
            ? (i / 2) * (t * t * ((1 + (n *= 1.525)) * t - n)) + e
            : (i / 2) * ((t -= 2) * t * ((1 + (n *= 1.525)) * t + n) + 2) + e
        )
      },
      easeInBounce: n,
      easeOutBounce: a,
      easeInOutBounce: function (t, e, i, r) {
        return t < r / 2
          ? 0.5 * n(2 * t, 0, i, r) + e
          : 0.5 * a(2 * t - r, 0, i, r) + 0.5 * i + e
      },
    }
  })(),
  (function (t) {
    'use strict'
    var u,
      e,
      f,
      i,
      r,
      y = t.fabric || (t.fabric = {}),
      g = y.util.object.extend,
      d = y.util.object.clone,
      p = y.util.toFixed,
      _ = y.util.parseUnit,
      m = y.util.multiplyTransformMatrices,
      v = {
        cx: 'left',
        x: 'left',
        r: 'radius',
        cy: 'top',
        y: 'top',
        display: 'visible',
        visibility: 'visible',
        transform: 'transformMatrix',
        'fill-opacity': 'fillOpacity',
        'fill-rule': 'fillRule',
        'font-family': 'fontFamily',
        'font-size': 'fontSize',
        'font-style': 'fontStyle',
        'font-weight': 'fontWeight',
        'letter-spacing': 'charSpacing',
        'paint-order': 'paintFirst',
        'stroke-dasharray': 'strokeDashArray',
        'stroke-dashoffset': 'strokeDashOffset',
        'stroke-linecap': 'strokeLineCap',
        'stroke-linejoin': 'strokeLineJoin',
        'stroke-miterlimit': 'strokeMiterLimit',
        'stroke-opacity': 'strokeOpacity',
        'stroke-width': 'strokeWidth',
        'text-decoration': 'textDecoration',
        'text-anchor': 'textAnchor',
        opacity: 'opacity',
        'clip-path': 'clipPath',
        'clip-rule': 'clipRule',
        'vector-effect': 'strokeUniform',
        'image-rendering': 'imageSmoothing',
      },
      b = { stroke: 'strokeOpacity', fill: 'fillOpacity' },
      x = 'font-size',
      C = 'clip-path'
    function n(t) {
      return new RegExp('^(' + t.join('|') + ')\\b', 'i')
    }
    function S(t, e) {
      for (var i, r = [], n = 0, s = e.length; n < s; n++)
        (i = e[n]),
          (i = t.getElementsByTagName(i)),
          (r = r.concat(Array.prototype.slice.call(i)))
      return r
    }
    function T(t, e, i) {
      t[i] = Math.tan(y.util.degreesToRadians(e[0]))
    }
    function w(t, e) {
      var i,
        r = {}
      for (i in y.cssRules[e])
        if (
          (function (t, e) {
            var i,
              r = !0
            ;(i = s(t, e.pop())) &&
              e.length &&
              (r = (function (t, e) {
                var i,
                  r = !0
                for (
                  ;
                  t.parentNode && 1 === t.parentNode.nodeType && e.length;

                )
                  r && (i = e.pop()), (t = t.parentNode), (r = s(t, i))
                return 0 === e.length
              })(t, e))
            return i && r && 0 === e.length
          })(t, i.split(' '))
        )
          for (var n in y.cssRules[e][i]) r[n] = y.cssRules[e][i][n]
      return r
    }
    function s(t, e) {
      var i,
        r = t.nodeName,
        n = t.getAttribute('class'),
        t = t.getAttribute('id'),
        s = new RegExp('^' + r, 'i')
      if (
        ((e = e.replace(s, '')),
        t &&
          e.length &&
          ((s = new RegExp('#' + t + '(?![a-zA-Z\\-]+)', 'i')),
          (e = e.replace(s, ''))),
        n && e.length)
      )
        for (i = (n = n.split(' ')).length; i--; )
          (s = new RegExp('\\.' + n[i] + '(?![a-zA-Z\\-]+)', 'i')),
            (e = e.replace(s, ''))
      return 0 === e.length
    }
    function O(t, e) {
      var i
      if ((i = t.getElementById ? t.getElementById(e) : i)) return i
      for (
        var r, n = t.getElementsByTagName('*'), s = 0, o = n.length;
        s < o;
        s++
      )
        if (e === (r = n[s]).getAttribute('id')) return r
    }
    ;(y.svgValidTagNamesRegEx = n([
      'path',
      'circle',
      'polygon',
      'polyline',
      'ellipse',
      'rect',
      'line',
      'image',
      'text',
    ])),
      (y.svgViewBoxElementsRegEx = n([
        'symbol',
        'image',
        'marker',
        'pattern',
        'view',
        'svg',
      ])),
      (y.svgInvalidAncestorsRegEx = n([
        'pattern',
        'defs',
        'symbol',
        'metadata',
        'clipPath',
        'mask',
        'desc',
      ])),
      (y.svgValidParentsRegEx = n([
        'symbol',
        'g',
        'a',
        'svg',
        'clipPath',
        'defs',
      ])),
      (y.cssRules = {}),
      (y.gradientDefs = {}),
      (y.clipPaths = {}),
      (y.parseTransformAttribute =
        ((u = y.iMatrix),
        (t = y.reNum),
        (e = y.commaWsp),
        (f =
          '(?:' +
          ('(?:(matrix)\\s*\\(\\s*(' +
            t +
            ')' +
            e +
            '(' +
            t +
            ')' +
            e +
            '(' +
            t +
            ')' +
            e +
            '(' +
            t +
            ')' +
            e +
            '(' +
            t +
            ')' +
            e +
            '(' +
            t +
            ')\\s*\\))') +
          '|' +
          ('(?:(translate)\\s*\\(\\s*(' +
            t +
            ')(?:' +
            e +
            '(' +
            t +
            '))?\\s*\\))') +
          '|' +
          ('(?:(scale)\\s*\\(\\s*(' +
            t +
            ')(?:' +
            e +
            '(' +
            t +
            '))?\\s*\\))') +
          '|' +
          ('(?:(rotate)\\s*\\(\\s*(' +
            t +
            ')(?:' +
            e +
            '(' +
            t +
            ')' +
            e +
            '(' +
            t +
            '))?\\s*\\))') +
          '|' +
          ('(?:(skewX)\\s*\\(\\s*(' + t + ')\\s*\\))') +
          '|' +
          ('(?:(skewY)\\s*\\(\\s*(' + t + ')\\s*\\))') +
          ')'),
        (i = new RegExp(
          '^\\s*(?:' + ('(?:' + f + '(?:' + e + '*' + f + ')*)') + '?)\\s*$'
        )),
        (r = new RegExp(f, 'g')),
        function (t) {
          var h = u.concat(),
            l = []
          if (!t || !i.test(t)) return h
          t.replace(r, function (t) {
            var e,
              i,
              r,
              n,
              s,
              o,
              t = new RegExp(f).exec(t).filter(function (t) {
                return !!t
              }),
              a = t[1],
              c = t.slice(2).map(parseFloat)
            switch (a) {
              case 'translate':
                ;(o = c), ((s = h)[4] = o[0]), 2 === o.length && (s[5] = o[1])
                break
              case 'rotate':
                ;(c[0] = y.util.degreesToRadians(c[0])),
                  (s = h),
                  (o = c),
                  (e = y.util.cos(o[0])),
                  (i = y.util.sin(o[0])),
                  (n = r = 0),
                  3 === o.length && ((r = o[1]), (n = o[2])),
                  (s[0] = e),
                  (s[1] = i),
                  (s[2] = -i),
                  (s[3] = e),
                  (s[4] = r - (e * r - i * n)),
                  (s[5] = n - (i * r + e * n))
                break
              case 'scale':
                ;(i = h),
                  (e = (r = c)[0]),
                  (r = 2 === r.length ? r[1] : r[0]),
                  (i[0] = e),
                  (i[3] = r)
                break
              case 'skewX':
                T(h, c, 2)
                break
              case 'skewY':
                T(h, c, 1)
                break
              case 'matrix':
                h = c
            }
            l.push(h.concat()), (h = u.concat())
          })
          for (var e = l[0]; 1 < l.length; )
            l.shift(), (e = y.util.multiplyTransformMatrices(e, l[0]))
          return e
        }))
    var P = new RegExp(
      '^\\s*(' +
        y.reNum +
        '+)\\s*,?\\s*(' +
        y.reNum +
        '+)\\s*,?\\s*(' +
        y.reNum +
        '+)\\s*,?\\s*(' +
        y.reNum +
        '+)\\s*$'
    )
    function k(t) {
      if (!y.svgViewBoxElementsRegEx.test(t.nodeName)) return {}
      var e,
        i,
        r,
        n = t.getAttribute('viewBox'),
        s = 1,
        o = 1,
        a = t.getAttribute('width'),
        c = t.getAttribute('height'),
        h = t.getAttribute('x') || 0,
        l = t.getAttribute('y') || 0,
        u = t.getAttribute('preserveAspectRatio') || '',
        f = !n || !(n = n.match(P)),
        d = !a || !c || '100%' === a || '100%' === c,
        g = f && d,
        p = {},
        m = '',
        v = 0,
        b = 0
      if (
        ((p.width = 0),
        (p.height = 0),
        (p.toBeParsed = g),
        f &&
          (h || l) &&
          t.parentNode &&
          '#document' !== t.parentNode.nodeName &&
          ((m = ' translate(' + _(h) + ' ' + _(l) + ') '),
          (i = (t.getAttribute('transform') || '') + m),
          t.setAttribute('transform', i),
          t.removeAttribute('x'),
          t.removeAttribute('y')),
        g)
      )
        return p
      if (f) return (p.width = _(a)), (p.height = _(c)), p
      if (
        ((g = -parseFloat(n[1])),
        (f = -parseFloat(n[2])),
        (e = parseFloat(n[3])),
        (n = parseFloat(n[4])),
        (p.minX = g),
        (p.minY = f),
        (p.viewBoxWidth = e),
        (p.viewBoxHeight = n),
        d
          ? ((p.width = e), (p.height = n))
          : ((p.width = _(a)),
            (p.height = _(c)),
            (s = p.width / e),
            (o = p.height / n)),
        'none' !== (u = y.util.parsePreserveAspectRatioAttribute(u)).alignX &&
          ('meet' === u.meetOrSlice && (o = s = o < s ? o : s),
          'slice' === u.meetOrSlice && (o = s = o < s ? s : o),
          (v = p.width - e * s),
          (b = p.height - n * s),
          'Mid' === u.alignX && (v /= 2),
          'Mid' === u.alignY && (b /= 2),
          'Min' === u.alignX && (v = 0),
          'Min' === u.alignY && (b = 0)),
        1 === s && 1 === o && 0 == g && 0 == f && 0 === h && 0 === l)
      )
        return p
      if (
        ((i =
          (m =
            (h || l) && '#document' !== t.parentNode.nodeName
              ? ' translate(' + _(h) + ' ' + _(l) + ') '
              : m) +
          ' matrix(' +
          s +
          ' 0 0 ' +
          o +
          ' ' +
          (g * s + v) +
          ' ' +
          (f * o + b) +
          ') '),
        'svg' === t.nodeName)
      ) {
        for (r = t.ownerDocument.createElementNS(y.svgNS, 'g'); t.firstChild; )
          r.appendChild(t.firstChild)
        t.appendChild(r)
      } else
        (r = t).removeAttribute('x'),
          r.removeAttribute('y'),
          (i = r.getAttribute('transform') + i)
      return r.setAttribute('transform', i), p
    }
    y.parseSVGDocument = function (t, i, e, r) {
      if (t) {
        !(function (t) {
          for (
            var e = S(t, ['use', 'svg:use']), i = 0;
            e.length && i < e.length;

          ) {
            var r = e[i],
              n = r.getAttribute('xlink:href') || r.getAttribute('href')
            if (null === n) return
            var s,
              n = n.slice(1),
              o = r.getAttribute('x') || 0,
              a = r.getAttribute('y') || 0,
              c = O(t, n).cloneNode(!0),
              h =
                (c.getAttribute('transform') || '') +
                ' translate(' +
                o +
                ', ' +
                a +
                ')',
              n = e.length,
              l = y.svgNS
            if ((k(c), /^svg$/i.test(c.nodeName))) {
              for (
                var u,
                  f = c.ownerDocument.createElementNS(l, 'g'),
                  d = 0,
                  g = (u = c.attributes).length;
                d < g;
                d++
              )
                (s = u.item(d)), f.setAttributeNS(l, s.nodeName, s.nodeValue)
              for (; c.firstChild; ) f.appendChild(c.firstChild)
              c = f
            }
            for (d = 0, g = (u = r.attributes).length; d < g; d++)
              'x' !== (s = u.item(d)).nodeName &&
                'y' !== s.nodeName &&
                'xlink:href' !== s.nodeName &&
                'href' !== s.nodeName &&
                ('transform' === s.nodeName
                  ? (h = s.nodeValue + ' ' + h)
                  : c.setAttribute(s.nodeName, s.nodeValue))
            c.setAttribute('transform', h),
              c.setAttribute('instantiated_by_use', '1'),
              c.removeAttribute('id'),
              r.parentNode.replaceChild(c, r),
              e.length === n && i++
          }
        })(t)
        var n = y.Object.__uid++,
          s = k(t),
          o = y.util.toArray(t.getElementsByTagName('*'))
        if (
          ((s.crossOrigin = r && r.crossOrigin),
          (s.svgUid = n),
          0 === o.length && y.isLikelyNode)
        ) {
          for (
            var a = [],
              c = 0,
              h = (o = t.selectNodes('//*[name(.)!="svg"]')).length;
            c < h;
            c++
          )
            a[c] = o[c]
          o = a
        }
        var l,
          u = o.filter(function (t) {
            return (
              k(t),
              y.svgValidTagNamesRegEx.test(t.nodeName.replace('svg:', '')) &&
                !(function (t, e) {
                  for (; (t = t && t.parentNode); )
                    if (
                      t.nodeName &&
                      e.test(t.nodeName.replace('svg:', '')) &&
                      !t.getAttribute('instantiated_by_use')
                    )
                      return 1
                })(t, y.svgInvalidAncestorsRegEx)
            )
          })
        u && u.length
          ? ((l = {}),
            o
              .filter(function (t) {
                return 'clipPath' === t.nodeName.replace('svg:', '')
              })
              .forEach(function (t) {
                var e = t.getAttribute('id')
                l[e] = y.util
                  .toArray(t.getElementsByTagName('*'))
                  .filter(function (t) {
                    return y.svgValidTagNamesRegEx.test(
                      t.nodeName.replace('svg:', '')
                    )
                  })
              }),
            (y.gradientDefs[n] = y.getGradientDefs(t)),
            (y.cssRules[n] = y.getCSSRules(t)),
            (y.clipPaths[n] = l),
            y.parseElements(
              u,
              function (t, e) {
                i &&
                  (i(t, s, e, o),
                  delete y.gradientDefs[n],
                  delete y.cssRules[n],
                  delete y.clipPaths[n])
              },
              d(s),
              e,
              r
            ))
          : i && i([], {})
      }
    }
    var o = new RegExp(
      '(normal|italic)?\\s*(normal|small-caps)?\\s*(normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900)?\\s*(' +
        y.reNum +
        '(?:px|cm|mm|em|pt|pc|in)*)(?:\\/(normal|' +
        y.reNum +
        '))?\\s+(.*)'
    )
    g(y, {
      parseFontDeclaration: function (t, e) {
        var i,
          r,
          n,
          s,
          t = t.match(o)
        t &&
          ((i = t[1]),
          (r = t[3]),
          (n = t[4]),
          (s = t[5]),
          (t = t[6]),
          i && (e.fontStyle = i),
          r && (e.fontWeight = isNaN(parseFloat(r)) ? r : parseFloat(r)),
          n && (e.fontSize = _(n)),
          t && (e.fontFamily = t),
          s && (e.lineHeight = 'normal' === s ? 1 : s))
      },
      getGradientDefs: function (t) {
        for (
          var e,
            i = S(t, [
              'linearGradient',
              'radialGradient',
              'svg:linearGradient',
              'svg:radialGradient',
            ]),
            r = 0,
            n = {},
            r = i.length;
          r--;

        )
          (e = i[r]).getAttribute('xlink:href') &&
            !(function t(e, i) {
              var r = 'xlink:href',
                n = O(e, i.getAttribute(r).slice(1))
              if (
                (n && n.getAttribute(r) && t(e, n),
                [
                  'gradientTransform',
                  'x1',
                  'x2',
                  'y1',
                  'y2',
                  'gradientUnits',
                  'cx',
                  'cy',
                  'r',
                  'fx',
                  'fy',
                ].forEach(function (t) {
                  n &&
                    !i.hasAttribute(t) &&
                    n.hasAttribute(t) &&
                    i.setAttribute(t, n.getAttribute(t))
                }),
                !i.children.length)
              )
                for (var s = n.cloneNode(!0); s.firstChild; )
                  i.appendChild(s.firstChild)
              i.removeAttribute(r)
            })(t, e),
            (n[e.getAttribute('id')] = e)
        return n
      },
      parseAttributes: function (i, t, e) {
        if (i) {
          var r,
            n,
            s = {},
            o =
              (void 0 === e && (e = i.getAttribute('svgUid')),
              i.parentNode &&
                y.svgValidParentsRegEx.test(i.parentNode.nodeName) &&
                (s = y.parseAttributes(i.parentNode, t, e)),
              t.reduce(function (t, e) {
                return (r = i.getAttribute(e)) && (t[e] = r), t
              }, {})),
            t = g(w(i, e), y.parseStyleAttribute(i)),
            o = g(o, t)
          t[C] && i.setAttribute(C, t[C]),
            (n = e = s.fontSize || y.Text.DEFAULT_SVG_FONT_SIZE),
            o[x] && (o[x] = n = _(o[x], e))
          var a,
            c,
            h,
            l = {}
          for (c in o)
            (a = (function (t, e, i, r) {
              var n,
                s = Array.isArray(e)
              if (('fill' !== t && 'stroke' !== t) || 'none' !== e) {
                if ('strokeUniform' === t) return 'non-scaling-stroke' === e
                if ('strokeDashArray' === t)
                  e =
                    'none' === e
                      ? null
                      : e.replace(/,/g, ' ').split(/\s+/).map(parseFloat)
                else if ('transformMatrix' === t)
                  e =
                    i && i.transformMatrix
                      ? m(i.transformMatrix, y.parseTransformAttribute(e))
                      : y.parseTransformAttribute(e)
                else if ('visible' === t)
                  (e = 'none' !== e && 'hidden' !== e),
                    i && !1 === i.visible && (e = !1)
                else if ('opacity' === t)
                  (e = parseFloat(e)),
                    i && void 0 !== i.opacity && (e *= i.opacity)
                else if ('textAnchor' === t)
                  e = 'start' === e ? 'left' : 'end' === e ? 'right' : 'center'
                else if ('charSpacing' === t) n = (_(e, r) / r) * 1e3
                else if ('paintFirst' === t) {
                  var i = e.indexOf('fill'),
                    o = e.indexOf('stroke'),
                    e = 'fill'
                  ;((-1 < i && -1 < o && o < i) || (-1 === i && -1 < o)) &&
                    (e = 'stroke')
                } else {
                  if ('href' === t || 'xlink:href' === t || 'font' === t)
                    return e
                  if ('imageSmoothing' === t) return 'optimizeQuality' === e
                  n = s ? e.map(_) : _(e, r)
                }
              } else e = ''
              return !s && isNaN(n) ? e : n
            })((h = (h = c) in v ? v[h] : h), o[c], s, n)),
              (l[h] = a)
          l && l.font && y.parseFontDeclaration(l.font, l)
          var u,
            t = g(s, l)
          if (y.svgValidParentsRegEx.test(i.nodeName)) return t
          var f,
            d = t
          for (f in b)
            if (void 0 !== d[b[f]] && '' !== d[f]) {
              if (void 0 === d[f]) {
                if (!y.Object.prototype[f]) continue
                d[f] = y.Object.prototype[f]
              }
              0 !== d[f].indexOf('url(') &&
                ((u = new y.Color(d[f])),
                (d[f] = u.setAlpha(p(u.getAlpha() * d[b[f]], 2)).toRgba()))
            }
          return d
        }
      },
      parseElements: function (t, e, i, r, n) {
        new y.ElementsParser(t, e, i, r, n).parse()
      },
      parseStyleAttribute: function (t) {
        var e,
          i,
          r,
          n = {},
          t = t.getAttribute('style')
        if (!t) return n
        if ('string' == typeof t)
          (e = n),
            t
              .replace(/;\s*$/, '')
              .split(';')
              .forEach(function (t) {
                t = t.split(':')
                ;(i = t[0].trim().toLowerCase()), (r = t[1].trim()), (e[i] = r)
              })
        else {
          var s,
            o,
            a,
            c = t,
            h = n
          for (a in c)
            void 0 !== c[a] && ((s = a.toLowerCase()), (o = c[a]), (h[s] = o))
        }
        return n
      },
      parsePointsAttribute: function (t) {
        if (!t) return null
        for (
          var e = [],
            i = 0,
            r = (t = (t = t.replace(/,/g, ' ').trim()).split(/\s+/)).length;
          i < r;
          i += 2
        )
          e.push({ x: parseFloat(t[i]), y: parseFloat(t[i + 1]) })
        return e
      },
      getCSSRules: function (t) {
        for (
          var e = t.getElementsByTagName('style'), o = {}, a = 0, c = e.length;
          a < c;
          a++
        ) {
          var i = e[a].textContent
          '' !== (i = i.replace(/\/\*[\s\S]*?\*\//g, '')).trim() &&
            i
              .split('}')
              .filter(function (t) {
                return t.trim()
              })
              .forEach(function (t) {
                var e = t.split('{'),
                  i = {},
                  r = e[1]
                    .trim()
                    .split(';')
                    .filter(function (t) {
                      return t.trim()
                    })
                for (a = 0, c = r.length; a < c; a++) {
                  var n = r[a].split(':'),
                    s = n[0].trim(),
                    n = n[1].trim()
                  i[s] = n
                }
                ;(t = e[0].trim()).split(',').forEach(function (t) {
                  '' !== (t = t.replace(/^svg/i, '').trim()) &&
                    (o[t]
                      ? y.util.object.extend(o[t], i)
                      : (o[t] = y.util.object.clone(i)))
                })
              })
        }
        return o
      },
      loadSVGFromURL: function (t, n, e, i) {
        ;(t = t.replace(/^\n\s*/, '').trim()),
          new y.util.request(t, {
            method: 'get',
            onComplete: function (t) {
              t = t.responseXML
              if (!t || !t.documentElement) return n && n(null), !1
              y.parseSVGDocument(
                t.documentElement,
                function (t, e, i, r) {
                  n && n(t, e, i, r)
                },
                e,
                i
              )
            },
          })
      },
      loadSVGFromString: function (t, n, e, i) {
        t = new y.window.DOMParser().parseFromString(t.trim(), 'text/xml')
        y.parseSVGDocument(
          t.documentElement,
          function (t, e, i, r) {
            n(t, e, i, r)
          },
          e,
          i
        )
      },
    })
  })('undefined' != typeof exports ? exports : this),
  (fabric.ElementsParser = function (t, e, i, r, n, s) {
    ;(this.elements = t),
      (this.callback = e),
      (this.options = i),
      (this.reviver = r),
      (this.svgUid = (i && i.svgUid) || 0),
      (this.parsingOptions = n),
      (this.regexUrl = /^url\(['"]?#([^'"]+)['"]?\)/g),
      (this.doc = s)
  }),
  (function (t) {
    ;(t.parse = function () {
      ;(this.instances = new Array(this.elements.length)),
        (this.numElements = this.elements.length),
        this.createObjects()
    }),
      (t.createObjects = function () {
        var i = this
        this.elements.forEach(function (t, e) {
          t.setAttribute('svgUid', i.svgUid), i.createObject(t, e)
        })
      }),
      (t.findTag = function (t) {
        return fabric[
          fabric.util.string.capitalize(t.tagName.replace('svg:', ''))
        ]
      }),
      (t.createObject = function (t, e) {
        var i = this.findTag(t)
        if (i && i.fromElement)
          try {
            i.fromElement(t, this.createCallback(e, t), this.options)
          } catch (t) {
            fabric.log(t)
          }
        else this.checkIfDone()
      }),
      (t.createCallback = function (i, r) {
        var n = this
        return function (t) {
          var e
          n.resolveGradient(t, r, 'fill'),
            n.resolveGradient(t, r, 'stroke'),
            t instanceof fabric.Image &&
              t._originalElement &&
              (e = t.parsePreserveAspectRatioAttribute(r)),
            t._removeTransformMatrix(e),
            n.resolveClipPath(t, r),
            n.reviver && n.reviver(r, t),
            (n.instances[i] = t),
            n.checkIfDone()
        }
      }),
      (t.extractPropertyDefinition = function (t, e, i) {
        var t = t[e],
          e = this.regexUrl
        if (e.test(t))
          return (
            (e.lastIndex = 0),
            (t = e.exec(t)[1]),
            (e.lastIndex = 0),
            fabric[i][this.svgUid][t]
          )
      }),
      (t.resolveGradient = function (t, e, i) {
        var r = this.extractPropertyDefinition(t, i, 'gradientDefs')
        r &&
          ((e = e.getAttribute(i + '-opacity')),
          (r = fabric.Gradient.fromElement(r, t, e, this.options)),
          t.set(i, r))
      }),
      (t.createClipPathCallback = function (t, e) {
        return function (t) {
          t._removeTransformMatrix(), (t.fillRule = t.clipRule), e.push(t)
        }
      }),
      (t.resolveClipPath = function (t, e) {
        var i,
          r = this.extractPropertyDefinition(t, 'clipPath', 'clipPaths')
        if (r) {
          for (
            var n = [],
              s = fabric.util.invertTransform(t.calcTransformMatrix()),
              o = r[0].parentNode,
              a = e;
            a.parentNode && a.getAttribute('clip-path') !== t.clipPath;

          )
            a = a.parentNode
          a.parentNode.appendChild(o)
          for (var c = 0; c < r.length; c++)
            (i = r[c]),
              this.findTag(i).fromElement(
                i,
                this.createClipPathCallback(t, n),
                this.options
              )
          ;(r = 1 === n.length ? n[0] : new fabric.Group(n)),
            (e = fabric.util.multiplyTransformMatrices(
              s,
              r.calcTransformMatrix()
            )),
            r.clipPath && this.resolveClipPath(r, a)
          o = fabric.util.qrDecompose(e)
          ;(r.flipX = !1),
            (r.flipY = !1),
            r.set('scaleX', o.scaleX),
            r.set('scaleY', o.scaleY),
            (r.angle = o.angle),
            (r.skewX = o.skewX),
            (r.skewY = 0),
            r.setPositionByOrigin(
              { x: o.translateX, y: o.translateY },
              'center',
              'center'
            ),
            (t.clipPath = r)
        } else delete t.clipPath
      }),
      (t.checkIfDone = function () {
        0 == --this.numElements &&
          ((this.instances = this.instances.filter(function (t) {
            return null != t
          })),
          this.callback(this.instances, this.elements))
      })
  })(fabric.ElementsParser.prototype),
  (function (t) {
    'use strict'
    t = t.fabric || (t.fabric = {})
    function i(t, e) {
      ;(this.x = t), (this.y = e)
    }
    t.Point
      ? t.warn('fabric.Point is already defined')
      : ((t.Point = i).prototype = {
          type: 'point',
          constructor: i,
          add: function (t) {
            return new i(this.x + t.x, this.y + t.y)
          },
          addEquals: function (t) {
            return (this.x += t.x), (this.y += t.y), this
          },
          scalarAdd: function (t) {
            return new i(this.x + t, this.y + t)
          },
          scalarAddEquals: function (t) {
            return (this.x += t), (this.y += t), this
          },
          subtract: function (t) {
            return new i(this.x - t.x, this.y - t.y)
          },
          subtractEquals: function (t) {
            return (this.x -= t.x), (this.y -= t.y), this
          },
          scalarSubtract: function (t) {
            return new i(this.x - t, this.y - t)
          },
          scalarSubtractEquals: function (t) {
            return (this.x -= t), (this.y -= t), this
          },
          multiply: function (t) {
            return new i(this.x * t, this.y * t)
          },
          multiplyEquals: function (t) {
            return (this.x *= t), (this.y *= t), this
          },
          divide: function (t) {
            return new i(this.x / t, this.y / t)
          },
          divideEquals: function (t) {
            return (this.x /= t), (this.y /= t), this
          },
          eq: function (t) {
            return this.x === t.x && this.y === t.y
          },
          lt: function (t) {
            return this.x < t.x && this.y < t.y
          },
          lte: function (t) {
            return this.x <= t.x && this.y <= t.y
          },
          gt: function (t) {
            return this.x > t.x && this.y > t.y
          },
          gte: function (t) {
            return this.x >= t.x && this.y >= t.y
          },
          lerp: function (t, e) {
            return (
              void 0 === e && (e = 0.5),
              (e = Math.max(Math.min(1, e), 0)),
              new i(this.x + (t.x - this.x) * e, this.y + (t.y - this.y) * e)
            )
          },
          distanceFrom: function (t) {
            var e = this.x - t.x,
              t = this.y - t.y
            return Math.sqrt(e * e + t * t)
          },
          midPointFrom: function (t) {
            return this.lerp(t)
          },
          min: function (t) {
            return new i(Math.min(this.x, t.x), Math.min(this.y, t.y))
          },
          max: function (t) {
            return new i(Math.max(this.x, t.x), Math.max(this.y, t.y))
          },
          toString: function () {
            return this.x + ',' + this.y
          },
          setXY: function (t, e) {
            return (this.x = t), (this.y = e), this
          },
          setX: function (t) {
            return (this.x = t), this
          },
          setY: function (t) {
            return (this.y = t), this
          },
          setFromPoint: function (t) {
            return (this.x = t.x), (this.y = t.y), this
          },
          swap: function (t) {
            var e = this.x,
              i = this.y
            ;(this.x = t.x), (this.y = t.y), (t.x = e), (t.y = i)
          },
          clone: function () {
            return new i(this.x, this.y)
          },
        })
  })('undefined' != typeof exports ? exports : this),
  (function (t) {
    'use strict'
    var a = t.fabric || (t.fabric = {})
    function c(t) {
      ;(this.status = t), (this.points = [])
    }
    a.Intersection
      ? a.warn('fabric.Intersection is already defined')
      : ((a.Intersection = c),
        (a.Intersection.prototype = {
          constructor: c,
          appendPoint: function (t) {
            return this.points.push(t), this
          },
          appendPoints: function (t) {
            return (this.points = this.points.concat(t)), this
          },
        }),
        (a.Intersection.intersectLineLine = function (t, e, i, r) {
          var n,
            s = (r.x - i.x) * (t.y - i.y) - (r.y - i.y) * (t.x - i.x),
            o = (e.x - t.x) * (t.y - i.y) - (e.y - t.y) * (t.x - i.x),
            r = (r.y - i.y) * (e.x - t.x) - (r.x - i.x) * (e.y - t.y)
          return (
            0 != r
              ? ((i = o / r),
                0 <= (r = s / r) && r <= 1 && 0 <= i && i <= 1
                  ? (n = new c('Intersection')).appendPoint(
                      new a.Point(t.x + r * (e.x - t.x), t.y + r * (e.y - t.y))
                    )
                  : (n = new c()))
              : (n = new c(0 == s || 0 == o ? 'Coincident' : 'Parallel')),
            n
          )
        }),
        (a.Intersection.intersectLinePolygon = function (t, e, i) {
          for (var r, n, s = new c(), o = i.length, a = 0; a < o; a++)
            (n = i[a]),
              (r = i[(a + 1) % o]),
              (n = c.intersectLineLine(t, e, n, r)),
              s.appendPoints(n.points)
          return 0 < s.points.length && (s.status = 'Intersection'), s
        }),
        (a.Intersection.intersectPolygonPolygon = function (t, e) {
          for (var i = new c(), r = t.length, n = 0; n < r; n++) {
            var s = t[n],
              o = t[(n + 1) % r],
              s = c.intersectLinePolygon(s, o, e)
            i.appendPoints(s.points)
          }
          return 0 < i.points.length && (i.status = 'Intersection'), i
        }),
        (a.Intersection.intersectPolygonRectangle = function (t, e, i) {
          var r = e.min(i),
            e = e.max(i),
            i = new a.Point(e.x, r.y),
            n = new a.Point(r.x, e.y),
            s = c.intersectLinePolygon(r, i, t),
            i = c.intersectLinePolygon(i, e, t),
            e = c.intersectLinePolygon(e, n, t),
            n = c.intersectLinePolygon(n, r, t),
            r = new c()
          return (
            r.appendPoints(s.points),
            r.appendPoints(i.points),
            r.appendPoints(e.points),
            r.appendPoints(n.points),
            0 < r.points.length && (r.status = 'Intersection'),
            r
          )
        }))
  })('undefined' != typeof exports ? exports : this),
  (function (t) {
    'use strict'
    var h = t.fabric || (t.fabric = {})
    function a(t) {
      t ? this._tryParsingColor(t) : this.setSource([0, 0, 0, 1])
    }
    function c(t, e, i) {
      return (
        i < 0 && (i += 1),
        1 < i && --i,
        i < 1 / 6
          ? t + 6 * (e - t) * i
          : i < 0.5
          ? e
          : i < 2 / 3
          ? t + (e - t) * (2 / 3 - i) * 6
          : t
      )
    }
    h.Color
      ? h.warn('fabric.Color is already defined.')
      : ((h.Color = a),
        (h.Color.prototype = {
          _tryParsingColor: function (t) {
            var e
            ;(e = (e =
              (e =
                (e =
                  (e =
                    'transparent' ===
                    (t = t in a.colorNameMap ? a.colorNameMap[t] : t)
                      ? [255, 255, 255, 0]
                      : e) || a.sourceFromHex(t)) || a.sourceFromRgb(t)) ||
              a.sourceFromHsl(t)) || [0, 0, 0, 1]) && this.setSource(e)
          },
          _rgbToHsl: function (t, e, i) {
            var r,
              n = h.util.array.max([(t /= 255), (e /= 255), (i /= 255)]),
              s = h.util.array.min([t, e, i]),
              o = (n + s) / 2
            if (n === s) r = c = 0
            else {
              var a = n - s,
                c = 0.5 < o ? a / (2 - n - s) : a / (n + s)
              switch (n) {
                case t:
                  r = (e - i) / a + (e < i ? 6 : 0)
                  break
                case e:
                  r = (i - t) / a + 2
                  break
                case i:
                  r = (t - e) / a + 4
              }
              r /= 6
            }
            return [
              Math.round(360 * r),
              Math.round(100 * c),
              Math.round(100 * o),
            ]
          },
          getSource: function () {
            return this._source
          },
          setSource: function (t) {
            this._source = t
          },
          toRgb: function () {
            var t = this.getSource()
            return 'rgb(' + t[0] + ',' + t[1] + ',' + t[2] + ')'
          },
          toRgba: function () {
            var t = this.getSource()
            return 'rgba(' + t[0] + ',' + t[1] + ',' + t[2] + ',' + t[3] + ')'
          },
          toHsl: function () {
            var t = this.getSource(),
              t = this._rgbToHsl(t[0], t[1], t[2])
            return 'hsl(' + t[0] + ',' + t[1] + '%,' + t[2] + '%)'
          },
          toHsla: function () {
            var t = this.getSource(),
              e = this._rgbToHsl(t[0], t[1], t[2])
            return 'hsla(' + e[0] + ',' + e[1] + '%,' + e[2] + '%,' + t[3] + ')'
          },
          toHex: function () {
            var t,
              e = this.getSource(),
              i = e[0].toString(16)
            return (
              (i = 1 === i.length ? '0' + i : i),
              (t = 1 === (t = e[1].toString(16)).length ? '0' + t : t),
              (e = 1 === (e = e[2].toString(16)).length ? '0' + e : e),
              i.toUpperCase() + t.toUpperCase() + e.toUpperCase()
            )
          },
          toHexa: function () {
            var t = this.getSource(),
              t = Math.round(255 * t[3])
            return (
              (t = 1 === (t = t.toString(16)).length ? '0' + t : t),
              this.toHex() + t.toUpperCase()
            )
          },
          getAlpha: function () {
            return this.getSource()[3]
          },
          setAlpha: function (t) {
            var e = this.getSource()
            return (e[3] = t), this.setSource(e), this
          },
          toGrayscale: function () {
            var t = this.getSource(),
              e = parseInt(
                (0.3 * t[0] + 0.59 * t[1] + 0.11 * t[2]).toFixed(0),
                10
              ),
              t = t[3]
            return this.setSource([e, e, e, t]), this
          },
          toBlackWhite: function (t) {
            var e = this.getSource(),
              i = (0.3 * e[0] + 0.59 * e[1] + 0.11 * e[2]).toFixed(0),
              e = e[3]
            return (
              (t = t || 127),
              (i = Number(i) < Number(t) ? 0 : 255),
              this.setSource([i, i, i, e]),
              this
            )
          },
          overlayWith: function (t) {
            t instanceof a || (t = new a(t))
            for (
              var e = [],
                i = this.getAlpha(),
                r = this.getSource(),
                n = t.getSource(),
                s = 0;
              s < 3;
              s++
            )
              e.push(Math.round(0.5 * r[s] + 0.5 * n[s]))
            return (e[3] = i), this.setSource(e), this
          },
        }),
        (h.Color.reRGBa =
          /^rgba?\(\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*(?:\s*,\s*((?:\d*\.?\d+)?)\s*)?\)$/i),
        (h.Color.reHSLa =
          /^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3}\%)\s*,\s*(\d{1,3}\%)\s*(?:\s*,\s*(\d+(?:\.\d+)?)\s*)?\)$/i),
        (h.Color.reHex =
          /^#?([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})$/i),
        (h.Color.colorNameMap = {
          aliceblue: '#F0F8FF',
          antiquewhite: '#FAEBD7',
          aqua: '#00FFFF',
          aquamarine: '#7FFFD4',
          azure: '#F0FFFF',
          beige: '#F5F5DC',
          bisque: '#FFE4C4',
          black: '#000000',
          blanchedalmond: '#FFEBCD',
          blue: '#0000FF',
          blueviolet: '#8A2BE2',
          brown: '#A52A2A',
          burlywood: '#DEB887',
          cadetblue: '#5F9EA0',
          chartreuse: '#7FFF00',
          chocolate: '#D2691E',
          coral: '#FF7F50',
          cornflowerblue: '#6495ED',
          cornsilk: '#FFF8DC',
          crimson: '#DC143C',
          cyan: '#00FFFF',
          darkblue: '#00008B',
          darkcyan: '#008B8B',
          darkgoldenrod: '#B8860B',
          darkgray: '#A9A9A9',
          darkgrey: '#A9A9A9',
          darkgreen: '#006400',
          darkkhaki: '#BDB76B',
          darkmagenta: '#8B008B',
          darkolivegreen: '#556B2F',
          darkorange: '#FF8C00',
          darkorchid: '#9932CC',
          darkred: '#8B0000',
          darksalmon: '#E9967A',
          darkseagreen: '#8FBC8F',
          darkslateblue: '#483D8B',
          darkslategray: '#2F4F4F',
          darkslategrey: '#2F4F4F',
          darkturquoise: '#00CED1',
          darkviolet: '#9400D3',
          deeppink: '#FF1493',
          deepskyblue: '#00BFFF',
          dimgray: '#696969',
          dimgrey: '#696969',
          dodgerblue: '#1E90FF',
          firebrick: '#B22222',
          floralwhite: '#FFFAF0',
          forestgreen: '#228B22',
          fuchsia: '#FF00FF',
          gainsboro: '#DCDCDC',
          ghostwhite: '#F8F8FF',
          gold: '#FFD700',
          goldenrod: '#DAA520',
          gray: '#808080',
          grey: '#808080',
          green: '#008000',
          greenyellow: '#ADFF2F',
          honeydew: '#F0FFF0',
          hotpink: '#FF69B4',
          indianred: '#CD5C5C',
          indigo: '#4B0082',
          ivory: '#FFFFF0',
          khaki: '#F0E68C',
          lavender: '#E6E6FA',
          lavenderblush: '#FFF0F5',
          lawngreen: '#7CFC00',
          lemonchiffon: '#FFFACD',
          lightblue: '#ADD8E6',
          lightcoral: '#F08080',
          lightcyan: '#E0FFFF',
          lightgoldenrodyellow: '#FAFAD2',
          lightgray: '#D3D3D3',
          lightgrey: '#D3D3D3',
          lightgreen: '#90EE90',
          lightpink: '#FFB6C1',
          lightsalmon: '#FFA07A',
          lightseagreen: '#20B2AA',
          lightskyblue: '#87CEFA',
          lightslategray: '#778899',
          lightslategrey: '#778899',
          lightsteelblue: '#B0C4DE',
          lightyellow: '#FFFFE0',
          lime: '#00FF00',
          limegreen: '#32CD32',
          linen: '#FAF0E6',
          magenta: '#FF00FF',
          maroon: '#800000',
          mediumaquamarine: '#66CDAA',
          mediumblue: '#0000CD',
          mediumorchid: '#BA55D3',
          mediumpurple: '#9370DB',
          mediumseagreen: '#3CB371',
          mediumslateblue: '#7B68EE',
          mediumspringgreen: '#00FA9A',
          mediumturquoise: '#48D1CC',
          mediumvioletred: '#C71585',
          midnightblue: '#191970',
          mintcream: '#F5FFFA',
          mistyrose: '#FFE4E1',
          moccasin: '#FFE4B5',
          navajowhite: '#FFDEAD',
          navy: '#000080',
          oldlace: '#FDF5E6',
          olive: '#808000',
          olivedrab: '#6B8E23',
          orange: '#FFA500',
          orangered: '#FF4500',
          orchid: '#DA70D6',
          palegoldenrod: '#EEE8AA',
          palegreen: '#98FB98',
          paleturquoise: '#AFEEEE',
          palevioletred: '#DB7093',
          papayawhip: '#FFEFD5',
          peachpuff: '#FFDAB9',
          peru: '#CD853F',
          pink: '#FFC0CB',
          plum: '#DDA0DD',
          powderblue: '#B0E0E6',
          purple: '#800080',
          rebeccapurple: '#663399',
          red: '#FF0000',
          rosybrown: '#BC8F8F',
          royalblue: '#4169E1',
          saddlebrown: '#8B4513',
          salmon: '#FA8072',
          sandybrown: '#F4A460',
          seagreen: '#2E8B57',
          seashell: '#FFF5EE',
          sienna: '#A0522D',
          silver: '#C0C0C0',
          skyblue: '#87CEEB',
          slateblue: '#6A5ACD',
          slategray: '#708090',
          slategrey: '#708090',
          snow: '#FFFAFA',
          springgreen: '#00FF7F',
          steelblue: '#4682B4',
          tan: '#D2B48C',
          teal: '#008080',
          thistle: '#D8BFD8',
          tomato: '#FF6347',
          turquoise: '#40E0D0',
          violet: '#EE82EE',
          wheat: '#F5DEB3',
          white: '#FFFFFF',
          whitesmoke: '#F5F5F5',
          yellow: '#FFFF00',
          yellowgreen: '#9ACD32',
        }),
        (h.Color.fromRgb = function (t) {
          return a.fromSource(a.sourceFromRgb(t))
        }),
        (h.Color.sourceFromRgb = function (t) {
          var e,
            i,
            r,
            t = t.match(a.reRGBa)
          if (t)
            return (
              (e =
                (parseInt(t[1], 10) / (/%$/.test(t[1]) ? 100 : 1)) *
                (/%$/.test(t[1]) ? 255 : 1)),
              (i =
                (parseInt(t[2], 10) / (/%$/.test(t[2]) ? 100 : 1)) *
                (/%$/.test(t[2]) ? 255 : 1)),
              (r =
                (parseInt(t[3], 10) / (/%$/.test(t[3]) ? 100 : 1)) *
                (/%$/.test(t[3]) ? 255 : 1)),
              [
                parseInt(e, 10),
                parseInt(i, 10),
                parseInt(r, 10),
                t[4] ? parseFloat(t[4]) : 1,
              ]
            )
        }),
        (h.Color.fromRgba = a.fromRgb),
        (h.Color.fromHsl = function (t) {
          return a.fromSource(a.sourceFromHsl(t))
        }),
        (h.Color.sourceFromHsl = function (t) {
          var e,
            i,
            r,
            n,
            s,
            o,
            t = t.match(a.reHSLa)
          if (t)
            return (
              (e = (((parseFloat(t[1]) % 360) + 360) % 360) / 360),
              (r = parseFloat(t[2]) / (/%$/.test(t[2]) ? 100 : 1)),
              (i = parseFloat(t[3]) / (/%$/.test(t[3]) ? 100 : 1)),
              0 == r
                ? (n = s = o = i)
                : ((n = c(
                    (r = 2 * i - (i = i <= 0.5 ? i * (1 + r) : i + r - i * r)),
                    i,
                    e + 1 / 3
                  )),
                  (s = c(r, i, e)),
                  (o = c(r, i, e - 1 / 3))),
              [
                Math.round(255 * n),
                Math.round(255 * s),
                Math.round(255 * o),
                t[4] ? parseFloat(t[4]) : 1,
              ]
            )
        }),
        (h.Color.fromHsla = a.fromHsl),
        (h.Color.fromHex = function (t) {
          return a.fromSource(a.sourceFromHex(t))
        }),
        (h.Color.sourceFromHex = function (t) {
          var e, i, r, n, s
          if (t.match(a.reHex))
            return (
              (e =
                3 === (t = t.slice(t.indexOf('#') + 1)).length ||
                4 === t.length),
              (s = 8 === t.length || 4 === t.length),
              (i = e ? t.charAt(0) + t.charAt(0) : t.substring(0, 2)),
              (r = e ? t.charAt(1) + t.charAt(1) : t.substring(2, 4)),
              (n = e ? t.charAt(2) + t.charAt(2) : t.substring(4, 6)),
              (s = s
                ? e
                  ? t.charAt(3) + t.charAt(3)
                  : t.substring(6, 8)
                : 'FF'),
              [
                parseInt(i, 16),
                parseInt(r, 16),
                parseInt(n, 16),
                parseFloat((parseInt(s, 16) / 255).toFixed(2)),
              ]
            )
        }),
        (h.Color.fromSource = function (t) {
          var e = new a()
          return e.setSource(t), e
        }))
  })('undefined' != typeof exports ? exports : this),
  (function (t) {
    'use strict'
    var a = t.fabric || (t.fabric = {}),
      n = ['e', 'se', 's', 'sw', 'w', 'nw', 'n', 'ne', 'e'],
      s = ['ns', 'nesw', 'ew', 'nwse'],
      o = {},
      c = 'left',
      h = 'top',
      l = 'right',
      u = 'bottom',
      f = 'center',
      d = { top: u, bottom: h, left: l, right: c, center: f },
      g = a.util.radiansToDegrees,
      p =
        Math.sign ||
        function (t) {
          return (0 < t) - (t < 0) || +t
        }
    function m(t, e) {
      t = t.angle + g(Math.atan2(e.y, e.x)) + 360
      return Math.round((t % 360) / 45)
    }
    function v(t, e) {
      var i = e.transform.target,
        r = i.canvas,
        n = a.util.object.clone(e)
      ;(n.target = i), r && r.fire('object:' + t, n), i.fire(t, e)
    }
    function b(t, e) {
      ;(e = e.canvas), (t = t[e.uniScaleKey])
      return (e.uniformScaling && !t) || (!e.uniformScaling && t)
    }
    function y(t) {
      return t.originX === f && t.originY === f
    }
    function _(t, e, i) {
      var r = t.lockScalingX,
        t = t.lockScalingY
      return (
        !(!r || !t) ||
        !(e || (!r && !t) || !i) ||
        !(!r || 'x' !== e) ||
        !(!t || 'y' !== e)
      )
    }
    function x(t, e, i, r) {
      return { e: t, transform: e, pointer: { x: i, y: r } }
    }
    function C(o) {
      return function (t, e, i, r) {
        var n = e.target,
          s = n.getCenterPoint(),
          s = n.translateToOriginPoint(s, e.originX, e.originY),
          t = o(t, e, i, r)
        return n.setPositionByOrigin(s, e.originX, e.originY), t
      }
    }
    function S(s, o) {
      return function (t, e, i, r) {
        var n = o(t, e, i, r)
        return n && v(s, x(t, e, i, r)), n
      }
    }
    function T(t, e, i, r, n) {
      var s = t.target,
        t = s.controls[t.corner],
        o = s.canvas.getZoom(),
        o = s.padding / o,
        s = s.toLocalPoint(new a.Point(r, n), e, i)
      return (
        s.x >= o && (s.x -= o),
        s.x <= -o && (s.x += o),
        s.y >= o && (s.y -= o),
        s.y <= o && (s.y += o),
        (s.x -= t.offsetX),
        (s.y -= t.offsetY),
        s
      )
    }
    function w(t) {
      return t.flipX !== t.flipY
    }
    function O(t, e, i, r, n) {
      0 !== t[e] &&
        ((e = (n / t._getTransformedDimensions()[r]) * t[i]), t.set(i, e))
    }
    function P(t, e, i, r) {
      var n,
        s = e.target,
        o = s._getTransformedDimensions(0, s.skewY),
        i = T(e, e.originX, e.originY, i, r),
        r = Math.abs(2 * i.x) - o.x,
        i = s.skewX,
        r =
          (r < 2
            ? (n = 0)
            : ((n = g(Math.atan2(r / s.scaleX, o.y / s.scaleY))),
              e.originX === c && e.originY === u && (n = -n),
              e.originX === l && e.originY === h && (n = -n),
              w(s) && (n = -n)),
          i !== n)
      return (
        r &&
          ((o = s._getTransformedDimensions().y),
          s.set('skewX', n),
          O(s, 'skewY', 'scaleY', 'y', o)),
        r
      )
    }
    function k(t, e, i, r) {
      var n,
        s = e.target,
        o = s._getTransformedDimensions(s.skewX, 0),
        i = T(e, e.originX, e.originY, i, r),
        r = Math.abs(2 * i.y) - o.y,
        i = s.skewY,
        r =
          (r < 2
            ? (n = 0)
            : ((n = g(Math.atan2(r / s.scaleY, o.x / s.scaleX))),
              e.originX === c && e.originY === u && (n = -n),
              e.originX === l && e.originY === h && (n = -n),
              w(s) && (n = -n)),
          i !== n)
      return (
        r &&
          ((o = s._getTransformedDimensions().x),
          s.set('skewY', n),
          O(s, 'skewX', 'scaleX', 'x', o)),
        r
      )
    }
    function E(t, e, i, r, n) {
      var s = e.target,
        o = s.lockScalingX,
        a = s.lockScalingY,
        n = (n = n || {}).by,
        t = b(t, s),
        c = _(s, n, t),
        h = e.gestureScale
      if (c) return !1
      if (h) (l = e.scaleX * h), (u = e.scaleY * h)
      else {
        if (
          ((c = T(e, e.originX, e.originY, i, r)),
          (h = 'y' !== n ? p(c.x) : 1),
          (i = 'x' !== n ? p(c.y) : 1),
          e.signX || (e.signX = h),
          e.signY || (e.signY = i),
          s.lockScalingFlip && (e.signX !== h || e.signY !== i))
        )
          return !1
        var l,
          u,
          r = s._getTransformedDimensions()
        ;(u =
          t && !n
            ? ((t = Math.abs(c.x) + Math.abs(c.y)),
              (f = e.original),
              (t =
                t /
                (Math.abs((r.x * f.scaleX) / s.scaleX) +
                  Math.abs((r.y * f.scaleY) / s.scaleY))),
              (l = f.scaleX * t),
              f.scaleY * t)
            : ((l = Math.abs((c.x * s.scaleX) / r.x)),
              Math.abs((c.y * s.scaleY) / r.y))),
          y(e) && ((l *= 2), (u *= 2)),
          e.signX !== h &&
            'y' !== n &&
            ((e.originX = d[e.originX]), (l *= -1), (e.signX = h)),
          e.signY !== i &&
            'x' !== n &&
            ((e.originY = d[e.originY]), (u *= -1), (e.signY = i))
      }
      var f = s.scaleX,
        t = s.scaleY
      return (
        n
          ? ('x' === n && s.set('scaleX', l), 'y' === n && s.set('scaleY', u))
          : (o || s.set('scaleX', l), a || s.set('scaleY', u)),
        f !== s.scaleX || t !== s.scaleY
      )
    }
    ;(o.scaleCursorStyleHandler = function (t, e, i) {
      var t = b(t, i),
        r = ''
      return (
        0 !== e.x && 0 === e.y
          ? (r = 'x')
          : 0 === e.x && 0 !== e.y && (r = 'y'),
        _(i, r, t) ? 'not-allowed' : ((r = m(i, e)), n[r] + '-resize')
      )
    }),
      (o.skewCursorStyleHandler = function (t, e, i) {
        var r = 'not-allowed'
        return (0 !== e.x && i.lockSkewingY) || (0 !== e.y && i.lockSkewingX)
          ? r
          : ((r = m(i, e) % 4), s[r] + '-resize')
      }),
      (o.scaleSkewCursorStyleHandler = function (t, e, i) {
        return t[i.canvas.altActionKey]
          ? o.skewCursorStyleHandler(t, e, i)
          : o.scaleCursorStyleHandler(t, e, i)
      }),
      (o.rotationWithSnapping = S(
        'rotating',
        C(function (t, e, i, r) {
          var n = e.target,
            s = n.translateToOriginPoint(
              n.getCenterPoint(),
              e.originX,
              e.originY
            )
          if (n.lockRotation) return !1
          var o = Math.atan2(e.ey - s.y, e.ex - s.x),
            r = Math.atan2(r - s.y, i - s.x),
            i = g(r - o + e.theta)
          return (
            0 < n.snapAngle &&
              ((s = n.snapAngle),
              (r = n.snapThreshold || s),
              (o = Math.ceil(i / s) * s),
              (e = Math.floor(i / s) * s),
              Math.abs(i - e) < r ? (i = e) : Math.abs(i - o) < r && (i = o)),
            i < 0 && (i = 360 + i),
            (s = n.angle !== (i %= 360)),
            (n.angle = i),
            s
          )
        })
      )),
      (o.scalingEqually = S(
        'scaling',
        C(function (t, e, i, r) {
          return E(t, e, i, r)
        })
      )),
      (o.scalingX = S(
        'scaling',
        C(function (t, e, i, r) {
          return E(t, e, i, r, { by: 'x' })
        })
      )),
      (o.scalingY = S(
        'scaling',
        C(function (t, e, i, r) {
          return E(t, e, i, r, { by: 'y' })
        })
      )),
      (o.scalingYOrSkewingX = function (t, e, i, r) {
        return t[e.target.canvas.altActionKey]
          ? o.skewHandlerX(t, e, i, r)
          : o.scalingY(t, e, i, r)
      }),
      (o.scalingXOrSkewingY = function (t, e, i, r) {
        return t[e.target.canvas.altActionKey]
          ? o.skewHandlerY(t, e, i, r)
          : o.scalingX(t, e, i, r)
      }),
      (o.changeWidth = S(
        'resizing',
        C(function (t, e, i, r) {
          var n = e.target,
            i = T(e, e.originX, e.originY, i, r),
            r = n.strokeWidth / (n.strokeUniform ? n.scaleX : 1),
            e = y(e) ? 2 : 1,
            s = n.width,
            i = Math.abs((i.x * e) / n.scaleX) - r
          return n.set('width', Math.max(i, 0)), s !== i
        })
      )),
      (o.skewHandlerX = function (t, e, i, r) {
        var n,
          s = e.target,
          o = s.skewX,
          a = e.originY
        return (
          !s.lockSkewingX &&
          (0 === o
            ? (n = 0 < T(e, f, f, i, r).x ? c : l)
            : (0 < o && (n = a === h ? c : l),
              o < 0 && (n = a === h ? l : c),
              w(s) && (n = n === c ? l : c)),
          (e.originX = n),
          S('skewing', C(P))(t, e, i, r))
        )
      }),
      (o.skewHandlerY = function (t, e, i, r) {
        var n,
          s = e.target,
          o = s.skewY,
          a = e.originX
        return (
          !s.lockSkewingY &&
          (0 === o
            ? (n = 0 < T(e, f, f, i, r).y ? h : u)
            : (0 < o && (n = a === c ? h : u),
              o < 0 && (n = a === c ? u : h),
              w(s) && (n = n === h ? u : h)),
          (e.originY = n),
          S('skewing', C(k))(t, e, i, r))
        )
      }),
      (o.dragHandler = function (t, e, i, r) {
        var n = e.target,
          s = i - e.offsetX,
          o = r - e.offsetY,
          a = !n.get('lockMovementX') && n.left !== s,
          c = !n.get('lockMovementY') && n.top !== o
        return (
          a && n.set('left', s),
          c && n.set('top', o),
          (a || c) && v('moving', x(t, e, i, r)),
          a || c
        )
      }),
      (o.scaleOrSkewActionName = function (t, e, i) {
        return (
          (t = t[i.canvas.altActionKey]),
          0 === e.x
            ? t
              ? 'skewX'
              : 'scaleY'
            : 0 === e.y
            ? t
              ? 'skewY'
              : 'scaleX'
            : void 0
        )
      }),
      (o.rotationStyleHandler = function (t, e, i) {
        return i.lockRotation ? 'not-allowed' : e.cursorStyle
      }),
      (o.fireEvent = v),
      (o.wrapWithFixedAnchor = C),
      (o.wrapWithFireEvent = S),
      (o.getLocalPoint = T),
      (a.controlsUtils = o)
  })('undefined' != typeof exports ? exports : this),
  (function (t) {
    'use strict'
    var t = t.fabric || (t.fabric = {}),
      u = t.util.degreesToRadians,
      t = t.controlsUtils
    ;(t.renderCircleControl = function (t, e, i, r, n) {
      r = r || {}
      var s,
        o = this.sizeX || r.cornerSize || n.cornerSize,
        a = this.sizeY || r.cornerSize || n.cornerSize,
        c = (h = (void 0 !== r.transparentCorners ? r : n).transparentCorners)
          ? 'stroke'
          : 'fill',
        h = !h && (r.cornerStrokeColor || n.cornerStrokeColor),
        l = e,
        u = i
      t.save(),
        (t.fillStyle = r.cornerColor || n.cornerColor),
        (t.strokeStyle = r.cornerStrokeColor || n.cornerStrokeColor),
        a < o
          ? (t.scale(1, a / (s = o)), (u = (i * o) / a))
          : o < a
          ? (t.scale(o / (s = a), 1), (l = (e * a) / o))
          : (s = o),
        (t.lineWidth = 1),
        t.beginPath(),
        t.arc(l, u, s / 2, 0, 2 * Math.PI, !1),
        t[c](),
        h && t.stroke(),
        t.restore()
    }),
      (t.renderSquareControl = function (t, e, i, r, n) {
        r = r || {}
        var s = this.sizeX || r.cornerSize || n.cornerSize,
          o = this.sizeY || r.cornerSize || n.cornerSize,
          a = (c = (void 0 !== r.transparentCorners ? r : n).transparentCorners)
            ? 'stroke'
            : 'fill',
          c = !c && (r.cornerStrokeColor || n.cornerStrokeColor),
          h = s / 2,
          l = o / 2
        t.save(),
          (t.fillStyle = r.cornerColor || n.cornerColor),
          (t.strokeStyle = r.cornerStrokeColor || n.cornerStrokeColor),
          (t.lineWidth = 1),
          t.translate(e, i),
          t.rotate(u(n.angle)),
          t[a + 'Rect'](-h, -l, s, o),
          c && t.strokeRect(-h, -l, s, o),
          t.restore()
      })
  })('undefined' != typeof exports ? exports : this),
  (function (t) {
    'use strict'
    var f = t.fabric || (t.fabric = {})
    ;(f.Control = function (t) {
      for (var e in t) this[e] = t[e]
    }),
      (f.Control.prototype = {
        visible: !0,
        actionName: 'scale',
        angle: 0,
        x: 0,
        y: 0,
        offsetX: 0,
        offsetY: 0,
        sizeX: null,
        sizeY: null,
        touchSizeX: null,
        touchSizeY: null,
        cursorStyle: 'crosshair',
        withConnection: !1,
        actionHandler: function () {},
        mouseDownHandler: function () {},
        mouseUpHandler: function () {},
        getActionHandler: function () {
          return this.actionHandler
        },
        getMouseDownHandler: function () {
          return this.mouseDownHandler
        },
        getMouseUpHandler: function () {
          return this.mouseUpHandler
        },
        cursorStyleHandler: function (t, e) {
          return e.cursorStyle
        },
        getActionName: function (t, e) {
          return e.actionName
        },
        getVisibility: function (t, e) {
          t = t._controlsVisibility
          return t && void 0 !== t[e] ? t[e] : this.visible
        },
        setVisibility: function (t) {
          this.visible = t
        },
        positionHandler: function (t, e) {
          return f.util.transformPoint(
            { x: this.x * t.x + this.offsetX, y: this.y * t.y + this.offsetY },
            e
          )
        },
        calcCornerCoords: function (t, e, i, r, n) {
          var s,
            o,
            a,
            c,
            h,
            l,
            u = n ? this.touchSizeX : this.sizeX,
            n = n ? this.touchSizeY : this.sizeY
          return (
            u && n && u !== n
              ? ((c = Math.atan2(n, u)),
                (h = Math.sqrt(u * u + n * n) / 2),
                (l = c - f.util.degreesToRadians(t)),
                (c = Math.PI / 2 - c - f.util.degreesToRadians(t)),
                (s = h * f.util.cos(l)),
                (o = h * f.util.sin(l)),
                (a = h * f.util.cos(c)),
                (c = h * f.util.sin(c)))
              : ((h = 0.7071067812 * (u && n ? u : e)),
                (l = f.util.degreesToRadians(45 - t)),
                (s = a = h * f.util.cos(l)),
                (o = c = h * f.util.sin(l))),
            {
              tl: { x: i - c, y: r - a },
              tr: { x: i + s, y: r - o },
              bl: { x: i - s, y: r + o },
              br: { x: i + c, y: r + a },
            }
          )
        },
        render: function (t, e, i, r, n) {
          ;('circle' === ((r = r || {}).cornerStyle || n.cornerStyle)
            ? f.controlsUtils.renderCircleControl
            : f.controlsUtils.renderSquareControl
          ).call(this, t, e, i, r, n)
        },
      })
  })('undefined' != typeof exports ? exports : this),
  (function () {
    var p = fabric.util.object.clone
    ;(fabric.Gradient = fabric.util.createClass({
      offsetX: 0,
      offsetY: 0,
      gradientTransform: null,
      gradientUnits: 'pixels',
      type: 'linear',
      initialize: function (e) {
        ;(e = e || {}).coords || (e.coords = {})
        var t,
          i = this
        Object.keys(e).forEach(function (t) {
          i[t] = e[t]
        }),
          this.id
            ? (this.id += '_' + fabric.Object.__uid++)
            : (this.id = fabric.Object.__uid++),
          (t = {
            x1: e.coords.x1 || 0,
            y1: e.coords.y1 || 0,
            x2: e.coords.x2 || 0,
            y2: e.coords.y2 || 0,
          }),
          'radial' === this.type &&
            ((t.r1 = e.coords.r1 || 0), (t.r2 = e.coords.r2 || 0)),
          (this.coords = t),
          (this.colorStops = e.colorStops.slice())
      },
      addColorStop: function (t) {
        for (var e in t) {
          var i = new fabric.Color(t[e])
          this.colorStops.push({
            offset: parseFloat(e),
            color: i.toRgb(),
            opacity: i.getAlpha(),
          })
        }
        return this
      },
      toObject: function (t) {
        var e = {
          type: this.type,
          coords: this.coords,
          colorStops: this.colorStops,
          offsetX: this.offsetX,
          offsetY: this.offsetY,
          gradientUnits: this.gradientUnits,
          gradientTransform:
            this.gradientTransform && this.gradientTransform.concat(),
        }
        return fabric.util.populateWithProperties(this, e, t), e
      },
      toSVG: function (t, e) {
        var i,
          r = p(this.coords, !0),
          e = e || {},
          n = p(this.colorStops, !0),
          s = r.r1 > r.r2,
          o = (this.gradientTransform || fabric.iMatrix).concat(),
          a = -this.offsetX,
          c = -this.offsetY,
          h = !!e.additionalTransform,
          l =
            'pixels' === this.gradientUnits
              ? 'userSpaceOnUse'
              : 'objectBoundingBox'
        if (
          (n.sort(function (t, e) {
            return t.offset - e.offset
          }),
          'objectBoundingBox' == l
            ? ((a /= t.width), (c /= t.height))
            : ((a += t.width / 2), (c += t.height / 2)),
          'path' === t.type &&
            'percentage' !== this.gradientUnits &&
            ((a -= t.pathOffset.x), (c -= t.pathOffset.y)),
          (o[4] -= a),
          (o[5] -= c),
          (t = 'id="SVGID_' + this.id + '" gradientUnits="' + l + '"'),
          (t +=
            ' gradientTransform="' +
            (h ? e.additionalTransform + ' ' : '') +
            fabric.util.matrixToSVG(o) +
            '" '),
          'linear' === this.type
            ? (i = [
                '<linearGradient ',
                t,
                ' x1="',
                r.x1,
                '" y1="',
                r.y1,
                '" x2="',
                r.x2,
                '" y2="',
                r.y2,
                '">\n',
              ])
            : 'radial' === this.type &&
              (i = [
                '<radialGradient ',
                t,
                ' cx="',
                s ? r.x1 : r.x2,
                '" cy="',
                s ? r.y1 : r.y2,
                '" r="',
                s ? r.r1 : r.r2,
                '" fx="',
                s ? r.x2 : r.x1,
                '" fy="',
                s ? r.y2 : r.y1,
                '">\n',
              ]),
          'radial' === this.type)
        ) {
          if (s)
            for ((n = n.concat()).reverse(), f = 0, d = n.length; f < d; f++)
              n[f].offset = 1 - n[f].offset
          a = Math.min(r.r1, r.r2)
          if (0 < a)
            for (
              var u = a / Math.max(r.r1, r.r2), f = 0, d = n.length;
              f < d;
              f++
            )
              n[f].offset += u * (1 - n[f].offset)
        }
        for (f = 0, d = n.length; f < d; f++) {
          var g = n[f]
          i.push(
            '<stop ',
            'offset="',
            100 * g.offset + '%',
            '" style="stop-color:',
            g.color,
            void 0 !== g.opacity ? ';stop-opacity: ' + g.opacity : ';',
            '"/>\n'
          )
        }
        return (
          i.push(
            'linear' === this.type
              ? '</linearGradient>\n'
              : '</radialGradient>\n'
          ),
          i.join('')
        )
      },
      toLive: function (t) {
        var e,
          i,
          r,
          n = fabric.util.object.clone(this.coords)
        if (this.type) {
          for (
            'linear' === this.type
              ? (e = t.createLinearGradient(n.x1, n.y1, n.x2, n.y2))
              : 'radial' === this.type &&
                (e = t.createRadialGradient(
                  n.x1,
                  n.y1,
                  n.r1,
                  n.x2,
                  n.y2,
                  n.r2
                )),
              i = 0,
              r = this.colorStops.length;
            i < r;
            i++
          ) {
            var s = this.colorStops[i].color,
              o = this.colorStops[i].opacity,
              a = this.colorStops[i].offset
            void 0 !== o && (s = new fabric.Color(s).setAlpha(o).toRgba()),
              e.addColorStop(a, s)
          }
          return e
        }
      },
    })),
      fabric.util.object.extend(fabric.Gradient, {
        fromElement: function (t, e, i, r) {
          for (
            var n,
              s,
              o,
              a,
              c,
              h,
              l,
              u =
                (u = parseFloat(i) / (/%$/.test(i) ? 100 : 1)) < 0
                  ? 0
                  : 1 < u
                  ? 1
                  : u,
              f = (isNaN(u) && (u = 1), t.getElementsByTagName('stop')),
              i =
                'userSpaceOnUse' === t.getAttribute('gradientUnits')
                  ? 'pixels'
                  : 'percentage',
              d = t.getAttribute('gradientTransform') || '',
              g = [],
              p = 0,
              m = 0,
              v =
                'linearGradient' === t.nodeName ||
                'LINEARGRADIENT' === t.nodeName
                  ? ((n = 'linear'),
                    {
                      x1: (s = t).getAttribute('x1') || 0,
                      y1: s.getAttribute('y1') || 0,
                      x2: s.getAttribute('x2') || '100%',
                      y2: s.getAttribute('y2') || 0,
                    })
                  : ((n = 'radial'),
                    {
                      x1:
                        (s = t).getAttribute('fx') ||
                        s.getAttribute('cx') ||
                        '50%',
                      y1: s.getAttribute('fy') || s.getAttribute('cy') || '50%',
                      r1: 0,
                      x2: s.getAttribute('cx') || '50%',
                      y2: s.getAttribute('cy') || '50%',
                      r2: s.getAttribute('r') || '50%',
                    }),
              b = f.length;
            b--;

          )
            g.push(
              (function (t, e) {
                var i,
                  r,
                  n,
                  s = t.getAttribute('style'),
                  o = t.getAttribute('offset') || 0
                if (
                  ((o =
                    (o = parseFloat(o) / (/%$/.test(o) ? 100 : 1)) < 0
                      ? 0
                      : 1 < o
                      ? 1
                      : o),
                  s)
                ) {
                  var a = s.split(/\s*;\s*/)
                  for ('' === a[a.length - 1] && a.pop(), n = a.length; n--; ) {
                    var c = a[n].split(/\s*:\s*/),
                      h = c[0].trim(),
                      c = c[1].trim()
                    'stop-color' === h
                      ? (i = c)
                      : 'stop-opacity' === h && (r = c)
                  }
                }
                return (
                  (i = i || t.getAttribute('stop-color') || 'rgb(0,0,0)'),
                  (r = r || t.getAttribute('stop-opacity')),
                  (s = (i = new fabric.Color(i)).getAlpha()),
                  (r = isNaN(parseFloat(r)) ? 1 : parseFloat(r)),
                  (r *= s * e),
                  { offset: o, color: i.toRgb(), opacity: r }
                )
              })(f[b], u)
            )
          return (
            (d = fabric.parseTransformAttribute(d)),
            (o = v),
            (a = r),
            (c = i),
            Object.keys(o).forEach(function (t) {
              'Infinity' === (h = o[t])
                ? (l = 1)
                : '-Infinity' === h
                ? (l = 0)
                : ((l = parseFloat(o[t], 10)),
                  'string' == typeof h &&
                    /^(\d+\.\d+)%|(\d+)%$/.test(h) &&
                    ((l *= 0.01),
                    'pixels' === c &&
                      (('x1' !== t && 'x2' !== t && 'r2' !== t) ||
                        (l *= a.viewBoxWidth || a.width),
                      ('y1' !== t && 'y2' !== t) ||
                        (l *= a.viewBoxHeight || a.height)))),
                (o[t] = l)
            }),
            'pixels' == i && ((p = -e.left), (m = -e.top)),
            new fabric.Gradient({
              id: t.getAttribute('id'),
              type: n,
              coords: v,
              colorStops: g,
              gradientUnits: i,
              gradientTransform: d,
              offsetX: p,
              offsetY: m,
            })
          )
        },
      })
  })(),
  (function () {
    'use strict'
    var r = fabric.util.toFixed
    fabric.Pattern = fabric.util.createClass({
      repeat: 'repeat',
      offsetX: 0,
      offsetY: 0,
      crossOrigin: '',
      patternTransform: null,
      initialize: function (t, i) {
        var r
        ;(t = t || {}),
          (this.id = fabric.Object.__uid++),
          this.setOptions(t),
          !t.source || (t.source && 'string' != typeof t.source)
            ? i && i(this)
            : (((r = this).source = fabric.util.createImage()),
              fabric.util.loadImage(
                t.source,
                function (t, e) {
                  ;(r.source = t), i && i(r, e)
                },
                null,
                this.crossOrigin
              ))
      },
      toObject: function (t) {
        var e,
          i = fabric.Object.NUM_FRACTION_DIGITS
        return (
          'string' == typeof this.source.src
            ? (e = this.source.src)
            : 'object' == typeof this.source &&
              this.source.toDataURL &&
              (e = this.source.toDataURL()),
          (e = {
            type: 'pattern',
            source: e,
            repeat: this.repeat,
            crossOrigin: this.crossOrigin,
            offsetX: r(this.offsetX, i),
            offsetY: r(this.offsetY, i),
            patternTransform: this.patternTransform
              ? this.patternTransform.concat()
              : null,
          }),
          fabric.util.populateWithProperties(this, e, t),
          e
        )
      },
      toSVG: function (t) {
        var e = 'function' == typeof this.source ? this.source() : this.source,
          i = e.width / t.width,
          r = e.height / t.height,
          n = this.offsetX / t.width,
          t = this.offsetY / t.height,
          s = ''
        return (
          ('repeat-x' !== this.repeat && 'no-repeat' !== this.repeat) ||
            ((r = 1), t && (r += Math.abs(t))),
          ('repeat-y' !== this.repeat && 'no-repeat' !== this.repeat) ||
            ((i = 1), n && (i += Math.abs(n))),
          e.src ? (s = e.src) : e.toDataURL && (s = e.toDataURL()),
          '<pattern id="SVGID_' +
            this.id +
            '" x="' +
            n +
            '" y="' +
            t +
            '" width="' +
            i +
            '" height="' +
            r +
            '">\n<image x="0" y="0" width="' +
            e.width +
            '" height="' +
            e.height +
            '" xlink:href="' +
            s +
            '"></image>\n</pattern>\n'
        )
      },
      setOptions: function (t) {
        for (var e in t) this[e] = t[e]
      },
      toLive: function (t) {
        var e = this.source
        if (!e) return ''
        if (void 0 !== e.src) {
          if (!e.complete) return ''
          if (0 === e.naturalWidth || 0 === e.naturalHeight) return ''
        }
        return t.createPattern(e, this.repeat)
      },
    })
  })(),
  (function (t) {
    'use strict'
    var o = t.fabric || (t.fabric = {}),
      a = o.util.toFixed
    o.Shadow
      ? o.warn('fabric.Shadow is already defined.')
      : ((o.Shadow = o.util.createClass({
          color: 'rgb(0,0,0)',
          blur: 0,
          offsetX: 0,
          offsetY: 0,
          affectStroke: !1,
          includeDefaultValues: !0,
          nonScaling: !1,
          initialize: function (t) {
            for (var e in (t = 'string' == typeof t ? this._parseShadow(t) : t))
              this[e] = t[e]
            this.id = o.Object.__uid++
          },
          _parseShadow: function (t) {
            var t = t.trim(),
              e = o.Shadow.reOffsetsAndBlur.exec(t) || []
            return {
              color: (
                t.replace(o.Shadow.reOffsetsAndBlur, '') || 'rgb(0,0,0)'
              ).trim(),
              offsetX: parseFloat(e[1], 10) || 0,
              offsetY: parseFloat(e[2], 10) || 0,
              blur: parseFloat(e[3], 10) || 0,
            }
          },
          toString: function () {
            return [this.offsetX, this.offsetY, this.blur, this.color].join(
              'px '
            )
          },
          toSVG: function (t) {
            var e = 40,
              i = 40,
              r = o.Object.NUM_FRACTION_DIGITS,
              n = o.util.rotateVector(
                { x: this.offsetX, y: this.offsetY },
                o.util.degreesToRadians(-t.angle)
              ),
              s = new o.Color(this.color)
            return (
              t.width &&
                t.height &&
                ((e = 100 * a((Math.abs(n.x) + this.blur) / t.width, r) + 20),
                (i = 100 * a((Math.abs(n.y) + this.blur) / t.height, r) + 20)),
              t.flipX && (n.x *= -1),
              t.flipY && (n.y *= -1),
              '<filter id="SVGID_' +
                this.id +
                '" y="-' +
                i +
                '%" height="' +
                (100 + 2 * i) +
                '%" x="-' +
                e +
                '%" width="' +
                (100 + 2 * e) +
                '%" >\n\t<feGaussianBlur in="SourceAlpha" stdDeviation="' +
                a(this.blur ? this.blur / 2 : 0, r) +
                '"></feGaussianBlur>\n\t<feOffset dx="' +
                a(n.x, r) +
                '" dy="' +
                a(n.y, r) +
                '" result="oBlur" ></feOffset>\n\t<feFlood flood-color="' +
                s.toRgb() +
                '" flood-opacity="' +
                s.getAlpha() +
                '"/>\n\t<feComposite in2="oBlur" operator="in" />\n\t<feMerge>\n\t\t<feMergeNode></feMergeNode>\n\t\t<feMergeNode in="SourceGraphic"></feMergeNode>\n\t</feMerge>\n</filter>\n'
            )
          },
          toObject: function () {
            if (this.includeDefaultValues)
              return {
                color: this.color,
                blur: this.blur,
                offsetX: this.offsetX,
                offsetY: this.offsetY,
                affectStroke: this.affectStroke,
                nonScaling: this.nonScaling,
              }
            var e = {},
              i = o.Shadow.prototype
            return (
              [
                'color',
                'blur',
                'offsetX',
                'offsetY',
                'affectStroke',
                'nonScaling',
              ].forEach(function (t) {
                this[t] !== i[t] && (e[t] = this[t])
              }, this),
              e
            )
          },
        })),
        (o.Shadow.reOffsetsAndBlur =
          /(?:\s|^)(-?\d+(?:\.\d*)?(?:px)?(?:\s?|$))?(-?\d+(?:\.\d*)?(?:px)?(?:\s?|$))?(\d+(?:\.\d*)?(?:px)?)?(?:\s?|$)(?:$|\s)/))
  })('undefined' != typeof exports ? exports : this),
  (function () {
    'use strict'
    var n, t, h, a, s, o, i, r, e
    fabric.StaticCanvas
      ? fabric.warn('fabric.StaticCanvas is already defined.')
      : ((n = fabric.util.object.extend),
        (t = fabric.util.getElementOffset),
        (h = fabric.util.removeFromArray),
        (a = fabric.util.toFixed),
        (s = fabric.util.transformPoint),
        (o = fabric.util.invertTransform),
        (i = fabric.util.getNodeCanvas),
        (r = fabric.util.createCanvasElement),
        (e = new Error('Could not initialize `canvas` element')),
        (fabric.StaticCanvas = fabric.util.createClass(fabric.CommonMethods, {
          initialize: function (t, e) {
            ;(e = e || {}),
              (this.renderAndResetBound = this.renderAndReset.bind(this)),
              (this.requestRenderAllBound = this.requestRenderAll.bind(this)),
              this._initStatic(t, e)
          },
          backgroundColor: '',
          backgroundImage: null,
          overlayColor: '',
          overlayImage: null,
          includeDefaultValues: !0,
          stateful: !1,
          renderOnAddRemove: !0,
          controlsAboveOverlay: !1,
          allowTouchScrolling: !1,
          imageSmoothingEnabled: !0,
          viewportTransform: fabric.iMatrix.concat(),
          backgroundVpt: !0,
          overlayVpt: !0,
          enableRetinaScaling: !0,
          vptCoords: {},
          skipOffscreen: !0,
          clipPath: void 0,
          _initStatic: function (t, e) {
            var i = this.requestRenderAllBound
            ;(this._objects = []),
              this._createLowerCanvas(t),
              this._initOptions(e),
              this.interactive || this._initRetinaScaling(),
              e.overlayImage && this.setOverlayImage(e.overlayImage, i),
              e.backgroundImage &&
                this.setBackgroundImage(e.backgroundImage, i),
              e.backgroundColor &&
                this.setBackgroundColor(e.backgroundColor, i),
              e.overlayColor && this.setOverlayColor(e.overlayColor, i),
              this.calcOffset()
          },
          _isRetinaScaling: function () {
            return 1 < fabric.devicePixelRatio && this.enableRetinaScaling
          },
          getRetinaScaling: function () {
            return this._isRetinaScaling()
              ? Math.max(1, fabric.devicePixelRatio)
              : 1
          },
          _initRetinaScaling: function () {
            var t
            this._isRetinaScaling() &&
              ((t = fabric.devicePixelRatio),
              this.__initRetinaScaling(
                t,
                this.lowerCanvasEl,
                this.contextContainer
              ),
              this.upperCanvasEl &&
                this.__initRetinaScaling(
                  t,
                  this.upperCanvasEl,
                  this.contextTop
                ))
          },
          __initRetinaScaling: function (t, e, i) {
            e.setAttribute('width', this.width * t),
              e.setAttribute('height', this.height * t),
              i.scale(t, t)
          },
          calcOffset: function () {
            return (this._offset = t(this.lowerCanvasEl)), this
          },
          setOverlayImage: function (t, e, i) {
            return this.__setBgOverlayImage('overlayImage', t, e, i)
          },
          setBackgroundImage: function (t, e, i) {
            return this.__setBgOverlayImage('backgroundImage', t, e, i)
          },
          setOverlayColor: function (t, e) {
            return this.__setBgOverlayColor('overlayColor', t, e)
          },
          setBackgroundColor: function (t, e) {
            return this.__setBgOverlayColor('backgroundColor', t, e)
          },
          __setBgOverlayImage: function (r, t, n, s) {
            return (
              'string' == typeof t
                ? fabric.util.loadImage(
                    t,
                    function (t, e) {
                      var i
                      t &&
                        ((i = new fabric.Image(t, s)),
                        ((this[r] = i).canvas = this)),
                        n && n(t, e)
                    },
                    this,
                    s && s.crossOrigin
                  )
                : (s && t.setOptions(s),
                  (this[r] = t) && (t.canvas = this),
                  n && n(t, !1)),
              this
            )
          },
          __setBgOverlayColor: function (t, e, i) {
            return (
              (this[t] = e),
              this._initGradient(e, t),
              this._initPattern(e, t, i),
              this
            )
          },
          _createCanvasElement: function () {
            var t = r()
            if (!t) throw e
            if ((t.style || (t.style = {}), void 0 === t.getContext)) throw e
            return t
          },
          _initOptions: function (t) {
            var e = this.lowerCanvasEl
            this._setOptions(t),
              (this.width = this.width || parseInt(e.width, 10) || 0),
              (this.height = this.height || parseInt(e.height, 10) || 0),
              this.lowerCanvasEl.style &&
                ((e.width = this.width),
                (e.height = this.height),
                (e.style.width = this.width + 'px'),
                (e.style.height = this.height + 'px'),
                (this.viewportTransform = this.viewportTransform.slice()))
          },
          _createLowerCanvas: function (t) {
            t && t.getContext
              ? (this.lowerCanvasEl = t)
              : (this.lowerCanvasEl =
                  fabric.util.getById(t) || this._createCanvasElement()),
              fabric.util.addClass(this.lowerCanvasEl, 'lower-canvas'),
              (this._originalCanvasStyle = this.lowerCanvasEl.style),
              this.interactive && this._applyCanvasStyle(this.lowerCanvasEl),
              (this.contextContainer = this.lowerCanvasEl.getContext('2d'))
          },
          getWidth: function () {
            return this.width
          },
          getHeight: function () {
            return this.height
          },
          setWidth: function (t, e) {
            return this.setDimensions({ width: t }, e)
          },
          setHeight: function (t, e) {
            return this.setDimensions({ height: t }, e)
          },
          setDimensions: function (t, e) {
            var i, r
            for (r in ((e = e || {}), t))
              (i = t[r]),
                e.cssOnly ||
                  (this._setBackstoreDimension(r, t[r]),
                  (i += 'px'),
                  (this.hasLostContext = !0)),
                e.backstoreOnly || this._setCssDimension(r, i)
            return (
              this._isCurrentlyDrawing &&
                this.freeDrawingBrush &&
                this.freeDrawingBrush._setBrushStyles(this.contextTop),
              this._initRetinaScaling(),
              this.calcOffset(),
              e.cssOnly || this.requestRenderAll(),
              this
            )
          },
          _setBackstoreDimension: function (t, e) {
            return (
              (this.lowerCanvasEl[t] = e),
              this.upperCanvasEl && (this.upperCanvasEl[t] = e),
              this.cacheCanvasEl && (this.cacheCanvasEl[t] = e),
              (this[t] = e),
              this
            )
          },
          _setCssDimension: function (t, e) {
            return (
              (this.lowerCanvasEl.style[t] = e),
              this.upperCanvasEl && (this.upperCanvasEl.style[t] = e),
              this.wrapperEl && (this.wrapperEl.style[t] = e),
              this
            )
          },
          getZoom: function () {
            return this.viewportTransform[0]
          },
          setViewportTransform: function (t) {
            var e,
              i,
              r,
              n = this._activeObject,
              s = this.backgroundImage,
              o = this.overlayImage
            for (
              this.viewportTransform = t, i = 0, r = this._objects.length;
              i < r;
              i++
            )
              (e = this._objects[i]).group || e.setCoords(!0)
            return (
              n && n.setCoords(),
              s && s.setCoords(!0),
              o && o.setCoords(!0),
              this.calcViewportBoundaries(),
              this.renderOnAddRemove && this.requestRenderAll(),
              this
            )
          },
          zoomToPoint: function (t, e) {
            var i = t,
              r = this.viewportTransform.slice(0),
              e =
                ((t = s(t, o(this.viewportTransform))),
                (r[0] = e),
                (r[3] = e),
                s(t, r))
            return (
              (r[4] += i.x - e.x),
              (r[5] += i.y - e.y),
              this.setViewportTransform(r)
            )
          },
          setZoom: function (t) {
            return this.zoomToPoint(new fabric.Point(0, 0), t), this
          },
          absolutePan: function (t) {
            var e = this.viewportTransform.slice(0)
            return (e[4] = -t.x), (e[5] = -t.y), this.setViewportTransform(e)
          },
          relativePan: function (t) {
            return this.absolutePan(
              new fabric.Point(
                -t.x - this.viewportTransform[4],
                -t.y - this.viewportTransform[5]
              )
            )
          },
          getElement: function () {
            return this.lowerCanvasEl
          },
          _onObjectAdded: function (t) {
            this.stateful && t.setupState(),
              t._set('canvas', this),
              t.setCoords(),
              this.fire('object:added', { target: t }),
              t.fire('added')
          },
          _onObjectRemoved: function (t) {
            this.fire('object:removed', { target: t }),
              t.fire('removed'),
              delete t.canvas
          },
          clearContext: function (t) {
            return t.clearRect(0, 0, this.width, this.height), this
          },
          getContext: function () {
            return this.contextContainer
          },
          clear: function () {
            return (
              this.remove.apply(this, this.getObjects()),
              (this.backgroundImage = null),
              (this.overlayImage = null),
              (this.backgroundColor = ''),
              (this.overlayColor = ''),
              this._hasITextHandlers &&
                (this.off('mouse:up', this._mouseUpITextHandler),
                (this._iTextInstances = null),
                (this._hasITextHandlers = !1)),
              this.clearContext(this.contextContainer),
              this.fire('canvas:cleared'),
              this.renderOnAddRemove && this.requestRenderAll(),
              this
            )
          },
          renderAll: function () {
            var t = this.contextContainer
            return this.renderCanvas(t, this._objects), this
          },
          renderAndReset: function () {
            ;(this.isRendering = 0), this.renderAll()
          },
          requestRenderAll: function () {
            return (
              this.isRendering ||
                (this.isRendering = fabric.util.requestAnimFrame(
                  this.renderAndResetBound
                )),
              this
            )
          },
          calcViewportBoundaries: function () {
            var t = {},
              e = this.width,
              i = this.height,
              r = o(this.viewportTransform)
            return (
              (t.tl = s({ x: 0, y: 0 }, r)),
              (t.br = s({ x: e, y: i }, r)),
              (t.tr = new fabric.Point(t.br.x, t.tl.y)),
              (t.bl = new fabric.Point(t.tl.x, t.br.y)),
              (this.vptCoords = t)
            )
          },
          cancelRequestedRender: function () {
            this.isRendering &&
              (fabric.util.cancelAnimFrame(this.isRendering),
              (this.isRendering = 0))
          },
          renderCanvas: function (t, e) {
            var i = this.viewportTransform,
              r = this.clipPath
            this.cancelRequestedRender(),
              this.calcViewportBoundaries(),
              this.clearContext(t),
              fabric.util.setImageSmoothing(t, this.imageSmoothingEnabled),
              this.fire('before:render', { ctx: t }),
              this._renderBackground(t),
              t.save(),
              t.transform(i[0], i[1], i[2], i[3], i[4], i[5]),
              this._renderObjects(t, e),
              t.restore(),
              !this.controlsAboveOverlay &&
                this.interactive &&
                this.drawControls(t),
              r &&
                ((r.canvas = this),
                r.shouldCache(),
                (r._transformDone = !0),
                r.renderCache({ forClipping: !0 }),
                this.drawClipPathOnCanvas(t)),
              this._renderOverlay(t),
              this.controlsAboveOverlay &&
                this.interactive &&
                this.drawControls(t),
              this.fire('after:render', { ctx: t })
          },
          drawClipPathOnCanvas: function (t) {
            var e = this.viewportTransform,
              i = this.clipPath
            t.save(),
              t.transform(e[0], e[1], e[2], e[3], e[4], e[5]),
              (t.globalCompositeOperation = 'destination-in'),
              i.transform(t),
              t.scale(1 / i.zoomX, 1 / i.zoomY),
              t.drawImage(
                i._cacheCanvas,
                -i.cacheTranslationX,
                -i.cacheTranslationY
              ),
              t.restore()
          },
          _renderObjects: function (t, e) {
            for (var i = 0, r = e.length; i < r; ++i) e[i] && e[i].render(t)
          },
          _renderBackgroundOrOverlay: function (t, e) {
            var i = this[e + 'Color'],
              r = this[e + 'Image'],
              n = this.viewportTransform,
              e = this[e + 'Vpt']
            ;(i || r) &&
              (i &&
                (t.save(),
                t.beginPath(),
                t.moveTo(0, 0),
                t.lineTo(this.width, 0),
                t.lineTo(this.width, this.height),
                t.lineTo(0, this.height),
                t.closePath(),
                (t.fillStyle = i.toLive ? i.toLive(t, this) : i),
                e && t.transform(n[0], n[1], n[2], n[3], n[4], n[5]),
                t.transform(1, 0, 0, 1, i.offsetX || 0, i.offsetY || 0),
                (i = i.gradientTransform || i.patternTransform) &&
                  t.transform(i[0], i[1], i[2], i[3], i[4], i[5]),
                t.fill(),
                t.restore()),
              r &&
                (t.save(),
                e && t.transform(n[0], n[1], n[2], n[3], n[4], n[5]),
                r.render(t),
                t.restore()))
          },
          _renderBackground: function (t) {
            this._renderBackgroundOrOverlay(t, 'background')
          },
          _renderOverlay: function (t) {
            this._renderBackgroundOrOverlay(t, 'overlay')
          },
          getCenter: function () {
            return { top: this.height / 2, left: this.width / 2 }
          },
          getCenterPoint: function () {
            return new fabric.Point(this.width / 2, this.height / 2)
          },
          centerObjectH: function (t) {
            return this._centerObject(
              t,
              new fabric.Point(this.getCenterPoint().x, t.getCenterPoint().y)
            )
          },
          centerObjectV: function (t) {
            return this._centerObject(
              t,
              new fabric.Point(t.getCenterPoint().x, this.getCenterPoint().y)
            )
          },
          centerObject: function (t) {
            var e = this.getCenterPoint()
            return this._centerObject(t, e)
          },
          viewportCenterObject: function (t) {
            var e = this.getVpCenter()
            return this._centerObject(t, e)
          },
          viewportCenterObjectH: function (t) {
            var e = this.getVpCenter()
            return (
              this._centerObject(
                t,
                new fabric.Point(e.x, t.getCenterPoint().y)
              ),
              this
            )
          },
          viewportCenterObjectV: function (t) {
            var e = this.getVpCenter()
            return this._centerObject(
              t,
              new fabric.Point(t.getCenterPoint().x, e.y)
            )
          },
          getVpCenter: function () {
            var t = this.getCenterPoint(),
              e = o(this.viewportTransform)
            return s(t, e)
          },
          _centerObject: function (t, e) {
            return (
              t.setPositionByOrigin(e, 'center', 'center'),
              t.setCoords(),
              this.renderOnAddRemove && this.requestRenderAll(),
              this
            )
          },
          toDatalessJSON: function (t) {
            return this.toDatalessObject(t)
          },
          toObject: function (t) {
            return this._toObjectMethod('toObject', t)
          },
          toDatalessObject: function (t) {
            return this._toObjectMethod('toDatalessObject', t)
          },
          _toObjectMethod: function (t, e) {
            var i = this.clipPath,
              r = { version: fabric.version, objects: this._toObjects(t, e) }
            return (
              i &&
                !i.excludeFromExport &&
                (r.clipPath = this._toObject(this.clipPath, t, e)),
              n(r, this.__serializeBgOverlay(t, e)),
              fabric.util.populateWithProperties(this, r, e),
              r
            )
          },
          _toObjects: function (e, i) {
            return this._objects
              .filter(function (t) {
                return !t.excludeFromExport
              })
              .map(function (t) {
                return this._toObject(t, e, i)
              }, this)
          },
          _toObject: function (t, e, i) {
            this.includeDefaultValues ||
              ((r = t.includeDefaultValues), (t.includeDefaultValues = !1))
            var r,
              e = t[e](i)
            return this.includeDefaultValues || (t.includeDefaultValues = r), e
          },
          __serializeBgOverlay: function (t, e) {
            var i = {},
              r = this.backgroundImage,
              n = this.overlayImage,
              s = this.backgroundColor,
              o = this.overlayColor
            return (
              s && s.toObject
                ? s.excludeFromExport || (i.background = s.toObject(e))
                : s && (i.background = s),
              o && o.toObject
                ? o.excludeFromExport || (i.overlay = o.toObject(e))
                : o && (i.overlay = o),
              r &&
                !r.excludeFromExport &&
                (i.backgroundImage = this._toObject(r, t, e)),
              n &&
                !n.excludeFromExport &&
                (i.overlayImage = this._toObject(n, t, e)),
              i
            )
          },
          svgViewportTransformation: !0,
          toSVG: function (t, e) {
            ;(t = t || {}).reviver = e
            var i = []
            return (
              this._setSVGPreamble(i, t),
              this._setSVGHeader(i, t),
              this.clipPath &&
                i.push(
                  '<g clip-path="url(#' + this.clipPath.clipPathId + ')" >\n'
                ),
              this._setSVGBgOverlayColor(i, 'background'),
              this._setSVGBgOverlayImage(i, 'backgroundImage', e),
              this._setSVGObjects(i, e),
              this.clipPath && i.push('</g>\n'),
              this._setSVGBgOverlayColor(i, 'overlay'),
              this._setSVGBgOverlayImage(i, 'overlayImage', e),
              i.push('</svg>'),
              i.join('')
            )
          },
          _setSVGPreamble: function (t, e) {
            e.suppressPreamble ||
              t.push(
                '<?xml version="1.0" encoding="',
                e.encoding || 'UTF-8',
                '" standalone="no" ?>\n',
                '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" ',
                '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n'
              )
          },
          _setSVGHeader: function (t, e) {
            var i,
              r = e.width || this.width,
              n = e.height || this.height,
              s = 'viewBox="0 0 ' + this.width + ' ' + this.height + '" ',
              o = fabric.Object.NUM_FRACTION_DIGITS
            e.viewBox
              ? (s =
                  'viewBox="' +
                  e.viewBox.x +
                  ' ' +
                  e.viewBox.y +
                  ' ' +
                  e.viewBox.width +
                  ' ' +
                  e.viewBox.height +
                  '" ')
              : this.svgViewportTransformation &&
                ((i = this.viewportTransform),
                (s =
                  'viewBox="' +
                  a(-i[4] / i[0], o) +
                  ' ' +
                  a(-i[5] / i[3], o) +
                  ' ' +
                  a(this.width / i[0], o) +
                  ' ' +
                  a(this.height / i[3], o) +
                  '" ')),
              t.push(
                '<svg ',
                'xmlns="http://www.w3.org/2000/svg" ',
                'xmlns:xlink="http://www.w3.org/1999/xlink" ',
                'version="1.1" ',
                'width="',
                r,
                '" ',
                'height="',
                n,
                '" ',
                s,
                'xml:space="preserve">\n',
                '<desc>Created with Fabric.js ',
                fabric.version,
                '</desc>\n',
                '<defs>\n',
                this.createSVGFontFacesMarkup(),
                this.createSVGRefElementsMarkup(),
                this.createSVGClipPathMarkup(e),
                '</defs>\n'
              )
          },
          createSVGClipPathMarkup: function (t) {
            var e = this.clipPath
            return e
              ? ((e.clipPathId = 'CLIPPATH_' + fabric.Object.__uid++),
                '<clipPath id="' +
                  e.clipPathId +
                  '" >\n' +
                  this.clipPath.toClipPathSVG(t.reviver) +
                  '</clipPath>\n')
              : ''
          },
          createSVGRefElementsMarkup: function () {
            var n = this
            return ['background', 'overlay']
              .map(function (t) {
                var e,
                  i,
                  r = n[t + 'Color']
                if (r && r.toLive)
                  return (
                    (t = n[t + 'Vpt']),
                    (e = n.viewportTransform),
                    (i = {
                      width: n.width / (t ? e[0] : 1),
                      height: n.height / (t ? e[3] : 1),
                    }),
                    r.toSVG(i, {
                      additionalTransform: t ? fabric.util.matrixToSVG(e) : '',
                    })
                  )
              })
              .join('')
          },
          createSVGFontFacesMarkup: function () {
            var t,
              e,
              i,
              r,
              n,
              s,
              o,
              a,
              c,
              h = '',
              l = {},
              u = fabric.fontPaths,
              f = []
            for (
              this._objects.forEach(function t(e) {
                f.push(e), e._objects && e._objects.forEach(t)
              }),
                o = 0,
                a = f.length;
              o < a;
              o++
            )
              if (
                ((e = (t = f[o]).fontFamily),
                -1 !== t.type.indexOf('text') &&
                  !l[e] &&
                  u[e] &&
                  ((l[e] = !0), t.styles))
              )
                for (n in (i = t.styles))
                  for (s in (r = i[n]))
                    !l[(e = r[s].fontFamily)] && u[e] && (l[e] = !0)
            for (c in l)
              h += [
                '\t\t@font-face {\n',
                "\t\t\tfont-family: '",
                c,
                "';\n",
                "\t\t\tsrc: url('",
                u[c],
                "');\n",
                '\t\t}\n',
              ].join('')
            return (h =
              h &&
              [
                '\t<style type="text/css">',
                '<![CDATA[\n',
                h,
                ']]>',
                '</style>\n',
              ].join(''))
          },
          _setSVGObjects: function (t, e) {
            for (var i, r = this._objects, n = 0, s = r.length; n < s; n++)
              (i = r[n]).excludeFromExport || this._setSVGObject(t, i, e)
          },
          _setSVGObject: function (t, e, i) {
            t.push(e.toSVG(i))
          },
          _setSVGBgOverlayImage: function (t, e, i) {
            this[e] &&
              !this[e].excludeFromExport &&
              this[e].toSVG &&
              t.push(this[e].toSVG(i))
          },
          _setSVGBgOverlayColor: function (t, e) {
            var i,
              r = this[e + 'Color'],
              n = this.viewportTransform,
              s = this.width,
              o = this.height
            r &&
              (r.toLive
                ? ((i = r.repeat),
                  (n = fabric.util.invertTransform(n)),
                  (e = this[e + 'Vpt'] ? fabric.util.matrixToSVG(n) : ''),
                  t.push(
                    '<rect transform="' + e + ' translate(',
                    s / 2,
                    ',',
                    o / 2,
                    ')"',
                    ' x="',
                    r.offsetX - s / 2,
                    '" y="',
                    r.offsetY - o / 2,
                    '" ',
                    'width="',
                    'repeat-y' === i || 'no-repeat' === i ? r.source.width : s,
                    '" height="',
                    'repeat-x' === i || 'no-repeat' === i ? r.source.height : o,
                    '" fill="url(#SVGID_' + r.id + ')"',
                    '></rect>\n'
                  ))
                : t.push(
                    '<rect x="0" y="0" width="100%" height="100%" ',
                    'fill="',
                    r,
                    '"',
                    '></rect>\n'
                  ))
          },
          sendToBack: function (t) {
            if (!t) return this
            var e,
              i,
              r,
              n = this._activeObject
            if (t === n && 'activeSelection' === t.type)
              for (e = (r = n._objects).length; e--; )
                (i = r[e]), h(this._objects, i), this._objects.unshift(i)
            else h(this._objects, t), this._objects.unshift(t)
            return this.renderOnAddRemove && this.requestRenderAll(), this
          },
          bringToFront: function (t) {
            if (!t) return this
            var e,
              i,
              r,
              n = this._activeObject
            if (t === n && 'activeSelection' === t.type)
              for (r = n._objects, e = 0; e < r.length; e++)
                (i = r[e]), h(this._objects, i), this._objects.push(i)
            else h(this._objects, t), this._objects.push(t)
            return this.renderOnAddRemove && this.requestRenderAll(), this
          },
          sendBackwards: function (t, e) {
            if (!t) return this
            var i,
              r,
              n,
              s,
              o,
              a = this._activeObject,
              c = 0
            if (t === a && 'activeSelection' === t.type)
              for (o = a._objects, i = 0; i < o.length; i++)
                (r = o[i]),
                  0 + c < (n = this._objects.indexOf(r)) &&
                    ((s = n - 1),
                    h(this._objects, r),
                    this._objects.splice(s, 0, r)),
                  c++
            else
              0 !== (n = this._objects.indexOf(t)) &&
                ((s = this._findNewLowerIndex(t, n, e)),
                h(this._objects, t),
                this._objects.splice(s, 0, t))
            return this.renderOnAddRemove && this.requestRenderAll(), this
          },
          _findNewLowerIndex: function (t, e, i) {
            var r, n
            if (i) {
              for (n = (r = e) - 1; 0 <= n; --n)
                if (
                  t.intersectsWithObject(this._objects[n]) ||
                  t.isContainedWithinObject(this._objects[n]) ||
                  this._objects[n].isContainedWithinObject(t)
                ) {
                  r = n
                  break
                }
            } else r = e - 1
            return r
          },
          bringForward: function (t, e) {
            if (!t) return this
            var i,
              r,
              n,
              s,
              o,
              a = this._activeObject,
              c = 0
            if (t === a && 'activeSelection' === t.type)
              for (i = (o = a._objects).length; i--; )
                (r = o[i]),
                  (n = this._objects.indexOf(r)) <
                    this._objects.length - 1 - c &&
                    ((s = n + 1),
                    h(this._objects, r),
                    this._objects.splice(s, 0, r)),
                  c++
            else
              (n = this._objects.indexOf(t)) !== this._objects.length - 1 &&
                ((s = this._findNewUpperIndex(t, n, e)),
                h(this._objects, t),
                this._objects.splice(s, 0, t))
            return this.renderOnAddRemove && this.requestRenderAll(), this
          },
          _findNewUpperIndex: function (t, e, i) {
            var r, n, s
            if (i) {
              for (n = (r = e) + 1, s = this._objects.length; n < s; ++n)
                if (
                  t.intersectsWithObject(this._objects[n]) ||
                  t.isContainedWithinObject(this._objects[n]) ||
                  this._objects[n].isContainedWithinObject(t)
                ) {
                  r = n
                  break
                }
            } else r = e + 1
            return r
          },
          moveTo: function (t, e) {
            return (
              h(this._objects, t),
              this._objects.splice(e, 0, t),
              this.renderOnAddRemove && this.requestRenderAll()
            )
          },
          dispose: function () {
            return (
              this.isRendering &&
                (fabric.util.cancelAnimFrame(this.isRendering),
                (this.isRendering = 0)),
              this.forEachObject(function (t) {
                t.dispose && t.dispose()
              }),
              (this._objects = []),
              this.backgroundImage &&
                this.backgroundImage.dispose &&
                this.backgroundImage.dispose(),
              (this.backgroundImage = null),
              this.overlayImage &&
                this.overlayImage.dispose &&
                this.overlayImage.dispose(),
              (this.overlayImage = null),
              (this._iTextInstances = null),
              (this.contextContainer = null),
              this.lowerCanvasEl.classList.remove('lower-canvas'),
              fabric.util.setStyle(
                this.lowerCanvasEl,
                this._originalCanvasStyle
              ),
              delete this._originalCanvasStyle,
              this.lowerCanvasEl.setAttribute('width', this.width),
              this.lowerCanvasEl.setAttribute('height', this.height),
              fabric.util.cleanUpJsdomNode(this.lowerCanvasEl),
              (this.lowerCanvasEl = void 0),
              this
            )
          },
          toString: function () {
            return (
              '#<fabric.Canvas (' +
              this.complexity() +
              '): { objects: ' +
              this._objects.length +
              ' }>'
            )
          },
        })),
        n(fabric.StaticCanvas.prototype, fabric.Observable),
        n(fabric.StaticCanvas.prototype, fabric.Collection),
        n(fabric.StaticCanvas.prototype, fabric.DataURLExporter),
        n(fabric.StaticCanvas, {
          EMPTY_JSON: '{"objects": [], "background": "white"}',
          supports: function (t) {
            var e = r()
            if (!e || !e.getContext) return null
            e = e.getContext('2d')
            return !e || 'setLineDash' !== t ? null : void 0 !== e.setLineDash
          },
        }),
        (fabric.StaticCanvas.prototype.toJSON =
          fabric.StaticCanvas.prototype.toObject),
        fabric.isLikelyNode &&
          ((fabric.StaticCanvas.prototype.createPNGStream = function () {
            var t = i(this.lowerCanvasEl)
            return t && t.createPNGStream()
          }),
          (fabric.StaticCanvas.prototype.createJPEGStream = function (t) {
            var e = i(this.lowerCanvasEl)
            return e && e.createJPEGStream(t)
          })))
  })(),
  (fabric.BaseBrush = fabric.util.createClass({
    color: 'rgb(0, 0, 0)',
    width: 1,
    shadow: null,
    strokeLineCap: 'round',
    strokeLineJoin: 'round',
    strokeMiterLimit: 10,
    strokeDashArray: null,
    limitedToCanvasSize: !1,
    _setBrushStyles: function (t) {
      ;(t.strokeStyle = this.color),
        (t.lineWidth = this.width),
        (t.lineCap = this.strokeLineCap),
        (t.miterLimit = this.strokeMiterLimit),
        (t.lineJoin = this.strokeLineJoin),
        t.setLineDash(this.strokeDashArray || [])
    },
    _saveAndTransform: function (t) {
      var e = this.canvas.viewportTransform
      t.save(), t.transform(e[0], e[1], e[2], e[3], e[4], e[5])
    },
    _setShadow: function () {
      var t, e, i, r
      this.shadow &&
        ((t = this.canvas),
        (e = this.shadow),
        (i = t.contextTop),
        (r = t.getZoom()),
        t && t._isRetinaScaling() && (r *= fabric.devicePixelRatio),
        (i.shadowColor = e.color),
        (i.shadowBlur = e.blur * r),
        (i.shadowOffsetX = e.offsetX * r),
        (i.shadowOffsetY = e.offsetY * r))
    },
    needsFullRender: function () {
      return new fabric.Color(this.color).getAlpha() < 1 || !!this.shadow
    },
    _resetShadow: function () {
      var t = this.canvas.contextTop
      ;(t.shadowColor = ''),
        (t.shadowBlur = t.shadowOffsetX = t.shadowOffsetY = 0)
    },
    _isOutSideCanvas: function (t) {
      return (
        t.x < 0 ||
        t.x > this.canvas.getWidth() ||
        t.y < 0 ||
        t.y > this.canvas.getHeight()
      )
    },
  })),
  (fabric.PencilBrush = fabric.util.createClass(fabric.BaseBrush, {
    decimate: 0.4,
    drawStraightLine: !1,
    straightLineKey: 'shiftKey',
    initialize: function (t) {
      ;(this.canvas = t), (this._points = [])
    },
    needsFullRender: function () {
      return this.callSuper('needsFullRender') || this._hasStraightLine
    },
    _drawSegment: function (t, e, i) {
      i = e.midPointFrom(i)
      return t.quadraticCurveTo(e.x, e.y, i.x, i.y), i
    },
    onMouseDown: function (t, e) {
      this.canvas._isMainEvent(e.e) &&
        ((this.drawStraightLine = e.e[this.straightLineKey]),
        this._prepareForDrawing(t),
        this._captureDrawingPath(t),
        this._render())
    },
    onMouseMove: function (t, e) {
      var i
      this.canvas._isMainEvent(e.e) &&
        ((this.drawStraightLine = e.e[this.straightLineKey]),
        (!0 === this.limitedToCanvasSize && this._isOutSideCanvas(t)) ||
          (this._captureDrawingPath(t) &&
            1 < this._points.length &&
            (this.needsFullRender()
              ? (this.canvas.clearContext(this.canvas.contextTop),
                this._render())
              : ((t = (e = this._points).length),
                (i = this.canvas.contextTop),
                this._saveAndTransform(i),
                this.oldEnd &&
                  (i.beginPath(), i.moveTo(this.oldEnd.x, this.oldEnd.y)),
                (this.oldEnd = this._drawSegment(i, e[t - 2], e[t - 1], !0)),
                i.stroke(),
                i.restore()))))
    },
    onMouseUp: function (t) {
      return (
        !this.canvas._isMainEvent(t.e) ||
        ((this.drawStraightLine = !1),
        (this.oldEnd = void 0),
        this._finalizeAndAddPath(),
        !1)
      )
    },
    _prepareForDrawing: function (t) {
      t = new fabric.Point(t.x, t.y)
      this._reset(), this._addPoint(t), this.canvas.contextTop.moveTo(t.x, t.y)
    },
    _addPoint: function (t) {
      return (
        !(
          1 < this._points.length && t.eq(this._points[this._points.length - 1])
        ) &&
        (this.drawStraightLine &&
          1 < this._points.length &&
          ((this._hasStraightLine = !0), this._points.pop()),
        this._points.push(t),
        !0)
      )
    },
    _reset: function () {
      ;(this._points = []),
        this._setBrushStyles(this.canvas.contextTop),
        this._setShadow(),
        (this._hasStraightLine = !1)
    },
    _captureDrawingPath: function (t) {
      t = new fabric.Point(t.x, t.y)
      return this._addPoint(t)
    },
    _render: function (t) {
      var e,
        i,
        r,
        n = this._points[0],
        s = this._points[1]
      for (
        t = t || this.canvas.contextTop,
          this._saveAndTransform(t),
          t.beginPath(),
          2 === this._points.length &&
            n.x === s.x &&
            n.y === s.y &&
            ((r = this.width / 1e3),
            (n = new fabric.Point(n.x, n.y)),
            (s = new fabric.Point(s.x, s.y)),
            (n.x -= r),
            (s.x += r)),
          t.moveTo(n.x, n.y),
          e = 1,
          i = this._points.length;
        e < i;
        e++
      )
        this._drawSegment(t, n, s),
          (n = this._points[e]),
          (s = this._points[e + 1])
      t.lineTo(n.x, n.y), t.stroke(), t.restore()
    },
    convertPointsToSVGPath: function (t) {
      var e = this.width / 1e3
      return fabric.util.getSmoothPathFromPoints(t, e)
    },
    _isEmptySVGPath: function (t) {
      return 'M 0 0 Q 0 0 0 0 L 0 0' === fabric.util.joinPath(t)
    },
    createPath: function (t) {
      t = new fabric.Path(t, {
        fill: null,
        stroke: this.color,
        strokeWidth: this.width,
        strokeLineCap: this.strokeLineCap,
        strokeMiterLimit: this.strokeMiterLimit,
        strokeLineJoin: this.strokeLineJoin,
        strokeDashArray: this.strokeDashArray,
      })
      return (
        this.shadow &&
          ((this.shadow.affectStroke = !0),
          (t.shadow = new fabric.Shadow(this.shadow))),
        t
      )
    },
    decimatePoints: function (t, e) {
      if (t.length <= 2) return t
      for (
        var i = this.canvas.getZoom(),
          r = Math.pow(e / i, 2),
          n = t.length - 1,
          s = t[0],
          o = [s],
          a = 1;
        a < n - 1;
        a++
      )
        r <= Math.pow(s.x - t[a].x, 2) + Math.pow(s.y - t[a].y, 2) &&
          ((s = t[a]), o.push(s))
      return o.push(t[n]), o
    },
    _finalizeAndAddPath: function () {
      this.canvas.contextTop.closePath(),
        this.decimate &&
          (this._points = this.decimatePoints(this._points, this.decimate))
      var t = this.convertPointsToSVGPath(this._points)
      this._isEmptySVGPath(t)
        ? this.canvas.requestRenderAll()
        : ((t = this.createPath(t)),
          this.canvas.clearContext(this.canvas.contextTop),
          this.canvas.fire('before:path:created', { path: t }),
          this.canvas.add(t),
          this.canvas.requestRenderAll(),
          t.setCoords(),
          this._resetShadow(),
          this.canvas.fire('path:created', { path: t }))
    },
  })),
  (fabric.CircleBrush = fabric.util.createClass(fabric.BaseBrush, {
    width: 10,
    initialize: function (t) {
      ;(this.canvas = t), (this.points = [])
    },
    drawDot: function (t) {
      var t = this.addPoint(t),
        e = this.canvas.contextTop
      this._saveAndTransform(e), this.dot(e, t), e.restore()
    },
    dot: function (t, e) {
      ;(t.fillStyle = e.fill),
        t.beginPath(),
        t.arc(e.x, e.y, e.radius, 0, 2 * Math.PI, !1),
        t.closePath(),
        t.fill()
    },
    onMouseDown: function (t) {
      ;(this.points.length = 0),
        this.canvas.clearContext(this.canvas.contextTop),
        this._setShadow(),
        this.drawDot(t)
    },
    _render: function () {
      var t,
        e,
        i = this.canvas.contextTop,
        r = this.points
      for (this._saveAndTransform(i), t = 0, e = r.length; t < e; t++)
        this.dot(i, r[t])
      i.restore()
    },
    onMouseMove: function (t) {
      ;(!0 === this.limitedToCanvasSize && this._isOutSideCanvas(t)) ||
        (this.needsFullRender()
          ? (this.canvas.clearContext(this.canvas.contextTop),
            this.addPoint(t),
            this._render())
          : this.drawDot(t))
    },
    onMouseUp: function () {
      for (
        var t = this.canvas.renderOnAddRemove,
          e = ((this.canvas.renderOnAddRemove = !1), []),
          i = 0,
          r = this.points.length;
        i < r;
        i++
      ) {
        var n = this.points[i],
          n = new fabric.Circle({
            radius: n.radius,
            left: n.x,
            top: n.y,
            originX: 'center',
            originY: 'center',
            fill: n.fill,
          })
        this.shadow && (n.shadow = new fabric.Shadow(this.shadow)), e.push(n)
      }
      var s = new fabric.Group(e)
      ;(s.canvas = this.canvas),
        this.canvas.fire('before:path:created', { path: s }),
        this.canvas.add(s),
        this.canvas.fire('path:created', { path: s }),
        this.canvas.clearContext(this.canvas.contextTop),
        this._resetShadow(),
        (this.canvas.renderOnAddRemove = t),
        this.canvas.requestRenderAll()
    },
    addPoint: function (t) {
      var t = new fabric.Point(t.x, t.y),
        e =
          fabric.util.getRandomInt(
            Math.max(0, this.width - 20),
            this.width + 20
          ) / 2,
        i = new fabric.Color(this.color)
          .setAlpha(fabric.util.getRandomInt(0, 100) / 100)
          .toRgba()
      return (t.radius = e), (t.fill = i), this.points.push(t), t
    },
  })),
  (fabric.SprayBrush = fabric.util.createClass(fabric.BaseBrush, {
    width: 10,
    density: 20,
    dotWidth: 1,
    dotWidthVariance: 1,
    randomOpacity: !1,
    optimizeOverlapping: !0,
    initialize: function (t) {
      ;(this.canvas = t), (this.sprayChunks = [])
    },
    onMouseDown: function (t) {
      ;(this.sprayChunks.length = 0),
        this.canvas.clearContext(this.canvas.contextTop),
        this._setShadow(),
        this.addSprayChunk(t),
        this.render(this.sprayChunkPoints)
    },
    onMouseMove: function (t) {
      ;(!0 === this.limitedToCanvasSize && this._isOutSideCanvas(t)) ||
        (this.addSprayChunk(t), this.render(this.sprayChunkPoints))
    },
    onMouseUp: function () {
      for (
        var t = this.canvas.renderOnAddRemove,
          e = ((this.canvas.renderOnAddRemove = !1), []),
          i = 0,
          r = this.sprayChunks.length;
        i < r;
        i++
      )
        for (var n = this.sprayChunks[i], s = 0, o = n.length; s < o; s++) {
          var a = new fabric.Rect({
            width: n[s].width,
            height: n[s].width,
            left: n[s].x + 1,
            top: n[s].y + 1,
            originX: 'center',
            originY: 'center',
            fill: this.color,
          })
          e.push(a)
        }
      this.optimizeOverlapping && (e = this._getOptimizedRects(e))
      var c = new fabric.Group(e)
      this.shadow && c.set('shadow', new fabric.Shadow(this.shadow)),
        this.canvas.fire('before:path:created', { path: c }),
        this.canvas.add(c),
        this.canvas.fire('path:created', { path: c }),
        this.canvas.clearContext(this.canvas.contextTop),
        this._resetShadow(),
        (this.canvas.renderOnAddRemove = t),
        this.canvas.requestRenderAll()
    },
    _getOptimizedRects: function (t) {
      for (var e, i = {}, r = 0, n = t.length; r < n; r++)
        i[(e = t[r].left + '' + t[r].top)] || (i[e] = t[r])
      var s = []
      for (e in i) s.push(i[e])
      return s
    },
    render: function (t) {
      var e,
        i,
        r = this.canvas.contextTop
      for (
        r.fillStyle = this.color,
          this._saveAndTransform(r),
          e = 0,
          i = t.length;
        e < i;
        e++
      ) {
        var n = t[e]
        void 0 !== n.opacity && (r.globalAlpha = n.opacity),
          r.fillRect(n.x, n.y, n.width, n.width)
      }
      r.restore()
    },
    _render: function () {
      var t,
        e,
        i = this.canvas.contextTop
      for (
        i.fillStyle = this.color,
          this._saveAndTransform(i),
          t = 0,
          e = this.sprayChunks.length;
        t < e;
        t++
      )
        this.render(this.sprayChunks[t])
      i.restore()
    },
    addSprayChunk: function (t) {
      this.sprayChunkPoints = []
      for (var e = this.width / 2, i = 0; i < this.density; i++) {
        var r = fabric.util.getRandomInt(t.x - e, t.x + e),
          n = fabric.util.getRandomInt(t.y - e, t.y + e),
          s = this.dotWidthVariance
            ? fabric.util.getRandomInt(
                Math.max(1, this.dotWidth - this.dotWidthVariance),
                this.dotWidth + this.dotWidthVariance
              )
            : this.dotWidth,
          r = new fabric.Point(r, n)
        ;(r.width = s),
          this.randomOpacity &&
            (r.opacity = fabric.util.getRandomInt(0, 100) / 100),
          this.sprayChunkPoints.push(r)
      }
      this.sprayChunks.push(this.sprayChunkPoints)
    },
  })),
  (fabric.PatternBrush = fabric.util.createClass(fabric.PencilBrush, {
    getPatternSrc: function () {
      var t = fabric.util.createCanvasElement(),
        e = t.getContext('2d')
      return (
        (t.width = t.height = 25),
        (e.fillStyle = this.color),
        e.beginPath(),
        e.arc(10, 10, 10, 0, 2 * Math.PI, !1),
        e.closePath(),
        e.fill(),
        t
      )
    },
    getPatternSrcFunction: function () {
      return String(this.getPatternSrc).replace(
        'this.color',
        '"' + this.color + '"'
      )
    },
    getPattern: function (t) {
      return t.createPattern(this.source || this.getPatternSrc(), 'repeat')
    },
    _setBrushStyles: function (t) {
      this.callSuper('_setBrushStyles', t), (t.strokeStyle = this.getPattern(t))
    },
    createPath: function (t) {
      var t = this.callSuper('createPath', t),
        e = t._getLeftTopCoords().scalarAdd(t.strokeWidth / 2)
      return (
        (t.stroke = new fabric.Pattern({
          source: this.source || this.getPatternSrcFunction(),
          offsetX: -e.x,
          offsetY: -e.y,
        })),
        t
      )
    },
  })),
  (function () {
    var t,
      o = fabric.util.getPointer,
      c = fabric.util.degreesToRadians,
      h = fabric.util.isTouchEvent
    for (t in ((fabric.Canvas = fabric.util.createClass(fabric.StaticCanvas, {
      initialize: function (t, e) {
        ;(e = e || {}),
          (this.renderAndResetBound = this.renderAndReset.bind(this)),
          (this.requestRenderAllBound = this.requestRenderAll.bind(this)),
          this._initStatic(t, e),
          this._initInteractive(),
          this._createCacheCanvas()
      },
      uniformScaling: !0,
      uniScaleKey: 'shiftKey',
      centeredScaling: !1,
      centeredRotation: !1,
      centeredKey: 'altKey',
      altActionKey: 'shiftKey',
      interactive: !0,
      selection: !0,
      selectionKey: 'shiftKey',
      altSelectionKey: null,
      selectionColor: 'rgba(100, 100, 255, 0.3)',
      selectionDashArray: [],
      selectionBorderColor: 'rgba(255, 255, 255, 0.3)',
      selectionLineWidth: 1,
      selectionFullyContained: !1,
      hoverCursor: 'move',
      moveCursor: 'move',
      defaultCursor: 'default',
      freeDrawingCursor: 'crosshair',
      notAllowedCursor: 'not-allowed',
      containerClass: 'canvas-container',
      perPixelTargetFind: !1,
      targetFindTolerance: 0,
      skipTargetFind: !1,
      isDrawingMode: !1,
      preserveObjectStacking: !1,
      snapAngle: 0,
      snapThreshold: null,
      stopContextMenu: !1,
      fireRightClick: !1,
      fireMiddleClick: !1,
      targets: [],
      enablePointerEvents: !1,
      _hoveredTarget: null,
      _hoveredTargets: [],
      _initInteractive: function () {
        ;(this._currentTransform = null),
          (this._groupSelector = null),
          this._initWrapperElement(),
          this._createUpperCanvas(),
          this._initEventListeners(),
          this._initRetinaScaling(),
          (this.freeDrawingBrush =
            fabric.PencilBrush && new fabric.PencilBrush(this)),
          this.calcOffset()
      },
      _chooseObjectsToRender: function () {
        var t,
          e = this.getActiveObjects()
        if (0 < e.length && !this.preserveObjectStacking) {
          for (var i = [], r = [], n = 0, s = this._objects.length; n < s; n++)
            (t = this._objects[n]), (-1 === e.indexOf(t) ? i : r).push(t)
          1 < e.length && (this._activeObject._objects = r), i.push.apply(i, r)
        } else i = this._objects
        return i
      },
      renderAll: function () {
        !this.contextTopDirty ||
          this._groupSelector ||
          this.isDrawingMode ||
          (this.clearContext(this.contextTop), (this.contextTopDirty = !1)),
          this.hasLostContext &&
            (this.renderTopLayer(this.contextTop), (this.hasLostContext = !1))
        var t = this.contextContainer
        return this.renderCanvas(t, this._chooseObjectsToRender()), this
      },
      renderTopLayer: function (t) {
        t.save(),
          this.isDrawingMode &&
            this._isCurrentlyDrawing &&
            (this.freeDrawingBrush && this.freeDrawingBrush._render(),
            (this.contextTopDirty = !0)),
          this.selection &&
            this._groupSelector &&
            (this._drawSelection(t), (this.contextTopDirty = !0)),
          t.restore()
      },
      renderTop: function () {
        var t = this.contextTop
        return (
          this.clearContext(t),
          this.renderTopLayer(t),
          this.fire('after:render'),
          this
        )
      },
      _normalizePointer: function (t, e) {
        ;(t = t.calcTransformMatrix()),
          (t = fabric.util.invertTransform(t)),
          (e = this.restorePointerVpt(e))
        return fabric.util.transformPoint(e, t)
      },
      isTargetTransparent: function (t, e, i) {
        if (t.shouldCache() && t._cacheCanvas && t !== this._activeObject)
          return (
            (n = this._normalizePointer(t, { x: e, y: i })),
            (r = Math.max(t.cacheTranslationX + n.x * t.zoomX, 0)),
            (n = Math.max(t.cacheTranslationY + n.y * t.zoomY, 0)),
            fabric.util.isTransparent(
              t._cacheContext,
              Math.round(r),
              Math.round(n),
              this.targetFindTolerance
            )
          )
        var r = this.contextCache,
          n = t.selectionBackgroundColor,
          s = this.viewportTransform
        return (
          (t.selectionBackgroundColor = ''),
          this.clearContext(r),
          r.save(),
          r.transform(s[0], s[1], s[2], s[3], s[4], s[5]),
          t.render(r),
          r.restore(),
          (t.selectionBackgroundColor = n),
          fabric.util.isTransparent(r, e, i, this.targetFindTolerance)
        )
      },
      _isSelectionKeyPressed: function (e) {
        return Array.isArray(this.selectionKey)
          ? !!this.selectionKey.find(function (t) {
              return !0 === e[t]
            })
          : e[this.selectionKey]
      },
      _shouldClearSelection: function (t, e) {
        var i = this.getActiveObjects(),
          r = this._activeObject
        return (
          !e ||
          (r &&
            1 < i.length &&
            -1 === i.indexOf(e) &&
            r !== e &&
            !this._isSelectionKeyPressed(t)) ||
          (e && !e.evented) ||
          (e && !e.selectable && r && r !== e)
        )
      },
      _shouldCenterTransform: function (t, e, i) {
        var r
        if (t)
          return (
            'scale' === e ||
            'scaleX' === e ||
            'scaleY' === e ||
            'resizing' === e
              ? (r = this.centeredScaling || t.centeredScaling)
              : 'rotate' === e &&
                (r = this.centeredRotation || t.centeredRotation),
            r ? !i : i
          )
      },
      _getOriginFromCorner: function (t, e) {
        t = { x: t.originX, y: t.originY }
        return (
          'ml' === e || 'tl' === e || 'bl' === e
            ? (t.x = 'right')
            : ('mr' !== e && 'tr' !== e && 'br' !== e) || (t.x = 'left'),
          'tl' === e || 'mt' === e || 'tr' === e
            ? (t.y = 'bottom')
            : ('bl' !== e && 'mb' !== e && 'br' !== e) || (t.y = 'top'),
          t
        )
      },
      _getActionFromCorner: function (t, e, i, r) {
        if (!e || !t) return 'drag'
        t = r.controls[e]
        return t.getActionName(i, t, r)
      },
      _setupCurrentTransform: function (t, e, i) {
        var r, n, s, o, a
        e &&
          ((r = this.getPointer(t)),
          (n = e.__corner),
          (a = e.controls[n]),
          (a =
            i && n
              ? a.getActionHandler(t, e, a)
              : fabric.controlsUtils.dragHandler),
          (i = this._getActionFromCorner(i, n, t, e)),
          (s = this._getOriginFromCorner(e, n)),
          (o = t[this.centeredKey]),
          (a = {
            target: e,
            action: i,
            actionHandler: a,
            corner: n,
            scaleX: e.scaleX,
            scaleY: e.scaleY,
            skewX: e.skewX,
            skewY: e.skewY,
            offsetX: r.x - e.left,
            offsetY: r.y - e.top,
            originX: s.x,
            originY: s.y,
            ex: r.x,
            ey: r.y,
            lastX: r.x,
            lastY: r.y,
            theta: c(e.angle),
            width: e.width * e.scaleX,
            shiftKey: t.shiftKey,
            altKey: o,
            original: fabric.util.saveObjectTransform(e),
          }),
          this._shouldCenterTransform(e, i, o) &&
            ((a.originX = 'center'), (a.originY = 'center')),
          (a.original.originX = s.x),
          (a.original.originY = s.y),
          (this._currentTransform = a),
          this._beforeTransform(t))
      },
      setCursor: function (t) {
        this.upperCanvasEl.style.cursor = t
      },
      _drawSelection: function (t) {
        var e = this._groupSelector,
          i = new fabric.Point(e.ex, e.ey),
          i = fabric.util.transformPoint(i, this.viewportTransform),
          e = new fabric.Point(e.ex + e.left, e.ey + e.top),
          e = fabric.util.transformPoint(e, this.viewportTransform),
          r = Math.min(i.x, e.x),
          n = Math.min(i.y, e.y),
          s = Math.max(i.x, e.x),
          i = Math.max(i.y, e.y),
          e = this.selectionLineWidth / 2
        this.selectionColor &&
          ((t.fillStyle = this.selectionColor), t.fillRect(r, n, s - r, i - n)),
          this.selectionLineWidth &&
            this.selectionBorderColor &&
            ((t.lineWidth = this.selectionLineWidth),
            (t.strokeStyle = this.selectionBorderColor),
            (r += e),
            (n += e),
            (s -= e),
            (i -= e),
            fabric.Object.prototype._setLineDash.call(
              this,
              t,
              this.selectionDashArray
            ),
            t.strokeRect(r, n, s - r, i - n))
      },
      findTarget: function (t, e) {
        if (!this.skipTargetFind) {
          var i,
            r,
            n = this.getPointer(t, !0),
            s = this._activeObject,
            o = this.getActiveObjects(),
            a = h(t),
            c = (1 < o.length && !e) || 1 === o.length
          if (((this.targets = []), c && s._findTargetCorner(n, a))) return s
          if (1 < o.length && !e && s === this._searchPossibleTargets([s], n))
            return s
          if (1 === o.length && s === this._searchPossibleTargets([s], n)) {
            if (!this.preserveObjectStacking) return s
            ;(i = s), (r = this.targets), (this.targets = [])
          }
          c = this._searchPossibleTargets(this._objects, n)
          return (
            t[this.altSelectionKey] &&
              c &&
              i &&
              c !== i &&
              ((c = i), (this.targets = r)),
            c
          )
        }
      },
      _checkTarget: function (t, e, i) {
        if (e && e.visible && e.evented && e.containsPoint(t))
          return (
            !(
              (this.perPixelTargetFind || e.perPixelTargetFind) &&
              !e.isEditing
            ) ||
            !this.isTargetTransparent(e, i.x, i.y) ||
            void 0
          )
      },
      _searchPossibleTargets: function (t, e) {
        for (var i, r = t.length; r--; ) {
          var n = t[r],
            s = n.group ? this._normalizePointer(n.group, e) : e
          if (this._checkTarget(s, n, e)) {
            ;(i = t[r]).subTargetCheck &&
              i instanceof fabric.Group &&
              (s = this._searchPossibleTargets(i._objects, e)) &&
              this.targets.push(s)
            break
          }
        }
        return i
      },
      restorePointerVpt: function (t) {
        return fabric.util.transformPoint(
          t,
          fabric.util.invertTransform(this.viewportTransform)
        )
      },
      getPointer: function (t, e) {
        if (this._absolutePointer && !e) return this._absolutePointer
        if (this._pointer && e) return this._pointer
        var t = o(t),
          i = this.upperCanvasEl,
          r = i.getBoundingClientRect(),
          n = r.width || 0,
          s = r.height || 0,
          r =
            ((n && s) ||
              ('top' in r && 'bottom' in r && (s = Math.abs(r.top - r.bottom)),
              'right' in r && 'left' in r && (n = Math.abs(r.right - r.left))),
            this.calcOffset(),
            (t.x = t.x - this._offset.left),
            (t.y = t.y - this._offset.top),
            e || (t = this.restorePointerVpt(t)),
            this.getRetinaScaling())
        return (
          1 !== r && ((t.x /= r), (t.y /= r)),
          (e =
            0 === n || 0 === s
              ? { width: 1, height: 1 }
              : { width: i.width / n, height: i.height / s }),
          { x: t.x * e.width, y: t.y * e.height }
        )
      },
      _createUpperCanvas: function () {
        var t = this.lowerCanvasEl.className.replace(/\s*lower-canvas\s*/, ''),
          e = this.lowerCanvasEl,
          i = this.upperCanvasEl
        i
          ? (i.className = '')
          : ((i = this._createCanvasElement()), (this.upperCanvasEl = i)),
          fabric.util.addClass(i, 'upper-canvas ' + t),
          this.wrapperEl.appendChild(i),
          this._copyCanvasStyle(e, i),
          this._applyCanvasStyle(i),
          (this.contextTop = i.getContext('2d'))
      },
      getTopContext: function () {
        return this.contextTop
      },
      _createCacheCanvas: function () {
        ;(this.cacheCanvasEl = this._createCanvasElement()),
          this.cacheCanvasEl.setAttribute('width', this.width),
          this.cacheCanvasEl.setAttribute('height', this.height),
          (this.contextCache = this.cacheCanvasEl.getContext('2d'))
      },
      _initWrapperElement: function () {
        ;(this.wrapperEl = fabric.util.wrapElement(this.lowerCanvasEl, 'div', {
          class: this.containerClass,
        })),
          fabric.util.setStyle(this.wrapperEl, {
            width: this.width + 'px',
            height: this.height + 'px',
            position: 'relative',
          }),
          fabric.util.makeElementUnselectable(this.wrapperEl)
      },
      _applyCanvasStyle: function (t) {
        var e = this.width || t.width,
          i = this.height || t.height
        fabric.util.setStyle(t, {
          position: 'absolute',
          width: e + 'px',
          height: i + 'px',
          left: 0,
          top: 0,
          'touch-action': this.allowTouchScrolling ? 'manipulation' : 'none',
          '-ms-touch-action': this.allowTouchScrolling
            ? 'manipulation'
            : 'none',
        }),
          (t.width = e),
          (t.height = i),
          fabric.util.makeElementUnselectable(t)
      },
      _copyCanvasStyle: function (t, e) {
        e.style.cssText = t.style.cssText
      },
      getSelectionContext: function () {
        return this.contextTop
      },
      getSelectionElement: function () {
        return this.upperCanvasEl
      },
      getActiveObject: function () {
        return this._activeObject
      },
      getActiveObjects: function () {
        var t = this._activeObject
        return t
          ? 'activeSelection' === t.type && t._objects
            ? t._objects.slice(0)
            : [t]
          : []
      },
      _onObjectRemoved: function (t) {
        t === this._activeObject &&
          (this.fire('before:selection:cleared', { target: t }),
          this._discardActiveObject(),
          this.fire('selection:cleared', { target: t }),
          t.fire('deselected')),
          t === this._hoveredTarget &&
            ((this._hoveredTarget = null), (this._hoveredTargets = [])),
          this.callSuper('_onObjectRemoved', t)
      },
      _fireSelectionEvents: function (e, i) {
        var r = !1,
          n = this.getActiveObjects(),
          s = [],
          o = []
        e.forEach(function (t) {
          ;-1 === n.indexOf(t) &&
            ((r = !0), t.fire('deselected', { e: i, target: t }), o.push(t))
        }),
          n.forEach(function (t) {
            ;-1 === e.indexOf(t) &&
              ((r = !0), t.fire('selected', { e: i, target: t }), s.push(t))
          }),
          0 < e.length && 0 < n.length
            ? r &&
              this.fire('selection:updated', {
                e: i,
                selected: s,
                deselected: o,
              })
            : 0 < n.length
            ? this.fire('selection:created', { e: i, selected: s })
            : 0 < e.length &&
              this.fire('selection:cleared', { e: i, deselected: o })
      },
      setActiveObject: function (t, e) {
        var i = this.getActiveObjects()
        return (
          this._setActiveObject(t, e), this._fireSelectionEvents(i, e), this
        )
      },
      _setActiveObject: function (t, e) {
        return (
          this._activeObject !== t &&
          !!this._discardActiveObject(e, t) &&
          !t.onSelect({ e: e }) &&
          ((this._activeObject = t), !0)
        )
      },
      _discardActiveObject: function (t, e) {
        var i = this._activeObject
        if (i) {
          if (i.onDeselect({ e: t, object: e })) return !1
          this._activeObject = null
        }
        return !0
      },
      discardActiveObject: function (t) {
        var e = this.getActiveObjects(),
          i = this.getActiveObject()
        return (
          e.length &&
            this.fire('before:selection:cleared', { target: i, e: t }),
          this._discardActiveObject(t),
          this._fireSelectionEvents(e, t),
          this
        )
      },
      dispose: function () {
        var t = this.wrapperEl
        return (
          this.removeListeners(),
          t.removeChild(this.upperCanvasEl),
          t.removeChild(this.lowerCanvasEl),
          (this.contextCache = null),
          (this.contextTop = null),
          ['upperCanvasEl', 'cacheCanvasEl'].forEach(
            function (t) {
              fabric.util.cleanUpJsdomNode(this[t]), (this[t] = void 0)
            }.bind(this)
          ),
          t.parentNode &&
            t.parentNode.replaceChild(this.lowerCanvasEl, this.wrapperEl),
          delete this.wrapperEl,
          fabric.StaticCanvas.prototype.dispose.call(this),
          this
        )
      },
      clear: function () {
        return (
          this.discardActiveObject(),
          this.clearContext(this.contextTop),
          this.callSuper('clear')
        )
      },
      drawControls: function (t) {
        var e = this._activeObject
        e && e._renderControls(t)
      },
      _toObject: function (t, e, i) {
        var r = this._realizeGroupTransformOnObject(t),
          e = this.callSuper('_toObject', t, e, i)
        return this._unwindGroupTransformOnObject(t, r), e
      },
      _realizeGroupTransformOnObject: function (e) {
        var i
        return e.group &&
          'activeSelection' === e.group.type &&
          this._activeObject === e.group
          ? ((i = {}),
            [
              'angle',
              'flipX',
              'flipY',
              'left',
              'scaleX',
              'scaleY',
              'skewX',
              'skewY',
              'top',
            ].forEach(function (t) {
              i[t] = e[t]
            }),
            fabric.util.addTransformToObject(
              e,
              this._activeObject.calcOwnMatrix()
            ),
            i)
          : null
      },
      _unwindGroupTransformOnObject: function (t, e) {
        e && t.set(e)
      },
      _setSVGObject: function (t, e, i) {
        var r = this._realizeGroupTransformOnObject(e)
        this.callSuper('_setSVGObject', t, e, i),
          this._unwindGroupTransformOnObject(e, r)
      },
      setViewportTransform: function (t) {
        this.renderOnAddRemove &&
          this._activeObject &&
          this._activeObject.isEditing &&
          this._activeObject.clearContextTop(),
          fabric.StaticCanvas.prototype.setViewportTransform.call(this, t)
      },
    })),
    fabric.StaticCanvas))
      'prototype' !== t && (fabric.Canvas[t] = fabric.StaticCanvas[t])
  })(),
  (function () {
    var r = fabric.util.addListener,
      n = fabric.util.removeListener,
      s = { passive: !1 }
    function h(t, e) {
      return t.button && t.button === e - 1
    }
    fabric.util.object.extend(fabric.Canvas.prototype, {
      mainTouchId: null,
      _initEventListeners: function () {
        this.removeListeners(), this._bindEvents(), this.addOrRemove(r, 'add')
      },
      _getEventPrefix: function () {
        return this.enablePointerEvents ? 'pointer' : 'mouse'
      },
      addOrRemove: function (t, e) {
        var i = this.upperCanvasEl,
          r = this._getEventPrefix()
        t(fabric.window, 'resize', this._onResize),
          t(i, r + 'down', this._onMouseDown),
          t(i, r + 'move', this._onMouseMove, s),
          t(i, r + 'out', this._onMouseOut),
          t(i, r + 'enter', this._onMouseEnter),
          t(i, 'wheel', this._onMouseWheel),
          t(i, 'contextmenu', this._onContextMenu),
          t(i, 'dblclick', this._onDoubleClick),
          t(i, 'dragover', this._onDragOver),
          t(i, 'dragenter', this._onDragEnter),
          t(i, 'dragleave', this._onDragLeave),
          t(i, 'drop', this._onDrop),
          this.enablePointerEvents || t(i, 'touchstart', this._onTouchStart, s),
          'undefined' != typeof eventjs &&
            e in eventjs &&
            (eventjs[e](i, 'gesture', this._onGesture),
            eventjs[e](i, 'drag', this._onDrag),
            eventjs[e](i, 'orientation', this._onOrientationChange),
            eventjs[e](i, 'shake', this._onShake),
            eventjs[e](i, 'longpress', this._onLongPress))
      },
      removeListeners: function () {
        this.addOrRemove(n, 'remove')
        var t = this._getEventPrefix()
        n(fabric.document, t + 'up', this._onMouseUp),
          n(fabric.document, 'touchend', this._onTouchEnd, s),
          n(fabric.document, t + 'move', this._onMouseMove, s),
          n(fabric.document, 'touchmove', this._onMouseMove, s)
      },
      _bindEvents: function () {
        this.eventsBound ||
          ((this._onMouseDown = this._onMouseDown.bind(this)),
          (this._onTouchStart = this._onTouchStart.bind(this)),
          (this._onMouseMove = this._onMouseMove.bind(this)),
          (this._onMouseUp = this._onMouseUp.bind(this)),
          (this._onTouchEnd = this._onTouchEnd.bind(this)),
          (this._onResize = this._onResize.bind(this)),
          (this._onGesture = this._onGesture.bind(this)),
          (this._onDrag = this._onDrag.bind(this)),
          (this._onShake = this._onShake.bind(this)),
          (this._onLongPress = this._onLongPress.bind(this)),
          (this._onOrientationChange = this._onOrientationChange.bind(this)),
          (this._onMouseWheel = this._onMouseWheel.bind(this)),
          (this._onMouseOut = this._onMouseOut.bind(this)),
          (this._onMouseEnter = this._onMouseEnter.bind(this)),
          (this._onContextMenu = this._onContextMenu.bind(this)),
          (this._onDoubleClick = this._onDoubleClick.bind(this)),
          (this._onDragOver = this._onDragOver.bind(this)),
          (this._onDragEnter = this._simpleEventHandler.bind(
            this,
            'dragenter'
          )),
          (this._onDragLeave = this._simpleEventHandler.bind(
            this,
            'dragleave'
          )),
          (this._onDrop = this._onDrop.bind(this)),
          (this.eventsBound = !0))
      },
      _onGesture: function (t, e) {
        this.__onTransformGesture && this.__onTransformGesture(t, e)
      },
      _onDrag: function (t, e) {
        this.__onDrag && this.__onDrag(t, e)
      },
      _onMouseWheel: function (t) {
        this.__onMouseWheel(t)
      },
      _onMouseOut: function (e) {
        var i = this._hoveredTarget,
          r =
            (this.fire('mouse:out', { target: i, e: e }),
            (this._hoveredTarget = null),
            i && i.fire('mouseout', { e: e }),
            this)
        this._hoveredTargets.forEach(function (t) {
          r.fire('mouse:out', { target: i, e: e }),
            t && i.fire('mouseout', { e: e })
        }),
          (this._hoveredTargets = [])
      },
      _onMouseEnter: function (t) {
        this._currentTransform ||
          this.findTarget(t) ||
          (this.fire('mouse:over', { target: null, e: t }),
          (this._hoveredTarget = null),
          (this._hoveredTargets = []))
      },
      _onOrientationChange: function (t, e) {
        this.__onOrientationChange && this.__onOrientationChange(t, e)
      },
      _onShake: function (t, e) {
        this.__onShake && this.__onShake(t, e)
      },
      _onLongPress: function (t, e) {
        this.__onLongPress && this.__onLongPress(t, e)
      },
      _onDragOver: function (t) {
        t.preventDefault()
        var e = this._simpleEventHandler('dragover', t)
        this._fireEnterLeaveEvents(e, t)
      },
      _onDrop: function (t) {
        return (
          this._simpleEventHandler('drop:before', t),
          this._simpleEventHandler('drop', t)
        )
      },
      _onContextMenu: function (t) {
        return (
          this.stopContextMenu && (t.stopPropagation(), t.preventDefault()), !1
        )
      },
      _onDoubleClick: function (t) {
        this._cacheTransformEventData(t),
          this._handleEvent(t, 'dblclick'),
          this._resetTransformEventData(t)
      },
      getPointerId: function (t) {
        var e = t.changedTouches
        return e
          ? e[0] && e[0].identifier
          : this.enablePointerEvents
          ? t.pointerId
          : -1
      },
      _isMainEvent: function (t) {
        return (
          !0 === t.isPrimary ||
          (!1 !== t.isPrimary &&
            (('touchend' === t.type && 0 === t.touches.length) ||
              !t.changedTouches ||
              t.changedTouches[0].identifier === this.mainTouchId))
        )
      },
      _onTouchStart: function (t) {
        t.preventDefault(),
          null === this.mainTouchId &&
            (this.mainTouchId = this.getPointerId(t)),
          this.__onMouseDown(t),
          this._resetTransformEventData()
        var t = this.upperCanvasEl,
          e = this._getEventPrefix()
        r(fabric.document, 'touchend', this._onTouchEnd, s),
          r(fabric.document, 'touchmove', this._onMouseMove, s),
          n(t, e + 'down', this._onMouseDown)
      },
      _onMouseDown: function (t) {
        this.__onMouseDown(t), this._resetTransformEventData()
        var t = this.upperCanvasEl,
          e = this._getEventPrefix()
        n(t, e + 'move', this._onMouseMove, s),
          r(fabric.document, e + 'up', this._onMouseUp),
          r(fabric.document, e + 'move', this._onMouseMove, s)
      },
      _onTouchEnd: function (t) {
        var e, i
        0 < t.touches.length ||
          (this.__onMouseUp(t),
          this._resetTransformEventData(),
          (this.mainTouchId = null),
          (e = this._getEventPrefix()),
          n(fabric.document, 'touchend', this._onTouchEnd, s),
          n(fabric.document, 'touchmove', this._onMouseMove, s),
          (i = this)._willAddMouseDown && clearTimeout(this._willAddMouseDown),
          (this._willAddMouseDown = setTimeout(function () {
            r(i.upperCanvasEl, e + 'down', i._onMouseDown),
              (i._willAddMouseDown = 0)
          }, 400)))
      },
      _onMouseUp: function (t) {
        this.__onMouseUp(t), this._resetTransformEventData()
        var e = this.upperCanvasEl,
          i = this._getEventPrefix()
        this._isMainEvent(t) &&
          (n(fabric.document, i + 'up', this._onMouseUp),
          n(fabric.document, i + 'move', this._onMouseMove, s),
          r(e, i + 'move', this._onMouseMove, s))
      },
      _onMouseMove: function (t) {
        !this.allowTouchScrolling && t.preventDefault && t.preventDefault(),
          this.__onMouseMove(t)
      },
      _onResize: function () {
        this.calcOffset()
      },
      _shouldRender: function (t) {
        var e = this._activeObject
        return !!(!!e != !!t || (e && t && e !== t)) || (e && e.isEditing, !1)
      },
      __onMouseUp: function (t) {
        var e,
          i,
          r,
          n,
          s,
          o = this._currentTransform,
          a = this._groupSelector,
          c = !1,
          a = !a || (0 === a.left && 0 === a.top)
        if (
          (this._cacheTransformEventData(t),
          (e = this._target),
          this._handleEvent(t, 'up:before'),
          h(t, 3))
        )
          this.fireRightClick && this._handleEvent(t, 'up', 3, a)
        else {
          if (h(t, 2))
            return (
              this.fireMiddleClick && this._handleEvent(t, 'up', 2, a),
              void this._resetTransformEventData()
            )
          this.isDrawingMode && this._isCurrentlyDrawing
            ? this._onMouseUpInDrawingMode(t)
            : this._isMainEvent(t) &&
              (o &&
                (this._finalizeCurrentTransform(t), (c = o.actionPerformed)),
              a ||
                ((r = e === this._activeObject),
                this._maybeGroupObjects(t),
                (c =
                  c ||
                  this._shouldRender(e) ||
                  (!r && e === this._activeObject))),
              e &&
                ((n = e._findTargetCorner(
                  this.getPointer(t, !0),
                  fabric.util.isTouchEvent(t)
                )),
                e.selectable && e !== this._activeObject && 'up' === e.activeOn
                  ? (this.setActiveObject(e, t), (c = !0))
                  : (r = (i = e.controls[n]) && i.getMouseUpHandler(t, e, i)) &&
                    r(t, o, (s = this.getPointer(t)).x, s.y),
                (e.isMoving = !1)),
              !o ||
                (o.target === e && o.corner === n) ||
                ((n =
                  (r = o.target && o.target.controls[o.corner]) &&
                  r.getMouseUpHandler(t, e, i)),
                (s = s || this.getPointer(t)),
                n && n(t, o, s.x, s.y)),
              this._setCursorFromEvent(t, e),
              this._handleEvent(t, 'up', 1, a),
              (this._groupSelector = null),
              (this._currentTransform = null),
              e && (e.__corner = 0),
              c ? this.requestRenderAll() : a || this.renderTop())
        }
      },
      _simpleEventHandler: function (t, e) {
        var i = this.findTarget(e),
          r = this.targets,
          n = { e: e, target: i, subTargets: r }
        if ((this.fire(t, n), i && i.fire(t, n), !r)) return i
        for (var s = 0; s < r.length; s++) r[s].fire(t, n)
        return i
      },
      _handleEvent: function (t, e, i, r) {
        var n = this._target,
          s = this.targets || [],
          o = {
            e: t,
            target: n,
            subTargets: s,
            button: i || 1,
            isClick: r || !1,
            pointer: this._pointer,
            absolutePointer: this._absolutePointer,
            transform: this._currentTransform,
          }
        'up' === e &&
          ((o.currentTarget = this.findTarget(t)),
          (o.currentSubTargets = this.targets)),
          this.fire('mouse:' + e, o),
          n && n.fire('mouse' + e, o)
        for (var a = 0; a < s.length; a++) s[a].fire('mouse' + e, o)
      },
      _finalizeCurrentTransform: function (t) {
        var e = this._currentTransform,
          i = e.target,
          t = { e: t, target: i, transform: e, action: e.action }
        i._scaling && (i._scaling = !1),
          i.setCoords(),
          (e.actionPerformed || (this.stateful && i.hasStateChanged())) &&
            this._fire('modified', t)
      },
      _onMouseDownInDrawingMode: function (t) {
        ;(this._isCurrentlyDrawing = !0),
          this.getActiveObject() &&
            this.discardActiveObject(t).requestRenderAll()
        var e = this.getPointer(t)
        this.freeDrawingBrush.onMouseDown(e, { e: t, pointer: e }),
          this._handleEvent(t, 'down')
      },
      _onMouseMoveInDrawingMode: function (t) {
        var e
        this._isCurrentlyDrawing &&
          ((e = this.getPointer(t)),
          this.freeDrawingBrush.onMouseMove(e, { e: t, pointer: e })),
          this.setCursor(this.freeDrawingCursor),
          this._handleEvent(t, 'move')
      },
      _onMouseUpInDrawingMode: function (t) {
        var e = this.getPointer(t)
        ;(this._isCurrentlyDrawing = this.freeDrawingBrush.onMouseUp({
          e: t,
          pointer: e,
        })),
          this._handleEvent(t, 'up')
      },
      __onMouseDown: function (t) {
        this._cacheTransformEventData(t), this._handleEvent(t, 'down:before')
        var e,
          i,
          r,
          n,
          s,
          o = this._target
        h(t, 3)
          ? this.fireRightClick && this._handleEvent(t, 'down', 3)
          : h(t, 2)
          ? this.fireMiddleClick && this._handleEvent(t, 'down', 2)
          : this.isDrawingMode
          ? this._onMouseDownInDrawingMode(t)
          : this._isMainEvent(t) &&
            !this._currentTransform &&
            ((n = this._pointer),
            (this._previousPointer = n),
            (e = this._shouldRender(o)),
            (i = this._shouldGroup(t, o)),
            this._shouldClearSelection(t, o)
              ? this.discardActiveObject(t)
              : i && (this._handleGrouping(t, o), (o = this._activeObject)),
            !this.selection ||
              (o &&
                (o.selectable || o.isEditing || o === this._activeObject)) ||
              (this._groupSelector = {
                ex: this._absolutePointer.x,
                ey: this._absolutePointer.y,
                top: 0,
                left: 0,
              }),
            o &&
              ((r = o === this._activeObject),
              o.selectable &&
                'down' === o.activeOn &&
                this.setActiveObject(o, t),
              (s = o._findTargetCorner(
                this.getPointer(t, !0),
                fabric.util.isTouchEvent(t)
              )),
              (o.__corner = s),
              o !== this._activeObject ||
                (!s && i) ||
                (this._setupCurrentTransform(t, o, r),
                (r = o.controls[s]),
                (n = this.getPointer(t)),
                (s = r && r.getMouseDownHandler(t, o, r)) &&
                  s(t, this._currentTransform, n.x, n.y))),
            this._handleEvent(t, 'down'),
            (e || i) && this.requestRenderAll())
      },
      _resetTransformEventData: function () {
        ;(this._target = null),
          (this._pointer = null),
          (this._absolutePointer = null)
      },
      _cacheTransformEventData: function (t) {
        this._resetTransformEventData(),
          (this._pointer = this.getPointer(t, !0)),
          (this._absolutePointer = this.restorePointerVpt(this._pointer)),
          (this._target = this._currentTransform
            ? this._currentTransform.target
            : this.findTarget(t) || null)
      },
      _beforeTransform: function (t) {
        var e = this._currentTransform
        this.stateful && e.target.saveState(),
          this.fire('before:transform', { e: t, transform: e })
      },
      __onMouseMove: function (t) {
        var e, i
        this._handleEvent(t, 'move:before'),
          this._cacheTransformEventData(t),
          this.isDrawingMode
            ? this._onMouseMoveInDrawingMode(t)
            : this._isMainEvent(t) &&
              ((i = this._groupSelector)
                ? ((e = this._absolutePointer),
                  (i.left = e.x - i.ex),
                  (i.top = e.y - i.ey),
                  this.renderTop())
                : this._currentTransform
                ? this._transformObject(t)
                : ((e = this.findTarget(t) || null),
                  this._setCursorFromEvent(t, e),
                  this._fireOverOutEvents(e, t)),
              this._handleEvent(t, 'move'),
              this._resetTransformEventData())
      },
      _fireOverOutEvents: function (t, e) {
        var i = this._hoveredTarget,
          r = this._hoveredTargets,
          n = this.targets,
          s = Math.max(r.length, n.length)
        this.fireSyntheticInOutEvents(t, e, {
          oldTarget: i,
          evtOut: 'mouseout',
          canvasEvtOut: 'mouse:out',
          evtIn: 'mouseover',
          canvasEvtIn: 'mouse:over',
        })
        for (var o = 0; o < s; o++)
          this.fireSyntheticInOutEvents(n[o], e, {
            oldTarget: r[o],
            evtOut: 'mouseout',
            evtIn: 'mouseover',
          })
        ;(this._hoveredTarget = t),
          (this._hoveredTargets = this.targets.concat())
      },
      _fireEnterLeaveEvents: function (t, e) {
        var i = this._draggedoverTarget,
          r = this._hoveredTargets,
          n = this.targets,
          s = Math.max(r.length, n.length)
        this.fireSyntheticInOutEvents(t, e, {
          oldTarget: i,
          evtOut: 'dragleave',
          evtIn: 'dragenter',
        })
        for (var o = 0; o < s; o++)
          this.fireSyntheticInOutEvents(n[o], e, {
            oldTarget: r[o],
            evtOut: 'dragleave',
            evtIn: 'dragenter',
          })
        this._draggedoverTarget = t
      },
      fireSyntheticInOutEvents: function (t, e, i) {
        var r,
          n,
          s = i.oldTarget,
          o = s !== t,
          a = i.canvasEvtIn,
          c = i.canvasEvtOut
        o &&
          ((r = { e: e, target: t, previousTarget: s }),
          (n = { e: e, target: s, nextTarget: t })),
          (e = t && o),
          s && o && (c && this.fire(c, n), s.fire(i.evtOut, n)),
          e && (a && this.fire(a, r), t.fire(i.evtIn, r))
      },
      __onMouseWheel: function (t) {
        this._cacheTransformEventData(t),
          this._handleEvent(t, 'wheel'),
          this._resetTransformEventData()
      },
      _transformObject: function (t) {
        var e = this.getPointer(t),
          i = this._currentTransform
        ;(i.reset = !1),
          (i.shiftKey = t.shiftKey),
          (i.altKey = t[this.centeredKey]),
          this._performTransformAction(t, i, e),
          i.actionPerformed && this.requestRenderAll()
      },
      _performTransformAction: function (t, e, i) {
        var r = i.x,
          i = i.y,
          n = e.action,
          s = !1,
          o = e.actionHandler
        o && (s = o(t, e, r, i)),
          'drag' === n &&
            s &&
            ((e.target.isMoving = !0),
            this.setCursor(e.target.moveCursor || this.moveCursor)),
          (e.actionPerformed = e.actionPerformed || s)
      },
      _fire: fabric.controlsUtils.fireEvent,
      _setCursorFromEvent: function (t, e) {
        if (!e) return this.setCursor(this.defaultCursor), !1
        var i = e.hoverCursor || this.hoverCursor,
          r =
            this._activeObject && 'activeSelection' === this._activeObject.type
              ? this._activeObject
              : null,
          r =
            (!r || !r.contains(e)) &&
            e._findTargetCorner(this.getPointer(t, !0))
        r
          ? this.setCursor(this.getCornerCursor(r, e, t))
          : (e.subTargetCheck &&
              this.targets
                .concat()
                .reverse()
                .map(function (t) {
                  i = t.hoverCursor || i
                }),
            this.setCursor(i))
      },
      getCornerCursor: function (t, e, i) {
        t = e.controls[t]
        return t.cursorStyleHandler(i, t, e)
      },
    })
  })(),
  (function () {
    var f = Math.min,
      d = Math.max
    fabric.util.object.extend(fabric.Canvas.prototype, {
      _shouldGroup: function (t, e) {
        var i = this._activeObject
        return (
          i &&
          this._isSelectionKeyPressed(t) &&
          e &&
          e.selectable &&
          this.selection &&
          (i !== e || 'activeSelection' === i.type) &&
          !e.onSelect({ e: t })
        )
      },
      _handleGrouping: function (t, e) {
        var i = this._activeObject
        i.__corner ||
          ((e !== i || ((e = this.findTarget(t, !0)) && e.selectable)) &&
            (i && 'activeSelection' === i.type
              ? this._updateActiveSelection(e, t)
              : this._createActiveSelection(e, t)))
      },
      _updateActiveSelection: function (t, e) {
        var i = this._activeObject,
          r = i._objects.slice(0)
        i.contains(t)
          ? (i.removeWithUpdate(t),
            (this._hoveredTarget = t),
            (this._hoveredTargets = this.targets.concat()),
            1 === i.size() && this._setActiveObject(i.item(0), e))
          : (i.addWithUpdate(t),
            (this._hoveredTarget = i),
            (this._hoveredTargets = this.targets.concat())),
          this._fireSelectionEvents(r, e)
      },
      _createActiveSelection: function (t, e) {
        var i = this.getActiveObjects(),
          t = this._createGroup(t)
        ;(this._hoveredTarget = t),
          this._setActiveObject(t, e),
          this._fireSelectionEvents(i, e)
      },
      _createGroup: function (t) {
        var e = this._objects,
          e =
            e.indexOf(this._activeObject) < e.indexOf(t)
              ? [this._activeObject, t]
              : [t, this._activeObject]
        return (
          this._activeObject.isEditing && this._activeObject.exitEditing(),
          new fabric.ActiveSelection(e, { canvas: this })
        )
      },
      _groupSelectedObjects: function (t) {
        var e = this._collectObjects(t)
        1 === e.length
          ? this.setActiveObject(e[0], t)
          : 1 < e.length &&
            ((e = new fabric.ActiveSelection(e.reverse(), { canvas: this })),
            this.setActiveObject(e, t))
      },
      _collectObjects: function (e) {
        for (
          var t,
            i = [],
            r = this._groupSelector.ex,
            n = this._groupSelector.ey,
            s = r + this._groupSelector.left,
            o = n + this._groupSelector.top,
            a = new fabric.Point(f(r, s), f(n, o)),
            c = new fabric.Point(d(r, s), d(n, o)),
            h = !this.selectionFullyContained,
            l = r === s && n === o,
            u = this._objects.length;
          u-- &&
          !(
            (t = this._objects[u]) &&
            t.selectable &&
            t.visible &&
            ((h && t.intersectsWithRect(a, c, !0)) ||
              t.isContainedWithinRect(a, c, !0) ||
              (h && t.containsPoint(a, null, !0)) ||
              (h && t.containsPoint(c, null, !0))) &&
            (i.push(t), l)
          );

        );
        return (i =
          1 < i.length
            ? i.filter(function (t) {
                return !t.onSelect({ e: e })
              })
            : i)
      },
      _maybeGroupObjects: function (t) {
        this.selection && this._groupSelector && this._groupSelectedObjects(t),
          this.setCursor(this.defaultCursor),
          (this._groupSelector = null)
      },
    })
  })(),
  fabric.util.object.extend(fabric.StaticCanvas.prototype, {
    toDataURL: function (t) {
      var e = (t = t || {}).format || 'png',
        i = t.quality || 1,
        r =
          (t.multiplier || 1) *
          (t.enableRetinaScaling ? this.getRetinaScaling() : 1),
        r = this.toCanvasElement(r, t)
      return fabric.util.toDataURL(r, e, i)
    },
    toCanvasElement: function (t, e) {
      var i = ((e = e || {}).width || this.width) * (t = t || 1),
        r = (e.height || this.height) * t,
        n = this.getZoom(),
        s = this.width,
        o = this.height,
        n = n * t,
        a = this.viewportTransform,
        c = (a[4] - (e.left || 0)) * t,
        e = (a[5] - (e.top || 0)) * t,
        t = this.interactive,
        n = [n, 0, 0, n, c, e],
        c = this.enableRetinaScaling,
        e = fabric.util.createCanvasElement(),
        h = this.contextTop
      return (
        (e.width = i),
        (e.height = r),
        (this.contextTop = null),
        (this.enableRetinaScaling = !1),
        (this.interactive = !1),
        (this.viewportTransform = n),
        (this.width = i),
        (this.height = r),
        this.calcViewportBoundaries(),
        this.renderCanvas(e.getContext('2d'), this._objects),
        (this.viewportTransform = a),
        (this.width = s),
        (this.height = o),
        this.calcViewportBoundaries(),
        (this.interactive = t),
        (this.enableRetinaScaling = c),
        (this.contextTop = h),
        e
      )
    },
  }),
  fabric.util.object.extend(fabric.StaticCanvas.prototype, {
    loadFromJSON: function (t, i, e) {
      var r, n, s, o
      if (t)
        return (
          (r =
            'string' == typeof t ? JSON.parse(t) : fabric.util.object.clone(t)),
          (n = this),
          (s = r.clipPath),
          (o = this.renderOnAddRemove),
          (this.renderOnAddRemove = !1),
          delete r.clipPath,
          this._enlivenObjects(
            r.objects,
            function (e) {
              n.clear(),
                n._setBgOverlay(r, function () {
                  s
                    ? n._enlivenObjects([s], function (t) {
                        ;(n.clipPath = t[0]),
                          n.__setupCanvas.call(n, r, e, o, i)
                      })
                    : n.__setupCanvas.call(n, r, e, o, i)
                })
            },
            e
          ),
          this
        )
    },
    __setupCanvas: function (t, e, i, r) {
      var n = this
      e.forEach(function (t, e) {
        n.insertAt(t, e)
      }),
        (this.renderOnAddRemove = i),
        delete t.objects,
        delete t.backgroundImage,
        delete t.overlayImage,
        delete t.background,
        delete t.overlay,
        this._setOptions(t),
        this.renderAll(),
        r && r()
    },
    _setBgOverlay: function (t, e) {
      var i,
        r = {
          backgroundColor: !1,
          overlayColor: !1,
          backgroundImage: !1,
          overlayImage: !1,
        }
      t.backgroundImage || t.overlayImage || t.background || t.overlay
        ? (this.__setBgOverlay(
            'backgroundImage',
            t.backgroundImage,
            r,
            (i = function () {
              r.backgroundImage &&
                r.overlayImage &&
                r.backgroundColor &&
                r.overlayColor &&
                e &&
                e()
            })
          ),
          this.__setBgOverlay('overlayImage', t.overlayImage, r, i),
          this.__setBgOverlay('backgroundColor', t.background, r, i),
          this.__setBgOverlay('overlayColor', t.overlay, r, i))
        : e && e()
    },
    __setBgOverlay: function (e, t, i, r) {
      var n = this
      if (!t) return (i[e] = !0), void (r && r())
      'backgroundImage' === e || 'overlayImage' === e
        ? fabric.util.enlivenObjects([t], function (t) {
            ;(n[e] = t[0]), (i[e] = !0), r && r()
          })
        : this['set' + fabric.util.string.capitalize(e, !0)](t, function () {
            ;(i[e] = !0), r && r()
          })
    },
    _enlivenObjects: function (t, e, i) {
      t && 0 !== t.length
        ? fabric.util.enlivenObjects(
            t,
            function (t) {
              e && e(t)
            },
            null,
            i
          )
        : e && e([])
    },
    _toDataURL: function (e, i) {
      this.clone(function (t) {
        i(t.toDataURL(e))
      })
    },
    _toDataURLWithMultiplier: function (e, i, r) {
      this.clone(function (t) {
        r(t.toDataURLWithMultiplier(e, i))
      })
    },
    clone: function (e, t) {
      var i = JSON.stringify(this.toJSON(t))
      this.cloneWithoutData(function (t) {
        t.loadFromJSON(i, function () {
          e && e(t)
        })
      })
    },
    cloneWithoutData: function (t) {
      var e = fabric.util.createCanvasElement(),
        i =
          ((e.width = this.width),
          (e.height = this.height),
          new fabric.Canvas(e))
      this.backgroundImage
        ? (i.setBackgroundImage(this.backgroundImage.src, function () {
            i.renderAll(), t && t(i)
          }),
          (i.backgroundImageOpacity = this.backgroundImageOpacity),
          (i.backgroundImageStretch = this.backgroundImageStretch))
        : t && t(i)
    },
  }),
  (function (t) {
    'use strict'
    var g = t.fabric || (t.fabric = {}),
      t = g.util.object.extend,
      s = g.util.object.clone,
      i = g.util.toFixed,
      e = g.util.string.capitalize,
      o = g.util.degreesToRadians,
      r = !g.isLikelyNode
    g.Object ||
      ((g.Object = g.util.createClass(g.CommonMethods, {
        type: 'object',
        originX: 'left',
        originY: 'top',
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        scaleX: 1,
        scaleY: 1,
        flipX: !1,
        flipY: !1,
        opacity: 1,
        angle: 0,
        skewX: 0,
        skewY: 0,
        cornerSize: 13,
        touchCornerSize: 24,
        transparentCorners: !0,
        hoverCursor: null,
        moveCursor: null,
        padding: 0,
        borderColor: 'rgb(178,204,255)',
        borderDashArray: null,
        cornerColor: 'rgb(178,204,255)',
        cornerStrokeColor: null,
        cornerStyle: 'rect',
        cornerDashArray: null,
        centeredScaling: !1,
        centeredRotation: !0,
        fill: 'rgb(0,0,0)',
        fillRule: 'nonzero',
        globalCompositeOperation: 'source-over',
        backgroundColor: '',
        selectionBackgroundColor: '',
        stroke: null,
        strokeWidth: 1,
        strokeDashArray: null,
        strokeDashOffset: 0,
        strokeLineCap: 'butt',
        strokeLineJoin: 'miter',
        strokeMiterLimit: 4,
        shadow: null,
        borderOpacityWhenMoving: 0.4,
        borderScaleFactor: 1,
        minScaleLimit: 0,
        selectable: !0,
        evented: !0,
        visible: !0,
        hasControls: !0,
        hasBorders: !0,
        perPixelTargetFind: !1,
        includeDefaultValues: !0,
        lockMovementX: !1,
        lockMovementY: !1,
        lockRotation: !1,
        lockScalingX: !1,
        lockScalingY: !1,
        lockSkewingX: !1,
        lockSkewingY: !1,
        lockScalingFlip: !1,
        excludeFromExport: !1,
        objectCaching: r,
        statefullCache: !1,
        noScaleCache: !0,
        strokeUniform: !1,
        dirty: !0,
        __corner: 0,
        paintFirst: 'fill',
        activeOn: 'down',
        stateProperties:
          'top left width height scaleX scaleY flipX flipY originX originY transformMatrix stroke strokeWidth strokeDashArray strokeLineCap strokeDashOffset strokeLineJoin strokeMiterLimit angle opacity fill globalCompositeOperation shadow visible backgroundColor skewX skewY fillRule paintFirst clipPath strokeUniform'.split(
            ' '
          ),
        cacheProperties:
          'fill stroke strokeWidth strokeDashArray width height paintFirst strokeUniform strokeLineCap strokeDashOffset strokeLineJoin strokeMiterLimit backgroundColor clipPath'.split(
            ' '
          ),
        colorProperties: 'fill stroke backgroundColor'.split(' '),
        clipPath: void 0,
        inverted: !1,
        absolutePositioned: !1,
        initialize: function (t) {
          t && this.setOptions(t)
        },
        _createCacheCanvas: function () {
          ;(this._cacheProperties = {}),
            (this._cacheCanvas = g.util.createCanvasElement()),
            (this._cacheContext = this._cacheCanvas.getContext('2d')),
            this._updateCacheCanvas(),
            (this.dirty = !0)
        },
        _limitCacheSize: function (t) {
          var e = g.perfLimitSizeTotal,
            i = t.width,
            r = t.height,
            n = g.maxCacheSideLimit,
            s = g.minCacheSideLimit
          if (i <= n && r <= n && i * r <= e)
            return i < s && (t.width = s), r < s && (t.height = s), t
          var e = g.util.limitDimsByArea(i / r, e),
            o = g.util.capValue,
            a = o(s, e.x, n),
            o = o(s, e.y, n)
          return (
            a < i && ((t.zoomX /= i / a), (t.width = a), (t.capped = !0)),
            o < r && ((t.zoomY /= r / o), (t.height = o), (t.capped = !0)),
            t
          )
        },
        _getCacheCanvasDimensions: function () {
          var t = this.getTotalObjectScaling(),
            e = this._getTransformedDimensions(0, 0),
            i = (e.x * t.scaleX) / this.scaleX,
            e = (e.y * t.scaleY) / this.scaleY
          return {
            width: 2 + i,
            height: 2 + e,
            zoomX: t.scaleX,
            zoomY: t.scaleY,
            x: i,
            y: e,
          }
        },
        _updateCacheCanvas: function () {
          var t = this.canvas
          if (this.noScaleCache && t && t._currentTransform) {
            var e = t._currentTransform.target,
              t = t._currentTransform.action
            if (this === e && t.slice && 'scale' === t.slice(0, 5)) return !1
          }
          var i,
            r,
            e = this._cacheCanvas,
            t = this._limitCacheSize(this._getCacheCanvasDimensions()),
            n = g.minCacheSideLimit,
            s = t.width,
            o = t.height,
            a = t.zoomX,
            c = t.zoomY,
            h = s !== this.cacheWidth || o !== this.cacheHeight,
            l = this.zoomX !== a || this.zoomY !== c,
            l = h || l,
            u = 0,
            f = 0,
            d = !1
          return (
            h &&
              ((h = this._cacheCanvas.width),
              (i = this._cacheCanvas.height),
              (d =
                (r = h < s || i < o) ||
                ((s < 0.9 * h || o < 0.9 * i) && n < h && n < i)),
              r &&
                !t.capped &&
                (n < s || n < o) &&
                ((u = 0.1 * s), (f = 0.1 * o))),
            this instanceof g.Text &&
              this.path &&
              ((d = l = !0),
              (u += this.getHeightOfLine(0) * this.zoomX),
              (f += this.getHeightOfLine(0) * this.zoomY)),
            !!l &&
              (d
                ? ((e.width = Math.ceil(s + u)), (e.height = Math.ceil(o + f)))
                : (this._cacheContext.setTransform(1, 0, 0, 1, 0, 0),
                  this._cacheContext.clearRect(0, 0, e.width, e.height)),
              (h = t.x / 2),
              (i = t.y / 2),
              (this.cacheTranslationX = Math.round(e.width / 2 - h) + h),
              (this.cacheTranslationY = Math.round(e.height / 2 - i) + i),
              (this.cacheWidth = s),
              (this.cacheHeight = o),
              this._cacheContext.translate(
                this.cacheTranslationX,
                this.cacheTranslationY
              ),
              this._cacheContext.scale(a, c),
              (this.zoomX = a),
              (this.zoomY = c),
              !0)
          )
        },
        setOptions: function (t) {
          this._setOptions(t),
            this._initGradient(t.fill, 'fill'),
            this._initGradient(t.stroke, 'stroke'),
            this._initPattern(t.fill, 'fill'),
            this._initPattern(t.stroke, 'stroke')
        },
        transform: function (t) {
          var e =
              (this.group && !this.group._transformDone) ||
              (this.group && this.canvas && t === this.canvas.contextTop),
            e = this.calcTransformMatrix(!e)
          t.transform(e[0], e[1], e[2], e[3], e[4], e[5])
        },
        toObject: function (t) {
          var e = g.Object.NUM_FRACTION_DIGITS,
            e = {
              type: this.type,
              version: g.version,
              originX: this.originX,
              originY: this.originY,
              left: i(this.left, e),
              top: i(this.top, e),
              width: i(this.width, e),
              height: i(this.height, e),
              fill:
                this.fill && this.fill.toObject
                  ? this.fill.toObject()
                  : this.fill,
              stroke:
                this.stroke && this.stroke.toObject
                  ? this.stroke.toObject()
                  : this.stroke,
              strokeWidth: i(this.strokeWidth, e),
              strokeDashArray:
                this.strokeDashArray && this.strokeDashArray.concat(),
              strokeLineCap: this.strokeLineCap,
              strokeDashOffset: this.strokeDashOffset,
              strokeLineJoin: this.strokeLineJoin,
              strokeUniform: this.strokeUniform,
              strokeMiterLimit: i(this.strokeMiterLimit, e),
              scaleX: i(this.scaleX, e),
              scaleY: i(this.scaleY, e),
              angle: i(this.angle, e),
              flipX: this.flipX,
              flipY: this.flipY,
              opacity: i(this.opacity, e),
              shadow:
                this.shadow && this.shadow.toObject
                  ? this.shadow.toObject()
                  : this.shadow,
              visible: this.visible,
              backgroundColor: this.backgroundColor,
              fillRule: this.fillRule,
              paintFirst: this.paintFirst,
              globalCompositeOperation: this.globalCompositeOperation,
              skewX: i(this.skewX, e),
              skewY: i(this.skewY, e),
            }
          return (
            this.clipPath &&
              !this.clipPath.excludeFromExport &&
              ((e.clipPath = this.clipPath.toObject(t)),
              (e.clipPath.inverted = this.clipPath.inverted),
              (e.clipPath.absolutePositioned =
                this.clipPath.absolutePositioned)),
            g.util.populateWithProperties(this, e, t),
            (e = this.includeDefaultValues ? e : this._removeDefaultValues(e))
          )
        },
        toDatalessObject: function (t) {
          return this.toObject(t)
        },
        _removeDefaultValues: function (e) {
          var i = g.util.getKlass(e.type).prototype
          return (
            i.stateProperties.forEach(function (t) {
              'left' !== t &&
                'top' !== t &&
                (e[t] === i[t] && delete e[t],
                Array.isArray(e[t]) &&
                  Array.isArray(i[t]) &&
                  0 === e[t].length &&
                  0 === i[t].length &&
                  delete e[t])
            }),
            e
          )
        },
        toString: function () {
          return '#<fabric.' + e(this.type) + '>'
        },
        getObjectScaling: function () {
          if (!this.group) return { scaleX: this.scaleX, scaleY: this.scaleY }
          var t = g.util.qrDecompose(this.calcTransformMatrix())
          return { scaleX: Math.abs(t.scaleX), scaleY: Math.abs(t.scaleY) }
        },
        getTotalObjectScaling: function () {
          var t,
            e,
            i = this.getObjectScaling(),
            r = i.scaleX,
            i = i.scaleY
          return (
            this.canvas &&
              ((r *=
                (t = this.canvas.getZoom()) *
                (e = this.canvas.getRetinaScaling())),
              (i *= t * e)),
            { scaleX: r, scaleY: i }
          )
        },
        getObjectOpacity: function () {
          var t = this.opacity
          return this.group && (t *= this.group.getObjectOpacity()), t
        },
        _set: function (t, e) {
          var i = this[t] !== e
          return (
            ('scaleX' === t || 'scaleY' === t) && (e = this._constrainScale(e)),
            'scaleX' === t && e < 0
              ? ((this.flipX = !this.flipX), (e *= -1))
              : 'scaleY' === t && e < 0
              ? ((this.flipY = !this.flipY), (e *= -1))
              : 'shadow' !== t || !e || e instanceof g.Shadow
              ? 'dirty' === t && this.group && this.group.set('dirty', e)
              : (e = new g.Shadow(e)),
            (this[t] = e),
            i &&
              ((e = this.group && this.group.isOnACache()),
              -1 < this.cacheProperties.indexOf(t)
                ? ((this.dirty = !0), e && this.group.set('dirty', !0))
                : e &&
                  -1 < this.stateProperties.indexOf(t) &&
                  this.group.set('dirty', !0)),
            this
          )
        },
        setOnGroup: function () {},
        getViewportTransform: function () {
          return this.canvas && this.canvas.viewportTransform
            ? this.canvas.viewportTransform
            : g.iMatrix.concat()
        },
        isNotVisible: function () {
          return (
            0 === this.opacity ||
            (!this.width && !this.height && 0 === this.strokeWidth) ||
            !this.visible
          )
        },
        render: function (t) {
          this.isNotVisible() ||
            (this.canvas &&
              this.canvas.skipOffscreen &&
              !this.group &&
              !this.isOnScreen()) ||
            (t.save(),
            this._setupCompositeOperation(t),
            this.drawSelectionBackground(t),
            this.transform(t),
            this._setOpacity(t),
            this._setShadow(t, this),
            this.shouldCache()
              ? (this.renderCache(), this.drawCacheOnCanvas(t))
              : (this._removeCacheCanvas(),
                (this.dirty = !1),
                this.drawObject(t),
                this.objectCaching &&
                  this.statefullCache &&
                  this.saveState({ propertySet: 'cacheProperties' })),
            t.restore())
        },
        renderCache: function (t) {
          ;(t = t || {}),
            (this._cacheCanvas && this._cacheContext) ||
              this._createCacheCanvas(),
            this.isCacheDirty() &&
              (this.statefullCache &&
                this.saveState({ propertySet: 'cacheProperties' }),
              this.drawObject(this._cacheContext, t.forClipping),
              (this.dirty = !1))
        },
        _removeCacheCanvas: function () {
          ;(this._cacheCanvas = null),
            (this._cacheContext = null),
            (this.cacheWidth = 0),
            (this.cacheHeight = 0)
        },
        hasStroke: function () {
          return (
            this.stroke &&
            'transparent' !== this.stroke &&
            0 !== this.strokeWidth
          )
        },
        hasFill: function () {
          return this.fill && 'transparent' !== this.fill
        },
        needsItsOwnCache: function () {
          return (
            !(
              'stroke' !== this.paintFirst ||
              !this.hasFill() ||
              !this.hasStroke() ||
              'object' != typeof this.shadow
            ) || !!this.clipPath
          )
        },
        shouldCache: function () {
          return (
            (this.ownCaching =
              this.needsItsOwnCache() ||
              (this.objectCaching &&
                (!this.group || !this.group.isOnACache()))),
            this.ownCaching
          )
        },
        willDrawShadow: function () {
          return (
            !!this.shadow &&
            (0 !== this.shadow.offsetX || 0 !== this.shadow.offsetY)
          )
        },
        drawClipPathOnCache: function (t, e) {
          var i
          t.save(),
            e.inverted
              ? (t.globalCompositeOperation = 'destination-out')
              : (t.globalCompositeOperation = 'destination-in'),
            e.absolutePositioned &&
              ((i = g.util.invertTransform(this.calcTransformMatrix())),
              t.transform(i[0], i[1], i[2], i[3], i[4], i[5])),
            e.transform(t),
            t.scale(1 / e.zoomX, 1 / e.zoomY),
            t.drawImage(
              e._cacheCanvas,
              -e.cacheTranslationX,
              -e.cacheTranslationY
            ),
            t.restore()
        },
        drawObject: function (t, e) {
          var i = this.fill,
            r = this.stroke
          e
            ? ((this.fill = 'black'),
              (this.stroke = ''),
              this._setClippingProperties(t))
            : this._renderBackground(t),
            this._render(t),
            this._drawClipPath(t, this.clipPath),
            (this.fill = i),
            (this.stroke = r)
        },
        _drawClipPath: function (t, e) {
          e &&
            ((e.canvas = this.canvas),
            e.shouldCache(),
            (e._transformDone = !0),
            e.renderCache({ forClipping: !0 }),
            this.drawClipPathOnCache(t, e))
        },
        drawCacheOnCanvas: function (t) {
          t.scale(1 / this.zoomX, 1 / this.zoomY),
            t.drawImage(
              this._cacheCanvas,
              -this.cacheTranslationX,
              -this.cacheTranslationY
            )
        },
        isCacheDirty: function (t) {
          return (
            !this.isNotVisible() &&
            (!(
              !this._cacheCanvas ||
              !this._cacheContext ||
              t ||
              !this._updateCacheCanvas()
            ) ||
              (!!(
                this.dirty ||
                (this.clipPath && this.clipPath.absolutePositioned) ||
                (this.statefullCache && this.hasStateChanged('cacheProperties'))
              ) &&
                (this._cacheCanvas &&
                  this._cacheContext &&
                  !t &&
                  ((t = this.cacheWidth / this.zoomX),
                  (e = this.cacheHeight / this.zoomY),
                  this._cacheContext.clearRect(-t / 2, -e / 2, t, e)),
                !0)))
          )
          var e
        },
        _renderBackground: function (t) {
          var e
          this.backgroundColor &&
            ((e = this._getNonTransformedDimensions()),
            (t.fillStyle = this.backgroundColor),
            t.fillRect(-e.x / 2, -e.y / 2, e.x, e.y),
            this._removeShadow(t))
        },
        _setOpacity: function (t) {
          this.group && !this.group._transformDone
            ? (t.globalAlpha = this.getObjectOpacity())
            : (t.globalAlpha *= this.opacity)
        },
        _setStrokeStyles: function (t, e) {
          var i = e.stroke
          i &&
            ((t.lineWidth = e.strokeWidth),
            (t.lineCap = e.strokeLineCap),
            (t.lineDashOffset = e.strokeDashOffset),
            (t.lineJoin = e.strokeLineJoin),
            (t.miterLimit = e.strokeMiterLimit),
            i.toLive
              ? 'percentage' === i.gradientUnits ||
                i.gradientTransform ||
                i.patternTransform
                ? this._applyPatternForTransformedGradient(t, i)
                : ((t.strokeStyle = i.toLive(t, this)),
                  this._applyPatternGradientTransform(t, i))
              : (t.strokeStyle = e.stroke))
        },
        _setFillStyles: function (t, e) {
          var i = e.fill
          i &&
            (i.toLive
              ? ((t.fillStyle = i.toLive(t, this)),
                this._applyPatternGradientTransform(t, e.fill))
              : (t.fillStyle = i))
        },
        _setClippingProperties: function (t) {
          ;(t.globalAlpha = 1),
            (t.strokeStyle = 'transparent'),
            (t.fillStyle = '#000000')
        },
        _setLineDash: function (t, e) {
          e &&
            0 !== e.length &&
            (1 & e.length && e.push.apply(e, e), t.setLineDash(e))
        },
        _renderControls: function (t, e) {
          var i = this.getViewportTransform(),
            r = this.calcTransformMatrix(),
            n = (void 0 !== (e = e || {}).hasBorders ? e : this).hasBorders,
            s = (void 0 !== e.hasControls ? e : this).hasControls,
            r = g.util.multiplyTransformMatrices(i, r),
            i = g.util.qrDecompose(r)
          t.save(),
            t.translate(i.translateX, i.translateY),
            (t.lineWidth = +this.borderScaleFactor),
            this.group ||
              (t.globalAlpha = this.isMoving
                ? this.borderOpacityWhenMoving
                : 1),
            this.flipX && (i.angle -= 180),
            t.rotate(o((this.group ? i : this).angle)),
            e.forActiveSelection || this.group
              ? n && this.drawBordersInGroup(t, i, e)
              : n && this.drawBorders(t, e),
            s && this.drawControls(t, e),
            t.restore()
        },
        _setShadow: function (t) {
          var e, i, r, n, s
          this.shadow &&
            ((e = this.shadow),
            (r = ((i = this.canvas) && i.viewportTransform[0]) || 1),
            (n = (i && i.viewportTransform[3]) || 1),
            (s = e.nonScaling
              ? { scaleX: 1, scaleY: 1 }
              : this.getObjectScaling()),
            i &&
              i._isRetinaScaling() &&
              ((r *= g.devicePixelRatio), (n *= g.devicePixelRatio)),
            (t.shadowColor = e.color),
            (t.shadowBlur =
              (e.blur *
                g.browserShadowBlurConstant *
                (r + n) *
                (s.scaleX + s.scaleY)) /
              4),
            (t.shadowOffsetX = e.offsetX * r * s.scaleX),
            (t.shadowOffsetY = e.offsetY * n * s.scaleY))
        },
        _removeShadow: function (t) {
          this.shadow &&
            ((t.shadowColor = ''),
            (t.shadowBlur = t.shadowOffsetX = t.shadowOffsetY = 0))
        },
        _applyPatternGradientTransform: function (t, e) {
          if (!e || !e.toLive) return { offsetX: 0, offsetY: 0 }
          var i = e.gradientTransform || e.patternTransform,
            r = -this.width / 2 + e.offsetX || 0,
            n = -this.height / 2 + e.offsetY || 0
          return (
            'percentage' === e.gradientUnits
              ? t.transform(this.width, 0, 0, this.height, r, n)
              : t.transform(1, 0, 0, 1, r, n),
            i && t.transform(i[0], i[1], i[2], i[3], i[4], i[5]),
            { offsetX: r, offsetY: n }
          )
        },
        _renderPaintInOrder: function (t) {
          'stroke' === this.paintFirst
            ? (this._renderStroke(t), this._renderFill(t))
            : (this._renderFill(t), this._renderStroke(t))
        },
        _render: function () {},
        _renderFill: function (t) {
          this.fill &&
            (t.save(),
            this._setFillStyles(t, this),
            'evenodd' === this.fillRule ? t.fill('evenodd') : t.fill(),
            t.restore())
        },
        _renderStroke: function (t) {
          var e
          this.stroke &&
            0 !== this.strokeWidth &&
            (this.shadow && !this.shadow.affectStroke && this._removeShadow(t),
            t.save(),
            this.strokeUniform && this.group
              ? ((e = this.getObjectScaling()),
                t.scale(1 / e.scaleX, 1 / e.scaleY))
              : this.strokeUniform && t.scale(1 / this.scaleX, 1 / this.scaleY),
            this._setLineDash(t, this.strokeDashArray),
            this._setStrokeStyles(t, this),
            t.stroke(),
            t.restore())
        },
        _applyPatternForTransformedGradient: function (t, e) {
          var i,
            r = this._limitCacheSize(this._getCacheCanvasDimensions()),
            n = g.util.createCanvasElement(),
            s = this.canvas.getRetinaScaling(),
            o = r.x / this.scaleX / s,
            a = r.y / this.scaleY / s
          ;(n.width = o),
            (n.height = a),
            (i = n.getContext('2d')).beginPath(),
            i.moveTo(0, 0),
            i.lineTo(o, 0),
            i.lineTo(o, a),
            i.lineTo(0, a),
            i.closePath(),
            i.translate(o / 2, a / 2),
            i.scale(r.zoomX / this.scaleX / s, r.zoomY / this.scaleY / s),
            this._applyPatternGradientTransform(i, e),
            (i.fillStyle = e.toLive(t)),
            i.fill(),
            t.translate(
              -this.width / 2 - this.strokeWidth / 2,
              -this.height / 2 - this.strokeWidth / 2
            ),
            t.scale((s * this.scaleX) / r.zoomX, (s * this.scaleY) / r.zoomY),
            (t.strokeStyle = i.createPattern(n, 'no-repeat'))
        },
        _findCenterFromElement: function () {
          return {
            x: this.left + this.width / 2,
            y: this.top + this.height / 2,
          }
        },
        _assignTransformMatrixProps: function () {
          var t
          this.transformMatrix &&
            ((t = g.util.qrDecompose(this.transformMatrix)),
            (this.flipX = !1),
            (this.flipY = !1),
            this.set('scaleX', t.scaleX),
            this.set('scaleY', t.scaleY),
            (this.angle = t.angle),
            (this.skewX = t.skewX),
            (this.skewY = 0))
        },
        _removeTransformMatrix: function (t) {
          var e = this._findCenterFromElement()
          this.transformMatrix &&
            (this._assignTransformMatrixProps(),
            (e = g.util.transformPoint(e, this.transformMatrix))),
            (this.transformMatrix = null),
            t &&
              ((this.scaleX *= t.scaleX),
              (this.scaleY *= t.scaleY),
              (this.cropX = t.cropX),
              (this.cropY = t.cropY),
              (e.x += t.offsetLeft),
              (e.y += t.offsetTop),
              (this.width = t.width),
              (this.height = t.height)),
            this.setPositionByOrigin(e, 'center', 'center')
        },
        clone: function (t, e) {
          e = this.toObject(e)
          this.constructor.fromObject
            ? this.constructor.fromObject(e, t)
            : g.Object._fromObject('Object', e, t)
        },
        cloneAsImage: function (t, e) {
          e = this.toCanvasElement(e)
          return t && t(new g.Image(e)), this
        },
        toCanvasElement: function (t) {
          t = t || {}
          var e,
            i = g.util,
            r = i.saveObjectTransform(this),
            n = this.group,
            s = this.shadow,
            o = Math.abs,
            a =
              (t.multiplier || 1) *
              (t.enableRetinaScaling ? g.devicePixelRatio : 1),
            i =
              (delete this.group,
              t.withoutTransform && i.resetObjectTransform(this),
              t.withoutShadow && (this.shadow = null),
              g.util.createCanvasElement()),
            c = this.getBoundingRect(!0, !0),
            h = this.shadow,
            l = { x: 0, y: 0 },
            o =
              (h &&
                ((e = h.blur),
                (u = h.nonScaling
                  ? { scaleX: 1, scaleY: 1 }
                  : this.getObjectScaling()),
                (l.x = 2 * Math.round(o(h.offsetX) + e) * o(u.scaleX)),
                (l.y = 2 * Math.round(o(h.offsetY) + e) * o(u.scaleY))),
              (h = c.width + l.x),
              (e = c.height + l.y),
              (i.width = Math.ceil(h)),
              (i.height = Math.ceil(e)),
              new g.StaticCanvas(i, {
                enableRetinaScaling: !1,
                renderOnAddRemove: !1,
                skipOffscreen: !1,
              })),
            u =
              ('jpeg' === t.format && (o.backgroundColor = '#fff'),
              this.setPositionByOrigin(
                new g.Point(o.width / 2, o.height / 2),
                'center',
                'center'
              ),
              this.canvas),
            c = (o.add(this), o.toCanvasElement(a || 1, t))
          return (
            (this.shadow = s),
            this.set('canvas', u),
            n && (this.group = n),
            this.set(r).setCoords(),
            (o._objects = []),
            o.dispose(),
            (o = null),
            c
          )
        },
        toDataURL: function (t) {
          return g.util.toDataURL(
            this.toCanvasElement((t = t || {})),
            t.format || 'png',
            t.quality || 1
          )
        },
        isType: function (t) {
          return 1 < arguments.length
            ? Array.from(arguments).includes(this.type)
            : this.type === t
        },
        complexity: function () {
          return 1
        },
        toJSON: function (t) {
          return this.toObject(t)
        },
        rotate: function (t) {
          var e =
            ('center' !== this.originX || 'center' !== this.originY) &&
            this.centeredRotation
          return (
            e && this._setOriginToCenter(),
            this.set('angle', t),
            e && this._resetOrigin(),
            this
          )
        },
        centerH: function () {
          return this.canvas && this.canvas.centerObjectH(this), this
        },
        viewportCenterH: function () {
          return this.canvas && this.canvas.viewportCenterObjectH(this), this
        },
        centerV: function () {
          return this.canvas && this.canvas.centerObjectV(this), this
        },
        viewportCenterV: function () {
          return this.canvas && this.canvas.viewportCenterObjectV(this), this
        },
        center: function () {
          return this.canvas && this.canvas.centerObject(this), this
        },
        viewportCenter: function () {
          return this.canvas && this.canvas.viewportCenterObject(this), this
        },
        getLocalPointer: function (t, e) {
          e = e || this.canvas.getPointer(t)
          ;(t = new g.Point(e.x, e.y)), (e = this._getLeftTopCoords())
          return {
            x:
              (t = this.angle ? g.util.rotatePoint(t, e, o(-this.angle)) : t)
                .x - e.x,
            y: t.y - e.y,
          }
        },
        _setupCompositeOperation: function (t) {
          this.globalCompositeOperation &&
            (t.globalCompositeOperation = this.globalCompositeOperation)
        },
        dispose: function () {
          g.runningAnimations && g.runningAnimations.cancelByTarget(this)
        },
      })),
      g.util.createAccessors && g.util.createAccessors(g.Object),
      t(g.Object.prototype, g.Observable),
      (g.Object.NUM_FRACTION_DIGITS = 2),
      (g.Object.ENLIVEN_PROPS = ['clipPath']),
      (g.Object._fromObject = function (t, e, i, r) {
        var n = g[t]
        ;(e = s(e, !0)),
          g.util.enlivenPatterns([e.fill, e.stroke], function (t) {
            void 0 !== t[0] && (e.fill = t[0]),
              void 0 !== t[1] && (e.stroke = t[1]),
              g.util.enlivenObjectEnlivables(e, e, function () {
                var t = r ? new n(e[r], e) : new n(e)
                i && i(t)
              })
          })
      }),
      (g.Object.__uid = 0))
  })('undefined' != typeof exports ? exports : this),
  (function () {
    var s = fabric.util.degreesToRadians,
      a = { left: -0.5, center: 0, right: 0.5 },
      c = { top: -0.5, center: 0, bottom: 0.5 }
    fabric.util.object.extend(fabric.Object.prototype, {
      translateToGivenOrigin: function (t, e, i, r, n) {
        var s = t.x,
          o = t.y
        return (
          'string' == typeof e ? (e = a[e]) : (e -= 0.5),
          'string' == typeof r ? (r = a[r]) : (r -= 0.5),
          'string' == typeof i ? (i = c[i]) : (i -= 0.5),
          'string' == typeof n ? (n = c[n]) : (n -= 0.5),
          (n = n - i),
          ((i = r - e) || n) &&
            ((r = this._getTransformedDimensions()),
            (s = t.x + i * r.x),
            (o = t.y + n * r.y)),
          new fabric.Point(s, o)
        )
      },
      translateToCenterPoint: function (t, e, i) {
        e = this.translateToGivenOrigin(t, e, i, 'center', 'center')
        return this.angle ? fabric.util.rotatePoint(e, t, s(this.angle)) : e
      },
      translateToOriginPoint: function (t, e, i) {
        e = this.translateToGivenOrigin(t, 'center', 'center', e, i)
        return this.angle ? fabric.util.rotatePoint(e, t, s(this.angle)) : e
      },
      getCenterPoint: function () {
        var t = new fabric.Point(this.left, this.top)
        return this.translateToCenterPoint(t, this.originX, this.originY)
      },
      getPointByOrigin: function (t, e) {
        var i = this.getCenterPoint()
        return this.translateToOriginPoint(i, t, e)
      },
      toLocalPoint: function (t, e, i) {
        var r = this.getCenterPoint(),
          e =
            void 0 !== e && void 0 !== i
              ? this.translateToGivenOrigin(r, 'center', 'center', e, i)
              : new fabric.Point(this.left, this.top),
          i = new fabric.Point(t.x, t.y)
        return (i = this.angle
          ? fabric.util.rotatePoint(i, r, -s(this.angle))
          : i).subtractEquals(e)
      },
      setPositionByOrigin: function (t, e, i) {
        ;(t = this.translateToCenterPoint(t, e, i)),
          (e = this.translateToOriginPoint(t, this.originX, this.originY))
        this.set('left', e.x), this.set('top', e.y)
      },
      adjustPosition: function (t) {
        var e = s(this.angle),
          i = this.getScaledWidth(),
          r = fabric.util.cos(e) * i,
          e = fabric.util.sin(e) * i,
          i =
            'string' == typeof this.originX
              ? a[this.originX]
              : this.originX - 0.5,
          n = 'string' == typeof t ? a[t] : t - 0.5
        ;(this.left += r * (n - i)),
          (this.top += e * (n - i)),
          this.setCoords(),
          (this.originX = t)
      },
      _setOriginToCenter: function () {
        ;(this._originalOriginX = this.originX),
          (this._originalOriginY = this.originY)
        var t = this.getCenterPoint()
        ;(this.originX = 'center'),
          (this.originY = 'center'),
          (this.left = t.x),
          (this.top = t.y)
      },
      _resetOrigin: function () {
        var t = this.translateToOriginPoint(
          this.getCenterPoint(),
          this._originalOriginX,
          this._originalOriginY
        )
        ;(this.originX = this._originalOriginX),
          (this.originY = this._originalOriginY),
          (this.left = t.x),
          (this.top = t.y),
          (this._originalOriginX = null),
          (this._originalOriginY = null)
      },
      _getLeftTopCoords: function () {
        return this.translateToOriginPoint(this.getCenterPoint(), 'left', 'top')
      },
    })
  })(),
  (function () {
    var s = fabric.util,
      o = s.degreesToRadians,
      a = s.multiplyTransformMatrices,
      c = s.transformPoint
    s.object.extend(fabric.Object.prototype, {
      oCoords: null,
      aCoords: null,
      lineCoords: null,
      ownMatrixCache: null,
      matrixCache: null,
      controls: {},
      _getCoords: function (t, e) {
        return e
          ? t
            ? this.calcACoords()
            : this.calcLineCoords()
          : ((this.aCoords && this.lineCoords) || this.setCoords(!0),
            t ? this.aCoords : this.lineCoords)
      },
      getCoords: function (t, e) {
        return (
          (t = this._getCoords(t, e)),
          [
            new fabric.Point(t.tl.x, t.tl.y),
            new fabric.Point(t.tr.x, t.tr.y),
            new fabric.Point(t.br.x, t.br.y),
            new fabric.Point(t.bl.x, t.bl.y),
          ]
        )
      },
      intersectsWithRect: function (t, e, i, r) {
        i = this.getCoords(i, r)
        return (
          'Intersection' ===
          fabric.Intersection.intersectPolygonRectangle(i, t, e).status
        )
      },
      intersectsWithObject: function (t, e, i) {
        return (
          'Intersection' ===
            fabric.Intersection.intersectPolygonPolygon(
              this.getCoords(e, i),
              t.getCoords(e, i)
            ).status ||
          t.isContainedWithinObject(this, e, i) ||
          this.isContainedWithinObject(t, e, i)
        )
      },
      isContainedWithinObject: function (t, e, i) {
        for (
          var r = this.getCoords(e, i),
            i = e ? t.aCoords : t.lineCoords,
            n = 0,
            s = t._getImageLines(i);
          n < 4;
          n++
        )
          if (!t.containsPoint(r[n], s)) return !1
        return !0
      },
      isContainedWithinRect: function (t, e, i, r) {
        i = this.getBoundingRect(i, r)
        return (
          i.left >= t.x &&
          i.left + i.width <= e.x &&
          i.top >= t.y &&
          i.top + i.height <= e.y
        )
      },
      containsPoint: function (t, e, i, r) {
        ;(i = this._getCoords(i, r)),
          (e = e || this._getImageLines(i)),
          (r = this._findCrossPoints(t, e))
        return 0 !== r && r % 2 == 1
      },
      isOnScreen: function (t) {
        if (!this.canvas) return !1
        var e = this.canvas.vptCoords.tl,
          i = this.canvas.vptCoords.br
        return (
          !!this.getCoords(!0, t).some(function (t) {
            return t.x <= i.x && t.x >= e.x && t.y <= i.y && t.y >= e.y
          }) ||
          !!this.intersectsWithRect(e, i, !0, t) ||
          this._containsCenterOfCanvas(e, i, t)
        )
      },
      _containsCenterOfCanvas: function (t, e, i) {
        t = { x: (t.x + e.x) / 2, y: (t.y + e.y) / 2 }
        return !!this.containsPoint(t, null, !0, i)
      },
      isPartiallyOnScreen: function (t) {
        if (!this.canvas) return !1
        var e = this.canvas.vptCoords.tl,
          i = this.canvas.vptCoords.br
        return (
          !!this.intersectsWithRect(e, i, !0, t) ||
          (this.getCoords(!0, t).every(function (t) {
            return (t.x >= i.x || t.x <= e.x) && (t.y >= i.y || t.y <= e.y)
          }) &&
            this._containsCenterOfCanvas(e, i, t))
        )
      },
      _getImageLines: function (t) {
        return {
          topline: { o: t.tl, d: t.tr },
          rightline: { o: t.tr, d: t.br },
          bottomline: { o: t.br, d: t.bl },
          leftline: { o: t.bl, d: t.tl },
        }
      },
      _findCrossPoints: function (t, e) {
        var i,
          r,
          n,
          s = 0
        for (n in e)
          if (
            !(
              ((r = e[n]).o.y < t.y && r.d.y < t.y) ||
              (r.o.y >= t.y && r.d.y >= t.y) ||
              ((r.o.x === r.d.x && r.o.x >= t.x
                ? r.o.x
                : ((i = (r.d.y - r.o.y) / (r.d.x - r.o.x)),
                  -(t.y - 0 * t.x - (r.o.y - i * r.o.x)) / (0 - i))) >= t.x &&
                (s += 1),
              2 !== s)
            )
          )
            break
        return s
      },
      getBoundingRect: function (t, e) {
        t = this.getCoords(t, e)
        return s.makeBoundingBoxFromPoints(t)
      },
      getScaledWidth: function () {
        return this._getTransformedDimensions().x
      },
      getScaledHeight: function () {
        return this._getTransformedDimensions().y
      },
      _constrainScale: function (t) {
        return Math.abs(t) < this.minScaleLimit
          ? t < 0
            ? -this.minScaleLimit
            : this.minScaleLimit
          : 0 === t
          ? 1e-4
          : t
      },
      scale: function (t) {
        return this._set('scaleX', t), this._set('scaleY', t), this.setCoords()
      },
      scaleToWidth: function (t, e) {
        e = this.getBoundingRect(e).width / this.getScaledWidth()
        return this.scale(t / this.width / e)
      },
      scaleToHeight: function (t, e) {
        e = this.getBoundingRect(e).height / this.getScaledHeight()
        return this.scale(t / this.height / e)
      },
      calcLineCoords: function () {
        var t = this.getViewportTransform(),
          e = this.padding,
          i = o(this.angle),
          r = s.cos(i) * e,
          i = s.sin(i) * e,
          n = r + i,
          r = r - i,
          i = this.calcACoords(),
          i = { tl: c(i.tl, t), tr: c(i.tr, t), bl: c(i.bl, t), br: c(i.br, t) }
        return (
          e &&
            ((i.tl.x -= r),
            (i.tl.y -= n),
            (i.tr.x += n),
            (i.tr.y -= r),
            (i.bl.x -= n),
            (i.bl.y += r),
            (i.br.x += r),
            (i.br.y += n)),
          i
        )
      },
      calcOCoords: function () {
        var t = this._calcRotateMatrix(),
          e = this._calcTranslateMatrix(),
          i = this.getViewportTransform(),
          e = a(i, e),
          r = a(e, t),
          r = a(r, [1 / i[0], 0, 0, 1 / i[3], 0, 0]),
          n = this._calculateCurrentDimensions(),
          s = {}
        return (
          this.forEachControl(function (t, e, i) {
            s[e] = t.positionHandler(n, r, i)
          }),
          s
        )
      },
      calcACoords: function () {
        var t = this._calcRotateMatrix(),
          e = this._calcTranslateMatrix(),
          e = a(e, t),
          t = this._getTransformedDimensions(),
          i = t.x / 2,
          t = t.y / 2
        return {
          tl: c({ x: -i, y: -t }, e),
          tr: c({ x: i, y: -t }, e),
          bl: c({ x: -i, y: t }, e),
          br: c({ x: i, y: t }, e),
        }
      },
      setCoords: function (t) {
        return (
          (this.aCoords = this.calcACoords()),
          (this.lineCoords = this.group ? this.aCoords : this.calcLineCoords()),
          t ||
            ((this.oCoords = this.calcOCoords()),
            this._setCornerCoords && this._setCornerCoords()),
          this
        )
      },
      _calcRotateMatrix: function () {
        return s.calcRotateMatrix(this)
      },
      _calcTranslateMatrix: function () {
        var t = this.getCenterPoint()
        return [1, 0, 0, 1, t.x, t.y]
      },
      transformMatrixKey: function (t) {
        var e = '_',
          i = ''
        return (
          (i = !t && this.group ? this.group.transformMatrixKey(t) + e : i) +
          this.top +
          e +
          this.left +
          e +
          this.scaleX +
          e +
          this.scaleY +
          e +
          this.skewX +
          e +
          this.skewY +
          e +
          this.angle +
          e +
          this.originX +
          e +
          this.originY +
          e +
          this.width +
          e +
          this.height +
          e +
          this.strokeWidth +
          this.flipX +
          this.flipY
        )
      },
      calcTransformMatrix: function (t) {
        var e = this.calcOwnMatrix()
        if (t || !this.group) return e
        var t = this.transformMatrixKey(t),
          i = this.matrixCache || (this.matrixCache = {})
        return i.key === t
          ? i.value
          : (this.group && (e = a(this.group.calcTransformMatrix(!1), e)),
            (i.key = t),
            (i.value = e))
      },
      calcOwnMatrix: function () {
        var t = this.transformMatrixKey(!0),
          e = this.ownMatrixCache || (this.ownMatrixCache = {})
        if (e.key === t) return e.value
        var i = this._calcTranslateMatrix(),
          i = {
            angle: this.angle,
            translateX: i[4],
            translateY: i[5],
            scaleX: this.scaleX,
            scaleY: this.scaleY,
            skewX: this.skewX,
            skewY: this.skewY,
            flipX: this.flipX,
            flipY: this.flipY,
          }
        return (e.key = t), (e.value = s.composeMatrix(i)), e.value
      },
      _getNonTransformedDimensions: function () {
        var t = this.strokeWidth
        return { x: this.width + t, y: this.height + t }
      },
      _getTransformedDimensions: function (t, e) {
        void 0 === t && (t = this.skewX), void 0 === e && (e = this.skewY)
        var i,
          r = 0 === t && 0 === e,
          n = this.strokeUniform
            ? ((i = this.width), this.height)
            : ((i = (n = this._getNonTransformedDimensions()).x), n.y)
        if (r) return this._finalizeDimensions(i * this.scaleX, n * this.scaleY)
        r = s.sizeAfterTransform(i, n, {
          scaleX: this.scaleX,
          scaleY: this.scaleY,
          skewX: t,
          skewY: e,
        })
        return this._finalizeDimensions(r.x, r.y)
      },
      _finalizeDimensions: function (t, e) {
        return this.strokeUniform
          ? { x: t + this.strokeWidth, y: e + this.strokeWidth }
          : { x: t, y: e }
      },
      _calculateCurrentDimensions: function () {
        var t = this.getViewportTransform(),
          e = this._getTransformedDimensions()
        return c(e, t, !0).scalarAdd(2 * this.padding)
      },
    })
  })(),
  fabric.util.object.extend(fabric.Object.prototype, {
    sendToBack: function () {
      return (
        this.group
          ? fabric.StaticCanvas.prototype.sendToBack.call(this.group, this)
          : this.canvas && this.canvas.sendToBack(this),
        this
      )
    },
    bringToFront: function () {
      return (
        this.group
          ? fabric.StaticCanvas.prototype.bringToFront.call(this.group, this)
          : this.canvas && this.canvas.bringToFront(this),
        this
      )
    },
    sendBackwards: function (t) {
      return (
        this.group
          ? fabric.StaticCanvas.prototype.sendBackwards.call(
              this.group,
              this,
              t
            )
          : this.canvas && this.canvas.sendBackwards(this, t),
        this
      )
    },
    bringForward: function (t) {
      return (
        this.group
          ? fabric.StaticCanvas.prototype.bringForward.call(this.group, this, t)
          : this.canvas && this.canvas.bringForward(this, t),
        this
      )
    },
    moveTo: function (t) {
      return (
        this.group && 'activeSelection' !== this.group.type
          ? fabric.StaticCanvas.prototype.moveTo.call(this.group, this, t)
          : this.canvas && this.canvas.moveTo(this, t),
        this
      )
    },
  }),
  (function () {
    function u(t, e) {
      var i
      return e
        ? e.toLive
          ? t + ': url(#SVGID_' + e.id + '); '
          : ((i = t + ': ' + (e = new fabric.Color(e)).toRgb() + '; '),
            1 !== (e = e.getAlpha()) &&
              (i += t + '-opacity: ' + e.toString() + '; '),
            i)
        : t + ': none; '
    }
    var i = fabric.util.toFixed
    fabric.util.object.extend(fabric.Object.prototype, {
      getSvgStyles: function (t) {
        var e = this.fillRule || 'nonzero',
          i = this.strokeWidth || '0',
          r = this.strokeDashArray ? this.strokeDashArray.join(' ') : 'none',
          n = this.strokeDashOffset || '0',
          s = this.strokeLineCap || 'butt',
          o = this.strokeLineJoin || 'miter',
          a = this.strokeMiterLimit || '4',
          c = void 0 !== this.opacity ? this.opacity : '1',
          h = this.visible ? '' : ' visibility: hidden;',
          t = t ? '' : this.getSvgFilter(),
          l = u('fill', this.fill)
        return [
          u('stroke', this.stroke),
          'stroke-width: ',
          i,
          '; ',
          'stroke-dasharray: ',
          r,
          '; ',
          'stroke-linecap: ',
          s,
          '; ',
          'stroke-dashoffset: ',
          n,
          '; ',
          'stroke-linejoin: ',
          o,
          '; ',
          'stroke-miterlimit: ',
          a,
          '; ',
          l,
          'fill-rule: ',
          e,
          '; ',
          'opacity: ',
          c,
          ';',
          t,
          h,
        ].join('')
      },
      getSvgSpanStyles: function (t, e) {
        var i = '; ',
          r = t.fontFamily
            ? 'font-family: ' +
              (-1 === t.fontFamily.indexOf("'") &&
              -1 === t.fontFamily.indexOf('"')
                ? "'" + t.fontFamily + "'"
                : t.fontFamily) +
              i
            : '',
          n = t.strokeWidth ? 'stroke-width: ' + t.strokeWidth + i : '',
          s = t.fontSize ? 'font-size: ' + t.fontSize + 'px' + i : '',
          o = t.fontStyle ? 'font-style: ' + t.fontStyle + i : '',
          a = t.fontWeight ? 'font-weight: ' + t.fontWeight + i : '',
          c = t.fill ? u('fill', t.fill) : '',
          h = t.stroke ? u('stroke', t.stroke) : '',
          l = this.getSvgTextDecoration(t)
        return [
          h,
          n,
          r,
          s,
          o,
          a,
          (l = l && 'text-decoration: ' + l + i),
          c,
          t.deltaY ? 'baseline-shift: ' + -t.deltaY + '; ' : '',
          e ? 'white-space: pre; ' : '',
        ].join('')
      },
      getSvgTextDecoration: function (e) {
        return ['overline', 'underline', 'line-through']
          .filter(function (t) {
            return e[t.replace('-', '')]
          })
          .join(' ')
      },
      getSvgFilter: function () {
        return this.shadow ? 'filter: url(#SVGID_' + this.shadow.id + ');' : ''
      },
      getSvgCommons: function () {
        return [
          this.id ? 'id="' + this.id + '" ' : '',
          this.clipPath
            ? 'clip-path="url(#' + this.clipPath.clipPathId + ')" '
            : '',
        ].join('')
      },
      getSvgTransform: function (t, e) {
        t = t ? this.calcTransformMatrix() : this.calcOwnMatrix()
        return 'transform="' + fabric.util.matrixToSVG(t) + (e || '') + '" '
      },
      _setSVGBg: function (t) {
        var e
        this.backgroundColor &&
          ((e = fabric.Object.NUM_FRACTION_DIGITS),
          t.push(
            '\t\t<rect ',
            this._getFillAttributes(this.backgroundColor),
            ' x="',
            i(-this.width / 2, e),
            '" y="',
            i(-this.height / 2, e),
            '" width="',
            i(this.width, e),
            '" height="',
            i(this.height, e),
            '"></rect>\n'
          ))
      },
      toSVG: function (t) {
        return this._createBaseSVGMarkup(this._toSVG(t), { reviver: t })
      },
      toClipPathSVG: function (t) {
        return (
          '\t' +
          this._createBaseClipPathSVGMarkup(this._toSVG(t), { reviver: t })
        )
      },
      _createBaseClipPathSVGMarkup: function (t, e) {
        var i = (e = e || {}).reviver,
          e = e.additionalTransform || '',
          e = [this.getSvgTransform(!0, e), this.getSvgCommons()].join(''),
          r = t.indexOf('COMMON_PARTS')
        return (t[r] = e), i ? i(t.join('')) : t.join('')
      },
      _createBaseSVGMarkup: function (t, e) {
        var i,
          r = (e = e || {}).noStyle,
          n = e.reviver,
          s = r ? '' : 'style="' + this.getSvgStyles() + '" ',
          o = e.withShadow ? 'style="' + this.getSvgFilter() + '" ' : '',
          a = this.clipPath,
          c = this.strokeUniform ? 'vector-effect="non-scaling-stroke" ' : '',
          h = a && a.absolutePositioned,
          l = this.stroke,
          u = this.fill,
          f = this.shadow,
          d = [],
          g = t.indexOf('COMMON_PARTS'),
          e = e.additionalTransform
        return (
          a &&
            ((a.clipPathId = 'CLIPPATH_' + fabric.Object.__uid++),
            (i =
              '<clipPath id="' +
              a.clipPathId +
              '" >\n' +
              a.toClipPathSVG(n) +
              '</clipPath>\n')),
          h && d.push('<g ', o, this.getSvgCommons(), ' >\n'),
          d.push(
            '<g ',
            this.getSvgTransform(!1),
            h ? '' : o + this.getSvgCommons(),
            ' >\n'
          ),
          (o = [
            s,
            c,
            r ? '' : this.addPaintOrder(),
            ' ',
            e ? 'transform="' + e + '" ' : '',
          ].join('')),
          (t[g] = o),
          u && u.toLive && d.push(u.toSVG(this)),
          l && l.toLive && d.push(l.toSVG(this)),
          f && d.push(f.toSVG(this)),
          a && d.push(i),
          d.push(t.join('')),
          d.push('</g>\n'),
          h && d.push('</g>\n'),
          n ? n(d.join('')) : d.join('')
        )
      },
      addPaintOrder: function () {
        return 'fill' !== this.paintFirst
          ? ' paint-order="' + this.paintFirst + '" '
          : ''
      },
    })
  })(),
  (function () {
    var n = fabric.util.object.extend,
      r = 'stateProperties'
    function s(e, t, i) {
      var r = {}
      i.forEach(function (t) {
        r[t] = e[t]
      }),
        n(e[t], r, !0)
    }
    fabric.util.object.extend(fabric.Object.prototype, {
      hasStateChanged: function (t) {
        var e = '_' + (t = t || r)
        return (
          Object.keys(this[e]).length < this[t].length ||
          !(function t(e, i, r) {
            if (e === i) return 1
            if (Array.isArray(e)) {
              if (Array.isArray(i) && e.length === i.length) {
                for (var n = 0, s = e.length; n < s; n++)
                  if (!t(e[n], i[n])) return
                return 1
              }
            } else if (e && 'object' == typeof e) {
              var o,
                a = Object.keys(e)
              if (
                i &&
                'object' == typeof i &&
                (r || a.length === Object.keys(i).length)
              ) {
                for (n = 0, s = a.length; n < s; n++)
                  if (
                    'canvas' !== (o = a[n]) &&
                    'group' !== o &&
                    !t(e[o], i[o])
                  )
                    return
                return 1
              }
            }
          })(this[e], this, !0)
        )
      },
      saveState: function (t) {
        var e = (t && t.propertySet) || r,
          i = '_' + e
        return this[i]
          ? (s(this, i, this[e]),
            t && t.stateProperties && s(this, i, t.stateProperties),
            this)
          : this.setupState(t)
      },
      setupState: function (t) {
        var e = (t = t || {}).propertySet || r
        return (this['_' + (t.propertySet = e)] = {}), this.saveState(t), this
      },
    })
  })(),
  (function () {
    var n = fabric.util.degreesToRadians
    fabric.util.object.extend(fabric.Object.prototype, {
      _findTargetCorner: function (t, e) {
        if (
          !this.hasControls ||
          this.group ||
          !this.canvas ||
          this.canvas._activeObject !== this
        )
          return !1
        var i,
          r,
          n = t.x,
          s = t.y,
          o = Object.keys(this.oCoords),
          a = o.length - 1
        for (this.__corner = 0; 0 <= a; a--)
          if (
            ((r = o[a]),
            this.isControlVisible(r) &&
              ((i = this._getImageLines(
                e ? this.oCoords[r].touchCorner : this.oCoords[r].corner
              )),
              0 !== (i = this._findCrossPoints({ x: n, y: s }, i)) &&
                i % 2 == 1))
          )
            return (this.__corner = r)
        return !1
      },
      forEachControl: function (t) {
        for (var e in this.controls) t(this.controls[e], e, this)
      },
      _setCornerCoords: function () {
        var t,
          e = this.oCoords
        for (t in e) {
          var i = this.controls[t]
          ;(e[t].corner = i.calcCornerCoords(
            this.angle,
            this.cornerSize,
            e[t].x,
            e[t].y,
            !1
          )),
            (e[t].touchCorner = i.calcCornerCoords(
              this.angle,
              this.touchCornerSize,
              e[t].x,
              e[t].y,
              !0
            ))
        }
      },
      drawSelectionBackground: function (t) {
        if (
          !this.selectionBackgroundColor ||
          (this.canvas && !this.canvas.interactive) ||
          (this.canvas && this.canvas._activeObject !== this)
        )
          return this
        t.save()
        var e = this.getCenterPoint(),
          i = this._calculateCurrentDimensions(),
          r = this.canvas.viewportTransform
        return (
          t.translate(e.x, e.y),
          t.scale(1 / r[0], 1 / r[3]),
          t.rotate(n(this.angle)),
          (t.fillStyle = this.selectionBackgroundColor),
          t.fillRect(-i.x / 2, -i.y / 2, i.x, i.y),
          t.restore(),
          this
        )
      },
      drawBorders: function (r, t) {
        t = t || {}
        var e = this._calculateCurrentDimensions(),
          i = this.borderScaleFactor,
          n = e.x + i,
          s = e.y + i,
          e = (void 0 !== t.hasControls ? t : this).hasControls,
          o = !1
        return (
          r.save(),
          (r.strokeStyle = t.borderColor || this.borderColor),
          this._setLineDash(r, t.borderDashArray || this.borderDashArray),
          r.strokeRect(-n / 2, -s / 2, n, s),
          e &&
            (r.beginPath(),
            this.forEachControl(function (t, e, i) {
              t.withConnection &&
                t.getVisibility(i, e) &&
                ((o = !0),
                r.moveTo(t.x * n, t.y * s),
                r.lineTo(t.x * n + t.offsetX, t.y * s + t.offsetY))
            }),
            o && r.stroke()),
          r.restore(),
          this
        )
      },
      drawBordersInGroup: function (t, e, i) {
        i = i || {}
        var r = fabric.util.sizeAfterTransform(this.width, this.height, e),
          n = this.strokeWidth,
          s = this.strokeUniform,
          o = this.borderScaleFactor,
          a = r.x + n * (s ? this.canvas.getZoom() : e.scaleX) + o,
          r = r.y + n * (s ? this.canvas.getZoom() : e.scaleY) + o
        return (
          t.save(),
          this._setLineDash(t, i.borderDashArray || this.borderDashArray),
          (t.strokeStyle = i.borderColor || this.borderColor),
          t.strokeRect(-a / 2, -r / 2, a, r),
          t.restore(),
          this
        )
      },
      drawControls: function (r, n) {
        ;(n = n || {}), r.save()
        var s,
          o,
          t = this.canvas.getRetinaScaling()
        return (
          r.setTransform(t, 0, 0, t, 0, 0),
          (r.strokeStyle = r.fillStyle = n.cornerColor || this.cornerColor),
          this.transparentCorners ||
            (r.strokeStyle = n.cornerStrokeColor || this.cornerStrokeColor),
          this._setLineDash(r, n.cornerDashArray || this.cornerDashArray),
          this.setCoords(),
          this.group && (s = this.group.calcTransformMatrix()),
          this.forEachControl(function (t, e, i) {
            ;(o = i.oCoords[e]),
              t.getVisibility(i, e) &&
                (s && (o = fabric.util.transformPoint(o, s)),
                t.render(r, o.x, o.y, n, i))
          }),
          r.restore(),
          this
        )
      },
      isControlVisible: function (t) {
        return this.controls[t] && this.controls[t].getVisibility(this, t)
      },
      setControlVisible: function (t, e) {
        return (
          this._controlsVisibility || (this._controlsVisibility = {}),
          (this._controlsVisibility[t] = e),
          this
        )
      },
      setControlsVisibility: function (t) {
        for (var e in (t = t || {})) this.setControlVisible(e, t[e])
        return this
      },
      onDeselect: function () {},
      onSelect: function () {},
    })
  })(),
  fabric.util.object.extend(fabric.StaticCanvas.prototype, {
    FX_DURATION: 500,
    fxCenterObjectH: function (e, t) {
      function i() {}
      var r = (t = t || {}).onComplete || i,
        n = t.onChange || i,
        s = this
      return fabric.util.animate({
        target: this,
        startValue: e.left,
        endValue: this.getCenterPoint().x,
        duration: this.FX_DURATION,
        onChange: function (t) {
          e.set('left', t), s.requestRenderAll(), n()
        },
        onComplete: function () {
          e.setCoords(), r()
        },
      })
    },
    fxCenterObjectV: function (e, t) {
      function i() {}
      var r = (t = t || {}).onComplete || i,
        n = t.onChange || i,
        s = this
      return fabric.util.animate({
        target: this,
        startValue: e.top,
        endValue: this.getCenterPoint().y,
        duration: this.FX_DURATION,
        onChange: function (t) {
          e.set('top', t), s.requestRenderAll(), n()
        },
        onComplete: function () {
          e.setCoords(), r()
        },
      })
    },
    fxRemove: function (e, t) {
      function i() {}
      var r = (t = t || {}).onComplete || i,
        n = t.onChange || i,
        s = this
      return fabric.util.animate({
        target: this,
        startValue: e.opacity,
        endValue: 0,
        duration: this.FX_DURATION,
        onChange: function (t) {
          e.set('opacity', t), s.requestRenderAll(), n()
        },
        onComplete: function () {
          s.remove(e), r()
        },
      })
    },
  }),
  fabric.util.object.extend(fabric.Object.prototype, {
    animate: function () {
      if (arguments[0] && 'object' == typeof arguments[0]) {
        var t,
          e,
          i = [],
          r = []
        for (t in arguments[0]) i.push(t)
        for (var n = 0, s = i.length; n < s; n++)
          (t = i[n]),
            (e = n !== s - 1),
            r.push(this._animate(t, arguments[0][t], arguments[1], e))
        return r
      }
      return this._animate.apply(this, arguments)
    },
    _animate: function (r, t, n, s) {
      var o,
        a = this,
        e =
          ((t = t.toString()),
          (n = n ? fabric.util.object.clone(n) : {}),
          ~r.indexOf('.') && (o = r.split('.')),
          -1 < a.colorProperties.indexOf(r) ||
            (o && -1 < a.colorProperties.indexOf(o[1]))),
        i = o ? this.get(o[0])[o[1]] : this.get(r),
        i =
          ('from' in n || (n.from = i),
          e ||
            (t = ~t.indexOf('=')
              ? i + parseFloat(t.replace('=', ''))
              : parseFloat(t)),
          {
            target: this,
            startValue: n.from,
            endValue: t,
            byValue: n.by,
            easing: n.easing,
            duration: n.duration,
            abort:
              n.abort &&
              function (t, e, i) {
                return n.abort.call(a, t, e, i)
              },
            onChange: function (t, e, i) {
              o ? (a[o[0]][o[1]] = t) : a.set(r, t),
                s || (n.onChange && n.onChange(t, e, i))
            },
            onComplete: function (t, e, i) {
              s || (a.setCoords(), n.onComplete && n.onComplete(t, e, i))
            },
          })
      return e
        ? fabric.util.animateColor(i.startValue, i.endValue, i.duration, i)
        : fabric.util.animate(i)
    },
  }),
  (function (t) {
    'use strict'
    var n = t.fabric || (t.fabric = {}),
      s = n.util.object.extend,
      r = n.util.object.clone,
      i = { x1: 1, x2: 1, y1: 1, y2: 1 }
    function e(t, e) {
      var i = t.origin,
        r = t.axis1,
        n = t.axis2,
        s = t.dimension,
        o = e.nearest,
        a = e.center,
        c = e.farthest
      return function () {
        switch (this.get(i)) {
          case o:
            return Math.min(this.get(r), this.get(n))
          case a:
            return Math.min(this.get(r), this.get(n)) + 0.5 * this.get(s)
          case c:
            return Math.max(this.get(r), this.get(n))
        }
      }
    }
    n.Line
      ? n.warn('fabric.Line is already defined')
      : ((n.Line = n.util.createClass(n.Object, {
          type: 'line',
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 0,
          cacheProperties: n.Object.prototype.cacheProperties.concat(
            'x1',
            'x2',
            'y1',
            'y2'
          ),
          initialize: function (t, e) {
            ;(t = t || [0, 0, 0, 0]),
              this.callSuper('initialize', e),
              this.set('x1', t[0]),
              this.set('y1', t[1]),
              this.set('x2', t[2]),
              this.set('y2', t[3]),
              this._setWidthHeight(e)
          },
          _setWidthHeight: function (t) {
            ;(t = t || {}),
              (this.width = Math.abs(this.x2 - this.x1)),
              (this.height = Math.abs(this.y2 - this.y1)),
              (this.left = 'left' in t ? t.left : this._getLeftToOriginX()),
              (this.top = 'top' in t ? t.top : this._getTopToOriginY())
          },
          _set: function (t, e) {
            return (
              this.callSuper('_set', t, e),
              void 0 !== i[t] && this._setWidthHeight(),
              this
            )
          },
          _getLeftToOriginX: e(
            { origin: 'originX', axis1: 'x1', axis2: 'x2', dimension: 'width' },
            { nearest: 'left', center: 'center', farthest: 'right' }
          ),
          _getTopToOriginY: e(
            {
              origin: 'originY',
              axis1: 'y1',
              axis2: 'y2',
              dimension: 'height',
            },
            { nearest: 'top', center: 'center', farthest: 'bottom' }
          ),
          _render: function (t) {
            t.beginPath()
            var e = this.calcLinePoints(),
              e =
                (t.moveTo(e.x1, e.y1),
                t.lineTo(e.x2, e.y2),
                (t.lineWidth = this.strokeWidth),
                t.strokeStyle)
            ;(t.strokeStyle = this.stroke || t.fillStyle),
              this.stroke && this._renderStroke(t),
              (t.strokeStyle = e)
          },
          _findCenterFromElement: function () {
            return { x: (this.x1 + this.x2) / 2, y: (this.y1 + this.y2) / 2 }
          },
          toObject: function (t) {
            return s(this.callSuper('toObject', t), this.calcLinePoints())
          },
          _getNonTransformedDimensions: function () {
            var t = this.callSuper('_getNonTransformedDimensions')
            return (
              'butt' === this.strokeLineCap &&
                (0 === this.width && (t.y -= this.strokeWidth),
                0 === this.height && (t.x -= this.strokeWidth)),
              t
            )
          },
          calcLinePoints: function () {
            var t = this.x1 <= this.x2 ? -1 : 1,
              e = this.y1 <= this.y2 ? -1 : 1,
              i = t * this.width * 0.5,
              r = e * this.height * 0.5
            return {
              x1: i,
              x2: t * this.width * -0.5,
              y1: r,
              y2: e * this.height * -0.5,
            }
          },
          _toSVG: function () {
            var t = this.calcLinePoints()
            return [
              '<line ',
              'COMMON_PARTS',
              'x1="',
              t.x1,
              '" y1="',
              t.y1,
              '" x2="',
              t.x2,
              '" y2="',
              t.y2,
              '" />\n',
            ]
          },
        })),
        (n.Line.ATTRIBUTE_NAMES = n.SHARED_ATTRIBUTES.concat(
          'x1 y1 x2 y2'.split(' ')
        )),
        (n.Line.fromElement = function (t, e, i) {
          i = i || {}
          var t = n.parseAttributes(t, n.Line.ATTRIBUTE_NAMES),
            r = [t.x1 || 0, t.y1 || 0, t.x2 || 0, t.y2 || 0]
          e(new n.Line(r, s(t, i)))
        }),
        (n.Line.fromObject = function (t, e) {
          var i = r(t, !0)
          ;(i.points = [t.x1, t.y1, t.x2, t.y2]),
            n.Object._fromObject(
              'Line',
              i,
              function (t) {
                delete t.points, e && e(t)
              },
              'points'
            )
        }))
  })('undefined' != typeof exports ? exports : this),
  (function (t) {
    'use strict'
    var n = t.fabric || (t.fabric = {}),
      s = n.util.degreesToRadians
    n.Circle
      ? n.warn('fabric.Circle is already defined.')
      : ((n.Circle = n.util.createClass(n.Object, {
          type: 'circle',
          radius: 0,
          startAngle: 0,
          endAngle: 360,
          cacheProperties: n.Object.prototype.cacheProperties.concat(
            'radius',
            'startAngle',
            'endAngle'
          ),
          _set: function (t, e) {
            return (
              this.callSuper('_set', t, e),
              'radius' === t && this.setRadius(e),
              this
            )
          },
          toObject: function (t) {
            return this.callSuper(
              'toObject',
              ['radius', 'startAngle', 'endAngle'].concat(t)
            )
          },
          _toSVG: function () {
            var t,
              e,
              i,
              r = (this.endAngle - this.startAngle) % 360
            return 0 == r
              ? [
                  '<circle ',
                  'COMMON_PARTS',
                  'cx="0" cy="0" ',
                  'r="',
                  this.radius,
                  '" />\n',
                ]
              : ((t = s(this.startAngle)),
                (e = s(this.endAngle)),
                (i = this.radius),
                [
                  '<path d="M ' + n.util.cos(t) * i + ' ' + n.util.sin(t) * i,
                  ' A ' + i + ' ' + i,
                  ' 0 ',
                  +(180 < r ? '1' : '0') + ' 1',
                  ' ' + n.util.cos(e) * i + ' ' + n.util.sin(e) * i,
                  '" ',
                  'COMMON_PARTS',
                  ' />\n',
                ])
          },
          _render: function (t) {
            t.beginPath(),
              t.arc(
                0,
                0,
                this.radius,
                s(this.startAngle),
                s(this.endAngle),
                !1
              ),
              this._renderPaintInOrder(t)
          },
          getRadiusX: function () {
            return this.get('radius') * this.get('scaleX')
          },
          getRadiusY: function () {
            return this.get('radius') * this.get('scaleY')
          },
          setRadius: function (t) {
            return (
              (this.radius = t), this.set('width', 2 * t).set('height', 2 * t)
            )
          },
        })),
        (n.Circle.ATTRIBUTE_NAMES = n.SHARED_ATTRIBUTES.concat(
          'cx cy r'.split(' ')
        )),
        (n.Circle.fromElement = function (t, e) {
          var i,
            t = n.parseAttributes(t, n.Circle.ATTRIBUTE_NAMES)
          if (!('radius' in (i = t) && 0 <= i.radius))
            throw new Error(
              'value of `r` attribute is required and can not be negative'
            )
          ;(t.left = (t.left || 0) - t.radius),
            (t.top = (t.top || 0) - t.radius),
            e(new n.Circle(t))
        }),
        (n.Circle.fromObject = function (t, e) {
          n.Object._fromObject('Circle', t, e)
        }))
  })('undefined' != typeof exports ? exports : this),
  (function (t) {
    'use strict'
    var i = t.fabric || (t.fabric = {})
    i.Triangle
      ? i.warn('fabric.Triangle is already defined')
      : ((i.Triangle = i.util.createClass(i.Object, {
          type: 'triangle',
          width: 100,
          height: 100,
          _render: function (t) {
            var e = this.width / 2,
              i = this.height / 2
            t.beginPath(),
              t.moveTo(-e, i),
              t.lineTo(0, -i),
              t.lineTo(e, i),
              t.closePath(),
              this._renderPaintInOrder(t)
          },
          _toSVG: function () {
            var t = this.width / 2,
              e = this.height / 2
            return [
              '<polygon ',
              'COMMON_PARTS',
              'points="',
              [-t + ' ' + e, '0 ' + -e, t + ' ' + e].join(','),
              '" />',
            ]
          },
        })),
        (i.Triangle.fromObject = function (t, e) {
          return i.Object._fromObject('Triangle', t, e)
        }))
  })('undefined' != typeof exports ? exports : this),
  (function (t) {
    'use strict'
    var i = t.fabric || (t.fabric = {}),
      e = 2 * Math.PI
    i.Ellipse
      ? i.warn('fabric.Ellipse is already defined.')
      : ((i.Ellipse = i.util.createClass(i.Object, {
          type: 'ellipse',
          rx: 0,
          ry: 0,
          cacheProperties: i.Object.prototype.cacheProperties.concat(
            'rx',
            'ry'
          ),
          initialize: function (t) {
            this.callSuper('initialize', t),
              this.set('rx', (t && t.rx) || 0),
              this.set('ry', (t && t.ry) || 0)
          },
          _set: function (t, e) {
            switch ((this.callSuper('_set', t, e), t)) {
              case 'rx':
                ;(this.rx = e), this.set('width', 2 * e)
                break
              case 'ry':
                ;(this.ry = e), this.set('height', 2 * e)
            }
            return this
          },
          getRx: function () {
            return this.get('rx') * this.get('scaleX')
          },
          getRy: function () {
            return this.get('ry') * this.get('scaleY')
          },
          toObject: function (t) {
            return this.callSuper('toObject', ['rx', 'ry'].concat(t))
          },
          _toSVG: function () {
            return [
              '<ellipse ',
              'COMMON_PARTS',
              'cx="0" cy="0" ',
              'rx="',
              this.rx,
              '" ry="',
              this.ry,
              '" />\n',
            ]
          },
          _render: function (t) {
            t.beginPath(),
              t.save(),
              t.transform(1, 0, 0, this.ry / this.rx, 0, 0),
              t.arc(0, 0, this.rx, 0, e, !1),
              t.restore(),
              this._renderPaintInOrder(t)
          },
        })),
        (i.Ellipse.ATTRIBUTE_NAMES = i.SHARED_ATTRIBUTES.concat(
          'cx cy rx ry'.split(' ')
        )),
        (i.Ellipse.fromElement = function (t, e) {
          t = i.parseAttributes(t, i.Ellipse.ATTRIBUTE_NAMES)
          ;(t.left = (t.left || 0) - t.rx),
            (t.top = (t.top || 0) - t.ry),
            e(new i.Ellipse(t))
        }),
        (i.Ellipse.fromObject = function (t, e) {
          i.Object._fromObject('Ellipse', t, e)
        }))
  })('undefined' != typeof exports ? exports : this),
  (function (t) {
    'use strict'
    var r = t.fabric || (t.fabric = {}),
      n = r.util.object.extend
    r.Rect
      ? r.warn('fabric.Rect is already defined')
      : ((r.Rect = r.util.createClass(r.Object, {
          stateProperties: r.Object.prototype.stateProperties.concat(
            'rx',
            'ry'
          ),
          type: 'rect',
          rx: 0,
          ry: 0,
          cacheProperties: r.Object.prototype.cacheProperties.concat(
            'rx',
            'ry'
          ),
          initialize: function (t) {
            this.callSuper('initialize', t), this._initRxRy()
          },
          _initRxRy: function () {
            this.rx && !this.ry
              ? (this.ry = this.rx)
              : this.ry && !this.rx && (this.rx = this.ry)
          },
          _render: function (t) {
            var e = this.rx ? Math.min(this.rx, this.width / 2) : 0,
              i = this.ry ? Math.min(this.ry, this.height / 2) : 0,
              r = this.width,
              n = this.height,
              s = -this.width / 2,
              o = -this.height / 2,
              a = 0 !== e || 0 !== i,
              c = 0.4477152502
            t.beginPath(),
              t.moveTo(s + e, o),
              t.lineTo(s + r - e, o),
              a &&
                t.bezierCurveTo(
                  s + r - c * e,
                  o,
                  s + r,
                  o + c * i,
                  s + r,
                  o + i
                ),
              t.lineTo(s + r, o + n - i),
              a &&
                t.bezierCurveTo(
                  s + r,
                  o + n - c * i,
                  s + r - c * e,
                  o + n,
                  s + r - e,
                  o + n
                ),
              t.lineTo(s + e, o + n),
              a &&
                t.bezierCurveTo(
                  s + c * e,
                  o + n,
                  s,
                  o + n - c * i,
                  s,
                  o + n - i
                ),
              t.lineTo(s, o + i),
              a && t.bezierCurveTo(s, o + c * i, s + c * e, o, s + e, o),
              t.closePath(),
              this._renderPaintInOrder(t)
          },
          toObject: function (t) {
            return this.callSuper('toObject', ['rx', 'ry'].concat(t))
          },
          _toSVG: function () {
            return [
              '<rect ',
              'COMMON_PARTS',
              'x="',
              -this.width / 2,
              '" y="',
              -this.height / 2,
              '" rx="',
              this.rx,
              '" ry="',
              this.ry,
              '" width="',
              this.width,
              '" height="',
              this.height,
              '" />\n',
            ]
          },
        })),
        (r.Rect.ATTRIBUTE_NAMES = r.SHARED_ATTRIBUTES.concat(
          'x y rx ry width height'.split(' ')
        )),
        (r.Rect.fromElement = function (t, e, i) {
          if (!t) return e(null)
          i = i || {}
          ;(t = r.parseAttributes(t, r.Rect.ATTRIBUTE_NAMES)),
            (t.left = t.left || 0),
            (t.top = t.top || 0),
            (t.height = t.height || 0),
            (t.width = t.width || 0),
            (i = new r.Rect(n(i ? r.util.object.clone(i) : {}, t)))
          ;(i.visible = i.visible && 0 < i.width && 0 < i.height), e(i)
        }),
        (r.Rect.fromObject = function (t, e) {
          return r.Object._fromObject('Rect', t, e)
        }))
  })('undefined' != typeof exports ? exports : this),
  (function (t) {
    'use strict'
    var o = t.fabric || (t.fabric = {}),
      s = o.util.object.extend,
      r = o.util.array.min,
      n = o.util.array.max,
      a = o.util.toFixed,
      e = o.util.projectStrokeOnPoints
    o.Polyline
      ? o.warn('fabric.Polyline is already defined')
      : ((o.Polyline = o.util.createClass(o.Object, {
          type: 'polyline',
          points: null,
          exactBoundingBox: !1,
          cacheProperties: o.Object.prototype.cacheProperties.concat('points'),
          initialize: function (t, e) {
            ;(e = e || {}),
              (this.points = t || []),
              this.callSuper('initialize', e),
              this._setPositionDimensions(e)
          },
          _projectStrokeOnPoints: function () {
            return e(this.points, this, !0)
          },
          _setPositionDimensions: function (t) {
            var e,
              i = this._calcDimensions(t),
              r = this.exactBoundingBox ? this.strokeWidth : 0
            ;(this.width = i.width - r),
              (this.height = i.height - r),
              t.fromSVG ||
                (e = this.translateToGivenOrigin(
                  {
                    x: i.left - this.strokeWidth / 2 + r / 2,
                    y: i.top - this.strokeWidth / 2 + r / 2,
                  },
                  'left',
                  'top',
                  this.originX,
                  this.originY
                )),
              void 0 === t.left && (this.left = t.fromSVG ? i.left : e.x),
              void 0 === t.top && (this.top = t.fromSVG ? i.top : e.y),
              (this.pathOffset = {
                x: i.left + this.width / 2 + r / 2,
                y: i.top + this.height / 2 + r / 2,
              })
          },
          _calcDimensions: function () {
            var t = this.exactBoundingBox
                ? this._projectStrokeOnPoints()
                : this.points,
              e = r(t, 'x') || 0,
              i = r(t, 'y') || 0
            return {
              left: e,
              top: i,
              width: (n(t, 'x') || 0) - e,
              height: (n(t, 'y') || 0) - i,
            }
          },
          toObject: function (t) {
            return s(this.callSuper('toObject', t), {
              points: this.points.concat(),
            })
          },
          _toSVG: function () {
            for (
              var t = [],
                e = this.pathOffset.x,
                i = this.pathOffset.y,
                r = o.Object.NUM_FRACTION_DIGITS,
                n = 0,
                s = this.points.length;
              n < s;
              n++
            )
              t.push(
                a(this.points[n].x - e, r),
                ',',
                a(this.points[n].y - i, r),
                ' '
              )
            return [
              '<' + this.type + ' ',
              'COMMON_PARTS',
              'points="',
              t.join(''),
              '" />\n',
            ]
          },
          commonRender: function (t) {
            var e,
              i = this.points.length,
              r = this.pathOffset.x,
              n = this.pathOffset.y
            if (!i || isNaN(this.points[i - 1].y)) return !1
            t.beginPath(), t.moveTo(this.points[0].x - r, this.points[0].y - n)
            for (var s = 0; s < i; s++)
              (e = this.points[s]), t.lineTo(e.x - r, e.y - n)
            return !0
          },
          _render: function (t) {
            this.commonRender(t) && this._renderPaintInOrder(t)
          },
          complexity: function () {
            return this.get('points').length
          },
        })),
        (o.Polyline.ATTRIBUTE_NAMES = o.SHARED_ATTRIBUTES.concat()),
        (o.Polyline.fromElementGenerator = function (n) {
          return function (t, e, i) {
            if (!t) return e(null)
            i = i || {}
            var r = o.parsePointsAttribute(t.getAttribute('points')),
              t = o.parseAttributes(t, o[n].ATTRIBUTE_NAMES)
            ;(t.fromSVG = !0), e(new o[n](r, s(t, i)))
          }
        }),
        (o.Polyline.fromElement = o.Polyline.fromElementGenerator('Polyline')),
        (o.Polyline.fromObject = function (t, e) {
          return o.Object._fromObject('Polyline', t, e, 'points')
        }))
  })('undefined' != typeof exports ? exports : this),
  (function (t) {
    'use strict'
    var i = t.fabric || (t.fabric = {}),
      e = i.util.projectStrokeOnPoints
    i.Polygon
      ? i.warn('fabric.Polygon is already defined')
      : ((i.Polygon = i.util.createClass(i.Polyline, {
          type: 'polygon',
          _projectStrokeOnPoints: function () {
            return e(this.points, this)
          },
          _render: function (t) {
            this.commonRender(t) && (t.closePath(), this._renderPaintInOrder(t))
          },
        })),
        (i.Polygon.ATTRIBUTE_NAMES = i.SHARED_ATTRIBUTES.concat()),
        (i.Polygon.fromElement = i.Polyline.fromElementGenerator('Polygon')),
        (i.Polygon.fromObject = function (t, e) {
          i.Object._fromObject('Polygon', t, e, 'points')
        }))
  })('undefined' != typeof exports ? exports : this),
  (function (t) {
    'use strict'
    var f = t.fabric || (t.fabric = {}),
      d = f.util.array.min,
      g = f.util.array.max,
      r = f.util.object.extend,
      i = f.util.object.clone,
      e = f.util.toFixed
    f.Path
      ? f.warn('fabric.Path is already defined')
      : ((f.Path = f.util.createClass(f.Object, {
          type: 'path',
          path: null,
          cacheProperties: f.Object.prototype.cacheProperties.concat(
            'path',
            'fillRule'
          ),
          stateProperties: f.Object.prototype.stateProperties.concat('path'),
          initialize: function (t, e) {
            delete (e = i(e || {})).path,
              this.callSuper('initialize', e),
              this._setPath(t || [], e)
          },
          _setPath: function (t, e) {
            ;(this.path = f.util.makePathSimpler(
              Array.isArray(t) ? t : f.util.parsePath(t)
            )),
              f.Polyline.prototype._setPositionDimensions.call(this, e || {})
          },
          _renderPathCommands: function (t) {
            var e,
              i = 0,
              r = 0,
              n = 0,
              s = 0,
              o = 0,
              a = 0,
              c = -this.pathOffset.x,
              h = -this.pathOffset.y
            t.beginPath()
            for (var l = 0, u = this.path.length; l < u; ++l)
              switch ((e = this.path[l])[0]) {
                case 'L':
                  ;(n = e[1]), (s = e[2]), t.lineTo(n + c, s + h)
                  break
                case 'M':
                  ;(i = n = e[1]), (r = s = e[2]), t.moveTo(n + c, s + h)
                  break
                case 'C':
                  ;(n = e[5]),
                    (s = e[6]),
                    (o = e[3]),
                    (a = e[4]),
                    t.bezierCurveTo(
                      e[1] + c,
                      e[2] + h,
                      o + c,
                      a + h,
                      n + c,
                      s + h
                    )
                  break
                case 'Q':
                  t.quadraticCurveTo(e[1] + c, e[2] + h, e[3] + c, e[4] + h),
                    (n = e[3]),
                    (s = e[4]),
                    (o = e[1]),
                    (a = e[2])
                  break
                case 'z':
                case 'Z':
                  ;(n = i), (s = r), t.closePath()
              }
          },
          _render: function (t) {
            this._renderPathCommands(t), this._renderPaintInOrder(t)
          },
          toString: function () {
            return (
              '#<fabric.Path (' +
              this.complexity() +
              '): { "top": ' +
              this.top +
              ', "left": ' +
              this.left +
              ' }>'
            )
          },
          toObject: function (t) {
            return r(this.callSuper('toObject', t), {
              path: this.path.map(function (t) {
                return t.slice()
              }),
            })
          },
          toDatalessObject: function (t) {
            t = this.toObject(['sourcePath'].concat(t))
            return t.sourcePath && delete t.path, t
          },
          _toSVG: function () {
            return [
              '<path ',
              'COMMON_PARTS',
              'd="',
              f.util.joinPath(this.path),
              '" stroke-linecap="round" ',
              '/>\n',
            ]
          },
          _getOffsetTransform: function () {
            var t = f.Object.NUM_FRACTION_DIGITS
            return (
              ' translate(' +
              e(-this.pathOffset.x, t) +
              ', ' +
              e(-this.pathOffset.y, t) +
              ')'
            )
          },
          toClipPathSVG: function (t) {
            var e = this._getOffsetTransform()
            return (
              '\t' +
              this._createBaseClipPathSVGMarkup(this._toSVG(), {
                reviver: t,
                additionalTransform: e,
              })
            )
          },
          toSVG: function (t) {
            var e = this._getOffsetTransform()
            return this._createBaseSVGMarkup(this._toSVG(), {
              reviver: t,
              additionalTransform: e,
            })
          },
          complexity: function () {
            return this.path.length
          },
          _calcDimensions: function () {
            for (
              var t,
                e,
                i = [],
                r = [],
                n = 0,
                s = 0,
                o = 0,
                a = 0,
                c = 0,
                h = this.path.length;
              c < h;
              ++c
            ) {
              switch ((t = this.path[c])[0]) {
                case 'L':
                  ;(o = t[1]), (a = t[2]), (e = [])
                  break
                case 'M':
                  ;(n = o = t[1]), (s = a = t[2]), (e = [])
                  break
                case 'C':
                  ;(e = f.util.getBoundsOfCurve(
                    o,
                    a,
                    t[1],
                    t[2],
                    t[3],
                    t[4],
                    t[5],
                    t[6]
                  )),
                    (o = t[5]),
                    (a = t[6])
                  break
                case 'Q':
                  ;(e = f.util.getBoundsOfCurve(
                    o,
                    a,
                    t[1],
                    t[2],
                    t[1],
                    t[2],
                    t[3],
                    t[4]
                  )),
                    (o = t[3]),
                    (a = t[4])
                  break
                case 'z':
                case 'Z':
                  ;(o = n), (a = s)
              }
              e.forEach(function (t) {
                i.push(t.x), r.push(t.y)
              }),
                i.push(o),
                r.push(a)
            }
            var l = d(i) || 0,
              u = d(r) || 0
            return {
              left: l,
              top: u,
              width: (g(i) || 0) - l,
              height: (g(r) || 0) - u,
            }
          },
        })),
        (f.Path.fromObject = function (i, r) {
          var t
          'string' == typeof i.sourcePath
            ? ((t = i.sourcePath),
              f.loadSVGFromURL(t, function (t) {
                var e = t[0]
                e.setOptions(i),
                  i.clipPath
                    ? f.util.enlivenObjects([i.clipPath], function (t) {
                        ;(e.clipPath = t[0]), r && r(e)
                      })
                    : r && r(e)
              }))
            : f.Object._fromObject('Path', i, r, 'path')
        }),
        (f.Path.ATTRIBUTE_NAMES = f.SHARED_ATTRIBUTES.concat(['d'])),
        (f.Path.fromElement = function (t, e, i) {
          t = f.parseAttributes(t, f.Path.ATTRIBUTE_NAMES)
          ;(t.fromSVG = !0), e(new f.Path(t.d, r(t, i)))
        }))
  })('undefined' != typeof exports ? exports : this),
  (function (t) {
    'use strict'
    var o = t.fabric || (t.fabric = {}),
      a = o.util.array.min,
      c = o.util.array.max
    o.Group ||
      ((o.Group = o.util.createClass(o.Object, o.Collection, {
        type: 'group',
        strokeWidth: 0,
        subTargetCheck: !1,
        cacheProperties: [],
        useSetOnGroup: !1,
        initialize: function (t, e, i) {
          ;(e = e || {}),
            (this._objects = []),
            i && this.callSuper('initialize', e),
            (this._objects = t || [])
          for (var r = this._objects.length; r--; )
            this._objects[r].group = this
          i
            ? this._updateObjectsACoords()
            : ((t = e && e.centerPoint),
              void 0 !== e.originX && (this.originX = e.originX),
              void 0 !== e.originY && (this.originY = e.originY),
              t || this._calcBounds(),
              this._updateObjectsCoords(t),
              delete e.centerPoint,
              this.callSuper('initialize', e)),
            this.setCoords()
        },
        _updateObjectsACoords: function () {
          for (var t = this._objects.length; t--; )
            this._objects[t].setCoords(!0)
        },
        _updateObjectsCoords: function (t) {
          for (
            var t = t || this.getCenterPoint(), e = this._objects.length;
            e--;

          )
            this._updateObjectCoords(this._objects[e], t)
        },
        _updateObjectCoords: function (t, e) {
          var i = t.left,
            r = t.top
          t.set({ left: i - e.x, top: r - e.y }),
            (t.group = this),
            t.setCoords(!0)
        },
        toString: function () {
          return '#<fabric.Group: (' + this.complexity() + ')>'
        },
        addWithUpdate: function (t) {
          var e = !!this.group
          return (
            this._restoreObjectsState(),
            o.util.resetObjectTransform(this),
            t &&
              (e &&
                o.util.removeTransformFromObject(
                  t,
                  this.group.calcTransformMatrix()
                ),
              this._objects.push(t),
              (t.group = this),
              t._set('canvas', this.canvas)),
            this._calcBounds(),
            this._updateObjectsCoords(),
            (this.dirty = !0),
            e ? this.group.addWithUpdate() : this.setCoords(),
            this
          )
        },
        removeWithUpdate: function (t) {
          return (
            this._restoreObjectsState(),
            o.util.resetObjectTransform(this),
            this.remove(t),
            this._calcBounds(),
            this._updateObjectsCoords(),
            this.setCoords(),
            (this.dirty = !0),
            this
          )
        },
        _onObjectAdded: function (t) {
          ;(this.dirty = !0), (t.group = this), t._set('canvas', this.canvas)
        },
        _onObjectRemoved: function (t) {
          ;(this.dirty = !0), delete t.group
        },
        _set: function (t, e) {
          var i = this._objects.length
          if (this.useSetOnGroup)
            for (; i--; ) this._objects[i].setOnGroup(t, e)
          if ('canvas' === t) for (; i--; ) this._objects[i]._set(t, e)
          o.Object.prototype._set.call(this, t, e)
        },
        toObject: function (r) {
          var n = this.includeDefaultValues,
            t = this._objects
              .filter(function (t) {
                return !t.excludeFromExport
              })
              .map(function (t) {
                var e = t.includeDefaultValues,
                  i = ((t.includeDefaultValues = n), t.toObject(r))
                return (t.includeDefaultValues = e), i
              }),
            e = o.Object.prototype.toObject.call(this, r)
          return (e.objects = t), e
        },
        toDatalessObject: function (r) {
          var n,
            t = this.sourcePath,
            e =
              ((t =
                t ||
                ((n = this.includeDefaultValues),
                this._objects.map(function (t) {
                  var e = t.includeDefaultValues,
                    i = ((t.includeDefaultValues = n), t.toDatalessObject(r))
                  return (t.includeDefaultValues = e), i
                }))),
              o.Object.prototype.toDatalessObject.call(this, r))
          return (e.objects = t), e
        },
        render: function (t) {
          ;(this._transformDone = !0),
            this.callSuper('render', t),
            (this._transformDone = !1)
        },
        shouldCache: function () {
          var t = o.Object.prototype.shouldCache.call(this)
          if (t)
            for (var e = 0, i = this._objects.length; e < i; e++)
              if (this._objects[e].willDrawShadow())
                return (this.ownCaching = !1)
          return t
        },
        willDrawShadow: function () {
          if (o.Object.prototype.willDrawShadow.call(this)) return !0
          for (var t = 0, e = this._objects.length; t < e; t++)
            if (this._objects[t].willDrawShadow()) return !0
          return !1
        },
        isOnACache: function () {
          return this.ownCaching || (this.group && this.group.isOnACache())
        },
        drawObject: function (t) {
          for (var e = 0, i = this._objects.length; e < i; e++)
            this._objects[e].render(t)
          this._drawClipPath(t, this.clipPath)
        },
        isCacheDirty: function (t) {
          if (this.callSuper('isCacheDirty', t)) return !0
          if (!this.statefullCache) return !1
          for (var e, i, r = 0, n = this._objects.length; r < n; r++)
            if (this._objects[r].isCacheDirty(!0))
              return (
                this._cacheCanvas &&
                  ((e = this.cacheWidth / this.zoomX),
                  (i = this.cacheHeight / this.zoomY),
                  this._cacheContext.clearRect(-e / 2, -i / 2, e, i)),
                !0
              )
          return !1
        },
        _restoreObjectsState: function () {
          var e = this.calcOwnMatrix()
          return (
            this._objects.forEach(function (t) {
              o.util.addTransformToObject(t, e), delete t.group, t.setCoords()
            }),
            this
          )
        },
        destroy: function () {
          return (
            this._objects.forEach(function (t) {
              t.set('dirty', !0)
            }),
            this._restoreObjectsState()
          )
        },
        dispose: function () {
          this.callSuper('dispose'),
            this.forEachObject(function (t) {
              t.dispose && t.dispose()
            }),
            (this._objects = [])
        },
        toActiveSelection: function () {
          var t, e, i, r
          if (this.canvas)
            return (
              (t = this._objects),
              (e = this.canvas),
              (this._objects = []),
              (i = this.toObject()),
              delete i.objects,
              (r = new o.ActiveSelection([])),
              r.set(i),
              (r.type = 'activeSelection'),
              e.remove(this),
              t.forEach(function (t) {
                ;(t.group = r), (t.dirty = !0), e.add(t)
              }),
              (r.canvas = e),
              (r._objects = t),
              (e._activeObject = r).setCoords(),
              r
            )
        },
        ungroupOnCanvas: function () {
          return this._restoreObjectsState()
        },
        setObjectsCoords: function () {
          return (
            this.forEachObject(function (t) {
              t.setCoords(!0)
            }),
            this
          )
        },
        _calcBounds: function (t) {
          for (
            var e,
              i,
              r,
              n,
              s = [],
              o = [],
              a = ['tr', 'br', 'bl', 'tl'],
              c = 0,
              h = this._objects.length,
              l = a.length;
            c < h;
            ++c
          ) {
            for (r = (e = this._objects[c]).calcACoords(), n = 0; n < l; n++)
              s.push(r[(i = a[n])].x), o.push(r[i].y)
            e.aCoords = r
          }
          this._getBounds(s, o, t)
        },
        _getBounds: function (t, e, i) {
          var r = new o.Point(a(t), a(e)),
            t = new o.Point(c(t), c(e)),
            e = r.y || 0,
            n = r.x || 0,
            s = t.x - r.x || 0,
            t = t.y - r.y || 0
          ;(this.width = s),
            (this.height = t),
            i || this.setPositionByOrigin({ x: n, y: e }, 'left', 'top')
        },
        _toSVG: function (t) {
          for (
            var e = ['<g ', 'COMMON_PARTS', ' >\n'],
              i = 0,
              r = this._objects.length;
            i < r;
            i++
          )
            e.push('\t\t', this._objects[i].toSVG(t))
          return e.push('</g>\n'), e
        },
        getSvgStyles: function () {
          var t =
              void 0 !== this.opacity && 1 !== this.opacity
                ? 'opacity: ' + this.opacity + ';'
                : '',
            e = this.visible ? '' : ' visibility: hidden;'
          return [t, this.getSvgFilter(), e].join('')
        },
        toClipPathSVG: function (t) {
          for (var e = [], i = 0, r = this._objects.length; i < r; i++)
            e.push('\t', this._objects[i].toClipPathSVG(t))
          return this._createBaseClipPathSVGMarkup(e, { reviver: t })
        },
      })),
      (o.Group.fromObject = function (i, r) {
        var n = i.objects,
          s = o.util.object.clone(i, !0)
        delete s.objects,
          'string' == typeof n
            ? o.loadSVGFromURL(n, function (t) {
                var e = o.util.groupSVGElements(t, i, n),
                  t = s.clipPath
                delete s.clipPath,
                  e.set(s),
                  t
                    ? o.util.enlivenObjects([t], function (t) {
                        ;(e.clipPath = t[0]), r && r(e)
                      })
                    : r && r(e)
              })
            : o.util.enlivenObjects(n, function (t) {
                o.util.enlivenObjectEnlivables(i, s, function () {
                  r && r(new o.Group(t, s, !0))
                })
              })
      }))
  })('undefined' != typeof exports ? exports : this),
  (function (t) {
    'use strict'
    var r = t.fabric || (t.fabric = {})
    r.ActiveSelection ||
      ((r.ActiveSelection = r.util.createClass(r.Group, {
        type: 'activeSelection',
        initialize: function (t, e) {
          ;(e = e || {}), (this._objects = t || [])
          for (var i = this._objects.length; i--; )
            this._objects[i].group = this
          e.originX && (this.originX = e.originX),
            e.originY && (this.originY = e.originY),
            this._calcBounds(),
            this._updateObjectsCoords(),
            r.Object.prototype.initialize.call(this, e),
            this.setCoords()
        },
        toGroup: function () {
          var t = this._objects.concat(),
            e = ((this._objects = []), r.Object.prototype.toObject.call(this)),
            i = new r.Group([])
          if (
            (delete e.type,
            i.set(e),
            t.forEach(function (t) {
              t.canvas.remove(t), (t.group = i)
            }),
            (i._objects = t),
            !this.canvas)
          )
            return i
          e = this.canvas
          return e.add(i), (e._activeObject = i).setCoords(), i
        },
        onDeselect: function () {
          return this.destroy(), !1
        },
        toString: function () {
          return '#<fabric.ActiveSelection: (' + this.complexity() + ')>'
        },
        shouldCache: function () {
          return !1
        },
        isOnACache: function () {
          return !1
        },
        _renderControls: function (t, e, i) {
          t.save(),
            (t.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1),
            this.callSuper('_renderControls', t, e),
            void 0 === (i = i || {}).hasControls && (i.hasControls = !1),
            (i.forActiveSelection = !0)
          for (var r = 0, n = this._objects.length; r < n; r++)
            this._objects[r]._renderControls(t, i)
          t.restore()
        },
      })),
      (r.ActiveSelection.fromObject = function (e, i) {
        r.util.enlivenObjects(e.objects, function (t) {
          delete e.objects, i && i(new r.ActiveSelection(t, e, !0))
        })
      }))
  })('undefined' != typeof exports ? exports : this),
  (function (t) {
    'use strict'
    var r = fabric.util.object.extend
    t.fabric || (t.fabric = {}),
      t.fabric.Image
        ? fabric.warn('fabric.Image is already defined.')
        : ((fabric.Image = fabric.util.createClass(fabric.Object, {
            type: 'image',
            strokeWidth: 0,
            srcFromAttribute: !1,
            _lastScaleX: 1,
            _lastScaleY: 1,
            _filterScalingX: 1,
            _filterScalingY: 1,
            minimumScaleTrigger: 0.5,
            stateProperties: fabric.Object.prototype.stateProperties.concat(
              'cropX',
              'cropY'
            ),
            cacheProperties: fabric.Object.prototype.cacheProperties.concat(
              'cropX',
              'cropY'
            ),
            cacheKey: '',
            cropX: 0,
            cropY: 0,
            imageSmoothing: !0,
            initialize: function (t, e) {
              ;(e = e || {}),
                (this.filters = []),
                (this.cacheKey = 'texture' + fabric.Object.__uid++),
                this.callSuper('initialize', e),
                this._initElement(t, e)
            },
            getElement: function () {
              return this._element || {}
            },
            setElement: function (t, e) {
              return (
                this.removeTexture(this.cacheKey),
                this.removeTexture(this.cacheKey + '_filtered'),
                (this._element = t),
                (this._originalElement = t),
                this._initConfig(e),
                0 !== this.filters.length && this.applyFilters(),
                this.resizeFilter && this.applyResizeFilters(),
                this
              )
            },
            removeTexture: function (t) {
              var e = fabric.filterBackend
              e && e.evictCachesForKey && e.evictCachesForKey(t)
            },
            dispose: function () {
              this.callSuper('dispose'),
                this.removeTexture(this.cacheKey),
                this.removeTexture(this.cacheKey + '_filtered'),
                (this._cacheContext = void 0),
                [
                  '_originalElement',
                  '_element',
                  '_filteredEl',
                  '_cacheCanvas',
                ].forEach(
                  function (t) {
                    fabric.util.cleanUpJsdomNode(this[t]), (this[t] = void 0)
                  }.bind(this)
                )
            },
            getCrossOrigin: function () {
              return (
                this._originalElement &&
                (this._originalElement.crossOrigin || null)
              )
            },
            getOriginalSize: function () {
              var t = this.getElement()
              return {
                width: t.naturalWidth || t.width,
                height: t.naturalHeight || t.height,
              }
            },
            _stroke: function (t) {
              var e, i
              this.stroke &&
                0 !== this.strokeWidth &&
                ((e = this.width / 2),
                (i = this.height / 2),
                t.beginPath(),
                t.moveTo(-e, -i),
                t.lineTo(e, -i),
                t.lineTo(e, i),
                t.lineTo(-e, i),
                t.lineTo(-e, -i),
                t.closePath())
            },
            toObject: function (t) {
              var e = [],
                t =
                  (this.filters.forEach(function (t) {
                    t && e.push(t.toObject())
                  }),
                  r(this.callSuper('toObject', ['cropX', 'cropY'].concat(t)), {
                    src: this.getSrc(),
                    crossOrigin: this.getCrossOrigin(),
                    filters: e,
                  }))
              return (
                this.resizeFilter &&
                  (t.resizeFilter = this.resizeFilter.toObject()),
                t
              )
            },
            hasCrop: function () {
              return (
                this.cropX ||
                this.cropY ||
                this.width < this._element.width ||
                this.height < this._element.height
              )
            },
            _toSVG: function () {
              var t,
                e,
                i = [],
                r = [],
                n = this._element,
                s = -this.width / 2,
                o = -this.height / 2,
                a = '',
                c = ''
              return n
                ? (this.hasCrop() &&
                    ((e = fabric.Object.__uid++),
                    i.push(
                      '<clipPath id="imageCrop_' + e + '">\n',
                      '\t<rect x="' +
                        s +
                        '" y="' +
                        o +
                        '" width="' +
                        this.width +
                        '" height="' +
                        this.height +
                        '" />\n',
                      '</clipPath>\n'
                    ),
                    (a = ' clip-path="url(#imageCrop_' + e + ')" ')),
                  this.imageSmoothing ||
                    (c = '" image-rendering="optimizeSpeed'),
                  r.push(
                    '\t<image ',
                    'COMMON_PARTS',
                    'xlink:href="',
                    this.getSvgSrc(!0),
                    '" x="',
                    s - this.cropX,
                    '" y="',
                    o - this.cropY,
                    '" width="',
                    n.width || n.naturalWidth,
                    '" height="',
                    n.height || n.height,
                    c,
                    '"',
                    a,
                    '></image>\n'
                  ),
                  (this.stroke || this.strokeDashArray) &&
                    ((e = this.fill),
                    (this.fill = null),
                    (t = [
                      '\t<rect ',
                      'x="',
                      s,
                      '" y="',
                      o,
                      '" width="',
                      this.width,
                      '" height="',
                      this.height,
                      '" style="',
                      this.getSvgStyles(),
                      '"/>\n',
                    ]),
                    (this.fill = e)),
                  'fill' !== this.paintFirst ? i.concat(t, r) : i.concat(r, t))
                : []
            },
            getSrc: function (t) {
              t = t ? this._element : this._originalElement
              return t
                ? t.toDataURL
                  ? t.toDataURL()
                  : this.srcFromAttribute
                  ? t.getAttribute('src')
                  : t.src
                : this.src || ''
            },
            setSrc: function (t, i, r) {
              return (
                fabric.util.loadImage(
                  t,
                  function (t, e) {
                    this.setElement(t, r),
                      this._setWidthHeight(),
                      i && i(this, e)
                  },
                  this,
                  r && r.crossOrigin
                ),
                this
              )
            },
            toString: function () {
              return '#<fabric.Image: { src: "' + this.getSrc() + '" }>'
            },
            applyResizeFilters: function () {
              var t = this.resizeFilter,
                e = this.minimumScaleTrigger,
                i = this.getTotalObjectScaling(),
                r = i.scaleX,
                i = i.scaleY,
                n = this._filteredEl || this._originalElement
              if ((this.group && this.set('dirty', !0), !t || (e < r && e < i)))
                return (
                  (this._element = n),
                  (this._filterScalingX = 1),
                  (this._filterScalingY = 1),
                  (this._lastScaleX = r),
                  void (this._lastScaleY = i)
                )
              fabric.filterBackend ||
                (fabric.filterBackend = fabric.initFilterBackend())
              var e = fabric.util.createCanvasElement(),
                s = this._filteredEl
                  ? this.cacheKey + '_filtered'
                  : this.cacheKey,
                o = n.width,
                a = n.height
              ;(e.width = o),
                (e.height = a),
                (this._element = e),
                (this._lastScaleX = t.scaleX = r),
                (this._lastScaleY = t.scaleY = i),
                fabric.filterBackend.applyFilters(
                  [t],
                  n,
                  o,
                  a,
                  this._element,
                  s
                ),
                (this._filterScalingX = e.width / this._originalElement.width),
                (this._filterScalingY = e.height / this._originalElement.height)
            },
            applyFilters: function (t) {
              if (
                ((t = (t = t || this.filters || []).filter(function (t) {
                  return t && !t.isNeutralState()
                })),
                this.set('dirty', !0),
                this.removeTexture(this.cacheKey + '_filtered'),
                0 === t.length)
              )
                return (
                  (this._element = this._originalElement),
                  (this._filteredEl = null),
                  (this._filterScalingX = 1),
                  (this._filterScalingY = 1),
                  this
                )
              var e,
                i = this._originalElement,
                r = i.naturalWidth || i.width,
                i = i.naturalHeight || i.height
              return (
                this._element === this._originalElement
                  ? (((e = fabric.util.createCanvasElement()).width = r),
                    (e.height = i),
                    (this._element = e),
                    (this._filteredEl = e))
                  : ((this._element = this._filteredEl),
                    this._filteredEl.getContext('2d').clearRect(0, 0, r, i),
                    (this._lastScaleX = 1),
                    (this._lastScaleY = 1)),
                fabric.filterBackend ||
                  (fabric.filterBackend = fabric.initFilterBackend()),
                fabric.filterBackend.applyFilters(
                  t,
                  this._originalElement,
                  r,
                  i,
                  this._element,
                  this.cacheKey
                ),
                (this._originalElement.width === this._element.width &&
                  this._originalElement.height === this._element.height) ||
                  ((this._filterScalingX =
                    this._element.width / this._originalElement.width),
                  (this._filterScalingY =
                    this._element.height / this._originalElement.height)),
                this
              )
            },
            _render: function (t) {
              fabric.util.setImageSmoothing(t, this.imageSmoothing),
                !0 !== this.isMoving &&
                  this.resizeFilter &&
                  this._needsResize() &&
                  this.applyResizeFilters(),
                this._stroke(t),
                this._renderPaintInOrder(t)
            },
            drawCacheOnCanvas: function (t) {
              fabric.util.setImageSmoothing(t, this.imageSmoothing),
                fabric.Object.prototype.drawCacheOnCanvas.call(this, t)
            },
            shouldCache: function () {
              return this.needsItsOwnCache()
            },
            _renderFill: function (t) {
              var e,
                i,
                r,
                n,
                s,
                o,
                a,
                c,
                h,
                l,
                u,
                f,
                d,
                g,
                p,
                m = this._element
              m &&
                ((e = this._filterScalingX),
                (i = this._filterScalingY),
                (g = this.width),
                (r = this.height),
                (n = Math.min),
                (s = (o = Math.max)(this.cropX, 0)),
                (o = o(this.cropY, 0)),
                (p = m.naturalWidth || m.width),
                (a = m.naturalHeight || m.height),
                (h = o * i),
                (l = n(g * e, p - (c = s * e))),
                (u = n(r * i, a - h)),
                (f = -g / 2),
                (d = -r / 2),
                (g = n(g, p / e - s)),
                (p = n(r, a / i - o)),
                m && t.drawImage(m, c, h, l, u, f, d, g, p))
            },
            _needsResize: function () {
              var t = this.getTotalObjectScaling()
              return (
                t.scaleX !== this._lastScaleX || t.scaleY !== this._lastScaleY
              )
            },
            _resetWidthHeight: function () {
              this.set(this.getOriginalSize())
            },
            _initElement: function (t, e) {
              this.setElement(fabric.util.getById(t), e),
                fabric.util.addClass(this.getElement(), fabric.Image.CSS_CANVAS)
            },
            _initConfig: function (t) {
              this.setOptions((t = t || {})), this._setWidthHeight(t)
            },
            _initFilters: function (t, e) {
              t && t.length
                ? fabric.util.enlivenObjects(
                    t,
                    function (t) {
                      e && e(t)
                    },
                    'fabric.Image.filters'
                  )
                : e && e()
            },
            _setWidthHeight: function (t) {
              t = t || {}
              var e = this.getElement()
              ;(this.width = t.width || e.naturalWidth || e.width || 0),
                (this.height = t.height || e.naturalHeight || e.height || 0)
            },
            parsePreserveAspectRatioAttribute: function () {
              var t,
                e = fabric.util.parsePreserveAspectRatioAttribute(
                  this.preserveAspectRatio || ''
                ),
                i = this._element.width,
                r = this._element.height,
                n = 1,
                s = 1,
                o = 0,
                a = 0,
                c = 0,
                h = 0,
                l = this.width,
                u = this.height,
                f = { width: l, height: u }
              return (
                !e || ('none' === e.alignX && 'none' === e.alignY)
                  ? ((n = l / i), (s = u / r))
                  : ('meet' === e.meetOrSlice &&
                      ((t =
                        (l -
                          i *
                            (n = s =
                              fabric.util.findScaleToFit(this._element, f))) /
                        2),
                      'Min' === e.alignX && (o = -t),
                      'Max' === e.alignX && (o = t),
                      (t = (u - r * s) / 2),
                      'Min' === e.alignY && (a = -t),
                      'Max' === e.alignY && (a = t)),
                    'slice' === e.meetOrSlice &&
                      ((t =
                        i -
                        l /
                          (n = s =
                            fabric.util.findScaleToCover(this._element, f))),
                      'Mid' === e.alignX && (c = t / 2),
                      'Max' === e.alignX && (c = t),
                      (t = r - u / s),
                      'Mid' === e.alignY && (h = t / 2),
                      'Max' === e.alignY && (h = t),
                      (i = l / n),
                      (r = u / s))),
                {
                  width: i,
                  height: r,
                  scaleX: n,
                  scaleY: s,
                  offsetLeft: o,
                  offsetTop: a,
                  cropX: c,
                  cropY: h,
                }
              )
            },
          })),
          (fabric.Image.CSS_CANVAS = 'canvas-img'),
          (fabric.Image.prototype.getSvgSrc = fabric.Image.prototype.getSrc),
          (fabric.Image.fromObject = function (t, i) {
            var r = fabric.util.object.clone(t)
            fabric.util.loadImage(
              r.src,
              function (e, t) {
                t
                  ? i && i(null, !0)
                  : fabric.Image.prototype._initFilters.call(
                      r,
                      r.filters,
                      function (t) {
                        ;(r.filters = t || []),
                          fabric.Image.prototype._initFilters.call(
                            r,
                            [r.resizeFilter],
                            function (t) {
                              ;(r.resizeFilter = t[0]),
                                fabric.util.enlivenObjectEnlivables(
                                  r,
                                  r,
                                  function () {
                                    var t = new fabric.Image(e, r)
                                    i(t, !1)
                                  }
                                )
                            }
                          )
                      }
                    )
              },
              null,
              r.crossOrigin
            )
          }),
          (fabric.Image.fromURL = function (t, i, r) {
            fabric.util.loadImage(
              t,
              function (t, e) {
                i && i(new fabric.Image(t, r), e)
              },
              null,
              r && r.crossOrigin
            )
          }),
          (fabric.Image.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat(
            'x y width height preserveAspectRatio xlink:href crossOrigin image-rendering'.split(
              ' '
            )
          )),
          (fabric.Image.fromElement = function (t, e, i) {
            t = fabric.parseAttributes(t, fabric.Image.ATTRIBUTE_NAMES)
            fabric.Image.fromURL(
              t['xlink:href'],
              e,
              r(i ? fabric.util.object.clone(i) : {}, t)
            )
          }))
  })('undefined' != typeof exports ? exports : this),
  fabric.util.object.extend(fabric.Object.prototype, {
    _getAngleValueForStraighten: function () {
      var t = this.angle % 360
      return 0 < t ? 90 * Math.round((t - 1) / 90) : 90 * Math.round(t / 90)
    },
    straighten: function () {
      return this.rotate(this._getAngleValueForStraighten())
    },
    fxStraighten: function (t) {
      function e() {}
      var i = (t = t || {}).onComplete || e,
        r = t.onChange || e,
        n = this
      return fabric.util.animate({
        target: this,
        startValue: this.get('angle'),
        endValue: this._getAngleValueForStraighten(),
        duration: this.FX_DURATION,
        onChange: function (t) {
          n.rotate(t), r()
        },
        onComplete: function () {
          n.setCoords(), i()
        },
      })
    },
  }),
  fabric.util.object.extend(fabric.StaticCanvas.prototype, {
    straightenObject: function (t) {
      return t.straighten(), this.requestRenderAll(), this
    },
    fxStraightenObject: function (t) {
      return t.fxStraighten({ onChange: this.requestRenderAllBound })
    },
  }),
  (function () {
    'use strict'
    function t(t) {
      t && t.tileSize && (this.tileSize = t.tileSize),
        this.setupGLContext(this.tileSize, this.tileSize),
        this.captureGPUInfo()
    }
    ;(fabric.isWebglSupported = function (t) {
      if (fabric.isLikelyNode) return !1
      t = t || fabric.WebglFilterBackend.prototype.tileSize
      var e,
        i,
        r,
        n = document.createElement('canvas'),
        s = n.getContext('webgl') || n.getContext('experimental-webgl'),
        n = !1
      if (s) {
        fabric.maxTextureSize = s.getParameter(s.MAX_TEXTURE_SIZE)
        for (
          var n = fabric.maxTextureSize >= t,
            o = ['highp', 'mediump', 'lowp'],
            a = 0;
          a < 3;
          a++
        )
          if (
            ((r = void 0),
            (i = 'precision ' + (i = o[a]) + ' float;\nvoid main(){}'),
            (r = (e = s).createShader(e.FRAGMENT_SHADER)),
            e.shaderSource(r, i),
            e.compileShader(r),
            !!e.getShaderParameter(r, e.COMPILE_STATUS))
          ) {
            fabric.webGlPrecision = o[a]
            break
          }
      }
      return (this.isSupported = n)
    }),
      ((fabric.WebglFilterBackend = t).prototype = {
        tileSize: 2048,
        resources: {},
        setupGLContext: function (t, e) {
          this.dispose(),
            this.createWebGLCanvas(t, e),
            (this.aPosition = new Float32Array([0, 0, 0, 1, 1, 0, 1, 1])),
            this.chooseFastestCopyGLTo2DMethod(t, e)
        },
        chooseFastestCopyGLTo2DMethod: function (t, e) {
          var i = void 0 !== window.performance
          try {
            new ImageData(1, 1), (s = !0)
          } catch (t) {
            s = !1
          }
          var r = 'undefined' != typeof ArrayBuffer,
            n = 'undefined' != typeof Uint8ClampedArray
          if (i && s && r && n) {
            var i = fabric.util.createCanvasElement(),
              s = new ArrayBuffer(t * e * 4)
            if (fabric.forceGLPutImageData)
              return (
                (this.imageBuffer = s),
                void (this.copyGLTo2D = copyGLTo2DPutImageData)
              )
            r = {
              imageBuffer: s,
              destinationWidth: t,
              destinationHeight: e,
              targetCanvas: i,
            }
            ;(i.width = t),
              (i.height = e),
              (n = window.performance.now()),
              copyGLTo2DDrawImage.call(r, this.gl, r),
              (t = window.performance.now() - n),
              (n = window.performance.now()),
              copyGLTo2DPutImageData.call(r, this.gl, r),
              window.performance.now() - n < t
                ? ((this.imageBuffer = s),
                  (this.copyGLTo2D = copyGLTo2DPutImageData))
                : (this.copyGLTo2D = copyGLTo2DDrawImage)
          }
        },
        createWebGLCanvas: function (t, e) {
          var i = fabric.util.createCanvasElement(),
            t =
              ((i.width = t),
              (i.height = e),
              {
                alpha: !0,
                premultipliedAlpha: !1,
                depth: !1,
                stencil: !1,
                antialias: !1,
              }),
            e = i.getContext('webgl', t)
          ;(e = e || i.getContext('experimental-webgl', t)) &&
            (e.clearColor(0, 0, 0, 0), (this.canvas = i), (this.gl = e))
        },
        applyFilters: function (t, e, i, r, n, s) {
          var o,
            a = this.gl,
            c =
              (s && (o = this.getCachedTexture(s, e)),
              {
                originalWidth: e.width || e.originalWidth,
                originalHeight: e.height || e.originalHeight,
                sourceWidth: i,
                sourceHeight: r,
                destinationWidth: i,
                destinationHeight: r,
                context: a,
                sourceTexture: this.createTexture(a, i, r, !o && e),
                targetTexture: this.createTexture(a, i, r),
                originalTexture: o || this.createTexture(a, i, r, !o && e),
                passes: t.length,
                webgl: !0,
                aPosition: this.aPosition,
                programCache: this.programCache,
                pass: 0,
                filterBackend: this,
                targetCanvas: n,
              }),
            s = a.createFramebuffer()
          return (
            a.bindFramebuffer(a.FRAMEBUFFER, s),
            t.forEach(function (t) {
              t && t.applyTo(c)
            }),
            resizeCanvasIfNeeded(c),
            this.copyGLTo2D(a, c),
            a.bindTexture(a.TEXTURE_2D, null),
            a.deleteTexture(c.sourceTexture),
            a.deleteTexture(c.targetTexture),
            a.deleteFramebuffer(s),
            n.getContext('2d').setTransform(1, 0, 0, 1, 0, 0),
            c
          )
        },
        dispose: function () {
          this.canvas && ((this.canvas = null), (this.gl = null)),
            this.clearWebGLCaches()
        },
        clearWebGLCaches: function () {
          ;(this.programCache = {}), (this.textureCache = {})
        },
        createTexture: function (t, e, i, r, n) {
          var s = t.createTexture()
          return (
            t.bindTexture(t.TEXTURE_2D, s),
            t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, n || t.NEAREST),
            t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, n || t.NEAREST),
            t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE),
            t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE),
            r
              ? t.texImage2D(
                  t.TEXTURE_2D,
                  0,
                  t.RGBA,
                  t.RGBA,
                  t.UNSIGNED_BYTE,
                  r
                )
              : t.texImage2D(
                  t.TEXTURE_2D,
                  0,
                  t.RGBA,
                  e,
                  i,
                  0,
                  t.RGBA,
                  t.UNSIGNED_BYTE,
                  null
                ),
            s
          )
        },
        getCachedTexture: function (t, e) {
          return (
            this.textureCache[t] ||
            ((e = this.createTexture(this.gl, e.width, e.height, e)),
            (this.textureCache[t] = e))
          )
        },
        evictCachesForKey: function (t) {
          this.textureCache[t] &&
            (this.gl.deleteTexture(this.textureCache[t]),
            delete this.textureCache[t])
        },
        copyGLTo2D: copyGLTo2DDrawImage,
        captureGPUInfo: function () {
          if (this.gpuInfo) return this.gpuInfo
          var t = this.gl,
            e = { renderer: '', vendor: '' }
          if (!t) return e
          var i,
            r = t.getExtension('WEBGL_debug_renderer_info')
          return (
            r &&
              ((i = t.getParameter(r.UNMASKED_RENDERER_WEBGL)),
              (t = t.getParameter(r.UNMASKED_VENDOR_WEBGL)),
              i && (e.renderer = i.toLowerCase()),
              t && (e.vendor = t.toLowerCase())),
            (this.gpuInfo = e)
          )
        },
      })
  })(),
  (function () {
    'use strict'
    function t() {}
    function e() {}
    ;(fabric.Canvas2dFilterBackend = e).prototype = {
      evictCachesForKey: t,
      dispose: t,
      clearWebGLCaches: t,
      resources: {},
      applyFilters: function (t, e, i, r, n) {
        var s = n.getContext('2d')
        s.drawImage(e, 0, 0, i, r)
        var o = {
          sourceWidth: i,
          sourceHeight: r,
          imageData: s.getImageData(0, 0, i, r),
          originalEl: e,
          originalImageData: s.getImageData(0, 0, i, r),
          canvasEl: n,
          ctx: s,
          filterBackend: this,
        }
        return (
          t.forEach(function (t) {
            t.applyTo(o)
          }),
          (o.imageData.width === i && o.imageData.height === r) ||
            ((n.width = o.imageData.width), (n.height = o.imageData.height)),
          s.putImageData(o.imageData, 0, 0),
          o
        )
      },
    }
  })(),
  (fabric.Image = fabric.Image || {}),
  (fabric.Image.filters = fabric.Image.filters || {}),
  (fabric.Image.filters.BaseFilter = fabric.util.createClass({
    type: 'BaseFilter',
    vertexSource:
      'attribute vec2 aPosition;\nvarying vec2 vTexCoord;\nvoid main() {\nvTexCoord = aPosition;\ngl_Position = vec4(aPosition * 2.0 - 1.0, 0.0, 1.0);\n}',
    fragmentSource:
      'precision highp float;\nvarying vec2 vTexCoord;\nuniform sampler2D uTexture;\nvoid main() {\ngl_FragColor = texture2D(uTexture, vTexCoord);\n}',
    initialize: function (t) {
      t && this.setOptions(t)
    },
    setOptions: function (t) {
      for (var e in t) this[e] = t[e]
    },
    createProgram: function (t, e, i) {
      ;(e = e || this.fragmentSource),
        (i = i || this.vertexSource),
        'highp' !== fabric.webGlPrecision &&
          (e = e.replace(
            /precision highp float/g,
            'precision ' + fabric.webGlPrecision + ' float'
          ))
      var r = t.createShader(t.VERTEX_SHADER)
      if (
        (t.shaderSource(r, i),
        t.compileShader(r),
        !t.getShaderParameter(r, t.COMPILE_STATUS))
      )
        throw new Error(
          'Vertex shader compile error for ' +
            this.type +
            ': ' +
            t.getShaderInfoLog(r)
        )
      i = t.createShader(t.FRAGMENT_SHADER)
      if (
        (t.shaderSource(i, e),
        t.compileShader(i),
        !t.getShaderParameter(i, t.COMPILE_STATUS))
      )
        throw new Error(
          'Fragment shader compile error for ' +
            this.type +
            ': ' +
            t.getShaderInfoLog(i)
        )
      e = t.createProgram()
      if (
        (t.attachShader(e, r),
        t.attachShader(e, i),
        t.linkProgram(e),
        !t.getProgramParameter(e, t.LINK_STATUS))
      )
        throw new Error(
          'Shader link error for "${this.type}" ' + t.getProgramInfoLog(e)
        )
      ;(r = this.getAttributeLocations(t, e)),
        (i = this.getUniformLocations(t, e) || {})
      return (
        (i.uStepW = t.getUniformLocation(e, 'uStepW')),
        (i.uStepH = t.getUniformLocation(e, 'uStepH')),
        { program: e, attributeLocations: r, uniformLocations: i }
      )
    },
    getAttributeLocations: function (t, e) {
      return { aPosition: t.getAttribLocation(e, 'aPosition') }
    },
    getUniformLocations: function () {
      return {}
    },
    sendAttributeData: function (t, e, i) {
      var e = e.aPosition,
        r = t.createBuffer()
      t.bindBuffer(t.ARRAY_BUFFER, r),
        t.enableVertexAttribArray(e),
        t.vertexAttribPointer(e, 2, t.FLOAT, !1, 0, 0),
        t.bufferData(t.ARRAY_BUFFER, i, t.STATIC_DRAW)
    },
    _setupFrameBuffer: function (t) {
      var e,
        i,
        r = t.context
      1 < t.passes
        ? ((e = t.destinationWidth),
          (i = t.destinationHeight),
          (t.sourceWidth === e && t.sourceHeight === i) ||
            (r.deleteTexture(t.targetTexture),
            (t.targetTexture = t.filterBackend.createTexture(r, e, i))),
          r.framebufferTexture2D(
            r.FRAMEBUFFER,
            r.COLOR_ATTACHMENT0,
            r.TEXTURE_2D,
            t.targetTexture,
            0
          ))
        : (r.bindFramebuffer(r.FRAMEBUFFER, null), r.finish())
    },
    _swapTextures: function (t) {
      t.passes--, t.pass++
      var e = t.targetTexture
      ;(t.targetTexture = t.sourceTexture), (t.sourceTexture = e)
    },
    isNeutralState: function () {
      var t = this.mainParameter,
        e = fabric.Image.filters[this.type].prototype
      if (t) {
        if (Array.isArray(e[t])) {
          for (var i = e[t].length; i--; ) if (this[t][i] !== e[t][i]) return !1
          return !0
        }
        return e[t] === this[t]
      }
      return !1
    },
    applyTo: function (t) {
      t.webgl
        ? (this._setupFrameBuffer(t),
          this.applyToWebGL(t),
          this._swapTextures(t))
        : this.applyTo2d(t)
    },
    retrieveShader: function (t) {
      return (
        t.programCache.hasOwnProperty(this.type) ||
          (t.programCache[this.type] = this.createProgram(t.context)),
        t.programCache[this.type]
      )
    },
    applyToWebGL: function (t) {
      var e = t.context,
        i = this.retrieveShader(t)
      0 === t.pass && t.originalTexture
        ? e.bindTexture(e.TEXTURE_2D, t.originalTexture)
        : e.bindTexture(e.TEXTURE_2D, t.sourceTexture),
        e.useProgram(i.program),
        this.sendAttributeData(e, i.attributeLocations, t.aPosition),
        e.uniform1f(i.uniformLocations.uStepW, 1 / t.sourceWidth),
        e.uniform1f(i.uniformLocations.uStepH, 1 / t.sourceHeight),
        this.sendUniformData(e, i.uniformLocations),
        e.viewport(0, 0, t.destinationWidth, t.destinationHeight),
        e.drawArrays(e.TRIANGLE_STRIP, 0, 4)
    },
    bindAdditionalTexture: function (t, e, i) {
      t.activeTexture(i),
        t.bindTexture(t.TEXTURE_2D, e),
        t.activeTexture(t.TEXTURE0)
    },
    unbindAdditionalTexture: function (t, e) {
      t.activeTexture(e),
        t.bindTexture(t.TEXTURE_2D, null),
        t.activeTexture(t.TEXTURE0)
    },
    getMainParameter: function () {
      return this[this.mainParameter]
    },
    setMainParameter: function (t) {
      this[this.mainParameter] = t
    },
    sendUniformData: function () {},
    createHelpLayer: function (t) {
      var e
      t.helpLayer ||
        (((e = document.createElement('canvas')).width = t.sourceWidth),
        (e.height = t.sourceHeight),
        (t.helpLayer = e))
    },
    toObject: function () {
      var t = { type: this.type },
        e = this.mainParameter
      return e && (t[e] = this[e]), t
    },
    toJSON: function () {
      return this.toObject()
    },
  })),
  (fabric.Image.filters.BaseFilter.fromObject = function (t, e) {
    t = new fabric.Image.filters[t.type](t)
    return e && e(t), t
  }),
  (function (t) {
    'use strict'
    var t = t.fabric || (t.fabric = {}),
      e = t.Image.filters,
      i = t.util.createClass
    ;(e.ColorMatrix = i(e.BaseFilter, {
      type: 'ColorMatrix',
      fragmentSource:
        'precision highp float;\nuniform sampler2D uTexture;\nvarying vec2 vTexCoord;\nuniform mat4 uColorMatrix;\nuniform vec4 uConstants;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\ncolor *= uColorMatrix;\ncolor += uConstants;\ngl_FragColor = color;\n}',
      matrix: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
      mainParameter: 'matrix',
      colorsOnly: !0,
      initialize: function (t) {
        this.callSuper('initialize', t), (this.matrix = this.matrix.slice(0))
      },
      applyTo2d: function (t) {
        for (
          var e,
            i,
            r,
            n,
            s = t.imageData.data,
            o = s.length,
            a = this.matrix,
            c = this.colorsOnly,
            h = 0;
          h < o;
          h += 4
        )
          (e = s[h]),
            (i = s[h + 1]),
            (r = s[h + 2]),
            c
              ? ((s[h] = e * a[0] + i * a[1] + r * a[2] + 255 * a[4]),
                (s[h + 1] = e * a[5] + i * a[6] + r * a[7] + 255 * a[9]),
                (s[h + 2] = e * a[10] + i * a[11] + r * a[12] + 255 * a[14]))
              : ((n = s[h + 3]),
                (s[h] = e * a[0] + i * a[1] + r * a[2] + n * a[3] + 255 * a[4]),
                (s[h + 1] =
                  e * a[5] + i * a[6] + r * a[7] + n * a[8] + 255 * a[9]),
                (s[h + 2] =
                  e * a[10] + i * a[11] + r * a[12] + n * a[13] + 255 * a[14]),
                (s[h + 3] =
                  e * a[15] + i * a[16] + r * a[17] + n * a[18] + 255 * a[19]))
      },
      getUniformLocations: function (t, e) {
        return {
          uColorMatrix: t.getUniformLocation(e, 'uColorMatrix'),
          uConstants: t.getUniformLocation(e, 'uConstants'),
        }
      },
      sendUniformData: function (t, e) {
        var i = this.matrix,
          r = [
            i[0],
            i[1],
            i[2],
            i[3],
            i[5],
            i[6],
            i[7],
            i[8],
            i[10],
            i[11],
            i[12],
            i[13],
            i[15],
            i[16],
            i[17],
            i[18],
          ],
          i = [i[4], i[9], i[14], i[19]]
        t.uniformMatrix4fv(e.uColorMatrix, !1, r), t.uniform4fv(e.uConstants, i)
      },
    })),
      (t.Image.filters.ColorMatrix.fromObject =
        t.Image.filters.BaseFilter.fromObject)
  })('undefined' != typeof exports ? exports : this),
  (function (t) {
    'use strict'
    var t = t.fabric || (t.fabric = {}),
      e = t.Image.filters,
      i = t.util.createClass
    ;(e.Brightness = i(e.BaseFilter, {
      type: 'Brightness',
      fragmentSource:
        'precision highp float;\nuniform sampler2D uTexture;\nuniform float uBrightness;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\ncolor.rgb += uBrightness;\ngl_FragColor = color;\n}',
      brightness: 0,
      mainParameter: 'brightness',
      applyTo2d: function (t) {
        if (0 !== this.brightness)
          for (
            var e = t.imageData.data,
              i = e.length,
              r = Math.round(255 * this.brightness),
              n = 0;
            n < i;
            n += 4
          )
            (e[n] = e[n] + r),
              (e[n + 1] = e[n + 1] + r),
              (e[n + 2] = e[n + 2] + r)
      },
      getUniformLocations: function (t, e) {
        return { uBrightness: t.getUniformLocation(e, 'uBrightness') }
      },
      sendUniformData: function (t, e) {
        t.uniform1f(e.uBrightness, this.brightness)
      },
    })),
      (t.Image.filters.Brightness.fromObject =
        t.Image.filters.BaseFilter.fromObject)
  })('undefined' != typeof exports ? exports : this),
  (function (t) {
    'use strict'
    var t = t.fabric || (t.fabric = {}),
      e = t.util.object.extend,
      i = t.Image.filters,
      r = t.util.createClass
    ;(i.Convolute = r(i.BaseFilter, {
      type: 'Convolute',
      opaque: !1,
      matrix: [0, 0, 0, 0, 1, 0, 0, 0, 0],
      fragmentSource: {
        Convolute_3_1:
          'precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[9];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 0);\nfor (float h = 0.0; h < 3.0; h+=1.0) {\nfor (float w = 0.0; w < 3.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 1), uStepH * (h - 1));\ncolor += texture2D(uTexture, vTexCoord + matrixPos) * uMatrix[int(h * 3.0 + w)];\n}\n}\ngl_FragColor = color;\n}',
        Convolute_3_0:
          'precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[9];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 1);\nfor (float h = 0.0; h < 3.0; h+=1.0) {\nfor (float w = 0.0; w < 3.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 1.0), uStepH * (h - 1.0));\ncolor.rgb += texture2D(uTexture, vTexCoord + matrixPos).rgb * uMatrix[int(h * 3.0 + w)];\n}\n}\nfloat alpha = texture2D(uTexture, vTexCoord).a;\ngl_FragColor = color;\ngl_FragColor.a = alpha;\n}',
        Convolute_5_1:
          'precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[25];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 0);\nfor (float h = 0.0; h < 5.0; h+=1.0) {\nfor (float w = 0.0; w < 5.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 2.0), uStepH * (h - 2.0));\ncolor += texture2D(uTexture, vTexCoord + matrixPos) * uMatrix[int(h * 5.0 + w)];\n}\n}\ngl_FragColor = color;\n}',
        Convolute_5_0:
          'precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[25];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 1);\nfor (float h = 0.0; h < 5.0; h+=1.0) {\nfor (float w = 0.0; w < 5.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 2.0), uStepH * (h - 2.0));\ncolor.rgb += texture2D(uTexture, vTexCoord + matrixPos).rgb * uMatrix[int(h * 5.0 + w)];\n}\n}\nfloat alpha = texture2D(uTexture, vTexCoord).a;\ngl_FragColor = color;\ngl_FragColor.a = alpha;\n}',
        Convolute_7_1:
          'precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[49];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 0);\nfor (float h = 0.0; h < 7.0; h+=1.0) {\nfor (float w = 0.0; w < 7.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 3.0), uStepH * (h - 3.0));\ncolor += texture2D(uTexture, vTexCoord + matrixPos) * uMatrix[int(h * 7.0 + w)];\n}\n}\ngl_FragColor = color;\n}',
        Convolute_7_0:
          'precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[49];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 1);\nfor (float h = 0.0; h < 7.0; h+=1.0) {\nfor (float w = 0.0; w < 7.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 3.0), uStepH * (h - 3.0));\ncolor.rgb += texture2D(uTexture, vTexCoord + matrixPos).rgb * uMatrix[int(h * 7.0 + w)];\n}\n}\nfloat alpha = texture2D(uTexture, vTexCoord).a;\ngl_FragColor = color;\ngl_FragColor.a = alpha;\n}',
        Convolute_9_1:
          'precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[81];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 0);\nfor (float h = 0.0; h < 9.0; h+=1.0) {\nfor (float w = 0.0; w < 9.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 4.0), uStepH * (h - 4.0));\ncolor += texture2D(uTexture, vTexCoord + matrixPos) * uMatrix[int(h * 9.0 + w)];\n}\n}\ngl_FragColor = color;\n}',
        Convolute_9_0:
          'precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[81];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 1);\nfor (float h = 0.0; h < 9.0; h+=1.0) {\nfor (float w = 0.0; w < 9.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 4.0), uStepH * (h - 4.0));\ncolor.rgb += texture2D(uTexture, vTexCoord + matrixPos).rgb * uMatrix[int(h * 9.0 + w)];\n}\n}\nfloat alpha = texture2D(uTexture, vTexCoord).a;\ngl_FragColor = color;\ngl_FragColor.a = alpha;\n}',
      },
      retrieveShader: function (t) {
        var e = Math.sqrt(this.matrix.length),
          e = this.type + '_' + e + '_' + (this.opaque ? 1 : 0),
          i = this.fragmentSource[e]
        return (
          t.programCache.hasOwnProperty(e) ||
            (t.programCache[e] = this.createProgram(t.context, i)),
          t.programCache[e]
        )
      },
      applyTo2d: function (t) {
        for (
          var e,
            i,
            r,
            n,
            s,
            o,
            a,
            c,
            h,
            l,
            u,
            f = t.imageData,
            d = f.data,
            g = this.matrix,
            p = Math.round(Math.sqrt(g.length)),
            m = Math.floor(p / 2),
            v = f.width,
            b = f.height,
            f = t.ctx.createImageData(v, b),
            y = f.data,
            _ = this.opaque ? 1 : 0,
            x = 0;
          x < b;
          x++
        )
          for (h = 0; h < v; h++) {
            for (s = 4 * (x * v + h), u = n = r = i = e = 0; u < p; u++)
              for (l = 0; l < p; l++)
                (o = h + l - m),
                  (a = x + u - m) < 0 ||
                    b <= a ||
                    o < 0 ||
                    v <= o ||
                    ((c = g[u * p + l]),
                    (e += d[(a = 4 * (a * v + o))] * c),
                    (i += d[1 + a] * c),
                    (r += d[2 + a] * c),
                    _ || (n += d[3 + a] * c))
            ;(y[s] = e),
              (y[1 + s] = i),
              (y[2 + s] = r),
              (y[3 + s] = _ ? d[3 + s] : n)
          }
        t.imageData = f
      },
      getUniformLocations: function (t, e) {
        return {
          uMatrix: t.getUniformLocation(e, 'uMatrix'),
          uOpaque: t.getUniformLocation(e, 'uOpaque'),
          uHalfSize: t.getUniformLocation(e, 'uHalfSize'),
          uSize: t.getUniformLocation(e, 'uSize'),
        }
      },
      sendUniformData: function (t, e) {
        t.uniform1fv(e.uMatrix, this.matrix)
      },
      toObject: function () {
        return e(this.callSuper('toObject'), {
          opaque: this.opaque,
          matrix: this.matrix,
        })
      },
    })),
      (t.Image.filters.Convolute.fromObject =
        t.Image.filters.BaseFilter.fromObject)
  })('undefined' != typeof exports ? exports : this),
  (function (t) {
    'use strict'
    var t = t.fabric || (t.fabric = {}),
      e = t.Image.filters,
      i = t.util.createClass
    ;(e.Grayscale = i(e.BaseFilter, {
      type: 'Grayscale',
      fragmentSource: {
        average:
          'precision highp float;\nuniform sampler2D uTexture;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nfloat average = (color.r + color.b + color.g) / 3.0;\ngl_FragColor = vec4(average, average, average, color.a);\n}',
        lightness:
          'precision highp float;\nuniform sampler2D uTexture;\nuniform int uMode;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 col = texture2D(uTexture, vTexCoord);\nfloat average = (max(max(col.r, col.g),col.b) + min(min(col.r, col.g),col.b)) / 2.0;\ngl_FragColor = vec4(average, average, average, col.a);\n}',
        luminosity:
          'precision highp float;\nuniform sampler2D uTexture;\nuniform int uMode;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 col = texture2D(uTexture, vTexCoord);\nfloat average = 0.21 * col.r + 0.72 * col.g + 0.07 * col.b;\ngl_FragColor = vec4(average, average, average, col.a);\n}',
      },
      mode: 'average',
      mainParameter: 'mode',
      applyTo2d: function (t) {
        for (
          var e, i = t.imageData.data, r = i.length, n = this.mode, s = 0;
          s < r;
          s += 4
        )
          'average' === n
            ? (e = (i[s] + i[s + 1] + i[s + 2]) / 3)
            : 'lightness' === n
            ? (e =
                (Math.min(i[s], i[s + 1], i[s + 2]) +
                  Math.max(i[s], i[s + 1], i[s + 2])) /
                2)
            : 'luminosity' === n &&
              (e = 0.21 * i[s] + 0.72 * i[s + 1] + 0.07 * i[s + 2]),
            (i[s] = e),
            (i[s + 1] = e),
            (i[s + 2] = e)
      },
      retrieveShader: function (t) {
        var e,
          i = this.type + '_' + this.mode
        return (
          t.programCache.hasOwnProperty(i) ||
            ((e = this.fragmentSource[this.mode]),
            (t.programCache[i] = this.createProgram(t.context, e))),
          t.programCache[i]
        )
      },
      getUniformLocations: function (t, e) {
        return { uMode: t.getUniformLocation(e, 'uMode') }
      },
      sendUniformData: function (t, e) {
        t.uniform1i(e.uMode, 1)
      },
      isNeutralState: function () {
        return !1
      },
    })),
      (t.Image.filters.Grayscale.fromObject =
        t.Image.filters.BaseFilter.fromObject)
  })('undefined' != typeof exports ? exports : this),
  (function (t) {
    'use strict'
    var t = t.fabric || (t.fabric = {}),
      e = t.Image.filters,
      i = t.util.createClass
    ;(e.Invert = i(e.BaseFilter, {
      type: 'Invert',
      fragmentSource:
        'precision highp float;\nuniform sampler2D uTexture;\nuniform int uInvert;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nif (uInvert == 1) {\ngl_FragColor = vec4(1.0 - color.r,1.0 -color.g,1.0 -color.b,color.a);\n} else {\ngl_FragColor = color;\n}\n}',
      invert: !0,
      mainParameter: 'invert',
      applyTo2d: function (t) {
        for (var e = t.imageData.data, i = e.length, r = 0; r < i; r += 4)
          (e[r] = 255 - e[r]),
            (e[r + 1] = 255 - e[r + 1]),
            (e[r + 2] = 255 - e[r + 2])
      },
      isNeutralState: function () {
        return !this.invert
      },
      getUniformLocations: function (t, e) {
        return { uInvert: t.getUniformLocation(e, 'uInvert') }
      },
      sendUniformData: function (t, e) {
        t.uniform1i(e.uInvert, this.invert)
      },
    })),
      (t.Image.filters.Invert.fromObject =
        t.Image.filters.BaseFilter.fromObject)
  })('undefined' != typeof exports ? exports : this),
  (function (t) {
    'use strict'
    var t = t.fabric || (t.fabric = {}),
      e = t.util.object.extend,
      i = t.Image.filters,
      r = t.util.createClass
    ;(i.Noise = r(i.BaseFilter, {
      type: 'Noise',
      fragmentSource:
        'precision highp float;\nuniform sampler2D uTexture;\nuniform float uStepH;\nuniform float uNoise;\nuniform float uSeed;\nvarying vec2 vTexCoord;\nfloat rand(vec2 co, float seed, float vScale) {\nreturn fract(sin(dot(co.xy * vScale ,vec2(12.9898 , 78.233))) * 43758.5453 * (seed + 0.01) / 2.0);\n}\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\ncolor.rgb += (0.5 - rand(vTexCoord, uSeed, 0.1 / uStepH)) * uNoise;\ngl_FragColor = color;\n}',
      mainParameter: 'noise',
      noise: 0,
      applyTo2d: function (t) {
        if (0 !== this.noise)
          for (
            var e,
              i = t.imageData.data,
              r = (i.length, this.noise),
              n = 0,
              s = i.length;
            n < s;
            n += 4
          )
            (e = (0.5 - Math.random()) * r),
              (i[n] += e),
              (i[n + 1] += e),
              (i[n + 2] += e)
      },
      getUniformLocations: function (t, e) {
        return {
          uNoise: t.getUniformLocation(e, 'uNoise'),
          uSeed: t.getUniformLocation(e, 'uSeed'),
        }
      },
      sendUniformData: function (t, e) {
        t.uniform1f(e.uNoise, this.noise / 255),
          t.uniform1f(e.uSeed, Math.random())
      },
      toObject: function () {
        return e(this.callSuper('toObject'), { noise: this.noise })
      },
    })),
      (t.Image.filters.Noise.fromObject = t.Image.filters.BaseFilter.fromObject)
  })('undefined' != typeof exports ? exports : this),
  (function (t) {
    'use strict'
    var t = t.fabric || (t.fabric = {}),
      e = t.Image.filters,
      i = t.util.createClass
    ;(e.Pixelate = i(e.BaseFilter, {
      type: 'Pixelate',
      blocksize: 4,
      mainParameter: 'blocksize',
      fragmentSource:
        'precision highp float;\nuniform sampler2D uTexture;\nuniform float uBlocksize;\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nfloat blockW = uBlocksize * uStepW;\nfloat blockH = uBlocksize * uStepW;\nint posX = int(vTexCoord.x / blockW);\nint posY = int(vTexCoord.y / blockH);\nfloat fposX = float(posX);\nfloat fposY = float(posY);\nvec2 squareCoords = vec2(fposX * blockW, fposY * blockH);\nvec4 color = texture2D(uTexture, squareCoords);\ngl_FragColor = color;\n}',
      applyTo2d: function (t) {
        for (
          var e,
            i,
            r,
            n,
            s,
            o,
            a,
            c,
            h,
            l,
            t = t.imageData,
            u = t.data,
            f = t.height,
            d = t.width,
            g = 0;
          g < f;
          g += this.blocksize
        )
          for (i = 0; i < d; i += this.blocksize)
            for (
              r = u[(e = 4 * g * d + 4 * i)],
                n = u[1 + e],
                s = u[2 + e],
                o = u[3 + e],
                h = Math.min(g + this.blocksize, f),
                l = Math.min(i + this.blocksize, d),
                a = g;
              a < h;
              a++
            )
              for (c = i; c < l; c++)
                (u[(e = 4 * a * d + 4 * c)] = r),
                  (u[1 + e] = n),
                  (u[2 + e] = s),
                  (u[3 + e] = o)
      },
      isNeutralState: function () {
        return 1 === this.blocksize
      },
      getUniformLocations: function (t, e) {
        return {
          uBlocksize: t.getUniformLocation(e, 'uBlocksize'),
          uStepW: t.getUniformLocation(e, 'uStepW'),
          uStepH: t.getUniformLocation(e, 'uStepH'),
        }
      },
      sendUniformData: function (t, e) {
        t.uniform1f(e.uBlocksize, this.blocksize)
      },
    })),
      (t.Image.filters.Pixelate.fromObject =
        t.Image.filters.BaseFilter.fromObject)
  })('undefined' != typeof exports ? exports : this),
  (function (t) {
    'use strict'
    var h = t.fabric || (t.fabric = {}),
      e = h.util.object.extend,
      t = h.Image.filters,
      i = h.util.createClass
    ;(t.RemoveColor = i(t.BaseFilter, {
      type: 'RemoveColor',
      color: '#FFFFFF',
      fragmentSource:
        'precision highp float;\nuniform sampler2D uTexture;\nuniform vec4 uLow;\nuniform vec4 uHigh;\nvarying vec2 vTexCoord;\nvoid main() {\ngl_FragColor = texture2D(uTexture, vTexCoord);\nif(all(greaterThan(gl_FragColor.rgb,uLow.rgb)) && all(greaterThan(uHigh.rgb,gl_FragColor.rgb))) {\ngl_FragColor.a = 0.0;\n}\n}',
      distance: 0.02,
      useAlpha: !1,
      applyTo2d: function (t) {
        for (
          var e,
            i,
            r,
            n = t.imageData.data,
            t = 255 * this.distance,
            s = new h.Color(this.color).getSource(),
            o = [s[0] - t, s[1] - t, s[2] - t],
            a = [s[0] + t, s[1] + t, s[2] + t],
            c = 0;
          c < n.length;
          c += 4
        )
          (e = n[c]),
            (i = n[c + 1]),
            (r = n[c + 2]),
            o[0] < e &&
              o[1] < i &&
              o[2] < r &&
              e < a[0] &&
              i < a[1] &&
              r < a[2] &&
              (n[c + 3] = 0)
      },
      getUniformLocations: function (t, e) {
        return {
          uLow: t.getUniformLocation(e, 'uLow'),
          uHigh: t.getUniformLocation(e, 'uHigh'),
        }
      },
      sendUniformData: function (t, e) {
        var i = new h.Color(this.color).getSource(),
          r = parseFloat(this.distance),
          n = [0 + i[0] / 255 - r, 0 + i[1] / 255 - r, 0 + i[2] / 255 - r, 1],
          i = [i[0] / 255 + r, i[1] / 255 + r, i[2] / 255 + r, 1]
        t.uniform4fv(e.uLow, n), t.uniform4fv(e.uHigh, i)
      },
      toObject: function () {
        return e(this.callSuper('toObject'), {
          color: this.color,
          distance: this.distance,
        })
      },
    })),
      (h.Image.filters.RemoveColor.fromObject =
        h.Image.filters.BaseFilter.fromObject)
  })('undefined' != typeof exports ? exports : this),
  (function (t) {
    'use strict'
    var e,
      i = t.fabric || (t.fabric = {}),
      r = i.Image.filters,
      n = i.util.createClass,
      s = {
        Brownie: [
          0.5997, 0.34553, -0.27082, 0, 0.186, -0.0377, 0.86095, 0.15059, 0,
          -0.1449, 0.24113, -0.07441, 0.44972, 0, -0.02965, 0, 0, 0, 1, 0,
        ],
        Vintage: [
          0.62793, 0.32021, -0.03965, 0, 0.03784, 0.02578, 0.64411, 0.03259, 0,
          0.02926, 0.0466, -0.08512, 0.52416, 0, 0.02023, 0, 0, 0, 1, 0,
        ],
        Kodachrome: [
          1.12855, -0.39673, -0.03992, 0, 0.24991, -0.16404, 1.08352, -0.05498,
          0, 0.09698, -0.16786, -0.56034, 1.60148, 0, 0.13972, 0, 0, 0, 1, 0,
        ],
        Technicolor: [
          1.91252, -0.85453, -0.09155, 0, 0.04624, -0.30878, 1.76589, -0.10601,
          0, -0.27589, -0.2311, -0.75018, 1.84759, 0, 0.12137, 0, 0, 0, 1, 0,
        ],
        Polaroid: [
          1.438, -0.062, -0.062, 0, 0, -0.122, 1.378, -0.122, 0, 0, -0.016,
          -0.016, 1.483, 0, 0, 0, 0, 0, 1, 0,
        ],
        Sepia: [
          0.393, 0.769, 0.189, 0, 0, 0.349, 0.686, 0.168, 0, 0, 0.272, 0.534,
          0.131, 0, 0, 0, 0, 0, 1, 0,
        ],
        BlackWhite: [
          1.5, 1.5, 1.5, 0, -1, 1.5, 1.5, 1.5, 0, -1, 1.5, 1.5, 1.5, 0, -1, 0,
          0, 0, 1, 0,
        ],
      }
    for (e in s)
      (r[e] = n(r.ColorMatrix, {
        type: e,
        matrix: s[e],
        mainParameter: !1,
        colorsOnly: !0,
      })),
        (i.Image.filters[e].fromObject = i.Image.filters.BaseFilter.fromObject)
  })('undefined' != typeof exports ? exports : this),
  (function (t) {
    'use strict'
    var u = t.fabric,
      t = u.Image.filters,
      e = u.util.createClass
    ;(t.BlendColor = e(t.BaseFilter, {
      type: 'BlendColor',
      color: '#F95C63',
      mode: 'multiply',
      alpha: 1,
      fragmentSource: {
        multiply: 'gl_FragColor.rgb *= uColor.rgb;\n',
        screen:
          'gl_FragColor.rgb = 1.0 - (1.0 - gl_FragColor.rgb) * (1.0 - uColor.rgb);\n',
        add: 'gl_FragColor.rgb += uColor.rgb;\n',
        diff: 'gl_FragColor.rgb = abs(gl_FragColor.rgb - uColor.rgb);\n',
        subtract: 'gl_FragColor.rgb -= uColor.rgb;\n',
        lighten: 'gl_FragColor.rgb = max(gl_FragColor.rgb, uColor.rgb);\n',
        darken: 'gl_FragColor.rgb = min(gl_FragColor.rgb, uColor.rgb);\n',
        exclusion:
          'gl_FragColor.rgb += uColor.rgb - 2.0 * (uColor.rgb * gl_FragColor.rgb);\n',
        overlay:
          'if (uColor.r < 0.5) {\ngl_FragColor.r *= 2.0 * uColor.r;\n} else {\ngl_FragColor.r = 1.0 - 2.0 * (1.0 - gl_FragColor.r) * (1.0 - uColor.r);\n}\nif (uColor.g < 0.5) {\ngl_FragColor.g *= 2.0 * uColor.g;\n} else {\ngl_FragColor.g = 1.0 - 2.0 * (1.0 - gl_FragColor.g) * (1.0 - uColor.g);\n}\nif (uColor.b < 0.5) {\ngl_FragColor.b *= 2.0 * uColor.b;\n} else {\ngl_FragColor.b = 1.0 - 2.0 * (1.0 - gl_FragColor.b) * (1.0 - uColor.b);\n}\n',
        tint: 'gl_FragColor.rgb *= (1.0 - uColor.a);\ngl_FragColor.rgb += uColor.rgb;\n',
      },
      buildSource: function (t) {
        return (
          'precision highp float;\nuniform sampler2D uTexture;\nuniform vec4 uColor;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\ngl_FragColor = color;\nif (color.a > 0.0) {\n' +
          this.fragmentSource[t] +
          '}\n}'
        )
      },
      retrieveShader: function (t) {
        var e,
          i = this.type + '_' + this.mode
        return (
          t.programCache.hasOwnProperty(i) ||
            ((e = this.buildSource(this.mode)),
            (t.programCache[i] = this.createProgram(t.context, e))),
          t.programCache[i]
        )
      },
      applyTo2d: function (t) {
        for (
          var e,
            i,
            r,
            n = t.imageData.data,
            s = n.length,
            o = 1 - this.alpha,
            t = new u.Color(this.color).getSource(),
            a = t[0] * this.alpha,
            c = t[1] * this.alpha,
            h = t[2] * this.alpha,
            l = 0;
          l < s;
          l += 4
        )
          switch (((e = n[l]), (i = n[l + 1]), (r = n[l + 2]), this.mode)) {
            case 'multiply':
              ;(n[l] = (e * a) / 255),
                (n[l + 1] = (i * c) / 255),
                (n[l + 2] = (r * h) / 255)
              break
            case 'screen':
              ;(n[l] = 255 - ((255 - e) * (255 - a)) / 255),
                (n[l + 1] = 255 - ((255 - i) * (255 - c)) / 255),
                (n[l + 2] = 255 - ((255 - r) * (255 - h)) / 255)
              break
            case 'add':
              ;(n[l] = e + a), (n[l + 1] = i + c), (n[l + 2] = r + h)
              break
            case 'diff':
            case 'difference':
              ;(n[l] = Math.abs(e - a)),
                (n[l + 1] = Math.abs(i - c)),
                (n[l + 2] = Math.abs(r - h))
              break
            case 'subtract':
              ;(n[l] = e - a), (n[l + 1] = i - c), (n[l + 2] = r - h)
              break
            case 'darken':
              ;(n[l] = Math.min(e, a)),
                (n[l + 1] = Math.min(i, c)),
                (n[l + 2] = Math.min(r, h))
              break
            case 'lighten':
              ;(n[l] = Math.max(e, a)),
                (n[l + 1] = Math.max(i, c)),
                (n[l + 2] = Math.max(r, h))
              break
            case 'overlay':
              ;(n[l] =
                a < 128
                  ? (2 * e * a) / 255
                  : 255 - (2 * (255 - e) * (255 - a)) / 255),
                (n[l + 1] =
                  c < 128
                    ? (2 * i * c) / 255
                    : 255 - (2 * (255 - i) * (255 - c)) / 255),
                (n[l + 2] =
                  h < 128
                    ? (2 * r * h) / 255
                    : 255 - (2 * (255 - r) * (255 - h)) / 255)
              break
            case 'exclusion':
              ;(n[l] = a + e - (2 * a * e) / 255),
                (n[l + 1] = c + i - (2 * c * i) / 255),
                (n[l + 2] = h + r - (2 * h * r) / 255)
              break
            case 'tint':
              ;(n[l] = a + e * o),
                (n[l + 1] = c + i * o),
                (n[l + 2] = h + r * o)
          }
      },
      getUniformLocations: function (t, e) {
        return { uColor: t.getUniformLocation(e, 'uColor') }
      },
      sendUniformData: function (t, e) {
        var i = new u.Color(this.color).getSource()
        ;(i[0] = (this.alpha * i[0]) / 255),
          (i[1] = (this.alpha * i[1]) / 255),
          (i[2] = (this.alpha * i[2]) / 255),
          (i[3] = this.alpha),
          t.uniform4fv(e.uColor, i)
      },
      toObject: function () {
        return {
          type: this.type,
          color: this.color,
          mode: this.mode,
          alpha: this.alpha,
        }
      },
    })),
      (u.Image.filters.BlendColor.fromObject =
        u.Image.filters.BaseFilter.fromObject)
  })('undefined' != typeof exports ? exports : this),
  (function (t) {
    'use strict'
    var v = t.fabric,
      t = v.Image.filters,
      e = v.util.createClass
    ;(t.BlendImage = e(t.BaseFilter, {
      type: 'BlendImage',
      image: null,
      mode: 'multiply',
      alpha: 1,
      vertexSource:
        'attribute vec2 aPosition;\nvarying vec2 vTexCoord;\nvarying vec2 vTexCoord2;\nuniform mat3 uTransformMatrix;\nvoid main() {\nvTexCoord = aPosition;\nvTexCoord2 = (uTransformMatrix * vec3(aPosition, 1.0)).xy;\ngl_Position = vec4(aPosition * 2.0 - 1.0, 0.0, 1.0);\n}',
      fragmentSource: {
        multiply:
          'precision highp float;\nuniform sampler2D uTexture;\nuniform sampler2D uImage;\nuniform vec4 uColor;\nvarying vec2 vTexCoord;\nvarying vec2 vTexCoord2;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nvec4 color2 = texture2D(uImage, vTexCoord2);\ncolor.rgba *= color2.rgba;\ngl_FragColor = color;\n}',
        mask: 'precision highp float;\nuniform sampler2D uTexture;\nuniform sampler2D uImage;\nuniform vec4 uColor;\nvarying vec2 vTexCoord;\nvarying vec2 vTexCoord2;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nvec4 color2 = texture2D(uImage, vTexCoord2);\ncolor.a = color2.a;\ngl_FragColor = color;\n}',
      },
      retrieveShader: function (t) {
        var e = this.type + '_' + this.mode,
          i = this.fragmentSource[this.mode]
        return (
          t.programCache.hasOwnProperty(e) ||
            (t.programCache[e] = this.createProgram(t.context, i)),
          t.programCache[e]
        )
      },
      applyToWebGL: function (t) {
        var e = t.context,
          i = this.createTexture(t.filterBackend, this.image)
        this.bindAdditionalTexture(e, i, e.TEXTURE1),
          this.callSuper('applyToWebGL', t),
          this.unbindAdditionalTexture(e, e.TEXTURE1)
      },
      createTexture: function (t, e) {
        return t.getCachedTexture(e.cacheKey, e._element)
      },
      calculateMatrix: function () {
        var t = this.image,
          e = t._element.width,
          i = t._element.height
        return [
          1 / t.scaleX,
          0,
          0,
          0,
          1 / t.scaleY,
          0,
          -t.left / e,
          -t.top / i,
          1,
        ]
      },
      applyTo2d: function (t) {
        var e,
          i,
          r,
          n,
          s,
          o,
          a,
          c,
          h,
          l = t.imageData,
          t = t.filterBackend.resources,
          u = l.data,
          f = u.length,
          d = l.width,
          l = l.height,
          g = this.image
        t.blendImage || (t.blendImage = v.util.createCanvasElement()),
          (h = (t = t.blendImage).getContext('2d')),
          t.width !== d || t.height !== l
            ? ((t.width = d), (t.height = l))
            : h.clearRect(0, 0, d, l),
          h.setTransform(g.scaleX, 0, 0, g.scaleY, g.left, g.top),
          h.drawImage(g._element, 0, 0, d, l)
        for (var p = h.getImageData(0, 0, d, l).data, m = 0; m < f; m += 4)
          switch (
            ((s = u[m]),
            (o = u[m + 1]),
            (a = u[m + 2]),
            (c = u[m + 3]),
            (e = p[m]),
            (i = p[m + 1]),
            (r = p[m + 2]),
            (n = p[m + 3]),
            this.mode)
          ) {
            case 'multiply':
              ;(u[m] = (s * e) / 255),
                (u[m + 1] = (o * i) / 255),
                (u[m + 2] = (a * r) / 255),
                (u[m + 3] = (c * n) / 255)
              break
            case 'mask':
              u[m + 3] = n
          }
      },
      getUniformLocations: function (t, e) {
        return {
          uTransformMatrix: t.getUniformLocation(e, 'uTransformMatrix'),
          uImage: t.getUniformLocation(e, 'uImage'),
        }
      },
      sendUniformData: function (t, e) {
        var i = this.calculateMatrix()
        t.uniform1i(e.uImage, 1), t.uniformMatrix3fv(e.uTransformMatrix, !1, i)
      },
      toObject: function () {
        return {
          type: this.type,
          image: this.image && this.image.toObject(),
          mode: this.mode,
          alpha: this.alpha,
        }
      },
    })),
      (v.Image.filters.BlendImage.fromObject = function (i, r) {
        v.Image.fromObject(i.image, function (t) {
          var e = v.util.object.clone(i)
          ;(e.image = t), r(new v.Image.filters.BlendImage(e))
        })
      })
  })('undefined' != typeof exports ? exports : this),
  (function (t) {
    'use strict'
    var m = t.fabric || (t.fabric = {}),
      j = Math.pow,
      A = Math.floor,
      D = Math.sqrt,
      M = Math.abs,
      o = Math.round,
      r = Math.sin,
      F = Math.ceil,
      t = m.Image.filters,
      e = m.util.createClass
    ;(t.Resize = e(t.BaseFilter, {
      type: 'Resize',
      resizeType: 'hermite',
      scaleX: 1,
      scaleY: 1,
      lanczosLobes: 3,
      getUniformLocations: function (t, e) {
        return {
          uDelta: t.getUniformLocation(e, 'uDelta'),
          uTaps: t.getUniformLocation(e, 'uTaps'),
        }
      },
      sendUniformData: function (t, e) {
        t.uniform2fv(
          e.uDelta,
          this.horizontal ? [1 / this.width, 0] : [0, 1 / this.height]
        ),
          t.uniform1fv(e.uTaps, this.taps)
      },
      retrieveShader: function (t) {
        var e = this.getFilterWindow(),
          i = this.type + '_' + e
        return (
          t.programCache.hasOwnProperty(i) ||
            ((e = this.generateShader(e)),
            (t.programCache[i] = this.createProgram(t.context, e))),
          t.programCache[i]
        )
      },
      getFilterWindow: function () {
        var t = this.tempScale
        return Math.ceil(this.lanczosLobes / t)
      },
      getTaps: function () {
        for (
          var t = this.lanczosCreate(this.lanczosLobes),
            e = this.tempScale,
            i = this.getFilterWindow(),
            r = new Array(i),
            n = 1;
          n <= i;
          n++
        )
          r[n - 1] = t(n * e)
        return r
      },
      generateShader: function (t) {
        for (
          var e = new Array(t), i = this.fragmentSourceTOP, r = 1;
          r <= t;
          r++
        )
          e[r - 1] = r + '.0 * uDelta'
        return (
          (i =
            (i =
              i + ('uniform float uTaps[' + t + '];\n') + 'void main() {\n') +
            '  vec4 color = texture2D(uTexture, vTexCoord);\n' +
            '  float sum = 1.0;\n'),
          e.forEach(function (t, e) {
            i =
              (i +=
                '  color += texture2D(uTexture, vTexCoord + ' +
                t +
                ') * uTaps[' +
                e +
                '];\n') +
              '  color += texture2D(uTexture, vTexCoord - ' +
              t +
              ') * uTaps[' +
              e +
              '];\n  sum += 2.0 * uTaps[' +
              e +
              '];\n'
          }),
          (i = i + '  gl_FragColor = color / sum;\n' + '}')
        )
      },
      fragmentSourceTOP:
        'precision highp float;\nuniform sampler2D uTexture;\nuniform vec2 uDelta;\nvarying vec2 vTexCoord;\n',
      applyTo: function (t) {
        t.webgl
          ? (t.passes++,
            (this.width = t.sourceWidth),
            (this.horizontal = !0),
            (this.dW = Math.round(this.width * this.scaleX)),
            (this.dH = t.sourceHeight),
            (this.tempScale = this.dW / this.width),
            (this.taps = this.getTaps()),
            (t.destinationWidth = this.dW),
            this._setupFrameBuffer(t),
            this.applyToWebGL(t),
            this._swapTextures(t),
            (t.sourceWidth = t.destinationWidth),
            (this.height = t.sourceHeight),
            (this.horizontal = !1),
            (this.dH = Math.round(this.height * this.scaleY)),
            (this.tempScale = this.dH / this.height),
            (this.taps = this.getTaps()),
            (t.destinationHeight = this.dH),
            this._setupFrameBuffer(t),
            this.applyToWebGL(t),
            this._swapTextures(t),
            (t.sourceHeight = t.destinationHeight))
          : this.applyTo2d(t)
      },
      isNeutralState: function () {
        return 1 === this.scaleX && 1 === this.scaleY
      },
      lanczosCreate: function (i) {
        return function (t) {
          if (i <= t || t <= -i) return 0
          if (t < 1.1920929e-7 && -1.1920929e-7 < t) return 1
          var e = (t *= Math.PI) / i
          return ((r(t) / t) * r(e)) / e
        }
      },
      applyTo2d: function (t) {
        var e,
          i = t.imageData,
          r = this.scaleX,
          n = this.scaleY,
          s = ((this.rcpScaleX = 1 / r), (this.rcpScaleY = 1 / n), i.width),
          i = i.height,
          r = o(s * r),
          n = o(i * n)
        'sliceHack' === this.resizeType
          ? (e = this.sliceByTwo(t, s, i, r, n))
          : 'hermite' === this.resizeType
          ? (e = this.hermiteFastResize(t, s, i, r, n))
          : 'bilinear' === this.resizeType
          ? (e = this.bilinearFiltering(t, s, i, r, n))
          : 'lanczos' === this.resizeType &&
            (e = this.lanczosResize(t, s, i, r, n)),
          (t.imageData = e)
      },
      sliceByTwo: function (t, e, i, r, n) {
        var s,
          o,
          t = t.imageData,
          a = !1,
          c = !1,
          h = 0.5 * e,
          l = 0.5 * i,
          u = m.filterBackend.resources,
          f = 0,
          d = 0,
          g = e,
          p = 0
        for (
          u.sliceByTwo || (u.sliceByTwo = document.createElement('canvas')),
            ((s = u.sliceByTwo).width < 1.5 * e || s.height < i) &&
              ((s.width = 1.5 * e), (s.height = i)),
            (o = s.getContext('2d')).clearRect(0, 0, 1.5 * e, i),
            o.putImageData(t, 0, 0),
            r = A(r),
            n = A(n);
          !a || !c;

        )
          (i = l),
            r < A(0.5 * (e = h)) ? (h = A(0.5 * h)) : ((h = r), (a = !0)),
            n < A(0.5 * l) ? (l = A(0.5 * l)) : ((l = n), (c = !0)),
            o.drawImage(s, f, d, e, i, g, p, h, l),
            (f = g),
            (d = p),
            (p += l)
        return o.getImageData(f, d, r, n)
      },
      lanczosResize: function (t, d, g, p, m) {
        var v = t.imageData.data,
          b = t.ctx.createImageData(p, m),
          y = b.data,
          _ = this.lanczosCreate(this.lanczosLobes),
          x = this.rcpScaleX,
          C = this.rcpScaleY,
          S = 2 / this.rcpScaleX,
          T = 2 / this.rcpScaleY,
          w = F((x * this.lanczosLobes) / 2),
          O = F((C * this.lanczosLobes) / 2),
          P = {},
          k = {},
          E = {}
        return (function t(e) {
          var i, r, n, s, o, a, c, h, l, u
          for (k.x = (e + 0.5) * x, E.x = A(k.x), i = 0; i < m; i++) {
            for (
              k.y = (i + 0.5) * C,
                E.y = A(k.y),
                h = c = a = o = s = 0,
                r = E.x - w;
              r <= E.x + w;
              r++
            )
              if (!(r < 0 || d <= r)) {
                ;(l = A(1e3 * M(r - k.x))), P[l] || (P[l] = {})
                for (var f = E.y - O; f <= E.y + O; f++)
                  f < 0 ||
                    g <= f ||
                    ((u = A(1e3 * M(f - k.y))),
                    P[l][u] ||
                      (P[l][u] = _(D(j(l * S, 2) + j(u * T, 2)) / 1e3)),
                    0 < (u = P[l][u]) &&
                      ((s += u),
                      (o += u * v[(n = 4 * (f * d + r))]),
                      (a += u * v[n + 1]),
                      (c += u * v[n + 2]),
                      (h += u * v[n + 3])))
              }
            ;(y[(n = 4 * (i * p + e))] = o / s),
              (y[n + 1] = a / s),
              (y[n + 2] = c / s),
              (y[n + 3] = h / s)
          }
          return ++e < p ? t(e) : b
        })(0)
      },
      bilinearFiltering: function (t, e, i, r, n) {
        for (
          var s,
            o,
            a,
            c,
            h,
            l,
            u,
            f,
            d,
            g,
            p,
            m = 0,
            v = this.rcpScaleX,
            b = this.rcpScaleY,
            y = 4 * (e - 1),
            _ = t.imageData.data,
            t = t.ctx.createImageData(r, n),
            x = t.data,
            C = 0;
          C < n;
          C++
        )
          for (u = 0; u < r; u++)
            for (
              f = v * u - (h = A(v * u)),
                d = b * C - (l = A(b * C)),
                p = 4 * (l * e + h),
                g = 0;
              g < 4;
              g++
            )
              (s = _[p + g]),
                (o = _[4 + p + g]),
                (a = _[p + y + g]),
                (c = _[p + y + 4 + g]),
                (x[m++] =
                  s * (1 - f) * (1 - d) +
                  o * f * (1 - d) +
                  a * d * (1 - f) +
                  c * f * d)
        return t
      },
      hermiteFastResize: function (t, e, i, r, n) {
        for (
          var s = this.rcpScaleX,
            o = this.rcpScaleY,
            a = F(s / 2),
            c = F(o / 2),
            h = t.imageData.data,
            t = t.ctx.createImageData(r, n),
            l = t.data,
            u = 0;
          u < n;
          u++
        )
          for (var f = 0; f < r; f++) {
            for (
              var d = 4 * (f + u * r),
                g = 0,
                p = 0,
                m = 0,
                v = 0,
                b = 0,
                y = 0,
                _ = 0,
                x = (u + 0.5) * o,
                C = A(u * o);
              C < (u + 1) * o;
              C++
            )
              for (
                var S = M(x - (C + 0.5)) / c,
                  T = (f + 0.5) * s,
                  w = S * S,
                  O = A(f * s);
                O < (f + 1) * s;
                O++
              ) {
                var P = M(T - (O + 0.5)) / a,
                  k = D(w + P * P)
                ;(1 < k && k < -1) ||
                  (0 < (g = 2 * k * k * k - 3 * k * k + 1) &&
                    ((_ += g * h[3 + (P = 4 * (O + C * e))]),
                    (m += g),
                    (v +=
                      (g = h[3 + P] < 255 ? (g * h[3 + P]) / 250 : g) * h[P]),
                    (b += g * h[1 + P]),
                    (y += g * h[2 + P]),
                    (p += g)))
              }
            ;(l[d] = v / p),
              (l[1 + d] = b / p),
              (l[2 + d] = y / p),
              (l[3 + d] = _ / m)
          }
        return t
      },
      toObject: function () {
        return {
          type: this.type,
          scaleX: this.scaleX,
          scaleY: this.scaleY,
          resizeType: this.resizeType,
          lanczosLobes: this.lanczosLobes,
        }
      },
    })),
      (m.Image.filters.Resize.fromObject =
        m.Image.filters.BaseFilter.fromObject)
  })('undefined' != typeof exports ? exports : this),
  (function (t) {
    'use strict'
    var t = t.fabric || (t.fabric = {}),
      e = t.Image.filters,
      i = t.util.createClass
    ;(e.Contrast = i(e.BaseFilter, {
      type: 'Contrast',
      fragmentSource:
        'precision highp float;\nuniform sampler2D uTexture;\nuniform float uContrast;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nfloat contrastF = 1.015 * (uContrast + 1.0) / (1.0 * (1.015 - uContrast));\ncolor.rgb = contrastF * (color.rgb - 0.5) + 0.5;\ngl_FragColor = color;\n}',
      contrast: 0,
      mainParameter: 'contrast',
      applyTo2d: function (t) {
        if (0 !== this.contrast)
          for (
            var e = t.imageData.data,
              i = e.length,
              t = Math.floor(255 * this.contrast),
              r = (259 * (t + 255)) / (255 * (259 - t)),
              n = 0;
            n < i;
            n += 4
          )
            (e[n] = r * (e[n] - 128) + 128),
              (e[n + 1] = r * (e[n + 1] - 128) + 128),
              (e[n + 2] = r * (e[n + 2] - 128) + 128)
      },
      getUniformLocations: function (t, e) {
        return { uContrast: t.getUniformLocation(e, 'uContrast') }
      },
      sendUniformData: function (t, e) {
        t.uniform1f(e.uContrast, this.contrast)
      },
    })),
      (t.Image.filters.Contrast.fromObject =
        t.Image.filters.BaseFilter.fromObject)
  })('undefined' != typeof exports ? exports : this),
  (function (t) {
    'use strict'
    var t = t.fabric || (t.fabric = {}),
      e = t.Image.filters,
      i = t.util.createClass
    ;(e.Saturation = i(e.BaseFilter, {
      type: 'Saturation',
      fragmentSource:
        'precision highp float;\nuniform sampler2D uTexture;\nuniform float uSaturation;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nfloat rgMax = max(color.r, color.g);\nfloat rgbMax = max(rgMax, color.b);\ncolor.r += rgbMax != color.r ? (rgbMax - color.r) * uSaturation : 0.00;\ncolor.g += rgbMax != color.g ? (rgbMax - color.g) * uSaturation : 0.00;\ncolor.b += rgbMax != color.b ? (rgbMax - color.b) * uSaturation : 0.00;\ngl_FragColor = color;\n}',
      saturation: 0,
      mainParameter: 'saturation',
      applyTo2d: function (t) {
        if (0 !== this.saturation)
          for (
            var e,
              i = t.imageData.data,
              r = i.length,
              n = -this.saturation,
              s = 0;
            s < r;
            s += 4
          )
            (e = Math.max(i[s], i[s + 1], i[s + 2])),
              (i[s] += e !== i[s] ? (e - i[s]) * n : 0),
              (i[s + 1] += e !== i[s + 1] ? (e - i[s + 1]) * n : 0),
              (i[s + 2] += e !== i[s + 2] ? (e - i[s + 2]) * n : 0)
      },
      getUniformLocations: function (t, e) {
        return { uSaturation: t.getUniformLocation(e, 'uSaturation') }
      },
      sendUniformData: function (t, e) {
        t.uniform1f(e.uSaturation, -this.saturation)
      },
    })),
      (t.Image.filters.Saturation.fromObject =
        t.Image.filters.BaseFilter.fromObject)
  })('undefined' != typeof exports ? exports : this),
  (function (t) {
    'use strict'
    var t = t.fabric || (t.fabric = {}),
      e = t.Image.filters,
      i = t.util.createClass
    ;(e.Vibrance = i(e.BaseFilter, {
      type: 'Vibrance',
      fragmentSource:
        'precision highp float;\nuniform sampler2D uTexture;\nuniform float uVibrance;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nfloat max = max(color.r, max(color.g, color.b));\nfloat avg = (color.r + color.g + color.b) / 3.0;\nfloat amt = (abs(max - avg) * 2.0) * uVibrance;\ncolor.r += max != color.r ? (max - color.r) * amt : 0.00;\ncolor.g += max != color.g ? (max - color.g) * amt : 0.00;\ncolor.b += max != color.b ? (max - color.b) * amt : 0.00;\ngl_FragColor = color;\n}',
      vibrance: 0,
      mainParameter: 'vibrance',
      applyTo2d: function (t) {
        if (0 !== this.vibrance)
          for (
            var e,
              i,
              r = t.imageData.data,
              n = r.length,
              s = -this.vibrance,
              o = 0;
            o < n;
            o += 4
          )
            (e = Math.max(r[o], r[o + 1], r[o + 2])),
              (i = (r[o] + r[o + 1] + r[o + 2]) / 3),
              (i = ((2 * Math.abs(e - i)) / 255) * s),
              (r[o] += e !== r[o] ? (e - r[o]) * i : 0),
              (r[o + 1] += e !== r[o + 1] ? (e - r[o + 1]) * i : 0),
              (r[o + 2] += e !== r[o + 2] ? (e - r[o + 2]) * i : 0)
      },
      getUniformLocations: function (t, e) {
        return { uVibrance: t.getUniformLocation(e, 'uVibrance') }
      },
      sendUniformData: function (t, e) {
        t.uniform1f(e.uVibrance, -this.vibrance)
      },
    })),
      (t.Image.filters.Vibrance.fromObject =
        t.Image.filters.BaseFilter.fromObject)
  })('undefined' != typeof exports ? exports : this),
  (function (t) {
    'use strict'
    var d = t.fabric || (t.fabric = {}),
      t = d.Image.filters,
      e = d.util.createClass
    ;(t.Blur = e(t.BaseFilter, {
      type: 'Blur',
      fragmentSource:
        'precision highp float;\nuniform sampler2D uTexture;\nuniform vec2 uDelta;\nvarying vec2 vTexCoord;\nconst float nSamples = 15.0;\nvec3 v3offset = vec3(12.9898, 78.233, 151.7182);\nfloat random(vec3 scale) {\nreturn fract(sin(dot(gl_FragCoord.xyz, scale)) * 43758.5453);\n}\nvoid main() {\nvec4 color = vec4(0.0);\nfloat total = 0.0;\nfloat offset = random(v3offset);\nfor (float t = -nSamples; t <= nSamples; t++) {\nfloat percent = (t + offset - 0.5) / nSamples;\nfloat weight = 1.0 - abs(percent);\ncolor += texture2D(uTexture, vTexCoord + uDelta * percent) * weight;\ntotal += weight;\n}\ngl_FragColor = color / total;\n}',
      blur: 0,
      mainParameter: 'blur',
      applyTo: function (t) {
        t.webgl
          ? ((this.aspectRatio = t.sourceWidth / t.sourceHeight),
            t.passes++,
            this._setupFrameBuffer(t),
            (this.horizontal = !0),
            this.applyToWebGL(t),
            this._swapTextures(t),
            this._setupFrameBuffer(t),
            (this.horizontal = !1),
            this.applyToWebGL(t),
            this._swapTextures(t))
          : this.applyTo2d(t)
      },
      applyTo2d: function (t) {
        t.imageData = this.simpleBlur(t)
      },
      simpleBlur: function (t) {
        var e,
          i,
          r,
          n,
          s,
          o,
          a = t.filterBackend.resources,
          c = t.imageData.width,
          h = t.imageData.height,
          l =
            (a.blurLayer1 ||
              ((a.blurLayer1 = d.util.createCanvasElement()),
              (a.blurLayer2 = d.util.createCanvasElement())),
            (e = a.blurLayer1),
            (i = a.blurLayer2),
            (e.width === c && e.height === h) ||
              ((i.width = e.width = c), (i.height = e.height = h)),
            e.getContext('2d')),
          u = i.getContext('2d'),
          f = 0.06 * this.blur * 0.5
        for (
          l.putImageData(t.imageData, 0, 0), u.clearRect(0, 0, c, h), o = -15;
          o <= 15;
          o++
        )
          (s = f * (n = o / 15) * c + (r = (Math.random() - 0.5) / 4)),
            (u.globalAlpha = 1 - Math.abs(n)),
            u.drawImage(e, s, r),
            l.drawImage(i, 0, 0),
            (u.globalAlpha = 1),
            u.clearRect(0, 0, i.width, i.height)
        for (o = -15; o <= 15; o++)
          (s = f * (n = o / 15) * h + (r = (Math.random() - 0.5) / 4)),
            (u.globalAlpha = 1 - Math.abs(n)),
            u.drawImage(e, r, s),
            l.drawImage(i, 0, 0),
            (u.globalAlpha = 1),
            u.clearRect(0, 0, i.width, i.height)
        t.ctx.drawImage(e, 0, 0)
        a = t.ctx.getImageData(0, 0, e.width, e.height)
        return (l.globalAlpha = 1), l.clearRect(0, 0, e.width, e.height), a
      },
      getUniformLocations: function (t, e) {
        return { delta: t.getUniformLocation(e, 'uDelta') }
      },
      sendUniformData: function (t, e) {
        var i = this.chooseRightDelta()
        t.uniform2fv(e.delta, i)
      },
      chooseRightDelta: function () {
        var t = 1,
          e = [0, 0]
        return (
          this.horizontal
            ? 1 < this.aspectRatio && (t = 1 / this.aspectRatio)
            : this.aspectRatio < 1 && (t = this.aspectRatio),
          (t = t * this.blur * 0.12),
          this.horizontal ? (e[0] = t) : (e[1] = t),
          e
        )
      },
    })),
      (t.Blur.fromObject = d.Image.filters.BaseFilter.fromObject)
  })('undefined' != typeof exports ? exports : this),
  (function (t) {
    'use strict'
    var t = t.fabric || (t.fabric = {}),
      e = t.Image.filters,
      i = t.util.createClass
    ;(e.Gamma = i(e.BaseFilter, {
      type: 'Gamma',
      fragmentSource:
        'precision highp float;\nuniform sampler2D uTexture;\nuniform vec3 uGamma;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nvec3 correction = (1.0 / uGamma);\ncolor.r = pow(color.r, correction.r);\ncolor.g = pow(color.g, correction.g);\ncolor.b = pow(color.b, correction.b);\ngl_FragColor = color;\ngl_FragColor.rgb *= color.a;\n}',
      gamma: [1, 1, 1],
      mainParameter: 'gamma',
      initialize: function (t) {
        ;(this.gamma = [1, 1, 1]),
          e.BaseFilter.prototype.initialize.call(this, t)
      },
      applyTo2d: function (t) {
        var e,
          i = t.imageData.data,
          t = this.gamma,
          r = i.length,
          n = 1 / t[0],
          s = 1 / t[1],
          o = 1 / t[2]
        for (
          this.rVals ||
            ((this.rVals = new Uint8Array(256)),
            (this.gVals = new Uint8Array(256)),
            (this.bVals = new Uint8Array(256))),
            e = 0,
            r = 256;
          e < r;
          e++
        )
          (this.rVals[e] = 255 * Math.pow(e / 255, n)),
            (this.gVals[e] = 255 * Math.pow(e / 255, s)),
            (this.bVals[e] = 255 * Math.pow(e / 255, o))
        for (e = 0, r = i.length; e < r; e += 4)
          (i[e] = this.rVals[i[e]]),
            (i[e + 1] = this.gVals[i[e + 1]]),
            (i[e + 2] = this.bVals[i[e + 2]])
      },
      getUniformLocations: function (t, e) {
        return { uGamma: t.getUniformLocation(e, 'uGamma') }
      },
      sendUniformData: function (t, e) {
        t.uniform3fv(e.uGamma, this.gamma)
      },
    })),
      (t.Image.filters.Gamma.fromObject = t.Image.filters.BaseFilter.fromObject)
  })('undefined' != typeof exports ? exports : this),
  (function (t) {
    'use strict'
    var i = t.fabric || (t.fabric = {}),
      t = i.Image.filters,
      e = i.util.createClass
    ;(t.Composed = e(t.BaseFilter, {
      type: 'Composed',
      subFilters: [],
      initialize: function (t) {
        this.callSuper('initialize', t),
          (this.subFilters = this.subFilters.slice(0))
      },
      applyTo: function (e) {
        ;(e.passes += this.subFilters.length - 1),
          this.subFilters.forEach(function (t) {
            t.applyTo(e)
          })
      },
      toObject: function () {
        return i.util.object.extend(this.callSuper('toObject'), {
          subFilters: this.subFilters.map(function (t) {
            return t.toObject()
          }),
        })
      },
      isNeutralState: function () {
        return !this.subFilters.some(function (t) {
          return !t.isNeutralState()
        })
      },
    })),
      (i.Image.filters.Composed.fromObject = function (t, e) {
        ;(t = (t.subFilters || []).map(function (t) {
          return new i.Image.filters[t.type](t)
        })),
          (t = new i.Image.filters.Composed({ subFilters: t }))
        return e && e(t), t
      })
  })('undefined' != typeof exports ? exports : this),
  (function (t) {
    'use strict'
    var r = t.fabric || (t.fabric = {}),
      e = r.Image.filters,
      t = r.util.createClass
    ;(e.HueRotation = t(e.ColorMatrix, {
      type: 'HueRotation',
      rotation: 0,
      mainParameter: 'rotation',
      calculateMatrix: function () {
        var t = this.rotation * Math.PI,
          e = r.util.cos(t),
          t = r.util.sin(t),
          t = Math.sqrt(1 / 3) * t,
          i = 1 - e
        ;(this.matrix = [
          1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0,
        ]),
          (this.matrix[0] = e + i / 3),
          (this.matrix[1] = (1 / 3) * i - t),
          (this.matrix[2] = (1 / 3) * i + t),
          (this.matrix[5] = (1 / 3) * i + t),
          (this.matrix[6] = e + (1 / 3) * i),
          (this.matrix[7] = (1 / 3) * i - t),
          (this.matrix[10] = (1 / 3) * i - t),
          (this.matrix[11] = (1 / 3) * i + t),
          (this.matrix[12] = e + (1 / 3) * i)
      },
      isNeutralState: function (t) {
        return (
          this.calculateMatrix(),
          e.BaseFilter.prototype.isNeutralState.call(this, t)
        )
      },
      applyTo: function (t) {
        this.calculateMatrix(), e.BaseFilter.prototype.applyTo.call(this, t)
      },
    })),
      (r.Image.filters.HueRotation.fromObject =
        r.Image.filters.BaseFilter.fromObject)
  })('undefined' != typeof exports ? exports : this),
  (function (t) {
    'use strict'
    var e,
      x = t.fabric || (t.fabric = {}),
      o = x.util.object.clone
    x.Text
      ? x.warn('fabric.Text is already defined')
      : ((e =
          'fontFamily fontWeight fontSize text underline overline linethrough textAlign fontStyle lineHeight textBackgroundColor charSpacing styles direction path pathStartOffset pathSide pathAlign'.split(
            ' '
          )),
        (x.Text = x.util.createClass(x.Object, {
          _dimensionAffectingProps: [
            'fontSize',
            'fontWeight',
            'fontFamily',
            'fontStyle',
            'lineHeight',
            'text',
            'charSpacing',
            'textAlign',
            'styles',
            'path',
            'pathStartOffset',
            'pathSide',
            'pathAlign',
          ],
          _reNewline: /\r?\n/,
          _reSpacesAndTabs: /[ \t\r]/g,
          _reSpaceAndTab: /[ \t\r]/,
          _reWords: /\S+/g,
          type: 'text',
          fontSize: 40,
          fontWeight: 'normal',
          fontFamily: 'Times New Roman',
          underline: !1,
          overline: !1,
          linethrough: !1,
          textAlign: 'left',
          fontStyle: 'normal',
          lineHeight: 1.16,
          superscript: { size: 0.6, baseline: -0.35 },
          subscript: { size: 0.6, baseline: 0.11 },
          textBackgroundColor: '',
          stateProperties: x.Object.prototype.stateProperties.concat(e),
          cacheProperties: x.Object.prototype.cacheProperties.concat(e),
          stroke: null,
          shadow: null,
          path: null,
          pathStartOffset: 0,
          pathSide: 'left',
          pathAlign: 'baseline',
          _fontSizeFraction: 0.222,
          offsets: { underline: 0.1, linethrough: -0.315, overline: -0.88 },
          _fontSizeMult: 1.13,
          charSpacing: 0,
          styles: null,
          _measuringContext: null,
          deltaY: 0,
          direction: 'ltr',
          _styleProperties: [
            'stroke',
            'strokeWidth',
            'fill',
            'fontFamily',
            'fontSize',
            'fontWeight',
            'fontStyle',
            'underline',
            'overline',
            'linethrough',
            'deltaY',
            'textBackgroundColor',
          ],
          __charBounds: [],
          CACHE_FONT_SIZE: 400,
          MIN_TEXT_WIDTH: 2,
          initialize: function (t, e) {
            ;(this.styles = (e && e.styles) || {}),
              (this.text = t),
              (this.__skipDimension = !0),
              this.callSuper('initialize', e),
              this.path && this.setPathInfo(),
              (this.__skipDimension = !1),
              this.initDimensions(),
              this.setCoords(),
              this.setupState({ propertySet: '_dimensionAffectingProps' })
          },
          setPathInfo: function () {
            var t = this.path
            t && (t.segmentsInfo = x.util.getPathSegmentsInfo(t.path))
          },
          getMeasuringContext: function () {
            return (
              x._measuringContext ||
                (x._measuringContext =
                  (this.canvas && this.canvas.contextCache) ||
                  x.util.createCanvasElement().getContext('2d')),
              x._measuringContext
            )
          },
          _splitText: function () {
            var t = this._splitTextIntoLines(this.text)
            return (
              (this.textLines = t.lines),
              (this._textLines = t.graphemeLines),
              (this._unwrappedTextLines = t._unwrappedLines),
              (this._text = t.graphemeText),
              t
            )
          },
          initDimensions: function () {
            this.__skipDimension ||
              (this._splitText(),
              this._clearCache(),
              this.path
                ? ((this.width = this.path.width),
                  (this.height = this.path.height))
                : ((this.width =
                    this.calcTextWidth() ||
                    this.cursorWidth ||
                    this.MIN_TEXT_WIDTH),
                  (this.height = this.calcTextHeight())),
              -1 !== this.textAlign.indexOf('justify') && this.enlargeSpaces(),
              this.saveState({ propertySet: '_dimensionAffectingProps' }))
          },
          enlargeSpaces: function () {
            for (
              var t, e, i, r, n, s = 0, o = this._textLines.length;
              s < o;
              s++
            )
              if (
                ('justify' === this.textAlign ||
                  (s !== o - 1 && !this.isEndOfWrapping(s))) &&
                ((e = 0),
                (i = this._textLines[s]),
                (t = this.getLineWidth(s)) < this.width &&
                  (n = this.textLines[s].match(this._reSpacesAndTabs)))
              )
                for (
                  var a = n.length,
                    c = (this.width - t) / a,
                    h = 0,
                    l = i.length;
                  h <= l;
                  h++
                )
                  (r = this.__charBounds[s][h]),
                    this._reSpaceAndTab.test(i[h])
                      ? ((r.width += c),
                        (r.kernedWidth += c),
                        (r.left += e),
                        (e += c))
                      : (r.left += e)
          },
          isEndOfWrapping: function (t) {
            return t === this._textLines.length - 1
          },
          missingNewlineOffset: function () {
            return 1
          },
          toString: function () {
            return (
              '#<fabric.Text (' +
              this.complexity() +
              '): { "text": "' +
              this.text +
              '", "fontFamily": "' +
              this.fontFamily +
              '" }>'
            )
          },
          _getCacheCanvasDimensions: function () {
            var t = this.callSuper('_getCacheCanvasDimensions'),
              e = this.fontSize
            return (t.width += e * t.zoomX), (t.height += e * t.zoomY), t
          },
          _render: function (t) {
            var e = this.path
            e && !e.isNotVisible() && e._render(t),
              this._setTextStyles(t),
              this._renderTextLinesBackground(t),
              this._renderTextDecoration(t, 'underline'),
              this._renderText(t),
              this._renderTextDecoration(t, 'overline'),
              this._renderTextDecoration(t, 'linethrough')
          },
          _renderText: function (t) {
            'stroke' === this.paintFirst
              ? (this._renderTextStroke(t), this._renderTextFill(t))
              : (this._renderTextFill(t), this._renderTextStroke(t))
          },
          _setTextStyles: function (t, e, i) {
            if (((t.textBaseline = 'alphabetical'), this.path))
              switch (this.pathAlign) {
                case 'center':
                  t.textBaseline = 'middle'
                  break
                case 'ascender':
                  t.textBaseline = 'top'
                  break
                case 'descender':
                  t.textBaseline = 'bottom'
              }
            t.font = this._getFontDeclaration(e, i)
          },
          calcTextWidth: function () {
            for (
              var t = this.getLineWidth(0), e = 1, i = this._textLines.length;
              e < i;
              e++
            ) {
              var r = this.getLineWidth(e)
              t < r && (t = r)
            }
            return t
          },
          _renderTextLine: function (t, e, i, r, n, s) {
            this._renderChars(t, e, i, r, n, s)
          },
          _renderTextLinesBackground: function (t) {
            if (
              this.textBackgroundColor ||
              this.styleHas('textBackgroundColor')
            ) {
              for (
                var e,
                  i,
                  r,
                  n,
                  s = t.fillStyle,
                  o = this._getLeftOffset(),
                  a = this._getTopOffset(),
                  c = 0,
                  h = 0,
                  l = this.path,
                  u = 0,
                  f = this._textLines.length;
                u < f;
                u++
              )
                if (
                  ((e = this.getHeightOfLine(u)),
                  this.textBackgroundColor ||
                    this.styleHas('textBackgroundColor', u))
                ) {
                  for (
                    var d = this._textLines[u],
                      g = this._getLineLeftOffset(u),
                      h = 0,
                      c = 0,
                      p = this.getValueOfPropertyAt(
                        u,
                        0,
                        'textBackgroundColor'
                      ),
                      m = 0,
                      v = d.length;
                    m < v;
                    m++
                  )
                    (i = this.__charBounds[u][m]),
                      (r = this.getValueOfPropertyAt(
                        u,
                        m,
                        'textBackgroundColor'
                      )),
                      l
                        ? (t.save(),
                          t.translate(i.renderLeft, i.renderTop),
                          t.rotate(i.angle),
                          (t.fillStyle = r) &&
                            t.fillRect(
                              -i.width / 2,
                              (-e / this.lineHeight) *
                                (1 - this._fontSizeFraction),
                              i.width,
                              e / this.lineHeight
                            ),
                          t.restore())
                        : r !== p
                        ? ((n = o + g + c),
                          'rtl' === this.direction && (n = this.width - n - h),
                          (t.fillStyle = p) &&
                            t.fillRect(n, a, h, e / this.lineHeight),
                          (c = i.left),
                          (h = i.width),
                          (p = r))
                        : (h += i.kernedWidth)
                  r &&
                    !l &&
                    ((n = o + g + c),
                    'rtl' === this.direction && (n = this.width - n - h),
                    (t.fillStyle = r),
                    t.fillRect(n, a, h, e / this.lineHeight)),
                    (a += e)
                } else a += e
              ;(t.fillStyle = s), this._removeShadow(t)
            }
          },
          getFontCache: function (t) {
            var e = t.fontFamily.toLowerCase(),
              e =
                (x.charWidthsCache[e] || (x.charWidthsCache[e] = {}),
                x.charWidthsCache[e]),
              t =
                t.fontStyle.toLowerCase() +
                '_' +
                (t.fontWeight + '').toLowerCase()
            return e[t] || (e[t] = {}), e[t]
          },
          _measureChar: function (t, e, i, r) {
            var n,
              s,
              o,
              a,
              c,
              h = this.getFontCache(e),
              l = i + t,
              r = this._getFontDeclaration(e) === this._getFontDeclaration(r),
              u = e.fontSize / this.CACHE_FONT_SIZE
            return (
              i && void 0 !== h[i] && (o = h[i]),
              void 0 !== h[t] && (a = n = h[t]),
              r && void 0 !== h[l] && (a = (s = h[l]) - o),
              (void 0 !== n && void 0 !== o && void 0 !== s) ||
                ((c = this.getMeasuringContext()),
                this._setTextStyles(c, e, !0)),
              void 0 === n && ((a = n = c.measureText(t).width), (h[t] = n)),
              void 0 === o &&
                r &&
                i &&
                ((o = c.measureText(i).width), (h[i] = o)),
              r &&
                void 0 === s &&
                ((s = c.measureText(l).width), (a = (h[l] = s) - o)),
              { width: n * u, kernedWidth: a * u }
            )
          },
          getHeightOfChar: function (t, e) {
            return this.getValueOfPropertyAt(t, e, 'fontSize')
          },
          measureLine: function (t) {
            t = this._measureLine(t)
            return (
              0 !== this.charSpacing &&
                (t.width -= this._getWidthOfCharSpacing()),
              t.width < 0 && (t.width = 0),
              t
            )
          },
          _measureLine: function (t) {
            var e,
              i,
              r,
              n,
              s,
              o,
              a = 0,
              c = this._textLines[t],
              h = new Array(c.length),
              l = 0,
              u = this.path,
              f = 'right' === this.pathSide
            for (this.__charBounds[t] = h, e = 0; e < c.length; e++)
              (i = c[e]),
                (n = this._getGraphemeBox(i, t, e, r)),
                (a += (h[e] = n).kernedWidth),
                (r = i)
            if (
              ((h[e] = {
                left: n ? n.left + n.width : 0,
                width: 0,
                kernedWidth: 0,
                height: this.fontSize,
              }),
              u)
            ) {
              switch (
                ((o = u.segmentsInfo[u.segmentsInfo.length - 1].length),
                ((s = x.util.getPointOnPath(u.path, 0, u.segmentsInfo)).x +=
                  u.pathOffset.x),
                (s.y += u.pathOffset.y),
                this.textAlign)
              ) {
                case 'left':
                  l = f ? o - a : 0
                  break
                case 'center':
                  l = (o - a) / 2
                  break
                case 'right':
                  l = f ? 0 : o - a
              }
              for (
                l += this.pathStartOffset * (f ? -1 : 1),
                  e = f ? c.length - 1 : 0;
                f ? 0 <= e : e < c.length;
                f ? e-- : e++
              )
                (n = h[e]),
                  o < l ? (l %= o) : l < 0 && (l += o),
                  this._setGraphemeOnPath(l, n, s),
                  (l += n.kernedWidth)
            }
            return { width: a, numOfSpaces: 0 }
          },
          _setGraphemeOnPath: function (t, e, i) {
            var t = t + e.kernedWidth / 2,
              r = this.path,
              t = x.util.getPointOnPath(r.path, t, r.segmentsInfo)
            ;(e.renderLeft = t.x - i.x),
              (e.renderTop = t.y - i.y),
              (e.angle = t.angle + ('right' === this.pathSide ? Math.PI : 0))
          },
          _getGraphemeBox: function (t, e, i, r, n) {
            var s = this.getCompleteStyleDeclaration(e, i),
              o = r ? this.getCompleteStyleDeclaration(e, i - 1) : {},
              t = this._measureChar(t, s, r, o),
              r = t.kernedWidth,
              o = t.width,
              a =
                (0 !== this.charSpacing &&
                  ((o += a = this._getWidthOfCharSpacing()), (r += a)),
                {
                  width: o,
                  left: 0,
                  height: s.fontSize,
                  kernedWidth: r,
                  deltaY: s.deltaY,
                })
            return (
              0 < i &&
                !n &&
                ((o = this.__charBounds[e][i - 1]),
                (a.left = o.left + o.width + t.kernedWidth - t.width)),
              a
            )
          },
          getHeightOfLine: function (t) {
            if (this.__lineHeights[t]) return this.__lineHeights[t]
            for (
              var e = this._textLines[t],
                i = this.getHeightOfChar(t, 0),
                r = 1,
                n = e.length;
              r < n;
              r++
            )
              i = Math.max(this.getHeightOfChar(t, r), i)
            return (this.__lineHeights[t] =
              i * this.lineHeight * this._fontSizeMult)
          },
          calcTextHeight: function () {
            for (var t, e = 0, i = 0, r = this._textLines.length; i < r; i++)
              (t = this.getHeightOfLine(i)),
                (e += i === r - 1 ? t / this.lineHeight : t)
            return e
          },
          _getLeftOffset: function () {
            return 'ltr' === this.direction ? -this.width / 2 : this.width / 2
          },
          _getTopOffset: function () {
            return -this.height / 2
          },
          _renderTextCommon: function (t, e) {
            t.save()
            for (
              var i = 0,
                r = this._getLeftOffset(),
                n = this._getTopOffset(),
                s = 0,
                o = this._textLines.length;
              s < o;
              s++
            ) {
              var a = this.getHeightOfLine(s),
                c = a / this.lineHeight,
                h = this._getLineLeftOffset(s)
              this._renderTextLine(
                e,
                t,
                this._textLines[s],
                r + h,
                n + i + c,
                s
              ),
                (i += a)
            }
            t.restore()
          },
          _renderTextFill: function (t) {
            ;(this.fill || this.styleHas('fill')) &&
              this._renderTextCommon(t, 'fillText')
          },
          _renderTextStroke: function (t) {
            ;((this.stroke && 0 !== this.strokeWidth) ||
              !this.isEmptyStyles()) &&
              (this.shadow &&
                !this.shadow.affectStroke &&
                this._removeShadow(t),
              t.save(),
              this._setLineDash(t, this.strokeDashArray),
              t.beginPath(),
              this._renderTextCommon(t, 'strokeText'),
              t.closePath(),
              t.restore())
          },
          _renderChars: function (t, e, i, r, n, s) {
            var o,
              a,
              c,
              h,
              l = this.getHeightOfLine(s),
              u = -1 !== this.textAlign.indexOf('justify'),
              f = '',
              d = 0,
              g = this.path,
              p = !u && 0 === this.charSpacing && this.isEmptyStyles(s) && !g,
              m = 'ltr' === this.direction,
              v = 'ltr' === this.direction ? 1 : -1,
              b = e.canvas.getAttribute('dir')
            if (
              (e.save(),
              b !== this.direction &&
                (e.canvas.setAttribute('dir', m ? 'ltr' : 'rtl'),
                (e.direction = m ? 'ltr' : 'rtl'),
                (e.textAlign = m ? 'left' : 'right')),
              (n -= (l * this._fontSizeFraction) / this.lineHeight),
              p)
            )
              return (
                this._renderChar(t, e, s, 0, i.join(''), r, n, l),
                void e.restore()
              )
            for (var y = 0, _ = i.length - 1; y <= _; y++)
              (h = y === _ || this.charSpacing || g),
                (f += i[y]),
                (c = this.__charBounds[s][y]),
                0 === d
                  ? ((r += v * (c.kernedWidth - c.width)), (d += c.width))
                  : (d += c.kernedWidth),
                (h = u && !h && this._reSpaceAndTab.test(i[y]) ? !0 : h) ||
                  ((o = o || this.getCompleteStyleDeclaration(s, y)),
                  (a = this.getCompleteStyleDeclaration(s, y + 1)),
                  (h = x.util.hasStyleChanged(o, a, !1))),
                h &&
                  (g
                    ? (e.save(),
                      e.translate(c.renderLeft, c.renderTop),
                      e.rotate(c.angle),
                      this._renderChar(t, e, s, y, f, -d / 2, 0, l),
                      e.restore())
                    : ((h = r), this._renderChar(t, e, s, y, f, h, n, l)),
                  (f = ''),
                  (o = a),
                  (r += v * d),
                  (d = 0))
            e.restore()
          },
          _applyPatternGradientTransformText: function (t) {
            var e,
              i = x.util.createCanvasElement(),
              r = this.width + this.strokeWidth,
              n = this.height + this.strokeWidth
            return (
              (i.width = r),
              (i.height = n),
              (e = i.getContext('2d')).beginPath(),
              e.moveTo(0, 0),
              e.lineTo(r, 0),
              e.lineTo(r, n),
              e.lineTo(0, n),
              e.closePath(),
              e.translate(r / 2, n / 2),
              (e.fillStyle = t.toLive(e)),
              this._applyPatternGradientTransform(e, t),
              e.fill(),
              e.createPattern(i, 'no-repeat')
            )
          },
          handleFiller: function (t, e, i) {
            var r, n
            return i.toLive
              ? 'percentage' === i.gradientUnits ||
                i.gradientTransform ||
                i.patternTransform
                ? ((r = -this.width / 2),
                  (n = -this.height / 2),
                  t.translate(r, n),
                  (t[e] = this._applyPatternGradientTransformText(i)),
                  { offsetX: r, offsetY: n })
                : ((t[e] = i.toLive(t, this)),
                  this._applyPatternGradientTransform(t, i))
              : ((t[e] = i), { offsetX: 0, offsetY: 0 })
          },
          _setStrokeStyles: function (t, e) {
            return (
              (t.lineWidth = e.strokeWidth),
              (t.lineCap = this.strokeLineCap),
              (t.lineDashOffset = this.strokeDashOffset),
              (t.lineJoin = this.strokeLineJoin),
              (t.miterLimit = this.strokeMiterLimit),
              this.handleFiller(t, 'strokeStyle', e.stroke)
            )
          },
          _setFillStyles: function (t, e) {
            return this.handleFiller(t, 'fillStyle', e.fill)
          },
          _renderChar: function (t, e, i, r, n, s, o) {
            var a,
              c,
              h = this._getStyleDeclaration(i, r),
              i = this.getCompleteStyleDeclaration(i, r),
              r = 'fillText' === t && i.fill,
              t = 'strokeText' === t && i.stroke && i.strokeWidth
            ;(t || r) &&
              (e.save(),
              r && (a = this._setFillStyles(e, i)),
              t && (c = this._setStrokeStyles(e, i)),
              (e.font = this._getFontDeclaration(i)),
              h && h.textBackgroundColor && this._removeShadow(e),
              h && h.deltaY && (o += h.deltaY),
              r && e.fillText(n, s - a.offsetX, o - a.offsetY),
              t && e.strokeText(n, s - c.offsetX, o - c.offsetY),
              e.restore())
          },
          setSuperscript: function (t, e) {
            return this._setScript(t, e, this.superscript)
          },
          setSubscript: function (t, e) {
            return this._setScript(t, e, this.subscript)
          },
          _setScript: function (t, e, i) {
            var r = this.get2DCursorLocation(t, !0),
              n = this.getValueOfPropertyAt(
                r.lineIndex,
                r.charIndex,
                'fontSize'
              ),
              r = this.getValueOfPropertyAt(r.lineIndex, r.charIndex, 'deltaY'),
              r = { fontSize: n * i.size, deltaY: r + n * i.baseline }
            return this.setSelectionStyles(r, t, e), this
          },
          _getLineLeftOffset: function (t) {
            var e = this.getLineWidth(t),
              e = this.width - e,
              i = this.textAlign,
              r = this.direction,
              n = 0,
              t = this.isEndOfWrapping(t)
            return 'justify' === i ||
              ('justify-center' === i && !t) ||
              ('justify-right' === i && !t) ||
              ('justify-left' === i && !t)
              ? 0
              : ('center' === i && (n = e / 2),
                'right' === i && (n = e),
                'justify-center' === i && (n = e / 2),
                'justify-right' === i && (n = e),
                'rtl' === r && (n -= e),
                n)
          },
          _clearCache: function () {
            ;(this.__lineWidths = []),
              (this.__lineHeights = []),
              (this.__charBounds = [])
          },
          _shouldClearDimensionCache: function () {
            var t = this._forceClearCache
            return (
              (t = t || this.hasStateChanged('_dimensionAffectingProps')) &&
                ((this.dirty = !0), (this._forceClearCache = !1)),
              t
            )
          },
          getLineWidth: function (t) {
            if (void 0 !== this.__lineWidths[t]) return this.__lineWidths[t]
            var e = this.measureLine(t).width
            return (this.__lineWidths[t] = e)
          },
          _getWidthOfCharSpacing: function () {
            return 0 !== this.charSpacing
              ? (this.fontSize * this.charSpacing) / 1e3
              : 0
          },
          getValueOfPropertyAt: function (t, e, i) {
            t = this._getStyleDeclaration(t, e)
            return (t && void 0 !== t[i] ? t : this)[i]
          },
          _renderTextDecoration: function (t, e) {
            if (this[e] || this.styleHas(e)) {
              for (
                var i,
                  r = this._getLeftOffset(),
                  n = this._getTopOffset(),
                  s = this.path,
                  o = this._getWidthOfCharSpacing(),
                  a = this.offsets[e],
                  c = 0,
                  h = this._textLines.length;
                c < h;
                c++
              )
                if (
                  ((i = this.getHeightOfLine(c)),
                  this[e] || this.styleHas(e, c))
                ) {
                  for (
                    var l = this._textLines[c],
                      u = i / this.lineHeight,
                      f = this._getLineLeftOffset(c),
                      d = 0,
                      g = 0,
                      p = this.getValueOfPropertyAt(c, 0, e),
                      m = this.getValueOfPropertyAt(c, 0, 'fill'),
                      v = n + u * (1 - this._fontSizeFraction),
                      b = this.getHeightOfChar(c, 0),
                      y = this.getValueOfPropertyAt(c, 0, 'deltaY'),
                      _ = 0,
                      x = l.length;
                    _ < x;
                    _++
                  ) {
                    var C = this.__charBounds[c][_],
                      S = this.getValueOfPropertyAt(c, _, e),
                      T = this.getValueOfPropertyAt(c, _, 'fill'),
                      w = this.getHeightOfChar(c, _),
                      O = this.getValueOfPropertyAt(c, _, 'deltaY')
                    s && S && T
                      ? (t.save(),
                        (t.fillStyle = m),
                        t.translate(C.renderLeft, C.renderTop),
                        t.rotate(C.angle),
                        t.fillRect(
                          -C.kernedWidth / 2,
                          a * w + O,
                          C.kernedWidth,
                          this.fontSize / 15
                        ),
                        t.restore())
                      : (S !== p || T !== m || w !== b || O !== y) && 0 < g
                      ? ((P = r + f + d),
                        'rtl' === this.direction && (P = this.width - P - g),
                        p &&
                          m &&
                          ((t.fillStyle = m),
                          t.fillRect(P, v + a * b + y, g, this.fontSize / 15)),
                        (d = C.left),
                        (g = C.width),
                        (p = S),
                        (m = T),
                        (b = w),
                        (y = O))
                      : (g += C.kernedWidth)
                  }
                  var P = r + f + d
                  'rtl' === this.direction && (P = this.width - P - g),
                    (t.fillStyle = T),
                    S &&
                      T &&
                      t.fillRect(P, v + a * b + y, g - o, this.fontSize / 15),
                    (n += i)
                } else n += i
              this._removeShadow(t)
            }
          },
          _getFontDeclaration: function (t, e) {
            var t = t || this,
              i = this.fontFamily,
              r = -1 < x.Text.genericFonts.indexOf(i.toLowerCase()),
              i =
                void 0 === i ||
                -1 < i.indexOf("'") ||
                -1 < i.indexOf(',') ||
                -1 < i.indexOf('"') ||
                r
                  ? t.fontFamily
                  : '"' + t.fontFamily + '"'
            return [
              x.isLikelyNode ? t.fontWeight : t.fontStyle,
              x.isLikelyNode ? t.fontStyle : t.fontWeight,
              e ? this.CACHE_FONT_SIZE + 'px' : t.fontSize + 'px',
              i,
            ].join(' ')
          },
          render: function (t) {
            !this.visible ||
              (this.canvas &&
                this.canvas.skipOffscreen &&
                !this.group &&
                !this.isOnScreen()) ||
              (this._shouldClearDimensionCache() && this.initDimensions(),
              this.callSuper('render', t))
          },
          _splitTextIntoLines: function (t) {
            for (
              var e = t.split(this._reNewline),
                i = new Array(e.length),
                r = ['\n'],
                n = [],
                s = 0;
              s < e.length;
              s++
            )
              (i[s] = x.util.string.graphemeSplit(e[s])),
                (n = n.concat(i[s], r))
            return (
              n.pop(),
              {
                _unwrappedLines: i,
                lines: e,
                graphemeText: n,
                graphemeLines: i,
              }
            )
          },
          toObject: function (t) {
            ;(t = e.concat(t)), (t = this.callSuper('toObject', t))
            return (
              (t.styles = x.util.stylesToArray(this.styles, this.text)),
              t.path && (t.path = this.path.toObject()),
              t
            )
          },
          set: function (t, e) {
            this.callSuper('set', t, e)
            var i = !1,
              r = !1
            if ('object' == typeof t)
              for (var n in t)
                'path' === n && this.setPathInfo(),
                  (i = i || -1 !== this._dimensionAffectingProps.indexOf(n)),
                  (r = r || 'path' === n)
            else
              (i = -1 !== this._dimensionAffectingProps.indexOf(t)),
                (r = 'path' === t)
            return (
              r && this.setPathInfo(),
              i && (this.initDimensions(), this.setCoords()),
              this
            )
          },
          complexity: function () {
            return 1
          },
        })),
        (x.Text.ATTRIBUTE_NAMES = x.SHARED_ATTRIBUTES.concat(
          'x y dx dy font-family font-style font-weight font-size letter-spacing text-decoration text-anchor'.split(
            ' '
          )
        )),
        (x.Text.DEFAULT_SVG_FONT_SIZE = 16),
        (x.Text.fromElement = function (t, e, i) {
          if (!t) return e(null)
          var r = x.parseAttributes(t, x.Text.ATTRIBUTE_NAMES),
            n = r.textAnchor || 'left',
            s =
              (((i = x.util.object.extend(i ? o(i) : {}, r)).top = i.top || 0),
              (i.left = i.left || 0),
              r.textDecoration &&
                (-1 !== (s = r.textDecoration).indexOf('underline') &&
                  (i.underline = !0),
                -1 !== s.indexOf('overline') && (i.overline = !0),
                -1 !== s.indexOf('line-through') && (i.linethrough = !0),
                delete i.textDecoration),
              'dx' in r && (i.left += r.dx),
              'dy' in r && (i.top += r.dy),
              'fontSize' in i || (i.fontSize = x.Text.DEFAULT_SVG_FONT_SIZE),
              ''),
            r =
              ('textContent' in t
                ? (s = t.textContent)
                : 'firstChild' in t &&
                  null !== t.firstChild &&
                  'data' in t.firstChild &&
                  null !== t.firstChild.data &&
                  (s = t.firstChild.data),
              (s = s.replace(/^\s+|\s+$|\n+/g, '').replace(/\s+/g, ' ')),
              i.strokeWidth),
            t = ((i.strokeWidth = 0), new x.Text(s, i)),
            s = t.getScaledHeight() / t.height,
            i = ((t.height + t.strokeWidth) * t.lineHeight - t.height) * s,
            s = t.getScaledHeight() + i,
            i = 0
          'center' === n && (i = t.getScaledWidth() / 2),
            'right' === n && (i = t.getScaledWidth()),
            t.set({
              left: t.left - i,
              top:
                t.top -
                (s - t.fontSize * (0.07 + t._fontSizeFraction)) / t.lineHeight,
              strokeWidth: void 0 !== r ? r : 1,
            }),
            e(t)
        }),
        (x.Text.fromObject = function (t, i) {
          var e = o(t),
            r = t.path
          return (
            delete e.path,
            x.Object._fromObject(
              'Text',
              e,
              function (e) {
                ;(e.styles = x.util.stylesFromArray(t.styles, t.text)),
                  r
                    ? x.Object._fromObject(
                        'Path',
                        r,
                        function (t) {
                          e.set('path', t), i(e)
                        },
                        'path'
                      )
                    : i(e)
              },
              'text'
            )
          )
        }),
        (x.Text.genericFonts = [
          'sans-serif',
          'serif',
          'cursive',
          'fantasy',
          'monospace',
        ]),
        x.util.createAccessors && x.util.createAccessors(x.Text))
  })('undefined' != typeof exports ? exports : this),
  fabric.util.object.extend(fabric.Text.prototype, {
    isEmptyStyles: function (t) {
      if (!this.styles) return !0
      if (void 0 !== t && !this.styles[t]) return !0
      var e,
        i = void 0 === t ? this.styles : { line: this.styles[t] }
      for (e in i) for (var r in i[e]) for (var n in i[e][r]) return !1
      return !0
    },
    styleHas: function (t, e) {
      if (!this.styles || !t || '' === t) return !1
      if (void 0 !== e && !this.styles[e]) return !1
      var i,
        r = void 0 === e ? this.styles : { 0: this.styles[e] }
      for (i in r) for (var n in r[i]) if (void 0 !== r[i][n][t]) return !0
      return !1
    },
    cleanStyle: function (t) {
      if (!this.styles || !t || '' === t) return !1
      var e,
        i,
        r,
        n,
        s = this.styles,
        o = 0,
        a = !0,
        c = 0
      for (r in s) {
        for (var h in ((e = 0), s[r]))
          o++,
            (n = s[r][h]).hasOwnProperty(t)
              ? (i ? n[t] !== i && (a = !1) : (i = n[t]),
                n[t] === this[t] && delete n[t])
              : (a = !1),
            0 !== Object.keys(n).length ? e++ : delete s[r][h]
        0 === e && delete s[r]
      }
      for (var l = 0; l < this._textLines.length; l++)
        c += this._textLines[l].length
      a && o === c && ((this[t] = i), this.removeStyle(t))
    },
    removeStyle: function (t) {
      if (this.styles && t && '' !== t) {
        var e,
          i,
          r,
          n = this.styles
        for (i in n) {
          for (r in (e = n[i]))
            delete e[r][t], 0 === Object.keys(e[r]).length && delete e[r]
          0 === Object.keys(e).length && delete n[i]
        }
      }
    },
    _extendStyles: function (t, e) {
      t = this.get2DCursorLocation(t)
      this._getLineStyle(t.lineIndex) || this._setLineStyle(t.lineIndex),
        this._getStyleDeclaration(t.lineIndex, t.charIndex) ||
          this._setStyleDeclaration(t.lineIndex, t.charIndex, {}),
        fabric.util.object.extend(
          this._getStyleDeclaration(t.lineIndex, t.charIndex),
          e
        )
    },
    get2DCursorLocation: function (t, e) {
      void 0 === t && (t = this.selectionStart)
      for (
        var i = e ? this._unwrappedTextLines : this._textLines,
          r = i.length,
          n = 0;
        n < r;
        n++
      ) {
        if (t <= i[n].length) return { lineIndex: n, charIndex: t }
        t -= i[n].length + this.missingNewlineOffset(n)
      }
      return {
        lineIndex: n - 1,
        charIndex: i[n - 1].length < t ? i[n - 1].length : t,
      }
    },
    getSelectionStyles: function (t, e, i) {
      void 0 === t && (t = this.selectionStart || 0),
        void 0 === e && (e = this.selectionEnd || t)
      for (var r = [], n = t; n < e; n++) r.push(this.getStyleAtPosition(n, i))
      return r
    },
    getStyleAtPosition: function (t, e) {
      t = this.get2DCursorLocation(t)
      return (
        (e
          ? this.getCompleteStyleDeclaration(t.lineIndex, t.charIndex)
          : this._getStyleDeclaration(t.lineIndex, t.charIndex)) || {}
      )
    },
    setSelectionStyles: function (t, e, i) {
      void 0 === e && (e = this.selectionStart || 0),
        void 0 === i && (i = this.selectionEnd || e)
      for (var r = e; r < i; r++) this._extendStyles(r, t)
      return (this._forceClearCache = !0), this
    },
    _getStyleDeclaration: function (t, e) {
      t = this.styles && this.styles[t]
      return t ? t[e] : null
    },
    getCompleteStyleDeclaration: function (t, e) {
      for (
        var i, r = this._getStyleDeclaration(t, e) || {}, n = {}, s = 0;
        s < this._styleProperties.length;
        s++
      )
        n[(i = this._styleProperties[s])] = (void 0 === r[i] ? this : r)[i]
      return n
    },
    _setStyleDeclaration: function (t, e, i) {
      this.styles[t][e] = i
    },
    _deleteStyleDeclaration: function (t, e) {
      delete this.styles[t][e]
    },
    _getLineStyle: function (t) {
      return !!this.styles[t]
    },
    _setLineStyle: function (t) {
      this.styles[t] = {}
    },
    _deleteLineStyle: function (t) {
      delete this.styles[t]
    },
  }),
  (function () {
    function o(t) {
      t.textDecoration &&
        (-1 < t.textDecoration.indexOf('underline') && (t.underline = !0),
        -1 < t.textDecoration.indexOf('line-through') && (t.linethrough = !0),
        -1 < t.textDecoration.indexOf('overline') && (t.overline = !0),
        delete t.textDecoration)
    }
    ;(fabric.IText = fabric.util.createClass(fabric.Text, fabric.Observable, {
      type: 'i-text',
      selectionStart: 0,
      selectionEnd: 0,
      selectionColor: 'rgba(17,119,255,0.3)',
      isEditing: !1,
      editable: !0,
      editingBorderColor: 'rgba(102,153,255,0.25)',
      cursorWidth: 2,
      cursorColor: '',
      cursorDelay: 1e3,
      cursorDuration: 600,
      caching: !0,
      hiddenTextareaContainer: null,
      _reSpace: /\s|\n/,
      _currentCursorOpacity: 0,
      _selectionDirection: null,
      _abortCursorAnimation: !1,
      __widthOfSpace: [],
      inCompositionMode: !1,
      initialize: function (t, e) {
        this.callSuper('initialize', t, e), this.initBehavior()
      },
      setSelectionStart: function (t) {
        ;(t = Math.max(t, 0)), this._updateAndFire('selectionStart', t)
      },
      setSelectionEnd: function (t) {
        ;(t = Math.min(t, this.text.length)),
          this._updateAndFire('selectionEnd', t)
      },
      _updateAndFire: function (t, e) {
        this[t] !== e && (this._fireSelectionChanged(), (this[t] = e)),
          this._updateTextarea()
      },
      _fireSelectionChanged: function () {
        this.fire('selection:changed'),
          this.canvas &&
            this.canvas.fire('text:selection:changed', { target: this })
      },
      initDimensions: function () {
        this.isEditing && this.initDelayedCursor(),
          this.clearContextTop(),
          this.callSuper('initDimensions')
      },
      render: function (t) {
        this.clearContextTop(),
          this.callSuper('render', t),
          (this.cursorOffsetCache = {}),
          this.renderCursorOrSelection()
      },
      _render: function (t) {
        this.callSuper('_render', t)
      },
      clearContextTop: function (t) {
        var e, i
        this.isEditing &&
          this.canvas &&
          this.canvas.contextTop &&
          ((e = this.canvas.contextTop),
          (i = this.canvas.viewportTransform),
          e.save(),
          e.transform(i[0], i[1], i[2], i[3], i[4], i[5]),
          this.transform(e),
          this._clearTextArea(e),
          t || e.restore())
      },
      renderCursorOrSelection: function () {
        var t, e
        this.isEditing &&
          this.canvas &&
          this.canvas.contextTop &&
          ((t = this._getCursorBoundaries()),
          (e = this.canvas.contextTop),
          this.clearContextTop(!0),
          this.selectionStart === this.selectionEnd
            ? this.renderCursor(t, e)
            : this.renderSelection(t, e),
          e.restore())
      },
      _clearTextArea: function (t) {
        var e = this.width + 4,
          i = this.height + 4
        t.clearRect(-e / 2, -i / 2, e, i)
      },
      _getCursorBoundaries: function (t) {
        void 0 === t && (t = this.selectionStart)
        var e = this._getLeftOffset(),
          i = this._getTopOffset(),
          t = this._getCursorBoundariesOffsets(t)
        return { left: e, top: i, leftOffset: t.left, topOffset: t.top }
      },
      _getCursorBoundariesOffsets: function (t) {
        if (this.cursorOffsetCache && 'top' in this.cursorOffsetCache)
          return this.cursorOffsetCache
        for (
          var e = 0,
            i = 0,
            t = this.get2DCursorLocation(t),
            r = t.charIndex,
            n = t.lineIndex,
            s = 0;
          s < n;
          s++
        )
          e += this.getHeightOfLine(s)
        var t = this._getLineLeftOffset(n),
          o = this.__charBounds[n][r]
        return (
          o && (i = o.left),
          0 !== this.charSpacing &&
            r === this._textLines[n].length &&
            (i -= this._getWidthOfCharSpacing()),
          (o = { top: e, left: t + (0 < i ? i : 0) }),
          'rtl' === this.direction && (o.left *= -1),
          (this.cursorOffsetCache = o),
          this.cursorOffsetCache
        )
      },
      renderCursor: function (t, e) {
        var i = this.get2DCursorLocation(),
          r = i.lineIndex,
          i = 0 < i.charIndex ? i.charIndex - 1 : 0,
          n = this.getValueOfPropertyAt(r, i, 'fontSize'),
          s = this.scaleX * this.canvas.getZoom(),
          s = this.cursorWidth / s,
          o = t.topOffset,
          a = this.getValueOfPropertyAt(r, i, 'deltaY')
        ;(o +=
          ((1 - this._fontSizeFraction) * this.getHeightOfLine(r)) /
            this.lineHeight -
          n * (1 - this._fontSizeFraction)),
          this.inCompositionMode && this.renderSelection(t, e),
          (e.fillStyle =
            this.cursorColor || this.getValueOfPropertyAt(r, i, 'fill')),
          (e.globalAlpha = this.__isMousedown ? 1 : this._currentCursorOpacity),
          e.fillRect(t.left + t.leftOffset - s / 2, o + t.top + a, s, n)
      },
      renderSelection: function (t, e) {
        for (
          var i = (this.inCompositionMode ? this.hiddenTextarea : this)
              .selectionStart,
            r = (this.inCompositionMode ? this.hiddenTextarea : this)
              .selectionEnd,
            n = -1 !== this.textAlign.indexOf('justify'),
            i = this.get2DCursorLocation(i),
            r = this.get2DCursorLocation(r),
            s = i.lineIndex,
            o = r.lineIndex,
            a = i.charIndex < 0 ? 0 : i.charIndex,
            c = r.charIndex < 0 ? 0 : r.charIndex,
            h = s;
          h <= o;
          h++
        ) {
          var l,
            u = this._getLineLeftOffset(h) || 0,
            f = this.getHeightOfLine(h),
            d = 0,
            g = 0,
            u =
              (h === s && (d = this.__charBounds[s][a].left),
              s <= h && h < o
                ? (g =
                    n && !this.isEndOfWrapping(h)
                      ? this.width
                      : this.getLineWidth(h) || 5)
                : h === o &&
                  (g =
                    0 === c
                      ? this.__charBounds[o][c].left
                      : ((l = this._getWidthOfCharSpacing()),
                        this.__charBounds[o][c - 1].left +
                          this.__charBounds[o][c - 1].width -
                          l)),
              (l = f),
              (this.lineHeight < 1 || (h === o && 1 < this.lineHeight)) &&
                (f /= this.lineHeight),
              t.left + u + d),
            g = g - d,
            d = f,
            p = 0
          this.inCompositionMode
            ? ((e.fillStyle = this.compositionColor || 'black'),
              (d = 1),
              (p = f))
            : (e.fillStyle = this.selectionColor),
            'rtl' === this.direction && (u = this.width - u - g),
            e.fillRect(u, t.top + t.topOffset + p, g, d),
            (t.topOffset += l)
        }
      },
      getCurrentCharFontSize: function () {
        var t = this._getCurrentCharIndex()
        return this.getValueOfPropertyAt(t.l, t.c, 'fontSize')
      },
      getCurrentCharColor: function () {
        var t = this._getCurrentCharIndex()
        return this.getValueOfPropertyAt(t.l, t.c, 'fill')
      },
      _getCurrentCharIndex: function () {
        var t = this.get2DCursorLocation(this.selectionStart, !0),
          e = 0 < t.charIndex ? t.charIndex - 1 : 0
        return { l: t.lineIndex, c: e }
      },
    })),
      (fabric.IText.fromObject = function (t, e) {
        var i = fabric.util.stylesFromArray(t.styles, t.text),
          r = Object.assign({}, t, { styles: i })
        if ((o(r), r.styles))
          for (var n in r.styles) for (var s in r.styles[n]) o(r.styles[n][s])
        fabric.Object._fromObject('IText', r, e, 'text')
      })
  })(),
  (function () {
    var u = fabric.util.object.clone
    fabric.util.object.extend(fabric.IText.prototype, {
      initBehavior: function () {
        this.initAddedHandler(),
          this.initRemovedHandler(),
          this.initCursorSelectionHandlers(),
          this.initDoubleClickSimulation(),
          (this.mouseMoveHandler = this.mouseMoveHandler.bind(this))
      },
      onDeselect: function () {
        this.isEditing && this.exitEditing(), (this.selected = !1)
      },
      initAddedHandler: function () {
        var e = this
        this.on('added', function () {
          var t = e.canvas
          t &&
            (t._hasITextHandlers ||
              ((t._hasITextHandlers = !0), e._initCanvasHandlers(t)),
            (t._iTextInstances = t._iTextInstances || []),
            t._iTextInstances.push(e))
        })
      },
      initRemovedHandler: function () {
        var e = this
        this.on('removed', function () {
          var t = e.canvas
          t &&
            ((t._iTextInstances = t._iTextInstances || []),
            fabric.util.removeFromArray(t._iTextInstances, e),
            0 === t._iTextInstances.length &&
              ((t._hasITextHandlers = !1), e._removeCanvasHandlers(t)))
        })
      },
      _initCanvasHandlers: function (t) {
        ;(t._mouseUpITextHandler = function () {
          t._iTextInstances &&
            t._iTextInstances.forEach(function (t) {
              t.__isMousedown = !1
            })
        }),
          t.on('mouse:up', t._mouseUpITextHandler)
      },
      _removeCanvasHandlers: function (t) {
        t.off('mouse:up', t._mouseUpITextHandler)
      },
      _tick: function () {
        this._currentTickState = this._animateCursor(
          this,
          1,
          this.cursorDuration,
          '_onTickComplete'
        )
      },
      _animateCursor: function (t, e, i, r) {
        var n = {
          isAborted: !1,
          abort: function () {
            this.isAborted = !0
          },
        }
        return (
          t.animate('_currentCursorOpacity', e, {
            duration: i,
            onComplete: function () {
              n.isAborted || t[r]()
            },
            onChange: function () {
              t.canvas &&
                t.selectionStart === t.selectionEnd &&
                t.renderCursorOrSelection()
            },
            abort: function () {
              return n.isAborted
            },
          }),
          n
        )
      },
      _onTickComplete: function () {
        var t = this
        this._cursorTimeout1 && clearTimeout(this._cursorTimeout1),
          (this._cursorTimeout1 = setTimeout(function () {
            t._currentTickCompleteState = t._animateCursor(
              t,
              0,
              this.cursorDuration / 2,
              '_tick'
            )
          }, 100))
      },
      initDelayedCursor: function (t) {
        var e = this,
          t = t ? 0 : this.cursorDelay
        this.abortCursorAnimation(),
          (this._currentCursorOpacity = 1),
          (this._cursorTimeout2 = setTimeout(function () {
            e._tick()
          }, t))
      },
      abortCursorAnimation: function () {
        var t = this._currentTickState || this._currentTickCompleteState,
          e = this.canvas
        this._currentTickState && this._currentTickState.abort(),
          this._currentTickCompleteState &&
            this._currentTickCompleteState.abort(),
          clearTimeout(this._cursorTimeout1),
          clearTimeout(this._cursorTimeout2),
          (this._currentCursorOpacity = 0),
          t && e && e.clearContext(e.contextTop || e.contextContainer)
      },
      selectAll: function () {
        return (
          (this.selectionStart = 0),
          (this.selectionEnd = this._text.length),
          this._fireSelectionChanged(),
          this._updateTextarea(),
          this
        )
      },
      getSelectedText: function () {
        return this._text.slice(this.selectionStart, this.selectionEnd).join('')
      },
      findWordBoundaryLeft: function (t) {
        var e = 0,
          i = t - 1
        if (this._reSpace.test(this._text[i]))
          for (; this._reSpace.test(this._text[i]); ) e++, i--
        for (; /\S/.test(this._text[i]) && -1 < i; ) e++, i--
        return t - e
      },
      findWordBoundaryRight: function (t) {
        var e = 0,
          i = t
        if (this._reSpace.test(this._text[i]))
          for (; this._reSpace.test(this._text[i]); ) e++, i++
        for (; /\S/.test(this._text[i]) && i < this._text.length; ) e++, i++
        return t + e
      },
      findLineBoundaryLeft: function (t) {
        for (var e = 0, i = t - 1; !/\n/.test(this._text[i]) && -1 < i; )
          e++, i--
        return t - e
      },
      findLineBoundaryRight: function (t) {
        for (
          var e = 0, i = t;
          !/\n/.test(this._text[i]) && i < this._text.length;

        )
          e++, i++
        return t + e
      },
      searchWordBoundary: function (t, e) {
        for (
          var i = this._text,
            r = this._reSpace.test(i[t]) ? t - 1 : t,
            n = i[r],
            s = fabric.reNonWord;
          !s.test(n) && 0 < r && r < i.length;

        )
          n = i[(r += e)]
        return s.test(n) && (r += 1 === e ? 0 : 1), r
      },
      selectWord: function (t) {
        t = t || this.selectionStart
        var e = this.searchWordBoundary(t, -1),
          t = this.searchWordBoundary(t, 1)
        ;(this.selectionStart = e),
          (this.selectionEnd = t),
          this._fireSelectionChanged(),
          this._updateTextarea(),
          this.renderCursorOrSelection()
      },
      selectLine: function (t) {
        t = t || this.selectionStart
        var e = this.findLineBoundaryLeft(t),
          t = this.findLineBoundaryRight(t)
        return (
          (this.selectionStart = e),
          (this.selectionEnd = t),
          this._fireSelectionChanged(),
          this._updateTextarea(),
          this
        )
      },
      enterEditing: function (t) {
        if (!this.isEditing && this.editable)
          return (
            this.canvas &&
              (this.canvas.calcOffset(), this.exitEditingOnOthers(this.canvas)),
            (this.isEditing = !0),
            this.initHiddenTextarea(t),
            this.hiddenTextarea.focus(),
            (this.hiddenTextarea.value = this.text),
            this._updateTextarea(),
            this._saveEditingProps(),
            this._setEditingProps(),
            (this._textBeforeEdit = this.text),
            this._tick(),
            this.fire('editing:entered'),
            this._fireSelectionChanged(),
            this.canvas &&
              (this.canvas.fire('text:editing:entered', { target: this }),
              this.initMouseMoveHandler(),
              this.canvas.requestRenderAll()),
            this
          )
      },
      exitEditingOnOthers: function (t) {
        t._iTextInstances &&
          t._iTextInstances.forEach(function (t) {
            ;(t.selected = !1), t.isEditing && t.exitEditing()
          })
      },
      initMouseMoveHandler: function () {
        this.canvas.on('mouse:move', this.mouseMoveHandler)
      },
      mouseMoveHandler: function (t) {
        var e, i
        this.__isMousedown &&
          this.isEditing &&
          (document.activeElement !== this.hiddenTextarea &&
            this.hiddenTextarea.focus(),
          (t = this.getSelectionStartFromPointer(t.e)),
          (e = this.selectionStart),
          (i = this.selectionEnd),
          ((t === this.__selectionStartOnMouseDown && e !== i) ||
            (e !== t && i !== t)) &&
            (t > this.__selectionStartOnMouseDown
              ? ((this.selectionStart = this.__selectionStartOnMouseDown),
                (this.selectionEnd = t))
              : ((this.selectionStart = t),
                (this.selectionEnd = this.__selectionStartOnMouseDown)),
            (this.selectionStart === e && this.selectionEnd === i) ||
              (this.restartCursorIfNeeded(),
              this._fireSelectionChanged(),
              this._updateTextarea(),
              this.renderCursorOrSelection())))
      },
      _setEditingProps: function () {
        ;(this.hoverCursor = 'text'),
          this.canvas &&
            (this.canvas.defaultCursor = this.canvas.moveCursor = 'text'),
          (this.borderColor = this.editingBorderColor),
          (this.hasControls = this.selectable = !1),
          (this.lockMovementX = this.lockMovementY = !0)
      },
      fromStringToGraphemeSelection: function (t, e, i) {
        var r = i.slice(0, t),
          r = fabric.util.string.graphemeSplit(r).length
        if (t === e) return { selectionStart: r, selectionEnd: r }
        i = i.slice(t, e)
        return {
          selectionStart: r,
          selectionEnd: r + fabric.util.string.graphemeSplit(i).length,
        }
      },
      fromGraphemeToStringSelection: function (t, e, i) {
        var r = i.slice(0, t).join('').length
        return t === e
          ? { selectionStart: r, selectionEnd: r }
          : {
              selectionStart: r,
              selectionEnd: r + i.slice(t, e).join('').length,
            }
      },
      _updateTextarea: function () {
        var t
        ;(this.cursorOffsetCache = {}),
          this.hiddenTextarea &&
            (this.inCompositionMode ||
              ((t = this.fromGraphemeToStringSelection(
                this.selectionStart,
                this.selectionEnd,
                this._text
              )),
              (this.hiddenTextarea.selectionStart = t.selectionStart),
              (this.hiddenTextarea.selectionEnd = t.selectionEnd)),
            this.updateTextareaPosition())
      },
      updateFromTextArea: function () {
        var t
        this.hiddenTextarea &&
          ((this.cursorOffsetCache = {}),
          (this.text = this.hiddenTextarea.value),
          this._shouldClearDimensionCache() &&
            (this.initDimensions(), this.setCoords()),
          (t = this.fromStringToGraphemeSelection(
            this.hiddenTextarea.selectionStart,
            this.hiddenTextarea.selectionEnd,
            this.hiddenTextarea.value
          )),
          (this.selectionEnd = this.selectionStart = t.selectionEnd),
          this.inCompositionMode || (this.selectionStart = t.selectionStart),
          this.updateTextareaPosition())
      },
      updateTextareaPosition: function () {
        var t
        this.selectionStart === this.selectionEnd &&
          ((t = this._calcTextareaPosition()),
          (this.hiddenTextarea.style.left = t.left),
          (this.hiddenTextarea.style.top = t.top))
      },
      _calcTextareaPosition: function () {
        if (!this.canvas) return { x: 1, y: 1 }
        var t = this.inCompositionMode
            ? this.compositionStart
            : this.selectionStart,
          e = this._getCursorBoundaries(t),
          t = this.get2DCursorLocation(t),
          i = t.lineIndex,
          t = t.charIndex,
          i = this.getValueOfPropertyAt(i, t, 'fontSize') * this.lineHeight,
          t = e.leftOffset,
          r = this.calcTransformMatrix(),
          t = { x: e.left + t, y: e.top + e.topOffset + i },
          e = this.canvas.getRetinaScaling(),
          n = this.canvas.upperCanvasEl,
          s = n.width / e,
          e = n.height / e,
          o = s - i,
          a = e - i,
          s = n.clientWidth / s,
          n = n.clientHeight / e,
          t = fabric.util.transformPoint(t, r)
        return (
          ((t = fabric.util.transformPoint(
            t,
            this.canvas.viewportTransform
          )).x *= s),
          (t.y *= n),
          t.x < 0 && (t.x = 0),
          t.x > o && (t.x = o),
          t.y < 0 && (t.y = 0),
          t.y > a && (t.y = a),
          (t.x += this.canvas._offset.left),
          (t.y += this.canvas._offset.top),
          {
            left: t.x + 'px',
            top: t.y + 'px',
            fontSize: i + 'px',
            charHeight: i,
          }
        )
      },
      _saveEditingProps: function () {
        this._savedProps = {
          hasControls: this.hasControls,
          borderColor: this.borderColor,
          lockMovementX: this.lockMovementX,
          lockMovementY: this.lockMovementY,
          hoverCursor: this.hoverCursor,
          selectable: this.selectable,
          defaultCursor: this.canvas && this.canvas.defaultCursor,
          moveCursor: this.canvas && this.canvas.moveCursor,
        }
      },
      _restoreEditingProps: function () {
        this._savedProps &&
          ((this.hoverCursor = this._savedProps.hoverCursor),
          (this.hasControls = this._savedProps.hasControls),
          (this.borderColor = this._savedProps.borderColor),
          (this.selectable = this._savedProps.selectable),
          (this.lockMovementX = this._savedProps.lockMovementX),
          (this.lockMovementY = this._savedProps.lockMovementY),
          this.canvas &&
            ((this.canvas.defaultCursor = this._savedProps.defaultCursor),
            (this.canvas.moveCursor = this._savedProps.moveCursor)))
      },
      exitEditing: function () {
        var t = this._textBeforeEdit !== this.text,
          e = this.hiddenTextarea
        return (
          (this.selected = !1),
          (this.isEditing = !1),
          (this.selectionEnd = this.selectionStart),
          e &&
            (e.blur && e.blur(), e.parentNode && e.parentNode.removeChild(e)),
          (this.hiddenTextarea = null),
          this.abortCursorAnimation(),
          this._restoreEditingProps(),
          (this._currentCursorOpacity = 0),
          this._shouldClearDimensionCache() &&
            (this.initDimensions(), this.setCoords()),
          this.fire('editing:exited'),
          t && this.fire('modified'),
          this.canvas &&
            (this.canvas.off('mouse:move', this.mouseMoveHandler),
            this.canvas.fire('text:editing:exited', { target: this }),
            t && this.canvas.fire('object:modified', { target: this })),
          this
        )
      },
      _removeExtraneousStyles: function () {
        for (var t in this.styles) this._textLines[t] || delete this.styles[t]
      },
      removeStyleFromTo: function (t, e) {
        var t = this.get2DCursorLocation(t, !0),
          e = this.get2DCursorLocation(e, !0),
          i = t.lineIndex,
          r = t.charIndex,
          n = e.lineIndex,
          s = e.charIndex
        if (i !== n) {
          if (this.styles[i])
            for (l = r; l < this._unwrappedTextLines[i].length; l++)
              delete this.styles[i][l]
          if (this.styles[n])
            for (l = s; l < this._unwrappedTextLines[n].length; l++)
              (c = this.styles[n][l]) &&
                (this.styles[i] || (this.styles[i] = {}),
                (this.styles[i][r + l - s] = c))
          for (l = i + 1; l <= n; l++) delete this.styles[l]
          this.shiftLineStyles(n, i - n)
        } else if (this.styles[i]) {
          for (var o, a, c = this.styles[i], h = s - r, l = r; l < s; l++)
            delete c[l]
          for (a in this.styles[i])
            s <= (o = parseInt(a, 10)) && ((c[o - h] = c[a]), delete c[a])
        }
      },
      shiftLineStyles: function (t, e) {
        var i,
          r = u(this.styles)
        for (i in this.styles) {
          var n = parseInt(i, 10)
          t < n &&
            ((this.styles[n + e] = r[n]), r[n - e] || delete this.styles[n])
        }
      },
      restartCursorIfNeeded: function () {
        ;(this._currentTickState &&
          !this._currentTickState.isAborted &&
          this._currentTickCompleteState &&
          !this._currentTickCompleteState.isAborted) ||
          this.initDelayedCursor()
      },
      insertNewlineStyleObject: function (t, e, i, r) {
        var n,
          s,
          o = {},
          a = !1,
          c = this._unwrappedTextLines[t].length === e
        for (s in (this.shiftLineStyles(t, (i = i || 1)),
        this.styles[t] && (n = this.styles[t][0 === e ? e : e - 1]),
        this.styles[t])) {
          var h = parseInt(s, 10)
          e <= h &&
            ((a = !0),
            (o[h - e] = this.styles[t][s]),
            (c && 0 === e) || delete this.styles[t][s])
        }
        var l = !1
        for (a && !c && ((this.styles[t + i] = o), (l = !0)), l && i--; 0 < i; )
          r && r[i - 1]
            ? (this.styles[t + i] = { 0: u(r[i - 1]) })
            : n
            ? (this.styles[t + i] = { 0: u(n) })
            : delete this.styles[t + i],
            i--
        this._forceClearCache = !0
      },
      insertCharStyleObject: function (t, e, i, r) {
        this.styles || (this.styles = {})
        var n,
          s = this.styles[t],
          o = s ? u(s) : {}
        for (n in ((i = i || 1), o)) {
          var a = parseInt(n, 10)
          e <= a && ((s[a + i] = o[a]), o[a - i] || delete s[a])
        }
        if (((this._forceClearCache = !0), r))
          for (; i--; )
            Object.keys(r[i]).length &&
              (this.styles[t] || (this.styles[t] = {}),
              (this.styles[t][e + i] = u(r[i])))
        else if (s)
          for (var c = s[e ? e - 1 : 1]; c && i--; )
            this.styles[t][e + i] = u(c)
      },
      insertNewStyleBlock: function (t, e, i) {
        for (
          var r = this.get2DCursorLocation(e, !0), n = [0], s = 0, o = 0;
          o < t.length;
          o++
        )
          '\n' === t[o] ? (n[++s] = 0) : n[s]++
        0 < n[0] &&
          (this.insertCharStyleObject(r.lineIndex, r.charIndex, n[0], i),
          (i = i && i.slice(n[0] + 1))),
          s && this.insertNewlineStyleObject(r.lineIndex, r.charIndex + n[0], s)
        for (o = 1; o < s; o++)
          0 < n[o]
            ? this.insertCharStyleObject(r.lineIndex + o, 0, n[o], i)
            : i &&
              this.styles[r.lineIndex + o] &&
              i[0] &&
              (this.styles[r.lineIndex + o][0] = i[0]),
            (i = i && i.slice(n[o] + 1))
        0 < n[o] && this.insertCharStyleObject(r.lineIndex + o, 0, n[o], i)
      },
      setSelectionStartEndWithShift: function (t, e, i) {
        i <= t
          ? (e === t
              ? (this._selectionDirection = 'left')
              : 'right' === this._selectionDirection &&
                ((this._selectionDirection = 'left'), (this.selectionEnd = t)),
            (this.selectionStart = i))
          : t < i && i < e
          ? 'right' === this._selectionDirection
            ? (this.selectionEnd = i)
            : (this.selectionStart = i)
          : (e === t
              ? (this._selectionDirection = 'right')
              : 'left' === this._selectionDirection &&
                ((this._selectionDirection = 'right'),
                (this.selectionStart = e)),
            (this.selectionEnd = i))
      },
      setSelectionInBoundaries: function () {
        var t = this.text.length
        this.selectionStart > t
          ? (this.selectionStart = t)
          : this.selectionStart < 0 && (this.selectionStart = 0),
          this.selectionEnd > t
            ? (this.selectionEnd = t)
            : this.selectionEnd < 0 && (this.selectionEnd = 0)
      },
    })
  })(),
  fabric.util.object.extend(fabric.IText.prototype, {
    initDoubleClickSimulation: function () {
      ;(this.__lastClickTime = +new Date()),
        (this.__lastLastClickTime = +new Date()),
        (this.__lastPointer = {}),
        this.on('mousedown', this.onMouseDown)
    },
    onMouseDown: function (t) {
      var e
      this.canvas &&
        ((this.__newClickTime = +new Date()),
        (e = t.pointer),
        this.isTripleClick(e) &&
          (this.fire('tripleclick', t), this._stopEvent(t.e)),
        (this.__lastLastClickTime = this.__lastClickTime),
        (this.__lastClickTime = this.__newClickTime),
        (this.__lastPointer = e),
        (this.__lastIsEditing = this.isEditing),
        (this.__lastSelected = this.selected))
    },
    isTripleClick: function (t) {
      return (
        this.__newClickTime - this.__lastClickTime < 500 &&
        this.__lastClickTime - this.__lastLastClickTime < 500 &&
        this.__lastPointer.x === t.x &&
        this.__lastPointer.y === t.y
      )
    },
    _stopEvent: function (t) {
      t.preventDefault && t.preventDefault(),
        t.stopPropagation && t.stopPropagation()
    },
    initCursorSelectionHandlers: function () {
      this.initMousedownHandler(), this.initMouseupHandler(), this.initClicks()
    },
    doubleClickHandler: function (t) {
      this.isEditing && this.selectWord(this.getSelectionStartFromPointer(t.e))
    },
    tripleClickHandler: function (t) {
      this.isEditing && this.selectLine(this.getSelectionStartFromPointer(t.e))
    },
    initClicks: function () {
      this.on('mousedblclick', this.doubleClickHandler),
        this.on('tripleclick', this.tripleClickHandler)
    },
    _mouseDownHandler: function (t) {
      !this.canvas ||
        !this.editable ||
        (t.e.button && 1 !== t.e.button) ||
        ((this.__isMousedown = !0),
        this.selected &&
          ((this.inCompositionMode = !1), this.setCursorByClick(t.e)),
        this.isEditing &&
          ((this.__selectionStartOnMouseDown = this.selectionStart),
          this.selectionStart === this.selectionEnd &&
            this.abortCursorAnimation(),
          this.renderCursorOrSelection()))
    },
    _mouseDownHandlerBefore: function (t) {
      !this.canvas ||
        !this.editable ||
        (t.e.button && 1 !== t.e.button) ||
        (this.selected = this === this.canvas._activeObject)
    },
    initMousedownHandler: function () {
      this.on('mousedown', this._mouseDownHandler),
        this.on('mousedown:before', this._mouseDownHandlerBefore)
    },
    initMouseupHandler: function () {
      this.on('mouseup', this.mouseUpHandler)
    },
    mouseUpHandler: function (t) {
      if (
        ((this.__isMousedown = !1),
        !(
          !this.editable ||
          this.group ||
          (t.transform && t.transform.actionPerformed) ||
          (t.e.button && 1 !== t.e.button)
        ))
      ) {
        if (this.canvas) {
          var e = this.canvas._activeObject
          if (e && e !== this) return
        }
        this.__lastSelected && !this.__corner
          ? ((this.selected = !1),
            (this.__lastSelected = !1),
            this.enterEditing(t.e),
            this.selectionStart === this.selectionEnd
              ? this.initDelayedCursor(!0)
              : this.renderCursorOrSelection())
          : (this.selected = !0)
      }
    },
    setCursorByClick: function (t) {
      var e = this.getSelectionStartFromPointer(t),
        i = this.selectionStart,
        r = this.selectionEnd
      t.shiftKey
        ? this.setSelectionStartEndWithShift(i, r, e)
        : ((this.selectionStart = e), (this.selectionEnd = e)),
        this.isEditing && (this._fireSelectionChanged(), this._updateTextarea())
    },
    getSelectionStartFromPointer: function (t) {
      for (
        var e = this.getLocalPointer(t),
          i = 0,
          r = 0,
          n = 0,
          s = 0,
          o = 0,
          a = 0,
          c = this._textLines.length;
        a < c && n <= e.y;
        a++
      )
        (n += this.getHeightOfLine(a) * this.scaleY),
          0 < (o = a) &&
            (s +=
              this._textLines[a - 1].length + this.missingNewlineOffset(a - 1))
      ;(r = this._getLineLeftOffset(o) * this.scaleX),
        (t = this._textLines[o]),
        'rtl' === this.direction && (e.x = this.width * this.scaleX - e.x + r)
      for (
        var h = 0, l = t.length;
        h < l &&
        ((i = r),
        (r += this.__charBounds[o][h].kernedWidth * this.scaleX) <= e.x);
        h++
      )
        s++
      return this._getNewSelectionStartFromOffset(e, i, r, s, l)
    },
    _getNewSelectionStartFromOffset: function (t, e, i, r, n) {
      ;(e = t.x - e), (i -= t.x), (t = r + (e < i || i < 0 ? 0 : 1))
      return (t =
        (t = this.flipX ? n - t : t) > this._text.length
          ? this._text.length
          : t)
    },
  }),
  fabric.util.object.extend(fabric.IText.prototype, {
    initHiddenTextarea: function () {
      ;(this.hiddenTextarea = fabric.document.createElement('textarea')),
        this.hiddenTextarea.setAttribute('autocapitalize', 'off'),
        this.hiddenTextarea.setAttribute('autocorrect', 'off'),
        this.hiddenTextarea.setAttribute('autocomplete', 'off'),
        this.hiddenTextarea.setAttribute('spellcheck', 'false'),
        this.hiddenTextarea.setAttribute('data-fabric-hiddentextarea', ''),
        this.hiddenTextarea.setAttribute('wrap', 'off')
      var t = this._calcTextareaPosition()
      ;(this.hiddenTextarea.style.cssText =
        'position: absolute; top: ' +
        t.top +
        '; left: ' +
        t.left +
        '; z-index: -999; opacity: 0; width: 1px; height: 1px; font-size: 1px; padding-top: ' +
        t.fontSize +
        ';'),
        (this.hiddenTextareaContainer || fabric.document.body).appendChild(
          this.hiddenTextarea
        ),
        fabric.util.addListener(
          this.hiddenTextarea,
          'keydown',
          this.onKeyDown.bind(this)
        ),
        fabric.util.addListener(
          this.hiddenTextarea,
          'keyup',
          this.onKeyUp.bind(this)
        ),
        fabric.util.addListener(
          this.hiddenTextarea,
          'input',
          this.onInput.bind(this)
        ),
        fabric.util.addListener(
          this.hiddenTextarea,
          'copy',
          this.copy.bind(this)
        ),
        fabric.util.addListener(
          this.hiddenTextarea,
          'cut',
          this.copy.bind(this)
        ),
        fabric.util.addListener(
          this.hiddenTextarea,
          'paste',
          this.paste.bind(this)
        ),
        fabric.util.addListener(
          this.hiddenTextarea,
          'compositionstart',
          this.onCompositionStart.bind(this)
        ),
        fabric.util.addListener(
          this.hiddenTextarea,
          'compositionupdate',
          this.onCompositionUpdate.bind(this)
        ),
        fabric.util.addListener(
          this.hiddenTextarea,
          'compositionend',
          this.onCompositionEnd.bind(this)
        ),
        !this._clickHandlerInitialized &&
          this.canvas &&
          (fabric.util.addListener(
            this.canvas.upperCanvasEl,
            'click',
            this.onClick.bind(this)
          ),
          (this._clickHandlerInitialized = !0))
    },
    keysMap: {
      9: 'exitEditing',
      27: 'exitEditing',
      33: 'moveCursorUp',
      34: 'moveCursorDown',
      35: 'moveCursorRight',
      36: 'moveCursorLeft',
      37: 'moveCursorLeft',
      38: 'moveCursorUp',
      39: 'moveCursorRight',
      40: 'moveCursorDown',
    },
    keysMapRtl: {
      9: 'exitEditing',
      27: 'exitEditing',
      33: 'moveCursorUp',
      34: 'moveCursorDown',
      35: 'moveCursorLeft',
      36: 'moveCursorRight',
      37: 'moveCursorRight',
      38: 'moveCursorUp',
      39: 'moveCursorLeft',
      40: 'moveCursorDown',
    },
    ctrlKeysMapUp: { 67: 'copy', 88: 'cut' },
    ctrlKeysMapDown: { 65: 'selectAll' },
    onClick: function () {
      this.hiddenTextarea && this.hiddenTextarea.focus()
    },
    onKeyDown: function (t) {
      if (this.isEditing) {
        var e = 'rtl' === this.direction ? this.keysMapRtl : this.keysMap
        if (t.keyCode in e) this[e[t.keyCode]](t)
        else {
          if (!(t.keyCode in this.ctrlKeysMapDown && (t.ctrlKey || t.metaKey)))
            return
          this[this.ctrlKeysMapDown[t.keyCode]](t)
        }
        t.stopImmediatePropagation(),
          t.preventDefault(),
          33 <= t.keyCode && t.keyCode <= 40
            ? ((this.inCompositionMode = !1),
              this.clearContextTop(),
              this.renderCursorOrSelection())
            : this.canvas && this.canvas.requestRenderAll()
      }
    },
    onKeyUp: function (t) {
      !this.isEditing || this._copyDone || this.inCompositionMode
        ? (this._copyDone = !1)
        : t.keyCode in this.ctrlKeysMapUp &&
          (t.ctrlKey || t.metaKey) &&
          (this[this.ctrlKeysMapUp[t.keyCode]](t),
          t.stopImmediatePropagation(),
          t.preventDefault(),
          this.canvas && this.canvas.requestRenderAll())
    },
    onInput: function (t) {
      var e = this.fromPaste
      if (((this.fromPaste = !1), t && t.stopPropagation(), this.isEditing)) {
        var i,
          r,
          n,
          t = this._splitTextIntoLines(this.hiddenTextarea.value).graphemeText,
          s = this._text.length,
          o = t.length,
          a = o - s,
          c = this.selectionStart,
          h = this.selectionEnd,
          l = c !== h
        if ('' === this.hiddenTextarea.value)
          return (
            (this.styles = {}),
            this.updateFromTextArea(),
            this.fire('changed'),
            void (
              this.canvas &&
              (this.canvas.fire('text:changed', { target: this }),
              this.canvas.requestRenderAll())
            )
          )
        var u = this.fromStringToGraphemeSelection(
            this.hiddenTextarea.selectionStart,
            this.hiddenTextarea.selectionEnd,
            this.hiddenTextarea.value
          ),
          f = c > u.selectionStart
        l
          ? ((i = this._text.slice(c, h)), (a += h - c))
          : o < s &&
            (i = f ? this._text.slice(h + a, h) : this._text.slice(c, c - a)),
          (o = t.slice(u.selectionEnd - a, u.selectionEnd)),
          i &&
            i.length &&
            (o.length &&
              ((r = this.getSelectionStyles(c, c + 1, !1)),
              (r = o.map(function () {
                return r[0]
              }))),
            (s = l
              ? ((n = c), h)
              : f
              ? ((n = h - i.length), h)
              : (n = h) + i.length),
            this.removeStyleFromTo(n, s)),
          o.length &&
            (e &&
              o.join('') === fabric.copiedText &&
              !fabric.disableStyleCopyPaste &&
              (r = fabric.copiedTextStyle),
            this.insertNewStyleBlock(o, c, r)),
          this.updateFromTextArea(),
          this.fire('changed'),
          this.canvas &&
            (this.canvas.fire('text:changed', { target: this }),
            this.canvas.requestRenderAll())
      }
    },
    onCompositionStart: function () {
      this.inCompositionMode = !0
    },
    onCompositionEnd: function () {
      this.inCompositionMode = !1
    },
    onCompositionUpdate: function (t) {
      ;(this.compositionStart = t.target.selectionStart),
        (this.compositionEnd = t.target.selectionEnd),
        this.updateTextareaPosition()
    },
    copy: function () {
      this.selectionStart !== this.selectionEnd &&
        ((fabric.copiedText = this.getSelectedText()),
        fabric.disableStyleCopyPaste
          ? (fabric.copiedTextStyle = null)
          : (fabric.copiedTextStyle = this.getSelectionStyles(
              this.selectionStart,
              this.selectionEnd,
              !0
            )),
        (this._copyDone = !0))
    },
    paste: function () {
      this.fromPaste = !0
    },
    _getClipboardData: function (t) {
      return (t && t.clipboardData) || fabric.window.clipboardData
    },
    _getWidthBeforeCursor: function (t, e) {
      var i = this._getLineLeftOffset(t)
      return 0 < e && (i += (t = this.__charBounds[t][e - 1]).left + t.width), i
    },
    getDownCursorOffset: function (t, e) {
      var e = this._getSelectionForOffset(t, e),
        i = this.get2DCursorLocation(e),
        r = i.lineIndex
      if (r === this._textLines.length - 1 || t.metaKey || 34 === t.keyCode)
        return this._text.length - e
      ;(t = i.charIndex),
        (e = this._getWidthBeforeCursor(r, t)),
        (i = this._getIndexOnLine(r + 1, e))
      return (
        this._textLines[r].slice(t).length +
        i +
        1 +
        this.missingNewlineOffset(r)
      )
    },
    _getSelectionForOffset: function (t, e) {
      return t.shiftKey && this.selectionStart !== this.selectionEnd && e
        ? this.selectionEnd
        : this.selectionStart
    },
    getUpCursorOffset: function (t, e) {
      var e = this._getSelectionForOffset(t, e),
        i = this.get2DCursorLocation(e),
        r = i.lineIndex
      if (0 === r || t.metaKey || 33 === t.keyCode) return -e
      ;(t = i.charIndex),
        (e = this._getWidthBeforeCursor(r, t)),
        (i = this._getIndexOnLine(r - 1, e)),
        (e = this._textLines[r].slice(0, t)),
        (t = this.missingNewlineOffset(r - 1))
      return -this._textLines[r - 1].length + i - e.length + (1 - t)
    },
    _getIndexOnLine: function (t, e) {
      for (
        var i = this._textLines[t],
          r = this._getLineLeftOffset(t),
          n = 0,
          s = 0,
          o = i.length;
        s < o;
        s++
      )
        if (e < (r += h = this.__charBounds[t][s].width)) {
          var a = !0,
            c = r,
            h = Math.abs(r - h - e),
            n = Math.abs(c - e) < h ? s : s - 1
          break
        }
      return (n = a ? n : i.length - 1)
    },
    moveCursorDown: function (t) {
      ;(this.selectionStart >= this._text.length &&
        this.selectionEnd >= this._text.length) ||
        this._moveCursorUpOrDown('Down', t)
    },
    moveCursorUp: function (t) {
      ;(0 === this.selectionStart && 0 === this.selectionEnd) ||
        this._moveCursorUpOrDown('Up', t)
    },
    _moveCursorUpOrDown: function (t, e) {
      t = this['get' + t + 'CursorOffset'](
        e,
        'right' === this._selectionDirection
      )
      e.shiftKey ? this.moveCursorWithShift(t) : this.moveCursorWithoutShift(t),
        0 !== t &&
          (this.setSelectionInBoundaries(),
          this.abortCursorAnimation(),
          (this._currentCursorOpacity = 1),
          this.initDelayedCursor(),
          this._fireSelectionChanged(),
          this._updateTextarea())
    },
    moveCursorWithShift: function (t) {
      var e =
        'left' === this._selectionDirection
          ? this.selectionStart + t
          : this.selectionEnd + t
      return (
        this.setSelectionStartEndWithShift(
          this.selectionStart,
          this.selectionEnd,
          e
        ),
        0 !== t
      )
    },
    moveCursorWithoutShift: function (t) {
      return (
        t < 0
          ? ((this.selectionStart += t),
            (this.selectionEnd = this.selectionStart))
          : ((this.selectionEnd += t),
            (this.selectionStart = this.selectionEnd)),
        0 !== t
      )
    },
    moveCursorLeft: function (t) {
      ;(0 === this.selectionStart && 0 === this.selectionEnd) ||
        this._moveCursorLeftOrRight('Left', t)
    },
    _move: function (t, e, i) {
      var r
      if (t.altKey) r = this['findWordBoundary' + i](this[e])
      else {
        if (!t.metaKey && 35 !== t.keyCode && 36 !== t.keyCode)
          return (this[e] += 'Left' === i ? -1 : 1), !0
        r = this['findLineBoundary' + i](this[e])
      }
      if (void 0 !== r && this[e] !== r) return (this[e] = r), !0
    },
    _moveLeft: function (t, e) {
      return this._move(t, e, 'Left')
    },
    _moveRight: function (t, e) {
      return this._move(t, e, 'Right')
    },
    moveCursorLeftWithoutShift: function (t) {
      var e = !0
      return (
        (this._selectionDirection = 'left'),
        this.selectionEnd === this.selectionStart &&
          0 !== this.selectionStart &&
          (e = this._moveLeft(t, 'selectionStart')),
        (this.selectionEnd = this.selectionStart),
        e
      )
    },
    moveCursorLeftWithShift: function (t) {
      return 'right' === this._selectionDirection &&
        this.selectionStart !== this.selectionEnd
        ? this._moveLeft(t, 'selectionEnd')
        : 0 !== this.selectionStart
        ? ((this._selectionDirection = 'left'),
          this._moveLeft(t, 'selectionStart'))
        : void 0
    },
    moveCursorRight: function (t) {
      ;(this.selectionStart >= this._text.length &&
        this.selectionEnd >= this._text.length) ||
        this._moveCursorLeftOrRight('Right', t)
    },
    _moveCursorLeftOrRight: function (t, e) {
      t = 'moveCursor' + t + 'With'
      ;(this._currentCursorOpacity = 1),
        e.shiftKey ? (t += 'Shift') : (t += 'outShift'),
        this[t](e) &&
          (this.abortCursorAnimation(),
          this.initDelayedCursor(),
          this._fireSelectionChanged(),
          this._updateTextarea())
    },
    moveCursorRightWithShift: function (t) {
      return 'left' === this._selectionDirection &&
        this.selectionStart !== this.selectionEnd
        ? this._moveRight(t, 'selectionStart')
        : this.selectionEnd !== this._text.length
        ? ((this._selectionDirection = 'right'),
          this._moveRight(t, 'selectionEnd'))
        : void 0
    },
    moveCursorRightWithoutShift: function (t) {
      var e = !0
      return (
        (this._selectionDirection = 'right'),
        this.selectionStart === this.selectionEnd
          ? ((e = this._moveRight(t, 'selectionStart')),
            (this.selectionEnd = this.selectionStart))
          : (this.selectionStart = this.selectionEnd),
        e
      )
    },
    removeChars: function (t, e) {
      this.removeStyleFromTo(t, (e = void 0 === e ? t + 1 : e)),
        this._text.splice(t, e - t),
        (this.text = this._text.join('')),
        this.set('dirty', !0),
        this._shouldClearDimensionCache() &&
          (this.initDimensions(), this.setCoords()),
        this._removeExtraneousStyles()
    },
    insertChars: function (t, e, i, r) {
      i < (r = void 0 === r ? i : r) && this.removeStyleFromTo(i, r)
      t = fabric.util.string.graphemeSplit(t)
      this.insertNewStyleBlock(t, i, e),
        (this._text = [].concat(
          this._text.slice(0, i),
          t,
          this._text.slice(r)
        )),
        (this.text = this._text.join('')),
        this.set('dirty', !0),
        this._shouldClearDimensionCache() &&
          (this.initDimensions(), this.setCoords()),
        this._removeExtraneousStyles()
    },
  }),
  (function () {
    var a = fabric.util.toFixed,
      c = /  +/g
    fabric.util.object.extend(fabric.Text.prototype, {
      _toSVG: function () {
        var t = this._getSVGLeftTopOffsets(),
          t = this._getSVGTextAndBg(t.textTop, t.textLeft)
        return this._wrapSVGTextAndBg(t)
      },
      toSVG: function (t) {
        return this._createBaseSVGMarkup(this._toSVG(), {
          reviver: t,
          noStyle: !0,
          withShadow: !0,
        })
      },
      _getSVGLeftTopOffsets: function () {
        return {
          textLeft: -this.width / 2,
          textTop: -this.height / 2,
          lineTop: this.getHeightOfLine(0),
        }
      },
      _wrapSVGTextAndBg: function (t) {
        var e = this.getSvgTextDecoration(this)
        return [
          t.textBgRects.join(''),
          '\t\t<text xml:space="preserve" ',
          this.fontFamily
            ? 'font-family="' + this.fontFamily.replace(/"/g, "'") + '" '
            : '',
          this.fontSize ? 'font-size="' + this.fontSize + '" ' : '',
          this.fontStyle ? 'font-style="' + this.fontStyle + '" ' : '',
          this.fontWeight ? 'font-weight="' + this.fontWeight + '" ' : '',
          e ? 'text-decoration="' + e + '" ' : '',
          'style="',
          this.getSvgStyles(!0),
          '"',
          this.addPaintOrder(),
          ' >',
          t.textSpans.join(''),
          '</text>\n',
        ]
      },
      _getSVGTextAndBg: function (t, e) {
        var i,
          r = [],
          n = [],
          s = t
        this._setSVGBg(n)
        for (var o = 0, a = this._textLines.length; o < a; o++)
          (i = this._getLineLeftOffset(o)),
            (this.textBackgroundColor ||
              this.styleHas('textBackgroundColor', o)) &&
              this._setSVGTextLineBg(n, o, e + i, s),
            this._setSVGTextLineText(r, o, e + i, s),
            (s += this.getHeightOfLine(o))
        return { textSpans: r, textBgRects: n }
      },
      _createTextCharSpan: function (t, e, i, r) {
        var n = t !== t.trim() || t.match(c),
          n = this.getSvgSpanStyles(e, n),
          n = n ? 'style="' + n + '"' : '',
          e = e.deltaY,
          s = '',
          o = fabric.Object.NUM_FRACTION_DIGITS
        return (
          e && (s = ' dy="' + a(e, o) + '" '),
          [
            '<tspan x="',
            a(i, o),
            '" y="',
            a(r, o),
            '" ',
            s,
            n,
            '>',
            fabric.util.string.escapeXml(t),
            '</tspan>',
          ].join('')
        )
      },
      _setSVGTextLineText: function (t, e, i, r) {
        var n,
          s,
          o,
          a,
          c = this.getHeightOfLine(e),
          h = -1 !== this.textAlign.indexOf('justify'),
          l = '',
          u = 0,
          f = this._textLines[e]
        r += (c * (1 - this._fontSizeFraction)) / this.lineHeight
        for (var d = 0, g = f.length - 1; d <= g; d++)
          (a = d === g || this.charSpacing),
            (l += f[d]),
            (o = this.__charBounds[e][d]),
            0 === u
              ? ((i += o.kernedWidth - o.width), (u += o.width))
              : (u += o.kernedWidth),
            (a = h && !a && this._reSpaceAndTab.test(f[d]) ? !0 : a) ||
              ((n = n || this.getCompleteStyleDeclaration(e, d)),
              (s = this.getCompleteStyleDeclaration(e, d + 1)),
              (a = fabric.util.hasStyleChanged(n, s, !0))),
            a &&
              ((o = this._getStyleDeclaration(e, d) || {}),
              t.push(this._createTextCharSpan(l, o, i, r)),
              (l = ''),
              (n = s),
              (i += u),
              (u = 0))
      },
      _pushTextBgRect: function (t, e, i, r, n, s) {
        var o = fabric.Object.NUM_FRACTION_DIGITS
        t.push(
          '\t\t<rect ',
          this._getFillAttributes(e),
          ' x="',
          a(i, o),
          '" y="',
          a(r, o),
          '" width="',
          a(n, o),
          '" height="',
          a(s, o),
          '"></rect>\n'
        )
      },
      _setSVGTextLineBg: function (t, e, i, r) {
        for (
          var n,
            s,
            o = this._textLines[e],
            a = this.getHeightOfLine(e) / this.lineHeight,
            c = 0,
            h = 0,
            l = this.getValueOfPropertyAt(e, 0, 'textBackgroundColor'),
            u = 0,
            f = o.length;
          u < f;
          u++
        )
          (n = this.__charBounds[e][u]),
            (s = this.getValueOfPropertyAt(e, u, 'textBackgroundColor')) !== l
              ? (l && this._pushTextBgRect(t, l, i + h, r, c, a),
                (h = n.left),
                (c = n.width),
                (l = s))
              : (c += n.kernedWidth)
        s && this._pushTextBgRect(t, s, i + h, r, c, a)
      },
      _getFillAttributes: function (t) {
        var e = t && 'string' == typeof t ? new fabric.Color(t) : ''
        return e && e.getSource() && 1 !== e.getAlpha()
          ? 'opacity="' +
              e.getAlpha() +
              '" fill="' +
              e.setAlpha(1).toRgb() +
              '"'
          : 'fill="' + t + '"'
      },
      _getSVGLineTopOffset: function (t) {
        for (var e, i = 0, r = 0; r < t; r++) i += this.getHeightOfLine(r)
        return (
          (e = this.getHeightOfLine(r)),
          {
            lineTop: i,
            offset:
              ((this._fontSizeMult - this._fontSizeFraction) * e) /
              (this.lineHeight * this._fontSizeMult),
          }
        )
      },
      getSvgStyles: function (t) {
        return (
          fabric.Object.prototype.getSvgStyles.call(this, t) +
          ' white-space: pre;'
        )
      },
    })
  })(),
  (function (t) {
    'use strict'
    var b = t.fabric || (t.fabric = {})
    ;(b.Textbox = b.util.createClass(b.IText, b.Observable, {
      type: 'textbox',
      minWidth: 20,
      dynamicMinWidth: 2,
      __cachedLines: null,
      lockScalingFlip: !0,
      noScaleCache: !1,
      _dimensionAffectingProps:
        b.Text.prototype._dimensionAffectingProps.concat('width'),
      _wordJoiners: /[ \t\r]/,
      splitByGrapheme: !1,
      initDimensions: function () {
        this.__skipDimension ||
          (this.isEditing && this.initDelayedCursor(),
          this.clearContextTop(),
          this._clearCache(),
          (this.dynamicMinWidth = 0),
          (this._styleMap = this._generateStyleMap(this._splitText())),
          this.dynamicMinWidth > this.width &&
            this._set('width', this.dynamicMinWidth),
          -1 !== this.textAlign.indexOf('justify') && this.enlargeSpaces(),
          (this.height = this.calcTextHeight()),
          this.saveState({ propertySet: '_dimensionAffectingProps' }))
      },
      _generateStyleMap: function (t) {
        for (
          var e = 0, i = 0, r = 0, n = {}, s = 0;
          s < t.graphemeLines.length;
          s++
        )
          '\n' === t.graphemeText[r] && 0 < s
            ? ((i = 0), r++, e++)
            : !this.splitByGrapheme &&
              this._reSpaceAndTab.test(t.graphemeText[r]) &&
              0 < s &&
              (i++, r++),
            (n[s] = { line: e, offset: i }),
            (r += t.graphemeLines[s].length),
            (i += t.graphemeLines[s].length)
        return n
      },
      styleHas: function (t, e) {
        var i
        return (
          this._styleMap &&
            !this.isWrapping &&
            (i = this._styleMap[e]) &&
            (e = i.line),
          b.Text.prototype.styleHas.call(this, t, e)
        )
      },
      isEmptyStyles: function (t) {
        if (!this.styles) return !0
        var e,
          i,
          r,
          n = 0,
          s = !1,
          o = this._styleMap[t],
          a = this._styleMap[t + 1]
        for (r in (o && ((t = o.line), (n = o.offset)),
        a && ((s = a.line === t), (e = a.offset)),
        (i = void 0 === t ? this.styles : { line: this.styles[t] })))
          for (var c in i[r])
            if (n <= c && (!s || c < e)) for (var h in i[r][c]) return !1
        return !0
      },
      _getStyleDeclaration: function (t, e) {
        if (this._styleMap && !this.isWrapping) {
          var i = this._styleMap[t]
          if (!i) return null
          ;(t = i.line), (e = i.offset + e)
        }
        return this.callSuper('_getStyleDeclaration', t, e)
      },
      _setStyleDeclaration: function (t, e, i) {
        var r = this._styleMap[t]
        ;(t = r.line), (e = r.offset + e), (this.styles[t][e] = i)
      },
      _deleteStyleDeclaration: function (t, e) {
        var i = this._styleMap[t]
        ;(t = i.line), (e = i.offset + e), delete this.styles[t][e]
      },
      _getLineStyle: function (t) {
        t = this._styleMap[t]
        return !!this.styles[t.line]
      },
      _setLineStyle: function (t) {
        t = this._styleMap[t]
        this.styles[t.line] = {}
      },
      _wrapText: function (t, e) {
        var i,
          r = []
        for (this.isWrapping = !0, i = 0; i < t.length; i++)
          r = r.concat(this._wrapLine(t[i], i, e))
        return (this.isWrapping = !1), r
      },
      _measureWord: function (t, e, i) {
        var r,
          n = 0
        i = i || 0
        for (var s = 0, o = t.length; s < o; s++)
          (n += this._getGraphemeBox(t[s], e, s + i, r, !0).kernedWidth),
            (r = t[s])
        return n
      },
      _wrapLine: function (t, e, i, r) {
        var n,
          s,
          o = 0,
          a = this.splitByGrapheme,
          c = [],
          h = [],
          l = a ? b.util.string.graphemeSplit(t) : t.split(this._wordJoiners),
          u = 0,
          f = a ? '' : ' ',
          d = 0,
          g = 0,
          p = !0,
          m = this._getWidthOfCharSpacing(),
          r = r || 0
        0 === l.length && l.push([]), (i -= r)
        for (var v = 0; v < l.length; v++)
          (n = a ? l[v] : b.util.string.graphemeSplit(l[v])),
            (s = this._measureWord(n, e, u)),
            (u += n.length),
            i < (o += d + s - m) && !p
              ? (c.push(h), (h = []), (o = s), (p = !0))
              : (o += m),
            p || a || h.push(f),
            (h = h.concat(n)),
            (d = a ? 0 : this._measureWord([f], e, u)),
            u++,
            (p = !1),
            g < s && (g = s)
        return (
          v && c.push(h),
          g + r > this.dynamicMinWidth && (this.dynamicMinWidth = g - m + r),
          c
        )
      },
      isEndOfWrapping: function (t) {
        return (
          !this._styleMap[t + 1] ||
          this._styleMap[t + 1].line !== this._styleMap[t].line
        )
      },
      missingNewlineOffset: function (t) {
        return !this.splitByGrapheme || this.isEndOfWrapping(t) ? 1 : 0
      },
      _splitTextIntoLines: function (t) {
        for (
          var t = b.Text.prototype._splitTextIntoLines.call(this, t),
            e = this._wrapText(t.lines, this.width),
            i = new Array(e.length),
            r = 0;
          r < e.length;
          r++
        )
          i[r] = e[r].join('')
        return (t.lines = i), (t.graphemeLines = e), t
      },
      getMinWidth: function () {
        return Math.max(this.minWidth, this.dynamicMinWidth)
      },
      _removeExtraneousStyles: function () {
        var t,
          e = {}
        for (t in this._styleMap)
          this._textLines[t] && (e[this._styleMap[t].line] = 1)
        for (t in this.styles) e[t] || delete this.styles[t]
      },
      toObject: function (t) {
        return this.callSuper(
          'toObject',
          ['minWidth', 'splitByGrapheme'].concat(t)
        )
      },
    })),
      (b.Textbox.fromObject = function (t, e) {
        var i = b.util.stylesFromArray(t.styles, t.text),
          t = Object.assign({}, t, { styles: i })
        return b.Object._fromObject('Textbox', t, e, 'text')
      })
  })('undefined' != typeof exports ? exports : this),
  (function () {
    var t = fabric.controlsUtils,
      e = t.scaleSkewCursorStyleHandler,
      i = t.scaleCursorStyleHandler,
      r = t.scalingEqually,
      n = t.scalingYOrSkewingX,
      s = t.scalingXOrSkewingY,
      o = t.scaleOrSkewActionName,
      a = fabric.Object.prototype.controls
    ;(a.ml = new fabric.Control({
      x: -0.5,
      y: 0,
      cursorStyleHandler: e,
      actionHandler: s,
      getActionName: o,
    })),
      (a.mr = new fabric.Control({
        x: 0.5,
        y: 0,
        cursorStyleHandler: e,
        actionHandler: s,
        getActionName: o,
      })),
      (a.mb = new fabric.Control({
        x: 0,
        y: 0.5,
        cursorStyleHandler: e,
        actionHandler: n,
        getActionName: o,
      })),
      (a.mt = new fabric.Control({
        x: 0,
        y: -0.5,
        cursorStyleHandler: e,
        actionHandler: n,
        getActionName: o,
      })),
      (a.tl = new fabric.Control({
        x: -0.5,
        y: -0.5,
        cursorStyleHandler: i,
        actionHandler: r,
      })),
      (a.tr = new fabric.Control({
        x: 0.5,
        y: -0.5,
        cursorStyleHandler: i,
        actionHandler: r,
      })),
      (a.bl = new fabric.Control({
        x: -0.5,
        y: 0.5,
        cursorStyleHandler: i,
        actionHandler: r,
      })),
      (a.br = new fabric.Control({
        x: 0.5,
        y: 0.5,
        cursorStyleHandler: i,
        actionHandler: r,
      })),
      (a.mtr = new fabric.Control({
        x: 0,
        y: -0.5,
        actionHandler: t.rotationWithSnapping,
        cursorStyleHandler: t.rotationStyleHandler,
        offsetY: -40,
        withConnection: !0,
        actionName: 'rotate',
      })),
      fabric.Textbox &&
        (((s = fabric.Textbox.prototype.controls = {}).mtr = a.mtr),
        (s.tr = a.tr),
        (s.br = a.br),
        (s.tl = a.tl),
        (s.bl = a.bl),
        (s.mt = a.mt),
        (s.mb = a.mb),
        (s.mr = new fabric.Control({
          x: 0.5,
          y: 0,
          actionHandler: t.changeWidth,
          cursorStyleHandler: e,
          actionName: 'resizing',
        })),
        (s.ml = new fabric.Control({
          x: -0.5,
          y: 0,
          actionHandler: t.changeWidth,
          cursorStyleHandler: e,
          actionName: 'resizing',
        })))
  })()
