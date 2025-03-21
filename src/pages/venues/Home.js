import { useEffect, useState } from "react";
import axios from 'axios';
import { useAuth } from "../../utils/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, SimpleGrid, Button, Text, Flex } from "@mantine/core";

const Home = () => {
    const [venues, setVenues] = useState([]);
    const [roleId, setRoleId] = useState(null);
    const { token } = useAuth();
    const navigate = useNavigate();
    const msg = useLocation()?.state?.msg || null;

    // Fetch user role
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

    // Fetch venues based on user role
    const getVenues = async () => {
        if (roleId === null) return; // Ensure role is set

        let url = `/api/venues`; // Default for role 1
        if (roleId === 2) {
            url = `/api/userVenues`; // Fetch only user-specific venues
        }

        console.log(`Fetching venues from: https://hall-pass-main-ea0ukq.laravel.cloud${url}`);

        try {
            const res = await axios.get(`https://hall-pass-main-ea0ukq.laravel.cloud${url}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setVenues(res.data.data);
        } catch (e) {
            console.error("Error fetching venues:", e.response?.data || e);
        }
    };

    useEffect(() => {
        if (token) {
            fetchUserRole();
        }
    }, [token]);

    useEffect(() => {
        if (roleId !== null) {
            getVenues();
        }
    }, [roleId]);

    return (
        <div>
            {msg && <Text mb={10} color="red">{msg}</Text>}

            {/* Always show "Add New Venue" button for role 2, even if no venues */}
            {roleId === 2 && (
                <Button mb={10} onClick={() => navigate('/venues/create')}>
                    Add New Venue
                </Button>
            )}

            {/* Show message if no venues are available */}
            {venues.length === 0 ? (
                <Text>No venues available. {roleId === 2 ? "Create a new one!" : ""}</Text>
            ) : (
                <SimpleGrid cols={3}>
                    {venues.map((venue) => (
                        <Card
                            key={venue.id}
                            shadow="sm"
                            component={Flex}
                            justify="space-between"
                            direction="column"
                        >
                            <h2>{venue.description}</h2>
                            <ul>
                                <li>Address: {venue.address_line_one}, {venue.town}, {venue.county}</li>
                                <li>Eircode: {venue.eircode}</li>
                                <li>Contact: {venue.contact}</li>
                            </ul>
                            <Flex w="100%" justify="space-between">
                                <button onClick={() => navigate(`/venues/${venue.id}`)}>View</button>
                            </Flex>
                        </Card>
                    ))}
                </SimpleGrid>
            )}
        </div>
    );
};

export default Home;
