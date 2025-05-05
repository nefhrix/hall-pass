import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../utils/useAuth";
import { TextInput, PasswordInput, Button, Container, Stack, Select } from "@mantine/core";
import { showNotification } from '@mantine/notifications';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    c_password: "",
    roles: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (form.password !== form.c_password) {
      newErrors.c_password = "Passwords do not match";
    }

    if (!form.roles) newErrors.roles = "Role is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showNotification({ title: 'Validation Error', message: 'Please correct the form errors.', color: 'red' });
      return;
    }

    axios
      .post(`https://hall-pass-main-ea0ukq.laravel.cloud/api/register`, form)
      .then((res) => {
        console.log("Full API Response:", res.data); 

        if (res.data.success && res.data.data) {
          const userData = {
            id: res.data.data.roles?.[0]?.pivot?.user_id || null, 
            name: res.data.data.name,
            roles: res.data.data.roles,
          };

          localStorage.setItem("user", JSON.stringify(userData)); 
          login(form.email, form.password); // Log in after successful registration
          navigate("/pages/venues");
          showNotification({ title: 'Success', message: 'Registration successful!', color: 'green' });
        } else {
          console.error("Unexpected API response structure:", res.data);
        }
      })
      .catch((err) => {
        console.error("Registration error:", err);
        showNotification({ title: 'Error', message: 'Registration failed.', color: 'red' });
      });
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Container size="md" p="sm">
      <form onSubmit={handleSubmit}>
        <h1>Register For HallPass</h1>
        <Stack spacing="md">
          <TextInput
            label="Name"
            placeholder="Enter name"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
            required
          />
          <TextInput
            label="Email"
            placeholder="joe.bloggs@email.com"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            name="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            required
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm your password"
            name="c_password"
            value={form.c_password}
            onChange={handleChange}
            error={errors.c_password}
            required
          />
          <Select
            label="Role"
            placeholder="Select a role"
            name="roles"
            value={form.roles}
            onChange={(value) => setForm({ ...form, roles: value })}
            data={[
              { value: "1", label: "I want to book venues" },
              { value: "2", label: "I want to rent my venue" },
            ]}
            error={errors.roles}
            required
          />
          <Button type="submit" fullWidth>
            Submit
          </Button>
        </Stack>
      </form>
    </Container>
  );
};

export default RegisterForm;


//banger video on form validaton https://www.freecodecamp.org/news/how-to-validate-forms-in-react/