// define(["libs/libs"], function(libs) {
// 	"use strict";

import * as libs from "../libs/libs.js";

	export function PointersLayer (fieldEl) {
		this.fieldEl = fieldEl;
		
		this.pointersLayerEl = libs.tempElString("pointers-layer", `<div class="pointers-layer"><canvas class="canvas"></canvas></div>`);
		
		this.canvasEl = this.pointersLayerEl.querySelector("canvas.canvas");
		
		this.pointerElStr = `<div class="pointer"></div>`;
		
		this.pointersEls = [];
		
		this.fieldEl.parentElement.appendChild(this.pointersLayerEl);
	}
	
	PointersLayer.prototype.createPointer = function (pointedEl) {
		var pointerEl = libs.tempElString("pointer", this.pointerElStr);

		var contEldim = this.pointersLayerEl.getBoundingClientRect();
		var {left, top, right, bottom, width, height} = pointedEl.getBoundingClientRect();
		
		left -= contEldim.left;
		top -= contEldim.top;
		right -= contEldim.right;
		bottom -= contEldim.bottom;

		pointerEl.style.left = `${left-3}px`;
		pointerEl.style.top = `${top-3}px`;
		pointerEl.style.width = `${width+(2)}px`;
		pointerEl.style.height = `${height+(2)}px`;
		
		this.pointersLayerEl.appendChild(pointerEl);

		this.canvasEl.setAttribute("width", `${contEldim.width}`);
		this.canvasEl.setAttribute("height", `${contEldim.height}`);
		
		var context = this.canvasEl.getContext('2d');
		
		var prRect = pointerEl.getBoundingClientRect();
		
		var c = context;
//		c.beginPath();
//		c.moveTo(35,10); //rysowanie zaczynamy od punktów 35,10 - tam więc przesuwamy nasze piórko
//		c.lineTo(60,40);
//		c.lineTo(10,40);
//		c.lineTo(35,10);
//		c.stroke();
//
//		c.fillText('a',30,60);
//		c.fillText('c',110,60);
//		c.fillText('b',70,130);
		//context.bezierCurveTo(prRect.right+2,prRect.top+2+(prRect.hight/2), prRect.right+2+50,prRect.top+2+(prRect.hight/2)+20);
		
		context.beginPath();
		context.moveTo(prRect.right,prRect.top);
		context.bezierCurveTo(0,0,0,0,0,0);
		//context.quadraticCurveTo(100,200,180,280);
		//context.closePath();
		context.strokeStyle = "red";
		context.stroke();
		
		this.pointersEls.push(pointerEl);
	};

	// return PointersLayer;

// });
