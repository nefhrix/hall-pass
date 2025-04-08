//import { useDisclosure } from '@mantine/hooks';
import { Container, Text, Burger} from "@mantine/core";

//const [opened, { toggle }] = useDisclosure();

const Header = () => {
    return(
        <Container px={100} bg='#A0BDED'>
            <Text ta="center" c="white" size="xl" fw={700}>
                HallPass
            </Text>
        </Container>
    );
};

//<Burger opened={opened} onClick={toggle} aria-label="Toggle navigation" />

export default Header;