import React, { useState } from 'react';
import './FaqDrawer.css';

const faqs = [
  {
    question: "How do I submit a grievance?",
    answer: "Log in to the Student Portal and select “Submit Grievance.” Enter the grievance title and description, select the appropriate category, department, and priority, and provide any supporting information or attachments before submitting."
  },
  {
    question: "Can I track my grievance?",
    answer: "Yes. Students can view their submitted grievances through “My Grievances” and track the current status and progress from submission to resolution."
  },
  {
    question: "Who handles my grievance?",
    answer: "After submission, the grievance is reviewed and associated with the appropriate department. An administrator can assign it to a staff member, who then handles the grievance and updates its progress."
  },
  {
    question: "What categories of grievances can I submit?",
    answer: "The portal supports categories such as Academic, Hostel & Accommodation, Examination & Evaluation, Library Services, Infrastructure & Facilities, Fee & Financial Services, Canteen & Food Quality, and General Inquiry."
  },
  {
    question: "Can I attach supporting documents?",
    answer: "Yes. You can provide supporting documents or images with your grievance. The portal maintains attachment information as part of the grievance record."
  },
  {
    question: "What happens after I submit a grievance?",
    answer: "After submission, the grievance follows a structured workflow: Submitted → Under Review → Assigned → In Progress → Resolved → Closed. The status history records important changes throughout the grievance lifecycle."
  },
  {
    question: "What do the priority levels mean?",
    answer: "Priority indicates the urgency and impact of the grievance. The portal supports four levels: Low, Medium, High, and Urgent. Higher-priority issues can be given more immediate attention."
  },
  {
    question: "Who can access the portal?",
    answer: "The portal supports three user roles: Student, Staff, and Admin. Each role has different functions according to its responsibilities. Students submit and track grievances, staff handle assigned grievances, and administrators manage the overall grievance process."
  }
];

const FaqDrawer = ({ isOpen, onClose }) => {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="faq-drawer-overlay" onClick={onClose}></div>
      <div className={`faq-drawer ${isOpen ? 'open' : ''}`}>
        <div className="faq-drawer-header">
          <h2>Frequently Asked Questions</h2>
          <button className="faq-drawer-close" onClick={onClose} aria-label="Close FAQ">
            &times;
          </button>
        </div>
        <div className="faq-drawer-content">
          <p className="faq-drawer-subtitle">
            Find answers to common questions about submitting, tracking, and managing grievances.
          </p>
          <div className="faq-accordion-container">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`drawer-faq-item ${activeFaq === index ? 'active' : ''}`}
                onClick={() => toggleFaq(index)}
              >
                <div className="drawer-faq-question">
                  <span>❓ {faq.question}</span>
                  <span className="drawer-faq-toggle-icon">
                    {activeFaq === index ? '▲' : '▼'}
                  </span>
                </div>
                <div className="drawer-faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default FaqDrawer;
