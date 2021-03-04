// define( function() {
	// "use strict";

	export function tempEl (tempId) {
		if ("content" in document.createElement("template")) {
			
			
			/** @type {HTMLTemplateElement} */
			var t = (document.querySelector("template#"+tempId));

			var cloneTemp = document.importNode(t.content, true);

			return cloneTemp.querySelector("."+tempId);
		}
	}
	
	export function tempElString (tempId, string) {
		var tempEl = document.createElement("template");
		tempEl.innerHTML = string;
		
		
		/** @type {HTMLDivElement} */
		const el = (document.importNode(tempEl.content, true).querySelector("div."+tempId));
		return el;
	}

	export function round (number, accuracy) {
		var l = Math.pow(10, accuracy);
		return Math.round(number*l)/l;
	}

	export function log (base, number) {
		return Math.log(number)/Math.log(base);
	}

	export function indeterminacy (probability, base) {
		return probability*-1*log(base, probability);
	}

	// return {
	// 	tempEl: tempEl,
	// 	tempElString: tempElString,
	// 	round: round,
	// 	log: log,
	// 	indeterminacy: indeterminacy
	// };

// });
