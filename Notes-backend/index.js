// const http = require('http') instead we use express now
const express = require('express')
const app = express(); //creating server
const cors = require('cors')  //to connect frontend + backend at 1 place
require('dotenv').config()

const Note = require('./Models/note.js'); //importing note database module (Note is modelName)

const requestLogger = (req, res, next)=>{
  console.log('Method: ',req.method);
  console.log('Path: ',req.path);
  console.log('Body: ',req.body);
  console.log('----');
  next();
  }

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  else if(error.name === 'ValidationError'){
    return response.status(400).json({error: error.message})
  }
  next(error)
}
//middleware to handle wrong link address
const unknownEndpoint =(req, res)=>{
  return res.status(404).send({error: 'Unknown Endpoint!' })
}

  
app.use(express.json()) //for posting (json parser: to access the raw data    sent with req by client)
app.use(cors());
app.use(express.static('dist')) //to show static content brought with dist folder
app.use(requestLogger); //should be after parsing else body is undefined

let notes = [
    // {
    //   id: 1,
    //   content: "HTML is easy",
    //   important: true
    // }
];

app.get('/api/notes', (req, res)=>{
  console.log('request for all notes');
  //res.json(notes); directly show notes from the handcoded above notes
  //find notes from database 
  Note.find({}).then(notes=>{
    console.log("Request to get all Notes from database!")
    res.json(notes) //notes coming from database are array(DB documents).we convert then to json strings before sending them to client
  })
  .catch(error=>{
    console.log("Error in fetching data");
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  })
})

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end() 
      }
    })
    .catch(error => {
      // console.log(error.message)
      // response.status(400).send({ error: 'malformatted id' })
       next(error);
    })
})

app.post('/api/notes', (request, response, next) => {
  const body = request.body;
  //making a copy of note received as req from frontend
  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })
  console.log(note)
  // notes.concat(note) //add note to local list
  // response.json(note) //when sending response from local notes
  note.save().then(savedNote=>{
          response.json(savedNote)
          })
      .catch(error=> next(error))

})

app.delete('/api/notes/:id', (request, response, next) => {
  const id = request.params.id
  // notes = notes.filter(note => note.id !== id)
  // response.status(204).end()
  Note.findByIdAndDelete(id)
    .then(result =>{
      res.status(204).end()
    })
    .catch(error=>next(error))

  
})

//TOGGLE IMPORTANCE(put request is coming from client=>UI interface=>frontend code=>axious send put req=> backend here=>put req rec by express library)
app.put('/api/notes/:id', (req, res, next)=>{
  const id = req.params.id;
  const body = req.body //or const {content, important} = req.body
  // create new copy of coming note 
  const note = {
    content: body.content,
    important: body.important
  }
  // updating note in mongooseDb
  Note.findByIdAndUpdate(id,note, {new: true, runValidators: true, context: 'query'}) //{new: true} so the event handler use the new note,not the original one
      .then(updatedNote => res.json(updatedNote))
      .catch(error=> next(error))
})




app.use(unknownEndpoint);
app.use(errorHandler)//must be last loaded middleware

//running the servere (for fly.io, render deploying)
const PORT = process.env.PORT

app.listen(PORT, ()=>{
  console.log(`Server running on port ${PORT}`)
});
