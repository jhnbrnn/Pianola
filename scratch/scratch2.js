window.onload = init;
var context,
    oscillator,
    oscType,
    gain;

function init() {
  context = new webkitAudioContext(),
  oscillator = context.createOscillator()
  gain = context.createGainNode();
  oscType = 0;
  oscillator.type = oscType;
  oscillator.frequency.value = 440;
  document.getElementById('hertz').value = oscillator.frequency.value;
  document.getElementById('play').onclick = function() {
    oscillator.connect(context.destination);
    oscillator.connect(gain);
    gain.connect(context.destination);
    gain.gain.value = 0.5;
    oscillator.noteOn(0);
    oscillator.noteOff(2);
  }
  document.getElementById('stop').onclick = function() {
    oscillator.disconnect();
  }
  document.getElementById('gain').onchange = function() {
    gain.gain.value = this.value;
  }
  /*document.getElementById('freq').onchange = function() {
    updateFreq(document.getElementById('freq').value);
  }*/
  document.getElementById('step').onclick = function() {
    //oscillator.disconnect();
    var curr = oscillator.frequency.value * Math.pow(2, 1/12);
    updateFreq(curr);
  }
  document.getElementById('oct-up').onclick = function() {
    //oscillator.disconnect();
    var val = oscillator.frequency.value * 2;
    updateFreq(val);
  }
  document.getElementById('oct-down').onclick = function() {
    //oscillator.disconnect();
    var val = oscillator.frequency.value / 2;
    updateFreq(val);
  }
  document.getElementById('chord').onclick = function() {
    var root = oscillator.frequency.value;
    var third = root * Math.pow(Math.pow(2, 1/12), 4);
    var fifth = third * Math.pow(Math.pow(2, 1/12), 3);
    var oct = oscillator.frequency.value * 2;
    var thirdOsc = context.createOscillator();
    thirdOsc.type = oscType;
    thirdOsc.frequency.value = third;
    var fifthOsc = context.createOscillator();
    fifthOsc.type = oscType;
    fifthOsc.frequency.value = fifth;
    var octOsc = context.createOscillator();
    octOsc.type = oscType;
    octOsc.frequency.value = oct;
    thirdOsc.connect(context.destination);
    fifthOsc.connect(context.destination);
    octOsc.connect(context.destination);
    thirdOsc.noteOn(0);
    fifthOsc.noteOn(0);
    octOsc.noteOn(0);
  }
  document.getElementById('oscType').addEventListener('change', function() {
    oscType = this.value;
    oscillator.type = this.value;
  });
}

function updateFreq(freq) {
  document.getElementById("hertz").value = parseFloat(freq, 10);
  oscillator.frequency.value = parseFloat(freq, 10);
  //oscillator.connect(gain);
  //oscillator.noteOn(0);
}