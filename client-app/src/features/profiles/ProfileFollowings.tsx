import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import { CardGroup, Grid, GridColumn, Header, TabPane } from "semantic-ui-react";
import ProfileCard from "./ProfileCard";
import { useEffect } from "react";

interface Props {
    predicate: string;
}

const ProfileFollowings = ({ predicate }: Props) => {
    const { profileStore } = useStore();
    const { profile, followings, loading, loadFollowings } = profileStore;

    useEffect(() => {
        loadFollowings(predicate)
    }, [loadFollowings])

    return (
        <TabPane loading={loading}>
            <Grid>
                <GridColumn width={16}>
                    <Header
                        floated="left"
                        icon='user'
                        content={`People following ${profile?.displayName}`}
                    />
                </GridColumn>
                <GridColumn width={16}>
                    <CardGroup itemsPerRow={4}>
                        {followings.map(profile => (
                            <ProfileCard key={profile?.userName} profile={profile}></ProfileCard>
                        ))}
                    </CardGroup>
                </GridColumn>
            </Grid>
        </TabPane>
    )
};

export default observer(ProfileFollowings);
