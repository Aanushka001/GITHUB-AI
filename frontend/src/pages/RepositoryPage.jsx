import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import FileList from '../components/github/FileList';
import axios from 'axios';

const RepositoryPage = () => {
  const navigate = useNavigate();
  const [repoDetails, setRepoDetails] = useState({ owner: '', repo: '', token: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [repoConnected, setRepoConnected] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRepoDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleConnectRepo = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/github/files', {
        params: {
          owner: repoDetails.owner,
          repo: repoDetails.repo,
          token: repoDetails.token || undefined,
        },
      });
      setFiles(response.data.files);
      setRepoConnected(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to connect to repository. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelection = (filePath, isSelected) => {
    setSelectedFiles((prev) =>
      isSelected ? [...prev, filePath] : prev.filter((path) => path !== filePath)
    );
  };

  const handleGenerateTests = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select at least one file');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/github/content', {
        owner: repoDetails.owner,
        repo: repoDetails.repo,
        token: repoDetails.token || undefined,
        files: selectedFiles,
      });

      sessionStorage.setItem('selectedFiles', JSON.stringify(response.data.files));
      sessionStorage.setItem('repoDetails', JSON.stringify(repoDetails));
      navigate('/generate');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch file contents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6, color: '#c9d1d9', backgroundColor: '#0d1117', minHeight: '100vh' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#ffffff' }}>
          Connect to GitHub Repository
        </Typography>

        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            backgroundColor: '#161b22',
            color: '#c9d1d9',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <GitHubIcon sx={{ mr: 1, color: '#58a6ff' }} />
            <Typography variant="h6" sx={{ color: '#ffffff' }}>Repository Details</Typography>
          </Box>

          <TextField
            label="Repository Owner"
            name="owner"
            value={repoDetails.owner}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            placeholder="e.g., facebook"
            disabled={loading || repoConnected}
            InputProps={{ style: { color: '#ffffff' } }}
            InputLabelProps={{ style: { color: '#8b949e' } }}
            sx={{ input: { backgroundColor: '#0d1117' } }}
          />

          <TextField
            label="Repository Name"
            name="repo"
            value={repoDetails.repo}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            placeholder="e.g., react"
            disabled={loading || repoConnected}
            InputProps={{ style: { color: '#ffffff' } }}
            InputLabelProps={{ style: { color: '#8b949e' } }}
            sx={{ input: { backgroundColor: '#0d1117' } }}
          />

          <TextField
            label="GitHub Token (optional for public repos)"
            name="token"
            value={repoDetails.token}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            type="password"
            placeholder="Your GitHub personal access token"
            helperText="For private repositories, you'll need a token with 'repo' scope"
            disabled={loading || repoConnected}
            InputProps={{ style: { color: '#ffffff' } }}
            InputLabelProps={{ style: { color: '#8b949e' } }}
            FormHelperTextProps={{ style: { color: '#8b949e' } }}
            sx={{ input: { backgroundColor: '#0d1117' } }}
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            {!repoConnected ? (
              <Button
                variant="contained"
                onClick={handleConnectRepo}
                disabled={loading || !repoDetails.owner || !repoDetails.repo}
                startIcon={loading ? <CircularProgress size={20} /> : null}
                sx={{
                  backgroundColor: '#238636',
                  '&:hover': { backgroundColor: '#2ea043' },
                  color: '#ffffff',
                  fontWeight: 'bold',
                }}
              >
                {loading ? 'Connecting...' : 'Connect Repository'}
              </Button>
            ) : (
              <Button
                variant="outlined"
                onClick={() => {
                  setRepoConnected(false);
                  setFiles([]);
                  setSelectedFiles([]);
                }}
                sx={{
                  borderColor: '#238636',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#238636',
                    borderColor: '#2ea043',
                    color: '#ffffff'
                  }
                }}
              >
                Change Repository
              </Button>
            )}
          </Box>
        </Paper>

        {repoConnected && files.length > 0 && (
          <Paper elevation={3} sx={{ p: 3, backgroundColor: '#161b22', color: '#c9d1d9' }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#ffffff' }}>
              Select Files for Test Generation
            </Typography>
            <Typography variant="body2" color="#8b949e" sx={{ mb: 2 }}>
              Select the files you want to generate test cases for. Only code files are shown.
            </Typography>

            <FileList
              files={files}
              selectedFiles={selectedFiles}
              onFileSelect={handleFileSelection}
            />

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="#8b949e">
                {selectedFiles.length} file(s) selected
              </Typography>
              <Button
                variant="contained"
                onClick={handleGenerateTests}
                disabled={selectedFiles.length === 0 || loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
                sx={{
                  backgroundColor: '#238636',
                  '&:hover': { backgroundColor: '#2ea043' },
                  color: '#ffffff',
                  fontWeight: 'bold',
                }}
              >
                {loading ? 'Processing...' : 'Generate Test Cases'}
              </Button>
            </Box>
          </Paper>
        )}

        {repoConnected && files.length === 0 && (
          <Alert severity="info" sx={{ backgroundColor: '#21262d', color: '#c9d1d9', mt: 3 }}>
            No code files found in this repository. Please try another repository.
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default RepositoryPage;
