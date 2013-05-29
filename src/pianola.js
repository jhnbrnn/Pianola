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
      </div> \
    </div>';
    document.getElementById("pianola-next").onclick = function() {
      that.nexter();
    };
    document.getElementById("pianola-prev").onclick = function() {
      that.prever();
    };
    document.getElementById("pianola-line").onclick = function() {
      that.liner();
    };
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

  that.getNotes = function() {
    return notes;
  }

  that.getNoteLocations = function() {
    return next_note_locations;
  }

  that.setNotes = function(arr) {
    for (var x = 0; x < arr.length; x++) {
      for (var y = 0; y < arr[x].length; y++) {
        notes.push({
          noteObj: arr[x][y],
          noteLocation: arr[x][y].tickContext.x + stave_start,
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
      noteFactHelper(pass);

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
      case "s":
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

  return that;
}