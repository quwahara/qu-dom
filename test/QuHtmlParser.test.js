  console.log('hi');
var test = require('tape');
var QuHtmlParser = require('../QuDOM').QuHtmlParser;

test('QuHtmlParser.find', function (t) {
  var p = new QuHtmlParser();

  var r = p.find('<', '');
  t.notOk(r.found);
  t.equal(r.lead, '');
  t.equal(r.key, '<');
  t.equal(r.remain, '');

  var r = p.find('<', '.');
  t.notOk(r.found);
  t.equal(r.lead, '');
  t.equal(r.key, '<');
  t.equal(r.remain, '.');

  var r = p.find('<', '<');
  t.ok(r.found);
  t.equal(r.lead, '');
  t.equal(r.key, '<');
  t.equal(r.remain, '<');

  var r = p.find('<', '.<');
  t.ok(r.found);
  t.equal(r.lead, '.');
  t.equal(r.key, '<');
  t.equal(r.remain, '<');

  var r = p.find('<', '<,');
  t.ok(r.found);
  t.equal(r.lead, '');
  t.equal(r.key, '<');
  t.equal(r.remain, '<,');

  var r = p.find('<', '.<,');
  t.ok(r.found);
  t.equal(r.lead, '.');
  t.equal(r.key, '<');
  t.equal(r.remain, '<,');

  t.end();
});

test('QuHtmlParser.TagLexer.isXxx', function (t) {
  var l = new QuHtmlParser.TagLexer('');
  t.ok(l.isSpace(' '));
  t.notOk(l.isSpace('x'));
  
  t.ok(l.isNameStart('z'));
  t.ok(l.isNameStart('_'));
  t.ok(l.isNameStart('@'));
  t.ok(l.isNameStart('#'));
  t.ok(l.isNameStart('$'));
  t.ok(l.isNameStart('%'));
  t.ok(l.isNameStart('-'));
  t.ok(l.isNameStart('.'));

  t.notOk(l.isNameStart(' '));
  t.notOk(l.isNameStart('='));
  t.notOk(l.isNameStart('"'));
  t.notOk(l.isNameStart('\''));
  t.notOk(l.isNameStart('<'));
  t.notOk(l.isNameStart('>'));
  t.notOk(l.isNameStart('/'));
  t.notOk(l.isNameStart('&'));
  t.notOk(l.isNameStart(';'));

  t.ok(l.isName('0'));

  t.end();
});

test('QuHtmlParser.TagLexer.isXxx', function (t) {
  var l = new QuHtmlParser.TagLexer('');
  t.ok(l.isSpace(' '));
  t.notOk(l.isSpace('x'));
  
  t.ok(l.isNameStart('z'));
  t.ok(l.isNameStart('_'));
  t.ok(l.isNameStart('@'));
  t.ok(l.isNameStart('#'));
  t.ok(l.isNameStart('$'));
  t.ok(l.isNameStart('%'));
  t.ok(l.isNameStart('-'));
  t.ok(l.isNameStart('.'));

  t.notOk(l.isNameStart(' '));
  t.notOk(l.isNameStart('='));
  t.notOk(l.isNameStart('"'));
  t.notOk(l.isNameStart('\''));
  t.notOk(l.isNameStart('<'));
  t.notOk(l.isNameStart('>'));
  t.notOk(l.isNameStart('/'));
  t.notOk(l.isNameStart('&'));
  t.notOk(l.isNameStart(';'));

  t.ok(l.isName('0'));

  t.end();
});

test('QuHtmlParser.TagLexer.skipSpace', function (t) {
  var text, l;

  text = '';
  l = new QuHtmlParser.TagLexer(text);
  l.skipSpace();
  t.ok(l.isEOT());
  t.equal(l.i, text.length);

  text = ' ';
  l = new QuHtmlParser.TagLexer(text);
  l.skipSpace();
  t.ok(l.isEOT());
  t.equal(l.i, text.length);

  text = '  ';
  l = new QuHtmlParser.TagLexer(text);
  l.skipSpace();
  t.ok(l.isEOT());
  t.equal(l.i, text.length);

  t.end();
});

test('QuHtmlParser.TagLexer.nextToken', function (t) {
  var text, l;

  text = '<tag a="A" b=\'B\' c="あ" />';
  l = new QuHtmlParser.TagLexer(text);
  t.equal(l.nextToken().text, '<');
  t.equal(l.nextToken().text, 'tag');
  t.equal(l.nextToken().text, 'a');
  t.equal(l.nextToken().text, '=');
  t.equal(l.nextToken().text, '"A"');
  t.equal(l.nextToken().text, 'b');
  t.equal(l.nextToken().text, '=');
  t.equal(l.nextToken().text, '\'B\'');
  t.equal(l.nextToken().text, 'c');
  t.equal(l.nextToken().text, '=');
  t.equal(l.nextToken().text, '"あ"');
  t.equal(l.nextToken().text, '/');
  t.equal(l.nextToken().text, '>');

  t.end();
});

test('QuHtmlParser.parseTag', { skip: false }, function (t) {
  var p = new QuHtmlParser();
  var T = QuHtmlParser.Tag;

  t.throws(function () { p.parseTag('', 0); });
  t.throws(function () { p.parseTag('<', 0); });
  t.throws(function () { p.parseTag('<name', 0); });
  t.deepLooseEqual(p.parseTag('<name>', 0), new T('name', [], false, false, null, 0));
  t.deepLooseEqual(p.parseTag('</name>', 0), new T('name', [], true, false, null, 0));
  t.deepLooseEqual(p.parseTag('<name/>', 0), new T('name', [], false, true, null, 0));
  t.throws(function () { p.parseTag('</name/>', 0); });
  t.throws(function () { p.parseTag('<name a', 0); });
  t.deepLooseEqual(p.parseTag('<name a>', 0), new T('name', [{name: 'a'}], false, false, null, 0));
  t.throws(function () { p.parseTag('<name a=', 0); });
  t.throws(function () { p.parseTag('<name a=>', 0); });
  t.deepLooseEqual(p.parseTag('<name a="A">', 0), new T('name', [{name: 'a', value: 'A'}], false, false, null, 0));
  t.deepLooseEqual(p.parseTag('<name a="A" b>', 0), new T('name', [{name: 'a', value: 'A'}, {name: 'b'}], false, false, null, 0));
  t.throws(function () { p.parseTag('<name a="A" b=>', 0); });
  t.deepLooseEqual(p.parseTag('<name a="A" b=\'B\'>', 0), new T('name', [{name: 'a', value: 'A'}, {name: 'b', value: 'B'}], false, false, null, 0));
  t.throws(function () { p.parseTag('</name a>', 0); });

  t.end();
});

test('QuHtmlParser.parseHTML', { skip: false }, function (t) {
  var P = QuHtmlParser;
  var B = QuHtmlParser.Body;
  var T = QuHtmlParser.Tag;

  t.deepLooseEqual(new P('<a></a>').parseHTML(), [new T('a', [], false, false, null, 0)]);
  t.deepLooseEqual(new P('x<a>y</a>z').parseHTML(), [
    new B('x', 0),
    new T('a', [], false, false, [
      new B('y', 1),
    ], 0),
    new B('z', 0),
  ]);
  t.deepLooseEqual(new P('<a></a><b></b>').parseHTML(), [
    new T('a', [], false, false, null, 0),
    new T('b', [], false, false, null, 0),
  ]);
  t.deepLooseEqual(new P('1<a>2<b>3</b>4</a>5').parseHTML(), [
    new B('1', 0),
    new T('a', [], false, false, [
      new B('2', 1),
      new T('b', [], false, false, [
        new B('3', 2),
      ], 1),
      new B('4', 1),
    ], 0),
    new B('5', 0),
  ]);

  t.end();
});
