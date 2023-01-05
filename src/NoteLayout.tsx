import { Navigate, Outlet, useOutletContext, useParams } from "react-router-dom"
import { Note } from "./App"

type NoteLayoutProps = {
  notes: Note[]
}


export function NoteLayout( {notes}: NoteLayoutProps) {

  // get ID from URL
  const {id} = useParams()

  // get the Note
  const note = notes.find(n => n.id === id)

  // not found: navigate back to home, replaces url
  if (note == null) return <Navigate to="/" replace />

  // render one of the routes using NoteLayout (show/edit)
  return <Outlet context={note} />
}

// helper function
export function useNote() {
  return useOutletContext<Note>()
}