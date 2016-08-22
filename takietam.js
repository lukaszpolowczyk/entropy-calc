
var probability;
var number;
var base;

var probabilityEl = document.querySelector('.probability');
var numberEl = document.querySelector('.number');
var baseEl = document.querySelector('.base');

probability = probabilityEl.value;
//number = numberEl.value;
base = baseEl.value;

fnCount();

function round (number, accuracy) {
	var l = Math.pow(10, accuracy);
	return Math.round(number*l)/l;
}

function log (base, number) {
	//				var numberLn = BigNumber(Math.log(number));
	//				var baseLn = BigNumber(Math.log(base));
	//				return numberLn.div(baseLn);
	return Math.log(number)/Math.log(base);
}


function fnCount () {
	var activeResultEl = document.querySelector('.active-result');
	var miaranieoEl = document.querySelector('.miaranieo');

	var test = probability.split("/");
	if(test.length==2) {
		probability = test[0]/test[1];
	}

	if (1 < probability && probability <0) {
		miaranieoEl.innerHTML = `błędne dane`;
		return false;
	}

	var result = (probability*-1)*log(base, probability);
	result = round(result, 2);
	miaranieoEl.innerHTML = `${result} - miara nieokreśloności`;


}

document.querySelector('.probability').addEventListener("input", (e)=>{
	probability = e.target.value;
	fnCount();
});
document.querySelector('.number').addEventListener("input", (e)=>{
	number = e.target.value;
	fnCount();
});
baseEl.addEventListener("input", (e)=>{
	base = e.target.value;
	fnCount();
});

// activeResultEl.innerHTML = `${result} entropia, liczba informacji`;

//
//@M4ks: Wydaje mi się że obliczanie np. tych logarytmów będę miał zaburzone.
//
//log2(1/3) = -1.5849625007211563
//normalnie:
//2^-1.5849625007211563 = 0.33333333333
//a przy zaokrągleniu do dwóch po przecinku:
//2^-1.58 = 0.33448188869
//0.33448188869*3 = 
//
//	log(2, 1/3)
////-1.5849625007211563
//round(-1.5849625007211563, 2)
////-1.58
//Math.pow(2,-1.58)
////0.334481888696528
//round(0.334481888696528, 2)
////0.33
//log(2, 0.33)
////-1.5994620704162712
//round(-1.5994620704162712, 2)
////-1.6
//Math.pow(2, -1.6)
////0.32987697769322355
//round(0.32987697769322355, 2)
////0.33
