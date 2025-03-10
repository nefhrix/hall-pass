import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../utils/useAuth";
import { useForm } from '@mantine/form';
import { TextInput, Select, Button, Text } from "@mantine/core";
import DatePicker from 'react-datepicker'; // Import react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Import the styles for react-datepicker

const CreateAppointment = () => {
    const { token, id } = useAuth();
    const navigate = useNavigate();

    const [appointmentDate, setAppointmentDate] = useState(null); // State to hold the selected date
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);

    const form = useForm({
        initialValues: {
            doctor_id: '',
            patient_id: '',
        },
        validate: {
            doctor_id: (value) => value ? null : 'Doctor selection is required',
            patient_id: (value) => value ? null : 'Patient selection is required',
        },
    });

    const handleSubmit = () => {
        // Convert the appointment date to a string in the required format
       

        // Add the formatted date to form values
        const data = { ...form.values, user_id: id };

        axios.post('https://fed-medical-clinic-api.vercel.app/appointments', data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                console.log(res.data);
                navigate(`/appointments/${res.data.id}`);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    useEffect(() => {
        // Fetch doctors
        axios.get('https://fed-medical-clinic-api.vercel.app/doctors', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                setDoctors(res.data);
            })
            .catch((err) => {
                console.error('Error fetching doctors:', err);
            });

        // Fetch patients
        axios.get('https://fed-medical-clinic-api.vercel.app/patients', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                setPatients(res.data);
            })
            .catch((err) => {
                console.error('Error fetching patients:', err);
            });
    }, [token]);

    return (
        <div>
            <Text size={24} mb={5}>Create an Appointment</Text>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                {/* React Datepicker for Appointment Date */}
                <DatePicker
                    selected={appointmentDate}
                    onChange={date => setAppointmentDate(date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select appointment date"
                />

                {/* Select Dropdown for Doctors */}
                <Select
                    label="Doctor"
                    withAsterisk
                    placeholder="Pick a doctor"
                    data={doctors.map((doctor) => ({ value: doctor.id, label: `${doctor.first_name} ${doctor.last_name}` }))}
                    {...form.getInputProps('doctor_id')}
                />

                {/* Select Dropdown for Patients */}
                <Select
                    label="Patient"
                    withAsterisk
                    placeholder="Pick a patient"
                    data={patients.map((patient) => ({ value: patient.id, label: `${patient.first_name} ${patient.last_name}` }))}
                    {...form.getInputProps('patient_id')}
                />

                <Button mt={10} type="submit">Submit</Button>
            </form>
        </div>
    );
};

export default CreateAppointment;
