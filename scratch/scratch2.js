/* global AudioContext */
window.onload = init

var context = new AudioContext()
var oscillator = context.createOscillator()
var oscType = 'sine'
var gain = context.createGain()

var hertz
var playButton
var stopButton
var gainSlider
var stepButton
var octaveUpButton
var octaveDownButton
var chordButton
var oscillatorSelect

oscillator.type = oscType
oscillator.frequency.value = 440

function play () {
  oscillator.connect(context.destination)
  oscillator.connect(gain)
  gain.connect(context.destination)
  gain.gain.value = 0.5
  oscillator.start()
}

function stop () {
  oscillator.disconnect()
}

function gainChange () {
  gain.gain.value = gainSlider.value
}

function step () {
  var curr = oscillator.frequency.value * Math.pow(2, 1 / 12)
  updateFreq(curr)
}

function octaveUp () {
  var val = oscillator.frequency.value * 2
  updateFreq(val)
}

function octaveDown () {
  var val = oscillator.frequency.value / 2
  updateFreq(val)
}

function createChord () {
  var root = oscillator.frequency.value
  var third = root * Math.pow(Math.pow(2, 1 / 12), 4)
  var fifth = third * Math.pow(Math.pow(2, 1 / 12), 3)
  var oct = oscillator.frequency.value * 2
  var thirdOsc = context.createOscillator()
  thirdOsc.type = oscType
  thirdOsc.frequency.value = third
  var fifthOsc = context.createOscillator()
  fifthOsc.type = oscType
  fifthOsc.frequency.value = fifth
  var octOsc = context.createOscillator()
  octOsc.type = oscType
  octOsc.frequency.value = oct
  thirdOsc.connect(context.destination)
  fifthOsc.connect(context.destination)
  octOsc.connect(context.destination)
  thirdOsc.start(0)
  fifthOsc.start(0)
  octOsc.start(0)
}

function changeOscillatorType () {
  oscType = oscillatorSelect.value
  oscillator.type = oscillatorSelect.value
}

function updateFreq (freq) {
  document.getElementById('hertz').value = parseFloat(freq, 10)
  oscillator.frequency.value = parseFloat(freq, 10)
}

function init () {
  hertz = document.querySelector('#hertz')
  playButton = document.querySelector('#play')
  stopButton = document.querySelector('#stop')
  gainSlider = document.querySelector('#gain')
  stepButton = document.querySelector('#step')
  octaveUpButton = document.querySelector('#oct-up')
  octaveDownButton = document.querySelector('#oct-down')
  chordButton = document.querySelector('#chord')
  oscillatorSelect = document.querySelector('#oscType')

  hertz.value = oscillator.frequency.value
  playButton.onclick = play
  stopButton.onclick = stop
  gainSlider.onchange = gainChange
  stepButton.onclick = step
  octaveUpButton.onclick = octaveUp
  octaveDownButton.onclick = octaveDown
  chordButton.onclick = createChord
  oscillatorSelect.addEventListener('change', changeOscillatorType)
}
