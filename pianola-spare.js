  that.getBarRunning = function() {
    return bar_running;
  }

  that.setBarRunning = function(status) {
    if (typeof status === "boolean") {
      bar_running = status;
      return true;
    }
    else {
      return false;
    }
  }

  that.getRunning = function() {
    return running;
  }

  that.setRunning = function(status) {
    if (typeof status === "boolean") {
      running = status;
      return true;
    }
    else {
      return false;
    }
  }

  that.getEndScroll = function() {
    return param.elem.width;
  }

  that.getTempo = function() {
    return tempo;
  }

  that.setTempo = function(temp) {
    if (typeof temp === "number") {
      tempo = temp;
      return tempo;
    }
    return false;
  }

  that.scrollToTheLeft = function() {
    that.elem().scrollLeft++;
    scroll = that.elem().scrollLeft;
    if ((scroll + that.elem().clientWidth + 20) >= that.getCanvas().width || running === false) {
      running = false;
      return;
    }
    else {
      sc = setTimeout(that.scrollToTheLeft, (1/tempo)*1000);
    }
  }

  that.player = function() {
    console.log("now playing at " + tempo + "bpm");
    running = true;
    bar_running = true;
    that.scrollLeftFull();
  }

  that.stopper = function() {
    running = false;
    bar_running = false;
  }

  that.rewinder = function() {
    that.stopper();
    that.elem().scrollLeft = 0;
    that.clearBar();
    //@TODO fix this; shouldn't use fixed value.
    that.setBarLocation(54);
  }

  window.onload = function() {
    /*  var play = document.getElementById("pianola-play");
  var rewind = document.getElementById("pianola-rewind");
  var stop = document.getElementById("pianola-stop");
  var nextStep = document.getElementById("pianola-next");
  var prevStep = document.getElementById("pianola-prev");
  var line = document.getElementById("pianola-line");
  var tempoSave = document.getElementById("tempo-save");
  var tempoForm = document.getElementById("tempo-form");
  var tempoSpan = document.getElementById('tempo-amount');

  var p = pianola({"elem": document.getElementByID("pianola")});
  p.init();

  var p = pianola({"elem": document.getElementById("pianola-viewer"),
                   "noteInfoElem": document.getElementById("note-info"),
                  });
  var bpm = p.getTempo();

  if (tempoSpan.innerText === "") {
    tempoSpan.innerText = bpm + " BPM";
  }

  p.setStaveStart($.Pianola.stave);
  p.setNotes($.Pianola.notes);

  var scroll = p.elem().scrollLeft;
  var width = p.elem().getBoundingClientRect().width;
  var canvasWidth = p.getCanvas().width;
  var endScroll = p.getEndScroll();
  var running = p.getRunning();

  play.onclick = function() {
    p.player();
  }

  rewind.onclick = function() {
    p.rewinder();
  }

  stop.onclick = function() {
    p.stopper();
  }

  nextStep.onclick = function() {
    p.nexter();
  }

  prevStep.onclick = function() {
    p.prever();
  }

  line.onclick = function() {
    p.liner();
  }

  tempoForm.onsubmit = function() {
    event.preventDefault();
    bpm = p.setTempo(parseInt(document.getElementById('tempo-value').value));
    document.getElementById('tempo-amount').innerText = bpm + " BPM";
  }
*/
  }