{
	console.log("𠮷".length);

	// console.log("𠮷".match(/./u)[0].length);

	// console.log("\u{20BB7}");
	console.log("\uD842\uDFB7");

	console.log("𠮷".codePointAt(0)); // 134071
	console.log("𠮷".codePointAt(1)); // 57271


	for(var c of "𠮷") {
	  console.log(c);
	}
}