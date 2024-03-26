import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faRightFromBracket,
    faFileCirclePlus,
    faFolder,
    faUserGear,
    faUserPlus,
    faUser
} from '@fortawesome/free-solid-svg-icons'
import { useNavigate, Link, useLocation } from 'react-router-dom'

import { useSendLogoutMutation } from '../features/auth/authApiSlice'
import useAuth from '../hooks/useAuth'

//const DASH_REGEX = /^\/dash(\/)?$/
const INTERVIEWS_REGEX = /^\/dash\/interviews(\/)?$/
const USERS_REGEX = /^\/dash\/users(\/)?$/
const PROFILE_REGEX = /^\/dash\/profile(\/)?$/

const DashHeader = () => {

    const { isAdmin } = useAuth()

    const navigate = useNavigate()
    const { pathname } = useLocation()
    
    const [sendLogout, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useSendLogoutMutation()

    useEffect(() => {
        if (isSuccess) navigate('/')
    }, [isSuccess, navigate])
    
    const onNewInterviewClicked = () => navigate('/dash/interviews/new')
    const onNewUserClicked = () => navigate('/dash/users/new')
    const onInterviewsClicked = () => navigate('/dash/interviews')
    const onUsersClicked = () => navigate('/dash/users')
    const onProfileClicked = () => navigate('/dash/profile')

    const logoutBtn = (
        <button
            className='icon-button dash-header-button'
            title='Logout'
            onClick={sendLogout}
        >
            <FontAwesomeIcon icon={faRightFromBracket}/>
        </button>
    )

    let newInterviewBtn = null
    if (INTERVIEWS_REGEX.test(pathname)) {
        newInterviewBtn = (
            <button
                className='icon-button dash-header-button'
                title='New Interview'
                onClick={onNewInterviewClicked}
            >
                <FontAwesomeIcon icon={faFileCirclePlus} />
            </button>
        )
    }
    
    let newUserBtn = null
    if (isAdmin) {
        if (USERS_REGEX.test(pathname)) {
            newUserBtn = (
                <button
                    className='icon-button dash-header-button'
                    title='New User'
                    onClick={onNewUserClicked}
                >
                    <FontAwesomeIcon icon={faUserPlus} />
                </button>
            )
        }
    }
    

    let usersBtn = null
    if (isAdmin) {
        if (!USERS_REGEX.test(pathname) && pathname.includes('/dash')) {
            usersBtn = (
                <button
                    className='icon-button dash-header-button'
                    title='Users'
                    onClick={onUsersClicked}
                >
                    <FontAwesomeIcon icon={faUserGear} />
                </button>
            )
        }
    }

    let interviewsBtn = null
    if (!INTERVIEWS_REGEX.test(pathname) && pathname.includes('/dash')) {
        interviewsBtn = (
            <button
                className='icon-button dash-header-button'
                title='Interviews'
                onClick={onInterviewsClicked}
            >
                <FontAwesomeIcon icon={faFolder} />
            </button>
        )
    }

    let profileBtn = null
    if (!PROFILE_REGEX.test(pathname) && pathname.includes('/dash') && !isAdmin) {
        profileBtn = (
            <button
                className='icon-button dash-header-button'
                title='Profile'
                onClick={onProfileClicked}
            >
                <FontAwesomeIcon icon={faUser}/>
            </button>
        )
    }

    const errClass = isError ? "errmsg" : "offscreen"

    let btnContent
    if (isLoading) {
        btnContent = <p>Logging Out...</p>
    } else {
        btnContent = (
            <>
                {profileBtn}
                {newUserBtn}
                {newInterviewBtn}
                {usersBtn}
                {interviewsBtn}
                {logoutBtn}
            </>
        )
    }

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <header className="dash-header">
                <div className='dash-header__container'>
                    <Link to="/dash">
                        <h1 className="dash-header__title">InterviewGenie</h1>
                    </Link>
                    <nav className="dash-header__nav">
                        {btnContent}
                    </nav>
                </div>
            </header>
        </>
    );

    return content;
}

export default DashHeader;