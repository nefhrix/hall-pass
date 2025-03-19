import { useEffect, useState } from "react";
import axios from 'axios';
import { useAuth } from "../../utils/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, SimpleGrid, Button, Text, Flex } from "@mantine/core";

const Home = () => {
    const [venues, setVenues] = useState([]); // State for storing venue data
    const { token } = useAuth(); // Get token from the useAuth hook
    const navigate = useNavigate();

    // Message from ProtectedRoute redirection, if any
    const msg = useLocation()?.state?.msg || null;

    // Fetch all venues with auth headers
    const getVenues = async () => {

        let url = `/api/venues`;
        // if(role === 2){
        //     url = `/api/venues/user`;
        // }

        try {
            const res = await axios.get(`https://hall-pass-main-ea0ukq.laravel.cloud${url}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Adding auth header
                }
            });
            setVenues(res.data.data);
        
        } catch (e) {
            console.error("Error fetching Venues:", e);
        }
    };

    // public function getUserVenues(){

    //     $venues = Venues::where('user_id', '=', Auth::id());
    //     return venues;
    // }

    // Fetch venues on component mount
    useEffect(() => {
        getVenues();
    }, [token]);

    if (!venues.length) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {msg && <Text mb={10} color="red">{msg}</Text>}
            <Button mb={10} onClick={() => navigate('/venues/create')}>Add New Venue</Button>
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
                            {/* {(role === 2) ? (
                                <>
                                <button onClick={() => navigate(`/venues/edit/${venue.id}`)}>Edit</button>
                           </>
                            ) : ""} */}
                        </Flex>
                    </Card>
                ))}
            </SimpleGrid>
        </div>
    );
};

export default Home;