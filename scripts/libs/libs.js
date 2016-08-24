define( function() {
	"use strict";

	function tempEl (tempId) {
		if ("content" in document.createElement("template")) {

			var t = document.querySelector("#"+tempId);

			var cloneTemp = document.importNode(t.content, true);

			return cloneTemp.querySelector("."+tempId);
		}
	}

	function round (number, accuracy) {
		var l = Math.pow(10, accuracy);
		return Math.round(number*l)/l;
	}

	function log (base, number) {
		return Math.log(number)/Math.log(base);
	}

	function indeterminacy (probability, base) {
		return probability*-1*log(base, probability);
	}

	return {
		tempEl: tempEl,
		round: round,
		log: log,
		indeterminacy: indeterminacy
	};

});
