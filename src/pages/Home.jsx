import { Container, Typography, Paper, Box } from '@mui/material';

const Home = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Bem-vindo ao Sistema de Eventos
          </Typography>
          <Typography variant="body1" paragraph>
            Aqui você pode encontrar e gerenciar eventos acadêmicos.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Home;