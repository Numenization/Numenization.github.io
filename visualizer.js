const length = 50;
const fps = 60;
const delay = 1;
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

function keyPressed() {
	if(keyCode === 83) {
		animator.cancel();
		animatedShuffle(animator.getArray(), animator);
	}
	if(keyCode === 49) {
		animator.cancel();
		bubbleSort(animator.getArray(), animator);
	}
	if(keyCode == 50) {
		animator.cancel();
		selectionSort(animator.getArray(), animator);
	}
}