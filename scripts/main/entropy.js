define(["libs/libs", "main/random-event"], function(libs, RandomEvent) {
	"use strict";

	function Entropy (containerEl) {
		this.constructor(containerEl);
	}

	Entropy.prototype.constructor = function (containerEl) {
		this.fieldsEl = libs.tempEl("fields");

		containerEl.appendChild(this.fieldsEl);
		this.randomEventsObs = [];
		this.randomEventsEl = this.fieldsEl.querySelector('.random-events');

		this.numberEl = this.fieldsEl.querySelector('.number');
		this.baseEl = this.fieldsEl.querySelector('.base');
		this.entropyEl = this.fieldsEl.querySelector('.entropy');
		this.maxEntropyEl = this.fieldsEl.querySelector('.max-entropy');

//		this.number;
//		this.base;
//		this.equalVal;
		//this.entropy;
		this.countRound = 4;
		this.displayRound = 3;

		this.equalEventsObs = [];

		this.number = 1;
		this.numberEl.value = this.number;

		this.defBaseValue = 2;
		this.base = this.defBaseValue;
		this.baseEl.value = "";
		this.baseEl.setAttribute("placeholder", `[${this.defBaseValue}]`);

		this.baseEl.addEventListener("input", (e)=> {
			var value = e.target.value;

			if (value === "") {
				this.baseEl.setAttribute("placeholder", `[${this.defBaseValue}]`);
				this.base = 2;
				this.baseEl.removeAttribute("data-incorrect-value");
			} else {
				this.baseEl.removeAttribute("placeholder");

				var test = value.split("/");
				if (test.length===2) {
					this.base = test[0]/test[1];
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

		this.randomEventsObs.push(new RandomEvent(this));

		this.randomEventsObs.forEach( (randomEvent)=> {
			this.randomEventsEl.appendChild(randomEvent.randomEventEl);
		});

		this.numberCount();
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
			this.fieldsEl.setAttribute("data-bad-datas", "");
			this.fieldsEl.querySelector('.limit-exceeded').innerHTML = `Przekroczono limit prawdopodobieństw o ${-1*restVal}. Spodziewaj się nieprawidłowych rezultatów wszędzie.`;
		} else
			if (restVal === 0) {
				this.fieldsEl.removeAttribute("data-bad-datas");
				this.fieldsEl.querySelector('.limit-exceeded').innerHTML = `Pozostalo limitu prawdopodobieństwa: ${restVal}.`;
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
					this.fieldsEl.removeAttribute("data-bad-datas");
					this.fieldsEl.querySelector('.limit-exceeded').innerHTML = `Prawdopodobieństwo rozdzielone na puste: ${restVal}.`;
					// conajmniej jeden pusty

					if (equalEventsObsLength < 1) {
						var oneEmptyRandomEvent = new RandomEvent(this);
						this.randomEventsObs.push(oneEmptyRandomEvent);
						this.equalEventsObs.push(oneEmptyRandomEvent);
						this.randomEventsEl.appendChild(oneEmptyRandomEvent.randomEventEl);
						equalEventsObsLength = 1;
					}




				} else {
					this.fieldsEl.setAttribute("data-bad-datas", "");
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
				randomEvent.measureUncertaintyEl.innerHTML = `nieokreśloność: ${result}, wydarzenie niemożliwe`;
			} else if (probability === 1) {
				result = 0;
				randomEvent.measureUncertaintyEl.innerHTML = `nieokreśloność: ${result}, wydarzenie pewne`;
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

		var noZeroEventsObs = this.randomEventsObs.filter((randomEvent)=>{
			return randomEvent.probability !== 0;
		});
		var noZeroEventsObsLength = noZeroEventsObs.length;

		this.number = noZeroEventsObsLength;
		this.numberEl.value = this.number;

		var maxEntropy = libs.indeterminacy(1/noZeroEventsObsLength, this.base)*noZeroEventsObsLength;
		maxEntropy = libs.round(maxEntropy, this.displayRound);

		this.maxEntropyEl.innerHTML = maxEntropy;
	};




	// bug: gdy .000001
	// wpisać maksymalną entropię i może procent entropii
	// liczba zdarzeń
	// opcja ustawienia zaokrąglenia i info o floating point przy tym i zalecane max zaokrąglenie
	// dodawanie kolejnych paneli
	// łączenie paneli w wykres
	// charts
	// zwijanie charts, zwijanie listy wydarzeń losowych
	// przycisk zapisz do json


	// przycisk "Tryb nauki" - To jest nauki o Entripii i Ilosci informacji a nie obsługi tego programu. jak klikniesz to pojawiają się dodatkowe informacje (wzory, szersze opisy), oraz przycisk "Start/Następne" - który przeprowadza przez krótki kurs omawiający wszystko zgodnie z lekcją "Pojęcie Entropii", z przykładami (sam się załaduje albo każe go załadować "uczniowi"), opisy w tooltipach, zakreślenie omawianych elementów itd.


	return Entropy;

});
