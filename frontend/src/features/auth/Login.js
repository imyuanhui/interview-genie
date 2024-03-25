import { useRef, useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

import { useDispatch } from 'react-redux' 
import { setCredentials } from './authSlice' 
import { useLoginMutation } from './authApiSlice' 

import usePersist from '../../hooks/usePersist'


const Login = () => {

    const userRef = useRef()
    const errRef = useRef()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [errMsg, setErrMsg] = useState("")
    const [persist, setPersist] = usePersist()

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [login, { isLoading }] = useLoginMutation()

    useEffect(() => {
        userRef.current.focus()
    }, [])

    useEffect(() => {
        setErrMsg("")
    }, [username, password])

    const handleUserInput = (e) => setUsername(e.target.value)
    const handlePwdInput = (e) => setPassword(e.target.value)
    const handleToggle = () => setPersist(prev => !prev)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const { accessToken } = await login({ username, password }).unwrap()
            dispatch(setCredentials({ accessToken }))
            setUsername("")
            setPassword("")
            navigate('/dash')
        } catch (err) {
            if (!err.status) {
                setErrMsg('No Server Response')
            } else if (err.status === 400) {
                setErrMsg('Missing Username or Password')
            } else if (err.status === 401) {
                setErrMsg('Unauthorized')
            } else {
                setErrMsg(err.data?.message)
            }
            //errRef.current.focus()
        }
    }

    const errClass = errMsg ? "errmsg" : "offscreen"

    if (isLoading) return <p>Loading</p>

    const content = (
        <section className='public'>
            <header className='login__header'>
                <h1><Link to="/">InterviewGenie</Link></h1>
            </header>
            <main className='login'>
                <p
                    ref={errRef}
                    className={errClass}
                    aria-live='assertive'
                >
                    {errMsg}
                </p>

                <form className='form login__form' onSubmit={handleSubmit}>
                    <label htmlFor='username'>Username: </label>
                    <input
                        className='form__input'
                        type='text'
                        id='username'
                        ref={userRef}
                        value={username}
                        onChange={handleUserInput}
                        autoComplete="off"
                        required
                    />
                    
                    <label htmlFor='password'>Password: </label>
                    <input
                        className='form__input'
                        type='password'
                        id='password'
                        ref={userRef}
                        value={password}
                        onChange={handlePwdInput}
                        required
                    />

                    <button className='form__submit-button'>Login</button>

                    <label htmlFor='persist' className='form__persist'>
                    <input
                        className='form__checkbox'
                        type='checkbox'
                        id='persist'
                        onChange={handleToggle}
                        checked={persist}
                        />
                        Trust this device
                    </label>
                </form>
                <p className='goto'>Go to <Link to="/signup">Signup</Link></p>
            </main>
        </section>
    )

    return content
}

export default Login