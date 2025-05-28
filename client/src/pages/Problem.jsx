import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MonacoEditor from '@monaco-editor/react';

const Problem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [language, setLanguage] = useState('javascript');
  const [activeTab, setActiveTab] = useState('description');

  // Default code templates for each language
  const languageTemplates = {
    javascript: `// Write your solution here\nfunction solution(input) {\n  // Your code goes here\n  return input;\n}`,
    python: `# Write your solution here\ndef solution(input):\n    # Your code goes here\n    return input`,
    java: `// Write your solution here\npublic class Solution {\n    public static Object solution(Object input) {\n        // Your code goes here\n        return input;\n    }\n}`,
    cpp: `// Write your solution here\n#include <iostream>\n#include <vector>\n\nusing namespace std;\n\nObject solution(Object input) {\n    // Your code goes here\n    return input;\n}`
  };

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/problems/${id}`);
        setProblem(response.data.problem);
        setCode(languageTemplates[language]);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  useEffect(() => {
    if (problem) {
      setCode(languageTemplates[language]);
    }
  }, [language]);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      setOutput('Please write some code before running');
      return;
    }

    setIsRunning(true);
    setOutput('Running your code...');

    try {
      const response = await axios.post(`http://localhost:5000/problems/${id}/run`, {
        code,
        language,
        input: customInput
      });

      setOutput(response.data.output || response.data.error);
    } catch (err) {
      setOutput(`Error: ${err.response?.data?.error || err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEditorLanguage = () => {
    switch(language) {
      case 'python': return 'python';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      default: return 'javascript';
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
        <div className="text-2xl font-bold">Error Loading Problem</div>
        <div>{error}</div>
        <button 
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Problem not found</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 transition mr-4"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800">{problem.title}</h1>
          <div className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
            {problem.difficulty}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Problem Content */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  className={`px-4 py-3 font-medium ${activeTab === 'description' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                  onClick={() => setActiveTab('description')}
                >
                  Description
                </button>
                <button
                  className={`px-4 py-3 font-medium ${activeTab === 'solutions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                  onClick={() => setActiveTab('solutions')}
                >
                  Solutions
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3 text-gray-800">Problem Statement</h2>
                    <p className="text-gray-700">{problem.description}</p>
                  </div>

                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3 text-gray-800">Input Format</h2>
                    <pre className="bg-gray-100 p-4 rounded-md text-gray-800 overflow-x-auto">{problem.input_format}</pre>
                  </div>

                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3 text-gray-800">Output Format</h2>
                    <pre className="bg-gray-100 p-4 rounded-md text-gray-800 overflow-x-auto">{problem.output_format}</pre>
                  </div>

                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3 text-gray-800">Constraints</h2>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      {problem.constraints.map((constraint, index) => (
                        <li key={index}>{constraint}</li>
                      ))}
                    </ul>
                  </div>

                  {problem.example_cases && problem.example_cases.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-3 text-gray-800">Examples</h2>
                      {problem.example_cases.map((example, index) => (
                        <div key={index} className="mb-6 bg-gray-50 p-4 rounded-md">
                          <h3 className="font-medium text-gray-700 mb-2">Example {index + 1}:</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="font-medium text-gray-600 mb-1">Input:</p>
                              <pre className="bg-gray-100 p-3 rounded text-gray-800 overflow-x-auto">{JSON.stringify(example.input, null, 2)}</pre>
                            </div>
                            <div>
                              <p className="font-medium text-gray-600 mb-1">Output:</p>
                              <pre className="bg-gray-100 p-3 rounded text-gray-800 overflow-x-auto">{JSON.stringify(example.output, null, 2)}</pre>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'solutions' && (
                <div className="text-center py-10 text-gray-500">
                  Solutions will be available after you solve the problem
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Editor and Output */}
          <div className="space-y-6">
            {/* Language Selector */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Code Editor</h2>
                <select 
                  value={language}
                  onChange={handleLanguageChange}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
              </div>
            </div>

            {/* Code Editor */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <MonacoEditor
                height="400px"
                language={getEditorLanguage()}
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value)}
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  wordWrap: 'on',
                  automaticLayout: true,
                }}
              />
            </div>

            {/* Custom Input */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Custom Input</h2>
              </div>
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="w-full p-4 h-32 font-mono text-sm border-none focus:ring-0 resize-none"
                placeholder="Enter custom input here (JSON format for objects/arrays)"
              />
            </div>

            {/* Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className={`flex-1 px-6 py-3 rounded-md font-medium ${
                  isRunning 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white transition-colors`}
              >
                {isRunning ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Running...
                  </span>
                ) : 'Run Code'}
              </button>
              <button className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors">
                Submit
              </button>
            </div>

            {/* Output */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Output</h2>
              </div>
              <div className="p-4 bg-gray-900 text-green-400 font-mono text-sm h-48 overflow-auto">
                <pre className="whitespace-pre-wrap">{output || 'Run your code to see output here...'}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Problem; 