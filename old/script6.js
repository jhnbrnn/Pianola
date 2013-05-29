$(document).ready(function() {

var canvas = $("div.one div#pianola-viewer canvas")[0];
var renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS);
var ctx = renderer.getContext();

var stave = new Vex.Flow.Stave(10, 0, 500);
stave.addClef("treble");
stave.setContext(ctx).draw();

var notes = 
});