import React, {useState} from 'react'
import './Help.css'

// Dummy data for the FAQ section
const faqData = [
  {
    question: 'How do I reset my password?',
    answer:
      'To reset your password, go to the login page and click on the "Forgot Password" link. You will receive an email with instructions on how to create a new password.'
  },
  {
    question: 'How can I view my assigned projects?',
    answer:
      'You can view all of your current and pending projects by navigating to the "My Projects" page from the sidebar. Completed projects are listed on the "Completed Projects" page.'
  },
  {
    question: 'Where can I find my payout history?',
    answer:
      'Your complete payout history is available on the "My Payout" page, accessible from the sidebar. It includes details of each payment, such as the amount and date paid.'
  },
  {
    question: 'How do I update my profile information?',
    answer:
      'You can update your personal details, such as your name, email, and contact number, by clicking on "My Profile" in the header and navigating to the "Edit Profile" section.'
  },
  {
    question: 'Who do I contact for technical support?',
    answer:
      'For any technical issues or questions not covered in this FAQ, please contact your assigned manager or team lead for assistance.'
  }
]

// AccordionItem component for individual FAQ items
const AccordionItem = ({ item, isOpen, onClick }) => {
  return (
    <div className="accordion-item">
      <button className="accordion-header" onClick={onClick}>
        <span className="accordion-title">{item.question}</span>
        <span className={`accordion-icon ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      {isOpen && (
        <div className="accordion-content">
          <p>{item.answer}</p>
        </div>
      )}
    </div>
  )
}

// Main Help component
const Help = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const handleItemClick = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="help-page">
      <div className="help-header">
        <h1 className="page-title">Help & Support</h1>
        <p className="page-subtitle">
          Find answers to common questions about using the platform.
        </p>
      </div>

      <div className="faq-container">
        <h2 className="faq-title">Frequently Asked Questions</h2>
        <div className="accordion">
          {faqData.map((item, index) => (
            <AccordionItem
              key={index}
              item={item}
              isOpen={openIndex === index}
              onClick={() => handleItemClick(index)}
            />
          ))}
        </div>
      </div>

      <div className="contact-support">
        <h2 className="contact-title">Still Need Help?</h2>
        <p className="contact-text">
          If you can't find the answer you're looking for, please reach out to
          your manager for further assistance.
        </p>
        <button className="contact-button">Contact Manager</button>
      </div>
    </div>
  )
}

export default Help
