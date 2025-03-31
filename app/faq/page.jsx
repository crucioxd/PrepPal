import React from 'react';
import Header from '../dashboard/_components/Header';

const faqs = [
  {
    question: "What is PrepPal?",
    answer:
      "PrepPal is an AI-powered mock interview platform designed to help you practice for interviews by simulating a real interview experience.",
  },
  {
    question: "How does the interview process work?",
    answer:
      "You can select from various interview types. Each interview consists of 5 questions tailored to the job description and years of experience you provide.",
  },
  {
    question: "How is the interview conducted?",
    answer:
      "You have the option to enable your microphone and camera to give a live, real-interview speech, making the experience as realistic as possible.",
  },
  {
    question: "What kind of feedback will I receive?",
    answer:
      "After your interview, you'll receive detailed feedback for each answer—including the correct answer—as well as an overall feedback rating out of 10.",
  },
  {
    question: "Can I review my previous interviews?",
    answer:
      "Yes, all your previous mock interviews are accessible from the dashboard, allowing you to track your progress over time.",
  },
];

export default function FAQ() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-blue-800 text-center mb-8">
          Frequently Asked Questions
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 transform transition duration-500 hover:scale-90 hover:shadow-2xl"
            >
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">
                {faq.question}
              </h2>
              <p className="text-gray-700">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
