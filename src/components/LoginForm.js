import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/useAuth';
import {TextInput,PasswordInput,Button,Paper,Stack,Title} from '@mantine/core';
  
const LoginForm = () => {
    const navigate = useNavigate();
    const {login} = useAuth();

    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    const handleSubmit = (e) => {
        // The form will cause a refresh by default. We don't want that, because our state will disappear.
        e.preventDefault();        

        login(form.email, form.password)
           
        navigate('/')
    }

    const handleChange = (e) => {
        setForm(({
            ...form,
            [e.target.name]: e.target.value
        }))
    }

    return (
        
            <form onSubmit={handleSubmit}>
              <div style={{ maxWidth: 400, margin: '40px auto' }}>
                <Title align="center" mb="md">Welcome back</Title>
          
                <Paper withBorder shadow="md" p="lg" radius="md">
                  <Stack>
                    <TextInput
                      label="Email"
                      placeholder="joe.bloggs@email.com"
                      name="email"
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
                    <Button type="submit" fullWidth mt="md">
                      Submit
                    </Button>
                  </Stack>
                </Paper>
              </div>
            </form>
          );
}

export default LoginForm