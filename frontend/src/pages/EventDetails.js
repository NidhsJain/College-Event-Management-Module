import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(response.data);
      } catch (error) {
        setError('Failed to fetch event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/events/${id}`);
      navigate('/');
    } catch (error) {
      setError('Failed to delete event');
    }
  };

  const getEventTypeColor = (type) => {
    const colors = {
      Academic: 'primary',
      Cultural: 'secondary',
      Sports: 'success',
      Technical: 'info',
      Other: 'default',
    };
    return colors[type] || 'default';
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  if (error || !event) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Typography color="error">{error || 'Event not found'}</Typography>
        </Box>
      </Container>
    );
  }

  const isCreator = user && user.id === event.createdBy._id;

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <IconButton onClick={() => navigate('/')}>
              <ArrowBackIcon />
            </IconButton>
            {isCreator && (
              <Box>
                <IconButton
                  color="primary"
                  onClick={() => navigate(`/edit-event/${id}`)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          </Box>

          {event.image && (
            <Box
              component="img"
              src={`http://localhost:5000${event.image}`}
              alt={event.title}
              sx={{
                width: '100%',
                maxHeight: 400,
                objectFit: 'cover',
                mb: 3,
              }}
            />
          )}

          <Typography variant="h4" component="h1" gutterBottom>
            {event.title}
          </Typography>

          <Chip
            label={event.eventType}
            color={getEventTypeColor(event.eventType)}
            sx={{ mb: 2 }}
          />

          <Typography variant="body1" paragraph>
            {event.description}
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Time:</strong> {event.time}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Venue:</strong> {event.venue}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Created by:</strong> {event.createdBy.name}
            </Typography>
          </Box>
        </Paper>
      </Box>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Event</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this event? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EventDetails; 