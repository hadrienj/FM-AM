export class Spectro {
  // Draw spectrogram from the analyser node (Web Audio API)
  constructor({audioCtx, fftSize, carFreq, modAmpl, modFreq, visualCtx}) {
    this.audioCtx = audioCtx;
    this,fftSize = fftSize;
    this.carFreq = carFreq;
    this.modAmpl = modAmpl;
    this.modFreq = modFreq;
    this.visualCtx = visualCtx;
    this.play = false;


    this.animate;
    this.analyserNode = audioCtx.createAnalyser();
    this.analyserNode.smoothingTimeConstant = 0.0;
    this.analyserNode.fftSize = fftSize;

    // Create the array for the data values
    this.frequencyArray = new Uint8Array(this.analyserNode.frequencyBinCount);

    // Uses the chroma.js library by Gregor Aisch to create a color gradient
    // download from https://github.com/gka/chroma.js
    this.colorScale = new chroma.scale('Spectral').domain([1,0]);
    // Global Variables for Drawing
    this.column = 0;
    this.canvasWidth  = 800;
    this.canvasHeight = 256;
  }
  draw() {
    // Draw the Spectrogram from the frequency array
    // The array has 512 elements - but truncate at 256

    // Refresh parameter (change in real time)
    this.carFreq = parseInt(document.getElementById('carFreq').value);
    this.modAmpl = parseInt(document.getElementById('modAmpl').value);
    this.modFreq = parseInt(document.getElementById('modFreq').value);
    this.analyserNode.getByteFrequencyData(this.frequencyArray);


    for (var i = 0; i < this.frequencyArray.length; i++) {
      // Get the color from the color map, draw 1x1 pixel rectangle
      this.visualCtx.fillStyle = this.colorScale(this.frequencyArray[i] / 256.0);
      this.visualCtx.fillRect(this.column,this.canvasHeight - i, 1, 1);
    }
    if (this.play) {
      // loop around the canvas when we reach the end
      this.column += 1;
    }

    if(this.column >= this.canvasWidth) {
      this.column = 0;
      this.clearCanvas();
    }
    this.animate = requestAnimationFrame(()=>this.draw());
  }
  clearCanvas() {
    this.visualCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }
  stop() {
    this.play = false;
  }
}