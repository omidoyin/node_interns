let fs = require('fs');

function Model_builder() {
  let config = fs.readFileSync('configuration.json');

  this.build = function () {
    //generate files and put it into release folder
    //Copy initialize files into release folder
    //TODO
  }

  return this;
}