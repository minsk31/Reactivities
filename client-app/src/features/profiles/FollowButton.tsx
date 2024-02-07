import { Button, Reveal, RevealContent } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import { SyntheticEvent } from "react";

interface Props {
    profile: Profile
}

const FollowButton = ({profile}:Props) => {

    const {profileStore:{updateFollowing, loading}, userStore} = useStore();

    if(userStore.user?.userName === profile.userName) return null;

    function handleFollow(e: SyntheticEvent, userName: string)
    {
        e.preventDefault();
        updateFollowing(userName, profile.following);
    }

    return (
        <div>
            <Reveal animated="move">
                <RevealContent visible style={{ width: '100%' }}>
                    <Button 
                    fluid 
                    color="teal" 
                    content={profile.following ? "Following" : "Not following"}                    
                    ></Button>
                </RevealContent>
                <RevealContent hidden style={{ width: '100%' }}>
                    <Button
                     fluid 
                     basic 
                     onClick={(e) => handleFollow(e, profile.userName)}
                     loading={loading}
                     color={profile.following ? 'red' : 'green'} content={profile.following ? 'Unfollow' : 'Follow'}></Button>
                </RevealContent>
            </Reveal>
        </div>
    )
};

export default observer(FollowButton);
