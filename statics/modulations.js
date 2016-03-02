$(document).ready(function() {

// get the context from the canvas to draw on
var ctx = $("#canvas").get()[0].getContext("2d");
var play = false;

// Uses the chroma.js library by Gregor Aisch to create a color gradient
// download from https://github.com/gka/chroma.js
var colorScale = new chroma.scale('Spectral').domain([1,0]);
// Global Variables for Drawing
var column = 0;
var canvasWidth  = 800;
var canvasHeight = 256;


var fftSize = 1024;


var context = new AudioContext();
var analyserNode = context.createAnalyser();
analyserNode.smoothingTimeConstant = 0.0;
analyserNode.fftSize = fftSize;
// // Create the array for the data values
var frequencyArray = new Uint8Array(analyserNode.frequencyBinCount);

var carFreq = parseInt(document.getElementById('carFreq').value);
var modAmpl = parseInt(document.getElementById('modAmpl').value);
var modFreq = parseInt(document.getElementById('modFreq').value);

// Draw the Spectrogram from the frequency array
// The array has 512 elements - but truncate at 256
function drawSpectrogram() {
    console.log(carFreq);
    // Refresh parameter (change in real time)
    carFreq = parseInt(document.getElementById('carFreq').value);
    modAmpl = parseInt(document.getElementById('modAmpl').value);
    modFreq = parseInt(document.getElementById('modFreq').value);

    analyserNode.getByteFrequencyData(frequencyArray);
    

    for (var i = 0; i < frequencyArray.length; i++) {
        // Get the color from the color map, draw 1x1 pixel rectangle
        ctx.fillStyle = colorScale(frequencyArray[i] / 256.0);
        ctx.fillRect(column,canvasHeight - i, 1, 1);
    }
    if (play) {
        // loop around the canvas when we reach the end
        column += 1;
    }
    
    if(column >= canvasWidth) {
        column = 0;
        clearCanvas();
    }
    animate = requestAnimationFrame(drawSpectrogram);
};
function clearCanvas() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
};



function FM(min, max, slope) {
    // FM Sounds
    // use the frequency parameter instead and use the gain of the
    // modulator to set the amplitude of the tremolo
    modGain.gain.value = 10;
    mod.frequency.value = 1;

    carGain.gain.value = 0.1;
    car.frequency.value = 200;

    mod.connect(modGain);
    modGain.connect(car.frequency);
    osc.connect(oscGain);
    oscGain.connect(context.destination);

}
// mod.connect(carGain.gain);
function AM() {
    // AM Sounds
    // use the gain parameter of the osc: the value of the modulator
    // will modify the gain of the osc:
    masterGain.gain.value = 0.3;
    var mod = context.createOscillator();
    var modGain = context.createGain();
    var car = context.createOscillator();
    var carGain = context.createGain();

    modGain.gain.value = modAmpl;
    mod.type = 'sine';
    mod.frequency.value = modFreq;

    // refresh the values from the sliders
    setInterval(function() {
        modGain.gain.value = modAmpl;
        mod.frequency.value = modFreq;
        car.frequency.value = carFreq;
    }, 100);

    carGain.gain.value = 1;
    car.frequency.value = carFreq;

    mod.connect(modGain);
    mod.connect(carGain.gain);

    car.connect(carGain);
    carGain.connect(masterGain);
    masterGain.connect(analyserNode);
    analyserNode.connect(context.destination);

    mod.start(0);
car.start(0);
    
    frequencyArray = new Uint8Array(analyserNode.frequencyBinCount);
    console.log(frequencyArray)
}


var masterGain = context.createGain();
masterGain.gain.value = 0.3;

var animate;

function stopFun() {
    masterGain.gain.value = 0;
    cancelAnimationFrame(animate);
    play=false;
}


// modGain.gain.value = 1;
// mod.frequency.value = 200;
// mod.connect(modGain);

// carGain.gain.value = 1;
// car.frequency.value = 400;
// car.connect(carGain);

// var masterGain = ctx.createGain();
// masterGain.gain.value = 0.3;
// masterGain.connect(ctx.destination);


// mod.start(0);
// car.start(0);

// mod.connect(car.frequency);
// carGain.connect(masterGain);



$('#FM').on("click", function(e) {
    if (!play) {

    }
})
$('#AM').on("click", function(e) {
    if (!play) {
        AM();
        animate = requestAnimationFrame(drawSpectrogram);
        play = true;
    }
})
$('#stop').on("click", function(e) {
    stopFun();
    play = false;
    masterGain.gain = 0;
})

});
