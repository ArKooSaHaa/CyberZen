import React from 'react';
import NavigationBar from '../components/NavigationBar';
import '../styles/ProfessionalPage.css';

const SecurityPolicy = () => {
  return (
    <div className="professional-page-container">
      <NavigationBar currentPage="security" />
      <div className="professional-page-content">
        <div className="page-header">
          <h1>Security Policy</h1>
          <p className="subtitle">How we protect your data and privacy</p>
        </div>

        <div className="page-body">
          <section className="page-section">
            <h2>Our Security Commitment</h2>
            <p>
              At CyberZens, security is not just a feature—it's our foundation. We implement industry-leading security practices to ensure your reports and personal information remain confidential and protected from unauthorized access.
            </p>
          </section>

          <section className="page-section">
            <h2>Data Protection Measures</h2>
            <ul>
              <li><strong>Encryption in Transit:</strong> All data is encrypted using TLS 1.3 protocol during transmission</li>
              <li><strong>Encryption at Rest:</strong> All stored data is encrypted using AES-256 encryption</li>
              <li><strong>Access Control:</strong> Role-based access control ensures only authorized personnel can view reports</li>
              <li><strong>Authentication:</strong> Two-factor authentication available for all accounts</li>
              <li><strong>Regular Audits:</strong> Third-party security audits conducted quarterly</li>
            </ul>
          </section>

          <section className="page-section">
            <h2>Infrastructure Security</h2>
            <ul>
              <li><strong>Firewalls:</strong> Multiple layers of firewall protection</li>
              <li><strong>DDoS Protection:</strong> Advanced DDoS mitigation systems</li>
              <li><strong>Intrusion Detection:</strong> Real-time monitoring and threat detection</li>
              <li><strong>Redundancy:</strong> Multiple data centers for disaster recovery</li>
              <li><strong>Backups:</strong> Automated encrypted backups stored securely</li>
            </ul>
          </section>

          <section className="page-section">
            <h2>Compliance Standards</h2>
            <ul>
              <li><strong>GDPR:</strong> Full compliance with General Data Protection Regulation</li>
              <li><strong>CCPA:</strong> California Consumer Privacy Act compliant</li>
              <li><strong>ISO 27001:</strong> Information security management certified</li>
              <li><strong>SOC 2:</strong> Type II compliant security controls</li>
              <li><strong>HIPAA:</strong> Health data protection measures in place</li>
            </ul>
          </section>

          <section className="page-section">
            <h2>Incident Response</h2>
            <p>
              In the unlikely event of a security incident, our 24/7 incident response team is ready to:
            </p>
            <ul>
              <li>Immediately investigate and contain the breach</li>
              <li>Notify affected users within 72 hours</li>
              <li>Cooperate with law enforcement if necessary</li>
              <li>Provide detailed incident reports</li>
              <li>Implement remediation measures</li>
            </ul>
          </section>

          <section className="page-section">
            <h2>User Security Practices</h2>
            <p>
              To maximize your security, we recommend:
            </p>
            <ul>
              <li>Use strong, unique passwords</li>
              <li>Enable two-factor authentication</li>
              <li>Use a secure, private internet connection</li>
              <li>Keep your browser and OS updated</li>
              <li>Do not share your account credentials</li>
              <li>Report suspicious activity immediately</li>
            </ul>
          </section>

          <section className="page-section">
            <h2>Security Team</h2>
            <p>
              Our dedicated security team works 24/7 to:
            </p>
            <ul>
              <li>Monitor systems for threats and vulnerabilities</li>
              <li>Perform regular penetration testing</li>
              <li>Review and update security policies</li>
              <li>Respond to security incidents</li>
              <li>Maintain compliance with regulations</li>
            </ul>
          </section>

          <section className="page-section">
            <h2>Report a Security Issue</h2>
            <p>
              If you discover a security vulnerability, please report it responsibly to our security team at:
            </p>
            <p><strong>security@cyberzens.com</strong></p>
            <p>
              We appreciate responsible disclosure and will acknowledge receipt within 24 hours and work with you to resolve the issue.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SecurityPolicy;
