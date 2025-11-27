import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAiFeedback } from '../hooks/useAiFeedback';

const Home: React.FC = () => {
    const [note, setNote] = useState('');
  const mutation = useAiFeedback();

  const isLoading = mutation.status === 'pending';
  const isError = mutation.status === 'error';
  const isSuccess = mutation.status === 'success';

  const submit = () => {
    if (!note.trim()) return;
    mutation.mutate({ note });
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card title="AI Note Feedback">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full min-h-[150px] border rounded-md p-3 mb-3 bg-white dark:bg-gray-800"
          placeholder="Write your note..."
        />
        <div className="flex gap-2">
          <Button onClick={submit} disabled={isLoading}>{isLoading ? 'Processing...' : 'Get Feedback'}</Button>
          <Button variant="secondary" onClick={() => setNote('')}>Clear</Button>
        </div>

        <div className="mt-4">
          {isError && <p className="text-red-500">Failed to get feedback</p>}
          {isSuccess && mutation.data && (
            <Card className="mt-4" title="Feedback Result">
              <pre className="whitespace-pre-wrap">{mutation.data.feedback}</pre>
            </Card>
          )}
        </div>
      </Card>
    </div>
  );
}

export default Home;