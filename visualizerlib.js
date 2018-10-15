const BASE_COLOR = "#FFFFFF"
const SWAP_COLOR = "#FF0000"
const COMP_COLOR = "#0000FF"

function Animator(a, delay) {
	this._array = a;
	this._animatedArray = [];
	for(var i = 0; i < this._array.length; i++) {
		this._animatedArray.push(this._array[i]);
	}
	this._colors = [];
	this._queue = [];
	var _this = this;
	this._id = window.setInterval(function() {_this._update();}, delay);
	this._init();
}

Animator.prototype._init = function() {
	for(var i = 0; i < this._array.length; i++) {
		this._colors.push(BASE_COLOR);
	}
}

Animator.prototype.resetColors = function() {
	for(var i = 0; i < this._array.length; i++) {
		this._colors[i] = BASE_COLOR;
	}
}

Animator.prototype._update = function() {
	// takes the action in the front of the queue and processes it
	// actions always take the form of ["ACTION_TYPE", i, j]
	this.resetColors();
	if(this._queue.length <= 0)
		return;
	var action = this._queue.shift(); // takes first action out of queue and moves array over
	var i = action[1];
	var j = action[2];
	if(action[0] === "compare") {
		this._colors[i] = COMP_COLOR;
		this._colors[j] = COMP_COLOR;
	}
	else if(action[0] === "swap") {
		this._colors[i] = SWAP_COLOR;
		this._colors[j] = SWAP_COLOR;
		var temp = this._animatedArray[i];
		this._animatedArray[i] = this._animatedArray[j];
		this._animatedArray[j] = temp;
	}
}

Animator.prototype._syncArrays = function() {
	var length = this._animatedArray.length;
	for(var i = 0; i < length; i++) {
		this._array[i] = this._animatedArray[i];
	}
}

Animator.prototype.cancel = function() {
	var length = this._queue.length;
	if(length === 0)
		return;
	for(var i = 0; i < length; i++) {
		this._queue.pop();
	}
	this.resetColors();
	this._syncArrays();
}

Animator.prototype.setDelay = function(delay) {
	clearInterval(this._id);
	var _this = this;
	this._id = window.setInterval(function() {_this._update();}, delay);
}

Animator.prototype.compare = function(i, j) {
	// returns true if a[i] is greater than a[j] and enqueues a compare action
	this._queue.push(["compare", i, j]);
	return (this._array[i] > this._array[j]);
}

Animator.prototype.swap = function(i, j) {
	// swaps two numbers in the array and enqueues a swap action
	this._queue.push(["swap", i, j]);
	var temp = this._array[i];
	this._array[i] = this._array[j];
	this._array[j] = temp;
}

Animator.prototype.getArray = function() {
	return this._animatedArray;
}

Animator.prototype.getColors = function() {
	return this._colors;
}

function shuffleList(a, delay=0) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function animatedShuffle(arr, animator) {
	var j, i;
    for (i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        animator.swap(i, j)
    }
}

function bubbleSort(arr, animator) {
	for(var i = 0; i < arr.length; i++) {
		for(var j = 0; j < arr.length - i - 1; j++) {
			if(animator.compare(j, j + 1)) {
				animator.swap(j, j + 1);
			}
		}
	}
}

function selectionSort(arr, animator) {
	for(var i = 0; i < arr.length - 1; i++) {
		var min = i;
		for(var j = i; j < arr.length; j++) {
			if(animator.compare(min, j)) {
				min = j;
			}
		}
		animator.swap(i, min);
	}
}
