let React = require('react')

let PianolaControls = React.createClass({
  render: function () {
    return (
      <div className='pianola-controls-h'>
        <button id='pianola-next' onClick={this.props.nextNote} className='pianola-control pianola-button pianola-button-h'>Next</button>
        <button id='pianola-prev' onClick={this.props.previousNote} className='pianola-control pianola-button pianola-button-h'>Prev</button>
        <button id='pianola-play' onClick={this.props.play} className='pianola-control pianola-button pianola-button-h'>Play</button>
        <button id='pianola-stop' onClick={this.props.stop} className='pianola-control pianola-button pianola-button-h'>Stop</button>
        <button id='pianola-rewind' className='pianola-control pianola-button pianola-button-h'>Rewind</button>
      </div>
    )
  }
})

module.exports = PianolaControls
