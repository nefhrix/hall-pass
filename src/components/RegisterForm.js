import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../utils/useAuth";
import { TextInput, PasswordInput, Button, Container, Stack, Select } from "@mantine/core";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    c_password: "",
    roles: "", // Added roles field
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
  .post(`https://hall-pass-main-ea0ukq.laravel.cloud/api/register`, form)
  .then((res) => {
    console.log("Full API Response:", res.data); // Debugging step

    if (res.data.success && res.data.data) {
      const userData = {
        id: res.data.data.roles?.[0]?.pivot?.user_id || null, // Extract user ID safely
        name: res.data.data.name,
        roles: res.data.data.roles,
      };

      localStorage.setItem("user", JSON.stringify(userData)); // Store user data correctly
      login(form.email, form.password); // Log in after successful registration
      navigate("/pages/venues");
    } else {
      console.error("Unexpected API response structure:", res.data);
    }
  })
  .catch((err) => {
    console.error("Registration error:", err);
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
            required
          />
          <TextInput
            label="Email"
            placeholder="joe.bloggs@email.com"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm your password"
            name="c_password"
            value={form.c_password}
            onChange={handleChange}
            required
          />
          {/* Dropdown for roles */}
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
