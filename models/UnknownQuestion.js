const mongoose = require('mongoose');

const unknownQuestionSchema = new mongoose.Schema({

  guildId: {
    type: String, 
    required: true, 
    index: true 
},
  text: { 
    type: String, 
    required: true 
},
  embedding:  { 
    type: [Number], 
    required: true 
},
  count: { 
    type: Number, 
    default: 1 
}
});

module.exports = mongoose.model('UnknownQuestion', unknownQuestionSchema);
