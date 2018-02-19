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

  var NamedNodeMap = QuDOM.NamedNodeMap = function NamedNodeMap() {
    this.attrs_ = [];
  };
  NamedNodeMap.prototype = Object.create(Object.prototype, {
    length: {
      get: function () {
        return this.attrs_.length;
      }
    }
  });
  NamedNodeMap.prototype.constructor = NamedNodeMap;
  (function (P) {
    P.attrs_ = null;
    P.getNamedItem = function (name) {
      for (var i = 0; i < this.attrs_.length; i++) {
        var attr = this.attrs_[i];
        if (attr.name === name) return attr;
      }
      return undefined;
    };
    P.setNamedItem = function (attr) {
      for (var i = 0; i < this.attrs_.length; i++) {
        var curAttr = this.attrs_[i];
        if (curAttr.name === attr.name) {
          this.attrs_.splice(i, 1);
          break;
        }
      }
      this.attrs_.push(attr);
    };
    P.removeNamedItem = function (name) {
      for (var i = 0; i < this.attrs_.length; i++) {
        var curAttr = this.attrs_[i];
        if (curAttr.name === name) {
          this.attrs_.splice(i, 1);
          return;
        }
      }
    };
    P.item = function (index) {
      return index < this.attrs_.length ? this.attrs_[index] : null;
    };
    // P.getNamedItemNS
    // P.setNamedItemNS
    // P.removeNamedItemNS
  })(NamedNodeMap.prototype);

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
    this.childNodes = [];
  };
  Node.prototype = Object.create(EventTarget.prototype);
  Node.prototype.constructor = Node;
  (function (P) {
    P.baseURI = null;
    P.baseURIObject  = null;
    P.childNodes = null;
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
    };
  })(Node.prototype);

  var Attr = QuDOM.Attr = function Attr() {
    Node.call(this);
  };
  Attr.prototype = Object.create(Node.prototype);
  Attr.prototype.constructor = Attr;
  (function (P) {
    P.name = null;
    P.namespaceURI = null;
    P.localname = null;
    P.prefix = null;
    P.specified = null;
    P.value = null;
    P.toString = function () {
      return this.name + '="' + this.value + '"';
    };
  })(Attr.prototype);

  var Element = QuDOM.Element = function Element() {
    Node.call(this);
    this.innerHTML_ = "";
    this.attributes = new NamedNodeMap();
  };
  Element.prototype = Object.create(Node.prototype, {
    innerHTML: {
      enumerable: true,
      get: function () {
        return this.innerHTML_;
      },
      set: function (value) {
        if (this.innerHTML_ == value) return;
        this.innerHTML_ = value;
        this.parseHTML(this.innerHTML_);
      },
    }
  });
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
    P.parseHTML = function (html) {

      function clearChildNodes(childNodes) {
        for (var i = 0; i < childNodes.length; i++) {
          clearChildNodes(childNodes[i].childNodes);
        }
        childNodes.splice(0, childNodes.length);
      }
      clearChildNodes(this.childNodes);

      var parser = new QuHtmlParser(html);
      var items = parser.parseHTML();
      
      var self = this;
      function addToChildNodes(parent, item) {
        if (item.constructor !== Tag) return;
        var tag = item;
        var elm = createElement(tag.name);
        for (var i = 0; i < tag.attrs.length; i++) {
          var attr = tag.attrs[i];
          var attr2 = new Attr();
          attr2.name = attr.name;
          attr2.value = attr.value;
          elm.attributes.setNamedItem(attr2);
        }
        parent.appendChild(elm);
        if (tag.children) {
          for (var i = 0; i < tag.children.length; i++) {
            addToChildNodes(elm, tag.children[i]);
          }
        }
      };
      for (var i = 0; i < items.length; i++) {
        addToChildNodes(this, items[i]);
      }
    };
    P.toString = function (indent) {
      var indent = indent || '';
      var self = this;
      return indent +
        '<' + this.tagName +
        (function () {
          if (self.attributes.length === 0) {
            return '';
          } else {
            var s = '';
            for (var i = 0; i < self.attributes.length; i++) {
              var attr = self.attributes.item(i);
              s += ' ' + attr.name + '="' + attr.value + '"';
            }
            return s;
          }
        })() +
        '>' +
        (function () {
          if (self.childNodes.length === 0) {
            return '';
          } else {
            var s = '\n';
            for (var i = 0; i < self.childNodes.length; i++) {
              s += self.childNodes[i].toString('  ' + indent) + '\n';
            }
            return s + indent;
          }
        })() +
        '</' + self.tagName + '>';
    };
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
    "body", "span"
  ];

  var INPUT_TAGS = [
    "input"
  ];

  function createElement(tagName, options) {
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
  }

  var Document = QuDOM.Document = function Document() {
    this.body = this.createElement("body");
  };
  (function (P) {
    P.createElement = createElement;
  })(Document.prototype);

  /******************************************************************
   *
   *
   *
   */
  var QuHtmlParser = function QuHtmlParser(text) {
    this.remain = text;
    this.lv = 0;
  };

  (function (P) {

    P.find = function (key, text) {
      var index = text.indexOf(key);
      var found = index >= 0;
      return {
        found: found,
        lead: found ? text.substring(0, index) : '',
        key: key,
        remain: found ? text.substring(index) : text,
      };
    };

    P.isTagClosing = function (name, subparts) {
      if (subparts.length == 0) return false;
      var last = subparts[subparts.length - 1];
      if (last.kind != NK.TAG) return false;
      if (!last.isEnd) return false;
      if (last.name != name) return false;
      return true;
    }

    P.parseHTML = function () {
      var nodes = [];
      while (this.remain) {
        var fr = this.find('<', this.remain);
        if (fr.found) {
          if (fr.lead) {
            nodes.push(new Body(fr.lead, this.lv));
          }
          var tag = this.parseTag(fr.remain, this.lv);
          nodes.push(tag);
          if (tag.isSingle) {
            //
          } else if (tag.isEnd) {
            return nodes;
          } else {
            this.lv++;
            var subnodes = this.parseHTML();
            if (!this.isTagClosing(tag.name, subnodes))
              throw new SyntaxError("Tag was not closing: '" + tag.name + "'");
            this.lv--;
            var children = subnodes.slice(0, subnodes.length - 1);
            tag.children = children.length == 0 ? null : children;
          }
        } else {
          nodes.push(new Body(this.remain, this.lv));
          this.remain = '';
        }
      }
      return nodes;
    };

    P.require = function (token, kind) {
      if (!(token.kind & kind)) throw new SyntaxError("Bad token: '" + token.text + "'");
      return token;
    }

    P.prospect = function (token, kind) {
      return token.kind == kind ? token : null;
    }

    P.parseTag = function (text, lv) {
      var lex = new QuHtmlParser.TagLexer(text);
      this.require(lex.nextToken(), TK.LT);
      var isEnd = !!this.prospect(lex.nextToken(), TK.SL);
      var name = this.require(isEnd ? lex.nextToken() : lex.token(), TK.NM).text;
      
      lex.nextToken();
      if (isEnd && lex.token().kind == TK.NM)
        throw new SyntaxError("End tag must not have attribute: '" + lex.token().text + "'");

      var attrs = [];
      while (lex.token().kind == TK.NM) {
        var attr = {};
        attrs.push(attr);
        attr.name = lex.token().text;
        if (!this.prospect(lex.nextToken(), TK.EQ)) continue;
        var vtoken = this.require(lex.nextToken(), TK.ST | TK.NM);
        attr.value = vtoken.kind == TK.ST ?
        vtoken.text.substr(1, vtoken.text.length - 2) : vtoken.text;
        lex.nextToken();
      }
      var isSingle = !!this.prospect(lex.token(), TK.SL);
      if (isEnd && isSingle) throw new SyntaxError("Bad token: '" + lex.token().text + "'");
      var end = this.require(isSingle ? lex.nextToken() : lex.token(), TK.GT);
      this.remain = lex.remain();
      return new Tag(name, attrs, isEnd, isSingle, null, lv);
    };

  })(QuHtmlParser.prototype);

  // Token Kind
  var TK = {
    LT: 1,
    SL: 2,
    NM: 4,
    EQ: 8,
    ST: 16,
    GT: 32,
  };

  var Token = function Token(kind, text) {
    this.kind = kind;
    this.text = text;
  };
  QuHtmlParser.Token = Token;

  QuHtmlParser.TagLexer = function TagLexer(text) {
    this.text = text;
    this.i = 0;
    this.token_ = null;
  };
  (function (P) {
    P.isEOT = function () {
      return this.i >= this.text.length;
    }
    P.c = function() {
      if (this.isEOT()) throw new SyntaxError("No '>'");
      return this.text[this.i];
    };
    P.next = function() {
      var ch = this.c();
      this.i += 1;
      return ch;
    };
    P.remain = function () {
      return this.text.substring(this.i);
    };
    var toTest = function (re) { return re.test.bind(re); };
    P.isSpace = toTest(/\s/);
    P.isNameStart = toTest(/[A-Za-z_@#$%\-.:]/);
    P.isName = toTest(/[A-Za-z0-9_@#$%\-.:]/);
    P.isLt = toTest(/</);
    P.isGt = toTest(/>/);
    P.isSlash = toTest(/\//);
    P.isEq = toTest(/=/);
    P.isSq = toTest(/'/);
    P.isDq = toTest(/"/);
    P.skipSpace = function () {
      while (!this.isEOT() && this.isSpace(this.c())) {
        this.next();
      }
    }
    P.singleQuote = function () {
      var s = this.next();
      while (!this.isEOT() && !this.isSq(this.c())) {
        s += this.next();
      }
      if (!this.isEOT() && this.isSq(this.c())) s += this.next();
      return new Token(TK.ST, s);
    };
    P.doubleQuote = function () {
      var s = this.next();
      while (!this.isEOT() && !this.isDq(this.c())) {
        s += this.next();
      }
      if (!this.isEOT() && this.isDq(this.c())) s += this.next();
      return new Token(TK.ST, s);
    };
    P.name = function () {
      var s = this.next();
      while (!this.isEOT() && this.isName(this.c())) {
        s += this.next();
      }
      return new Token(TK.NM, s);
    };
    P.token = function () {
      return this.token_;
    }
    P.nextToken = function () {
      this.skipSpace();
      if (this.isEOT()) {
        throw new SyntaxError("No more tokens");
      }
      var c = this.c();
      var t = null;
      if (this.isLt(c)) {
        t = new Token(TK.LT, this.next());
      } else if (this.isGt(c)) {
        t = new Token(TK.GT, this.next());
      } else if (this.isSlash(c)) {
        t = new Token(TK.SL, this.next());
      } else if (this.isEq(c)) {
        t = new Token(TK.EQ, this.next());
      } else if (this.isSq(c)) {
        t = this.singleQuote();
      } else if (this.isDq(c)) {
        t = this.doubleQuote();
      } else if (this.isNameStart(c)) {
        t = this.name();
      } else {
        throw new SyntaxError("Unexpected character:'" + c + "'");
      }
      this.token_ = t;
      return t;
    }
  })(QuHtmlParser.TagLexer.prototype);

  // Node Kind
  var NK = {
    BDY: 1,
    TAG: 2,
  };

  var Tag = QuHtmlParser.Tag = function Tag(name, attrs, isEnd, isSingle, children, lv) {
    this.kind = NK.TAG;
    this.name = name;
    this.attrs = attrs;
    this.isEnd = isEnd;
    this.isSingle = isSingle;
    this.children = children;
    this.lv = lv;
  };
  Tag.prototype = Object.create(Object.prototype);
  Tag.prototype.constructor = Tag;

  var Body = function Body(text, lv) {
    this.kind = NK.BDY;
    this.text = text;
    this.lv = lv;
  }  
  QuHtmlParser.Body = Body;

  QuDOM.QuHtmlParser = QuHtmlParser;

  return QuDOM;
});
