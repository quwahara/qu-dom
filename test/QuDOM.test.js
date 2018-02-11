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
