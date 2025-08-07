import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Button, Paper, Box, CircularProgress,
  Alert, Tabs, Tab, Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SummaryList from '../components/test/SummaryList';
import CodeViewer from '../components/test/CodeViewer';
import axios from 'axios';

const TestGenerationPage = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [repoDetails, setRepoDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [fileSummaries, setFileSummaries] = useState([]);
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [generatedCode, setGeneratedCode] = useState('');
  const [generatedFilePath, setGeneratedFilePath] = useState('');
  const [codeLoading, setCodeLoading] = useState(false);
  const [prCreated, setPrCreated] = useState(false);
  const [prUrl, setPrUrl] = useState('');

  useEffect(() => {
    const storedFiles = sessionStorage.getItem('selectedFiles');
    const storedRepoDetails = sessionStorage.getItem('repoDetails');

    if (!storedFiles || !storedRepoDetails) {
      navigate('/repository');
      return;
    }

    try {
      const parsedFiles = JSON.parse(storedFiles);
      const parsedRepoDetails = JSON.parse(storedRepoDetails);
      setFiles(parsedFiles);
      setRepoDetails(parsedRepoDetails);
      generateSummaries(parsedFiles);
    } catch (err) {
      setError('Failed to load file data. Please try again.');
      console.error(err);
    }
  }, [navigate]);

  const generateSummaries = async (fileData) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/ai/summarize', { files: fileData });
      setFileSummaries(response.data.results);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate test case summaries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_, newValue) => setActiveTab(newValue);

  const handleSummarySelect = (summary, filePath, fileContent) => {
    setSelectedSummary({ ...summary, filePath, fileContent });
    setGeneratedCode('');
    setGeneratedFilePath('');
  };

  const handleGenerateCode = async () => {
    if (!selectedSummary) return;
    setCodeLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/ai/generate-code', {
        summary: selectedSummary.summary || selectedSummary.description,
        language: selectedSummary.language || 'javascript',
        filePath: selectedSummary.filePath,
        fileContent: selectedSummary.fileContent
      });

      setGeneratedCode(response.data.testCode);
      setGeneratedFilePath(response.data.testFilePath);
      setActiveTab(1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate test code. Please try again.');
    } finally {
      setCodeLoading(false);
    }
  };

  const handleCreatePR = async () => {
    if (!generatedCode || !generatedFilePath) return;
    setCodeLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/github/create-pr', {
        owner: repoDetails.owner,
        repo: repoDetails.repo,
        token: repoDetails.token,
        files: [{ path: generatedFilePath, content: generatedCode }]
      });

      setPrCreated(true);
      setPrUrl(response.data.pullRequest.url);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create pull request. Please check your GitHub token permissions.');
    } finally {
      setCodeLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ bgcolor: '#0d1117', color: '#c9d1d9', minHeight: '100vh', py: 4 }}>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/repository')}
            sx={{
              mr: 2,
              color: '#c9d1d9',
              borderColor: '#30363d',
              bgcolor: '#21262d',
              '&:hover': { bgcolor: '#30363d' }
            }}
            variant="outlined"
          >
            Back
          </Button>
          <Typography variant="h4">Test Case Generator</Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 4 }}>
            <CircularProgress sx={{ color: '#58a6ff' }} />
            <Typography sx={{ ml: 2 }}>Analyzing code and generating test case summaries...</Typography>
          </Box>
        ) : (
          <Box>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              textColor="inherit"
              indicatorColor="primary"
              sx={{
                borderBottom: '1px solid #30363d',
                mb: 2
              }}
            >
              <Tab label="Test Case Summaries" sx={{ color: '#c9d1d9' }} />
              <Tab label="Generated Test Code" sx={{ color: '#c9d1d9' }} disabled={!generatedCode} />
            </Tabs>

            {/* Tab 0: Summaries */}
            {activeTab === 0 && (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    width: '40%',
                    bgcolor: '#161b22',
                    color: '#c9d1d9',
                    overflow: 'auto',
                    maxHeight: '70vh'
                  }}
                >
                  <Typography variant="h6">Files & Test Summaries</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }} color="#8b949e">
                    Select a test case summary to generate code
                  </Typography>
                  {fileSummaries.length > 0 ? (
                    <SummaryList
                      fileSummaries={fileSummaries}
                      files={files}
                      onSelectSummary={handleSummarySelect}
                      selectedSummary={selectedSummary}
                    />
                  ) : (
                    <Typography>No test case summaries available</Typography>
                  )}
                </Paper>

                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    width: '60%',
                    bgcolor: '#161b22',
                    color: '#c9d1d9',
                    overflow: 'auto',
                    maxHeight: '70vh'
                  }}
                >
                  {selectedSummary ? (
                    <>
                      <Typography variant="h6" gutterBottom>
                        Selected Test Case
                      </Typography>
                      <Box sx={{ mb: 3 }}>
                        <Typography>File: {selectedSummary.filePath}</Typography>
                        <Typography>Function: {selectedSummary.functionName}</Typography>
                        <Typography>Description: {selectedSummary.description}</Typography>
                      </Box>

                      <Button
                        variant="contained"
                        onClick={handleGenerateCode}
                        disabled={codeLoading}
                        startIcon={codeLoading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : null}
                        sx={{
                          bgcolor: '#238636',
                          color: '#fff',
                          '&:hover': { bgcolor: '#2ea043' }
                        }}
                      >
                        {codeLoading ? 'Generating...' : 'Generate Test Code'}
                      </Button>
                    </>
                  ) : (
                    <Typography>Select a test case summary from the left panel</Typography>
                  )}
                </Paper>
              </Box>
            )}

            {/* Tab 1: Generated Code */}
            {activeTab === 1 && generatedCode && (
              <Box sx={{ mt: 3 }}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    bgcolor: '#161b22',
                    color: '#c9d1d9'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">Generated Test Code</Typography>
                    {!prCreated ? (
                      <Button
                        variant="contained"
                        onClick={handleCreatePR}
                        disabled={codeLoading || !repoDetails?.token}
                        startIcon={codeLoading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : null}
                        sx={{
                          bgcolor: '#238636',
                          color: '#fff',
                          '&:hover': { bgcolor: '#2ea043' }
                        }}
                      >
                        {codeLoading ? 'Creating PR...' : 'Create Pull Request'}
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        href={prUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ color: '#58a6ff', borderColor: '#30363d', '&:hover': { borderColor: '#58a6ff' } }}
                      >
                        View Pull Request
                      </Button>
                    )}
                  </Box>

                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Test File: {generatedFilePath}
                  </Typography>
                  <Divider sx={{ mb: 2, borderColor: '#30363d' }} />

                  <CodeViewer
                    code={generatedCode}
                    language={selectedSummary?.language || 'javascript'}
                  />
                </Paper>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default TestGenerationPage;
