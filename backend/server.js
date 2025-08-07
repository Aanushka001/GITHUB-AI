// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const githubRoutes = require('./routes/github');
// const aiRoutes = require('./routes/ai');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// // Routes
// app.use('/api/github', githubRoutes);
// app.use('/api/ai', aiRoutes);

// // Health check endpoint
// app.get('/api/health', (req, res) => {
//   res.status(200).json({ status: 'ok', message: 'Server is running' });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({
//     error: true,
//     message: err.message || 'An unexpected error occurred',
//   });
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const githubRoutes = require('./routes/github');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "default-src": ["'self'"],
      "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      "font-src": ["'self'", "data:"],
      "img-src": ["'self'", "data:"],
      "style-src": ["'self'", "'unsafe-inline'"]
    }
  }
}));

app.use('/api/github', githubRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API Root',
    availableRoutes: {
      github: '/api/github',
      ai: '/api/ai',
      health: '/api/health'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: true,
    message: err.message || 'An unexpected error occurred'
  });
});

const frontendPath = path.join(__dirname, '..', 'frontend', 'build');
app.use(express.static(frontendPath));
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(frontendPath, 'favicon.ico'));
});
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
