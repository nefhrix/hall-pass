import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useAuth } from "../../utils/useAuth";
import { useForm } from "@mantine/form";
import { Text, TextInput, Select, Button } from "@mantine/core";

const Edit = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();

    const specialisations = [
        "Podiatrist",
        "Dermatologist",
        "Pediatrician",
        "Psychiatrist",
        "General Practitioner"
    ];

    // Mantine form hook for managing form state and validation
    const form = useForm({
        initialValues: {
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            specialisation: ""
        },
        validate: {
            first_name: (value) => (value ? null : "First name is required"),
            last_name: (value) => (value ? null : "Last name is required"),
            email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
            phone: (value) => (value ? null : "Phone is required"),
            specialisation: (value) => (value ? null : "Specialisation is required")
        }
    });

    useEffect(() => {
        axios.get(`https://fed-medical-clinic-api.vercel.app/doctors/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                
                form.setValues(res.data); // Populate the form with the existing data
            })
            .catch((err) => {
                console.error("Failed to load doctor details:", err);
            });
    }, [id, token]);

    const handleSubmit = (values) => {
   
        axios.patch(`https://fed-medical-clinic-api.vercel.app/doctors/${id}`, values, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
              
                navigate(`/doctors/${id}`, { replace: true });
            })
            .catch((err) => {
                console.error("Failed to update doctor:", err);
            });
    };

    return (
        <div>
            <Text size={24} mb={5}>Edit Doctor</Text>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                    withAsterisk
                    label="First name"
                    name="first_name"
                    {...form.getInputProps("first_name")}
                />
                <TextInput
                    withAsterisk
                    label="Last name"
                    name="last_name"
                    {...form.getInputProps("last_name")}
                />
                <Select
                    withAsterisk
                    name="specialisation"
                    label="Specialisation"
                    placeholder="Pick one"
                    data={specialisations.map((spec) => ({ value: spec, label: spec }))}
                    {...form.getInputProps("specialisation")}
                />
                <TextInput
                    withAsterisk
                    label="Email"
                    name="email"
                    {...form.getInputProps("email")}
                />
                <TextInput
                    withAsterisk
                    label="Phone"
                    name="phone"
                    {...form.getInputProps("phone")}
                />
                <Button mt={10} type="submit">Save Changes</Button>
            </form>
        </div>
    );
};

export default Edit;
