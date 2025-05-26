import { useState, useEffect } from 'react';
import axios from 'axios';

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/problems/');

        let problemsData = [];
        problemsData = response.data.problems;

        if (problemsData.length === 0) {
          console.warn('Received empty problems array');
        }

        setProblems(problemsData);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-500 space-y-4">
        <div className="text-2xl font-bold">Error Loading Problems</div>
        <div>{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!problems || problems.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">No problems available</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">Coding Problems</h1>
      
      <div className="space-y-4">
        {problems.map((problem, index) => (
          <div 
            key={problem._id || problem.title} 
            className="flex items-center justify-between border-b pb-4"
          >
            <div className="flex items-center space-x-4">
              <span className="text-gray-500 w-8">{index + 1}.</span>
              <div>
                <span className="font-medium">{problem.title || 'Untitled Problem'}</span>
                {problem.difficulty && (
                  <span className={`ml-2 text-sm ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                )}
              </div>
            </div>
            
            <button className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-sm">
              Solve Problem
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Problems;