import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../../utils/useAuth";
import { TextInput, Button, NumberInput, MultiSelect, Text } from "@mantine/core";
import Navbar from "../../components/Navbar";
const EditHall = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const { id: hallId } = useParams(); // Only used for PATCH request
    const [searchParams] = useSearchParams();
    const venueId = Number(searchParams.get("venue_id")); // Venue ID from URL query params

    const sportsOptions = [
        { value: "1", label: "Football" },
        { value: "2", label: "Basketball" },
        { value: "3", label: "Volleyball" },
        { value: "4", label: "Badminton" },
    ];

    const [formValues, setFormValues] = useState({
        venue_id: venueId || 0, // Show venue ID only in the form
        name: "", // New name field
        capacity: 0,
        price_per_hour: 0,
        sports: [],
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("Extracted hallId:", hallId);
        console.log("Extracted venueId:", venueId);
    
        if (!hallId || !venueId) {
            console.error("Invalid hall or venue ID.");
            return;
        }
    
        axios
            .get(`https://hall-pass-main-ea0ukq.laravel.cloud/api/halls/${hallId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                const { name, capacity, price_per_hour, sports } = res.data.data;
                setFormValues({
                    venue_id: venueId, // Ensure venue_id stays as venueId
                    name, // Set the name field
                    capacity: Number(capacity),
                    price_per_hour: Number(price_per_hour),
                    sports: sports.map((sport) => String(sport)),
                });
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching hall details:", err);
                setLoading(false);
            });
    }, [hallId, venueId, token]);

    const handleChange = (field, value) => {
        setFormValues((prev) => ({
            ...prev,
            [field]: field === "sports" ? value.map(Number) : value, // Handle sports array and other fields
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(
                `https://hall-pass-main-ea0ukq.laravel.cloud/api/halls/${hallId}`, // Only place where hallId is used
                formValues,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("Success:", res.data);
            navigate(`/venues/${venueId}`); // Redirect to venue page
        } catch (err) {
            console.error("Error:", err.response?.data || err.message);
        }
    };

    if (loading) return <Text>Loading...</Text>;

    return (
        <>
    <Navbar />
        <div>
            <Text size={24} mb={5}>Edit Hall</Text>
            <form onSubmit={handleSubmit}>
                <TextInput label="Venue ID"  style={{display: 'none'}} value={formValues.venue_id} />
                
                <TextInput
                    label="Name"
                    withAsterisk
                    value={formValues.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                />
                
                <NumberInput
                    label="Capacity"
                    withAsterisk
                    value={formValues.capacity}
                    onChange={(val) => handleChange("capacity", val)}
                />
                
                <NumberInput
                    label="Price per Hour"
                    withAsterisk
                    value={formValues.price_per_hour}
                    onChange={(val) => handleChange("price_per_hour", val)}
                />
                
                <MultiSelect
                    label="Sports"
                    data={sportsOptions}
                    value={formValues.sports.map(String)} // Convert to string for MultiSelect
                    onChange={(val) => handleChange("sports", val)}
                />
                
                <Button mt={10} type="submit">Save Changes</Button>
            </form>
        </div>
        </>
    );
};

export default EditHall;
