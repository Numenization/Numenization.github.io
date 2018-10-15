const width = 1000;  // hardcoded value for canvas width
const height = 800; // hardcoded value for canvas height
const array_length = 500; // temporarily hardcoded array length

var canvas = document.getElementById("main_canvas")
var ctx = canvas.getContext("2d");

var values = [];
var lineWidth = 1;

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

(function() {
    var timeouts = [];
    var messageName = "zero-timeout-message";

    // Like setTimeout, but only takes a function argument.  There's
    // no time argument (always zero) and no arguments (you have to
    // use a closure).
    function setZeroTimeout(fn) {
        timeouts.push(fn);
        window.postMessage(messageName, "*");
    }
 
    function handleMessage(event) {
        if (event.source == window && event.data == messageName) {
            event.stopPropagation();
            if (timeouts.length > 0) {
                var fn = timeouts.shift();
                fn();
            }
        }
    }

    window.addEventListener("message", handleMessage, true);
 
    // Add the one thing we want added to the window object.
    window.setZeroTimeout = setZeroTimeout;
})();

function fastSleep(ms) {
	return new Promise(resolve => setZeroTimeout(resolve, ms));
}

async function setup() {
	var ratio = height / array_length;

	// populate array with random numbers
	for(var i = 0; i < array_length; i++) {
		values.push((i + 1) * ratio);
	}

	drawArray(values);
	await sleep(500);
	await shuffle(values);
	await sleep(500);
	await bubbleSort(values, 5);
}

function drawArray(a) {
	// draw lines for the values in the array
	lineWidth = width / values.length;
	ctx.lineWidth = lineWidth;
	ctx.strokeStyle = "#FFFFFF";
	for (var i = 0; i < a.length; i++) {
		ctx.moveTo(i * lineWidth + lineWidth / 2, height);
		ctx.lineTo(i * lineWidth + lineWidth / 2, height - a[i]);
		ctx.stroke();
	}
}

function clearArray(a) {
	lineWidth = width / values.length;
	ctx.lineWidth = lineWidth;
	ctx.strokeStyle = "#000000";
	for (var i = 0; i < a.length; i++) {
		ctx.moveTo(i * lineWidth, height);
		ctx.lineTo(i * lineWidth, height - a[i]);
		ctx.stroke();
		ctx.closePath();
	}
}

function eraseLine(a, i) {
	ctx.clearRect(i * lineWidth, 0, lineWidth, height);
}

async function swap(a, i, j, delay=0) {
	// clear the lines already there
	lineWidth = width / a.length;
	ctx.lineWidth = lineWidth;

	eraseLine(a, i);
	eraseLine(a, j);

	// actually swap the values
	var temp = a[i];
	a[i] = a[j];
	a[j] = temp;

	// redraw the new lines
	ctx.strokeStyle = "#FFFFFF";
	ctx.beginPath();
	ctx.moveTo(i * lineWidth + lineWidth / 2, height - a[i]);
	ctx.lineTo(i * lineWidth + lineWidth / 2, height);
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.moveTo(j * lineWidth + lineWidth / 2, height - a[j]);
	ctx.lineTo(j * lineWidth + lineWidth / 2, height);
	ctx.stroke();
	ctx.closePath();

	if(delay > 0) {
		await sleep(delay);
	}
	else {
		await fastSleep(delay);
	}
}

async function shuffle(a, delay=0) {
	for(var i = a.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));	
		await swap(a, i, j, delay);
	}
}

async function bubbleSort(a, delay=0) {
	var startTime = Date.now();
	for(var i = 0; i < a.length; i++) {
		for(var j = 0; j < a.length - i - 1; j++) {
			if(a[j] > a[j + 1]) {
				await swap(a, j, j + 1, delay);
			}
		}
		//await fastSleep(delay);
	}
	var endTime = Date.now();
	var elapsedTime = endTime - startTime;
	console.log(elapsedTime);
}

async function selectionSort(a, delay=0) {
	var startTime = Date.now();
	for(var i = 0; i < a.length - 1; i++) {
		var min = i;
		for(var j = i + 1; j < a.length; j++) {
			if(a[min] > a[j]) {
				min = j;
			}
		}
		await swap(a, i, min, delay);
	}
	var endTime = Date.now();
	var elapsedTime = endTime - startTime;
	console.log(elapsedTime);
}

async function partition(a, low, high, delay=0) {
	var pivot = a[high];
	var i = low - 1;
	for(var j = low; j <= high - 1; j++) {
		if(a[j] <= pivot) {
			i++;
			await swap(a, i, j, delay);
		}
	}

	await swap(i + 1, high, delay);
	console.log(high + " BUP " + low);
	return i + 1;
}

async function quickSort(a, l, h, delay=0, stack, top) {
	h = stack[top--];
	l = stack[top--];

	var p = await partition(a, l, h, delay);

	if(p - 1 > l) {
		stack[++top] = l;
		stack[++top] = p - 1;
	}

	if(p + 1 < h) {
		stack[++top] = p + 1;
		stack[++top] = h;
	}
}

async function quickSortStart(a, delay=0) {
	var stack = a;
	var top = -1;
	
	stack[++top] = 0;
	stack[++top] = a.length - 1;
	while(top >= 0) {
		await quickSort(a, 0, a.length - 1, delay, stack, top);
	}
} 

setup();