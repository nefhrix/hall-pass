

import { Card, Title, Text, Badge, Image, Flex } from "@mantine/core";
import { useNavigate } from "react-router-dom";


const sportColors = {
  Basketball: "orange",
  Football: "green",
  Volleyball: "red",
  Badminton: "blue",
};

const VenueCard = ({ venue }) => {
  const navigate = useNavigate();
  const displayedSports = new Set();

  const handleClick = () => {
    navigate(`/venues/${venue.id}`);
  };

  return (
    <Card
      onClick={handleClick}
      radius="lg"
      shadow="sm"
      withBorder
      style={{
        height: 440,
        padding: 16,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "box-shadow 0.3s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.08)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)")}
    >
      <Card.Section mb="md" style={{ borderRadius: 12, overflow: "hidden" }}>
      <Image
  src={`https://fls-9e923d8a-ed6d-4a5e-88eb-9bb073742a2c.laravel.cloud/${venue.image}`} 
  height={200} 
  fit="cover" 
  alt="Venue"
/>

      </Card.Section>

      <Title order={5} mb={6}>
        {venue.description}
      </Title>

      <Text size="sm" color="dimmed" mb={8}>
        {venue.address_line_one}, {venue.town}, {venue.county}
        <br />
        Eircode: {venue.eircode}
        <br />
        Contact: {venue.contact}
      </Text>

      {venue.halls.length > 0 && (
        <>
          <Text size="xs" weight={500} mb={4}>
            Sports:
          </Text>
          <Flex wrap="wrap" gap={6}>
            {venue.halls.map((hall) =>
              hall.sports.map((sport) => {
                if (!displayedSports.has(sport.sport)) {
                  displayedSports.add(sport.sport);
                  const color = sportColors[sport.sport] || sportColors.Default;
                  return (
                    <Badge
                      key={`${hall.id}-${sport.id}`}
                      size="sm"
                      color={color}
                      radius="sm"
                      variant="light"
                    >
                      {sport.sport}
                    </Badge>
                  );
                }
                return null;
              })
            )}
          </Flex>
        </>
      )}
    </Card>
  );
};

export default VenueCard;
