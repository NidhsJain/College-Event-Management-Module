import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Box,
  Pagination,
  Chip,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import axios from 'axios';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchEvents = async (pageNum = 1, query = '') => {
    try {
      const url = query
        ? `http://localhost:5000/api/events/search/${query}?page=${pageNum}`
        : `http://localhost:5000/api/events?page=${pageNum}`;
      
      const response = await axios.get(url);
      setEvents(response.data.events);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents(page, searchQuery);
  }, [page, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchEvents(1, searchQuery);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box component="form" onSubmit={handleSearch} sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            endAdornment: (
              <Button type="submit" color="primary">
                <SearchIcon />
              </Button>
            ),
          }}
        />
      </Box>

      <Grid container spacing={4}>
        {events.map((event) => (
          <Grid item key={event._id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
              }}
              onClick={() => navigate(`/events/${event._id}`)}
            >
              {event.image && (
                <CardMedia
                  component="img"
                  height="200"
                  image={`http://localhost:5000${event.image}`}
                  alt={event.title}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {event.title}
                </Typography>
                <Chip
                  label={event.eventType}
                  color={getEventTypeColor(event.eventType)}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {new Date(event.date).toLocaleDateString()} at {event.time}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Venue: {event.venue}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Created by: {event.createdBy?.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
};

export default EventList; 