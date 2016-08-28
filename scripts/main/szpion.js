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
//		
//		var questionC = new Question(this);
//		this.commonQuestionsObs.push(questionC);
//		this.commonQuestionsEl.appendChild(questionC.questionEl);
//		
//		var questionF = new Question(this);
//		this.foreignQuestionsObs.push(questionF);
//		this.foreignQuestionsEl.appendChild(questionF.questionEl);
		
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
	}
	
//	Szpion.prototype.questionsSideCount = function () {
//		this.commonTrueAnswersObs = this.commonQuestionsObs.filter((commonQuestion)=> {
//			return commonQuestion.answer === true;
//		});
//		this.commonFalseAnswersObs = this.commonQuestionsObs.filter((commonQuestion)=> {
//			return commonQuestion.answer === false;
//		});
//		this.commonNoAnswersObs = this.commonQuestionsObs.filter((commonQuestion)=> {
//			return commonQuestion.answer === "";
//		});
//
//		this.commonTrueAnswersObsLength = this.commonTrueAnswersObs.length;
//		this.commonFalseAnswersObsLength = this.commonFalseAnswersObs.length;
//		this.commonNoAnswersObsLength = this.commonNoAnswersObs.length;
//
//		var commonAnswerVal = 1 / (this.commonTrueAnswersObsLength + this.commonFalseAnswersObsLength);
//
//		var commonAnswersVal = commonAnswerVal * this.commonTrueAnswersObsLength;
//	};

//	this.foreignTrueAnswersObs = this.foreignQuestionsObs.filter((foreignQuestion)=> {
//		return foreignQuestion.answer === true;
//	});
//	this.foreignFalseAnswersObs = this.foreignQuestionsObs.filter((foreignQuestion)=> {
//		return foreignQuestion.answer === false;
//	});
//	this.foreignNoAnswersObs = this.foreignQuestionsObs.filter((foreignQuestion)=> {
//		return foreignQuestion.answer === "";
//	});
//
//	this.foreignTrueAnswersObsLength = this.foreignTrueAnswersObs.length;
//	this.foreignFalseAnswersObsLength = this.foreignFalseAnswersObs.length;
//	this.foreignNoAnswersObsLength = this.foreignNoAnswersObs.length;
//
//	var foreignAnswerVal = 1 / (this.foreignTrueAnswersObsLength + this.foreignFalseAnswersObsLength);
//
//	var foreignAnswersVal = foreignAnswerVal * this.foreignTrueAnswersObsLength;

	var questionsSideCount = function (questionsObs, sideAnswerImportance) {
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
		side.noAnswersObsLength = side.noAnswersObs.length;

		side.answerVal = 1 / (side.trueAnswersObsLength + side.falseAnswersObsLength);

		side.answersVal = side.answerVal * side[sideAnswerImportance];

		side.numbers = `0`;

		if (side[sideAnswerImportance] > 0) {
			side.numbers = `${libs.round(side.answerVal, 3)} + `.repeat(side[sideAnswerImportance]-1);
			side.numbers += libs.round(side.answerVal, 3);
		}
		
//		for (var i = 1; i < side.trueAnswersObsLength; i++) {
		//	side.numbers += `${libs.round(side.answerVal, 3)} + `;
//		}
		
		return side;
	};
	
	Szpion.prototype.count = function () {
		var common = questionsSideCount(this.commonQuestionsObs, "trueAnswersObsLength");
		var foreign = questionsSideCount(this.foreignQuestionsObs, "falseAnswersObsLength");
		

//		common.answersVal = common.answerVal * common.trueAnswersObsLength;
//
//		common.numbers = `0`;
//
//		if (common.trueAnswersObsLength > 0) {
//			common.numbers = `${libs.round(common.answerVal, 3)} + `.repeat(common.trueAnswersObsLength-1);
//			common.numbers += libs.round(common.answerVal, 3);
//		}
//		
//		
//		foreign.answersVal = foreign.answerVal * foreign.falseAnswersObsLength;
//
//		foreign.numbers = `0`;
//
//		if (foreign.trueAnswersObsLength > 0) {
//			foreign.numbers = `${libs.round(foreign.answerVal, 3)} + `.repeat(foreign.trueAnswersObsLength-1);
//			foreign.numbers += libs.round(foreign.answerVal, 3);
//		}
		
		
		// result
		var preResult = common.answersVal * foreign.answersVal;
		var result = 1 - preResult;
		

		var numbersAll = `(${common.numbers}) * (${foreign.numbers}) = ${libs.round(common.answersVal, 3)} * ${libs.round(foreign.answersVal, 3)} = ${libs.round(preResult, 3)} <br/> 1 - ${libs.round(preResult, 3)} = ${libs.round(result, 3)}`;
		
		if (result > 0.5 && result <= 1) {
			this.resultEl.innerHTML = `Wynik: Szpion na ${libs.round(result*100, 3)}%. <br/>${numbersAll}`;
		} else
		if (result >= 0 && result <= 0.5) {
			this.resultEl.innerHTML = `Wynik: Szpion na ${libs.round(result*100, 3)}%. <br/>${numbersAll}`;
		} else {
			this.resultEl.innerHTML = "Wynik: Brakujące dane lub jakiś błąd w programie. Potrzeba co najmniej jednej odpowiedzi o współny interes i conajmniej jednej o obcy interes.";
		}
	};
	
	// zrobić klasę z questionsBlock żeby się nie duplikować tak bardzo
	
	return Szpion;
	
});
// zrobić snippeta z this.questionEl = libs.tempEl("question"); i z this.foreignQuestionsEl = this.szpionEl.querySelector('.foreign-questions'); i z obiektem który ma to i reszte też