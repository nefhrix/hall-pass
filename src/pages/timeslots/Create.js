import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from "../../utils/useAuth";
import { useForm } from '@mantine/form';
import { TextInput, Button, Select, Text } from "@mantine/core";

const CreateTimeSlot = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const { hallId } = useParams();  // Get hall ID from URL

    const form = useForm({
        initialValues: {
            hall_id: hallId,  // Set hall ID automatically
            date: '',
            start_time: '',
            end_time: '',
            status: 'Available', // Default status
        },
        validate: {
            date: (value) => (value ? null : 'Date is required'),
            start_time: (value) => (value ? null : 'Start time is required'),
            end_time: (value) => (value ? null : 'End time is required'),
        },
    });

    const handleSubmit = () => {
        axios.post('https://hall-pass-main-ea0ukq.laravel.cloud/api/timeslots', form.values, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(() => {
                navigate(`/halls/${hallId}`);  // Redirect to hall page after creation
            })
            .catch((err) => {
                console.error('Error creating time slot:', err);
            });
    };
    console.log(form.values)

    return (
        <div>
            <Text size={24} mb={5}>Create Time Slot</Text>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                    label="Date"
                    type="date"
                    withAsterisk
                    {...form.getInputProps('date')}
                />
                <TextInput
                    label="Start Time"
                    type="time"
                    withAsterisk
                    {...form.getInputProps('start_time')}
                />
                <TextInput
                    label="End Time"
                    type="time"
                    withAsterisk
                    {...form.getInputProps('end_time')}
                />
                <Select
                    label="Status"
                    data={['Available', 'Booked']}
                    withAsterisk
                    {...form.getInputProps('status')}
                />
                <Button mt={10} type="submit">Create Time Slot</Button>
            </form>
        </div>
    );
};

export default CreateTimeSlot;
