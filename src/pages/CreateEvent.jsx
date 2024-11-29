import { useState } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    description: '',
    location: '',
    capacity: ''
  });
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      
      const formattedData = {
        ...eventData,
        date: `${eventData.date}T00:00:00`,
        capacity: parseInt(eventData.capacity)
      };

      await api.post('/events', formattedData);
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/events');
      }, 2000);
    } catch (err) {
      console.error('Erro ao criar evento:', err);
      setError('Erro ao criar evento. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Capacidade"
            name="capacity"
            type="number"
            value={eventData.capacity}
            onChange={handleChange}
            margin="normal"
            required
            disabled={loading}
            inputProps={{ min: 1 }}
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
            disabled={loading}
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                Criando...
              </>
            ) : (
              'Criar Evento'
            )}
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={showSuccess}
        autoHideDuration={2000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Evento criado com sucesso!
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateEvent;