import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        setEvent(response.data);
        if (user) {
          const subscriptionResponse = await api.get(`/events/${id}/subscriptions/check`);
          setIsSubscribed(subscriptionResponse.data.isSubscribed);
        }
      } catch (err) {
        setError('Erro ao carregar o evento. Por favor, tente novamente.');
        console.error('Erro:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, user]);

  const handleSubscription = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setSubscribing(true);
    try {
      if (isSubscribed) {
        await api.delete(`/events/${id}/subscriptions`);
        setIsSubscribed(false);
      } else {
        await api.post(`/events/${id}/subscriptions`);
        setIsSubscribed(true);
      }
      // Atualiza o número de inscritos
      const response = await api.get(`/events/${id}`);
      setEvent(response.data);
    } catch (err) {
      setError('Erro ao processar inscrição. Por favor, tente novamente.');
    } finally {
      setSubscribing(false);
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await api.delete(`/events/${id}`);
      navigate('/events');
    } catch (err) {
      setError('Erro ao excluir evento. Por favor, tente novamente.');
      setDeleteDialogOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/events')}
          sx={{ mt: 2 }}
        >
          Voltar para Eventos
        </Button>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info">Evento não encontrado</Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/events')}
          sx={{ mt: 2 }}
        >
          Voltar para Eventos
        </Button>
      </Container>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          {event.title}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CalendarTodayIcon sx={{ mr: 1 }} />
              <Typography>
                {formatDate(event.date)}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOnIcon sx={{ mr: 1 }} />
              <Typography>{event.location}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PeopleIcon sx={{ mr: 1 }} />
              <Typography>
                {event.subscribedCount || 0}/{event.capacity} inscritos
              </Typography>
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

        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/events')}
          >
            Voltar para Lista
          </Button>

          {event.subscribedCount < event.capacity && (
            <Button
              variant={isSubscribed ? "outlined" : "contained"}
              color={isSubscribed ? "error" : "success"}
              onClick={handleSubscription}
              disabled={subscribing}
            >
              {subscribing ? (
                <CircularProgress size={24} />
              ) : isSubscribed ? (
                'Cancelar Inscrição'
              ) : (
                'Inscrever-se'
              )}
            </Button>
          )}

          {user && (
            <>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate(`/events/edit/${event.id}`)}
              >
                Editar
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleDeleteClick}
                disabled={deleting}
              >
                {deleting ? 'Excluindo...' : 'Excluir'}
              </Button>
            </>
          )}
        </Box>
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir o evento "{event.title}"? 
            Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleDeleteCancel} 
            disabled={deleting}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={deleting}
            autoFocus
          >
            {deleting ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                Excluindo...
              </>
            ) : (
              'Excluir'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EventDetails;