import { useGetInterviewsQuery } from './interviewsApiSlice'
import Interview from './Interview'
import InterviewCard from './InterviewCard'
import useAuth from '../../hooks/useAuth'

const InterviewsList = () => {

  const { username, isAdmin } = useAuth()

  const {
    data: interviews,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetInterviewsQuery('interviewsList', {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })

  let content

  if (isLoading) content = <p>Loading...</p>

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>
  }

  if (isSuccess) {

    const { ids, entities } = interviews

    if (isAdmin) {

      const tableContent = ids?.length && ids.map(interviewId => <Interview key={interviewId} interviewId={interviewId} />)
      
      content = (
        <table className="table table--interviews">
          <thead className="table__thead">
            <tr>
              <th scope="col" className="table__th interview__status">Status</th>
              <th scope="col" className="table__th interview__title">Title</th>
              <th scope="col" className="table__th interview__position">Position</th>
              <th scope="col" className="table__th interview__skills">Skills</th>
              <th scope="col" className="table__th interview__updated">Updated</th>
              <th scope="col" className="table__th interview__edit">Edit</th>
            </tr>
          </thead>
          <tbody>
            {tableContent}
          </tbody>
        </table>
      )
    } else {

      const filteredIds = ids.filter(interviewId => entities[interviewId].username === username) // change later
      const cardContent = ids?.length && filteredIds.map(interviewId => <InterviewCard key={interviewId} interviewId={interviewId} />)

      content = (
        <div className='card--interviews'>
          {cardContent}
        </div>
      )
    }
  }

  return content
}

export default InterviewsList
