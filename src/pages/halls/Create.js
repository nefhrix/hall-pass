import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../utils/useAuth";
import { useForm } from "@mantine/form";
import { TextInput, Button, NumberInput, MultiSelect, Text, Container, Stack } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import Navbar from "../../components/Navbar";

const CreateHall = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams(); // Venue ID from URL

    const sportsOptions = [
        { value: 1, label: "Football" },
        { value: 2, label: "Basketball" },
        { value: 3, label: "Volleyball" },
        { value: 4, label: "Badminton" },
    ];

    const [venueId, setVenueId] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const form = useForm({
        initialValues: {
            venue_id: "",
            name: "",
            capacity: 0,
            price_per_hour: 0,
            sports: [],
        },
        validate: {
            venue_id: (value) => (value ? null : "Venue ID is required"),
            name: (value) => (value.trim() ? null : "Hall name is required"),
            capacity: (value) => (value > 0 ? null : "Capacity must be greater than 0"),
            price_per_hour: (value) => (value >= 0 ? null : "Price must be 0 or more"),
        },
    });

    useEffect(() => {
        if (!id) {
            console.error("No valid venue ID provided.");
            return;
        }

        axios
            .get(`https://hall-pass-main-ea0ukq.laravel.cloud/api/venues/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                const venueID = Number(res.data.data.id);
                setVenueId(venueID);
                form.setFieldValue("venue_id", venueID);
            })
            .catch((err) => {
                console.error("Error fetching venue details:", err);
            });
    }, [id, token]);

    const handleSubmit = () => {
        const formData = new FormData();
        formData.append("venue_id", Number(form.values.venue_id));
        formData.append("name", form.values.name.trim());
        formData.append("capacity", Number(form.values.capacity));
        formData.append("price_per_hour", Number(form.values.price_per_hour));
        form.values.sports.forEach((sport) => {
            formData.append("sports[]", Number(sport));
        });

        if (imageFile) {
            formData.append("image", imageFile);
        }

        axios
            .post("https://hall-pass-main-ea0ukq.laravel.cloud/api/halls", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            })
            .then(() => {
                navigate(`/venues/${id}`);
            })
            .catch((err) => {
                console.error("API Error:", err.response?.data || err.message);
            });
    };

    return (
        <>
        <Navbar />
        <Container size="md" p="sm">
            <h1>Create a Hall</h1>
            <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack spacing="md">
                <TextInput
                    label="Hall Name"
                    withAsterisk
                    placeholder="Enter hall name"
                    {...form.getInputProps("name")}
                />
                <TextInput
                    label="Venue ID"
                    withAsterisk
                    placeholder="Fetching Venue ID..."
                    {...form.getInputProps("venue_id")}
                    style={{ display: "none" }}
                />
                <NumberInput
                    label="Capacity"
                    withAsterisk
                    placeholder="Enter Capacity"
                    {...form.getInputProps("capacity")}
                />
                <NumberInput
                    label="Price per Hour"
                    withAsterisk
                    placeholder="Enter Price per Hour"
                    {...form.getInputProps("price_per_hour")}
                />
                <MultiSelect
                    label="Sports"
                    data={sportsOptions.map((option) => ({
                        value: option.value.toString(),
                        label: option.label,
                    }))}
                    placeholder="Select sports"
                    {...form.getInputProps("sports")}
                />

                {/* Image Upload */}
                <Text size="sm" mt={10}>
                    Upload Image:
                </Text>
                <Dropzone
                    onDrop={(files) => setImageFile(files[0])}
                    onReject={() => console.error("File rejected")}
                    maxSize={3 * 1024 ** 2} // 3MB max file size
                    accept={IMAGE_MIME_TYPE}
                    multiple={false}
                    mt={10}
                >
                    {() => (
                        <Text align="center">
                            Drag an image here or click to select a file (Max: 3MB)
                        </Text>
                    )}
                </Dropzone>

                {/* Show selected image name */}
                {imageFile && (
                    <Text size="sm" color="green" mt={5}>
                        Selected: {imageFile.name}
                    </Text>
                )}

                <Button mt={10} type="submit">
                    Submit
                </Button>
                </Stack>
            </form>
        </Container>
        </>
    );
};

export default CreateHall;
