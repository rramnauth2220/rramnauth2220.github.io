var particles_a = [];
var particles_b = [];
var particles_c = [];
var nums = 200;
var noiseScale = 800;

//function toggleSong() {
//    if (song.isPlaying()) {
//        song.pause();
//    } else {
//        song.play();
//    }
//}

function preload() {
    song = loadSound('sketches/as.mp3');
}

function setup(){
	height = document.getElementById('sketch-holder').clientHeight;
    width = document.getElementById('sketch-holder').clientWidth;
    var canvas = createCanvas(width, height);
    canvas.parent('sketch-holder');
    button = createButton('toggle');
    button.parent('descript');
    analyzer = new p5.Amplitude();
    analyzer.setInput(song);
    fft = new p5.FFT();
    peakDetect = new p5.PeakDetect();
    
	background(21, 8, 50);
	for(var i = 0; i < nums; i++){
		particles_a[i] = new Particle(random(0, width),random(0,height));
		particles_b[i] = new Particle(random(0, width),random(0,height));
		particles_c[i] = new Particle(random(0, width),random(0,height));
	}
}

function draw(){
	noStroke();
	smooth();
	for(var i = 0; i < nums; i++){
        rms = analyzer.getLevel(0);
		var radius = map(i,0,nums,rms + 0.95,2);
		var alpha = map(i,0,nums,50,250);

        fill(232,41,39,alpha);
		particles_a[i].move();
		particles_a[i].display(radius);
		particles_a[i].checkEdge();

        fill(236,191,19,alpha);
		particles_b[i].move();
		particles_b[i].display(radius);
		particles_b[i].checkEdge();

        fill(255,255,255,alpha);
		particles_c[i].move();
		particles_c[i].display(radius);
		particles_c[i].checkEdge();
	}  
}

function Particle(x, y){
	this.dir = createVector(0, 0);
	this.vel = createVector(0, 0);
	this.pos = createVector(x, y);
	this.speed = 0.4;

    // update speed based on current tempo
	this.move = function(){
        rms = analyzer.getLevel(0);
        //fft.analyze();
        //peakDetect.update(fft);
        var angle = noise(this.pos.x/noiseScale, this.pos.y/noiseScale)*TWO_PI*noiseScale;
		this.dir.x = cos(angle);
		this.dir.y = sin(angle);
		this.vel = this.dir.copy();
		//this.vel.mult(this.speed * map(peakDetect.currentValue, 0, 1, 0, 3));
        this.vel.mult(this.speed * map(rms, 0, 1, 0, 5));
		//this.vel.mult(this.speed);
        this.pos.add(this.vel);
	}

	this.checkEdge = function(){
		if(this.pos.x > width || this.pos.x < 0 || this.pos.y > height || this.pos.y < 0){
			this.pos.x = random(50, width);
			this.pos.y = random(50, height);
		}
	}

	this.display = function(r){
		ellipse(this.pos.x, this.pos.y, r, r);
	}
}

// toggle play/stop when canvas is clicked
function mouseClicked() {
    if (song.isPlaying() ) {
        song.pause();
    } else {
        song.play();
    }
  }