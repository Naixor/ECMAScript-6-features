{
	var Iterator = function(val) {
		let proto = Object.create(null);
		proto[Symbol.iterator] = {
			enumerable: true,
		    configurable: true,
			value: function() {
				var cur = this;
				return {
					next: function() {
						if (!!cur) {
							let value = cur.value;
							cur = cur.next;
							return {
								value: value,
								done: false
							}
						}else {
							return {
								done: true
							}
						}
					}
				}
			}
		};
		let __proto__ = Object.create({}, proto);
		return Object.create(__proto__, {
			value: {
				enumerable: true,
			    configurable: true,
				value: val
			},
			next: {
				writable: true,
				enumerable: true,
			    configurable: true,
				value: null
			}
		});
	}
	let a = Iterator(0), b = Iterator(1), c = Iterator(2);
	a.next = b; 
	b.next = c ;
	c.next = null;

	for (var i of a) {
		console.log(i)
	}
} {
	var Iterator = function(val){
		this.val = val;
		this.next = null;
	}
	Iterator.prototype[Symbol.iterator] = function(){
		let cur = this;
		return {
			next: function(){
				if (!!cur) {
					let value = cur.val;
					cur = cur.next;
					return {
						value: value,
						done: false
					}
				}else {
					return {
						done: true
					}
				}
			}
		}
	}
	let a = new Iterator(0), b = new Iterator(1), c = new Iterator(2);
	a.next = b; 
	b.next = c ;
	c.next = null;

	for (var i of a) {
		console.log(i)
	}
} {
	let arr = [0, 1, 2, 3, 4, 5, 6, 7];
	for (let i of arr) {
		console.log(i);
	}
	// output: 0 1 2 3 4 5 6 7
	let str = "01234567";
	for (let i of str) {
		console.log(i);
	}
	// output: 0 1 2 3 4 5 6 7
	let set = new Set([0, 1, 2, 3, 4, 5, 6, 7]);
	for (let i of set) {
		console.log(i);
	}
	// output: 0 1 2 3 4 5 6 7
	let map = new Map([
		[0, 0],
		[1, 1],
		[2, 2],
		[3, 3],
		[4, 4],
		[5, 5],
		[6, 6],
		[7, 7]
	]);
	for (let i of map.values()) {
		console.log(i);
	}
	// output: 0 1 2 3 4 5 6 7
	for (let i of map.keys()) {
		console.log(i);
	}
	// output: 0 1 2 3 4 5 6 7
} {
	let arr = [0, 1, 2, 3, 4, 5, 6, 7];
	arr[Symbol.iterator] = function() {
		let self = this;
		let index = 0;
		return {
			next: function() {
				return {
					done: index === self.length ? true : false,
					value: self[index++]
				}
			}
		}
	}
	for (let i of arr) {
		console.log(i)
	}
} {
	let arr = [0, 1, 2, 3, 4, 5, 6, 7];
	arr[Symbol.iterator] = function() {
		let self = this;
		let index = 0;
		let pre = 0,
			value = 0;
		return {
			next: function() {
				let done = index === self.length;
				if (!done) {
					let tmp = self[index++];
					value = pre + tmp;
					pre = value;
					return {
						value: value,
						done: done
					}
				} else {
					return {
						done: done
					}
				}
			}
		}
	}
	for (let i of arr) {
		console.log(i)
	}
} {
	// 或者这里还可以修改Array本身迭代器的@@iterator
	Array.prototype[Symbol.iterator] = function() {
		let self = this;
		let index = 0;
		let pre = 0,
			value = 0;
		return {
			next: function() {
				let done = index === self.length;
				if (!done) {
					let tmp = self[index++];
					value = pre + tmp;
					pre = value;
					return {
						value: value,
						done: done
					}
				} else {
					return {
						done: done
					}
				}
			}
		}
	}
	let arr = [0, 1, 2, 3, 4, 5, 6, 7];
	for (let i of arr) {
		console.log(i)
	}
	// output: 0 1 3 6 10 15 21 28 
}