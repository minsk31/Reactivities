
import { Button, Container, Menu, MenuItem } from "semantic-ui-react";
import { useStore } from "../stores/store";

export default function NavBar() {
    const {activityStore} = useStore();

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
                    <Button onClick={() => activityStore.openForm()} positive content='Create Activity'></Button>
                </MenuItem>
            </Container>
        </Menu>
    )
}