var $create = Object.create;
var $defineProperty = Object.defineProperty;
var $isExtensible = Object.isExtensible;
var $freeze = Object.freeze;

function isShimSymbol(symbol) {
    return typeof symbol === 'object' && symbol instanceof SymbolValue;
}

function toProperty(name) {
    if (isShimSymbol(name))
        return name[symbolInternalProperty];
    return name;
}

var counter = 0;
function newUniqueString() {
    return '__$' + Math.floor(Math.random() * 1e9) + '$' + ++counter + '$__';
}
function nonEnum(value) {
    return {
        configurable: true,
        enumerable: false,
        value: value,
        writable: true
    };
}

var privateNames = $create(null)

function createPrivateName() {
    var s = newUniqueString();
    privateNames[s] = true;
    return s;
}

var hashCounter = 0;
var hashProperty = createPrivateName();
var hashPropertyDescriptor = {value: undefined};
var hashObjectProperties = {
    hash: {value: undefined},
    self: {value: undefined}
};
function getOwnHashObject(object) {
    var hashObject = object[hashProperty];
    if (hashObject && hashObject.self === object)
        return hashObject;
    if ($isExtensible(object)) {
        hashObjectProperties.hash.value = hashCounter++;
        hashObjectProperties.self.value = object;
        hashPropertyDescriptor.value = $create(null, hashObjectProperties);
        $defineProperty(object, hashProperty, hashPropertyDescriptor);
        return hashPropertyDescriptor.value;
    }
    return undefined;
}
function freeze(object) {
    getOwnHashObject(object);
    return $freeze.apply(this, arguments);
}

var symbolInternalProperty = newUniqueString();
var symbolDescriptionProperty = newUniqueString();
var symbolDataProperty = newUniqueString();
var symbolValues = $create(null);

function Symbol(description) {
    var value = new SymbolValue(description);
    if (!(this instanceof Symbol))
       return value;
    throw new TypeError('Symbol cannot be new\'ed');
}
$defineProperty(Symbol.prototype, 'constructor', nonEnum(Symbol));
$defineProperty(Symbol.prototype, 'toString', nonEnum(function() {
    var symbolValue = this[symbolDataProperty];
    return symbolValue[symbolInternalProperty];
}));
$defineProperty(Symbol.prototype, 'valueOf', nonEnum(function() {
    var symbolValue = this[symbolDataProperty];
    if (!symbolValue)
        throw TypeError('Conversion from symbol to string');
    if (!getOption('symbols'))
        return symbolValue[symbolInternalProperty];
    return symbolValue;
}));

function SymbolValue(description) {
    var key = newUniqueString();
    $defineProperty(this, symbolDataProperty, {
        value: this
    });
    $defineProperty(this, symbolInternalProperty, {
        value: key
    });
    $defineProperty(this, symbolDescriptionProperty, {
        value: description
    });
    freeze(this);
    symbolValues[key] = this;
}
$defineProperty(SymbolValue.prototype, 'constructor', nonEnum(Symbol));
$defineProperty(SymbolValue.prototype, 'toString', {
    value: Symbol.prototype.toString,
    enumerable: false
});
$defineProperty(SymbolValue.prototype, 'valueOf', {
    value: Symbol.prototype.valueOf,
    enumerable: false
});