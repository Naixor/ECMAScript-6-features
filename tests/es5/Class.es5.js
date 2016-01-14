$traceurRuntime.options.symbols = true;
var Car = function Car(name) {
  "use strict";
  this.name = name;
};
($traceurRuntime.createClass)(Car, {printName: function() {
    "use strict";
    console.log("im a Car, my name is " + this.name);
  }}, {defaultPro: function() {
    "use strict";
    console.log("Car");
  }});
var Benz = function Benz(name) {
  "use strict";
  $traceurRuntime.superConstructor($Benz).call(this, name);
};
var $Benz = Benz;
($traceurRuntime.createClass)(Benz, {printName: function() {
    "use strict";
    console.log("im a Benz Car, my name is " + this.name);
  }}, {}, Car);
var a = new Car("a");
a.printName();
Car.defaultPro();
var b = new Benz("b");
b.printName();
Benz.defaultPro();
