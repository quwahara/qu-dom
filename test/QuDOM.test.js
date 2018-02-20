var test = require('tape');
var QuDOM = require('../QuDOM');

test('QuDOM.HTMLInputElement.addEventListener', function (t) {
  var document = new QuDOM.Document();
  var input = document.createElement("input");
  document.body.appendChild(input);
  var expc = "v";
  input.addEventListener("change", function (event) {
    t.equal(event.target.value, expc);
  });
  input.value = expc;
  t.end();
});

test('QuDOM.HTMLElement.innerHTML', function (t) {
  var document = new QuDOM.Document();
  // document.body.innerHTML = '<span a1="v1" a2="v2" a3="v3"></span>';
  document.body.innerHTML = '<span a1="v1">a<span a2="v2">b</span>c</span>';
  console.log(document.body.toString());

  t.end();
});
