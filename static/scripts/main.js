var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");
var w, h, _x, _y, __x, __y, width, height;
var type = 0;
var zoom = 1.5;
var imageData;

function clearCanvas() {
	ctx.beginPath();
	ctx.rect(0, 0, w, h);
	ctx.fillStyle = "black";
	ctx.fill();
	ctx.closePath();
}

$(window).on('load', function() {
	$('#julia-menu').hide();
	w = $('#main-panel').width() - 40;
	h = math.floor(9*w/16.0);
	canvas.width = w;
	canvas.height = h;

	height = 4.0/zoom;
	width = w*height/h;
	_x = 0;
	_y = 0;

	clearCanvas();
	imageData = ctx.getImageData(0,0,w,h);
});

canvas.addEventListener('mousedown', function(evt) {
	var rect = canvas.getBoundingClientRect();
    _X = evt.clientX - rect.left,
	_Y = evt.clientY - rect.top

	ctx.putImageData(imageData, 0, 0);
	ctx.beginPath();
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 2;          
    ctx.moveTo( _X, 0 );
	ctx.lineTo( _X, h ) ;
	ctx.moveTo( 0, _Y );
    ctx.lineTo( w, _Y ) ;    
    ctx.stroke();
    ctx.closePath();

	_x = __x - width/2 + (width*_X/(1.0*w));
	_y = __y - height/2 + (height*_Y/(1.0*h));
	$('#prompt').html(`Centered on (${_x.toFixed(3)}, ${_y.toFixed(3)}).`);
});

function updateLabel() {
	$('#comp-label').html( $('#comp').val() );
	zoom = parseFloat( $('#zoom').val() );
	$('#zoom-label').html( zoom );
}

function changeType() {
	type = parseInt( $('#type-menu').val() );
	if (type == 0)
		$('#julia-menu').fadeOut('fast');
	else if (type == 1)
		$('#julia-menu').fadeIn('fast');
}

function toRGB(color) {
	if(color.substring(0,1) == '#') {
		color = color.substring(1);
	}
	var rgbColor = [ parseInt(color.substring(0,2),16), parseInt(color.substring(2,4),16), parseInt(color.substring(4),16) ];
	return rgbColor;
}

function generate() {
	$('#gen-btn').prop('disabled', true);
	$('#gen-btn').removeClass('btn-info');
	$('#gen-btn').addClass('btn-danger');
	
	
	let iters = parseInt( $('#comp').val() );

	__x = _x;
	__y = _y;
	height = 4.0/zoom;
	width = w*height/h;
	X = _x + -(w*2.0/h)/zoom;
	Y = _y + -2/zoom;

	clearCanvas();
	fillMap(type, iters, X, Y);
	imageData = ctx.getImageData(0,0,w,h);

	$('#gen-btn').prop('disabled', false);
	$('#gen-btn').removeClass('btn-danger');
	$('#gen-btn').addClass('btn-info');
}

function fillMap(type, iters, X, Y) {
	let c = math.complex( parseFloat( $('#re').val() ) , parseFloat( $('#im').val() ) );
	for (let j=0; j < h; ++j) { 
		for (let i=0; i < w; ++i) {
			let x = X + (i*width/w);
			let y = Y + (j*height/h);

			if (type == 0)
				c = math.complex(x, y);
			n = iterate(iters, x, y, c);
			ctx.beginPath();
			if (n == iters) 
				ctx.fillStyle = '#eee';
			else
				ctx.fillStyle = `hsl(${ 360*scaleRatio(n*1.0/iters) }, 100%, 50%)`;
			ctx.fillRect( i, j, 1, 1 );
			ctx.closePath();
		}
	}
}

function scaleRatio(x) {
	return 1 - math.pow( 1-x, 2 );
}

function iterate(maxIters, x, y, c) {
	let z = math.complex(x, y);
	for (var n=0; n < maxIters; ++n) {
		z = math.add(math.square(z), c);
		if (math.abs(z) >= 2)
			break;
	}
	return n;
}