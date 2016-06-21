let React = require('react')
let Vex = require('vexflow')

// VARS needed for state
const MEASURE_LENGTH = 500

function getNotesForMeasure (notesArray, measureNumber, timeSignature) {
  let minimum = timeSignature.pulseCount * measureNumber
  let maximum = timeSignature.pulseCount * (measureNumber + 1)
  let totalLengthOfBeats = 0
  return notesArray.filter(function (elem, index, array) {
    totalLengthOfBeats += noteLength(elem[1], timeSignature.pulseCount)
    if (totalLengthOfBeats > minimum && totalLengthOfBeats <= maximum) {
      return true
    } else {
      return false
    }
  })
}

function createVexNote (note) {
  if (Array.isArray(note[0])) {
    return new Vex.Flow.StaveNote({keys: note[0], duration: note[1]})
  } else if (note[0].length > 1) {
    // note case
    return new Vex.Flow.StaveNote({keys: [note[0]], duration: note[1]})
  } else {
    // rest case
    return new Vex.Flow.StaveNote({keys: ['b/4'], duration: note[1] + 'r'})
  }
}

function generateNoteArray (arr) {
  let returnObj = {
    notes: [],
    beams: []
  }

  arr.forEach(function (note) {
    if (note[2] === 'beam') {
      // beam case. array has arrays inside. recursive?
      let beamArray = generateNoteArray(note[0]).notes
      let beam = new Vex.Flow.Beam(beamArray)
      beamArray.forEach(function (beam) {
        returnObj.notes.push(beam)
      })
      returnObj.beams.push(beam)
    } else {
      // rests/notes/chords
      returnObj.notes.push(createVexNote(note))
    }
  })

  return returnObj
}

function renderNotesInMeasure (measure, notesArray, timeSignature, ctx, stave) {
  let arr = getNotesForMeasure(notesArray, measure, timeSignature)
  let notesAndBeams = generateNoteArray(arr)
  renderNotes(notesAndBeams.notes, notesAndBeams.beams, ctx, stave)

  return notesAndBeams.notes
}

function renderNotes (notes, beams, ctx, stave) {
  let voice = new Vex.Flow.Voice({})
  let formatter = new Vex.Flow.Formatter()

  voice.addTickables(notes)
  formatter.joinVoices([voice]).format([voice], 500)
  voice.draw(ctx, stave)
  beams.forEach(function (beam) {
    beam.setContext(ctx).draw()
  })
}

function noteLength (noteString, beatNum) {
  switch (noteString) {
    case 'w':
      return beatNum
    case 'h':
      return beatNum / 2
    case 'q':
      return beatNum / 4
    case '8':
      return beatNum / 8
    case '16':
      return beatNum / 16
    case '32':
      return beatNum / 32
  }
}

function countBeats (notesArray, beatNum) {
  // notesArray: an array of arrays. Each internal
  // array represents a note of a certain value.
  // individual note arrays are constructed by the
  // format: [String|Array noteValue, String noteLength(, String noteType)]

  return notesArray.reduce(function (previousValue, currentValue) {
    return previousValue + noteLength(currentValue[1], beatNum)
  }, 0)
}

let PianolaViewer = React.createClass({
  componentDidMount: function () {
    let digitRegex = /\d+/g
    let numberOfBeats = parseInt(digitRegex.exec(this.props.timeSignature))
    let beatValue = parseInt(digitRegex.exec(this.props.timeSignature))
    let timeSignature = {
      noteValue: beatValue,
      pulseCount: numberOfBeats
    }
    let notesArray = this.props.notesArray
    let canvas = this.getPianoCanvas()
    let numberOfStaves = countBeats(notesArray, numberOfBeats) / beatValue
    let renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS)
    let ctx = renderer.getContext()
    let renderedNotes = []

    canvas.width = numberOfStaves * (10 + MEASURE_LENGTH)
    this.props.setTrackingCanvasWidth(canvas.width)

    let staveStart

    for (let i = 0; i < numberOfStaves; i++) {
      let stave = new Vex.Flow.Stave(10 + i * MEASURE_LENGTH, 0, MEASURE_LENGTH)
      if (i === 0) {
        stave.addClef('treble')
      }
      stave.setContext(ctx).draw()

      let notes = renderNotesInMeasure(i, notesArray, timeSignature, ctx, stave)
      renderedNotes.push(notes)
      if (i === 0) {
        staveStart = this.setStaveStart(stave)
      } else if (i === numberOfStaves - 1) {
        this.setStaveEnd(stave)
      }
    }
    this.setNotes(renderedNotes, staveStart)
  },
  setNotes (notesArray, staveStart) {
    let notes = notesArray.reduce(function (previous, current, index) {
      let b = current.map(function (note) {
        note.measure = index
        return note
      })
      return previous.concat(b)
    }, []).map(function (note) {
      let starter = note.stave.start_x + 10
      let noteObj = {
        noteObj: note,
        location: Math.floor(note.tickContext.x + starter),
        duration: note.duration,
        type: note.noteType,
        props: note.keyProps,
      }

      if (note.isRest()) {
        noteObj.width = note.tickContext.notePx + note.tickContext.padding
      } else {
        noteObj.width = note.tickContext.notePx + 2 * note.tickContext.padding
      }

      return noteObj
    })
    this.props.setProcessedNotes(notes)
  },
  setStaveStart (stave) {
    let start = stave.start_x + stave.x
    this.props.setStave({
      staveStart: start,
      barLocation: Math.floor(start)
    })
    return start
  },
  setStaveEnd (stave) {
    this.props.setStave({
      staveEnd: stave.x + stave.width
    })
  },

  getPianoCanvas: function () {
    return this.refs.piano
  },

  render: function () {
    return (
      <canvas id='piano' ref='piano' width='1' height='128'></canvas>
    )
  }
})

module.exports = PianolaViewer
