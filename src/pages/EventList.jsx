import { 
    Container, 
    Grid, 
    Typography, 
    Card, 
    CardContent, 
    CardActions, 
    Button 
  } from '@mui/material';
  import { useNavigate } from 'react-router-dom';
  
  const EventList = () => {
    const navigate = useNavigate();
    const events = [
      {
        id: 1,
        title: 'Workshop de React',
        date: '2024-11-30',
        description: 'Workshop intensivo sobre React e suas principais funcionalidades.'
      },
      {
        id: 2,
        title: 'Conferência de Spring Boot',
        date: '2024-12-14',
        description: 'Conferência sobre as novidades do Spring Boot e boas práticas.'
      },
      {
        id: 3,
        title: 'Hackathon de Inovação',
        date: '2024-12-20',
        description: 'Maratona de programação focada em soluções inovadoras.'
      }
    ];
  
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Eventos Disponíveis
        </Typography>
        <Grid container spacing={3}>
          {events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {event.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Data: {new Date(event.date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {event.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    Ver Detalhes
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  };
  
  export default EventList;