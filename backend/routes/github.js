// const express = require('express');
// const { Octokit } = require('octokit');
// const router = express.Router();

// /**
//  * Get files from a GitHub repository
//  * @route GET /api/github/files
//  * @param {string} owner - Repository owner
//  * @param {string} repo - Repository name
//  * @param {string} token - GitHub token (optional)
//  */
// router.get('/files', async (req, res, next) => {
//   try {
//     const { owner, repo, token } = req.query;
    
//     if (!owner || !repo) {
//       return res.status(400).json({ 
//         error: true, 
//         message: 'Owner and repo parameters are required' 
//       });
//     }

//     // Initialize Octokit with or without token
//     const octokit = token 
//       ? new Octokit({ auth: token }) 
//       : new Octokit();

//     // Get repository content (root directory)
//     const response = await octokit.rest.repos.getContent({
//       owner,
//       repo,
//       path: '',
//     });

//     // Recursively get all code files
//     const allFiles = await getAllCodeFiles(octokit, owner, repo, response.data);
    
//     res.json({ files: allFiles });
//   } catch (error) {
//     console.error('GitHub API Error:', error);
//     if (error.status === 404) {
//       return res.status(404).json({ 
//         error: true, 
//         message: 'Repository not found' 
//       });
//     }
//     if (error.status === 403) {
//       return res.status(403).json({ 
//         error: true, 
//         message: 'API rate limit exceeded or authentication required' 
//       });
//     }
//     next(error);
//   }
// });

// /**
//  * Get content of selected files from GitHub
//  * @route POST /api/github/content
//  * @param {string} owner - Repository owner
//  * @param {string} repo - Repository name
//  * @param {string} token - GitHub token (optional)
//  * @param {Array} files - Array of file paths to fetch
//  */
// router.post('/content', async (req, res, next) => {
//   try {
//     const { owner, repo, token, files } = req.body;
    
//     if (!owner || !repo || !files || !Array.isArray(files)) {
//       return res.status(400).json({ 
//         error: true, 
//         message: 'Owner, repo, and files array are required' 
//       });
//     }

//     // Initialize Octokit with or without token
//     const octokit = token 
//       ? new Octokit({ auth: token }) 
//       : new Octokit();

//     // Fetch content for each file
//     const fileContents = await Promise.all(
//       files.map(async (filePath) => {
//         try {
//           const response = await octokit.rest.repos.getContent({
//             owner,
//             repo,
//             path: filePath,
//           });

//           // GitHub API returns content as base64
//           const content = Buffer.from(response.data.content, 'base64').toString();
          
//           return {
//             path: filePath,
//             content,
//             language: getLanguageFromPath(filePath),
//             sha: response.data.sha
//           };
//         } catch (error) {
//           console.error(`Error fetching ${filePath}:`, error);
//           return {
//             path: filePath,
//             error: true,
//             message: `Failed to fetch file: ${error.message}`
//           };
//         }
//       })
//     );

//     res.json({ files: fileContents });
//   } catch (error) {
//     next(error);
//   }
// });

// /**
//  * Create a pull request with generated test files
//  * @route POST /api/github/create-pr
//  * @param {string} owner - Repository owner
//  * @param {string} repo - Repository name
//  * @param {string} token - GitHub token (required)
//  * @param {Array} files - Array of file objects with path and content
//  */
// router.post('/create-pr', async (req, res, next) => {
//   try {
//     const { owner, repo, token, files, baseBranch = 'main' } = req.body;
    
//     if (!owner || !repo || !token || !files || !Array.isArray(files)) {
//       return res.status(400).json({ 
//         error: true, 
//         message: 'Owner, repo, token, and files array are required' 
//       });
//     }

//     const octokit = new Octokit({ auth: token });
    
//     // Create a new branch
//     const branchName = `test-case-generator-${Date.now()}`;
    
//     // Get the SHA of the latest commit on the base branch
//     const { data: refData } = await octokit.rest.git.getRef({
//       owner,
//       repo,
//       ref: `heads/${baseBranch}`,
//     });
    
//     // Create a new branch
//     await octokit.rest.git.createRef({
//       owner,
//       repo,
//       ref: `refs/heads/${branchName}`,
//       sha: refData.object.sha,
//     });
    
//     // Create commits for each file
//     for (const file of files) {
//       await octokit.rest.repos.createOrUpdateFileContents({
//         owner,
//         repo,
//         path: file.path,
//         message: `Add test file: ${file.path}`,
//         content: Buffer.from(file.content).toString('base64'),
//         branch: branchName,
//       });
//     }
    
//     // Create a pull request
//     const { data: prData } = await octokit.rest.pulls.create({
//       owner,
//       repo,
//       title: 'Add generated test cases',
//       body: 'This PR adds automatically generated test cases using the Test Case Generator App.',
//       head: branchName,
//       base: baseBranch,
//     });
    
//     res.json({
//       success: true,
//       pullRequest: {
//         number: prData.number,
//         url: prData.html_url,
//       },
//     });
//   } catch (error) {
//     console.error('GitHub API Error:', error);
//     next(error);
//   }
// });

// // Helper function to recursively get all code files
// async function getAllCodeFiles(octokit, owner, repo, items, path = '') {
//   let files = [];
  
//   for (const item of items) {
//     const itemPath = path ? `${path}/${item.name}` : item.name;
    
//     if (item.type === 'dir') {
//       // Get contents of this directory
//       const { data: dirContents } = await octokit.rest.repos.getContent({
//         owner,
//         repo,
//         path: itemPath,
//       });
      
//       // Recursively get files from this directory
//       const dirFiles = await getAllCodeFiles(octokit, owner, repo, dirContents, itemPath);
//       files = [...files, ...dirFiles];
//     } else if (item.type === 'file' && isCodeFile(item.name)) {
//       files.push({
//         name: item.name,
//         path: itemPath,
//         size: item.size,
//         language: getLanguageFromPath(item.name),
//         url: item.html_url,
//       });
//     }
//   }
  
//   return files;
// }

// // Helper function to check if a file is a code file
// function isCodeFile(filename) {
//   const codeExtensions = [
//     '.js', '.jsx', '.ts', '.tsx',  // JavaScript/TypeScript
//     '.py',                         // Python
//     '.java',                       // Java
//     '.rb',                         // Ruby
//     '.php',                        // PHP
//     '.go',                         // Go
//     '.cs', '.vb',                  // .NET
//     '.cpp', '.cc', '.cxx', '.c', '.h', '.hpp', // C/C++
//     '.swift',                      // Swift
//     '.kt',                         // Kotlin
//     '.rs',                         // Rust
//     '.scala',                      // Scala
//     '.dart',                       // Dart
//   ];
  
//   return codeExtensions.some(ext => filename.toLowerCase().endsWith(ext));
// }

// // Helper function to determine language from file path
// function getLanguageFromPath(filePath) {
//   const extension = filePath.split('.').pop().toLowerCase();
  
//   const languageMap = {
//     'js': 'javascript',
//     'jsx': 'javascript',
//     'ts': 'typescript',
//     'tsx': 'typescript',
//     'py': 'python',
//     'java': 'java',
//     'rb': 'ruby',
//     'php': 'php',
//     'go': 'go',
//     'cs': 'csharp',
//     'vb': 'vb',
//     'cpp': 'cpp',
//     'cc': 'cpp',
//     'cxx': 'cpp',
//     'c': 'c',
//     'h': 'c',
//     'hpp': 'cpp',
//     'swift': 'swift',
//     'kt': 'kotlin',
//     'rs': 'rust',
//     'scala': 'scala',
//     'dart': 'dart',
//   };
  
//   return languageMap[extension] || 'plaintext';
// }

// module.exports = router;
const express = require('express');
const { Octokit } = require('octokit');
const router = express.Router();

router.get('/files', async (req, res, next) => {
  try {
    const { owner, repo, token } = req.query;
    if (!owner || !repo) {
      return res.status(400).json({ error: true, message: 'Owner and repo parameters are required' });
    }

    const octokit = token ? new Octokit({ auth: token }) : new Octokit();
    const { data: rootItems } = await octokit.rest.repos.getContent({ owner, repo, path: '' });
    const allFiles = await getAllCodeFiles(octokit, owner, repo, rootItems);
    res.json({ files: allFiles });
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({ error: true, message: 'Repository not found' });
    }
    if (error.status === 403) {
      return res.status(403).json({ error: true, message: 'API rate limit exceeded or authentication required' });
    }
    next(error);
  }
});

router.post('/content', async (req, res, next) => {
  try {
    const { owner, repo, token, files } = req.body;
    if (!owner || !repo || !Array.isArray(files)) {
      return res.status(400).json({ error: true, message: 'Owner, repo, and files array are required' });
    }

    const octokit = token ? new Octokit({ auth: token }) : new Octokit();
    const fileContents = await Promise.all(
      files.map(async (filePath) => {
        try {
          const { data } = await octokit.rest.repos.getContent({ owner, repo, path: filePath });
          const content = Buffer.from(data.content, 'base64').toString();
          return {
            path: filePath,
            content,
            language: getLanguageFromPath(filePath),
            sha: data.sha
          };
        } catch (err) {
          return {
            path: filePath,
            error: true,
            message: `Failed to fetch file: ${err.message}`
          };
        }
      })
    );

    res.json({ files: fileContents });
  } catch (error) {
    next(error);
  }
});

router.post('/create-pr', async (req, res, next) => {
  try {
    const { owner, repo, token, files, baseBranch = 'main' } = req.body;
    if (!owner || !repo || !token || !Array.isArray(files)) {
      return res.status(400).json({ error: true, message: 'Owner, repo, token, and files array are required' });
    }

    const octokit = new Octokit({ auth: token });

    const repoData = await octokit.rest.repos.get({ owner, repo });
    const branch = baseBranch || repoData.data.default_branch;
    const branchName = `test-case-generator-${Date.now()}`;
    const refData = await octokit.rest.git.getRef({ owner, repo, ref: `heads/${branch}` });

    await octokit.rest.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branchName}`,
      sha: refData.data.object.sha
    });

    for (const file of files) {
      await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: file.path,
        message: `Add test file: ${file.path}`,
        content: Buffer.from(file.content).toString('base64'),
        branch: branchName
      });
    }

    const prData = await octokit.rest.pulls.create({
      owner,
      repo,
      title: 'Add generated test cases',
      body: 'This PR adds automatically generated test cases using the Test Case Generator App.',
      head: branchName,
      base: branch
    });

    res.json({
      success: true,
      pullRequest: {
        number: prData.data.number,
        url: prData.data.html_url
      }
    });
  } catch (error) {
    next(error);
  }
});

async function getAllCodeFiles(octokit, owner, repo, items, path = '') {
  let files = [];

  for (const item of items) {
    const itemPath = path ? `${path}/${item.name}` : item.name;

    if (item.type === 'dir') {
      const { data: dirContents } = await octokit.rest.repos.getContent({ owner, repo, path: itemPath });
      const dirFiles = await getAllCodeFiles(octokit, owner, repo, dirContents, itemPath);
      files.push(...dirFiles);
    } else if (item.type === 'file' && isCodeFile(item.name)) {
      files.push({
        name: item.name,
        path: itemPath,
        size: item.size,
        language: getLanguageFromPath(item.name),
        url: item.html_url
      });
    }
  }

  return files;
}

function isCodeFile(filename) {
  const codeExtensions = [
    '.js', '.jsx', '.ts', '.tsx',
    '.py', '.java', '.rb', '.php',
    '.go', '.cs', '.vb', '.cpp',
    '.cc', '.cxx', '.c', '.h', '.hpp',
    '.swift', '.kt', '.rs', '.scala', '.dart'
  ];

  return codeExtensions.some(ext => filename.toLowerCase().endsWith(ext));
}

function getLanguageFromPath(filePath) {
  const extension = filePath.split('.').pop().toLowerCase();
  const languageMap = {
    js: 'javascript', jsx: 'javascript', ts: 'typescript', tsx: 'typescript',
    py: 'python', java: 'java', rb: 'ruby', php: 'php', go: 'go',
    cs: 'csharp', vb: 'vb', cpp: 'cpp', cc: 'cpp', cxx: 'cpp',
    c: 'c', h: 'c', hpp: 'cpp', swift: 'swift', kt: 'kotlin',
    rs: 'rust', scala: 'scala', dart: 'dart'
  };

  return languageMap[extension] || 'plaintext';
}

module.exports = router;
