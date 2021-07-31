const mongoose = require('mongoose')
const{ Schema } = mongoose
const CheckSchema = Schema({
    userID: {type:  mongoose.Schema.Types.ObjectId,required: true,},
    name: { type: String, required: true },
    url: { type: String, required: true },
    protocol: { type: String },
    email: { type: String }

})


const Check = mongoose.model('Check', CheckSchema);
module.exports = Check;