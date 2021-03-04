// define(["libs/libs"], function(libs) {
// 	"use strict";

import * as libs from "../libs/libs.js";

	export function Formula (entropy, id, logBase, event) {
		this.entropy = entropy;
		this.id = id;
		this.logBase = logBase;
		this.event = event;
		
		this.formulaEl = this.entropy.fieldsEl.querySelector(`.${this.id}`);
		this.logBaseEl = this.entropy.fieldsEl.querySelector(`.${this.logBase}`);
		this.eventEl = this.entropy.fieldsEl.querySelector(`.${this.event}`);
		
		//this.logBaseEl.setAttribute("style", "background-color: yellow");
		//this.logBaseEl.textContent = "2";
	}
	
	// return Formula;
	
// });
