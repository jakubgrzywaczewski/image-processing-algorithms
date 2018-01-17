const CANVAS = document.querySelector('#main-canvas');
const CANVAS_CTX = CANVAS.getContext('2d');
const LOADED_FILE = document.querySelector('#load-file');

LOADED_FILE.addEventListener('change', () => {
	let path = document.querySelector('.file-path');
	path.placeholder = LOADED_FILE.files[0].name;
	CreateImage(LOADED_FILE.files[0]);
}, false);

function CreateImage(file) {
	let reader = new FileReader();
	let image = new Image();
	let url = URL.createObjectURL(file);
	image.onload = function () {
		CANVAS_CTX.drawImage(image, 0, 0, image.width, image.height, 0, 0, CANVAS.width, CANVAS.height);
		CANVAS_CTX.fillStyle = "rgba(200, 0, 0, 0)";
		CANVAS_CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);
	};
	image.src = url;
}

function getPixel(url, x, y) {
	var img = new Image();
	img.src = url;
	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	context.drawImage(img, 0, 0);
	return context.getImageData(x, y, 1, 1).data;
}


//getPixel('./bg.png', 10, 10); // [255, 255, 255, 0];
