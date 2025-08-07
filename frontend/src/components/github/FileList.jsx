import React, { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import DescriptionIcon from '@mui/icons-material/Description';
import JavascriptIcon from '@mui/icons-material/Javascript';
import CodeIcon from '@mui/icons-material/Code';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const FileList = ({ files, selectedFiles, onFileSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFolders, setExpandedFolders] = useState({});

  // Group files by directory
  const groupFilesByDirectory = () => {
    const fileTree = {};

    files.forEach((file) => {
      const pathParts = file.path.split('/');
      let currentLevel = fileTree;

      // Process all directories in the path
      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        if (!currentLevel[part]) {
          currentLevel[part] = { __files: [] };
        }
        currentLevel = currentLevel[part];
      }

      // Add the file to the last directory
      currentLevel.__files.push(file);
    });

    return fileTree;
  };

  const fileTree = groupFilesByDirectory();

  // Filter files based on search term
  const filterFiles = (files) => {
    if (!searchTerm) return files;
    return files.filter((file) =>
      file.path.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Get flat list of all files for search
  const getAllFiles = () => {
    return files.filter((file) =>
      file.path.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Toggle folder expansion
  const toggleFolder = (folderPath) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderPath]: !prev[folderPath],
    }));
  };

  // Render file icon based on language
  const renderFileIcon = (language) => {
    switch (language) {
      case 'javascript':
      case 'typescript':
        return <JavascriptIcon fontSize="small" />;
      default:
        return <DescriptionIcon fontSize="small" />;
    }
  };

  // Recursive function to render the file tree
  const renderFileTree = (tree, path = '', level = 0) => {
    // Get directories and files at this level
    const directories = Object.keys(tree).filter((key) => key !== '__files');
    const filesAtThisLevel = tree.__files || [];

    return (
      <>
        {/* Render files at this level */}
        {filesAtThisLevel.length > 0 &&
          filterFiles(filesAtThisLevel).map((file) => (
            <ListItem
              key={file.path}
              dense
              button
              onClick={() => onFileSelect(file.path, !selectedFiles.includes(file.path))}
              sx={{ pl: level * 2 + 2 }}
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={selectedFiles.includes(file.path)}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemIcon>{renderFileIcon(file.language)}</ListItemIcon>
              <ListItemText primary={file.name} secondary={file.language} />
            </ListItem>
          ))}

        {/* Render subdirectories */}
        {directories.map((dir) => {
          const dirPath = path ? `${path}/${dir}` : dir;
          const isExpanded = expandedFolders[dirPath];

          return (
            <React.Fragment key={dirPath}>
              <ListItem
                button
                onClick={() => toggleFolder(dirPath)}
                sx={{ pl: level * 2 + 2 }}
              >
                <ListItemIcon>
                  <CodeIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={dir} />
              </ListItem>
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                {renderFileTree(tree[dir], dirPath, level + 1)}
              </Collapse>
            </React.Fragment>
          );
        })}
      </>
    );
  };

  return (
    <Box>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search files..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        margin="normal"
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton
                aria-label="clear search"
                onClick={() => setSearchTerm('')}
                edge="end"
                size="small"
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <List sx={{ maxHeight: '50vh', overflow: 'auto', mt: 1 }}>
        {searchTerm ? (
          // Show flat list when searching
          getAllFiles().length > 0 ? (
            getAllFiles().map((file) => (
              <ListItem
                key={file.path}
                dense
                button
                onClick={() => onFileSelect(file.path, !selectedFiles.includes(file.path))}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={selectedFiles.includes(file.path)}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemIcon>{renderFileIcon(file.language)}</ListItemIcon>
                <ListItemText 
                  primary={file.name} 
                  secondary={file.path} 
                />
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" sx={{ p: 2, textAlign: 'center' }}>
              No files match your search
            </Typography>
          )
        ) : (
          // Show tree view when not searching
          renderFileTree(fileTree)
        )}
      </List>
    </Box>
  );
};

export default FileList;