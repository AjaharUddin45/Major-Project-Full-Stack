import React from 'react'
import { Link } from "react-router-dom";
import "./Footer.css";


export default function Footer() {
    return (
        <footer>
            <div className="f-info">

                {/* Social Links */}
                <div className="f-info-socials">

                    <a
                        href="https://www.instagram.com/ajahar00_45/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <i className="fa-brands fa-instagram"></i>
                    </a>

                    <a
                        href="https://x.com/MdAjaha16867011"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <i className="fa-brands fa-twitter"></i>
                    </a>

                    <a
                        href="https://www.linkedin.com/in/md-ajahar-679494259/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <i class="fa-brands fa-linkedin"></i>
                    </a>

                </div>

                {/* Brand */}
                <div className="f-info-brand">
                    &copy; WanderLust private limited
                </div>

                {/* Internal Links */}
                <div className="f-info-links">

                    <Link to="/privacy">
                        Privacy
                    </Link>

                    <Link to="/terms">
                        Terms
                    </Link>

                </div>

            </div>
        </footer>
    );
}
