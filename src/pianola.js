/**
 *
 * v0.1 of the Pianola library
 *
 * Copyright (c) 2012 John Brennan [johnalanbrennan@gmail.com]
 *
 * Pianola is a library for reading and writing music notation created
 * by the Vexflow library (http://www.vexflow.com).
 *
 * Vexflow Copyright (c) Mohit Muthanna Cheppudira <mohit@muthanna.com>
 */

var pianola = function(param) {
  var that                = {},
      running             = false,
      bar_running         = false,
      tempo               = 120,
      bar_location        = 0,
      notes               = [],
      next_note_locations = [],
      prev_note_locations = [],
      stave_start         = 0,
      stave_end           = 0,
      lines               = false;

  that.init = function() {
    var frame = param.elem;
    frame.innerHTML =
    '<div class=\"inner\"> \
      <div id="note-info"> \
        <span id="note-info-type"></span> \
        <span id="note-info-note"></span> \
        <span id="note-info-desc"></span> \
      </div> \
      <div id="pianola-viewer"> \
        <canvas id="tracker" width=1220 height=122px></canvas> \
        <canvas id="piano" width=1220 height=122px> \
        </canvas> \
      </div> \
      <div class="pianola-controls-h"> \
        <span id="pianola-next" class="pianola-control pianola-button pianola-button-h" onselectstart="return false;">Next</span> \
        <span id="pianola-prev" class="pianola-control pianola-button pianola-button-h" onselectstart="return false;">Prev</span> \
        <span id="pianola-line" class="pianola-control pianola-button pianola-button-h" onselectstart="return false;">Lines</span> \
        <span id="pianola-play" class="pianola-control pianola-button pianola-button-h" onselectstart="return false;">Play</span> \
      </div> \
    </div>';
    document.getElementById("pianola-play").onclick = function() {
      that.player();
    }
    document.getElementById("pianola-next").onclick = function() {
      that.nexter();
    };
    document.getElementById("pianola-prev").onclick = function() {
      that.prever();
    };
    document.getElementById("pianola-line").onclick = function() {
      that.liner();
    };
    renderNotes(param.notes, param.time);
  }

  var renderNotes = function(notesArray, timeSig) {
    var timeRe = /\d+/g;
    var number_of_beats = parseInt(timeRe.exec(timeSig));
    var beat_value = parseInt(timeRe.exec(timeSig));

    var canvas = that.getCanvas();
    var renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS);

    var ctx = renderer.getContext();
    var num_staves = countBeats(notesArray, number_of_beats) / beat_value;
    var all_notes =[];
    for (var i = 0; i < num_staves; i++) {
      var stave = new Vex.Flow.Stave(10+(i*500), 0, 500);
      if (i == 0) {
        stave.addClef("treble").setContext(ctx).draw();
      } else {
        stave.setContext(ctx).draw();
      }
      var notes = renderNotesInMeasure(i, notesArray, beat_value, number_of_beats, ctx, stave);
      all_notes.push(notes);
      if (i == 0) {
        that.setStaveStart(stave);
      } else if (i == num_staves-1) {
        that.setStaveEnd(stave);
      }

    }
    that.setNotes(all_notes);
  }

  var renderNotesInMeasure = function(measure, notesArray, beatVal, beatNum, ctx, stave) {
    var notes = [],
        beams = [],
        beatsLength = 0,
        next;
    //@TODO handle measure counting in this, incl. recursive call below
    for (var x = 0; x < notesArray.length; x++) {
      var note = notesArray[x];
      beatsLength += noteLength(note[1], beatNum);
      if (measure >= 0 && beatsLength > beatNum*(measure+1)) {
        break;
      }
      if (measure >= 0 && beatsLength <= beatNum*measure) {
        continue;
      }
      var staveNote;
      if (typeof note[0] == "string") {
        //we're dealing with a rest or a note, not a chord/beam
        if (note[0].length > 1) {
          // note case
          staveNote = new Vex.Flow.StaveNote({ keys: [note[0]], duration: note[1]});
        } else {
          // rest case
          staveNote = new Vex.Flow.StaveNote({ keys: ["b/4"], duration: note[1]+"r"});
        }
        notes.push(staveNote);
      } else {
        // we're dealing with a beam or a chord
        if (note[2] == "chord") {
          // chord case. array has strings inside.
          staveNote = new Vex.Flow.StaveNote({ keys: note[0], duration: note[1]});
          notes.push(staveNote);
        } else {
          // beam case. array has arrays inside. recursive?
          var beamArray = renderNotesInMeasure(-1, note[0], beatVal, beatNum, ctx);
          var beam = new Vex.Flow.Beam(beamArray);
          for (var f = 0; f < beamArray.length; f++) {
            notes.push(beamArray[f]);
          }
          beams.push(beam);
        }
      }
    }
    if (measure >= 0) {
      var voice = new Vex.Flow.Voice({
        num_beats: beatNum,
        beat_value: beatVal,
        resolution: Vex.Flow.RESOLUTION
      });
      voice.addTickables(notes);
      var formatter = new Vex.Flow.Formatter().joinVoices([voice]).format([voice], 500);
      voice.draw(ctx, stave);
      for (var i = 0; i < beams.length; i++) {
        beams[i].setContext(ctx).draw();
      }
    }

    return notes;
  }

  var countBeats = function(notesArray, beatNum) {
    // notesArray: an array of arrays. Each internal
    // array represents a note of a certain value.
    // individual note arrays are constructed by the
    // format: [String|Array noteValue, String noteLength(, String noteType)]

    // First, we determine how many beats are used.
    var beatsLength = 0;
    for (var i = 0; i < notesArray.length; i++) {
      beatsLength += noteLength(notesArray[i][1], beatNum)
      //console.log(notesArray[i][2]);
    }
    return beatsLength;
  }

  //@TODO should parse noteString to handle
  // values above 32nd notes
  // @TODO this isn't calculating correctly
  var noteLength = function(noteString, beatNum) {
    switch(noteString) {
      case "w":
        return beatNum;
      case "h":
        return beatNum / 2;
      case "q":
        return beatNum / 4;
      case "8":
        return beatNum / 8;
      case "16":
        return beatNum / 16;
      case "32":
        return beatNum / 32;
    }
  }

  that.elem = function() {
    return document.getElementById('pianola-viewer');
  }

  that.noteInfoElem = function() {
    return document.getElementById('note-info');
  }

  that.getCanvas = function() {
    return that.elem().lastElementChild;
  }

  that.trackingCanvas = function() {
    return that.elem().firstElementChild;
  }

  that.setStaveStart = function(stave) {
    stave_start = stave.start_x + stave.glyph_start_x;
    that.setBarLocation(Math.floor(stave_start));
  }

  that.setStaveEnd = function(stave) {
    stave_end = stave.x + stave.width;
  }

  that.getNotes = function() {
    return notes;
  }

  that.getNoteLocations = function() {
    return next_note_locations;
  }

  that.setNotes = function(arr) {
    console.log(arr);
    for (var x = 0; x < arr.length; x++) {
      for (var y = 0; y < arr[x].length; y++) {

        var starter = stave_start + x*500;
        notes.push({
          noteObj: arr[x][y],
          noteLocation: arr[x][y].tickContext.x + starter,
          noteDuration: arr[x][y].duration,
          noteType: arr[x][y].noteType,
          noteProps: arr[x][y].keyProps,
        });
      }
    }
    for (var z = 0; z < notes.length; z++) {
      next_note_locations.push(notes[z].noteLocation);
    }
  }

  that.setBarLocation = function(pos) {
    bar_location = pos;
  }

  that.getBarLocation = function() {
    return bar_location;
  }

  that.clearBar = function() {
    cx = that.trackingCanvas().getContext('2d');
    cx.clearRect(bar_location-1, 0, 6, 122);
  }

  that.liner = function() {
    var arr = next_note_locations;
    var cx = that.trackingCanvas().getContext('2d');
    for (var i = 0; i < arr.length; i++) {
      if (!lines) {
        cx.fillStyle = '#FFA033';
        cx.fillRect(arr[i], 0, 4, 122);
      } else {
        cx.clearRect(arr[i]-1, 0, 6, 122);
      }
    }
    if (lines) {
      lines = false;
    } else {
      lines = true;
    }
  }

  that.nexter = function() {
    cx = that.trackingCanvas().getContext('2d');
    var note = next_note_locations.shift();
    if (note) {
      var nnl = next_note_locations.length;
      var nl = notes.length;
      var pass = nl - nnl - 1;
      var pass = notes[pass];
      console.log(pass);
      noteFactHelper(pass);
      console.log(note);
      prev_note_locations.unshift(note);
      cx.fillStyle = '#FFA033';
      cx.fillRect(note, 0, 4, 122);
    }
  }

  that.prever = function() {
    cx = that.trackingCanvas().getContext('2d');
    var note = prev_note_locations.shift();
    if (note) {
      var pnl = prev_note_locations.length;
      if (pnl > 0) {
        var pass = notes[pnl-1];
      } else {
        var pass = null;
      }
      noteFactHelper(pass);

      next_note_locations.unshift(note);
      cx.clearRect(note - 1, 0, 6, 122);
    }
  }

  var noteFactHelper = function(NoteArrayObj) {
    var type = document.getElementById("note-info-type");
    var note = document.getElementById("note-info-note");
    var desc = document.getElementById("note-info-desc");
    var typeText = "", noteText = "", descText = "";
    if (NoteArrayObj == null) {
      type.innerText = "";
      note.innerText = "";
      desc.innerText = "";
      return;
    }
    switch (NoteArrayObj.noteDuration) {
      case "q":
        descText = "quarter ";
        break;
      case "h":
        descText = "half ";
        break;
      case "w":
        descText = "whole ";
        break;
      case "e":
        descText = "eighth ";
        break;
      case "16":
        descText = "sixteenth ";
        break;
      default:
        break;
    }
    if (NoteArrayObj.noteProps.length > 1) {
      typeText = "chord";
      descText += "note";
      for (var x = 0; x < NoteArrayObj.noteProps.length; x++) {
        var noteProp = NoteArrayObj.noteProps[x];
        noteText += noteProp.key + "/" + noteProp.octave + ", ";
      }
      noteText = noteText.slice(0, -2);
    } else if (NoteArrayObj.noteType === "n") {
      typeText = "note";
      descText += "note";
      var noteProp = NoteArrayObj.noteProps[0];
      noteText = noteProp.key + "/" + noteProp.octave;
    } else if (NoteArrayObj.noteType === "r") {
      typeText = "rest";
      descText += "rest";
    }
    type.innerText = typeText;
    note.innerText = noteText;
    desc.innerText = descText;
  }

  var tempo = 120,
      running = false,
      bar_running = false;

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

  that.scrollLeftFull = function() {
    if (running === false && bar_running === false) {
      return;
    }
    var widthOfViewerWindow = that.elem().clientWidth,
        widthOfCanvas       = that.getCanvas().width,
        currentBarPos       = bar_location,
        widthOfBar          = 4,
        heightOfBar         = that.getCanvas().height,
        scroll              = that.elem().scrollLeft;
    var redrawBar = function() {
          var cx = that.trackingCanvas().getContext('2d');
          cx.clearRect(currentBarPos-1, 0, widthOfBar, heightOfBar);
          cx.fillRect(currentBarPos, 0, widthOfBar, heightOfBar);
          currentBarPos++;
          that.setBarLocation(currentBarPos);
        };

    // check if tracking bar is halfway across viewer window && width of canvas > width of window
    // if so, scroll bar and window
    if (running && bar_running && widthOfCanvas > widthOfViewerWindow && stave_end > widthOfViewerWindow && currentBarPos >= ((widthOfViewerWindow / 2) + (widthOfBar / 2)) ) {
      redrawBar();
      that.elem().scrollLeft++;
      scroll++;
    }
    else {
      redrawBar();
    }
    console.log(stave_end);
    // check if we've reached end of canvas.
    if (running === false && currentBarPos >= /*widthOfCanvas - 10*/stave_end) {
      bar_running = false;
      return;
    }
    else if ((scroll + widthOfViewerWindow/* + 20*/) >= stave_end/*widthOfCanvas*/) {
      running = false;
      sc = setTimeout(that.scrollLeftFull, (1/tempo)*1000);
    }
    else {
      sc = setTimeout(that.scrollLeftFull, (1/tempo)*1000);
    }

  }

  that.player = function() {
    console.log("now playing at " + tempo + " bpm");
    running = true;
    bar_running = true;
    that.scrollLeftFull();
  }

  return that;
}