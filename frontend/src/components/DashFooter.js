import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';

const DashFooter = () => {

    const navigate = useNavigate();
    const { pathname } = useLocation();

    const onGoHomeClicked = () => navigate('/dash');

    let goHomeBtn = null;
    if (pathname !== '/dash') {
        goHomeBtn = (
            <button
                className="dash-footer__button icon-button"
                title="Home"
                onClick={onGoHomeClicked}
            >
                <FontAwesomeIcon icon={faHouse} />
            </button>
        );
    }

    const content = (
        <footer className="dash-footer">
            {goHomeBtn}
            <p>Current User:</p>
            <p>Status:</p>
        </footer>
    );

    return content;
}

export default DashFooter;