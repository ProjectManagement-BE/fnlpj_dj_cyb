import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div>© {new Date().getFullYear()} Cyber Threat Detection</div>
        <div>
          <a href="mailto:security@example.com">Contact Us</a>
          <span> · </span>
          <a href="/privacy" aria-label="Privacy Policy">Privacy</a>
          <span> · </span>
          <a href="/terms" aria-label="Terms and Conditions">Terms</a>
        </div>
      </div>
    </footer>
  );
}


