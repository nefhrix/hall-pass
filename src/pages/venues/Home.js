import { useEffect, useState } from "react";
import axios from 'axios';
import { useAuth } from "../../utils/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, SimpleGrid, Button, Text, Flex, TextInput, Badge } from "@mantine/core";

const Home = () => {
    const [venues, setVenues] = useState([]);  // All venues from API
    const [filteredVenues, setFilteredVenues] = useState([]); // Venues after filtering
    const [searchQuery, setSearchQuery] = useState("");  // Search input state
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
        if (roleId === null) return; 

        let url = `/api/venues`; 
        if (roleId === 2) {
            url = `/api/userVenues`; // Fetch only user-specific venues
        }

        console.log(`Fetching venues from: https://hall-pass-main-ea0ukq.laravel.cloud${url}`);

        try {
            const res = await axios.get(`https://hall-pass-main-ea0ukq.laravel.cloud${url}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setVenues(res.data.data);
            setFilteredVenues(res.data.data); // Initially show all venues
        } catch (e) {
            console.error("Error fetching venues:", e.response?.data || e);
        }
    };

    // Filter venues based on search input
    const handleSearch = (query) => {
        setSearchQuery(query);

        if (!query) {
            setFilteredVenues(venues); // Show all venues if input is empty
        } else {
            const lowerCaseQuery = query.toLowerCase();
            const filtered = venues.filter(venue =>
                venue.description.toLowerCase().includes(lowerCaseQuery)
            );
            setFilteredVenues(filtered);
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

            {/* Always show "Add New Venue" button for role 2 */}
            {roleId === 2 && (
                <Button mb={10} onClick={() => navigate('/venues/create')} color="teal" size="lg" fullWidth>
                    Add New Venue
                </Button>
            )}

            {/* Search Bar for Filtering Venues */}
            <TextInput
                placeholder="Search venues..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                mb={10}
            />

            {/* Show message to create new venue if none are available */}
            {filteredVenues.length === 0 ? (
                <Text>No venues found. {roleId === 2 ? "Create a new one!" : ""}</Text>
            ) : (
                <SimpleGrid cols={3}>
                    {filteredVenues.map((venue) => {
                        // To store the unique sports for this venue
                        const displayedSports = new Set(); //sets are objects which are collections of values but the value can only occur one time, its unique. I'm glad I found out about this because it is perfectly what I needed to check all the halls for sports and only display it one time even if both halls have a certain sport. Before it looked pretty bad as it displayed a certain sport multiple times as a badge if multiple halls had that sport

                        return (
                            <Card
                                key={venue.id}
                                shadow="sm"
                                component={Flex}
                                justify="space-between"
                                direction="column"
                                style={{ position: "relative" }}
                            >
                                <h2>{venue.description}</h2>
                                <ul>
                                    <li>Address: {venue.address_line_one}, {venue.town}, {venue.county}</li>
                                    <li>Eircode: {venue.eircode}</li>
                                    <li>Contact: {venue.contact}</li>
                                    {venue.image}
                                    {venue.halls.length > 0 && (
                                        <li>
                                            Sports Available:
                                            <Flex mt={5}>
                                                {venue.halls.map((hall) =>
                                                    hall.sports.map((sport) => {
                                                        // Check if the sport has already been displayed
                                                        if (!displayedSports.has(sport.sport)) {
                                                            displayedSports.add(sport.sport); // Mark sport as displayed
                                                            return (
                                                                <Badge key={sport.id} color="teal" m={2} size="lg">
                                                                    {sport.sport}
                                                                </Badge>
                                                            );
                                                        }
                                                        return null; // Return null if sport is already displayed
                                                    })
                                                )}
                                            </Flex>
                                        </li>
                                    )}
                                </ul>
                                <Flex w="100%" justify="space-between" mt="auto">
                                    <Button 
                                        variant="outline" 
                                        color="blue" 
                                        size="sm" 
                                        onClick={() => navigate(`/venues/${venue.id}`)} 
                                        style={{ width: "100%" }}
                                    >
                                        View Venue
                                    </Button>
                                </Flex>
                            </Card>
                        );
                    })}
                </SimpleGrid>
            )}
        </div>
    );
};

export default Home;
