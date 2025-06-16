import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MonacoEditor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-toastify';

const Problem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [code, setCode] = useState('');
  // const [customInput, setCustomInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [language, setLanguage] = useState('cpp');

  const [testResults, setTestResults] = useState([]);
  const [verdict, setVerdict] = useState(null);
  const [aiReview, setAiReview] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false); // <-- New state
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for submit button

  const languageTemplates = {
    javascript: `function main(input) {\n  // Your code here\n  return input;\n}`,
    python: `def main(input):\n    # Your code here\n    return input`,
    java: `public class Main {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}`,
    cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}`
  };

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/problems/${id}`);
        setProblem(res.data.problem);
        setCode(languageTemplates[language]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  useEffect(() => {
    if (problem) setCode(languageTemplates[language]);
  }, [language]);

  const handleRunCode = async () => {
    if (!code.trim()) {
      console.log("No code Provided");
      return;
    }

    setIsRunning(true);
    setTestResults([]);
    setVerdict(null);

    try {
      const token = localStorage.getItem("token"); // Get token from localStorage

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/problems/${id}/run`,
        {
          code,
          language,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Set Authorization header
          },
        }
      );
      
      console.log(response.data);
      const {passedAll, results} = response.data;
      if(passedAll) {
        setVerdict('Accepted');
        setTestResults(results);
      } else{
        setVerdict('Wrong Answer');
      }
    } catch (err) {
      console.log("Error: ", err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      console.log("No code Provided");
      return;
    }

    setIsSubmitting(true);
    setTestResults([]);
    setVerdict(null);

    try {
      const token = localStorage.getItem("token"); // Get token from localStorage

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/problems/${id}/submit`,
        {
          code,
          language,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Set Authorization header
          },
        }
      );

      console.log(response.data);
      const { passedAll, results } = response.data;
      if (passedAll) {
        setVerdict("Accepted");
        setTestResults(results);
      } else {
        setVerdict("Wrong Answer");
      }
      setHasSubmitted(true); // Set hasSubmitted to true after successful submission
    } catch (err) {
      console.log("Error: ", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAiReview = async () => {
    try {
      const token = localStorage.getItem("token"); // Get token from localStorage
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/problems/${id}/aireview`, { code },{
          headers: {
            Authorization: `Bearer ${token}`, // Set Authorization header
          },
        });
      toast.success("AI review is on the way! Please wait a moment.");
      setAiReview(response.data.data.review);
    } catch (error) {
      setAiReview('Error in AI review, error: ' + error.message);
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
    switch (language) {
      case 'python': return 'python';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      default: return 'javascript';
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-lg">Loading problem...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-600">
        Error: {error}
        <br />
        <button onClick={() => navigate(-1)} className="text-blue-500 underline mt-4">Go Back</button>
      </div>
    );
  }

  return (
    <div className="mx-3">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left - Problem Info */}
        <div className="bg-white p-6 rounded shadow">
          <h1 className="inline-block text-3xl font-bold text-gray-800 mb-4">{problem.title}</h1>
          <div className={`inline-block ml-2 px-3 py-1 rounded-full text-sm ${getDifficultyColor(problem.difficulty)}`}>
            {problem.difficulty}
          </div>
          <div className="mb-4">
            <h2 className="font-bold text-lg mb-1">Description</h2>
            <ReactMarkdown>{problem.description}</ReactMarkdown>
          </div>

          <div className="mb-4">
            <h2 className="font-bold text-lg mb-1">Input Format</h2>
            <pre className="bg-gray-100 p-2 rounded">{problem.input_format}</pre>
          </div>

          <div className="mb-4">
            <h2 className="font-bold text-lg mb-1">Output Format</h2>
            <pre className="bg-gray-100 p-2 rounded">{problem.output_format}</pre>
          </div>

          <div className="mb-4">
            <h2 className="font-bold text-lg mb-1">Constraints</h2>
            <ul className="list-disc pl-5">
              {problem.constraints.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>

          {/* Example Test Cases section */}
          <div className="mb-4">
            <h2 className="font-bold text-lg mb-1">Example Test Cases</h2>
            {problem.example_cases.map((testCase, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-medium mb-1">Example {index + 1}</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm font-semibold">Input:</p>
                    <pre className="bg-gray-100 p-2 rounded">{testCase.input}</pre>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Output:</p>
                    <pre className="bg-gray-100 p-2 rounded">{testCase.output}</pre>
                  </div>
                </div>
                {testCase.explanation && (
                  <div className="mt-1">
                    <p className="text-sm font-semibold">Explanation:</p>
                    <p className="text-sm">{testCase.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* AI Review Box moved here */}
          <div className="bg-slate-200 shadow-lg rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg px-5 py-2 rounded-2xl bg-slate-500 font-semibold text-black">AI Review</h2>
              <button
                onClick={handleAiReview}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-3 rounded transition"
                disabled={isRunning || !hasSubmitted}
              >
                Click ME!!
              </button>
            </div>
            <div className="prose prose-sm text-black overflow-y-auto" style={{ height: '400px' }}>
              {aiReview === '' ? (
                <div>🤖</div>
              ) : (
                <ReactMarkdown>{aiReview}</ReactMarkdown>
              )}
            </div>
            {/* Tooltip or message if AI Review is locked */}
            {!hasSubmitted && (
              <div className="text-xm text-gray-500 mt-1">Submit your code to unlock AI Review.</div>
            )}
          </div>
        </div>

        {/* Right - Editor */}
        <div className="space-y-6">
          <div className="bg-white p-4 rounded shadow">
            <div className="flex justify-between mb-2">
              <h2 className="text-lg font-semibold">Editor</h2>
              <select value={language} onChange={e => setLanguage(e.target.value)} className="border rounded px-2 py-1">
                <option value="cpp">C++</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
              </select>
            </div>
            <MonacoEditor
              height="500px"
              language={getEditorLanguage()}
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val)}
              options={{ fontSize: 14, minimap: { enabled: false } }}
            />
          </div>

          {/* <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Custom Input</h2>
            <textarea
              className="w-full border rounded p-2 font-mono text-sm"
              rows="5"
              placeholder="Enter custom input here..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
            />
          </div> */}

          <div className="flex gap-4">
            <button onClick={handleRunCode} disabled={isRunning} className="bg-blue-600 text-white px-4 py-2 rounded">
              Run Code
            </button>
            <button onClick={handleSubmit} disabled={isSubmitting} className="bg-green-600 text-white px-4 py-2 rounded">
              Submit
            </button>
          </div>

          {/* <div className="bg-gray-900 text-green-400 p-4 rounded shadow font-mono h-40 overflow-auto">
            <pre>{output || 'Output will be shown here...'}</pre>
          </div> */}

          {verdict && (
            <div className={`text-xl font-bold ${verdict === 'Accepted' ? 'text-green-600' : 'text-red-600'}`}>
              {verdict}
            </div>
          )}

          {testResults.length > 0 && (
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold mb-4">Test Cases</h2>
              {testResults.map((test, index) => (
                <div key={index} className={`mb-4 border-t pt-2 ${!test.passed ? 'bg-red-50' : ''}`}>
                  <h3 className="font-medium mb-2">Test Case {index + 1}</h3>
                  <div>
                    <strong>Input:</strong>
                    <pre className="bg-gray-100 p-2 rounded">{test.input}</pre>
                  </div>
                  <div>
                    <strong>Expected Output:</strong>
                    <pre className="bg-gray-100 p-2 rounded">{test.expected}</pre>
                  </div>
                  <div>
                    <strong>Your Output:</strong>
                    <pre className="bg-gray-100 p-2 rounded">{test.output}</pre>
                  </div>
                  <div className={`font-bold ${test.passed ? 'text-green-600' : 'text-red-600'}`}>
                    {test.passed ? '✓ Passed' : '✗ Failed'}
                  </div>
                  {!test.passed && (
                    <div className="text-red-600 font-medium">
                      This was the first failed test case. Fix your code to proceed.
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Problem;