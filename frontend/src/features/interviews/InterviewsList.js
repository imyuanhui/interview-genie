import { useGetInterviewsQuery } from './interviewsApiSlice'
import Interview from './Interview'

const InterviewsList = () => {

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

    const { ids } = interviews

    const tableContent = ids?.length
      ? ids.map(interviewId => <Interview key={interviewId} interviewId={interviewId} />) 
      : null
    
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
  }

  return content
}

export default InterviewsList
