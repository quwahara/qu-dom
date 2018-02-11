(function(definition) {

  // CommonJS
  if (typeof exports === "object") {
    module.exports = definition();

    // RequireJS
  } else if (typeof define === "function" && define.amd) {
    define(definition);

    // <script>
  } else {
    QuHtmlParser = definition();
  }

})(function() {
  'use strict';

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

  var Tag = function Tag(name, attrs, isEnd, isSingle, children, lv) {
    this.kind = NK.TAG;
    this.name = name;
    this.attrs = attrs;
    this.isEnd = isEnd;
    this.isSingle = isSingle;
    this.children = children;
    this.lv = lv;
  }  
  QuHtmlParser.Tag = Tag;

  var Body = function Body(text, lv) {
    this.kind = NK.BDY;
    this.text = text;
    this.lv = lv;
  }  
  QuHtmlParser.Body = Body;

  return QuHtmlParser;
});
