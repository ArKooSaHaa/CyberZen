import React, { useState } from 'react';
import NavigationBar from '../components/NavigationBar';
import '../styles/ProfessionalPage.css';

const FAQ = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "What is CyberZens?",
      answer: "CyberZens is a secure, anonymous reporting platform designed to help individuals report cybercrime, fraud, and security incidents safely without compromising their identity."
    },
    {
      id: 2,
      question: "How does encryption work on CyberZens?",
      answer: "We use military-grade AES-256 encryption for all data transmission and storage. Your reports are encrypted end-to-end, meaning only authorized personnel can decrypt and read them."
    },
    {
      id: 3,
      question: "Can my employer see my reports?",
      answer: "No. Your reports are completely confidential. Even with access to your internet connection, your employer cannot see your reports due to our encryption."
    },
    {
      id: 4,
      question: "What information should I include in my report?",
      answer: "Provide as much detail as possible: what happened, when it occurred, who was involved, and any evidence (screenshots, links, etc.). The more information you provide, the better authorities can investigate."
    },
    {
      id: 5,
      question: "How do I know if my report was received?",
      answer: "You'll receive a confirmation page with a unique tracking number immediately after submission. Save this number to check your report status anytime."
    },
    {
      id: 6,
      question: "Can I edit my report after submission?",
      answer: "Reports cannot be edited after submission to maintain the integrity of the record. However, you can submit additional information as a follow-up using your tracking number."
    },
    {
      id: 7,
      question: "Who has access to my report?",
      answer: "Only authorized law enforcement and relevant agencies have access to your report. CyberZens staff do not read individual reports."
    },
    {
      id: 8,
      question: "What happens after I submit a report?",
      answer: "Your report is immediately forwarded to the appropriate authorities. They will investigate and may reach out if they need additional information."
    },
    {
      id: 9,
      question: "Is CyberZens available in my country?",
      answer: "CyberZens is available globally. However, some specific features may be limited based on local regulations. Check with local authorities for reporting requirements."
    },
    {
      id: 10,
      question: "Can I report anonymously from my work computer?",
      answer: "While CyberZens protects your identity, we recommend using your personal device and private network (not work WiFi) for maximum security."
    }
  ];

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="professional-page-container">
      <NavigationBar currentPage="faq" />
      <div className="professional-page-content">
        <div className="page-header">
          <h1>Frequently Asked Questions</h1>
          <p className="subtitle">Get quick answers to common questions</p>
        </div>

        <div className="page-body">
          <section className="page-section">
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
            <h2>Still Have Questions?</h2>
            <p>
              If you didn't find what you're looking for, please visit our Help Center or contact our support team.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
