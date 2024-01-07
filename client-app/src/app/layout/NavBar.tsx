
import { Button, Container, Menu, MenuItem, Image, DropdownMenu, DropdownItem, Dropdown } from "semantic-ui-react";
import { Link, NavLink } from "react-router-dom";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";

export default observer(function NavBar() {
    const { userStore: { user, logout } } = useStore();

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
                <MenuItem position="right">
                    <Image src={user?.image || '/assets/user.png'} avatar spaced='right'></Image>
                    <Dropdown pointing='top left' text={user?.displayName}>
                        <DropdownMenu>
                            <DropdownItem as={Link} to={`/profile/${user?.username}`} text='My Profile' icon='user'></DropdownItem>
                            <DropdownItem onClick={logout} text='Logout' icon='power'></DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </MenuItem>
            </Container>
        </Menu>
    )
})