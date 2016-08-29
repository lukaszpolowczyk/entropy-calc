define(["libs/libs", "main/question"], function(libs, Question) {
	"use strict";
	
	function Szpion (containerEl) {
		this.szpionEl = libs.tempEl("szpion");
		
		this.commonQuestionsEl = this.szpionEl.querySelector('.common-questions');
		this.foreignQuestionsEl = this.szpionEl.querySelector('.foreign-questions');

		this.commonQuestionsObs = [];
		this.foreignQuestionsObs = [];
		
		containerEl.appendChild(this.szpionEl);
		
		this.resultEl = this.szpionEl.querySelector(".result");
		
		this.addCommonQuestionButtonEl = this.szpionEl.querySelector(".add-common-question-button");
		this.addForeignQuestionButtonEl = this.szpionEl.querySelector(".add-foreigns-question-button");
		
		var leC = ()=> {
			var questionC = new Question(this);
			this.commonQuestionsObs.push(questionC);
			this.commonQuestionsEl.appendChild(questionC.questionEl);
		};
		var leF = ()=> {
			var questionF = new Question(this);
			this.foreignQuestionsObs.push(questionF);
			this.foreignQuestionsEl.appendChild(questionF.questionEl);
		};
		
		leC();
		leF();
		
		this.addCommonQuestionButtonEl.addEventListener("click", leC);
		this.addForeignQuestionButtonEl.addEventListener("click", leF);
		
		// wpisanie warości prawdopodobieństwa do każdego
		// mozliwoś zmieny prawdopodobieństw ręcznie
		
		this.count();
	}
	
	var questionsSideCount = function (questionsObs) {
		var side = {};
		side.trueAnswersObs = questionsObs.filter((question)=> {
			return question.answer === true;
		});
		side.falseAnswersObs = questionsObs.filter((question)=> {
			return question.answer === false;
		});
		side.noAnswersObs = questionsObs.filter((question)=> {
			return question.answer === "";
		});

		side.trueAnswersObsLength = side.trueAnswersObs.length;
		side.falseAnswersObsLength = side.falseAnswersObs.length;
		side.answersObsLength = side.trueAnswersObsLength + side.falseAnswersObsLength;
		side.noAnswersObsLength = side.noAnswersObs.length;


		return side;
	};
	
	Szpion.prototype.count = function () {
		var common = questionsSideCount(this.commonQuestionsObs);
		var foreign = questionsSideCount(this.foreignQuestionsObs);
		
//		var allAnswersObsLength = common.answersObsLength + foreign.answersObsLength;
//		
//		var weightSingleAnswer = 1 / allAnswersObsLength;
//		
//		var positiveAnswers = common.trueAnswersObsLength + foreign.falseAnswersObsLength;
//		var negativeAnswers = common.falseAnswersObsLength + foreign.trueAnswersObsLength;
//		var noSzpion = weightSingleAnswer * positiveAnswers;
//		var szpion = 1 - noSzpion;
		
//		common.weightSingleAnswer = 1 / common.answersObsLength;
//		foreign.weightSingleAnswer = 1 / foreign.answersObsLength;
//		
//		common.val = common.weightSingleAnswer * common.trueAnswersObsLength;
//		foreign.val = foreign.weightSingleAnswer * foreign.trueAnswersObsLength;
//		if (foreign.trueAnswersObsLength === 0) {
//			foreign.val = 1;
//		}
		
//		var noSzpion = common.val * foreign.val;
//		var szpion = 1 - noSzpion;
		
		var allTrueAnswersObsLength = common.trueAnswersObsLength + foreign.trueAnswersObsLength;
		var weightOneAnswer = 1 / allTrueAnswersObsLength;
		common.weightTrueAnswers = weightOneAnswer * common.trueAnswersObsLength;
		foreign.weightTrueAnswers = weightOneAnswer * foreign.trueAnswersObsLength;
		
		common.weight = common.weightTrueAnswers / (common.trueAnswersObsLength + common.falseAnswersObsLength);
		common.endWeight = common.weightTrueAnswers - (common.weight * common.falseAnswersObsLength);

		foreign.weight = foreign.weightTrueAnswers / (foreign.trueAnswersObsLength + foreign.falseAnswersObsLength);
		foreign.endWeight = foreign.weightTrueAnswers - (foreign.weight * foreign.falseAnswersObsLength);
		
		var noSzpion = common.endWeight/(common.endWeight + foreign.endWeight);
		var szpion = 1 - noSzpion;
		
		if (common.answersObsLength === 0 && foreign.answersObsLength === 0) {
			this.resultEl.innerHTML = `Wynik: Brak odpowiedzi. Brak informacji. Maksymalna entropia. 50% szansy na "bycie agentem" i 50% szansy na "nie bycie agentem".`;
		} else
		if (common.answersObsLength === 0 || foreign.answersObsLength === 0) {
			this.resultEl.innerHTML = "Brak wyniku: Potrzeba co najmniej po jednej odpowiedzi.";
		} else
			if (common.trueAnswersObsLength === 0 && foreign.trueAnswersObsLength === 0) {
				this.resultEl.innerHTML = `Wynik: 50% szansy na "bycie agentem" i 50% szansy na nie "bycie agentem"`;
			} else 
		if (szpion >= 0 && szpion <= 1 && noSzpion >= 0 && noSzpion <= 1) {
			this.resultEl.innerHTML = `Wynik: ${libs.round(szpion*100, 1)}% szansy na "bycie agentem" i ${libs.round(noSzpion*100, 1)}% szansy na "nie bycie agentem".<br/>`;
		} else {
			this.resultEl.innerHTML = "Brak wyniku: Jakiś błąd.";
		}
	};
	
	return Szpion;
	
});
// zrobić snippeta z this.questionEl = libs.tempEl("question"); i z this.foreignQuestionsEl = this.szpionEl.querySelector('.foreign-questions'); i z obiektem który ma to i reszte też
// zrobić klasę z listą i dodawaniem do listy i elementu itd