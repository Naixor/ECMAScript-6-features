(() => {
    'use strict';
    let wm = new WeakMap();
    let obj1 = {};
    let obj2 = {
        name: 'obj2'
    };
    // WeakMap按照内存位置作为索引, 并且以对象为key
    wm.set({}, 0);
    wm.get({}); // undefined
    wm.has({}); // false
    console.log(wm); // WeakMap {Object {} => 0}

    wm.set(obj1, 1);
    wm.get(obj1); // 1
    wm.has(obj1); // true
    console.log(wm); // WeakMap {Object {} => 0, Object {} => 1}

    wm.set(obj2, 2);
    obj1.name = 'obj2';
    wm.get(obj1); // 1
    console.log(wm); // WeakMap {Object {name: "obj2"} => 1, Object {name: "obj2"} => 2, Object {} => 0}

    delete obj2.name;
    obj1 = obj2;
    wm.get(obj1) === wm.get(obj2); // true
    console.log(wm); // WeakMap {Object {name: "obj2"} => 1, Object {} => 2, Object {} => 0}

    obj1 = {};
    wm.has(obj1); // false

    wm.set(wm, wm);
    console.log(wm.get(wm).get(wm) === wm);

    var ws = new WeakSet();
    ws.add({});
    console.log(ws.size);
})();
