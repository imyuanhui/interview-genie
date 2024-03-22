import { Link } from "react-router-dom";

const Public = () => {
    const content = (
        <section className="public">
            <header>
                <h1>Welcome to use <span>InterviewGenie</span></h1>
            </header>
            <main className="public__main">
                <p>InterviewGenie is an AI-powered mock interview assistant
                    designed and developed by Yuanhui Xu
                    to help users practice job interviews
                    by generating tailored mock interview questions
                    based on job descriptions
                    and providing personalized feedback
                    on interview performance.</p>
                <address className="public__addr">
                    Yuanhui Xu<br />
                    <a href="tel:+86 123456">123-456</a>
                </address>
            </main>
            <footer>
                <Link to="/login">User Login</Link>
            </footer>
        </section>
    );

    return content;
}

export default Public;