$traceurRuntime.options.symbols = true;
var $__0 = Object.freeze(Object.defineProperties(["", "?code=js&city=", ""], {raw: {value: Object.freeze(["", "?code=js&city=", ""])}}));
console.log("Hello Template Strings!");
console.log("Hello\n\tTemplate\nStrings!");
var who = "Template Strings";
console.log(("Hello " + who + "!"));
function what() {
  return "Template Strings";
}
console.log(("Hello " + what() + "!"));
var which = {value: "Template Strings"};
console.log(("Hello " + which.value + "!"));
var url = "http://php.weather.sina.com.cn/iframe/index/w_cl.php";
var city = "北京";
GET($__0, url, city)(handler);
function GET(strArgs, url, city) {
  return function(handler) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', ("" + url + strArgs.join('') + city), false);
    xhr.onreadystatechange = handler.bind(xhr);
    xhr.send();
  };
}
function handler() {
  if (this.readyState === 4) {
    console.log(this.responseText);
  }
}
