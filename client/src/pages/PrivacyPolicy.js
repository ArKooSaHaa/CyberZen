import React from 'react';
import NavigationBar from '../components/NavigationBar';
import '../styles/ProfessionalPage.css';

const PrivacyPolicy = () => {
  return (
    <div className="professional-page-container">
      <NavigationBar currentPage="privacy" />
      <div className="professional-page-content">
        <div className="page-header">
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last updated: November 2024</p>
        </div>

        <div className="page-body">
          <section className="page-section">
            <h2>1. Introduction</h2>
            <p>
              CyberZens ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Platform.
            </p>
          </section>

          <section className="page-section">
            <h2>2. Information We Collect</h2>
            <p>We may collect information about you in a variety of ways. The information we may collect on the Platform includes:</p>
            <ul>
              <li><strong>Personal Data:</strong> Name, email address, phone number, and other contact information</li>
              <li><strong>Report Data:</strong> Information contained in reports you submit</li>
              <li><strong>Technical Data:</strong> IP address, browser type, operating system, and usage patterns</li>
              <li><strong>Cookies:</strong> Information collected through cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="page-section">
            <h2>3. Use of Your Information</h2>
            <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Platform to:</p>
            <ul>
              <li>Generate a personal profile about you so that future visits to the Platform are tailored to your preferences</li>
              <li>Increase the efficiency and operation of the Platform</li>
              <li>Monitor and analyze usage and trends to improve your experience</li>
              <li>Notify you of important changes to the Platform</li>
              <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Platform</li>
            </ul>
          </section>

          <section className="page-section">
            <h2>4. Disclosure of Your Information</h2>
            <p>
              We may share your information in the following situations:
            </p>
            <ul>
              <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information is necessary</li>
              <li><strong>Third-Party Service Providers:</strong> We may share your information with vendors, consultants, and other service providers</li>
              <li><strong>Business Transfers:</strong> Your information may be transferred as part of a merger, bankruptcy, or sale</li>
            </ul>
          </section>

          <section className="page-section">
            <h2>5. Security of Your Information</h2>
            <p>
              We use administrative, technical, and physical security measures to protect your personal information. Although we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.
            </p>
          </section>

          <section className="page-section">
            <h2>6. Contact Us Regarding Privacy</h2>
            <p>
              If you have questions or comments about this Privacy Policy, please contact us at:
            </p>
            <ul>
              <li>Email: privacy@cyberzens.com</li>
              <li>Address: Contact us through our support page</li>
            </ul>
          </section>

          <section className="page-section">
            <h2>7. Changes to Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes.
            </p>
          </section>

          <section className="page-section">
            <h2>8. Your Privacy Rights</h2>
            <p>
              You have the right to request access to, correction of, or deletion of your personal data. You may also have other rights depending on your location. Please contact us to exercise these rights.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
