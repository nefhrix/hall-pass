import { useEffect, useState } from "react";
import axios from 'axios';
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/useAuth";
import { Loader, Alert, Text, Button, Card, Group } from "@mantine/core";

const SingleVenue = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();

    const [venue, setVenue] = useState(null);
    const [roleId, setRoleId] = useState(null); // Store user's role ID
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);
    const [hallDeleteError, setHallDeleteError] = useState(null);

    // Fetch user role
    const fetchUserRole = async () => {
        try {
            const res = await axios.get(`https://hall-pass-main-ea0ukq.laravel.cloud/api/user`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.roles.length > 0) {
                setRoleId(res.data.roles[0].id); // Store role ID
                console.log("Fetched Role ID:", res.data.roles[0].id);
            }
        } catch (err) {
            console.error("Error fetching user role:", err);
        }
    };

    useEffect(() => {
        fetchUserRole();
    }, [token]);

    useEffect(() => {
        const fetchVenue = async () => {
            try {
                const res = await axios.get(`https://hall-pass-main-ea0ukq.laravel.cloud/api/venues/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setVenue(res.data.data);
            
                setLoading(false);
            } catch (err) {
                console.error("Error fetching venue details:", err);
                setError("Failed to load venue details.");
                setLoading(false);
            }
        };

        fetchVenue();
    }, [id, token]);

    const handleDeleteVenue = async () => {
        if (!window.confirm("Are you sure you want to delete this venue?")) return;

        try {
            await axios.delete(`https://hall-pass-main-ea0ukq.laravel.cloud/api/venues/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            navigate("/pages/venues"); // Redirect after deletion
        } catch (err) {
            console.error("Error deleting venue:", err);
            setDeleteError("Failed to delete venue.");
        }
    };

    const handleDeleteHall = async (hallId) => {
        if (!window.confirm("Are you sure you want to delete this hall?")) return;

        try {
            await axios.delete(`https://hall-pass-main-ea0ukq.laravel.cloud/api/halls/${hallId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Remove deleted hall from state
            setVenue((prevVenue) => ({
                ...prevVenue,
                halls: prevVenue.halls.filter(hall => hall.id !== hallId)
            }));
        } catch (err) {
            console.error("Error deleting hall:", err);
            setHallDeleteError("Failed to delete hall.");
        }
    };

    if (loading) return <Loader size="lg" />;
    if (error) return <Alert color="red">{error}</Alert>;

    return (
        <div>
            <Text size={24} mb={5}>Venue Details</Text>
            <ul>
                <li><strong>Address:</strong> {venue.address_line_one}</li>
                <li><strong>Town:</strong> {venue.town}</li>
                <li><strong>County:</strong> {venue.county}</li>
                <li><strong>Eircode:</strong> {venue.eircode}</li>
                <li><strong>Description:</strong> {venue.description}</li>
                <li><strong>Contact:</strong> {venue.contact}</li>
            </ul>

            {deleteError && <Alert color="red">{deleteError}</Alert>}

            {roleId === 2 && (
                <>
                    <Button color="red" mt={10} onClick={handleDeleteVenue}>
                        Delete Venue
                    </Button>

                    <Link to={`/venues/${id}/edit`}>
                        <Button mt={10} variant="filled" ml={10} color="blue">
                            Edit Venue
                        </Button>
                    </Link>

                    <Link to={`/halls/create/${id}`}>
                        <Button mt={10} variant="filled" ml={10} color="blue">
                            Add a hall
                        </Button>
                    </Link>
                </>
            )}

            <Link to="/pages/venues">
                <Button mt={10} variant="outline" ml={10}>
                    Back to Venues
                </Button>
            </Link>

            {/* Display Halls */}
            <Text size={20} mt={20} mb={10}>Halls in this Venue</Text>
            {hallDeleteError && <Alert color="red">{hallDeleteError}</Alert>}

            {venue.halls && venue.halls.length > 0 ? (
                <div>
                    {venue.halls.map((hall) => (
                        <Card key={hall.id} shadow="sm" p="lg" mb={10}>
                            <Group position="apart">
                               
                                <Text><strong>Capacity:</strong> {hall.capacity}</Text>
                                <Text><strong>Price per Hour:</strong> €{hall.price_per_hour}</Text>
                            </Group>
                            <Group mt={10}>
                                <Link to={`/halls/${hall.id}`}>
                                    <Button variant="light" color="blue">View Hall</Button>
                                </Link>

                                {roleId === 2 && (
                                    <>
                                        <Link to={`/halls/${hall.id}/edit?venue_id=${id}`}>
                                            <Button variant="light" color="blue">
                                                Edit Hall
                                            </Button>
                                        </Link>

                                        <Button color="red" onClick={() => handleDeleteHall(hall.id)}>
                                            Delete Hall
                                        </Button>
                                    </>
                                )}
                            </Group>
                        </Card>
                    ))}
                </div>
            ) : (
                <Text color="gray">No halls available.</Text>
            )}
        </div>
    );
};

export default SingleVenue;
