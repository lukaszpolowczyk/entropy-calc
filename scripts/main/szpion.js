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
		
		var questionC = new Question(this);
		this.commonQuestionsObs.push(questionC);
		this.commonQuestionsEl.appendChild(questionC.questionEl);
		
		var questionF = new Question(this);
		this.foreignQuestionsObs.push(questionF);
		this.foreignQuestionsEl.appendChild(questionF.questionEl);
		
		// jeszcze funkcja automatycznego dodawania kolejnego pustego
		// jeszcze kolor zaznaczonej odpowiedzi (atrybut .question[data-false-answer] itd)
		// wpisanie warości prawdopodobieństwa do każdego
		// mozliwoś zmieny prawdopodobieństw ręcznie
	}
	
	Szpion.prototype.count = function () {
		this.commonTrueAnswersObs = this.commonQuestionsObs.filter((commonQuestion)=> {
			return commonQuestion.answer === true;
		});
		this.commonFalseAnswersObs = this.commonQuestionsObs.filter((commonQuestion)=> {
			return commonQuestion.answer === false;
		});
		this.commonNoAnswersObs = this.commonQuestionsObs.filter((commonQuestion)=> {
			return commonQuestion.answer === "";
		});
		
		this.commonTrueAnswersObsLength = this.commonTrueAnswersObs.length;
		this.commonFalseAnswersObsLength = this.commonFalseAnswersObs.length;
		this.commonNoAnswersObsLength = this.commonNoAnswersObs.length;
		
		var commonAnswerVal = 1 / (this.commonTrueAnswersObsLength + this.commonFalseAnswersObsLength);
		
		var commonAnswersVal = commonAnswerVal * this.commonTrueAnswersObsLength;
		
		this.foreignTrueAnswersObs = this.foreignQuestionsObs.filter((foreignQuestion)=> {
			return foreignQuestion.answer === true;
		});
		this.foreignFalseAnswersObs = this.foreignQuestionsObs.filter((foreignQuestion)=> {
			return foreignQuestion.answer === false;
		});
		this.foreignNoAnswersObs = this.foreignQuestionsObs.filter((foreignQuestion)=> {
			return foreignQuestion.answer === "";
		});
		
		this.foreignTrueAnswersObsLength = this.foreignTrueAnswersObs.length;
		this.foreignFalseAnswersObsLength = this.foreignFalseAnswersObs.length;
		this.foreignNoAnswersObsLength = this.foreignNoAnswersObs.length;
		
		var foreignAnswerVal = 1 / (this.foreignTrueAnswersObsLength + this.foreignFalseAnswersObsLength);

		var foreignAnswersVal = foreignAnswerVal * this.foreignTrueAnswersObsLength;
		
		// result
		var result = commonAnswersVal * foreignAnswersVal;
		result = 1 - result;
		
		if (result > .5 && result <= 1) {
			this.resultEl.innerHTML = `Szpion. Na ${result*100}%`;
		} else
		if (result >= 0 && result <= .5) {
			this.resultEl.innerHTML = `Szpion. Na ${result*100}%`;
		} else {
			this.resultEl.innerHTML = "Brakujace dane lub jakiś błąd w programie.";
		}
		
		if (this.commonNoAnswersObsLength === 0) {
			var questionC = new Question(this);
			this.commonQuestionsObs.push(questionC);
			this.commonQuestionsEl.appendChild(questionC.questionEl);
		}

		if (this.foreignNoAnswersObsLength === 0) {
			var questionF = new Question(this);
			this.foreignQuestionsObs.push(questionF);
			this.foreignQuestionsEl.appendChild(questionF.questionEl);
		}
	};
	
	// zrobić klasę z questionsBlock żeby się nie duplikować tak bardzo
	
	return Szpion;
	
});
// zrobić snippeta z this.questionEl = libs.tempEl("question"); i z this.foreignQuestionsEl = this.szpionEl.querySelector('.foreign-questions'); i z obiektem który ma to i reszte też