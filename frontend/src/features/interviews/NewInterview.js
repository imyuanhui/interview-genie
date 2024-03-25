import { useSelector } from "react-redux"
import { selectUserById } from "../users/usersApiSlice"
import NewInterviewForm from './NewInterviewForm'

const NewInterview = () => {

  const user = useSelector(state => selectUserById(state, "65fd1f212b5247628ced365c")) //use ella's id for test

  if (!user) return <p>Not Currently Available</p>

  const content = user ? <NewInterviewForm userID={user.id} /> : <p>Loading</p>

  return content
}

export default NewInterview
