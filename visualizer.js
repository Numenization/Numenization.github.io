var length = 50;
const fps = 60;
var delay = 1;
list = [];
var animator = null;

function setup() {
	for(var i = 0; i < length; i++) {
		list.push(i);
	}
	createCanvas(1000,800);
	frameRate(fps);
	animator = new Animator(list, delay);
}

function draw() {
	background('#222222');

	var lineWidth = width / length;
	var heightRatio = height / length;
	if(length > 500) {
		strokeWeight(0);
	}
	else {
		strokeWeight(1);
	}
	var arr = animator.getArray();
	var colors = animator.getColors();
	for(var i = 0; i < arr.length; i++) {
		fill(colors[i]);
		rect(i * lineWidth, height, lineWidth, (-arr[i] - 1) * heightRatio);
	}	
}

function updateArrayLength() {
	var input = document.getElementById("lengthTextbox");
	if(input.value < 1 || input.value > 1000)
		return;
	length = input.value;
	animator.cancel();
	list = [];
	for(var i = 0; i < length; i++) {
		list.push(i);
	}
	animator = new Animator(list, delay);
}

function updateDelay() {
	var input = document.getElementById("delayTextbox");
	if(input.value > 0)
		return;
	delay = input.value;
	animator.setDelay(delay);
}

function shuffleEvent() {
	animator.cancel();
	animatedShuffle(animator.getArray(), animator);
}

function bubbleSortEvent() {
	animator.cancel();
	bubbleSort(animator.getArray(), animator);
}

function selectionSortEvent() {
	animator.cancel();
	selectionSort(animator.getArray(), animator);
}