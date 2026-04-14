import React from "react";
import "./Footer.css"; // ✅ correct import

function Footer() {
    return (
        <div className="footer">

            <h3>Contact Us</h3>

            <div className="footer-links">

                {/* EMAIL */}
                <a href="mailto:chougalevishal1998@gmail.com">
                    📧 chougalevishal1998@gmail.com
                </a>

                {/* PHONE */}
                <a href="tel:9923810761">
                    📞 +91 9923810761
                </a>

                {/* WHATSAPP */}
                <a
                    href="https://wa.me/919923810761"
                    target="_blank"
                    rel="noreferrer"
                >
                    💬 WhatsApp
                </a>

                {/* INSTAGRAM */}
                <a
                    href="https://www.instagram.com/vishal_chougale_official"
                    target="_blank"
                    rel="noreferrer"
                >
                    📸 Instagram
                </a>

                {/* YOUTUBE */}
                <a
                    href="https://www.youtube.com/@kalamrutVishalchougale"
                    target="_blank"
                    rel="noreferrer"
                >
                    ▶️ YouTube
                </a>

            </div>

            <p className="footer-copy">
                © 2026 BatBall Auction. All rights reserved.
            </p>

        </div>
    );
}

export default Footer;