import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectInterviewById } from './interviewsApiSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons"

const InterviewCard = ({ interviewId }) => {

    const interview = useSelector(state => selectInterviewById(state, interviewId))
    const navigate = useNavigate()

    const [isExpanded, setIsExpanded] = useState(false)

    if (interview) {
        const created = new Date(interview.createdAt)
            .toLocaleDateString('en-US', { day: 'numeric', month: 'long' })
        const updated = new Date(interview.updatedAt)
            .toLocaleDateString('en-US', { day: 'numeric', month: 'long' })
        
        const handleEdit = () => navigate(`/dash/interviews/${interviewId}`)
        const handleMouseEnter = () => setIsExpanded(true)
        const handleMouseLeave = () => setIsExpanded(false)

        const details = (
            <>
                {interview?.experience && <p>Experience: {interview.experience}</p>}
                {interview?.industry && <p>Industry: {interview.industry}</p>}
                {interview?.company && <p>Company: {interview.company}</p>}
                <p>Created: {created}, <span>Updated: {updated}</span></p>
            </>
        )

        return (
            <div
                className={`interview__card ${isExpanded ? 'expanded' : ''}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <h1>{interview.title}</h1>
                <p>{interview.position}</p>
                <p>{interview.keySkills.join(", ")}</p>
                {isExpanded && (
                    <div className="card-details">
                        {details}
                        <div className='btn-container'>
                            <button
                                className="icon-button"
                                onClick={handleEdit}
                            >
                                <FontAwesomeIcon icon={faPenToSquare} />
                            </button>
                            <button
                                className="icon-button"
                            >
                                <FontAwesomeIcon icon={faTrashCan} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        )
    } else return null
}
  
export default InterviewCard
  