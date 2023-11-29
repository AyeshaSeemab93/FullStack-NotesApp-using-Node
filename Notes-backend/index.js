// const http = require('http') instaead we use express now
const express = require('express')
const app = express(); //creating server
app.use(express.json()) //for posting (json parser: to access the raw data sent with req)

const cors = require('cors')  //to connect frontend + backend to 1 place
app.use(cors());

app.use(express.static('dist')) //to show static content brought with dist folder
const mongoose = require("mongoose") //to communicate with mongoDB database

 //ask for password in terminal
if(process.argv.length <3){
  console.log("give password as argument");
  process.exit;
}
const password = process.argv[2];

//connect to mongoDB
const url = `mongodb+srv://Ayesha:${password}@cluster0.ekh6jf2.mongodb.net/databaseName?retryWrites=true&w=majority`;
mongoose.set('strictQuery', false)  // Set 'strictQuery' to false, relaxing query validation
mongoose.connect(url);

//create schema(design of data)
const noteSchema = new mongoose.Schema({
content: String,
important: Boolean,
});
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

let notes = [
    {
      id: 1,
      content: "HTML backend indexedDB.js easy",
      important: true
    },
    {
      id: 2,
    
      content: "backend indexedDB.js,Browser can execute only JavaScript",
      important: false
    },
    
    {
      id: 3,
      content: "backend indexedDB.js,GET and POST are the most important methods of HTTP protocol",
      important: true
    }
];

//create and save each note 1 by 1
      function addNote(content, important) {
        const note = new Note({
          content,
          important,
          });
        return note.save().then(result => {
          console.log('Note saved:', result);
        });
      }
 // Using Promise.all to wait for all notes to be saved before closing the connection
      const promiseArray = notes.map(note => addNote(note.content, note.important));
      Promise.all(promiseArray)
        .then(() => {
          console.log('All notes saved successfully');
        })
        .catch(error => {
          console.error('Error saving notes:', error);
        });

app.get('/', (req, res)=>{
  console.log('request received');
  res.send('<h1>Hello World! Welcome to notes(Node-Express part 3)</h1>')
})

app.get('/api/notes', (req, res)=>{
  console.log('request for all notes');
  //res.json(notes); directly show notes from the handcoded above notes
  //find notes from database 
  Note.find({})
  .then(notes=>{
    console.log("found")

    res.json(notes) //notes coming from database are array(DB documents).we convert then to json strings before sending them to client
  })
  .catch(error=>{
    console.log("Error in fetching data");
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  })
})

app.get('/api/notes/:id', (req, res) =>{
  console.log('in get method')
  const id = Number(req.params.id);
  console.log('id: '+ id + typeof id);
  console.log(`request for ${id} note`);
  const note = notes.find(n=>{return n.id === id});
  console.log(note);
  if(note){
    return res.json(note);
  } else {
    return res.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

const generateId = () =>{
  const maxId = notes.length > 0 
  ? Math.max(...notes.map(note=> note.id))
  : 0
  console.log(maxId)
  return maxId + 1
}
app.post('/api/notes', (request, response) => {
  const body = request.body
  if(!body.content){
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId()
  }
  console.log(note)
  //add note to list
  notes.concat(note)
  response.json(note)

})



//running the servere (for fly.io, render deploying)
const PORT = process.env.PORT || 3001

app.listen(PORT, ()=>{
  console.log(`Server running on port ${PORT}`)

});