let React = require('react')

let PianolaTracker = React.createClass({
  shouldComponentUpdate: function (props) {
    if (props.running || props.barRunning) {
      return true
    }
    return false
  },
  componentWillUpdate: function (props, state) {
    this.redrawBar(props.currentNote)
  },

  draw: function (startXLocation, width) {
    let trackingCanvasDOM = this.refs.trackerCanvas
    let trackingCanvas = trackingCanvasDOM.getContext('2d')

    trackingCanvas.fillStyle = '#FFA033'
    trackingCanvas.clearRect(0, 0, trackingCanvasDOM.width, trackingCanvasDOM.height)
    trackingCanvas.fillRect(startXLocation, 0, width, trackingCanvasDOM.height)
  },

  redrawBar: function (currentNote) {
    let currentBarPos = currentNote.location
    let trackingCanvasDOM = this.refs.trackerCanvas
    let cx = trackingCanvasDOM.getContext('2d')
    let heightOfBar = trackingCanvasDOM.height
    cx.clearRect(0, 0, trackingCanvasDOM.width, heightOfBar)
    cx.fillStyle = '#FFA033'
    cx.fillRect(currentBarPos, 0, currentNote.width, heightOfBar)
  },

  render: function () {
    return (
      <canvas id='tracker' ref='trackerCanvas' width='1' height='128'></canvas>
    )
  }
})

module.exports = PianolaTracker
