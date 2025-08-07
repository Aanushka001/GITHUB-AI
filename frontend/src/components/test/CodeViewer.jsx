import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';

const CodeViewer = ({ code, language }) => {
  useEffect(() => {
    // Highlight code when component mounts or code changes
    Prism.highlightAll();
  }, [code]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
  };

  // Map language to Prism language class
  const getPrismLanguage = (lang) => {
    const languageMap = {
      'javascript': 'javascript',
      'typescript': 'typescript',
      'java': 'java',
      'python': 'python',
      'jsx': 'jsx',
      'tsx': 'tsx',
      'css': 'css',
      'html': 'markup',
    };
    
    return languageMap[lang] || 'javascript';
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Button
        variant="contained"
        size="small"
        startIcon={<ContentCopyIcon />}
        onClick={handleCopyCode}
        sx={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          zIndex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          },
        }}
      >
        Copy
      </Button>
      
      <Paper 
        elevation={0} 
        sx={{ 
          backgroundColor: '#2d2d2d',
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      >
        <pre style={{ margin: 0, padding: '16px', maxHeight: '60vh', overflow: 'auto' }}>
          <code className={`language-${getPrismLanguage(language)}`}>
            {code}
          </code>
        </pre>
      </Paper>
    </Box>
  );
};

export default CodeViewer;