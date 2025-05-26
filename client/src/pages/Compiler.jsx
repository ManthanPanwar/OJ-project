import { useState } from 'react';
import axios from 'axios';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-cpp';
import 'prismjs/themes/prism.css'; // or another theme

const CompilerPage = () => {
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const languageOptions = [
    { value: 'cpp', label: 'C++', syntax: languages.cpp },
    { value: 'java', label: 'Java', syntax: languages.java },
    { value: 'js', label: 'JavaScript', syntax: languages.javascript },
    { value: 'py', label: 'Python', syntax: languages.python },
  ];

  const getLanguageSyntax = () => {
    return languageOptions.find(opt => opt.value === language)?.syntax || languages.cpp;
  };

  const defaultCodes = {
    cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello World!";\n    return 0;\n}`,
    java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World!");\n    }\n}`,
    javascript: `console.log("Hello World!");`,
    python: `print("Hello World!")`
  };

  const handleRunCode = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:5000/compile', {
        code,
        language,
        input
      });
      
      setOutput(response.data.output || 'No output');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to compile code');
      setOutput(err.response?.data?.stderr || 'Error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(defaultCodes[newLang]);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Online Compiler</h1>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Language:
        </label>
        <select
          value={language}
          onChange={handleLanguageChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          {languageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4 border rounded-md overflow-hidden">
        <label className="block text-sm font-medium text-gray-700 mb-1 px-3 pt-2">
          Code Editor:
        </label>
        <div className="editor-container border-t border-gray-200">
          <Editor
            value={code}
            onValueChange={code => setCode(code)}
            highlight={code => highlight(code, getLanguageSyntax(), language)}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 14,
              backgroundColor: '#f5f5f5',
              minHeight: '300px'
            }}
            className="editor"
            textareaClassName="code-textarea"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="border rounded-md overflow-hidden">
          <label className="block text-sm font-medium text-gray-700 mb-1 px-3 pt-2">
            Custom Input:
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="block w-full h-40 px-3 py-2 border-t border-gray-200 focus:outline-none font-mono text-sm"
            placeholder="Enter input here..."
          />
        </div>
        <div className="border rounded-md overflow-hidden">
          <label className="block text-sm font-medium text-gray-700 mb-1 px-3 pt-2">
            Output:
          </label>
          <pre className="block w-full h-40 px-3 py-2 bg-gray-50 overflow-auto border-t border-gray-200 font-mono text-sm whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={handleRunCode}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
        >
          {isLoading ? 'Running...' : 'Run Code'}
        </button>
        
        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompilerPage;