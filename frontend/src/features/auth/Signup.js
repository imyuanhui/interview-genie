import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

import { useSignupMutation } from './authApiSlice'
import { useDispatch } from 'react-redux'
import { setCredentials } from './authSlice'

const USER_REGEX = /^[A-z]{3,20}$/
const PASSWORD_REGEX = /^[A-z0-9!@#$%]{8,12}$/
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

const Signup = () => {

    const [username, setUsername] = useState('')
    const [validateUsername, setValidateUsername] = useState(false)
    const [email, setEmail] = useState('')
    const [validateEmail, setValidateEmail] = useState(false)
    const [password, setPassword] = useState('')
    const [validatePassword, setValidatePassword] = useState(false)
    const [confirmPwd, setConfirmPwd] = useState('')
    const [errMsg, setErrMsg] = useState('')

    const [signup, {
        isLoading,
        isSuccess
    }] = useSignupMutation()

    const navigate = useNavigate()
    const dispatch = useDispatch()

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
            setUsername("")
            setPassword("")
            setEmail("")
            console.log("successfully sign up!")
            navigate('/login')
        }
    }, [isSuccess, navigate])

    const onUsernameChanged = (e) => setUsername(e.target.value)
    const onEmailChanged = (e) => setEmail(e.target.value)
    const onPwdChanged = (e) => setPassword(e.target.value)
    const onConfirmPwdChanged = (e) => setConfirmPwd(e.target.value)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (isLoading) {
            console.log('loading')
            return
        }
        if (!validateUsername) {
            setErrMsg('Invalid username')
            return
        }
        if (!validateEmail) {
            setErrMsg('Invalid email address')
            return
        }
        if (!validatePassword) {
            setErrMsg('Password must be 8-12 characters including !@#$%')
            return
        }
        if (password !== confirmPwd) {
            setErrMsg('Passwords do not match')
            return
        }
        try {
            const { accessToken } = await signup({ username, password, email }).unwrap()
            dispatch(setCredentials({ accessToken }))
            setUsername("")
            setPassword("")
            setEmail("")
            setConfirmPwd("")
            navigate('/login')
        } catch (err) {
            setErrMsg(err.data?.message)
        }
    }

    const errClass = errMsg ? "errmsg" : "offscreen"
    const validUserClass = !validateUsername ? "form__input--incomplete" : ""
    const validPwdClass = !validatePassword ? "form__input--incomplete" : ""
    const validEmailClass = !validateEmail ? 'form__input--incomplete' : ''

    if (isLoading) return <p>Loading</p>

    const content = (
        <section className='public'>
            <header className='signup__header'>
                <h1><Link to='/'>InterviewGenie</Link></h1>
            </header>
            <main className='signup'>
                <p className={errClass}>{errMsg}</p>

                <form className='form signup__form' onSubmit={handleSubmit}>

                    <label className='form__label' htmlFor='username'>
                        Username: <span className='nowrap'>[3-20 letters]</span>
                    </label>
                    <input
                        className={`form__input ${validUserClass}`}
                        id='username'
                        name='username'
                        type='text'
                        autoComplete='off'
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

                    <label className='form__label' htmlFor='password'>
                        Password: <span className='nowrap'>[8-12 chars incl. !@#$%]</span>
                    </label>
                    <input
                        className={`form__input ${validPwdClass}`}
                        id='password'
                        name='password'
                        type='password'
                        value={password}
                        onChange={onPwdChanged}
                    />

                    <label htmlFor='confirmPwd'>Confirm Password: </label>
                    <input
                        className='form__input'
                        type='password'
                        id='confirmPwd'
                        value={confirmPwd}
                        onChange={onConfirmPwdChanged}
                        required
                    />

                    <button className='form__submit-button' disabled={isLoading}>Signup</button>
                </form>
                <p className='goto'>Already have an account? <Link to='/login'>Login</Link></p>
            </main>
        </section>
    )
    return content
}

export default Signup
