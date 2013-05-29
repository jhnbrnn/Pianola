$(document).ready(function() {

  var canvas = $("div.one div#pianola-viewer canvas#piano")[0];
  var renderer = new Vex.Flow.Renderer(canvas, 
    Vex.Flow.Renderer.Backends.CANVAS);

  var ctx = renderer.getContext();
  var stave = new Vex.Flow.Stave(10, 0, 400);
  var stave2 = new Vex.Flow.Stave(410, 0, 400);
  var stave3 = new Vex.Flow.Stave(810, 0, 400);
  stave.addClef("treble");
  stave.setContext(ctx).draw();
  stave2.setContext(ctx).draw();
  stave3.setContext(ctx).draw();


  var notes = [
    new Vex.Flow.StaveNote({
      keys: ["e/5"], duration: "8d"
    }).
    addAccidental(0, new Vex.Flow.Accidental("##")).addDotToAll(),
    new Vex.Flow.StaveNote({ keys: ["b/4"], duration: "16"}).
    addAccidental(0, new Vex.Flow.Accidental("b"))
  ];

  var notes2 = [
    new Vex.Flow.StaveNote({ keys: ["c/4"], duration: "8"}),
    new Vex.Flow.StaveNote({ keys: ["d/4"], duration: "16"}),
    new Vex.Flow.StaveNote({keys: ["e/4"], duration: "16"}).
    addAccidental(0, new Vex.Flow.Accidental("b"))
  ];

  var notes3 = [
    new Vex.Flow.StaveNote({ keys: ["d/4"], duration: "16" }),
    new Vex.Flow.StaveNote({ keys: ["e/4"], duration: "16" }).
      addAccidental(0, new Vex.Flow.Accidental("#")),
    new Vex.Flow.StaveNote({ keys: ["g/4"], duration: "32"}),
    new Vex.Flow.StaveNote({ keys: ["a/4"], duration: "32"}),
    new Vex.Flow.StaveNote({ keys: ["g/4"], duration: "16"})
  ]

  var notes4 = [ new Vex.Flow.StaveNote({ keys: ["d/4"], duration: "q"})];
  //var bar = new Vex.Flow.Barline();

  var notes5 = [ new Vex.Flow.StaveNote({ keys: ["c/4"], duration: "w"})];

  var notes6 = [ new Vex.Flow.StaveNote({ keys: ["c/4"], duration: "h"}),
  new Vex.Flow.StaveNote({ keys: ["e/4"], duration: "h"})
  ];

  //var bar = [new Vex.Flow.BarNote()];
  //var bar2 = [new Vex.Flow.BarNote()];
  var beam = new Vex.Flow.Beam(notes);
  var beam2 = new Vex.Flow.Beam(notes2);
  var beam3 = new Vex.Flow.Beam(notes3);

  var m1_notes = notes.concat(notes2).concat(notes3).concat(notes4);
  var m2_notes = notes5;
  var m3_notes = notes6;
  /*var voice = new Vex.Flow.Voice({
    num_beats: 4,
    beat_value: 4,
    resolution: Vex.Flow.RESOLUTION
  });

  voice.addTickables(all_notes);
  var formatter = new Vex.Flow.Formatter().
  joinVoices([voice]).format([voice], 500);

  voice.draw(ctx, stave);
*/
  Vex.Flow.Formatter.FormatAndDraw(ctx, stave, m1_notes);
  Vex.Flow.Formatter.FormatAndDraw(ctx, stave2, m2_notes);
  Vex.Flow.Formatter.FormatAndDraw(ctx, stave3, m3_notes);

  $.Pianola = {};
  $.Pianola.notes = [m1_notes];
  $.Pianola.stave = stave;

  beam.setContext(ctx).draw();
  beam2.setContext(ctx).draw();
  beam3.setContext(ctx).draw();

});