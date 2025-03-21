import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../utils/useAuth";
import { useForm } from '@mantine/form';
import { TextInput, Button, Text } from "@mantine/core";

const CreateVenue = () => {
    const { token } = useAuth(); // Get token for authentication
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null); // Store user ID from API

    useEffect(() => {
        axios.get('https://hall-pass-main-ea0ukq.laravel.cloud/api/user', {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
            console.log("User API Response:", res.data); // Log full user data
            setUserId(res.data.id); // Ensure we correctly fetch the user ID
        })
        .catch((err) => {
            console.error('Error fetching user ID:', err.response?.data || err);
        });
    }, [token]);

    const form = useForm({
        initialValues: {
            address_line_one: '',
            town: '',
            county: '',
            eircode: '',
            description: '',
            contact: '',
        },
        validate: {
            address_line_one: (value) => value ? null : 'Address Line One is required',
            town: (value) => value ? null : 'Town is required',
            county: (value) => value ? null : 'County is required',
            eircode: (value) => value ? null : 'Eircode is required',
            description: (value) => value ? null : 'Description is required',
            contact: (value) => value ? null : 'Contact number is required',
        },
    });

    const handleSubmit = async () => {
        if (!userId) {
            console.error('User ID is not available');
            return;
        }

        const data = { 
            user_id: userId, 
            ...form.values 
        };

        try {
            const res = await axios.post(
                'https://hall-pass-main-ea0ukq.laravel.cloud/api/venues',
                data,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            console.log("Venue Created:", res.data);

            // Navigate to the user's venues page
            navigate('/userVenues', { state: { msg: 'Venue created successfully!' } });
        } catch (err) {
            console.error("Error creating venue:", err.response?.data || err);
        }
    };

    return (
        <div>
            <Text size={24} mb={5}>Create a venue</Text>
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

                <Button mt={10} type="submit" disabled={!userId}>
                    {userId ? 'Submit' : 'Loading User...'}
                </Button>
            </form>
        </div>
    );
};

export default CreateVenue;
