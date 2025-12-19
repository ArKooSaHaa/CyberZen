import React, { useState } from 'react';
import NavigationBar from '../components/NavigationBar';
import '../styles/ProfessionalPage.css';

const HelpCenter = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How do I create an anonymous report?",
      answer: "Simply click on 'Make Anonymous Report' on the homepage, fill in the details of your incident, and submit. Your identity will be protected with military-grade encryption."
    },
    {
      id: 2,
      question: "Is my information really anonymous?",
      answer: "Yes. We use end-to-end encryption and never store identifiable information linked to your report. Your privacy is our top priority."
    },
    {
      id: 3,
      question: "Can I track my report?",
      answer: "Yes. After submitting a report, you'll receive a unique tracking number. You can use this to check the status of your report anytime."
    },
    {
      id: 4,
      question: "How long does it take to process a report?",
      answer: "Reports are processed immediately upon submission. Authorities are notified within minutes, though response times depend on the nature and severity of the report."
    },
    {
      id: 5,
      question: "What types of incidents can I report?",
      answer: "You can report cybercrime, fraud, harassment, data breaches, phishing attempts, and many other security-related incidents."
    },
    {
      id: 6,
      question: "Is there a cost to use CyberZens?",
      answer: "No. CyberZens is completely free to use. We believe everyone should have access to safe reporting tools."
    }
  ];

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="professional-page-container">
      <NavigationBar currentPage="help" />
      <div className="professional-page-content">
        <div className="page-header">
          <h1>Help Center</h1>
          <p className="subtitle">Find answers to common questions and get support</p>
        </div>

        <div className="page-body">
          <section className="page-section">
            <h2>Getting Started</h2>
            <div className="help-cards">
              <div className="help-card">
                <div className="help-icon">📝</div>
                <h3>Submit a Report</h3>
                <p>Learn how to safely and anonymously submit your first report to authorities.</p>
              </div>
              <div className="help-card">
                <div className="help-icon">🔍</div>
                <h3>Track Your Report</h3>
                <p>Use your unique tracking number to monitor the status of your submission.</p>
              </div>
              <div className="help-card">
                <div className="help-icon">🔒</div>
                <h3>Understand Privacy</h3>
                <p>Learn about our security measures and how we protect your identity.</p>
              </div>
            </div>
          </section>

          <section className="page-section">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-list">
              {faqs.map((faq) => (
                <div key={faq.id} className="faq-item">
                  <button
                    className={`faq-question ${expandedFaq === faq.id ? 'active' : ''}`}
                    onClick={() => toggleFaq(faq.id)}
                  >
                    <span>{faq.question}</span>
                    <span className="faq-icon">{expandedFaq === faq.id ? '−' : '+'}</span>
                  </button>
                  {expandedFaq === faq.id && (
                    <div className="faq-answer">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="page-section">
            <h2>Need More Help?</h2>
            <p>
              If you couldn't find the answer you're looking for, our support team is here to help. Reach out to us:
            </p>
            <ul>
              <li>Email: support@cyberzens.com</li>
              <li>Response time: Usually within 24 hours</li>
              <li>Available: 24/7 for critical issues</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
