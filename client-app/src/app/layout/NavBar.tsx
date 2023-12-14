
import { Button, Container, Menu, MenuItem } from "semantic-ui-react";

interface Props{
    openForm: () => void;
}

export default function NavBar({openForm}: Props) {
    return (
        <Menu inverted fixed="top">
            <Container>
                <Menu.Item header>
                    <img src="/assets/logo.png" alt="logo" style={{marginRight: 10}}></img>
                    Reactivities
                </Menu.Item>
                <MenuItem name="Activities">
                </MenuItem>
                <MenuItem>
                    <Button onClick={openForm} positive content='Create Activity'></Button>
                </MenuItem>
            </Container>
        </Menu>
    )
}