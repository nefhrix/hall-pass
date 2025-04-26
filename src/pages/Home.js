import React from 'react';
import { Container, Button, Group, Text, Paper, Card, Grid, Flex, Title, Stack } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        
<>
<Navbar size="lg" style={{ width: "60%" }}/>

        <Container size="xl" style={{ marginTop: '100px' }}>
           
            <Paper padding="xl"  style={{ marginBottom: '100px', backgroundColor: '#FFFFFF' }}>
                <Stack align="center">
                    <Title order={1} align="center" style={{ marginBottom: '20px' }}>
                        Welcome to HallPass
                    </Title>
                    <Text align="center" size="lg" style={{ maxWidth: '800px' }}>
                        Whether you want to book a venue, rent your hall or reduce admin hassle, HallPass offers services fit for all. 
                    </Text>
                    
                </Stack>
            </Paper>
        </Container>
        </>
    );
};

export default HomePage;
