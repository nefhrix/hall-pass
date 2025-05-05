import React from 'react';
import { Container, Button, Text, Paper, Title, Stack, rem } from '@mantine/core';
import { useNavigate, Link } from 'react-router-dom';
import { useMediaQuery } from '@mantine/hooks';
import Navbar from '../components/Navbar';

const HomePage = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <>
      <Navbar size="lg" />

      <Container size="md" px="md" py="xl">
        <Paper p="xl" radius="md" shadow="sm" style={{ backgroundColor: '#FFFFFF' }}>
          <Stack align="center" spacing="lg" ta="center">
            <Title order={isMobile ? 2 : 1}>
              Welcome to HallPass
            </Title>

            <Text size="lg" maw={800}>
              Whether you want to book a venue, rent your hall or reduce admin hassle, HallPass offers services fit for all.
            </Text>

            <Button
              component={Link}
              to="/pages/venues"
              variant="outline"
              size={isMobile ? 'sm' : 'md'}
            >
              Explore Venues
            </Button>
          </Stack>
        </Paper>
      </Container>
    </>
  );
};

export default HomePage;
