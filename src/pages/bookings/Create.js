import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../utils/useAuth";
import { useForm } from "@mantine/form";
import { TextInput, Button, Text, Alert } from "@mantine/core";

const BookingForm = () => {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const { venueId, timeslotId } = useParams(); // Get venue_id and timeslot_id from URL

    const [error, setError] = useState(null);
    const [hallPrice, setHallPrice] = useState(0);
    const [timeslot, setTimeslot] = useState(null);
    const [loading, setLoading] = useState(true);

    const form = useForm({
        initialValues: {
            venue_id: venueId,
            timeslot_id: timeslotId,
            user_id: user.id,
            price_of_booking: "",
        },
    });

    // Fetch Hall and Timeslot Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch timeslot details
                const timeslotRes = await axios.get(
                    `https://hall-pass-main-ea0ukq.laravel.cloud/api/timeslots/${timeslotId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setTimeslot(timeslotRes.data.data);

                // Fetch hall details to get price per hour
                const hallRes = await axios.get(
                    `https://hall-pass-main-ea0ukq.laravel.cloud/api/halls/${timeslotRes.data.data.hall_id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setHallPrice(hallRes.data.data.price_per_hour);

                // Calculate price based on hours booked
                const startTime = new Date(`1970-01-01T${timeslotRes.data.data.start_time}`);
                const endTime = new Date(`1970-01-01T${timeslotRes.data.data.end_time}`);
                const hours = (endTime - startTime) / (1000 * 60 * 60); // Convert ms to hours

                form.setValues({
                    ...form.values,
                    price_of_booking: (hours * hallRes.data.data.price_per_hour).toFixed(2),
                });

                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load data.");
                setLoading(false);
            }
        };

        fetchData();
    }, [timeslotId, token]);

   //hanndle booking
   const handleSubmit = async () => {
    try {
        
        await axios.post("https://hall-pass-main-ea0ukq.laravel.cloud/api/bookings", form.values, {
            headers: { Authorization: `Bearer ${token}` },
        });

      
        await axios.patch(
            `https://hall-pass-main-ea0ukq.laravel.cloud/api/timeslots/${timeslotId}`,
            {
                hall_id: timeslot.hall_id, // Include hall_id
                date: timeslot.date,       // Include date
                start_time: timeslot.start_time, // Include start time
                end_time: timeslot.end_time,     // Include end time
                status: "Booked",          // Update status
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        
      navigate(`/halls/${timeslot?.hall_id}`);
    } catch (err) {
        console.error("Error processing booking:", err);
        setError("Failed to create booking. Please try again.");
    }
};


    

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Alert color="red" mb={10}>{error}</Alert>;

    return (
        <div>
            <Text size={24} mb={5}>Create Booking</Text>

            <Text><strong>Time Slot:</strong> {timeslot?.start_time} - {timeslot?.end_time}</Text>
            <Text><strong>Price Per Hour:</strong> €{hallPrice}</Text>

            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                    label="Price (€)"
                    value={form.values.price_of_booking}
                    disabled
                />
                <Button mt={10} type="submit">Confirm Booking</Button>
            </form>
        </div>
    );
};

export default BookingForm;
