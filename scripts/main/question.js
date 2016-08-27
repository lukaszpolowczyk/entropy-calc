define(["libs/libs"], function(libs) {
	"use strict";
	
	function Question (szpion) {
		this.szpionEl = szpion.szpionEl;

		this.questionEl = libs.tempEl("question");

		this.answer = "";
		this.questionEl.setAttribute("data-answer", "");

		this.answerTrueEl = this.questionEl.querySelector('.answer-true');
		this.answerFalseEl = this.questionEl.querySelector('.answer-false');
		this.noAnswerEl = this.questionEl.querySelector('.no-answer');
		
		this.answerTrueEl.addEventListener('click', ()=> {
			this.answer = true;
			this.questionEl.setAttribute("data-answer", "true");
			szpion.count();
		});
		this.answerFalseEl.addEventListener('click', ()=> {
			this.answer = false;
			this.questionEl.setAttribute("data-answer", "false");
			szpion.count();
		});
		this.noAnswerEl.addEventListener('click', ()=> {
			this.answer = "";
			this.questionEl.setAttribute("data-answer", "");
			szpion.count();
		});
	}
	
	
	return Question;
	
});