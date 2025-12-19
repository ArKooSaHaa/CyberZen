import React from 'react';
import NavigationBar from '../components/NavigationBar';
import '../styles/ProfessionalPage.css';

const Compliance = () => {
  return (
    <div className="professional-page-container">
      <NavigationBar currentPage="compliance" />
      <div className="professional-page-content">
        <div className="page-header">
          <h1>Compliance</h1>
          <p className="subtitle">Our commitment to standards and regulations</p>
        </div>

        <div className="page-body">
          <section className="page-section">
            <h2>Regulatory Compliance</h2>
            <p>
              CyberZens is committed to maintaining the highest standards of compliance with international regulations and industry best practices. Below are the key compliance frameworks we adhere to.
            </p>
          </section>

          <section className="page-section">
            <h2>GDPR - General Data Protection Regulation</h2>
            <ul>
              <li><strong>Jurisdiction:</strong> European Union and EEA</li>
              <li><strong>Status:</strong> Full Compliance</li>
              <li><strong>User Rights:</strong> Access, rectification, erasure, portability of data</li>
              <li><strong>Data Processing:</strong> Lawful basis established for all processing</li>
              <li><strong>DPA:</strong> Data Processing Agreements available upon request</li>
              <li><strong>Incident Notification:</strong> 72-hour breach notification requirement met</li>
            </ul>
          </section>

          <section className="page-section">
            <h2>CCPA - California Consumer Privacy Act</h2>
            <ul>
              <li><strong>Jurisdiction:</strong> California, USA</li>
              <li><strong>Status:</strong> Full Compliance</li>
              <li><strong>Consumer Rights:</strong> Right to know, delete, opt-out, data portability</li>
              <li><strong>Service Providers:</strong> Contracts include CCPA requirements</li>
              <li><strong>Privacy Policy:</strong> Detailed CCPA-compliant privacy disclosures</li>
              <li><strong>Do Not Sell:</strong> We do not sell personal information</li>
            </ul>
          </section>

          <section className="page-section">
            <h2>ISO 27001 - Information Security Management</h2>
            <ul>
              <li><strong>Standard:</strong> International ISO/IEC 27001:2022</li>
              <li><strong>Certification:</strong> Active and verified</li>
              <li><strong>Scope:</strong> Information security management system</li>
              <li><strong>Audit Frequency:</strong> Annual surveillance audits</li>
              <li><strong>Coverage:</strong> All operations and data processing</li>
            </ul>
          </section>

          <section className="page-section">
            <h2>SOC 2 - Service Organization Control</h2>
            <ul>
              <li><strong>Type:</strong> Type II Attestation</li>
              <li><strong>Trust Principles:</strong> Security, availability, processing integrity, confidentiality, privacy</li>
              <li><strong>Audit Period:</strong> 12-month continuous monitoring</li>
              <li><strong>Controls:</strong> 40+ control points assessed</li>
              <li><strong>Report:</strong> Available to authorized customers</li>
            </ul>
          </section>

          <section className="page-section">
            <h2>HIPAA - Health Insurance Portability and Accountability Act</h2>
            <ul>
              <li><strong>Applicability:</strong> When processing health information</li>
              <li><strong>Status:</strong> HIPAA-compliant safeguards</li>
              <li><strong>BAA:</strong> Business Associate Agreements available</li>
              <li><strong>Encryption:</strong> Required HIPAA encryption standards</li>
              <li><strong>Audit Logs:</strong> Comprehensive access logs maintained</li>
            </ul>
          </section>

          <section className="page-section">
            <h2>Data Residency</h2>
            <ul>
              <li><strong>Default Location:</strong> Data stored in secure regional data centers</li>
              <li><strong>GDPR Compliance:</strong> EU data remains within EU borders</li>
              <li><strong>Data Transfer:</strong> Standard contractual clauses for international transfers</li>
              <li><strong>Redundancy:</strong> Geographic redundancy for disaster recovery</li>
            </ul>
          </section>

          <section className="page-section">
            <h2>PCI DSS - Payment Card Industry Data Security Standard</h2>
            <ul>
              <li><strong>Level:</strong> Level 1 Compliance (highest)</li>
              <li><strong>Scope:</strong> All payment processing</li>
              <li><strong>Tokenization:</strong> Credit card data tokenized immediately</li>
              <li><strong>Audit:</strong> Annual PCI DSS attestation</li>
              <li><strong>3D Secure:</strong> Enhanced authentication for card transactions</li>
            </ul>
          </section>

          <section className="page-section">
            <h2>Industry Standards</h2>
            <ul>
              <li><strong>NIST Cybersecurity Framework:</strong> Implemented core functions (Identify, Protect, Detect, Respond, Recover)</li>
              <li><strong>CIS Controls:</strong> Following Center for Internet Security best practices</li>
              <li><strong>OWASP Standards:</strong> Web application security standards</li>
              <li><strong>SANS Institute:</strong> Security training and best practices</li>
            </ul>
          </section>

          <section className="page-section">
            <h2>Legal and Regulatory Compliance</h2>
            <ul>
              <li><strong>Terms of Service:</strong> Clear, transparent terms</li>
              <li><strong>Privacy Policy:</strong> Detailed privacy disclosures</li>
              <li><strong>Accessibility:</strong> WCAG 2.1 Level AA compliance</li>
              <li><strong>Copyright:</strong> DMCA compliant takedown procedures</li>
              <li><strong>Data Retention:</strong> Compliant retention policies</li>
            </ul>
          </section>

          <section className="page-section">
            <h2>Compliance Management</h2>
            <ul>
              <li><strong>Compliance Officer:</strong> Dedicated compliance leadership</li>
              <li><strong>Legal Team:</strong> In-house legal expertise</li>
              <li><strong>Regular Audits:</strong> Internal and external compliance audits</li>
              <li><strong>Training:</strong> Regular compliance training for all staff</li>
              <li><strong>Policy Updates:</strong> Policies updated with regulatory changes</li>
            </ul>
          </section>

          <section className="page-section">
            <h2>Compliance Documentation</h2>
            <p>
              The following documentation is available upon request:
            </p>
            <ul>
              <li>ISO 27001 Certificate</li>
              <li>SOC 2 Type II Report</li>
              <li>Data Processing Agreement (DPA)</li>
              <li>Business Associate Agreement (BAA)</li>
              <li>PCI DSS Attestation</li>
              <li>Penetration Testing Reports</li>
              <li>Vulnerability Assessment Reports</li>
            </ul>
            <p>
              Contact our compliance team at: <strong>compliance@cyberzens.com</strong>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Compliance;
