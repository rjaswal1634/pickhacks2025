import React, { useEffect, useState } from 'react';

// Step 1: Define the interface for the response data structure.
interface ApiResponse {
  statusCode: string;
  message: string;
  data: string;
}

const FetchHiData: React.FC = () => {
  // Step 2: Set up state to manage the response data, loading state, and any errors.
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Step 3: Define the async function to fetch data from the API.
    const fetchData = async () => {
      try {
        // Fetch data from the local API
        const res = await fetch('http://localhost:8080/public/hi');
        if (!res.ok) {
          // If the response is not okay, throw an error.
          throw new Error('Network response was not ok');
        }

        // Step 4: Parse the response as JSON
        const result: ApiResponse = await res.json();
        
        // Set the response data into state
        setResponse(result);
      } catch (error) {
        // Handle errors (network, API, etc.)
        setError('Failed to fetch data');
      } finally {
        // Step 5: Set loading to false once the fetch completes
        setLoading(false);
      }
    };

    // Call the fetchData function
    fetchData();
  }, []); // Empty dependency array means this will run once when the component mounts.

  // Step 6: Render loading, error, or the data
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

export default FetchHiData;
