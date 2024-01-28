import { observer } from "mobx-react-lite";
import { Card, CardContent, CardDescription, CardHeader, Icon, Image } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import { Link } from "react-router-dom";
import style from '../profiles/ProfileCard.module.css'

interface Props {
    profile: Profile
}
const ProfileCard = ({ profile }: Props) => {

    function truncate(str: string, n: number){
        return (str.length > n) ? str.slice(0, n-1) + '...' : str;
      };

    return (
        <Card as={Link} to={`/profiles/${profile.userName}`}>
            <Image src={profile.image || '/assets/user.png'}></Image>
            <CardContent>
                <CardHeader>{profile.displayName}</CardHeader>
                <CardDescription className={style.overme}>{(profile.bio) ?  profile.bio : '<NOT AVAILABLE>'}</CardDescription>
            </CardContent>
            <CardContent>
                <Icon name="user"></Icon>
                20 followers
            </CardContent>
        </Card>
    )
};

export default observer(ProfileCard);
