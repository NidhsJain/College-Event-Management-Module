import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';

const eventTypes = ['Academic', 'Cultural', 'Sports', 'Technical', 'Other'];

const CreateEvent = ({ editMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: '',
    date: new Date(),
    time: '',
    venue: '',
    image: null,
  });

  useEffect(() => {
    if (editMode && id) {
      const fetchEvent = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/events/${id}`);
          const event = response.data;
          setFormData({
            title: event.title,
            description: event.description,
            eventType: event.eventType,
            date: new Date(event.date),
            time: event.time,
            venue: event.venue,
            image: null,
          });
        } catch (error) {
          setError('Failed to fetch event details');
        }
      };
      fetchEvent();
    }
  }, [editMode, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === 'date') {
          formDataToSend.append(key, formData[key].toISOString());
        } else if (key === 'image' && formData[key]) {
          formDataToSend.append(key, formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (editMode) {
        await axios.put(`http://localhost:5000/api/events/${id}`, formDataToSend);
        setSuccess('Event updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/events', formDataToSend);
        setSuccess('Event created successfully');
      }

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          marginTop: 4,
          marginBottom: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
          }}
        >
          <Typography variant="h5" component="h1" gutterBottom>
            {editMode ? 'Edit Event' : 'Create New Event'}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={4}
              required
            />

            <TextField
              fullWidth
              select
              label="Event Type"
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              margin="normal"
              required
            >
              {eventTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date"
                value={formData.date}
                onChange={(newValue) => {
                  setFormData((prev) => ({ ...prev, date: newValue }));
                }}
                renderInput={(params) => (
                  <TextField {...params} fullWidth margin="normal" required />
                )}
              />
            </LocalizationProvider>

            <TextField
              fullWidth
              label="Time"
              name="time"
              type="time"
              value={formData.time}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              required
            />

            <TextField
              fullWidth
              label="Venue"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              margin="normal"
              required
            />

            <Button
              variant="contained"
              component="label"
              sx={{ mt: 2, mb: 2 }}
            >
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>

            {formData.image && (
              <Typography variant="body2" sx={{ mb: 2 }}>
                Selected file: {formData.image.name}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : editMode ? (
                'Update Event'
              ) : (
                'Create Event'
              )}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateEvent; 