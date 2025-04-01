// pages/init/page.tsx

'use client';

import { useState } from 'react';

const InitPage = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleInitData = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/init/api');
      const data = await response.json();
        console.log(data);
      if (response.ok) {
        setMessage('Data initialized successfully');
      } else {
        setMessage('Error initializing data');
      }
    } catch (error) {
      setMessage('Error initializing data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Initialize Data</h1>
      <button onClick={handleInitData} disabled={loading}>
        {loading ? 'Initializing...' : 'Initialize Data'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default InitPage;
