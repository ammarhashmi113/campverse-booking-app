function Footer() {
    return (
        <footer className="bg-dark text-white text-center py-4">
            <div className="container">
                <p className="mb-1">
                    © {new Date().getFullYear()} Campverse. All rights reserved.
                </p>
                <small>
                    Built with ❤️ by Ammar |{" "}
                    <a
                        href="https://github.com/ammarhashmi113"
                        className="text-white text-decoration-underline"
                    >
                        GitHub
                    </a>
                </small>
            </div>
        </footer>
    );
}

export default Footer;
