// require( ["main/entropy"/*, "main/szpion"*/], function(Entropy/*, Szpion*/) {
	// "use strict";

import {Entropy} from "./main/entropy.js";
import {Szpion} from "./main/szpion.js";

let params = (new URL(String(document.location))).searchParams;
let isSzpion = params.has('szpion');

if (isSzpion) {
	new Szpion(document.querySelector('.szpion-container'));
} else {
	new Entropy(document.querySelector('.entropy-container'));
}

// });
