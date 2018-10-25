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

Animator.prototype.lessThanEqualTo = function(i, j) {
	this._queue.push(["compare", i, j]);
	return (this._array[i] <= this._array[j]);
}

Animator.prototype.lessThan = function(i, j) {
	this._queue.push(["compare", i, j]);
	return (this._array[i] < this._array[j]);
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

function checkSorted(animator) {
	var n = animator.getArray().length;
	for(var i = 0; i < n; i++) {
		if(animator.lessThan(i + 1, i)) {
			return false;
		}
	}
	return true;
}

function animatedShuffle(animator) {
	var n = animator.getArray().length;
    for (var i = 0; i < n; i++) {
        var j = Math.floor(Math.random() * (i + 1));
        animator.swap(i, j)
    }
}

function animatedFlip(animator) {
	var n = animator.getArray().length;
	for(var i = 0; i < Math.floor(n / 2); i++) {
		animator.swap(i, n - i - 1);
	}
}

function bubbleSort(animator) {
	var n = animator.getArray().length;
	for(var i = 0; i < n; i++) {
		for(var j = 0; j < n - i - 1; j++) {
			if(animator.compare(j, j + 1)) {
				animator.swap(j, j + 1);
			}
		}
	}
}

function selectionSort(animator) {
	var n = animator.getArray().length;
	for(var i = 0; i < n - 1; i++) {
		var min = i;
		for(var j = i; j < n; j++) {
			if(animator.compare(min, j)) {
				min = j;
			}
		}
		animator.swap(i, min);
	}
}

function insertionSort(animator) {
	var n = animator.getArray().length;
	for(var i = 1; i < n; i++) {
		for(var j = i; j > 0 && animator.lessThan(j, j - 1); j--) {
			animator.swap(j, j - 1);
		}
	}
}

function oddEvenSort(animator) {
	var n = animator.getArray().length;
	var sorted = false;
	while(!sorted) {
		sorted = true;
		var temp = 0;
		for(var i = 1; i <= n - 2; i = i + 2) {
			if(animator.lessThan(i + 1, i)) {
				animator.swap(i, i + 1);
				sorted = false;
			}
		}

		for(var i = 0; i <= n - 2; i = i + 2) {
			if(animator.lessThan(i + 1, i)) {
				animator.swap(i, i + 1);
				sorted = false;
			}
		}
	}
}

function cocktailSort(animator) {
	var n = animator.getArray().length;
	var swapped = true;
	var start = 0;
	var end = n;
	while(swapped) {
		swapped = false;
		for(var i = start; i < end - 1; i++) {
			if(animator.lessThan(i + 1, i)) {
				animator.swap(i, i + 1);
				swapped = true;
			}
		}

		if(!swapped)
			break;

		swapped = false;
		end--;

		for(var i = end - 1; i >= start; i--) {
			if(animator.lessThan(i + 1, i)) {
				animator.swap(i, i + 1);
				swapped = true;
			}
		}

		start++;
	}
}

function partition(animator, low, high) {
	var pivot = Math.round((low + high) / 2);
	animator.swap(pivot, high);
	pivot = low;
	for(var i = low; i < high; i++) {
		if(animator.lessThan(i, high)) {
			if(i != pivot) {
				animator.swap(i, pivot);
			}
			pivot++;
		}
	}

	animator.swap(high, pivot);
	return pivot;
}

function quickSort(animator, low, high) {
	if(low < high) {
		var pivot = partition(animator, low, high);

		quickSort(animator, low, pivot - 1);
		quickSort(animator, pivot + 1, high);
	}
}

function heapify(animator, n, rootNode) {
	var largest = rootNode;
	var l = 2 * rootNode + 1;
	var r = 2 * rootNode + 2;

	if(l < n && animator.lessThan(largest, l)) 
		largest = l;

	if(r < n && animator.lessThan(largest, r))
		largest = r;

	if(largest != rootNode) {
		animator.swap(rootNode, largest);
		heapify(animator, n, largest);
	}
}

function heapSort(animator) {
	var n = animator.getArray().length;
	for(var i = Math.floor(n / 2) - 1; i >= 0; i--) 
		heapify(animator, n, i);
	for(var i = n - 1; i >= 0; i--) {
		animator.swap(0, i);
		heapify(animator, i, 0);
	}
}
