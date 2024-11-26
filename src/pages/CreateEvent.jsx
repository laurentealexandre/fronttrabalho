import { useState } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box,
  Snackbar,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    description: '',
    location: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Por enquanto, apenas simulamos o sucesso
    console.log('Dados do evento a serem enviados:', eventData);
    setShowSuccess(true);
    setTimeout(() => {
      navigate('/events');
    }, 1500);
  };

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Criar Novo Evento
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Título do Evento"
            name="title"
            value={eventData.title}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Data"
            name="date"
            type="date"
            value={eventData.date}
            onChange={handleChange}
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Local"
            name="location"
            value={eventData.location}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Descrição"
            name="description"
            value={eventData.description}
            onChange={handleChange}
            margin="normal"
            required
            multiline
            rows={4}
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            sx={{ mt: 3 }}
          >
            Criar Evento
          </Button>
        </Box>
      </Paper>
      <Snackbar
        open={showSuccess}
        autoHideDuration={2000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Evento criado com sucesso! (Simulação)
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateEvent;