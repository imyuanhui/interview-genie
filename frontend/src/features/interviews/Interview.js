import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { selectInterviewById } from './interviewsApiSlice'

const Interview = ({ interviewId }) => {

    const interview = useSelector(state => selectInterviewById(state, interviewId))

    const navigate = useNavigate()

    if (interview) {
        /*const created = new Date(interview.createdAt)
            .toLocaleDateString('en-US', { day: 'numeric', month: 'long' })*/
        const updated = new Date(interview.updatedAt)
            .toLocaleDateString('en-US', { day: 'numeric', month: 'long' })
        const handleEdit = () => navigate(`/dash/interviews/${interviewId}`)

        return (
            <tr className="table__row">
                <td className="table__cell interview__status">
                    {interview.status === "Pending"
                        ? <span className="interview__status--pending">Pending</span>
                        : interview.status === "Finished"
                            ? <span className="interview__status--finished">Finished</span>
                            : <span className="interview__status--ongoing">Ongoing</span>
                    }
                </td>
                <td className="table__cell interview__title">{interview.title}</td>
                <td className="table__cell interview__position">{interview.position}</td>
                <td className="table__cell interview__skills">{interview.keySkills.join(", ")}</td>
                <td className="table__cell interview__updated">{updated}</td>
                <td className={`table__cell`}>
                    <button
                        className="icon-button table__button"
                        onClick={handleEdit}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr>
        )
    } else return null
}

export default Interview
