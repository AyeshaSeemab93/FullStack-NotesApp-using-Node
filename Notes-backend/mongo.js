const mongoose = require('mongoose')
// ask fro password
if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit()
}

const password = process.argv[2]

// connect to mongoDB
const url = `mongodb+srv://Ayesha:${password}@cluster0.ekh6jf2.mongodb.net/databaseName?retryWrites=true&w=majority`
// Set 'strictQuery' to false, relaxing query validation
mongoose.set('strictQuery', false)
mongoose.connect(url)
// create schema(design of data)
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})
// create model(name of table, design to store)
const Note = mongoose.model('Note', noteSchema)

// cretae data
const note = new Note({
  content: 'THIS IS NOTE1',
  important: false,
})
// save data & close connection:
note.save().then(() => {
  console.log('Note saved')
  mongoose.connection.close()
})
