import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from "../../utils/useAuth";
import { useForm } from '@mantine/form';
import { TextInput, Button, Text, Loader, Alert } from "@mantine/core";
import { showNotification } from '@mantine/notifications';

const EditVenue = () => {
    const { token } = useAuth(); 
    const navigate = useNavigate();
    const { id } = useParams(); // Get venue ID from URL params

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null); // Store user ID from API
    
    const form = useForm({
        initialValues: {
            address_line_one: '',
            town: '',
            county: '',
            eircode: '',
            description: '',
            contact: '',
            user_id: '' // Include user_id in form state
        },
        validate: {
            address_line_one: (value) => (value ? null : 'Address Line One is required'),
            town: (value) => (value ? null : 'Town is required'),
            county: (value) => (value ? null : 'County is required'),
            eircode: (value) => (value ? null : 'Eircode is required'),
            description: (value) => (value ? null : 'Description is required'),
            contact: (value) => (value ? null : 'Contact number is required'),
        },
    });

    useEffect(() => {
        axios.get(`https://hall-pass-main-ea0ukq.laravel.cloud/api/venues/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                form.setValues(res.data); // Populate the form with existing venue data
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching venue:', err);
                setError('Failed to load venue details');
                setLoading(false);
            });
    }, [id, token]);

    useEffect(() => {
        // Fetch user ID from the API
        axios.get('https://hall-pass-main-ea0ukq.laravel.cloud/api/user', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                const user_id = res.data.id;
                setUserId(user_id); // Store the user ID
                form.setFieldValue("user_id", user_id); // Set user_id in form values
            })
            .catch((err) => {
                console.error('Error fetching user ID:', err);
            });
    }, [token]);

    const handleSubmit = (values) => {
        axios.post(`https://hall-pass-main-ea0ukq.laravel.cloud/api/venues/${id}`, { ...values, user_id: userId }, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                console.log('Venue updated:', res.data);

                // Success Notification
                showNotification({
                    title: 'Success',
                    message: 'Venue updated successfully!',
                    color: 'green',
                    autoClose: 3000,
                    radius: 'md',
                    sx: {
                        fontSize: '18px',
                        padding: '20px',
                        fontWeight: 'bold',
                    },
                });

                navigate(`/venues/${id}`);
            })
            .catch((err) => {
                console.error('Error updating venue:', err);
                setError('Failed to update venue');

                // Error Notification
                showNotification({
                    title: 'Error',
                    message: 'Failed to update venue. Please try again.',
                    color: 'red',
                    autoClose: 5000,
                    radius: 'md',
                    sx: {
                        fontSize: '18px',
                        padding: '20px',
                        fontWeight: 'bold',
                    },
                });
            });
    };

    if (loading) return <Loader size="lg" />; // Show loader while fetching data
    if (error) return <Alert color="red">{error}</Alert>; // Show error if fetching failed

    return (
        <div>
            <Text size={24} mb={5}>Edit Venue</Text>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                    label="Address Line One"
                    withAsterisk
                    placeholder="Enter Address Line One"
                    {...form.getInputProps('address_line_one')}
                />

                <TextInput
                    label="Town"
                    withAsterisk
                    placeholder="Enter Town"
                    {...form.getInputProps('town')}
                />

                <TextInput
                    label="County"
                    withAsterisk
                    placeholder="Enter County"
                    {...form.getInputProps('county')}
                />

                <TextInput
                    label="Eircode"
                    withAsterisk
                    placeholder="Enter Eircode"
                    {...form.getInputProps('eircode')}
                />

                <TextInput
                    label="Description"
                    withAsterisk
                    placeholder="Enter Description"
                    {...form.getInputProps('description')}
                />

                <TextInput
                    label="Contact"
                    withAsterisk
                    placeholder="Enter Contact Number"
                    {...form.getInputProps('contact')}
                />

              
                <input type="hidden" {...form.getInputProps('user_id')} />

                <Button mt={10} type="submit">Save Changes</Button>
            </form>
        </div>
    );
};

export default EditVenue;
