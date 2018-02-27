export class Audio {
  // Create amplitude and frequency modulated sounds and change parameters
  // in real time
  constructor({ audioCtx, spectro }) {
    this.audioCtx = audioCtx;
    this.spectro = spectro;
    this.masterGain = this.audioCtx.createGain();
    this.masterGain.gain.value = 0.3;

    this.mod = null;
    this.modGain = null;
    this.car = null;
    this.carGain = null;
  }
  FM() {
    // FM Sounds
    // use the frequency parameter instead and use the gain of the
    // modulator to set the amplitude of the tremolo

    // Enable audio context after user gesture (see https://developers.google.com/web/updates/2017/09/autoplay-policy-changes#webaudio)
    this.audioCtx.resume();

    this.mod = this.audioCtx.createOscillator();
    this.modGain = this.audioCtx.createGain();
    this.car = this.audioCtx.createOscillator();
    this.carGain = this.audioCtx.createGain();
    this.modGain.gain.value = this.spectro.modAmpl;
    this.mod.frequency.value = this.spectro.modFreq;

    this.carGain.gain.value = 1;
    this.car.frequency.value = this.spectro.carFreq;

    // refresh the values from the sliders
    setInterval(()=> {
      this.modGain.gain.value = this.spectro.modAmpl;
      this.mod.frequency.value = this.spectro.modFreq;
      this.car.frequency.value = this.spectro.carFreq;
    }, 100);

    this.mod.start(0);
    this.car.start(0);

    this.mod.connect(this.modGain);
    this.modGain.connect(this.car.frequency);
    this.car.connect(this.masterGain);
    this.masterGain.connect(this.spectro.analyserNode);
    this.spectro.analyserNode.connect(this.audioCtx.destination);
  }
  AM() {
    // AM Sounds
    // use the gain parameter of the osc: the value of the modulator
    // will modify the gain of the osc:

    // Enable audio context after user gesture (see https://developers.google.com/web/updates/2017/09/autoplay-policy-changes#webaudio)
    this.audioCtx.resume();

    this.mod = this.audioCtx.createOscillator();
    this.modGain = this.audioCtx.createGain();
    this.car = this.audioCtx.createOscillator();
    this.carGain = this.audioCtx.createGain();

    this.modGain.gain.value = this.spectro.modAmpl;
    this.mod.type = 'sine';
    this.mod.frequency.value = this.spectro.modFreq;

    // refresh the values from the sliders
    setInterval(()=> {
      this.modGain.gain.value = this.spectro.modAmpl;
      this.mod.frequency.value = this.spectro.modFreq;
      this.car.frequency.value = this.spectro.carFreq;
    }, 100);

    this.carGain.gain.value = 1;
    this.car.frequency.value = this.spectro.carFreq;

    this.mod.connect(this.modGain);
    this.mod.connect(this.carGain.gain);

    this.car.connect(this.carGain);
    this.carGain.connect(this.masterGain);
    this.masterGain.connect(this.spectro.analyserNode);
    this.spectro.analyserNode.connect(this.audioCtx.destination);

    this.mod.start(0);
    this.car.start(0);
  }
  stop() {
    this.mod.stop();
    this.car.stop();
  }
}