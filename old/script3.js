$(document).ready(function() {
var canvas = $("div.one div#pianola-viewer canvas")[0];
var renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS);

var ctx = renderer.getContext();
var stave = new Vex.Flow.Stave(10, 0, 500);

// Add a treble clef
stave.addClef("treble");
stave.setContext(ctx).draw();

var notes = [
  new Vex.Flow.StaveNote({ keys: ["e##/5"], duration: "8d"}).addAccidental(0, new Vex.Flow.Accidental("##")).addDotToAll(),
  new Vex.Flow.StaveNote({ keys: ["eb/5"], duration: "16"}).addAccidental(0, new Vex.Flow.Accidental("b")),
  new Vex.Flow.StaveNote({ keys: ["d/5"], duration: "h"}),
  new Vex.Flow.StaveNote({ keys: ["c/5", "eb/5", "g#/5"], duration: "q"}).addAccidental(1, new Vex.Flow.Accidental("b")).addAccidental(2, new Vex.Flow.Accidental("#"))
];

Vex.Flow.Formatter.FormatAndDraw(ctx, stave, notes);
});
