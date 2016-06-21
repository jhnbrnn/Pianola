let React = require('react')
let ReactDOM = require('react-dom')
let PianolaControls = require('./PianolaControls.jsx')
let PianolaViewer = require('./PianolaViewer.jsx')
let PianolaTracker = require('./PianolaTracker.jsx')
let PianolaNoteInfo = require('./PianolaNoteInfo.jsx')
let NoteUtils = require('../utils/NoteUtils')

let Pianola = React.createClass({
  getInitialState: function () {
    return {
      time: '4/4',
      notes: [
        ['f/4', 'q'],
        ['d/4', 'q'],
        ['r', 'q'],
        [['c/4', 'e/4', 'g/4'], 'q', 'chord'],
        ['r', 'h'],
        [[['e/4', '16'], ['f/4', '16'], ['g/4', '16'], ['a/4', '16']], 'q', 'beam'],
        ['c/5', 'q'],
        ['b/4', 'h'],
        ['r', 'q'],
        ['c/4', 'q']
      ],
      currentNote: -1,
      staveStart: 0,
      staveEnd: 0,
      barLocation: 0,
      noteLocations: [],
      currentNoteObj: {},
      running: false,
      barRunning: false,
      tempo: 120
    }
  },

  getTrackingCanvas: function () {
    return this.refs.tracker
  },

  setTrackingCanvasWidth: function (width) {
    ReactDOM.findDOMNode(this.refs.tracker).width = width
  },

  getViewer: function () {
    return this.refs.viewer
  },

  setProcessedNotes: function (notes) {
    let noteLocations = notes.map(function (note) {
      return note.location
    })
    this.setState({
      processedNotes: notes,
      noteLocations: noteLocations
    })
  },

  setStave: function (stave) {
    this.setState(stave)
  },

  getCurrentNote: function () {
    return this.state.processedNotes[this.state.currentNote]
  },

  getNoteAtLocation: function (location) {
    return this.state.processedNotes[location]
  },

  getNextNoteLocation: function () {
    return this.state.noteLocations[this.state.currentNote]
  },

  nextNote: function () {
    let noteIndex = this.state.currentNote + 1
    let note = this.getNoteAtLocation(noteIndex)
    if (!this.getNoteAtLocation(noteIndex)) {
      return
    }

    this.setState({
      currentNote: noteIndex,
      currentNoteObj: note
    })
    let container = this.refs.canvasContainer
    let last = false

    if (noteIndex === this.state.processedNotes.length - 1) {
      last = true
    }

    // if the note location is past the width of the viewer,
    // set scrollLeft to show the note
    if (last) {
      container.scrollLeft = this.getViewer().getPianoCanvas().width - container.clientWidth
    } else if (note.location >= container.scrollLeft + container.clientWidth) {
      container.scrollLeft = 30 + note.location - container.clientWidth
    }

    this.getTrackingCanvas().draw(note.location, note.width)
  },

  previousNote: function () {
    let noteIndex = this.state.currentNote - 1
    let note = this.getNoteAtLocation(noteIndex)
    if (!this.getNoteAtLocation(noteIndex)) {
      return
    }

    this.setState({
      currentNote: noteIndex,
      currentNoteObj: note
    })
    let container = this.refs.canvasContainer
    let first = false

    if (noteIndex === 0) {
      first = true
    }

    // if the note location is past the width of the viewer,
    // set scrollLeft to show the note
    if (first) {
      container.scrollLeft = 0
    } else if (note.location <= container.scrollLeft) {
      container.scrollLeft = note.location - 30
    }

    this.getTrackingCanvas().draw(note.location, note.width)
  },

  play: function () {
    if (!this.state.running && !this.state.barRunning) {
      console.log('now playing at ' + this.state.tempo + ' bpm')

      this.setState({
        running: true,
        barRunning: true
      })

      this.scrollLeftByNote()
    }
  },

  stop: function () {
    this.setState({
      running: false,
      barRunning: false
    })
  },

  rewind: function () {
    this.stop()
    this.refs.canvasContainer.scrollLeft = 0
    // that.clearBar() =
    // var cx = that.trackingCanvas().getContext('2d')
    // cx.clearRect(bar_location - 1, 0, 6, that.trackingCanvas().height)
    let player_current_note = 0
  },

  scrollCanvasToNote: function (dir, last, note) {
    let container = this.refs.canvasContainer
    let widthOfViewerWindow = container.clientWidth
    let widthOfCanvas = this.getViewer().getPianoCanvas().width

    if (dir === 'ltr') {
      if (last) {
        container.scrollLeft = widthOfCanvas - widthOfViewerWindow
      } else {
        container.scrollLeft = 30 + note - widthOfViewerWindow
      }
    }
  },

  scrollLeftByNote: function () {
    let running = this.state.running
    console.log(running)
    let bar_running = this.state.barRunning
    let widthOfViewerWindow = this.refs.canvasContainer.clientWidth
    let widthOfCanvas = this.getViewer().getPianoCanvas().width
    let widthOfBar = 4
    let noteIndex = this.state.currentNote + 1
    let currentNote = this.getNoteAtLocation(noteIndex)
    let stave_end = this.state.staveEnd
    let num_of_beats = 4

    let tempo = 120

    // check if tracking bar is halfway across viewer window && width of canvas > width of window
    // if so, scroll bar and window
    if (running && bar_running && widthOfCanvas > widthOfViewerWindow && stave_end > widthOfViewerWindow && currentNote.location >= ((widthOfViewerWindow / 2) + (widthOfBar / 2))) {
      this.scrollCanvasToNote('ltr', false, currentNote.location * 1.3)
    }
    // check if we've reached end of canvas.
    if (running === false && noteIndex >= this.state.processedNotes.length) {
      this.setState({
        barRunning: false
      })
      bar_running = false
    } else {
      if (this.refs.canvasContainer.scrollLeft + widthOfViewerWindow >= widthOfCanvas) {
        this.setState({
          running: false
        })
      }

      this.setState({
        currentNote: noteIndex,
        currentNoteObj: currentNote
      })

      let length = NoteUtils.noteLength(currentNote.duration, num_of_beats)
      window.setTimeout(this.scrollLeftByNote, (60 / tempo) * length * 1000)
    }
  },

  render: function () {
    return (
      <div className='inner'>
        <div className='viewer-container'>
          <PianolaNoteInfo currentNote={this.state.currentNoteObj} />
          <div id='pianola-viewer' ref='canvasContainer'>
            <PianolaTracker ref='tracker' currentNote={this.state.currentNoteObj} running={this.state.running} barRunning={this.state.barRunning} />
            <PianolaViewer ref='viewer' staveStart={this.state.staveStart} setStave={this.setStave} setProcessedNotes={this.setProcessedNotes} setTrackingCanvasWidth={this.setTrackingCanvasWidth} timeSignature={this.state.time} notesArray={this.state.notes} />
          </div>
        </div>
        <PianolaControls play={this.play} stop={this.stop} rewind={this.rewind} currentNote={this.state.currentNote} nextNote={this.nextNote} previousNote={this.previousNote} />
      </div>
    )
  }
})

module.exports = Pianola
