$(document).ready(function () {
  var canvas = $("div.one div#pianola-viewer canvas")[0];
  var renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS);

  var ctx = renderer.getContext();
  var stave = new Vex.Flow.Stave(10, 0, 500);

  stave.addClef("treble");
  stave.setContext(ctx).draw();

  var notes = [
    new Vex.Flow.StaveNote({ keys: ["e/5"], duration: "q" }),
    new Vex.Flow.StaveNote({ keys: ["d/5"], duration: "h" }),
    new Vex.Flow.StaveNote({ keys: ["c/5", "e/5", "g/5"], duration: "q"})
  ];

  var notes2 = [
  new Vex.Flow.StaveNote({ keys: ["c/4"], duration: "w" })
  ];

  function create_4_4_voice() {
    return new Vex.Flow.Voice({
      num_beats: 4,
      beat_value: 4,
      resolution: Vex.Flow.RESOLUTION
    });
  }

  var voice = create_4_4_voice().addTickables(notes);
  var voice2 = create_4_4_voice().addTickables(notes2);

  var formatter = new Vex.Flow.Formatter().joinVoices([voice, voice2]).format([voice, voice2], 500);

  voice.draw(ctx, stave);
  voice2.draw(ctx, stave);

});