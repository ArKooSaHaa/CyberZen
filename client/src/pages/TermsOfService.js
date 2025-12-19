import React, { useState } from 'react';
import NavigationBar from '../components/NavigationBar';
import '../styles/ProfessionalPage.css';

const TermsOfService = () => {
  const [isLoaded, setIsLoaded] = useState(true);

  return (
    <div className="professional-page-container">
      <NavigationBar currentPage="terms" />
      <div className="professional-page-content">
        <div className="page-header">
          <h1>Terms of Service</h1>
          <p className="last-updated">Last updated: November 2024</p>
        </div>

        <div className="page-body">
          <section className="page-section">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using CyberZens ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="page-section">
            <h2>2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials (information or software) on CyberZens for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul>
              <li>Modifying or copying the materials</li>
              <li>Using the materials for any commercial purpose or for any public display</li>
              <li>Attempting to decompile or reverse engineer any software contained on CyberZens</li>
              <li>Removing any copyright or other proprietary notations from the materials</li>
              <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
            </ul>
          </section>

          <section className="page-section">
            <h2>3. Disclaimer of Warranties</h2>
            <p>
              The materials on CyberZens are provided on an 'as is' basis. CyberZens makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section className="page-section">
            <h2>4. Limitations of Liability</h2>
            <p>
              In no event shall CyberZens or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on CyberZens.
            </p>
          </section>

          <section className="page-section">
            <h2>5. Accuracy of Materials</h2>
            <p>
              The materials appearing on CyberZens could include technical, typographical, or photographic errors. CyberZens does not warrant that any of the materials on CyberZens are accurate, complete, or current. CyberZens may make changes to the materials contained on CyberZens at any time without notice.
            </p>
          </section>

          <section className="page-section">
            <h2>6. User Conduct</h2>
            <p>
              You agree not to use the Platform for any unlawful purpose or in any way that could damage, disable, or impair the Platform. You further agree not to:
            </p>
            <ul>
              <li>Harass, threaten, or abuse others</li>
              <li>Engage in any illegal activity</li>
              <li>Post false, misleading, or defamatory content</li>
              <li>Attempt unauthorized access to the Platform</li>
            </ul>
          </section>

          <section className="page-section">
            <h2>7. Modifications to Terms</h2>
            <p>
              CyberZens may revise these terms of service for CyberZens at any time without notice. By using this Platform, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section className="page-section">
            <h2>8. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which CyberZens operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          <section className="page-section">
            <h2>9. Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at <strong>support@cyberzens.com</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
