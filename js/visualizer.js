var length = 50;
var fps = 60;
var delay = 1;
list = [];
var animator = null;

function setup() {
	setFrameRate(fps);
	for(var i = 0; i < length; i++) {
		list.push(i);
	}
	var canvas = createCanvas(1000,800);
	canvas.parent("canvas-holder");
	animator = new Animator(list, delay);
}

function draw() {
	background('#222222');
	var lineWidth = width / length;
	var heightRatio = height / length;
	if(length > 300) {
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
	if(input.value < 1 && input.value > 1000)
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
	if(input.value < 0)
		return;
	delay = input.value;
	animator.setDelay(delay);
}

function sortList() {
	var selectionList = document.getElementById("algorithm");
	var value = selectionList[selectionList.selectedIndex].value;
	animator.cancel();
	if(value == "bubbleSort") {
		bubbleSort(animator);
	} else if(value === "cocktailSort") {
		cocktailSort(animator);
	} else if(value === "oddEvenSort") {
		oddEvenSort(animator);
	} else if(value === "selectionSort") {
		selectionSort(animator);
	} else if(value === "insertionSort") {
		insertionSort(animator);
	} else if(value === "heapSort") {
		heapSort(animator);
	} else if(value === "quickSort") {
		quickSort(animator, 0, animator.getArray().length - 1);
	} else {
		console.log("Invalid sorting algorithm!");
	}
}

function shuffleList() {
	var selectionList = document.getElementById("shuffleMode");
	var value = selectionList[selectionList.selectedIndex].value;
	animator.cancel();
	if(value === "random") {
		animatedShuffle(animator);
	} else if(value === "reverse") {
		quickSort(animator, 0, animator.getArray().length - 1);
		animatedFlip(animator);
	} else {
		console.log("Invalid shuffle method!");
	}
}
