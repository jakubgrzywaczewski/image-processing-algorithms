const CANVAS = document.querySelector('#main-canvas');
const CANVAS_CTX = CANVAS.getContext('2d');
const LOADED_FILE = document.querySelector('#load-file');

LOADED_FILE.addEventListener('change', () => {
	let path = document.querySelector('.file-path');
	path.placeholder = LOADED_FILE.files[0].name;
	createCanvasImage(LOADED_FILE.files[0]);
}, false);

function loadImage(url) {
	return new Promise(resolve => { 
		let i = new Image(); 
		i.onload = () => { resolve(i) }; 
		i.src = url; 
	});
}

function correctCanvasSizes(image) {
	CANVAS.width = image.width;
	CANVAS.height = image.height;
	if(image.width > 1300) {
		let body = document.querySelector('body');
		body.innerHTML = "";
		body.innerHTML = "<h1 style='display:block; margin: 100px auto;'>Zbyt duży obrazek.<br> Maksymalny rozmiar obrazka to 1300px</h1>";
	}
}

async function createCanvasImage(file) {
	let reader = new FileReader();
	let url = URL.createObjectURL(file);
	let image = await loadImage(url);
	image.onload = function () {
		CANVAS_CTX.drawImage(image, 0, 0, CANVAS.width, CANVAS.height, 0, 0, image.width, image.height);
		CANVAS_CTX.fillStyle = "rgba(0, 0, 0, 0.1)";
		CANVAS_CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);
	};
	image.src = url;
	correctCanvasSizes(image);
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
