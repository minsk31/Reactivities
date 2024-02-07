import { observer } from "mobx-react-lite";
import { Card, CardContent, CardDescription, CardHeader, Icon, Image } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import { Link } from "react-router-dom";
import style from '../profiles/ProfileCard.module.css'
import FollowButton from "./FollowButton";

interface Props {
    profile: Profile
}
const ProfileCard = ({ profile }: Props) => {

    return (
        <Card as={Link} to={`/profiles/${profile.userName}`}>
            <Image src={profile.image || '/assets/user.png'}></Image>
            <CardContent>
                <CardHeader>{profile.displayName}</CardHeader>
                <CardDescription className={style.overme}>{(profile.bio) ?  profile.bio : '<NOT AVAILABLE>'}</CardDescription>
            </CardContent>
            <CardContent>
                <Icon name="user"></Icon>
                {profile.followersCount} followers
            </CardContent>
            <FollowButton profile={profile}/>
        </Card>
    )
};

export default observer(ProfileCard);
