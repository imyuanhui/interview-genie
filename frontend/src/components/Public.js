import { Link } from "react-router-dom";

const Public = () => {
    const content = (
        <section className="public">
            <header className="public__header">
                <p><Link to="/signup">Signup </Link> | <span><Link to="/login">Login</Link></span></p>
            </header>
            <main className="public__main">
                <h1 className="public__main-title">InterviewGenie</h1>
                <h3 className="public__main-subtitle">Your best mock interviewer.</h3>
            </main>
            <footer className="public__footer">
                <p>developed by <a href="https://imyuanhui.github.io">Yuanhui Xu</a></p>
            </footer>
        </section>
    );

    return content;
}

export default Public;