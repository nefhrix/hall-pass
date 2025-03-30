import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from "../../utils/useAuth";
import { useForm } from '@mantine/form';
import { TextInput, Button, Select, Text } from "@mantine/core";
import { DatePicker,TimeInput } from '@mantine/dates';  // Import DatePicker from @mantine/dates

const CreateTimeSlot = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const { hallId } = useParams();  // Get hall ID from URL

    const form = useForm({
        initialValues: {
            hall_id: hallId,  // Automatically set hall ID
            date: null,        // Will hold the selected date
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
                navigate(`/halls/${hallId}`);  // Redirect after successful submission
            })
            .catch((err) => {
                console.error('Error creating time slot:', err);
            });
    };

    return (
        <div>
            <Text size={24} mb={5}>Create Time Slot</Text>
            <form onSubmit={form.onSubmit(handleSubmit)}>

                
                <DatePicker
                    label="Date"
                    withAsterisk
                    placeholder="Pick a date"
                    {...form.getInputProps('date')}
                />

                
                <TextInput
                    label="Please enter your desired start time. Use the numbers on your keyboard,or click the clock icon at the end of this bar! (24 hour time format)"
                    type="time"
                    withAsterisk
                    {...form.getInputProps('start_time')}  // Bind to form state
                />

                
                <TextInput
                    label="Please enter your desired end time. Use the numbers on your keyboard,or click the clock icon at the end of this bar! (24 hour time format)"
                    type="time"
                    withAsterisk
                    {...form.getInputProps('end_time')}  // Bind to form state
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
