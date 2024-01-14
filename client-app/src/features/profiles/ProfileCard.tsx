import { observer } from "mobx-react-lite";
import { Card, CardContent, CardDescription, CardHeader, Icon, Image } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import { Link } from "react-router-dom";

interface Props {
    profile: Profile
}
const ProfileCard = ({ profile }: Props) => {
    return (
        <Card as={Link} to={`/profiles/${profile.userName}`}>
            <Image src={profile.image || '/assets/user.png'}></Image>
            <CardContent>
                <CardHeader>{profile.displayName}</CardHeader>
                <CardDescription>Bio goes here</CardDescription>
            </CardContent>
            <CardContent>
                <Icon name="user"></Icon>
                20 followers
            </CardContent>
        </Card>
    )
};

export default observer(ProfileCard);
