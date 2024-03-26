import { selectAllUsers } from '../users/usersApiSlice'
import { useSelector } from "react-redux"
import NewInterviewForm from './NewInterviewForm'
import useAuth from "../../hooks/useAuth"
import NewInterviewFormAdmin from './NewInterviewFormAdmin'

const NewInterview = () => {

  const { id, isAdmin } = useAuth()

  const users = useSelector(state => selectAllUsers(state))

  let content

  if (isAdmin) {    
    content = <NewInterviewFormAdmin users={users} />
  } else {
    content = <NewInterviewForm userID={id} />
  }
  return content
}

export default NewInterview
