import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/useAuth';
import {
  Button,
  Container,
  Text,
  Box,
  Grid,
  Stack,
  Group
} from '@mantine/core';
import { IconLogin, IconLogout, IconLock } from '@tabler/icons-react';

const Navbar = ({ searchBar }) => {
  const { logout, token } = useAuth();
  const navigate = useNavigate();

  return (
    <Box
      style={{
        borderBottom: '1px solid #eee',
        backgroundColor: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <Container fluid px="md" py="sm">
        <Grid align="center" justify="space-between">
          {/* Logo */}
          <Grid.Col span={12} sm={3}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Text size="xl" fw={700} style={{ fontSize: '2rem' }}>
                HallPass
              </Text>
            </Link>
          </Grid.Col>

          {/* Search bar centered */}
          <Grid.Col span={12} sm={6}>
            {searchBar && (
              <Box
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%',
                }}
              >
                {searchBar}
              </Box>
            )}
          </Grid.Col>

          {/* Buttons */}
          <Grid.Col span={12} sm={3}>
            <Group
              position="right"
              spacing="sm"
              mt={{ base: 'sm', sm: 0 }}
              style={{ justifyContent: 'flex-end', flexWrap: 'wrap' }}
            >
              <Button
                component={Link}
                size="md"
                rightIcon={<IconLock />}
                to="/pages/venues/"
              >
                Venues
              </Button>

              {!token ? (
                <>
                  <Button
                    component={Link}
                    size="md"
                    rightIcon={<IconLock />}
                    to="/register"
                  >
                    Register
                  </Button>
                  <Button
                    rightIcon={<IconLogin />}
                    size="md"
                    component={Link}
                    to="/login"
                  >
                    Login
                  </Button>
                </>
              ) : (
                <Button
                  color="red"
                  size="md"
                  rightIcon={<IconLogout />}
                  onClick={() => {
                    logout();
                    navigate('/', { replace: true });
                  }}
                >
                  Logout
                </Button>
              )}
            </Group>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
};

export default Navbar;
