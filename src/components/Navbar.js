// Navbar.js
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/useAuth';
import { Button, Flex, Container, Text } from '@mantine/core';
import { IconArrowRight, IconLogin, IconLogout, IconLock } from '@tabler/icons-react';

const Navbar = ({ searchBar }) => {
  const { logout, token } = useAuth();
  const navigate = useNavigate();

  return (
    <Container fluid px="md" py="sm" style={{ backgroundColor: '#f8f9fa' }}>
      <Flex justify="space-between" align="center" style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Text size="xl" weight={700} style={{ fontSize: '64px' }}>
            HallPass
          </Text>
        </div>

        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          {searchBar}
        </div>

        <div>
          <Flex align="center" gap="md">
            <Button
              rightIcon={<IconArrowRight size={18} />}
              size="lg"
              color="dark"
              component={Link}
              to="/"
            >
              Home
            </Button>

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
                  navigate('/login', { replace: true });
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
