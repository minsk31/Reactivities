
import { Button, Container, Menu, MenuItem } from "semantic-ui-react";
import { NavLink } from "react-router-dom";

export default function NavBar() {
    return (
        <Menu inverted fixed="top">
            <Container>
                <Menu.Item as={NavLink} to='/' header>
                    <img src="/assets/logo.png" alt="logo" style={{ marginRight: 10 }}></img>
                    Reactivities
                </Menu.Item>
                <MenuItem as={NavLink} to='/activities' name="Activities">
                </MenuItem>
                <MenuItem as={NavLink} to='/errors' name="Errors">
                </MenuItem>
                <MenuItem>
                    <Button as={NavLink} to='/createActivity' positive content='Create Activity'></Button>
                </MenuItem>
            </Container>
        </Menu>
    )
}