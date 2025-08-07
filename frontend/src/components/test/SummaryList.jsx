import React, { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FunctionsIcon from '@mui/icons-material/Functions';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

const SummaryList = ({ fileSummaries, files, onSelectSummary, selectedSummary }) => {
  const [expandedFiles, setExpandedFiles] = useState({});

  // Find file content by path
  const getFileContent = (path) => {
    const file = files.find(f => f.path === path);
    return file ? file.content : '';
  };

  // Toggle file expansion
  const toggleFileExpansion = (path) => {
    setExpandedFiles(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  // Render complexity indicator
  const renderComplexity = (complexity) => {
    let color = 'success';
    let label = 'Simple';
    
    if (complexity === 2) {
      color = 'warning';
      label = 'Medium';
    } else if (complexity >= 3) {
      color = 'error';
      label = 'Complex';
    }
    
    return (
      <Chip 
        label={label} 
        color={color} 
        size="small" 
        variant="outlined"
        sx={{ ml: 1 }}
      />
    );
  };

  return (
    <List component="nav" aria-label="test case summaries">
      {fileSummaries.length > 0 ? (
        fileSummaries.map((file) => (
          <React.Fragment key={file.path}>
            <ListItemButton onClick={() => toggleFileExpansion(file.path)}>
              <ListItemText 
                primary={file.path.split('/').pop()} 
                secondary={`${file.summaries?.length || 0} test cases`} 
              />
              {expandedFiles[file.path] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            
            <Collapse in={expandedFiles[file.path]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {file.summaries && file.summaries.length > 0 ? (
                  file.summaries.map((summary) => (
                    <ListItemButton 
                      key={summary.id} 
                      sx={{ pl: 4 }}
                      selected={selectedSummary?.id === summary.id}
                      onClick={() => onSelectSummary(summary, file.path, getFileContent(file.path))}
                    >
                      <FunctionsIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <ListItemText 
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" component="span">
                              {summary.functionName}
                            </Typography>
                            {renderComplexity(summary.complexity)}
                          </Box>
                        }
                        secondary={summary.description} 
                      />
                    </ListItemButton>
                  ))
                ) : (
                  <ListItem sx={{ pl: 4 }}>
                    <ListItemText primary="No test cases available" />
                  </ListItem>
                )}
              </List>
            </Collapse>
          </React.Fragment>
        ))
      ) : (
        <ListItem>
          <ListItemText primary="No files with test summaries" />
        </ListItem>
      )}
    </List>
  );
};

export default SummaryList;