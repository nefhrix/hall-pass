import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/useAuth";
import {
  Loader,
  Alert,
  Text,
  Button,
  Card,
  Group,
  Badge,
  Image,
  Stack,
  useMantineTheme,
  rem
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import Navbar from "../../components/Navbar";

const SingleHall = () => {
  const { token } = useAuth();
  const { hallId } = useParams();
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const [roleId, setRoleId] = useState(null);
  const [hall, setHall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [calendarRef, setCalendarRef] = useState(null);

  const fetchHall = async () => {
    try {
      const res = await axios.get(
        `https://hall-pass-main-ea0ukq.laravel.cloud/api/halls/${hallId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHall(res.data.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load hall details.");
      setLoading(false);
    }
  };

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

  useEffect(() => {
    fetchHall();
    fetchUserRole();
  }, [hallId, token]);

  if (loading) return <Loader size="lg" />;
  if (error) return <Alert color="red">{error}</Alert>;

  const events = hall.timeslots.map(slot => ({
    title: slot.status,
    start: `${slot.date}T${slot.start_time}`,
    end: `${slot.date}T${slot.end_time}`,
    backgroundColor: slot.status === "Available" ? "green" : "red",
    url: slot.status === "Available" ? `/venues/${hall.venue_id}/timeslots/${slot.id}/book` : "#"
  }));

  const nextAvailableSlot = hall.timeslots
    .filter(slot => slot.status === "Available")
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  const jumpToNextAvailable = () => {
    if (!calendarRef || !hall.timeslots.length) return;

    const calendarApi = calendarRef.getApi();
    const currentDate = calendarApi.getDate();

    const futureSlots = hall.timeslots
      .filter(slot => slot.status === "Available" && new Date(slot.date) > currentDate)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (futureSlots.length > 0) {
      calendarApi.gotoDate(futureSlots[0].date);
    } else {
      alert("No more available slots.");
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: 20 }}>
        <Link to={`/venues/${hall.venue_id}`}>
          <Button mb={25} variant="light">Back to Venue</Button>
        </Link>

        {isMobile ? (
          <Stack spacing="xl">
            <HallDetails hall={hall} roleId={roleId} />
            <CalendarSection
              events={events}
              calendarRef={calendarRef}
              setCalendarRef={setCalendarRef}
              nextAvailableSlot={nextAvailableSlot}
              jumpToNextAvailable={jumpToNextAvailable}
              navigate={navigate}
            />
          </Stack>
        ) : (
          <Group align="start" position="apart" grow wrap="nowrap" spacing="xl">
            <div style={{ flex: 2 }}>
              <HallDetails hall={hall} roleId={roleId} />
            </div>
            <Card mt="xs" shadow="sm" p="md" withBorder style={{ flex: 1, top: 45 }}>
              <CalendarSection
                events={events}
                calendarRef={calendarRef}
                setCalendarRef={setCalendarRef}
                nextAvailableSlot={nextAvailableSlot}
                jumpToNextAvailable={jumpToNextAvailable}
                navigate={navigate}
              />
            </Card>
          </Group>
        )}
      </div>
    </>
  );
};

const HallDetails = ({ hall, roleId }) => (
  <>
    <Text size="xl" fw={700} mb="xl">{hall.name || "Hall Details"}</Text>

    <Image
      radius="md"
      src={`https://fls-9ea28465-7423-46c3-b756-0811265ccb34.laravel.cloud/${hall.image}`}
      alt="Main hall image"
      width="100%"
      height={200}
      fit="cover"
      style={{ borderRadius: 12, marginBottom: 16 }}
    />

    <Card shadow="sm" p="lg" withBorder mb="lg">
      <h3>Hall Information :</h3>
      <ul>
        <li><strong>Capacity:</strong> {hall.capacity} people</li>
        <li><strong>Price per Hour:</strong> €{hall.price_per_hour}</li>
        <li><strong>Facilities:</strong> Toilets, Changing Rooms, Parking </li>
        <li><strong>Wheelchair Accessible:</strong> Yes </li>
        <li><strong>Sports Available:</strong> {hall.sports.length > 0 ? (
          hall.sports.map((sport, index) => (
            <Badge key={index} color="blue" mr={4}>{sport.sport}</Badge>
          ))
        ) : (
          <Text color="gray">No sports listed</Text>
        )}</li>
      </ul>

      <Group mt="md">
      {roleId === 2 && (
        <Link to={`/halls/${hall.id}/edit?venue_id=${hall.venue_id}`}>
          <Button variant="filled" color="blue">Edit Hall</Button>
        </Link>
         )}
         {roleId === 2 && (
          <Link to={`/venues/${hall.id}/timeslots/create`}>
            <Button variant="outline">Create Timeslot</Button>
          </Link>
        )}
      </Group>
    </Card>
  </>
);

const CalendarSection = ({ events, calendarRef, setCalendarRef, nextAvailableSlot, jumpToNextAvailable, navigate }) => (
  <>
    <FullCalendar
      ref={setCalendarRef}
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={events}
      height="auto"
      eventDisplay="block"
      headerToolbar={{
        left: "prevYear,prev,next,nextYear today",
        center: "title",
        right: "dayGridMonth,dayGridWeek,dayGridDay",
      }}
      validRange={{
        start: new Date().toISOString().split("T")[0],
      }}
      eventContent={({ event }) => (
        <div style={{
          padding: "5px",
          fontSize: "0.9rem",
          textAlign: "center",
          color: "white",
          borderRadius: "5px",
          backgroundColor: event.backgroundColor,
        }}>
          <strong>{event.startStr.slice(11, 16)} - {event.endStr.slice(11, 16)}</strong>
          <div>{event.title}</div>
        </div>
      )}
      eventClick={(info) => {
        if (info.event.url !== "#") {
          info.jsEvent.preventDefault();
          navigate(info.event.url);
        }
      }}
    />
    <Button
      mb="sm"
      color="blue"
      onClick={jumpToNextAvailable}
      disabled={!nextAvailableSlot}
      mt={25}
    >
      {nextAvailableSlot ? "Jump to Next Available Slot" : "No Available Slots"}
    </Button>
  </>
);

export default SingleHall;
