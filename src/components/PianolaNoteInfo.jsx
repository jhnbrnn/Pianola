let React = require('react')

let PianolaNoteInfo = React.createClass({
  componentWillUpdate: function (props, state) {
    this.renderNoteFacts(props.currentNote)
  },

  renderNoteFacts: function (note) {
    if (!note.duration) {
      return
    }
    let type = this.refs.noteInfoType
    let noteDOM = this.refs.noteInfoNote
    let desc = this.refs.noteInfoDesc
    let typeText = ''
    let noteText = ''
    let descText = ''

    switch (note.duration) {
      case 'q':
        descText = 'quarter '
        break
      case 'h':
        descText = 'half '
        break
      case 'w':
        descText = 'whole '
        break
      case 'e':
        descText = 'eighth '
        break
      case '16':
        descText = 'sixteenth '
        break
      default:
        break
    }

    if (note.props.length > 1) {
      typeText = 'chord'
      descText += 'note'
      for (var x = 0; x < note.props.length; x++) {
        var noteProp = note.props[x]
        noteText += noteProp.key + '/' + noteProp.octave + ', '
      }
      noteText = noteText.slice(0, -2)
    } else if (note.type === 'n') {
      typeText = 'note'
      descText += 'note'
      var ntProp = note.props[0]
      noteText = ntProp.key + '/' + ntProp.octave
    } else if (note.type === 'r') {
      typeText = 'rest'
      descText += 'rest'
    }
    type.innerText = typeText
    noteDOM.innerText = noteText
    desc.innerText = descText
  },

  render: function () {
    return (
      <div id='note-info'>
        <span id='note-info-type' ref='noteInfoType'></span>
        <span id='note-info-note' ref='noteInfoNote'></span>
        <span id='note-info-desc' ref='noteInfoDesc'></span>
      </div>
    )
  }
})

module.exports = PianolaNoteInfo
