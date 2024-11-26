import { useState, useEffect } from 'react';
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
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        const event = response.data;
        const date = new Date(event.date);
        
        setEventData({
          title: event.title,
          date: date.toISOString().split('T')[0],
          time: date.toTimeString().slice(0, 5),
          description: event.description,
          location: event.location,
          capacity: event.capacity
        });
      } catch (err) {
        setError('Erro ao carregar evento. Por favor, tente novamente.');
        console.error('Erro:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

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

    setSaving(true);
    setError(null);

    try {
      const dateTime = `${eventData.date}T${eventData.time}:00`;
      
      const formattedData = {
        title: eventData.title.trim(),
        date: dateTime,
        location: eventData.location.trim(),
        description: eventData.description.trim(),
        capacity: parseInt(eventData.capacity)
      };

      await api.put(`/events/${id}`, formattedData);
      setShowSuccess(true);
      setTimeout(() => {
        navigate(`/events/${id}`);
      }, 2000);
    } catch (err) {
      console.error('Erro ao atualizar evento:', err);
      setError(err.response?.data?.message || 'Erro ao atualizar evento. Por favor, tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Editar Evento
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
                disabled={saving}
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
                disabled={saving}
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
                disabled={saving}
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
                disabled={saving}
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
                disabled={saving}
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
                disabled={saving}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                      Salvando...
                    </>
                  ) : (
                    'Salvar Alterações'
                  )}
                </Button>
                <Button 
                  variant="outlined"
                  onClick={() => navigate(`/events/${id}`)}
                  disabled={saving}
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
          Evento atualizado com sucesso!
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

export default EditEvent;