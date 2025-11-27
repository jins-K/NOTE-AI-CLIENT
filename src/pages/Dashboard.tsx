import React from 'react'
import {useFeedback} from '../hooks/useFeedback';

const Dashboard: React.FC = () => {
  const {data : feedbacks, isLoading} = useFeedback();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="space-y-4">
        {feedbacks && feedbacks.length > 0 ? (
          feedbacks.map((feedback) => (
            <div key={feedback.id} className="p-4 bg-gray-700 rounded">
              <p className="font-semibold">Q: {feedback.question}</p>
              <p className="mt-2">A: {feedback.answer}</p>
            </div>
          ))
        ) : (
          <p>No feedback yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard
