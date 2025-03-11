import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/useAuth';
// We don't want the name 'Navbar' to conflict with the Mantine component of the same name
// So we use an alias 'MantineNavbar' to refer to the Mantine component
import {Navbar as MantineNavbar, Button, Stack} from '@mantine/core';
import { IconArrowRight , IconLogin, IconLogout, IconStethoscope, IconLock, IconReportMedical, IconUser, IconReport, IconPillFilled } from '@tabler/icons-react';

const Navbar = () => {
    const { logout, token } = useAuth();

    const navigate = useNavigate();
    return (
        <MantineNavbar width={{ base: 400 }} height={500} p="xl">
            <Stack>
                {/* 
                    Mantine has the notion of 'polymorphic' components. 
                    We can pass another component into this button to transform its root element form a button to a Link, but keep the styling of the button
                    See another example in Home.js on line 48
                    - Explained: https://dev.to/thexdev/polymorphic-component-2737
                */}
                <Button rightIcon={<IconArrowRight  size={18}/>}       size={'xl'} color={"dark"} component={Link} to='/'>
                    Home
                </Button>
                
            

             

                <Button component={Link}   size={'xl'} rightIcon={<IconLock />} to='/pages/venues/'>
                    Venues
                </Button>

                <Button component={Link}   size={'xl'} rightIcon={<IconLock />} to='/register'>
                    Register
                </Button>

                <Button rightIcon={<IconLogin />}  size={'xl'} component={Link} to='/login'>
                    Login
                </Button>

                {/* Only displaying the logout button if we have a token (i.e, we are logged in) */}
                {
                    token && (
                        <Button color='red' size={'xl'} rightIcon={<IconLogout />}  onClick={() => {
                            logout();
                            navigate('/login', { replace: true })
                        }}>Logout</Button>
                    )
                }

            </Stack>
        </MantineNavbar >
    );
};

export default Navbar;