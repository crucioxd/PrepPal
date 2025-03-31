import React from 'react';
import Header from '../dashboard/_components/Header';

const steps = [
  {
    title: "Create Your Profile",
    description:
      "Sign up or log in, and provide your job description and years of experience. This helps us tailor the interview experience just for you.",
  },
  {
    title: "Choose Your Interview",
    description:
      "Select from a variety of mock interview types. Each interview is customized with 5 targeted questions based on your provided details.",
  },
  {
    title: "Engage in a Real Interview",
    description:
      "Enable your microphone and camera for a realistic experience. Deliver your answers as if you were in an actual interview setting.",
  },
  {
    title: "Receive Detailed Feedback",
    description:
      "After the interview, get comprehensive feedback on each answer along with the correct responses, plus an overall performance rating.",
  },
  {
    title: "Review Past Interviews",
    description:
      "Access your previous mock interviews via the dashboard to track your progress and continue improving.",
  },
];

export default function HowItWorks() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-blue-800 text-center mb-12">
          How PrepPal works?
        </h1>
        <div className="flex flex-col space-y-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row items-center bg-white rounded-lg shadow-xl p-6 transform transition duration-500 hover:scale-95 hover:shadow-2xl"
            >
              <div className="flex-shrink-0 bg-blue-600 text-white rounded-full h-16 w-16 flex items-center justify-center font-bold text-xl md:mr-6 mb-4 md:mb-0">
                {index + 1}
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-blue-700 mb-2">
                  {step.title}
                </h2>
                <p className="text-gray-700">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
