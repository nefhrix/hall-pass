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
        localStorage.setItem("user", JSON.stringify(res.data.user));
        login(form.email, form.password);
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
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
