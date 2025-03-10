import { AuthProvider } from "./utils/useAuth";
import { createContext } from "react";

import { MantineProvider, AppShell, Header, Footer } from '@mantine/core';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from './components/Navbar';
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ProtectedRoute from './components/ProtectedRoute'

import HomePage from './pages/Home'

import SingleAppointment from "./pages/appointments/SingleAppointment";
import CreateAppointment from './pages/appointments/Create';
import EditAppointment from './pages/appointments/Edit';
import HomeAppointment from "./pages/appointments/Home";



export const UserContext = createContext();

const App = () => {
    // We wrap the entire app in the auth provider
    // We no longer need to pass the auth state down from here, all our routes can get it from the context instead    
    
    return (
        
        <div>
            <AuthProvider>
            <MantineProvider withGlobalStyles withNormalizeCSS>
                    <Router>
                        {/* Creates a menu on the left and our content on the right */}
                        {/* We can pass in our own components for the navbar, header and footer */}                                            
                        <AppShell
                            padding="md"
                            navbar={<Navbar />}
                            header={<Header height={60} p="xs">Clinic Manager</Header>}
                            footer={<Footer height={60} p="xs"></Footer>}
                        >
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                       
                                {/* Appointment routes */}                                
                                <Route path='/' element={<ProtectedRoute />}>
                                    <Route path='/appointments/create' element={<CreateAppointment />} />
                                    <Route path='/pages/appointments/' element={<HomeAppointment />} />
                                    <Route path='/appointments/:id/edit' element={<EditAppointment />} />
                                    <Route path='/appointments/:id' element={<SingleAppointment />} />
                                </Route>
                        

                                <Route path='/login' element={<LoginForm />} />
                                <Route path='/register' element={<RegisterForm />} />
                            </Routes>
                        </AppShell>
                    </Router>
                </MantineProvider>
            </AuthProvider>
        </div>
    );
};

export default App;