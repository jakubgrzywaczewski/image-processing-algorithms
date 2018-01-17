const CANVAS = document.querySelector('#main-canvas');
const CANVAS_CTX = CANVAS.getContext('2d');
const LOADED_FILE = document.querySelector('#load-file');

LOADED_FILE.addEventListener('change', (e) => {
	let path = document.querySelector('.file-path');
	path.placeholder = LOADED_FILE.files[0].name;
	LoadImage(LOADED_FILE.files[0]);
});

function LoadImage(file) {
	let reader = new FileReader();
	reader.addEventListener("load", () => {
		if (file) {
			console.log(file);
			renderImage
		}
	});
}

function renderImage() {
	let image = new Image();

	image.onload = function () {
		CANVAS_CTX.drawImage(image, 0, 0);
		CANVAS_CTX.fillStyle = "rgba(200, 0, 0, 0.5)";
		CANVAS_CTX.fillRect(0, 0, 500, 500);
	};

	image.src = `${event.src}`;
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
