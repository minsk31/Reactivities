import { Tab, TabPane } from "semantic-ui-react";
import ProfilePhotos from "./ProfilePhotos";
import { Profile } from "../../app/models/profile";
import { observer } from "mobx-react-lite";
import ProfileAbout from "./ProfileAbout";

interface Props {
    profile: Profile
}

const ProfileContent = ({ profile }: Props) => {
    const panes = [
        { menuItem: 'About', render: () => <ProfileAbout profile={profile}/> },
        { menuItem: 'Photos', render: () => <ProfilePhotos profile={profile}/> },
        { menuItem: 'Events', render: () => <TabPane>About Events</TabPane> },
        { menuItem: 'Followers', render: () => <TabPane>About Followers</TabPane> },
        { menuItem: 'Following', render: () => <TabPane>About Following</TabPane> }
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
