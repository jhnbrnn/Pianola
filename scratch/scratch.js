
var context;
window.addEventListener('load', init, false);
function init() {
  try {
    var dogBarkingBuffer = null;
    context = new webkitAudioContext();
    function loadDogSound(url) {
      var request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.responseType = 'arraybuffer';

      request.onload = function() {
        context.decodeAudioData(request.response, function(buffer) {
          dogBarkingBuffer = buffer;
        });
      }
      request.send();
    }
    function playSound(buffer) {
      var source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(context.destination);
      source.noteOn(0);
    }
    loadDogSound("http://localhost/Epoq.ogg");

    document.getElementById('play').onclick = function() {
      playSound(dogBarkingBuffer);
    }
  }
  catch(e) {
    alert('web audio API is not supported in this browser');
  }
}

