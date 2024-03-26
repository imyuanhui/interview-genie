import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth'

const Welcome = () => {

    const {username, isAdmin} = useAuth()
    
    const date = new Date();
    const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date);

    const content = (
        <section className="welcome">
            <p>{today}</p>
            <h1>Welcome {username}!</h1>
            <p><Link to="/dash/interviews">View Interviews</Link></p>
            <p><Link to="/dash/interviews/new">Add New Interview</Link></p>
            {(isAdmin) && <p><Link to="/dash/users">View User Settings</Link></p>}
            {(isAdmin) && <p><Link to="/dash/users/new">Add New User</Link></p>}
        </section>
    );

    return content;
}

export default Welcome;
