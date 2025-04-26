import { AuthProvider } from "./utils/useAuth";
import { createContext } from "react";

import { MantineProvider, AppShell, Footer, Paper, Group, Text } from '@mantine/core';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Notifications } from "@mantine/notifications";

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
                <MantineProvider
                    withGlobalStyles
                    withNormalizeCSS
                    theme={{
                        fontFamily: 'Nunito, sans-serif',
                        headings: { fontFamily: 'Nunito, sans-serif' },
                        defaultRadius: 'md',
                    }}
                >
                    <Router>
                        <Notifications position="top-center" />
                        <AppShell
                            padding="md"
                            //navbar={<NoSearchNavbar/>}
                            // footer={<Footer>
                            //     <Group position="center">
                            //         <Text>© 2024 Hall Pass.</Text>
                            //         <Text>All Rights Reserved.</Text>
                            //     </Group>
                            // </Footer>}
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
            <Footer mt="md">
                <Group position="center">
                    <Text>© 2024 HallPass.</Text>
                    <Text>All Rights Reserved.</Text>
                </Group>
            </Footer>
        </div>
    );
};

export default App;