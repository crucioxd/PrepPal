import { Lightbulb, Volume2 } from 'lucide-react';
import React from 'react';

function QuestionsSection({ mockInterviewQues, activeQuestion, setActiveQuestion,interviewData }) {
  const textToSpeech=(text)=>{
    if('speechSynthesis' in window){
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech)
    }
    else{
      alert('Sorry, your browser does not support text to speech ')
    }
  }
  return mockInterviewQues&&(
    <div className="p-5 border rounded-lg my-10">
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4 lg:grid-cols-4">
        {mockInterviewQues.map((ques, index) => (
          <h2 
            key={index} 
            onClick={() => setActiveQuestion(index)}
            className={`p-2 rounded-full text-xs md:text-xs text-center cursor-pointer 
              ${activeQuestion === index 
                ? 'bg-primary text-white' 
                : 'bg-gray-300'}`}
          >
            Question {index + 1}
          </h2> 
          
        ))}
     
       
      </div>
      <h2 className='my-5 text-md md:text-lg'>{mockInterviewQues[activeQuestion]?.question}</h2>
      <Volume2 className='cursor-pointer' onClick={()=>textToSpeech(mockInterviewQues[activeQuestion]?.question)}/>
      <div className='border rounded-lg p-5 bg-blue-100 text-blue-800 mt-20'>
        <h2 className='flex gap-5 items-center '>
          <Lightbulb/>
          <strong>Note: </strong>
        </h2>
        <h2 className='my-3 text-sm'>{process.env.NEXT_PUBLIC_QUESTION_NOTE}</h2>
      </div>
    </div>
  );
}

export default QuestionsSection;