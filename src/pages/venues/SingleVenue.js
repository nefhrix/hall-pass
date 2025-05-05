import { useEffect, useState } from "react";
import axios from 'axios';
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/useAuth";
import { Loader, Alert, Text, Button, Card, Group, Image, Stack, Flex, Box } from "@mantine/core";
import Navbar from "../../components/Navbar";

const SingleVenue = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [venue, setVenue] = useState(null);
  const [roleId, setRoleId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [hallDeleteError, setHallDeleteError] = useState(null);

  const fetchUserRole = async () => {
    try {
      const res = await axios.get(`https://hall-pass-main-ea0ukq.laravel.cloud/api/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.roles.length > 0) {
        setRoleId(res.data.roles[0].id);
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

      navigate("/pages/venues");
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
    <>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <Group align="start" position="apart" grow wrap="nowrap" spacing="xl">
          <Stack spacing="md" style={{ width: "100%" }}>
            <Link to="/pages/venues">
              <Button mt={10} variant="light">
                Back to All Venues
              </Button>
            </Link>
            <Text size="xl" fw={700} mb="xs">{venue.address_line_one}</Text>

            <Flex
              direction={{ base: "column", md: "row" }}
              justify="space-between"
              align="stretch"
              gap="xl"
              wrap="wrap"
            >
              {/* Venue Image */}
              <Box style={{ flex: 1, width: "100%" }}>
                <Image
                  radius="md"
                  src={`https://fls-9ea28465-7423-46c3-b756-0811265ccb34.laravel.cloud/${venue.image}`}
                  alt="Main venue image"
                  height={300}
                  fit="cover"
                  w="100%"
                  style={{ objectFit: "cover", borderRadius: 12 }}
                />
              </Box>

              {/* Venue Info */}
              <Card
                shadow="sm"
                p="lg"
                withBorder
                style={{ flex: 1, width: "100%" }}
                mt={{ base: "md", md: 0 }}
              >
                <h3>Venue Information :</h3>
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
                      <Button mt={50} variant="filled" ml={25} color="dark">
                        Edit Venue
                      </Button>
                    </Link>

                    <Link to={`/halls/create/${id}`}>
                      <Button mt={10} variant="filled" ml={25} color="blue">
                        Add a hall
                      </Button>
                    </Link>
                  </>
                )}
              </Card>
            </Flex>

            {/* Halls List */}
            <div style={{ flex: 2 }}>
              <Card shadow="sm" p="lg" withBorder mb="lg">
                <h3>Halls in this Venue</h3>
                {hallDeleteError && <Alert color="red">{hallDeleteError}</Alert>}
                {venue.halls && venue.halls.length > 0 ? (
                  <div>
                    {venue.halls.map((hall) => (
                      <div key={hall.id} style={{ marginBottom: 10 }}>
                        <Link to={`/halls/${hall.id}`} style={{ textDecoration: 'none' }}>
                          <Card shadow="sm" p="lg">
                            <Group position="apart" style={{ flexWrap: 'wrap' }}>
                              <Text><strong>Capacity:</strong> {hall.capacity}</Text>
                              <Text><strong>Hall Name:</strong> {hall.name}</Text>
                              <Text><strong>Price per Hour:</strong> €{hall.price_per_hour}</Text>
                            </Group>
                            <Group mt={10} position="apart" style={{ flexWrap: 'wrap' }}>
                              {roleId === 2 && (
                                <>
                                  <div>
                                    <Link to={`/halls/${hall.id}/edit?venue_id=${id}`}>
                                      <Button variant="filled" color="dark">
                                        Edit Hall
                                      </Button>
                                    </Link>
                                    <Button color="red" ml={25} onClick={() => handleDeleteHall(hall.id)}>
                                      Delete Hall
                                    </Button>
                                  </div>
                                  <Link to={`/venues/${hall.id}/timeslots/create`}>
                                    <Button variant="filled" color="blue">{`Create Timeslot For ${hall.name}`}</Button>
                                  </Link>
                                </>
                              )}
                            </Group>
                          </Card>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Text color="gray">No halls available.</Text>
                )}
              </Card>
            </div>
          </Stack>
        </Group>
      </div>
    </>
  );
};

export default SingleVenue;
