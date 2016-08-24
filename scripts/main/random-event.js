define(["libs/libs"], function(libs) {
	"use strict";

	function RandomEvent (entropy) {
		this.entropy = entropy;

//		this.randomEventEl;
//		this.inputEl;
//		this.descriptionEl;
//		this.measureUncertaintyEl;
//
//		this.probability;

		this.constructor();
	}

	RandomEvent.prototype.constructor = function () {
		this.randomEventEl = libs.tempEl("random-event");
		this.inputEl = this.randomEventEl.querySelector(".probability");
		this.descriptionEl = this.randomEventEl.querySelector(".description");
		this.measureUncertaintyEl = this.randomEventEl.querySelector(".measure-uncertainty");

		this.inputEl.value = "";
		this.probability = 1; // 1 - def value for one randomEvent
		this.measureUncertainty = 0; // 0 - def value for one randomEvent
		this.equalValue = true;

		this.description = "";
		//this.count();

		this.inputEl.addEventListener("input", ()=> this.count());
		this.descriptionEl.addEventListener("input", ()=> {
			this.description = this.descriptionEl.value;
		});
	};

	RandomEvent.prototype.count = function () {
		var value = this.inputEl.value;
		if (value === "") {
			this.equalValue = true;
			this.inputEl.setAttribute("data-equal-value", "");
			this.entropy.numberCount();
			return false;
		} else
		if (value === " ") {
			value = "[ ]";
		}

		var probability;
		var test = value.split("/");
		if (test.length === 2) {
			probability = test[0]/test[1];
			this.probability = probability;
		} else {
			probability = Number(value);//value*1;
			this.probability = probability;
		}

		var result;

		if (isNaN(probability) || 1 < probability || probability < 0) {
			this.equalValue = false;
			result = libs.indeterminacy(probability, this.entropy.base);
			result = libs.round(result, this.entropy.displayRound);
			this.measureUncertainty = result;
			this.measureUncertaintyEl.innerHTML = `błędne dane`;
			this.inputEl.removeAttribute("data-equal-value");
			this.inputEl.setAttribute("data-incorrect-value", "");
			this.inputEl.removeAttribute("placeholder");
			this.entropy.numberCount();
			return false;
		} else
		if (probability === 1) {
			this.equalValue = false;
			this.measureUncertainty = 0;
			this.measureUncertaintyEl.innerHTML = `nieokreśloność: 0, wydarzenie pewne`;
			this.inputEl.removeAttribute("data-equal-value");
			this.inputEl.removeAttribute("data-incorrect-value");
			this.inputEl.removeAttribute("placeholder");
		} else
		if (probability === 0) {
			this.equalValue = false;
			this.measureUncertainty = 0;
			this.measureUncertaintyEl.innerHTML = `nieokreśloność: ${this.measureUncertainty}, wydarzenie niemożliwe`;
			this.inputEl.removeAttribute("data-equal-value");
			this.inputEl.removeAttribute("data-incorrect-value");
			this.inputEl.removeAttribute("placeholder");
		} else
		if (probability > 0 && probability < 1) {
			this.equalValue = false;
			result = libs.indeterminacy(probability, this.entropy.base);
			result = libs.round(result, this.entropy.displayRound);
			this.measureUncertainty = result;
			this.measureUncertaintyEl.innerHTML = `nieokreśloność: ${result}`;
			this.inputEl.removeAttribute("data-equal-value");
			this.inputEl.removeAttribute("data-incorrect-value");
			this.inputEl.removeAttribute("placeholder");
		}
		this.entropy.numberCount();

	};

	return RandomEvent;

});
