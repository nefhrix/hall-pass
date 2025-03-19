import { useEffect, useState } from "react";
import axios from 'axios';
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/useAuth";
import { Loader, Alert, Text, Button } from "@mantine/core";

const SingleVenue = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();

    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);

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

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this venue?")) return;

        try {
            await axios.delete(`https://hall-pass-main-ea0ukq.laravel.cloud/api/venues/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            navigate("/venues"); // Redirect after deletion
        } catch (err) {
            console.error("Error deleting venue:", err);
            setDeleteError("Failed to delete venue.");
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

            <Button color="red" mt={10} onClick={handleDelete}>
                Delete Venue
            </Button>

            <Link to={`/venues/${id}/edit`}>
                <Button mt={10} variant="filled" ml={10} color="blue">
                    Edit Venue
                </Button>
            </Link>

            <Link to="/venues">
                <Button mt={10} variant="outline" ml={10}>
                    Back to Venues
                </Button>
            </Link>
        </div>
    );
};

export default SingleVenue;
