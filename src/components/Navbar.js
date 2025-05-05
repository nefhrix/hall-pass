// Navbar.js
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/useAuth';
import { Button, Flex, Container, Text, Header } from '@mantine/core';
import { IconArrowRight, IconLogin, IconLogout, IconLock } from '@tabler/icons-react';

const Navbar = ({ searchBar }) => {
  const { logout, token } = useAuth();
  const navigate = useNavigate();

  return (
    <Container fluid px="md" style={{ backgroundColor: '#FFFFFF' }}>
      <Flex justify="space-between" align="center" style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Text size="xl" weight={700} style={{ fontSize: '64px' }}>
              HallPass
            </Text>
          </Link>
        </div>


        {searchBar ? (
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            {searchBar}
          </div>
        ) : ""}



        <div>
          <Flex align="center" gap="md">


            <Button
              component={Link}
              size="lg"
              rightIcon={<IconLock />}
              to="/pages/venues/"
            >
              Venues
            </Button>

            {!token && (
              <>
                <Button
                  component={Link}
                  size="lg"
                  rightIcon={<IconLock />}
                  to="/register"
                >
                  Register
                </Button>

                <Button
                  rightIcon={<IconLogin />}
                  size="lg"
                  component={Link}
                  to="/login"
                >
                  Login
                </Button>
              </>
            )}

            {token && (
              <Button
                color="red"
                size="lg"
                rightIcon={<IconLogout />}
                onClick={() => {
                  logout();
                  navigate('/', { replace: true });
                }}
              >
                Logout
              </Button>
            )}
          </Flex>
        </div>
      </Flex>
    </Container>
  );
};

export default Navbar;
