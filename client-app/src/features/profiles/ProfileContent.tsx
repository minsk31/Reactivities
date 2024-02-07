import { Tab, TabPane } from "semantic-ui-react";
import ProfilePhotos from "./ProfilePhotos";
import { Profile } from "../../app/models/profile";
import { observer } from "mobx-react-lite";
import ProfileAbout from "./ProfileAbout";
import ProfileFollowings from "./ProfileFollowings";

interface Props {
    profile: Profile
}

const ProfileContent = ({ profile }: Props) => {
    const panes = [
        { menuItem: 'About', render: () => <ProfileAbout profile={profile} /> },
        { menuItem: 'Photos', render: () => <ProfilePhotos profile={profile} /> },
        { menuItem: 'Events', render: () => <TabPane>About Events</TabPane> },
        { menuItem: 'Followers', render: () => <ProfileFollowings key="followers" predicate="followers" /> },
        { menuItem: 'Following', render: () => <ProfileFollowings key="following" predicate="following" /> }
    ]
    return (
        <Tab
            menu={{ fluid: true, vertical: true }}
            menuPosition="right"
            panes={panes}
        >
        </Tab>
    )
};

export default observer(ProfileContent);
