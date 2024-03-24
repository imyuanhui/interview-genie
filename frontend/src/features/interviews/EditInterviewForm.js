import { useState, useEffect } from 'react'
import { useUpdateInterviewMutation, useDeleteInterviewMutation } from './interviewsApiSlice'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { EXP_OPTIONS } from '../../config/experience'

const EditInterviewForm = ({ interview }) => {

  const [updateInterview, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useUpdateInterviewMutation()

  const [deleteInterview, {
    isSuccess: isDelSuccess,
    isError: isDelError,
    error: delError
  }] = useDeleteInterviewMutation()

  const navigate = useNavigate()

  const [title, setTitle] = useState(interview.title)
  const [position, setPosition] = useState(interview.position)
  const [keySkills, setKeySkills] = useState(interview.keySkills)
  const [experience, setExperience] = useState(interview.experience)
  const [industry, setIndustry] = useState(interview.industry)
  const [company, setCompany] = useState(interview.company)

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setTitle('')
      setPosition("")
      setKeySkills([])
      setExperience("")
      setIndustry("")
      setCompany("")
      navigate('/dash/interviews')
    }
  }, [isSuccess, isDelSuccess, navigate])

  const onTitleChanged = e => setTitle(e.target.value)
  const onPositionChanged = e => setPosition(e.target.value)
  const onKeySkillsChanged = e => setKeySkills(e.target.value.split(',').map(item => item.trim()))
  const onExperienceChanged = e => setExperience(e.target.value)
  const onIndustryChanged = e => setIndustry(e.target.value)
  const onCompanyChanged = e => setCompany(e.target.value)

  const canSave = [title, position, keySkills.length].every(Boolean) && !isLoading

  const onSaveInterviewClicked = async (e) => {
      e.preventDefault()
      if (canSave) {
          await updateInterview({ id: interview.id, title, position, keySkills, experience, industry, company, status: interview.status })
      }
  }

  const onDelInterviewClicked = async () => {
    await deleteInterview({ id: interview.id })
  }

  const options = Object.values(EXP_OPTIONS).map(exp => {
    return (
        <option
            key={exp}
            value={exp}
        >
            {exp}
        </option>
    )
  })
  
  const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
  const validTitleClass = !title ? "form__input--incomplete" : ''
  const validPositionClass = !position ? "form__input--incomplete" : ''
  const validSkillsClass = !Boolean(keySkills.length) ? "form__input--incomplete" : ''
  
  const errContent = (error?.data?.message || delError?.data?.message) ?? ''
  
  const content = (
    <>
      <p className={errClass}>{errContent}</p>
      
      <form className='form' onSubmit={onSaveInterviewClicked}>

        <div className='form__title-row'>
          <h2>New Interview</h2>
          <div className='form__action-buttons'>
            <button
              className='icon-button'
              title='save'
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            <button
              className="icon-button"
              title="Delete"
              onClick={onDelInterviewClicked}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>

          <label className='form__label' htmlFor='title'>Title: </label>
          <input
              className={`form__input ${validTitleClass}`}
              id='title'
              name='title'
              type='text'
              autoComplete='off'
              value={title}
              onChange={onTitleChanged}
          />
          
          <label className="form__label" htmlFor="position">Position: </label>
          <input
              className={`form__input ${validPositionClass}`}
              id="position"
              name="position"
              type="text"
              autoComplete="off"
              value={position}
              onChange={onPositionChanged}
          />
          
          <label className='form__label' htmlFor='keySkills'>
              Key Skills: <span className='nowrap'>[use ',' to seperate each skill]</span>
          </label>
          <input
              className={`form__input ${validSkillsClass}`}
              id='keySkills'
              name='keySkills'
              type='text'
              value={keySkills.join(",")}
              onChange={onKeySkillsChanged}
          />
          
          <label className="form__label" htmlFor="experience">
              Experience Requrement:</label>
          <select
              id="experience"
              name="experience"
              className='form__select'
              multiple={false}
              value={experience}
              onChange={onExperienceChanged}
          >
              {options}
          </select>

          <label className="form__label" htmlFor="industry">Industry: </label>
          <input
              className='form__input'
              id="industry"
              name="industry"
              type="text"
              autoComplete="off"
              value={industry}
              onChange={onIndustryChanged}
          />
          
          <label className="form__label" htmlFor="company">Company: </label>
          <input
              className='form__input'
              id="company"
              name="company"
              type="text"
              autoComplete="off"
              value={company}
              onChange={onCompanyChanged}
          />
      </form>
  </>
)

return content
}

export default EditInterviewForm
