import React from 'react';
import { Container, Button, Group, Text, Paper, Card, Grid, Flex, Title, Stack } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <Container size="xl" style={{ marginTop: '100px' }}>
            {/* Hello Section */}
            <Paper padding="xl" shadow="sm" style={{ marginBottom: '100px', backgroundColor: '#f7f7f7' }}>
                <Stack align="center">
                    <Title order={1} align="center" style={{ marginBottom: '20px' }}>
                        Welcome to Hall-Pass
                    </Title>
                    <Text align="center" size="lg" style={{ maxWidth: '800px' }}>
                        Whether you want to book a venue, rent your hall or reduce admin hassle, Hall Pass offers services fit for all. 
                    </Text>
                    
                </Stack>
            </Paper>

            

            
            {/* Footer Section */}
            <Paper padding="lg" shadow="xs" style={{ marginTop: '100px', backgroundColor: '#f7f7f7' }}>
                <Group position="center">
                    <Text>© 2024 Hall Pass. </Text>
                    <Text>All Rights Reserved.</Text>
                </Group>
            </Paper>
        </Container>
    );
};

export default HomePage;
