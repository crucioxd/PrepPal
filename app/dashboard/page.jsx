import React from 'react';
import AddnewInterview from './_components/AddnewInterview';
import InterviewList from './_components/InterviewList';

function Dashboard() {
  return (
    <div className="px-4 sm:px-6 md:px-10 py-8 min-h-screen">
      {/* Heading */}
      <div className="mb-6">
        <h2 className="font-bold text-2xl sm:text-3xl mb-1">Dashboard</h2>
        <p className="text-gray-500 text-sm sm:text-base">
          Create and start your AI Mockup interview
        </p>
      </div>

      {/* Add Interview Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        <AddnewInterview />
      </div>

      {/* Interview List */}
      <InterviewList />
    </div>
  );
}

export default Dashboard;
