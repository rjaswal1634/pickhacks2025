import React, { useEffect, useState } from 'react';

// Updated interface based on the new response structure
interface ApiResponse {
  statusCode: string;
  message: string;
  data: string;
}

const FetchDataExample: React.FC = () => {
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.example.com/data');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: ApiResponse = await response.json();
        setResponse(result);
      } catch (error) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Data from API</h1>
      {response ? (
        <div>
          <p>Status Code: {response.statusCode}</p>
          <p>Message: {response.message}</p>
          <p>Data: {response.data}</p>
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default FetchDataExample;
