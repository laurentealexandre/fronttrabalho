import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Chip,
  Grid,
  Divider
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    // Simular dados do evento (futuramente virá da API)
    setEvent({
      id,
      title: 'Workshop de React',
      date: '2024-12-01',
      location: 'Auditório Principal',
      description: 'Workshop intensivo sobre React e suas principais funcionalidades. Aprenda sobre hooks, context API, e as melhores práticas de desenvolvimento.',
      organizer: 'Departamento de Computação',
      capacity: 50,
      registeredAttendees: 30
    });
  }, [id]);

  if (!event) {
    return (
      <Container>
        <Typography>Carregando...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          {event.title}
        </Typography>
        
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CalendarTodayIcon sx={{ mr: 1 }} />
              <Typography>
                {new Date(event.date).toLocaleDateString()}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOnIcon sx={{ mr: 1 }} />
              <Typography>{event.location}</Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Sobre o Evento
        </Typography>
        <Typography paragraph>
          {event.description}
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Organizador: {event.organizer}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Chip 
              label={`${event.registeredAttendees}/${event.capacity} inscritos`} 
              color="primary" 
            />
          </Box>
        </Box>

        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => console.log('Inscrever')}
          >
            Inscrever-se
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/events')}
          >
            Voltar
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default EventDetails;