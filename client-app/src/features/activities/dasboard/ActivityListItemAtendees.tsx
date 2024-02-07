import { observer } from "mobx-react-lite";
import { List, ListItem, Image, Popup, PopupContent } from "semantic-ui-react";
import { Profile } from "../../../app/models/profile";
import { Link } from "react-router-dom";
import ProfileCard from "../../profiles/ProfileCard";

interface Props {
    attendees: Profile[]
}
const ActivityListItemAtendees = ({ attendees }: Props) => {
    const styles = {
        borderColor: 'orange',
        borderWidth: 2
    }

    return (
        <List horizontal>
            {attendees.map(x => (
                <Popup
                    hoverable
                    key={x.userName}
                    trigger={
                        <ListItem key={x.userName} as={Link} to={`/profiles/${x.userName}`}>
                            <Image circular size='mini'
                             src={x.image || '/assets/user.png'}
                             bordered
                             style={x.following ? styles : null}
                             ></Image>
                        </ListItem>
                    }
                >
                    <PopupContent>
                        <ProfileCard profile={x}></ProfileCard>
                    </PopupContent>
                </Popup>


            )
            )}
        </List>
    )
};

export default observer(ActivityListItemAtendees);
