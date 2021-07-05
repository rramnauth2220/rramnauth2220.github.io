const CYCLE = 300;
let cols = createCols("https://coolors.co/ffece0-fa6000-737373-000000");
let bgCol = cols[0];
let lineCol = cols.splice(1,cols.length-1);

function preload() {
	song = loadSound('sketches/as.mp3');
  }
	
function setup() {
	var canvas = createCanvas(window.innerWidth/2, window.innerHeight, WEBGL);
  canvas.parent('sketch-holder');
	let dep = max(width,height);
	ortho(-width / 2, width / 2, -height / 2, height / 2,-dep*3 , dep*3);
	analyzer = new p5.Amplitude();
  analyzer.setInput(song);
  song.play();
}

function draw() {
	randomSeed(0);
	rms = analyzer.getLevel(0);
	console.log(rms);
	background(bgCol);
	const cycle = CYCLE;
	let fr = (frameCount % cycle)/cycle;
	let size =min(height,width)*0.8;
	let num = 20;
	let span = size/num;
	rotateX(-PI/5);
	//rotateY(fr*TAU);
	rotateY(-PI/6);
	let count = 0;
	for(let z = -size/2; z < size/2; z += span)
	{
		let radOffset = map(z, -size/2, size/2, 0, TAU);
		let waveRatio = map(abs(z), 0, size/2, 0.5, 0);
		push();
		translate(0,0,z);
		wavedLinePlane(size,size*rms,sin(radOffset + fr * TAU)*0.5,10,lineCol[int(count + frameCount*0) % lineCol.length]);
		pop();
		count ++;
	}
}

function wavedLinePlane(w,h,waveHeightRatio,sw,sc)
{
	strokeWeight(sw);
	noStroke();
	fill(bgCol);
	wavedPlane(w,h,waveHeightRatio,false);
	stroke(sc);
	noFill();
	wavedPlane(w,h,waveHeightRatio,true);
}

function wavedPlane(w,h,waveHeightRatio, isStroke)
{
	const cycle = CYCLE/2;
	const vertNum = 50;
	let fr = (frameCount % cycle)/cycle;
	const span = w/vertNum;
	
	if(isStroke)beginShape();
	else beginShape(TRIANGLE_STRIP);
	for(let x = -w/2; x <= w/2; x += span)
	{
		let radOffset = map(x, -w/2, w/2, 0, TAU*2);
		let maxWaveH = h * 0.5 * waveHeightRatio;
		let waveH = sin(fr * TAU + radOffset) * maxWaveH;
		let y = waveH - maxWaveH;
		if(!isStroke)vertex(x,h,0);
		vertex(x,y,0);
	}
	
	if(!isStroke)vertex(w/2, h,0);
	endShape();
}

function createCols(_url)
{
  let slash_index = _url.lastIndexOf('/');
  let pallate_str = _url.slice(slash_index + 1);
  let arr = pallate_str.split('-');
  for (let i = 0; i < arr.length; i++) {
    arr[i] = '#' + arr[i];
  }
  return arr;
}