(function(definition) {

  // CommonJS
  if (typeof exports === "object") {
    module.exports = definition();

    // RequireJS
  } else if (typeof define === "function" && define.amd) {
    define(definition);

    // <script>
  } else {
    QuDOM = definition();
  }

})(function() {
  'use strict';

  var QuDOM = function QuDOM(text) {
  };

  (function (P) {
  })(QuDOM.prototype);

  QuDOM.NODE_TYPES = {
    ELEMENT_NODE: 1,
    ATTRIBUTE_NODE: 2,
    TEXT_NODE: 3,
    CDATA_SECTION_NODE: 4,
    ENTITY_REFERENCE_NODE: 5,
    ENTITY_NODE: 6,
    PROCESSING_INSTRUCTION_NODE: 7,
    COMMENT_NODE: 8,
    DOCUMENT_NODE: 9,
    DOCUMENT_TYPE_NODE: 10,
    DOCUMENT_FRAGMENT_NODE: 11,
    NOTATION_NODE: 12,
  };
  var NT = QuDOM.NODE_TYPES;

  var Event = QuDOM.Event = function Event(type, eventInit) {
    this.type = type;
    
    var init = eventInit || {};
    this.bubbles = init.bubbles || true;
    this.cancelBubble = init.cancelBubble || true;
    this.cancelable = init.cancelable || true;
    this.composed = init.composed || true;
    this.currentTarget = null;
    this.deepPath = init.deepPath || true;
    this.defaultPrevented = init.defaultPrevented || true;
    this.eventPhase = init.eventPhase || true;
    this.explicitOriginalTarget  = init.explicitOriginalTarget  || true;
    this.originalTarget  = init.originalTarget  || true;
    this.returnValue  = init.returnValue  || true;
    this.scoped = init.scoped || true;
    this.srcElement  = null
    this.target = null;
    this.timeStamp = null;
    this.isTrusted = init.isTrusted || true;
  };

  // Ref: https://developer.mozilla.org/ja/docs/Web/API/EventTarget
  var EventTarget = QuDOM.EventTarget = function EventTarget() {
    this.listeners = {};
  };
  (function (P) {
    P.listeners = null;
    P.addEventListener = function(type, callback) {
      if(!(type in this.listeners)) {
        this.listeners[type] = [];
      }
      this.listeners[type].push(callback);
    };
    P.removeEventListener = function(type, callback) {
      if(!(type in this.listeners)) {
        return;
      }
      var stack = this.listeners[type];
      for(var i = 0, l = stack.length; i < l; i++) {
        if(stack[i] === callback){
          stack.splice(i, 1);
          return;
        }
      }
    };
    P.dispatchEvent = function(event) {
      if(!(event.type in this.listeners)) {
        return;
      }
      var stack = this.listeners[event.type];
      event.target = this;
      for(var i = 0, l = stack.length; i < l; i++) {
          stack[i].call(this, event);
      }
    };
  })(EventTarget.prototype);

  var Node = QuDOM.Node = function Node() {
    EventTarget.call(this);
  };
  Node.prototype = Object.create(EventTarget.prototype);
  Node.prototype.constructor = Node;
  (function (P) {
    P.baseURI = null;
    P.baseURIObject  = null;
    P.childNodes = [];
    P.firstChild = null;
    P.lastChild = null;
    P.nextSibling = null;
    P.nodeName = null;
    P.nodePrincipal  = null;
    P.nodeType = null;
    P.nodeValue = null;
    P.ownerDocument = null;
    P.parentNode = null;
    P.parentElement = null;
    P.previousSibling = null;
    P.textContent = null;
    P.appendChild = function (child) {
      this.childNodes.push(child);
      return child;
    }
  })(Node.prototype);

  var Element = QuDOM.Element = function Element() {
    Node.call(this);
  };
  Element.prototype = Object.create(Node.prototype);
  Element.prototype.constructor = Element;
  (function (P) {
    P.attributes = null;
    P.classList = null;
    P.className = null;
    P.clientHeight  = null;
    P.clientLeft  = null;
    P.clientTop  = null;
    P.clientWidth  = null;
    P.computedName = null;
    P.computedRole = null;
    P.id = null;
    P.innerHTML = null;
    P.localName = null;
    P.namespaceURI = null;
    P.nextElementSibling = null;
    P.outerHTML  = null;
    P.prefix = null;
    P.previousElementSibling = null;
    P.scrollHeight  = null;
    P.scrollLeft  = null;
    P.scrollLeftMax  = null;
    P.scrollTop  = null;
    P.scrollTopMax  = null;
    P.scrollWidth  = null;
    P.shadowRoot  = null;
    P.slot  = null;
    P.tabStop  = null;
    P.tagName = null;
    P.undoManager  = null;
    P.undoScope  = null;
  })(Element.prototype);


  var HTMLElement = QuDOM.HTMLElement = function HTMLElement() {
    Element.call(this);
  };
  HTMLElement.prototype = Object.create(Element.prototype);
  HTMLElement.prototype.constructor = HTMLElement;
  (function (P) {
  })(HTMLElement.prototype);


  var HTMLInputElement = QuDOM.HTMLInputElement = function HTMLInputElement() {
    HTMLElement.call(this);
    this.value_ = "";
  };
  HTMLInputElement.prototype = Object.create(HTMLElement.prototype, {
    value: {
      enumerable: true,
      get: function () {
        return this.value_;
      },
      set: function (value) {
        if (this.value_ == value) return;
        this.value_ = value;
        var event = new Event();
        event.target = this;
        event.type = "change";
        event.bubbles = true;
        event.cancelable = true;
        this.dispatchEvent(event);
      },
    }
  });
  HTMLInputElement.prototype.constructor = HTMLInputElement;
  (function (P) {
  })(HTMLInputElement.prototype);

  function contains(array, item) {
    return array.indexOf(item) >= 0;
  }

  var TAGS = [
    "body"
  ];

  var INPUT_TAGS = [
    "input"
  ];

  var Document = QuDOM.Document = function Document() {
    this.body = this.createElement("body");
  };
  (function (P) {
    P.createElement = function (tagName, options) {
      var tagName_ = (tagName || "").toLowerCase();
      var elm;
      if (contains(TAGS, tagName_)) {
        elm = new HTMLElement();
      } else if (contains(INPUT_TAGS, tagName_)) {
        elm = new HTMLInputElement();
      }
      if (tagName) {
        elm.nodeName = tagName;
        elm.tagName = tagName.toLowerCase();
      }
      return elm;
    };
  })(Document.prototype);

  return QuDOM;
});
