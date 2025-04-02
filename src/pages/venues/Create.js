import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../utils/useAuth";
import { useForm } from '@mantine/form';
import { TextInput, Button, NumberInput, MultiSelect, Text } from "@mantine/core";
import { showNotification } from '@mantine/notifications';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconPlus, IconTrash } from '@tabler/icons-react';

const CreateVenue = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [hallImage, setHallImage] = useState(null);
    const [venueimage, setVenueImage] = useState(null);
    const [halls, setHalls] = useState([]);

    const sportsOptions = [
        { value: 1, label: "Football" },
        { value: 2, label: "Basketball" },
        { value: 3, label: "Volleyball" },
        { value: 4, label: "Badminton" },
    ];

    useEffect(() => {
        axios.get('https://hall-pass-main-ea0ukq.laravel.cloud/api/user', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => setUserId(res.data.id))
            .catch((err) => console.error('Error fetching user ID:', err.response?.data || err));
    }, [token]);

    const form = useForm({
        initialValues: {
            address_line_one: '',
            town: '',
            county: '',
            eircode: '',
            description: '',
            contact: '',
            halls : [{}],
        },
    });

    const addHall = () => {
        setHalls([...halls, { name: '', capacity: 0, price_per_hour: 0, sports: [], hallImage: null }]);
    };

    const updateHall = (index, field, value) => {
        const updatedHalls = halls.map((hall, i) => (i === index ? { ...hall, [field]: value } : hall));
        setHalls(updatedHalls);
    };

    const removeHall = (index) => {
        setHalls(halls.filter((_, i) => i !== index)); //_ is the current item in the halls array but im not using it here so its just an underscore (common placeholder)
    };

    const handleSubmit = async () => {
       
        if (!userId) return;
    
        const formData = new FormData();
        formData.append('user_id', userId);
        Object.entries(form.values).forEach(([key, value]) => formData.append(key, value));
    
        // Append the venue image if it exists
        if (venueimage) {
            formData.append('venueImage', venueimage);
        }
    
        halls.forEach((hall, index) => {
            formData.append(`halls[${index}][name]`, hall.name);
            formData.append(`halls[${index}][capacity]`, hall.capacity);
            formData.append(`halls[${index}][price_per_hour]`, hall.price_per_hour);
            hall.sports.forEach((sport, sportIndex) => {
                formData.append(`halls[${index}][sports][${sportIndex}]`, sport);
            });
            if (hall.hallImage) {
                formData.append(`halls[${index}][hallImage]`, hall.hallImage);
            }
        });
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
        
        try {
            await axios.post('https://hall-pass-main-ea0ukq.laravel.cloud/api/venues', formData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
            });
    
            showNotification({ title: 'Success', message: 'Venue created successfully!', color: 'green' });
            navigate('/userVenues');
        } catch (err) {
            console.error("Error creating venue:", err.response?.data || err);
        }
    };
    
    

    return (
        <div>
            <Text size={24} mb={5}>Create a Venue</Text>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput label="Address Line One" withAsterisk {...form.getInputProps('address_line_one')} />
                <TextInput label="Town" withAsterisk {...form.getInputProps('town')} />
                <TextInput label="County" withAsterisk {...form.getInputProps('county')} />
                <TextInput label="Eircode" withAsterisk {...form.getInputProps('eircode')} />
                <TextInput label="Description" withAsterisk {...form.getInputProps('description')} />
                <TextInput label="Contact" withAsterisk {...form.getInputProps('contact')} />

                <Dropzone mt={10} onDrop={(files) => setVenueImage(files[0])} accept={IMAGE_MIME_TYPE} maxFiles={1}>
                    {venueimage ? <Text>{venueimage.name}</Text> : <Text>Drop venue image here or click to select</Text>}
                </Dropzone>

                <Text size={20} mt={20} mb={10}>Halls</Text>
                {halls.map((hall, index) => (
                    <div key={index} style={{ border: '1px solid #ddd', padding: 10, marginBottom: 10, borderRadius: 5 }}>
                        <TextInput label="Hall Name" withAsterisk placeholder="Enter hall name" value={hall.name} onChange={(e) => updateHall(index, 'name', e.target.value)} />
                        <NumberInput label="Capacity" withAsterisk placeholder="Enter Capacity" value={hall.capacity} onChange={(value) => updateHall(index, 'capacity', value)} />
                        <NumberInput label="Price per Hour" withAsterisk placeholder="Enter Price per Hour" value={hall.price_per_hour} onChange={(value) => updateHall(index, 'price_per_hour', value)} />
                        <MultiSelect label="Sports" data={sportsOptions} placeholder="Select sports" value={hall.sports} onChange={(value) => updateHall(index, 'sports', value)} />
                        <Dropzone
                            mt={10}
                            onDrop={(files) => updateHall(index, 'hallImage', files[0])} 
                            accept={IMAGE_MIME_TYPE}
                            maxFiles={1}
                        >
                            {hall.hallImage ? <Text>{hall.hallImage.name}</Text> : <Text>Drop hall image here or click to select</Text>}
                        </Dropzone>

                        <Button color="red" mt={10} leftIcon={<IconTrash />} onClick={() => removeHall(index)}>Remove Hall</Button>
                    </div>
                ))}

                <Button mt={10} leftIcon={<IconPlus />} onClick={addHall}>Add Hall</Button>
                <Button mt={20} type="submit" disabled={!userId}>{userId ? 'Submit' : 'Loading User...'}</Button>
            </form>
        </div>
    );
};

export default CreateVenue;
