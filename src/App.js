import { AuthProvider } from "./utils/useAuth";
import { createContext } from "react";

import { MantineProvider, AppShell, Header, Footer } from '@mantine/core';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from './components/Navbar';
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ProtectedRoute from './components/ProtectedRoute'

import HomePage from './pages/Home'

import SingleVenue from "./pages/venues/SingleVenue";
import CreateVenue from './pages/venues/Create';
import EditVenue from './pages/venues/Edit';
import HomeVenue from "./pages/venues/Home";



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
                                    <Route path='/venues/Create' element={<CreateVenue />} />
                                    <Route path='/pages/venues/' element={<HomeVenue />} />
                                     <Route path='/venues/:id/edit' element={<EditVenue />} /> 
                                     <Route path='/venues/:id' element={<SingleVenue />} /> 
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