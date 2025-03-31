import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/useAuth";
import { Loader, Alert, Text, Button, Card, Group, Badge } from "@mantine/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

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
        .sort((a, b) => new Date(a.date) - new Date(b.date))[0]; //Converted to date objects for comparison czu its easier. a - b makes sure the earliest date comes first

    
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
        <div style={{ height: "100vh", padding: "20px" }}>
            <Text size={24} mb={5}>Hall Details</Text>
            <Card shadow="sm" p="lg" mb={20}>
                <ul>
                    <li><strong>Capacity:</strong> {hall.capacity} people</li>
                    <li><strong>Price per Hour:</strong> €{hall.price_per_hour}</li>
                    <li><strong>Sports Available:</strong></li>
                    <Group>
                        {hall.sports.length > 0 ? (
                            hall.sports.map((sport, index) => (
                                <Badge key={index} color="blue">{sport.sport}</Badge>
                            ))
                        ) : (
                            <Text color="gray">No sports listed</Text>
                        )}
                    </Group>
                </ul>
                <Link to={`/venues/${hall.venue_id}`}>
                    <Button mt={10} variant="outline">Back to Venue</Button>
                </Link>
            </Card>

            {/* Button to Jump to Next Available Time Slot */}
            <Button 
                mb={10} 
                color="blue" 
                onClick={jumpToNextAvailable}
                disabled={!nextAvailableSlot}
            >
                {nextAvailableSlot ? "Jump to Next Available Slot" : "No Available Slots"}
            </Button>

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
                        width: "100%",
                        display: "block",
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
        </div>
    );
};

export default SingleHall;
