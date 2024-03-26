import { Link } from "react-router-dom"

const DashLeft = () => {
    
    const content = (
        <div className="dash-left__container">
            <Link to={`/dash/profile`}>
                <h3 className="dash-left__link">Profile</h3>
            </Link>
            <Link to={`/dash/interviews`}>
                <h3 className="dash-left__link">Interviews</h3>
            </Link>
        </div>
        
    )

    return content
}

export default DashLeft
