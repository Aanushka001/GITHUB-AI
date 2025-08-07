// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Container,
//   Typography,
//   Button,
//   Grid,
//   Paper,
//   Box
// } from '@mui/material';
// import GitHubIcon from '@mui/icons-material/GitHub';
// import CodeIcon from '@mui/icons-material/Code';
// import BugReportIcon from '@mui/icons-material/BugReport';

// const HomePage = () => {
//   const navigate = useNavigate();

//   const features = [
//     {
//       icon: <GitHubIcon sx={{ fontSize: 60, color: '#58a6ff' }} />,
//       title: 'GitHub Integration',
//       text: 'Connect to your GitHub repositories, browse files, and select code to test.'
//     },
//     {
//       icon: <CodeIcon sx={{ fontSize: 60, color: '#58a6ff' }} />,
//       title: 'AI-Powered Analysis',
//       text: 'Analyze code with AI to generate test cases tailored to your logic.'
//     },
//     {
//       icon: <BugReportIcon sx={{ fontSize: 60, color: '#58a6ff' }} />,
//       title: 'Test Code Generation',
//       text: 'Generate test code for Jest, JUnit, Pytest, and more with one click.'
//     }
//   ];

//   const steps = [
//     {
//       step: '1. Connect Repository',
//       text: 'Enter your GitHub repo and select the files you want to test.'
//     },
//     {
//       step: '2. Generate Test Summaries',
//       text: 'Our AI scans your code and suggests tests for edge and core cases.'
//     },
//     {
//       step: '3. Create Test Code',
//       text: 'Choose a summary and instantly generate full test code.'
//     }
//   ];

//   return (
//     <Container
//       maxWidth="lg"
//       sx={{
//         backgroundColor: '#0d1117',
//         color: '#c9d1d9',
//         py: 6,
//         minHeight: '100vh'
//       }}
//     >
//       {/* Hero Section */}
//       <Box textAlign="center">
//         <Typography
//           variant="h2"
//           component="h1"
//           gutterBottom
//           sx={{ fontWeight: 700, color: '#ffffff' }}
//         >
//           Test Case Generator
//         </Typography>
//         <Typography variant="h5" sx={{ color: '#8b949e' }} paragraph>
//           Generate comprehensive test cases for your code using AI
//         </Typography>
//         <Button
//           variant="contained"
//           size="large"
//           startIcon={<GitHubIcon />}
//           onClick={() => navigate('/repository')}
//           sx={{
//             mt: 3,
//             backgroundColor: '#2ea043',
//             '&:hover': { backgroundColor: '#238636' },
//             color: '#ffffff',
//             fontWeight: 'bold',
//             px: 4
//           }}
//         >
//           Connect GitHub Repository
//         </Button>
//       </Box>

//       {/* Feature Section */}
//       <Grid container spacing={4} sx={{ mt: 6 }}>
//         {features.map((feature, index) => (
//           <Grid item xs={12} md={4} key={index}>
//             <Paper
//               elevation={3}
//               sx={{
//                 p: 3,
//                 height: '100%',
//                 backgroundColor: '#161b22',
//                 color: '#c9d1d9',
//                 textAlign: 'center',
//                 border: '1px solid #30363d',
//                 borderRadius: 2
//               }}
//             >
//               {feature.icon}
//               <Typography
//                 variant="h5"
//                 sx={{ mt: 2, mb: 1, fontWeight: 600, color: '#ffffff' }}
//               >
//                 {feature.title}
//               </Typography>
//               <Typography variant="body1" sx={{ color: '#8b949e' }}>
//                 {feature.text}
//               </Typography>
//             </Paper>
//           </Grid>
//         ))}
//       </Grid>

//       {/* How It Works Section */}
//       <Box sx={{ mt: 10, textAlign: 'center' }}>
//         <Typography
//           variant="h4"
//           component="h2"
//           sx={{ mb: 4, fontWeight: 600, color: '#ffffff' }}
//         >
//           How It Works
//         </Typography>

//         <Grid container spacing={4}>
//           {steps.map((item, index) => (
//             <Grid item xs={12} md={4} key={index}>
//               <Box
//                 sx={{
//                   p: 3,
//                   backgroundColor: '#161b22',
//                   border: '1px solid #30363d',
//                   borderRadius: 2,
//                   height: '100%'
//                 }}
//               >
//                 <Typography
//                   variant="h6"
//                   sx={{ color: '#58a6ff', fontWeight: 600, mb: 1 }}
//                 >
//                   {item.step}
//                 </Typography>
//                 <Typography variant="body2" sx={{ color: '#8b949e' }}>
//                   {item.text}
//                 </Typography>
//               </Box>
//             </Grid>
//           ))}
//         </Grid>

//         <Button
//           variant="outlined"
//           size="large"
//           onClick={() => navigate('/repository')}
//           sx={{
//             mt: 6,
//             borderColor: '#2ea043',
//             color: '#ffffff',
//             '&:hover': {
//               backgroundColor: '#238636',
//               borderColor: '#2ea043',
//               color: '#ffffff'
//             },
//             px: 4,
//             fontWeight: 'bold'
//           }}
//         >
//           Get Started
//         </Button>
//       </Box>
//     </Container>
//   );
// };

// export default HomePage;



import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Box,
  useTheme
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import CodeIcon from '@mui/icons-material/Code';
import BugReportIcon from '@mui/icons-material/BugReport';

const HomePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const features = [
    {
      icon: <GitHubIcon sx={{ fontSize: 60, color: theme.palette.secondary.main }} />,
      title: 'GitHub Integration',
      text: 'Connect to your GitHub repositories, browse files, and select code to test.'
    },
    {
      icon: <CodeIcon sx={{ fontSize: 60, color: theme.palette.secondary.main }} />,
      title: 'AI-Powered Analysis',
      text: 'Analyze code with AI to generate test cases tailored to your logic.'
    },
    {
      icon: <BugReportIcon sx={{ fontSize: 60, color: theme.palette.secondary.main }} />,
      title: 'Test Code Generation',
      text: 'Generate test code for Jest, JUnit, Pytest, and more with one click.'
    }
  ];

  const steps = [
    {
      step: '1. Connect Repository',
      text: 'Enter your GitHub repo and select the files you want to test.'
    },
    {
      step: '2. Generate Test Summaries',
      text: 'Our AI scans your code and suggests tests for edge and core cases.'
    },
    {
      step: '3. Create Test Code',
      text: 'Choose a summary and instantly generate full test code.'
    }
  ];

  return (
    <Container
      maxWidth="lg"
      sx={{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        py: 6,
        minHeight: '100vh'
      }}
    >
      {/* Hero Section */}
      <Box textAlign="center" mb={6}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 700, color: '#ffffff' }}
        >
          Test Case Generator
        </Typography>
        <Typography variant="h5" sx={{ color: theme.palette.text.secondary }} paragraph>
          Generate comprehensive test cases for your code using AI
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<GitHubIcon />}
          onClick={() => navigate('/repository')}
          sx={{
            mt: 3,
            backgroundColor: theme.palette.primary.main,
            '&:hover': { backgroundColor: '#238636' },
            color: '#ffffff',
            px: 4
          }}
        >
          Connect GitHub Repository
        </Button>
      </Box>

      {/* Features Section */}
      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                height: '100%',
                textAlign: 'center',
                backgroundColor: theme.palette.background.paper,
                border: '1px solid #30363d',
                borderRadius: 2
              }}
            >
              {feature.icon}
              <Typography
                variant="h5"
                sx={{ mt: 2, mb: 1, fontWeight: 600, color: '#ffffff' }}
              >
                {feature.title}
              </Typography>
              <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                {feature.text}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* How It Works Section */}
      <Box sx={{ mt: 10, textAlign: 'center' }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{ mb: 4, fontWeight: 600, color: '#ffffff' }}
        >
          How It Works
        </Typography>

        <Grid container spacing={4}>
          {steps.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box
                sx={{
                  p: 3,
                  backgroundColor: theme.palette.background.paper,
                  border: '1px solid #30363d',
                  borderRadius: 2,
                  height: '100%'
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: theme.palette.secondary.main, fontWeight: 600, mb: 1 }}
                >
                  {item.step}
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  {item.text}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate('/repository')}
          sx={{
            mt: 6,
            borderColor: theme.palette.primary.main,
            color: '#ffffff',
            '&:hover': {
              backgroundColor: theme.palette.primary.main,
              borderColor: '#2ea043',
              color: '#ffffff'
            },
            px: 4,
            fontWeight: 'bold'
          }}
        >
          Get Started
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;
