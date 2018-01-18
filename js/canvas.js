const CANVAS = document.querySelector('#main-canvas');
const CANVAS_CTX = CANVAS.getContext('2d');
const LOADED_FILE = document.querySelector('#load-file');
const BUTTON_MAIN_ALGORITHM = document.querySelector('#use-reverse-algorithm');

LOADED_FILE.addEventListener('change', () => {
	let path = document.querySelector('.file-path');
	path.placeholder = LOADED_FILE.files[0].name;
	createCanvasImage(LOADED_FILE.files[0]);
}, false);

BUTTON_MAIN_ALGORITHM.addEventListener('click', () => {
	let imageData = CANVAS_CTX.getImageData(0, 0, CANVAS.width, CANVAS.height);
	for (i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i] = 255 - imageData.data[i];
        imageData.data[i+1] = 255 - imageData.data[i+1];
        imageData.data[i+2] = 255 - imageData.data[i+2];
        imageData.data[i+3] = 255;
    }
    CANVAS_CTX.putImageData(imageData, 0, 0);
});

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
