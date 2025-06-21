import { Lightbulb, Volume2 } from 'lucide-react';
import React from 'react';

function QuestionsSection({ mockInterviewQues, activeQuestion, setActiveQuestion }) {
  const textToSpeech = (text) => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert('Sorry, your browser does not support text to speech');
    }
  };

  return mockInterviewQues && (
    <div className="p-4 sm:p-5 border rounded-lg my-6 sm:my-10">
      {/* Question selectors */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
        {mockInterviewQues.map((ques, index) => (
          <h2 
            key={index} 
            onClick={() => setActiveQuestion(index)}
            className={`px-3 py-1 rounded-full text-sm sm:text-xs text-center cursor-pointer transition duration-200
              ${activeQuestion === index 
                ? 'bg-primary text-white font-medium shadow-sm' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
          >
            Q{index + 1}
          </h2>
        ))}
      </div>

      {/* Current Question */}
      <div className="flex items-start gap-3 mb-6">
        <h2 className="text-base sm:text-lg font-medium text-gray-800 flex-1">
          {mockInterviewQues[activeQuestion]?.question}
        </h2>
        <Volume2
          className="cursor-pointer text-gray-600 hover:text-blue-600 transition"
          onClick={() => textToSpeech(mockInterviewQues[activeQuestion]?.question)}
        />
      </div>

      {/* Note section */}
      <div className="border rounded-lg p-4 sm:p-5 bg-blue-100 text-blue-800 mt-12">
        <h2 className="flex items-center gap-2 sm:gap-4 mb-2">
          <Lightbulb />
          <strong>Note:</strong>
        </h2>
        <p className="text-sm sm:text-base leading-relaxed">
          {process.env.NEXT_PUBLIC_QUESTION_NOTE}
        </p>
      </div>
    </div>
  );
}

export default QuestionsSection;
