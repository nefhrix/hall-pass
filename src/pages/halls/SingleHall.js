import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/useAuth";
import { Loader, Alert, Text, Button, Card, Group, Badge } from "@mantine/core";

const SingleHall = () => {
    const { token } = useAuth();
    const { hallId } = useParams();  
    const navigate = useNavigate();

    const [hall, setHall] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [roleId, setRoleId] = useState(null);

    // Function to fetch user role
    const fetchUserRole = async () => {
        try {
            const res = await axios.get(`https://hall-pass-main-ea0ukq.laravel.cloud/api/user`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.roles.length > 0) {
                setRoleId(res.data.roles[0].id);
                console.log("Fetched Role ID:", res.data.roles[0].id);
            }
        } catch (err) {
            console.error("Error fetching user role:", err);
        }
    };

    // Function to fetch hall and timeslot data
    const fetchHall = async () => {
        try {
            const res = await axios.get(
                `https://hall-pass-main-ea0ukq.laravel.cloud/api/halls/${hallId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setHall(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching hall details:", err);
            setError("Failed to load hall details.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHall(); 
        fetchUserRole();
    }, [hallId, token]);

    if (loading) return <Loader size="lg" />;
    if (error) return <Alert color="red">{error}</Alert>;

    return (
        <div>
            <Text size={24} mb={5}>Hall Details</Text>
            <Card shadow="sm" p="lg">
                <ul>
                    <li><strong>Capacity:</strong> {hall.capacity} people</li>
                    <li><strong>Price per Hour:</strong> €{hall.price_per_hour}</li>
                    <li><strong>Sports Available:</strong></li>
                    <Group>
                        {hall.sports && hall.sports.length > 0 ? (
                            hall.sports.map((sport, index) => (
                                <Badge key={index} color="blue">{sport.sport}</Badge>
                            ))
                        ) : (
                            <Text color="gray">No sports listed</Text>
                        )}
                    </Group>
                </ul>

                <Text size={20} mt={20} mb={10}>Time Slots</Text>
                {hall.timeslots.length > 0 ? (
                    <div>
                        {hall.timeslots.map((slot) => (
                            <Card 
                                key={slot.id} 
                                shadow="sm" 
                                p="lg" 
                                mb={10} 
                                style={{ cursor: slot.status === "Available" ? "pointer" : "default", opacity: slot.status === "Booked" ? 0.5 : 1 }}
                                onClick={() => slot.status === "Available" && navigate(`/venues/${hall.venue_id}/timeslots/${slot.id}/book`)}
                            >
                                <Text><strong>Timeslot ID:</strong> {slot.id}</Text>
                                <Text><strong>Date:</strong> {slot.date}</Text>
                                <Text><strong>Start Time:</strong> {slot.start_time}</Text>
                                <Text><strong>End Time:</strong> {slot.end_time}</Text>
                                <Badge size="xl" color={slot.status === "Available" ? "green" : "red"}>
                                    {slot.status}
                                </Badge>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Text color="gray">No time slots available.</Text>
                )}

                {/* Show Create Time Slot button only if roleId is NOT 1 */}
                {roleId !== 1 && (
                    <Button 
                        mt={10} 
                        variant="filled" 
                        color="blue" 
                        onClick={() => navigate(`/venues/${hall.id}/timeslots/Create`)}
                    >
                        Create Time Slot
                    </Button>
                )}

                <Link to={`/venues/${hall.venue_id}`}>
                    <Button mt={10} variant="outline">Back to Venue</Button>
                </Link>
            </Card>
        </div>
    );
};

export default SingleHall;
