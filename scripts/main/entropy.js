// define(["libs/libs", "main/random-event", "main/formula", "main/pointers-layer"], function(libs, RandomEvent, Formula, PointersLayer) {
	// "use strict";
	
	import * as libs from "../libs/libs.js"
	import { loadCSSURL } from "../libs/loadcss.js";
	import {RandomEvent} from "../main/random-event.js"
	import {Formula} from "../main/formula.js"
	import {PointersLayer} from "../main/pointers-layer.js"

	export function Entropy (containerEl) {
		containerEl.removeAttribute("hidden");
		loadCSSURL("style/entropy.css");
		loadCSSURL("style/pointers-layer.css");
		
		this.constructor(containerEl);
	}

	Entropy.prototype.constructor = function (containerEl) {
		this.fieldsEl = libs.tempEl("fields");

		containerEl.appendChild(this.fieldsEl);
		this.randomEventsObs = [];
		this.randomEventsEl = this.fieldsEl.querySelector('.random-events');

		this.numberEl = this.fieldsEl.querySelector('input.number');
		this.baseEl = this.fieldsEl.querySelector('input.base');
		this.entropyEl = this.fieldsEl.querySelector('.entropy');
		this.maxEntropyEl = this.fieldsEl.querySelector('.max-entropy');
		this.homeostatisEntropyEl = this.fieldsEl.querySelector('span.homeostasis-entropy');
		this.stepEl = this.fieldsEl.querySelector('.step');

//		this.number;
//		this.base;
//		this.equalVal;
		//this.entropy;
		this.countRound = 6;
		this.displayRound = 4;

		this.equalEventsObs = [];

		this.number = 1;
		this.numberEl.value = `${this.number}`;

		this.defBaseValue = 2;
		this.base = this.defBaseValue;
		this.baseEl.value = "";
		this.baseEl.setAttribute("placeholder", `[${this.defBaseValue}]`);

		this.baseEl.addEventListener("input", (e)=> {
			/** @type {HTMLInputElement} */
			const inputEl = (e.target);
			
			var value = inputEl.value;

			if (value === "") {
				this.baseEl.setAttribute("placeholder", `[${this.defBaseValue}]`);
				this.base = 2;
				this.baseEl.removeAttribute("data-incorrect-value");
			} else {
				this.baseEl.removeAttribute("placeholder");

				var test = value.split("/");
				if (test.length===2) {
					this.base = Number(test[0])/Number(test[1]);
				} else {
					this.base = Number(value);//value*1;
				}
				if (this.base > 1) {
					this.baseEl.removeAttribute("data-incorrect-value");
				} else {
					this.baseEl.setAttribute("data-incorrect-value", "");
				}
			}

			this.numberCount();

			this.randomEventsObs.forEach( (randomEvent)=> {
				randomEvent.count();
			});
		});

		this.numberEl.addEventListener("change", ()=> {
			var nElV = Number(this.numberEl.value);
			if (nElV !== this.noZeroEventsObsLength) {
				this.numberEl.setAttribute("title", "Wartość niezapisana, [Enter] - zatwierdź wartość");
				this.numberEl.setAttribute("style", "color: rgb(249, 181, 44); font-weight: bold; border-bottom-color: rgb(249, 181, 44)");
			}
		});
		this.numberEl.addEventListener("input", ()=> {
			var nElV = Number(this.numberEl.value);
			if (nElV !== this.noZeroEventsObsLength) {
				this.numberEl.setAttribute("title", "Wartość niezapisana, [Enter] - zatwierdź wartość");
				this.numberEl.setAttribute("style", "color: rgb(249, 181, 44); font-weight: bold; border-bottom-color: rgb(249, 181, 44)");
			}
		});
		this.numberEl.addEventListener("keydown", (e)=> {
			if (e.code === "Enter") {
				var numberVal = Number(this.numberEl.value);
				var restNumberVal = numberVal - this.noZeroEventsObsLength;

				for (var i = 1; i<=restNumberVal; i++) {
					var newRandomEvent = new RandomEvent(this);
					this.randomEventsObs.push(newRandomEvent);
					this.noZeroEventsObs.push(newRandomEvent);
					this.randomEventsEl.appendChild(newRandomEvent.randomEventEl);
				}

				for (var ix = numberVal-restNumberVal-1; ix>=numberVal; ix--) {
					//let newRandomEvent = new RandomEvent(this);
					var oldRandomEvent = this.noZeroEventsObs[ix];
					this.noZeroEventsObs.splice(ix, 1);

					var index = this.randomEventsObs.indexOf(oldRandomEvent);
					this.randomEventsObs.splice(index, 1);

					this.randomEventsEl.removeChild(oldRandomEvent.randomEventEl);
				}
				this.numberCount();
				this.numberEl.removeAttribute("title");
				this.numberEl.removeAttribute("style");
			}
		});

		this.randomEventsObs.push(new RandomEvent(this));

		this.randomEventsObs.forEach( (randomEvent)=> {
			this.randomEventsEl.appendChild(randomEvent.randomEventEl);
		});

		this.numberCount();
		
		//var indeterminacyFormula = new Formula(this, "indeterminacy-formula", "log-base", "event");
		// var pointersLayer = new PointersLayer(this.fieldsEl);
		
		// pointersLayer.createPointer(indeterminacyFormula.eventEl);
	};


	Entropy.prototype.numberCount = function () {
		var normalRandomEvents = this.randomEventsObs.filter( (randomEvent)=> {
			if (randomEvent.equalValue === false) {
				return true;
			}
		});

		var normalRandomEventsVal = normalRandomEvents.reduce((prevVal, randomEvent)=> {
			return prevVal + randomEvent.probability;
		}, 0);

		this.equalEventsObs = this.randomEventsObs.filter( (randomEvent)=> {
			if (randomEvent.equalValue) {
				return true;
			}
		});

		var equalEventsObsLength = this.equalEventsObs.length;

		var restVal = 1 - normalRandomEventsVal;
		restVal = libs.round(restVal, this.countRound);

		if (restVal < 0) {
			this.fieldsEl.setAttribute("data-bad-data", "");
			this.fieldsEl.querySelector('.limit-exceeded').innerHTML = `Przekroczono limit prawdopodobieństw o ${-1*restVal}. Spodziewaj się nieprawidłowych rezultatów wszędzie.`;
		} else
			if (restVal === 0) {
				this.fieldsEl.removeAttribute("data-bad-data");
				this.fieldsEl.querySelector('.limit-exceeded').innerHTML = `Pełne prawdopodobieństwo wynosi 1 (zostało ${restVal}, ${equalEventsObsLength}x${restVal/equalEventsObsLength})`;
				//		// usuń puste bo niepotrzebne
				//		this.equalEventsObs = this.equalEventsObs.filter((randomEvent)=> {
				//			if (randomEvent.description === "") {
				//				randomEvent.randomEventEl.parentElement.removeChild(randomEvent.randomEventEl);
				//
				//				var i = this.randomEventsObs.indexOf(randomEvent);
				//
				//				this.randomEventsObs.splice(i, 1);
				//			} else {
				//				return true;
				//			}
				//		});
				//
				//		equalEventsObsLength = this.equalEventsObs.length;

			} else
				if (restVal > 0 && restVal <= 1) {
					// co najmniej jeden pusty

					if (equalEventsObsLength < 1) {
						var oneEmptyRandomEvent = new RandomEvent(this);
						this.randomEventsObs.push(oneEmptyRandomEvent);
						this.equalEventsObs.push(oneEmptyRandomEvent);
						this.randomEventsEl.appendChild(oneEmptyRandomEvent.randomEventEl);
						equalEventsObsLength = 1;
					}

					this.fieldsEl.removeAttribute("data-bad-data");
					this.fieldsEl.querySelector('.limit-exceeded').innerHTML = `Pełne prawdopodobieństwo wynosi 1 (zostało ${restVal}, ${equalEventsObsLength}x${restVal/equalEventsObsLength})`;


				} else {
					this.fieldsEl.setAttribute("data-bad-data", "");
					this.fieldsEl.querySelector('.limit-exceeded').innerHTML = `Nieprawidłowe dane. Spodziewaj się nieprawidłowych rezultatów wszędzie.`;
				}
		// i rozdzielić prawdopodobieństwa
		this.equalVal = libs.round(restVal/equalEventsObsLength, this.countRound);

		this.equalEventsObs.forEach( (randomEvent)=> {
			var probability = this.equalVal;
			randomEvent.probability = probability;
			var result;
			if (probability === 0) {
				result = 0;
				randomEvent.measureUncertaintyEl.innerHTML = `nieokreśloność: ${result}, zdarzenie niemożliwe`;
			} else if (probability === 1) {
				result = 0;
				randomEvent.measureUncertaintyEl.innerHTML = `nieokreśloność: ${result}, zdarzenie pewne`;
			} else {
				result = libs.indeterminacy(probability, this.base);
				result = libs.round(result, this.displayRound);
				randomEvent.measureUncertaintyEl.innerHTML = `nieokreśloność: ${result}`;
			}
			randomEvent.measureUncertainty = result;
			randomEvent.inputEl.removeAttribute("data-incorrect-value");
			randomEvent.inputEl.setAttribute("placeholder", `[${probability}]`);
		});


		this.entropy = this.randomEventsObs.reduce((prevVal, randomEvent)=> {
			return prevVal + randomEvent.measureUncertainty;
		}, 0);
		this.entropy = libs.round(this.entropy, this.displayRound);

		this.entropyEl.innerHTML = this.entropy;

		this.noZeroEventsObs = this.randomEventsObs.filter((randomEvent)=>{
			return randomEvent.probability !== 0;
		});
		this.noZeroEventsObsLength = this.noZeroEventsObs.length;

		this.number = this.noZeroEventsObsLength;
		this.numberEl.value = `${this.number}`;

		var maxEntropy = libs.round(libs.indeterminacy(1/this.noZeroEventsObsLength, this.base), this.displayRound)*this.noZeroEventsObsLength;
		maxEntropy = libs.round(maxEntropy, this.displayRound);

		this.maxEntropyEl.innerHTML = `${maxEntropy}`;
		this.homeostatisEntropyEl.innerHTML = `${maxEntropy/2}`;
		if (this.entropy >  maxEntropy/2) this.homeostatisEntropyEl.style.color = "green";
		if (this.entropy ==  maxEntropy/2) this.homeostatisEntropyEl.style.color = "blue";
		if (this.entropy <  maxEntropy/2) this.homeostatisEntropyEl.style.color = "red";
	};


	
	
	

	// bug: gdy .000001
	// wpisać maksymalną entropię i może procent entropii
	// liczba zdarzeń
	// opcja ustawienia zaokrąglenia i info o floating point przy tym i zalecane max zaokrąglenie
	// dodawanie kolejnych paneli
	// łączenie paneli w wykres
	// charts
	// zwijanie charts, zwijanie listy zdarzeń losowych
	// przycisk zapisz do json


	// przycisk "Tryb nauki" - To jest nauki o Entropii i Ilosci informacji a nie obsługi tego programu. jak klikniesz to pojawiają się dodatkowe informacje (wzory, szersze opisy), oraz przycisk "Start/Następne" - który przeprowadza przez krótki kurs omawiający wszystko zgodnie z lekcją "Pojęcie Entropii", z przykładami (sam się załaduje albo każe go załadować "uczniowi"), opisy w tooltip-ach, zakreślenie omawianych elementów itd.


	// return Entropy;

// });
