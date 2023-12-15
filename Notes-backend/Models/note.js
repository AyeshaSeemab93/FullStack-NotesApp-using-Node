const mongoose = require("mongoose") //to communicate with mongoDB database
require('dotenv').config();

//connect to mongoDB
const uri = process.env.MONGODB_URI;
mongoose.set('strictQuery', false)  // Set 'strictQuery' to false, relaxing query validation
mongoose.connect(uri)
  .then(result=>{
    console.log("connected to MongoDB", uri);
  })
  .catch(error=>{
    console.log("unable to connect.Message: ", error.message)
  })

//create schema(design of data)
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minlength: 5,
    required: true
  },
  important: Boolean,
})
// this step is to delete _id(object) and create id(string) from _id before converting to json
noteSchema.set('toJSON',{
  transform: (document, returnedObject) =>{
    returnedObject.id = document._id.toString();
    delete returnedObject._id
    delete returnedObject.__v
  }
})
//create model(name of table, design to store)
 const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
//exporting model Note 