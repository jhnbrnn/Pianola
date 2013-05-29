$(document).ready(function() {

});

window.onload = function() {

  var p = pianola({
    "elem": document.getElementById("pianola"),
    "time": "4/4",
    "notes": [
      ["c/4", "q"],
      ["d/4", "q"],
      ["r", "q"],
      [["c/4","e/4","g/4"], "q", "chord"],
      ["r", "h"],
      [[["c/4", "16"],["d/4", "16"],["e/4", '16'],["f/4", '16']], "q", "beam"],
      ["c/6", "q"]
    ]
  });

  p.init();

  //var canvas = p.getCanvas();
  //var renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS);

  // var ctx = renderer.getContext();
  // var stave = new Vex.Flow.Stave(10, 0, 500);
  // var stave2 = new Vex.Flow.Stave(510, 0, 500);
  // stave.addClef("treble").setContext(ctx).draw();
  // stave2.setContext(ctx).draw();
  // console.log(stave);
  // console.log(stave2);
  // Create the notes
  // var notes = [
  //   // A quarter-note C.
  //   new Vex.Flow.StaveNote({ keys: ["c/4"], duration: "q" }),

  //   // A quarter-note D.
  //   new Vex.Flow.StaveNote({ keys: ["d/4"], duration: "q" }),

  //   // A quarter-note rest. Note that the key (b/4) specifies the vertical
  //   // position of the rest.
  //   new Vex.Flow.StaveNote({ keys: ["b/4"], duration: "qr" }),

  //   // A C-Major chord.
  //   new Vex.Flow.StaveNote({ keys: ["c/4", "e/4", "g/4"], duration: "q" }),
  // ];
  // var notes2_1 = [
  //   new Vex.Flow.StaveNote({ keys: ["b/4"], duration: "hr" }),

  // ];
  // var notes2_2 = [
  //   new Vex.Flow.StaveNote({ keys: ["d/4"], duration: "16" }),
  //   new Vex.Flow.StaveNote({ keys: ["e/4"], duration: "16" }),
  //   new Vex.Flow.StaveNote({ keys: ["f/4"], duration: "16" }),
  //   new Vex.Flow.StaveNote({ keys: ["g/4"], duration: "16" }),
  // ];
  // var notes2_3 = [
  //   new Vex.Flow.StaveNote({ keys: ["c/6"], duration: "q"})
  // ]
  // var beam = new Vex.Flow.Beam(notes2_2);
  // var notes2 = notes2_1.concat(notes2_2).concat(notes2_3);

  // // Create a voice in 4/4
  // var voice = new Vex.Flow.Voice({
  //   num_beats: 4,
  //   beat_value: 4,
  //   resolution: Vex.Flow.RESOLUTION
  // });
  // // Add notes to voice
  // voice.addTickables(notes);

  // var voice2 = new Vex.Flow.Voice({
  //   num_beats: 4,
  //   beat_value: 4,
  //   resolution: Vex.Flow.RESOLUTION
  // });
  // voice2.addTickables(notes2);
  // // Format and justify the notes to 500 pixels
  // var formatter = new Vex.Flow.Formatter().joinVoices([voice]).format([voice], 500);
  // var formatter2 = new Vex.Flow.Formatter().joinVoices([voice2]).format([voice2], 500);
  // //var formatter = new Vex.Flow.Formatter().joinVoices([voice]).format([voice], 500);
  // // Render voice

  // p.setStaveStart(stave);
  // p.setStaveEnd(stave2);
  // p.setNotes([notes, notes2]);

  // voice.draw(ctx, stave);
  // voice2.draw(ctx, stave2);
  // beam.setContext(ctx).draw();
}