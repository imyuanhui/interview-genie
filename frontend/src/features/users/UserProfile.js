import { useSelector } from "react-redux"
import { selectUserById } from "./usersApiSlice"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useUpdateUserMutation } from "./usersApiSlice"
import { faSave, faEdit } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import useAuth from "../../hooks/useAuth"

const USER_REGEX = /^[A-z]{3,20}$/
const PASSWORD_REGEX = /^[A-z0-9!@#$%]{8,12}$/
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

const UserProfile = () => {

    const { id } = useAuth()

    const user = useSelector(state => selectUserById(state, id))
    const navigate = useNavigate()

    const [mode, setMode] = useState('read')
    const [username, setUsername] = useState(user.username)
    const [validateUsername, setValidateUsername] = useState(false)
    const [password, setPassword] = useState("")
    const [validatePassword, setValidatePassword] = useState(false)
    const [email, setEmail] = useState(user.email)
    const [validateEmail, setValidateEmail] = useState(false)

    console.log(user)

    const [updateUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateUserMutation()

    useEffect(() => {
        setValidateUsername(USER_REGEX.test(username))
    }, [username])

    useEffect(() => {
        setValidatePassword(PASSWORD_REGEX.test(password))
    }, [password])

    useEffect(() => {
        setValidateEmail(EMAIL_REGEX.test(email))
    }, [email])

    useEffect(() => {
        if (isSuccess) {
            setMode('read')
            navigate('/dash/profile')
        }
    }, [isSuccess, navigate])

    const onUsernameChanged = e => setUsername(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)
    const onEmailChanged = e => setEmail(e.target.value)

    let canSave
    if (password) {
        canSave = [validateUsername, validatePassword, validateEmail].every(Boolean) && !isLoading
    } else {
        canSave = [validateUsername, validateEmail].every(Boolean) && !isLoading
    }

    const onEditClicked = () => setMode('edit')

    const onSaveClicked = async (e) => {
        if (password) {
            await updateUser({ id: user.id, username, password, email, permissions: user.permissions, active: user.active })
        } else {
            await updateUser({ id: user.id, username, email, permissions: user.permissions, active: user.active })
        }
        setMode('read')
    }

    const errClass = isError ? "errmsg" : "offscreen"
    const validUserClass = !validateUsername ? 'form__input--incomplete' : ''
    const validPwdClass = password && !validatePassword ? 'form__input--incomplete' : ''
    const validEmailClass = !validateEmail ? 'form__input--incomplete' : ''

    const errContent = error?.data?.message ?? ''

    if (user) {
        return (
            <div className="dash__profile">
                <p className={errClass}>{errContent}</p>

                <form className="form profile-form" onSubmit={e => e.preventDefault()}>

                    <div className="form__title-row">
                        <h2>{mode === 'read' ? 'View Profile' : 'Edit Profile'}</h2>
                        <div className="form__action-buttons">
                            {mode === 'read' && (
                                <button
                                    className="icon-button"
                                    title="Edit"
                                    onClick={onEditClicked}
                                >
                                    <FontAwesomeIcon icon={faEdit} />
                                </button>
                            )}
                            {mode === 'edit' && (
                                <button
                                    className="icon-button"
                                    title="Save"
                                    onClick={onSaveClicked}
                                    disabled={!canSave}
                                >
                                    <FontAwesomeIcon icon={faSave} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Username input */}
                    <label className="form__label" htmlFor="username">Username: </label>
                    <input
                        className={`form__input ${validUserClass}`}
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="off"
                        value={username}
                        onChange={onUsernameChanged}
                        readOnly={mode === 'read'}
                    />

                    {/* Email input */}
                    <label className="form__label" htmlFor="email">Email: </label>
                    <input
                        className={`form__input ${validEmailClass}`}
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="off"
                        value={email}
                        onChange={onEmailChanged}
                        readOnly={mode === 'read'}
                    />

                    <label className="form__label" htmlFor="password">Password: </label>
                    <input
                        className={`form__input ${validPwdClass}`}
                        id="password"
                        name="password"
                        type="password"
                        value={mode === 'read' ? "********" : password}
                        onChange={onPasswordChanged}
                        readOnly={mode === 'read'}
                    />
                </form>
            </div>
        )
    } else return <p>no user found</p>
}

export default UserProfile
