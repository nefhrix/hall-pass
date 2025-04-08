import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../utils/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import {Container,TextInput,Button,Text,Flex,SimpleGrid,Group,Divider,Badge} from "@mantine/core";
import VenueCard from "../../components/VenueCard";
import Navbar from "../../components/Navbar"; 
import { FaFutbol, FaTableTennis, FaBaseballBall, FaVolleyballBall} from 'react-icons/fa'; 

const sportIcons = {
  Basketball: <FaBaseballBall size={19} />,
  Football: <FaFutbol size={19} />,
  Volleyball: <FaVolleyballBall size={19} />,
  Badminton: <FaTableTennis size={19} />

};

const Home = () => {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleId, setRoleId] = useState(null);
  const [selectedSport, setSelectedSport] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();
  const msg = useLocation()?.state?.msg || null;

  const fetchUserRole = async () => {
    try {
      const res = await axios.get(`https://hall-pass-main-ea0ukq.laravel.cloud/api/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.roles.length > 0) {
        setRoleId(res.data.roles[0].id);
      }
    } catch (err) {
      console.error("Error fetching user role:", err);
    }
  };

  const getVenues = async () => {
    if (!roleId) return;

    let url = `/api/venues`;
    if (roleId === 2) url = `/api/userVenues`;

    try {
      const res = await axios.get(`https://hall-pass-main-ea0ukq.laravel.cloud${url}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVenues(res.data.data);
      setFilteredVenues(res.data.data);
    } catch (e) {
      console.error("Error fetching venues:", e.response?.data || e);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    applyFilters(query, selectedSport);
  };

  const handleSportFilter = (sport) => {
    const newSport = selectedSport === sport ? null : sport; 
    setSelectedSport(newSport);
    applyFilters(searchQuery, newSport);
  };

  const applyFilters = (query, sport) => {
    let filtered = [...venues];

    if (query) {
      const lower = query.toLowerCase();
      filtered = filtered.filter((v) =>
        v.description.toLowerCase().includes(lower)
      );
    }

    if (sport) {
      filtered = filtered.filter((venue) =>
        venue.halls.some((hall) =>
          hall.sports.some((s) => s.sport === sport)
        )
      );
    }

    setFilteredVenues(filtered);
  };

  useEffect(() => {
    if (token) fetchUserRole();
  }, [token]);

  useEffect(() => {
    if (roleId !== null) getVenues();
  }, [roleId]);

  const allSports = Array.from(
    new Set(
      venues.flatMap((venue) =>
        venue.halls.flatMap((hall) => hall.sports.map((s) => s.sport))
      )
    )
  );

  return (
    <>
      <Navbar searchBar={<TextInput placeholder="Search venues..." value={searchQuery}  onChange={(e) => handleSearch(e.target.value)} size="lg" style={{ width: "60%" }}/>}/>
      <Container fluid py="xl" px="xl">
        {msg && (
          <Text mb="md" color="red" align="center" fw={500}>
            {msg}
          </Text>
        )}

<Group
  position="center"
  spacing="xs"
  mb="m"
  mt="sm"
  style={{
    display: "flex",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
    width: "100%",
  }}
>
  {allSports.map((sport) => (
    <Badge key={sport} size="md" variant={selectedSport === sport ? "filled" : "light"} color={selectedSport === sport ? "yellow" : "gray"} onClick={() => handleSportFilter(sport)} style={{cursor: "pointer", display: "flex", alignItems: "center", fontSize: "1.2rem", padding: "15px", border: "1px solid", borderColor: selectedSport === sport ? "yellow" : "gray", borderRadius: "8px", transition: "background-color 0.3s, transform 0.2s", }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = "#f0f0f0";
        e.target.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = "";
        e.target.style.transform = "";
      }}
    >
      <span style={{ verticalAlign: "middle" }}>{sportIcons[sport]}</span>
      <span style={{ marginLeft: "10px" }}>{sport}</span>
    </Badge>
  ))}
</Group>





        {roleId === 2 && (
          <Flex justify="center" mb="lg">
            <Button onClick={() => navigate("/venues/create")} color="teal" size="md">
              + Add New Venue
            </Button>
          </Flex>
        )}

        <Divider my="md" />

        {filteredVenues.length === 0 ? (
          <Text align="center">
            No venues found. {roleId === 2 ? "Create a new one!" : ""}
          </Text>
        ) : (
          <SimpleGrid
            cols={4}
            spacing="xl"
            breakpoints={[
              { maxWidth: 1600, cols: 3 },
              { maxWidth: 1200, cols: 2 },
              { maxWidth: 768, cols: 1 },
            ]}
          >
            {filteredVenues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </SimpleGrid>
        )}
      </Container>
    </>
  );
};


export default Home