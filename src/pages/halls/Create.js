import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from "../../utils/useAuth";
import { useForm } from '@mantine/form';
import { TextInput, Button, NumberInput, MultiSelect, Text } from "@mantine/core";

const CreateHall = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams(); // Venue ID from URL

    const sportsOptions = [
        { value: 1, label: "Football" },
        { value: 2, label: "Basketball" },
        { value: 3, label: "Volleyball" },
        { value: 4, label: "Badminton" },
    ];

    const [venueId, setVenueId] = useState(null);

    const form = useForm({
        initialValues: {
            venue_id: '',
            name: '',  // Updated from hall_name
            capacity: 0,
            price_per_hour: 0,
            sports: [],
        },
        validate: {
            venue_id: (value) => (value ? null : 'Venue ID is required'),
            name: (value) => (value.trim() ? null : 'Hall name is required'),
            capacity: (value) => (value > 0 ? null : 'Capacity must be greater than 0'),
            price_per_hour: (value) => (value >= 0 ? null : 'Price must be 0 or more'),
        },
    });

    useEffect(() => {
        if (!id) {
            console.error('No valid venue ID provided.');
            return;
        }

        axios.get(`https://hall-pass-main-ea0ukq.laravel.cloud/api/venues/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
            const venueID = Number(res.data.data.id); // Convert to number
            setVenueId(venueID);
            form.setFieldValue('venue_id', venueID);
        })
        .catch((err) => {
            console.error('Error fetching venue details:', err);
        });
    }, [id, token]);

    const handleSubmit = () => {
        const formattedValues = {
            venue_id: Number(form.values.venue_id), // Ensure it's a number
            name: form.values.name.trim(), // Ensure valid hall name
            capacity: Number(form.values.capacity),
            price_per_hour: Number(form.values.price_per_hour),
            sports: form.values.sports.map(Number), // Convert sports to numbers
        };

        axios.post('https://hall-pass-main-ea0ukq.laravel.cloud/api/halls', formattedValues, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
            navigate(`/venues/${id}`);
        })
        .catch((err) => {
            console.error('API Error:', err.response?.data || err.message);
        });
    };

    return (
        <div>
            <Text size={24} mb={5}>Create a Hall</Text>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                    label="Hall Name"
                    withAsterisk
                    placeholder="Enter hall name"
                    {...form.getInputProps('name')}
                />
                <TextInput
                    label="Venue ID"
                    withAsterisk
                    placeholder="Fetching Venue ID..."
                    {...form.getInputProps('venue_id')}
                    style={{ display: 'none' }}
                />
                <NumberInput
                    label="Capacity"
                    withAsterisk
                    placeholder="Enter Capacity"
                    {...form.getInputProps('capacity')}
                />
                <NumberInput
                    label="Price per Hour"
                    withAsterisk
                    placeholder="Enter Price per Hour"
                    {...form.getInputProps('price_per_hour')}
                />
                <MultiSelect
                    label="Sports"
                    data={sportsOptions.map(option => ({ value: option.value.toString(), label: option.label }))}
                    placeholder="Select sports"
                    {...form.getInputProps('sports')}
                />
                <Button mt={10} type="submit">Submit</Button>
            </form>
        </div>
    );
};

export default CreateHall;
