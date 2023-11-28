const { response } = require("express");
const mongoose = require("mongoose")
 //ask fro password
if(process.argv.length <3){
  console.log("give password as argument");
  process.exit;
}

const password = process.argv[2];

//connect to mongoDB
const url = `mongodb+srv://Ayesha:${password}@cluster0.ekh6jf2.mongodb.net/databaseName?retryWrites=true&w=majority`;
// Set 'strictQuery' to false, relaxing query validation
mongoose.set('strictQuery', false)
mongoose.connect(url);
//create schema(design of data)
const noteSchema = new mongoose.Schema({
content: String,
important: Boolean,
})
//create model(name of table, design to store)
const Note1 = mongoose.model('Note', noteSchema)

// //cretae data
// const note = new Note1({
//   content:"THIS IS NOTE1",
//   important: false,
// })
// //save data & close connection:
// note.save().then(result=>{
//   console.log("Note saved")
//   mongoose.connection.close()
// })

//retrieving data from database
// Note1.find({}).then(resultNotes=>{
//   resultNotes.map(note=>console.log(note))
//   mongoose.connection.close();
// })


// //create list of data:
// const notes = [
//   {
//     content: "1st obj",
//     important: true
//   },
//   {
//     content: "2nd obj",
//     important: false
//   }, {
//     content: "3rd obj",
//     important: true
//   }, {
//     content: "4th obj",
//     important: false
//   },
// ]

// //add note funtion (create single note 1st and then add to db)

// function AddNote(content, important){
//   const note = new Note1({
//     content,
//     important
//   })
//   note.save().then(result =>{
//     console.log("note saved");
//     console.log(result)
//   })
// }
// //calling function number of array time
// const promiseResults= notes.map(note=>{
//   AddNote(note.content, note.important);

// })
// //check all promises fulfilled and then
// promise.All(promiseResults)
//   .then(response=>{
//     console.log("All notes saved");
//     mongoose.connection.close();

//   })