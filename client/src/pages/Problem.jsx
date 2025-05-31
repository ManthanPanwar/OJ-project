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
  const [language, setLanguage] = useState('cpp');
  const [activeTab, setActiveTab] = useState('description');

  const [testResults, setTestResults] = useState([]);
  const [verdict, setVerdict] = useState(null);

  const languageTemplates = {
    javascript: `function main(input) {\n  // Your code here\n  return input;\n}`,
    python: `def main(input):\n    # Your code here\n    return input`,
    java: `public class Main {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}`,
    cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}`
  };

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/problems/${id}`);
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
      setOutput('Please write some code before running');
      return;
    }

    setIsRunning(true);
    setOutput('Running your code...');

    try {
      const response = await axios.post(`http://localhost:5000/problems/${id}/run`, {
        code,
        language,
        input: customInput,
      });
      setOutput(response.data.output || response.data.error);
    } catch (err) {
      setOutput(`Error: ${err.response?.data?.error || err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!code.trim()) {
      setOutput('Please write some code before submitting');
      return;
    }

    setIsRunning(true);
    setOutput('Checking your solution...');
    setTestResults([]);
    setVerdict(null);

    try {
      const response = await axios.post(`http://localhost:5000/problems/${id}/submit`, {
        code,
        language,
      });

      const results = response.data.results || [];
      const failedIndex = results.findIndex(r => !r.passed);

      if (failedIndex >= 0) {
        setVerdict('Wrong Answer');
        // Show all test cases up to and including the first failed one
        setTestResults(results.slice(0, failedIndex + 1));
        setOutput(`Wrong Answer on Test Case ${failedIndex + 1}`);
      } else {
        setVerdict('Accepted');
        setTestResults(results);
        setOutput('All test cases passed!');
      }

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
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="text-blue-600 underline mb-4 block">← Back</button>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{problem.title}</h1>
        <div className={`inline-block px-3 py-1 rounded-full text-sm ${getDifficultyColor(problem.difficulty)}`}>
          {problem.difficulty}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left - Problem Info */}
        <div className="bg-white p-6 rounded shadow">
          <div className="mb-4">
            <h2 className="font-bold text-lg mb-2">Description</h2>
            <p>{problem.description}</p>
          </div>

          <div className="mb-4">
            <h2 className="font-bold text-lg mb-2">Input Format</h2>
            <pre className="bg-gray-100 p-2 rounded">{problem.input_format}</pre>
          </div>

          <div className="mb-4">
            <h2 className="font-bold text-lg mb-2">Output Format</h2>
            <pre className="bg-gray-100 p-2 rounded">{problem.output_format}</pre>
          </div>

          <div className="mb-4">
            <h2 className="font-bold text-lg mb-2">Constraints</h2>
            <ul className="list-disc pl-5">
              {problem.constraints.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>

          {/* Added Example Test Cases section */}
          <div className="mb-4">
            <h2 className="font-bold text-lg mb-2">Example Test Cases</h2>
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
              height="300px"
              language={getEditorLanguage()}
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val)}
              options={{ fontSize: 14, minimap: { enabled: false } }}
            />
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Custom Input</h2>
            <textarea
              className="w-full border rounded p-2 font-mono text-sm"
              rows="5"
              placeholder="Enter custom input here..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <button onClick={handleRunCode} disabled={isRunning} className="bg-blue-600 text-white px-4 py-2 rounded">
              Run Code
            </button>
            <button onClick={handleSubmitCode} disabled={isRunning} className="bg-green-600 text-white px-4 py-2 rounded">
              Submit
            </button>
          </div>

          <div className="bg-gray-900 text-green-400 p-4 rounded shadow font-mono h-40 overflow-auto">
            <pre>{output || 'Output will be shown here...'}</pre>
          </div>

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
                  <p><strong>Input:</strong> <pre className="bg-gray-100 p-2 rounded">{test.input}</pre></p>
                  <p><strong>Expected Output:</strong> <pre className="bg-gray-100 p-2 rounded">{test.expected}</pre></p>
                  <p><strong>Your Output:</strong> <pre className="bg-gray-100 p-2 rounded">{test.output}</pre></p>
                  <p className={`font-bold ${test.passed ? 'text-green-600' : 'text-red-600'}`}>
                    {test.passed ? '✓ Passed' : '✗ Failed'}
                  </p>
                  {!test.passed && (
                    <p className="text-red-600 font-medium">
                      This was the first failed test case. Fix your code to proceed.
                    </p>
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