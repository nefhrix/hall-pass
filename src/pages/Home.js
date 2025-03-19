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
                        Our clinic offers a wide range of healthcare services, from routine check-ups to specialized treatments. Our team of experienced doctors is here to support your health.
                    </Text>
                    <Flex justify="center" mt="md" style={{ marginBottom: '40px'}}>
                        <Button onClick={() => navigate('/venues/create')} size="lg">Book an Appointment</Button>
                    </Flex>
                </Stack>
            </Paper>

            {/* About the Clinic Section */}
            <Paper padding="xl" shadow="sm" style={{ marginBottom: '40px' }}>
                <Title order={2} align="center" style={{ marginBottom: '20px' }}>About Us</Title>
                <Text align="center" size="lg" style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom:'80px' }}>
                    We are dedicated to providing high-quality healthcare to individuals and families. Our specialists are committed to offering personalized care, ensuring that each patient receives the attention they deserve.
                </Text>
            </Paper>

            {/* Services Section with Specializations */}
            <Title order={2} align="center" style={{ marginBottom: '20px' }}>Our Specializations</Title>
            <Grid gutter="lg" style={{ marginBottom: '100px' }}>
                <Grid.Col span={12} sm={6} md={4}>
                    <Card shadow="sm" padding="xl" style={{ height: '100%' }}>
                        <Title order={3}>Podiatrist</Title>
                        <Text>Comprehensive care for foot and ankle issues, including injuries, surgeries, and chronic conditions.</Text>
                    </Card>
                </Grid.Col>
                <Grid.Col span={12} sm={6} md={4}>
                    <Card shadow="sm" padding="xl" style={{ height: '100%' }}>
                        <Title order={3}>Dermatologist</Title>
                        <Text>Skin care, treatment of conditions like acne, eczema, and comprehensive cosmetic dermatology.</Text>
                    </Card>
                </Grid.Col>
                <Grid.Col span={12} sm={6} md={4}>
                    <Card shadow="sm" padding="xl" style={{ height: '100%' }}>
                        <Title order={3}>Pediatrician</Title>
                        <Text>Specialized care for children, including routine check-ups, vaccinations, and pediatric treatments.</Text>
                    </Card>
                </Grid.Col>
                <Grid.Col span={12} sm={6} md={4}>
                    <Card shadow="sm" padding="xl" style={{ height: '100%' }}>
                        <Title order={3}>Psychiatrist</Title>
                        <Text>Psychiatric services for mental health, including treatment for depression, anxiety, and therapy sessions.</Text>
                    </Card>
                </Grid.Col>
                <Grid.Col span={12} sm={6} md={4}>
                    <Card shadow="sm" padding="xl" style={{ height: '100%' }}>
                        <Title order={3}>General Practitioner</Title>
                        <Text>Primary care for general health issues, wellness checks, and management of chronic conditions.</Text>
                    </Card>
                </Grid.Col>
            </Grid>

            {/* Footer Section */}
            <Paper padding="lg" shadow="xs" style={{ marginTop: '100px', backgroundColor: '#f7f7f7' }}>
                <Group position="center">
                    <Text>© 2024 Doctor's Clinic. All Rights Reserved.</Text>
                </Group>
            </Paper>
        </Container>
    );
};

export default HomePage;
