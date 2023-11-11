import style from '../index.css'
const Note = ({note, toggleImportance})=>{
  const label = note.important //if ture then "make not important"
  ? "make not important" : "make important"
  return(
<li className="note">
  {note.content} 
   <button className="button" onClick={toggleImportance}>{label}</button>
  </li>
  )
}

export default Note