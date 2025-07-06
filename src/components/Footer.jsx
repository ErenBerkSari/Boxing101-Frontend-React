import React from "react";

function Footer() {
  return (
    <div>
      <footer>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <p>
                Copyright &copy; 2025 Boxing101 - Developed by
                Eren Berk Sarı
                <br />
                <a
                  rel="nofollow"
                  href="https://www.linkedin.com/in/eren-berk-sari"
                  className="tm-text-link"
                  target="_blank"
                >
                  LinkedIn
                </a>{" "}
                |{" "}
                <a
                  rel="nofollow"
                  href="https://github.com/ErenBerkSari"
                  className="tm-text-link"
                  target="_blank"
                >
                  GitHub
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
