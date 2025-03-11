import { useEffect, useState } from "react";
import axios from 'axios';
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../utils/useAuth";

const SingleVenue = () => {
    const { token } = useAuth();
    const [appointment, setAppointment] = useState(null);
    const [doctor, setDoctor] = useState(null);
    const [patient, setPatient] = useState(null);

    // Fetch the appointment ID from the URL params
    const { id } = useParams();

    useEffect(() => {
        // Fetch appointment details
        const fetchAppointment = async () => {
            try {
                const res = await axios.get(`https://fed-medical-clinic-api.vercel.app/appointments/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setAppointment(res.data);

                // Fetch doctor details
                if (res.data.doctor_id) {
                    const doctorRes = await axios.get(`https://fed-medical-clinic-api.vercel.app/doctors/${res.data.doctor_id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setDoctor(doctorRes.data);
                }

                // Fetch patient details
                if (res.data.patient_id) {
                    const patientRes = await axios.get(`https://fed-medical-clinic-api.vercel.app/patients/${res.data.patient_id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setPatient(patientRes.data);
                }
            } catch (err) {
                console.error("Error fetching appointment details:", err);
            }
        };

        fetchAppointment();
    }, [id, token]);

    if (!appointment || !doctor || !patient) {
        return 'Loading...';
    }

    return (
        <div>
            <h1>Appointment Details</h1>
            <ul>
                <li><strong>Appointment Date:</strong> {appointment.appointment_date}</li>
                <li><strong>Doctor:</strong> Dr. {doctor.first_name} {doctor.last_name}</li>
                <li><strong>Patient:</strong> {patient.first_name} {patient.last_name}</li>
            </ul>

            {/* Link to go back to appointments list or dashboard */}
            <Link to="/appointments">Back to Appointments</Link>
        </div>
    );
};

export default SingleVenue;
