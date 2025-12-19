import React from 'react';
import NavigationBar from '../components/NavigationBar';
import '../styles/ProfessionalPage.css';

const Encryption = () => {
  return (
    <div className="professional-page-container">
      <NavigationBar currentPage="encryption" />
      <div className="professional-page-content">
        <div className="page-header">
          <h1>Encryption</h1>
          <p className="subtitle">Understanding our encryption technology</p>
        </div>

        <div className="page-body">
          <section className="page-section">
            <h2>What is Encryption?</h2>
            <p>
              Encryption is the process of converting readable data (plaintext) into unreadable code (ciphertext) using mathematical algorithms. Only someone with the correct decryption key can convert the ciphertext back into readable data.
            </p>
          </section>

          <section className="page-section">
            <h2>How CyberZens Uses Encryption</h2>
            <ul>
              <li><strong>End-to-End Encryption:</strong> Your data is encrypted on your device before transmission</li>
              <li><strong>Transport Layer Security:</strong> Data is protected during transmission using TLS 1.3</li>
              <li><strong>Storage Encryption:</strong> Data is encrypted while stored on our servers</li>
              <li><strong>Key Management:</strong> Encryption keys are securely stored and rotated regularly</li>
            </ul>
          </section>

          <section className="page-section">
            <h2>Encryption Standards</h2>
            <div className="encryption-standards">
              <div className="standard-card">
                <h3>AES-256</h3>
                <p><strong>Type:</strong> Symmetric Encryption</p>
                <p><strong>Use:</strong> Data at rest (stored on servers)</p>
                <p><strong>Security Level:</strong> Military-grade</p>
                <p>
                  Advanced Encryption Standard with 256-bit key length. Used by government agencies and financial institutions worldwide. Considered unbreakable with current technology.
                </p>
              </div>

              <div className="standard-card">
                <h3>TLS 1.3</h3>
                <p><strong>Type:</strong> Asymmetric Encryption</p>
                <p><strong>Use:</strong> Data in transit (transmission)</p>
                <p><strong>Security Level:</strong> Industry Standard</p>
                <p>
                  Transport Layer Security protocol. Protects your connection from eavesdropping and tampering. Latest version with improved security and performance.
                </p>
              </div>

              <div className="standard-card">
                <h3>RSA-4096</h3>
                <p><strong>Type:</strong> Asymmetric Encryption</p>
                <p><strong>Use:</strong> Key exchange and digital signatures</p>
                <p><strong>Security Level:</strong> Enterprise Grade</p>
                <p>
                  Rivest-Shamir-Adleman encryption with 4096-bit keys. Used for secure key distribution and authentication.
                </p>
              </div>
            </div>
          </section>

          <section className="page-section">
            <h2>Encryption Flow</h2>
            <ol>
              <li><strong>You Create Report:</strong> When you enter your report, it exists in plaintext on your device</li>
              <li><strong>Client-Side Encryption:</strong> Your device encrypts the report before sending</li>
              <li><strong>Secure Transmission:</strong> Encrypted data travels through encrypted TLS connection</li>
              <li><strong>Server Reception:</strong> Our server receives the encrypted data</li>
              <li><strong>Storage Encryption:</strong> Data is stored encrypted using AES-256</li>
              <li><strong>Authorized Access:</strong> Only authorized personnel can decrypt and view your report</li>
            </ol>
          </section>

          <section className="page-section">
            <h2>Key Management</h2>
            <ul>
              <li><strong>Key Generation:</strong> Cryptographically secure random number generation</li>
              <li><strong>Key Storage:</strong> Hardware security modules (HSMs) for key protection</li>
              <li><strong>Key Rotation:</strong> Regular rotation of encryption keys</li>
              <li><strong>Key Distribution:</strong> Secure distribution using industry-standard protocols</li>
              <li><strong>Key Access:</strong> Restricted access logs for all key operations</li>
              <li><strong>Backup Keys:</strong> Redundant encrypted key backups in secure locations</li>
            </ul>
          </section>

          <section className="page-section">
            <h2>Perfect Forward Secrecy</h2>
            <p>
              CyberZens implements Perfect Forward Secrecy (PFS), which means that even if an attacker obtains our encryption keys, they cannot decrypt previously captured communications. Each session uses unique encryption keys that are discarded after use.
            </p>
          </section>

          <section className="page-section">
            <h2>Quantum Resistance</h2>
            <p>
              We are actively preparing for post-quantum cryptography. While current encryption is secure against quantum computers (as they don't yet exist), we're implementing quantum-resistant algorithms in preparation for future technology.
            </p>
          </section>

          <section className="page-section">
            <h2>Third-Party Verification</h2>
            <p>
              Our encryption implementations are regularly audited by independent security firms to ensure they meet the highest standards. Current certifications:
            </p>
            <ul>
              <li>NIST Recommended Algorithms</li>
              <li>FIPS 140-2 Level 3 Certified</li>
              <li>Independent Security Audit Reports Available</li>
            </ul>
          </section>

          <section className="page-section">
            <h2>What You Need to Know</h2>
            <ul>
              <li>Your data is encrypted from the moment it leaves your device</li>
              <li>No one at CyberZens, not even administrators, can read your report in plaintext without proper authorization</li>
              <li>Encryption is automatic—you don't need to do anything</li>
              <li>Your data remains encrypted even after investigation</li>
              <li>If you forget your password, we cannot decrypt your data for you</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Encryption;
