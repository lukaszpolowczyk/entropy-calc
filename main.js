var randomEventsObs = [];
var randomEventsEl = document.querySelector('.random-events');

var numberEl = document.querySelector('.number');
var baseEl = document.querySelector('.base');
var entropyEl = document.querySelector('.entropy');
var maxEntropyEl = document.querySelector('.max-entropy');

var number;
var base;
var equalVal;
var entropy;

var equalEventsObs = [];

number = 1;
numberEl.value = number;

var defBaseValue = 2;
base = defBaseValue;
baseEl.value = "";
baseEl.setAttribute("placeholder", `[${defBaseValue}]`);

baseEl.addEventListener("input", (e)=> {
	value = e.target.value;
	
	if (value === "") {
		baseEl.setAttribute("placeholder", `[${defBaseValue}]`);
		base = 2;
		baseEl.removeAttribute("data-incorrect-value");
	} else {
		baseEl.removeAttribute("placeholder");

		var test = value.split("/");
		if(test.length==2) {
			base = test[0]/test[1];
		} else {
			base = value*1;
		}
		if (base > 0) {
			baseEl.removeAttribute("data-incorrect-value");
		} else {
			baseEl.setAttribute("data-incorrect-value", "");
		}
	}

	numberCount();

	randomEventsObs.forEach( (randomEvent)=> {
		randomEvent.count();
	});
	
	// entropy function
});

randomEventsObs.push(new RandomEvent());

function numberCount () {
	var normalRandomEvents = randomEventsObs.filter( (randomEvent)=> {
		if (randomEvent.equalValue === false) {
			return true;
		}
	});

	var normalRandomEventsVal = normalRandomEvents.reduce((prevVal, randomEvent)=> {
		return prevVal + randomEvent.probability;
	}, 0);

	equalEventsObs = randomEventsObs.filter( (randomEvent)=> {
		if (randomEvent.equalValue) {
			return true;
		}
	});

	var equalEventsObsLength = equalEventsObs.length;

	var restVal = 1 - normalRandomEventsVal;
	restVal = round(restVal, 5);
	
	if(restVal < 0) {
		document.querySelector('.fields').setAttribute("data-bad-datas", "");
		document.querySelector('.limit-exceeded').innerHTML = `Przekroczono limit prawdopodobieństw o ${-1*restVal}. Spodziewaj się nieprawidłowych rezultatów wszędzie.`;
	} else
	if (restVal === 0) {
		document.querySelector('.fields').removeAttribute("data-bad-datas");
		document.querySelector('.limit-exceeded').innerHTML = `Pozostalo limitu prawdopodobieństwa: ${restVal}.`;
//		// usuń puste bo niepotrzebne
//		equalEventsObs = equalEventsObs.filter((randomEvent)=> {
//			if (randomEvent.description === "") {
//				randomEvent.randomEventEl.parentElement.removeChild(randomEvent.randomEventEl);
//
//				var i = randomEventsObs.indexOf(randomEvent);
//
//				randomEventsObs.splice(i, 1);
//			} else {
//				return true;
//			}
//		});
//		
//		equalEventsObsLength = equalEventsObs.length;
		
	} else
	if (restVal > 0 && restVal <= 1) {
		document.querySelector('.fields').removeAttribute("data-bad-datas");
		document.querySelector('.limit-exceeded').innerHTML = `Prawdopodobieństwo rozdzielone na puste: ${restVal}.`;
		// conajmniej jeden pusty
		
		if (equalEventsObsLength < 1) {
			var randomEvent = new RandomEvent();
			randomEventsObs.push(randomEvent);
			equalEventsObs.push(randomEvent);
			randomEventsEl.appendChild(randomEvent.randomEventEl);
			equalEventsObsLength = 1;
		}
		


		
	} else {
		document.querySelector('.fields').setAttribute("data-bad-datas", "");
		document.querySelector('.limit-exceeded').innerHTML = `Nieprawidłowe dane. Spodziewaj się nieprawidłowych rezultatów wszędzie.`;
	}
	// i rozdzielić prawdopodobieństwa
	equalVal = round(restVal/equalEventsObsLength, 5);

	equalEventsObs.forEach( (randomEvent)=> {
		probability = equalVal;
		randomEvent.probability = probability;
		if (probability === 0) {
			result = 0;
			randomEvent.measureUncertaintyEl.innerHTML = `nieokreśloność: ${result}, wydarzenie niemożliwe`;
		} else if (probability === 1) {
			result = 0;
			randomEvent.measureUncertaintyEl.innerHTML = `nieokreśloność: ${result}, wydarzenie pewne`;
		} else {
			var result = (probability*-1)*log(base, probability);
			result = round(result, 5);
			randomEvent.measureUncertaintyEl.innerHTML = `nieokreśloność: ${result}`;
		}
		randomEvent.measureUncertainty = result;
		randomEvent.inputEl.removeAttribute("data-incorrect-value");
		randomEvent.inputEl.setAttribute("placeholder", `[${probability}]`);
	});
	
	number = randomEventsObs.length;
	numberEl.value = number;
	
	entropy = randomEventsObs.reduce((prevVal, randomEvent)=> {
		return prevVal + randomEvent.measureUncertainty;
	}, 0);
	entropy = round(entropy, 5);
	
	entropyEl.innerHTML = entropy;
	
	var noZeroEventsObs = randomEventsObs.filter((randomEvent)=>{
		return randomEvent.probability !== 0;
	})
	var noZeroEventsObsLength = noZeroEventsObs.length;
	
	var maxEntropy = indeterminacy(1/noZeroEventsObsLength)*noZeroEventsObsLength;
	maxEntropy = round(maxEntropy, 5);
	
	maxEntropyEl.innerHTML = maxEntropy;
}


randomEventsObs.forEach( (randomEvent)=> {
	randomEventsEl.appendChild(randomEvent.randomEventEl);
});

numberCount();

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