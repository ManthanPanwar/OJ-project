const fs = require('fs');
const path = require('path');
const {v4: uuidv4} = require('uuid');


// folder to store generated code files
const dirCodes = path.join(__dirname, 'codes');

// Ensure the directory exists
if (!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes, { recursive: true });
}

// Function to generate a file with a unique name based on the language and content
const generateFile = async (language, content) => {
    const jobID = uuidv4();
    const filename = `${jobID}.${language}`;
    const filePath = path.join(dirCodes, filename);
    fs.writeFileSync(filePath, content);
    return filePath;
};

module.exports = generateFile;