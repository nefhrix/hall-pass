import { AuthProvider } from "./utils/useAuth";
import { createContext } from "react";

import { MantineProvider, AppShell, Header, Footer } from '@mantine/core';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Notifications } from '@mantine/notifications';




import Navbar from './components/Navbar';
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ProtectedRoute from './components/ProtectedRoute'

import HomePage from './pages/Home'

import SingleVenue from "./pages/venues/SingleVenue";
import CreateVenue from './pages/venues/Create';
import EditVenue from './pages/venues/Edit';
import HomeVenue from "./pages/venues/Home";

import CreateHall from "./pages/halls/Create";
import EditHall from "./pages/halls/Edit"
import SingleHall from "./pages/halls/SingleHall";

import CreateTimeSlot from "./pages/timeslots/Create";

import CreateBooking from "./pages/bookings/Create"
export const UserContext = createContext();

const App = () => {
    // We wrap the entire app in the auth provider
    // We no longer need to pass the auth state down from here, all our routes can get it from the context instead    
    
    return (
        
        <div>
            <AuthProvider>
            <MantineProvider withGlobalStyles withNormalizeCSS>
                    <Router>
                    <Notifications position="top-center" />                              
                        <AppShell
                            padding="md"
                            navbar={<Navbar />}
                            header={<Header height={60} p="xs">Hall Pass</Header>}
                            footer={<Footer height={60} p="xs"></Footer>}
                        >
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                       
                                {/* */}                                
                                <Route path='/' element={<ProtectedRoute />}>
                                    <Route path='/venues/Create' element={<CreateVenue />} />
                                    <Route path='/pages/venues/' element={<HomeVenue />} />
                                    <Route path='/userVenues' element={<HomeVenue />} />
                                    <Route path='/venues/:id/edit' element={<EditVenue />} /> 
                                     <Route path='/venues/:id' element={<SingleVenue />} /> 


                                     <Route path='/halls/Create/:id' element={<CreateHall />} />
                                     <Route path="/halls/:id/edit" element={<EditHall />} />
                                     <Route path="/halls/:hallId" element={<SingleHall />} />

                                     <Route path="/venues/:hallId/timeslots/Create" element={<CreateTimeSlot />} />

                                     <Route path="/booking/create/:venueId/:timeslotId" element={<CreateBooking />} />
                                     <Route path="/venues/:venueId/timeslots/:timeslotId/book" element={<CreateBooking />} />
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