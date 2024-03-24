import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectInterviewById } from './interviewsApiSlice'
import EditInterviewForm from "./EditInterviewForm"

const EditInterview = () => {

  const { id } = useParams()
  const interview = useSelector(state => selectInterviewById(state, id))

  const content = interview ? <EditInterviewForm interview={interview} /> : <p>Loading</p>

  return content
}

export default EditInterview
