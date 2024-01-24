import { useParams } from "react-router-dom";
import { Grid, GridColumn } from "semantic-ui-react";
import ProfileHeader from "./ProfileHeader";
import ProfileContent from "./ProfileContent";
import { useStore } from "../../app/stores/store";
import { useEffect } from "react";
//import LoadingComponent from "../../app/layout/LoadingComponent";
import { observer } from "mobx-react-lite";

const ProfilePage = () => {
    const { username } = useParams<{ username: string }>();
    const { profileStore: { loadProfile, profile } } = useStore();
    useEffect(() => {
        if (username) {
            loadProfile(username)
        }
    },
        [username, loadProfile])

    //if (loading) return <LoadingComponent content='Loading profile'></LoadingComponent>

    return (
        <Grid>
            <GridColumn width={16}>
                {profile &&
                    (
                        <>
                            <ProfileHeader profile={profile}></ProfileHeader>
                            <ProfileContent profile={profile}></ProfileContent>
                        </>)}
            </GridColumn>
        </Grid>
    )
};

export default observer(ProfilePage);
