let helpers = {
  noteLength: function (noteString, beatNum) {
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
}

module.exports = helpers
