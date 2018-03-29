import { Spectro } from './modules/Spectro'
import { Audio } from './modules/Audio'
import 'bootstrap';

$(document).ready(function() {

// Get the visual context to draw on the canvas
var visualCtx = $("#canvas").get()[0].getContext("2d");
const spectro;
const audio;

function init() {
  // Compatibility browsers
  let audioContext = window.AudioContext|| window.webkitAudioContext;
  let audioCtx = new audioContext();

  // Get values from inpu sliders
  var carFreq = parseInt(document.getElementById('carFreq').value);
  var modAmpl = parseInt(document.getElementById('modAmpl').value);
  var modFreq = parseInt(document.getElementById('modFreq').value);

  // Instanciate modules
  var fftSize = 2048;
  spectro = new Spectro({
    audioCtx,
    fftSize,
    carFreq,
    modAmpl,
    modFreq,
    visualCtx
  });
  audio = new Audio({ audioCtx, spectro });
}

var firstInteraction = true;

// Define button actions
$('#FM').on("click", function(e) {
  if (firstInteraction) {
    init();
    firstInteraction = false;
  }
  if (!spectro.play) {
    audio.FM();
    spectro.animate = requestAnimationFrame(()=>spectro.draw());
    spectro.play = true;
  } else {
    audio.stop();
    spectro.play = false;
    cancelAnimationFrame(spectro.animate);
  }
});
$('#AM').on("click", function(e) {
  if (firstInteraction) {
    init();
    firstInteraction = false;
  }
  if (!spectro.play) {
    audio.AM();
    spectro.animate = requestAnimationFrame(()=>spectro.draw());
    spectro.play = true;
  } else {
    audio.stop();
    spectro.play = false;
    cancelAnimationFrame(spectro.animate);
  }
});
$('#stop').on("click", function(e) {
  spectro.stop();
  audio.stop();
});

});
