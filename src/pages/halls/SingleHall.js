import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/useAuth";
import { Loader, Alert, Text, Button, Card, Group, Badge, Image, Flex, Center } from "@mantine/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import Navbar from "../../components/Navbar";

const SingleHall = () => {
    const { token } = useAuth();
    const { hallId } = useParams();
    const navigate = useNavigate();

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
            console.log(res.data.data)
            setLoading(false);
        } catch (err) {
            console.error("Error fetching hall details:", err);
            setError("Failed to load hall details.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHall();
    }, [hallId, token]);

    if (loading) return <Loader size="lg" />;
    if (error) return <Alert color="red">{error}</Alert>;

    // Convert timeslot data to FullCalendar format
    const events = hall.timeslots.map(slot => ({
        title: slot.status,
        start: `${slot.date}T${slot.start_time}`,
        end: `${slot.date}T${slot.end_time}`,
        backgroundColor: slot.status === "Available" ? "green" : "red",
        url: slot.status === "Available" ? `/venues/${hall.venue_id}/timeslots/${slot.id}/book` : "#"
    }));


    const nextAvailableSlot = hall.timeslots
        .filter(slot => slot.status === "Available") //Filter by avaliable status timeslots
        .sort((a, b) => new Date(a.date) - new Date(b.date))[0]; //Converted to date objects for comparison cuz its easier. a - b makes sure the earliest date comes first


    // const jumpToNextAvailable = () => {
    //     if (nextAvailableSlot && calendarRef) {
    //         calendarRef.getApi().gotoDate(nextAvailableSlot.date); //calendar ref api makes sure i can use the fullcalendar api methods. gotoDate is a method which changes the calendar view to the date of nextAvaliableTimeslot
    //     }
    // };

    const jumpToNextAvailable = () => {
        if (!calendarRef || !hall.timeslots.length) return;

        const calendarApi = calendarRef.getApi();
        const currentDate = calendarApi.getDate(); // Get the current view date

        // Find next available slot after the current date
        const futureSlots = hall.timeslots
            .filter(slot => slot.status === "Available" && new Date(slot.date) > currentDate) //same code as the next avaliable slot except im checking to see if the next slots date is in the  future (i.e NOT this current slot that its already jumped to)
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        if (futureSlots.length > 0) {
            calendarApi.gotoDate(futureSlots[0].date); // Jump to the next available slot
        } else {
            alert("No more available slots.");
        }
    };


    return (
      <>
      <Navbar />
        <div style={{ padding: "20px" }}>
          <Group align="start" position="apart" grow wrap="nowrap" spacing="xl">
            
           
            <div style={{ flex: 2 }}>
              <Text size="xl" fw={700} mb="xs">{hall.name || "Hall Details"}</Text>
      
          
              <Group spacing="xs" mb="lg">
                <Image
                  radius="md"
                  src={`https://fls-9ea28465-7423-46c3-b756-0811265ccb34.laravel.cloud/${hall.image}`}
                  alt="Main hall image"
                  width="100%"
                  height={400}
                  fit="cover"
                  style={{ borderRadius: 12 }}
                />
              </Group>
      
            
              <Card shadow="sm" p="lg" withBorder mb="lg">
                <h3>Hall Information :</h3>
                <ul>
                
                  <li><strong>Capacity:</strong> {hall.capacity} people</li>
                  <li><strong>Price per Hour:</strong> €{hall.price_per_hour}</li>
                  <li><strong>Facilities:</strong> Toilets, Changing Rooms, Parking </li>
                  <li><strong>WheelChair Accessible:</strong> Yes </li>
                  <li><strong>Sports Available:</strong>  {hall.sports.length > 0 ? (
                    hall.sports.map((sport, index) => (
                      <Badge key={index} color="blue">{sport.sport}</Badge>
                    ))
                  ) : (
                    <Text color="gray">No sports listed</Text>
                  )} </li>
                </ul>
      
               
      
                <Group mt="md">
                  <Link to={`/halls/${hall.id}/edit?venue_id=${hall.venue_id}`}>
                    <Button variant="filled" color="blue">Edit Hall</Button>
                  </Link>
                  <Link to={`/venues/${hall.venue_id}`}>
                    <Button variant="outline">Back to Venue</Button>
                  </Link>
                  <Link to={`/venues/${hall.id}/timeslots/create`}>
                    <Button variant="outline">Create Timeslot</Button>
                  </Link>
                </Group>
              </Card>
      
           
              <Button
                mb="sm"
                color="blue"
                onClick={jumpToNextAvailable}
                disabled={!nextAvailableSlot}
              >
                {nextAvailableSlot ? "Jump to Next Available Slot" : "No Available Slots"}
              </Button>
            </div>
      
           
            <Card shadow="sm" p="md" withBorder style={{ flex: 1, top: 45, height: "fit-content" }}>
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
            </Card>
          </Group>
        </div>
        </>
      );
      
};

export default SingleHall;
