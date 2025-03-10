import { useEffect, useState } from "react";
import axios from 'axios';
import { useAuth } from "../../utils/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, SimpleGrid, Button, Text, Flex } from "@mantine/core";

const Home = () => {
    const [appointments, setAppointments] = useState([]); // State for storing appointments data
    const [doctors, setDoctors] = useState([]); // State for storing doctor data
    const [patients, setPatients] = useState([]); // State for storing patient data
    const { token } = useAuth(); // Get token from the useAuth hook
    const navigate = useNavigate();

    // Message from ProtectedRoute redirection, if any
    const msg = useLocation()?.state?.msg || null;

    //get all Appointments with auth headers
 
    const getAppointments = async () => {
        try {
            const res = await axios.get(`https://fed-medical-clinic-api.vercel.app/appointments/`, {
                headers: {
                    Authorization: `Bearer ${token}` // Adding auth header
                }
            });
            setAppointments(res.data); 
        } catch (e) {
            console.error("Error fetching Appointments:", e);
        }
    };
    
    //get all Doctors with auth headers
    const getDoctors = async () => {
        try {
            const res = await axios.get(`https://fed-medical-clinic-api.vercel.app/doctors/`, {
                headers: {
                    Authorization: `Bearer ${token}` // Adding auth header
                }
            });
            setDoctors(res.data); 
        } catch (e) {
            console.error("Error fetching Doctors:", e);
        }
    };

    //get all Patients with auth headers
    const getPatients = async () => {
        try {
            const res = await axios.get(`https://fed-medical-clinic-api.vercel.app/patients/`, {
                headers: {
                    Authorization: `Bearer ${token}` // Adding auth header
                }
            });
            setPatients(res.data); // Store patients' data
        } catch (e) {
            console.error("Error fetching Patients:", e);
        }
    };

 

    //get Appointments, Doctors, and Patients on component mount
    useEffect(() => {
        const fetchData = async () => {
            await getAppointments(); // Get appointment data
            await getDoctors(); // Get doctor data
            await getPatients(); // Get patient data
        };

        fetchData();
    }, [token]);

    if (!appointments.length || !doctors.length || !patients.length) {
        return <div>Loading...</div>;
    }

    // Function to get doctor's name by ID
    const getDoctorNameById = (doctorId) => {
        const doctor = doctors.find(doc => doc.id === doctorId);
        return doctor ? doctor.first_name : "Unknown Doctor"; 
    };

    // Function to get patient's name by ID
    const getPatientNameById = (patientId) => {
        const patient = patients.find(pat => pat.id === patientId);
        return patient ? `${patient.first_name} ${patient.last_name}` : "Unknown Patient"; 
    };

    return (
        <div>
            {msg && <Text mb={10} color="red">{msg}</Text>}
            <Button mb={10} onClick={() => navigate('/appointments/create')}>Book an Appointment</Button>
            <SimpleGrid cols={3}>
                {appointments.map((appointment) => (
                    <Card
                        key={appointment.id}
                        shadow="sm"
                        component={Flex}
                        justify="space-between"
                        direction="column"
                    >
                        <h2>Appointment ID: {appointment.id}</h2>
                        <ul>
                            <li>
                                Appointment Date: {appointment.appointment_date}
                            </li>
                            <li>
                                Patient: {getPatientNameById(appointment.patient_id)}
                            </li>
                            <li>
                                Doctor: Dr. {getDoctorNameById(appointment.doctor_id)}
                            </li>
                        </ul>
                        <Flex w="100%" justify="space-between">
                            <button onClick={() => navigate(`/appointments/${appointment.id}`)}>View</button>
                        </Flex>
                    </Card>
                ))}
            </SimpleGrid>
        </div>
    );
};

export default Home;
