import { useState, useEffect } from 'react'
import { useUpdateUserMutation, useDeleteUserMutation } from './usersApiSlice'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { PERMISSIONS } from '../../config/permissions'

const USER_REGEX = /^[A-z]{3,20}$/
const PASSWORD_REGEX = /^[A-z0-9!@#$%]{8,12}$/
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

const EditUserForm = ({ user }) => {

    const [updateUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateUserMutation()

    const [deleteUser, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delError
    }] = useDeleteUserMutation()

    const navigate = useNavigate()

    const [username, setUsername] = useState(user.username)
    const [validateUsername, setValidateUsername] = useState(false)
    const [password, setPassword] = useState("")
    const [validatePassword, setValidatePassword] = useState(false)
    const [email, setEmail] = useState(user.email)
    const [validateEmail, setValidateEmail] = useState(false)
    const [permissions, setPermissions] = useState(user.permissions)
    const [active, setActive] = useState(user.active)

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
        if (isSuccess || isDelSuccess) {
            setUsername("")
            setPassword("")
            setEmail("")
            setPermissions([])
            navigate('/dash/users')
        }
    }, [isSuccess, isDelSuccess, navigate])

    const onUsernameChanged = e => setUsername(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)
    const onEmailChanged = e => setEmail(e.target.value)

    const onPermissionsChanged = e => {
        const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        )
        setPermissions(values)
    }

    const onActiveChanged = () => setActive(prev => !prev)

    let canSave
    if (password) {
        canSave = [permissions.length, validateUsername, validatePassword, validateEmail].every(Boolean) && !isLoading
    } else {
        canSave = [permissions.length, validateUsername, validateEmail].every(Boolean) && !isLoading
    }

    const onSaveUserClicked = async (e) => {
        if (password) {
            await updateUser({ id: user.id, username, password, email, permissions, active })
        } else {
            await updateUser({ id: user.id, username, email, permissions, active })
        }
    }

    const onDelUserClicked = async () => {
        await deleteUser({ id: user.id })
    }

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
    const validUserClass = !validateUsername ? 'form__input--incomplete' : ''
    const validPwdClass = password && !validatePassword ? 'form__input--incomplete' : ''
    const validEmailClass = !validateEmail ? 'form__input--incomplete' : ''
    const validPermissionsClass = !Boolean(permissions.length) ? 'form__input--incomplete' : ''

    const options = Object.values(PERMISSIONS).map(permission => {
        return (
            <option
                key={permission}
                value={permission}
            >
                {permission}
            </option>
        )
    })

    const errContent = (error?.data?.message || delError?.data?.message) ?? ''

    const content = (
        <>
            <p className={errClass}>{errContent}</p>

            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form__title-row">
                    <h2>Edit User</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={onSaveUserClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                            className="icon-button"
                            title="Delete"
                            onClick={onDelUserClicked}
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    </div>
                </div>

                <label className="form__label" htmlFor="username">
                    Username: <span className="nowrap">[3-20 letters]</span></label>
                <input
                    className={`form__input ${validUserClass}`}
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="off"
                    value={username}
                    onChange={onUsernameChanged}
                />
                
                <label className="form__label" htmlFor="email">
                    Email: <span className="nowrap">[email address]</span></label>
                <input
                    className={`form__input ${validEmailClass}`}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="off"
                    value={email}
                    onChange={onEmailChanged}
                />

                <label className="form__label" htmlFor="password">
                    Password: <span className="nowrap">[empty = no change]</span> <span className="nowrap">[8-12 chars incl. !@#$%]</span></label>
                <input
                    className={`form__input ${validPwdClass}`}
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={onPasswordChanged}
                />

                <label className="form__label form__checkbox-container" htmlFor="user-active">
                    ACTIVE:
                    <input
                        className="form__checkbox"
                        id="user-active"
                        name="user-active"
                        type="checkbox"
                        checked={active}
                        onChange={onActiveChanged}
                    />
                </label>

                <label className="form__label" htmlFor="permissions">
                    PERMISSIONS:</label>
                <select
                    id="permissions"
                    name="permissions"
                    className={`form__select ${validPermissionsClass}`}
                    multiple={true}
                    size="3"
                    value={permissions}
                    onChange={onPermissionsChanged}
                >
                    {options}
                </select>

            </form>
        </>
    )

    return content
}

export default EditUserForm