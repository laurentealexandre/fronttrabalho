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
  CircularProgress,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    time: '',
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

  const validateForm = () => {
    if (!eventData.title.trim()) return "O título é obrigatório";
    if (!eventData.date) return "A data é obrigatória";
    if (!eventData.time) return "O horário é obrigatório";
    if (!eventData.location.trim()) return "O local é obrigatório";
    if (!eventData.capacity || eventData.capacity <= 0) return "A capacidade deve ser maior que zero";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Combina data e hora
      const dateTime = `${eventData.date}T${eventData.time}:00`;
      
      const formattedData = {
        title: eventData.title.trim(),
        date: dateTime,
        location: eventData.location.trim(),
        description: eventData.description.trim(),
        capacity: parseInt(eventData.capacity)
      };

      await api.post('/events', formattedData);
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/events');
      }, 2000);
    } catch (err) {
      console.error('Erro ao criar evento:', err);
      setError(err.response?.data?.message || 'Erro ao criar evento. Por favor, tente novamente.');
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
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Título do Evento"
                name="title"
                value={eventData.title}
                onChange={handleChange}
                required
                disabled={loading}
                error={!!error && !eventData.title}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data"
                name="date"
                type="date"
                value={eventData.date}
                onChange={handleChange}
                required
                disabled={loading}
                InputLabelProps={{ shrink: true }}
                error={!!error && !eventData.date}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Horário"
                name="time"
                type="time"
                value={eventData.time}
                onChange={handleChange}
                required
                disabled={loading}
                InputLabelProps={{ shrink: true }}
                error={!!error && !eventData.time}
              />
            </Grid>

            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Local"
                name="location"
                value={eventData.location}
                onChange={handleChange}
                required
                disabled={loading}
                error={!!error && !eventData.location}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Capacidade"
                name="capacity"
                type="number"
                value={eventData.capacity}
                onChange={handleChange}
                required
                disabled={loading}
                inputProps={{ min: 1 }}
                error={!!error && (!eventData.capacity || eventData.capacity <= 0)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                name="description"
                value={eventData.description}
                onChange={handleChange}
                required
                multiline
                rows={4}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  disabled={loading}
                  sx={{ mt: 2 }}
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
                <Button 
                  variant="outlined"
                  onClick={() => navigate('/events')}
                  disabled={loading}
                  sx={{ mt: 2 }}
                >
                  Cancelar
                </Button>
              </Box>
            </Grid>
          </Grid>
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