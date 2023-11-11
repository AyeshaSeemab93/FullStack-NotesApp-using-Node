// const http = require('http') instaead we use express now
const express = require('express')
//creating server
const app = express();
//for posting (json parser: to access the raw data sent with req)
app.use(express.json())
const cors = require('cors')
app.use(cors());


// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'application/json' })
//   response.end(JSON.stringify(notes))
// })

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]


app.get('/', (req, res)=>{
  console.log('request received');
  res.send('<h1>Hello World! Welcome to notes(Node-Express part 3)</h1>')
})
app.get('/api/notes', (req, res)=>{
  console.log('request for all notes');
  res.json(notes);
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
  
})
