import { Divider, Grid, Header, Item, ItemImage, Segment, Statistic, StatisticGroup } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import { observer } from "mobx-react-lite";
import FollowButton from "./FollowButton";

interface Props{
    profile: Profile;
}
const ProfileHeader = ({profile}: Props) => {
    return (
        <Segment>
            <Grid>
                <Grid.Column width={12}>
                    <Item.Group>
                        <Item>
                            <ItemImage avatar size="small" src={ profile.image || '/assets/user.png'}></ItemImage>
                            <Item.Content verticalAlign="middle">
                                <Header
                                    as="h1"
                                    content={profile.displayName}
                                />
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Grid.Column>
                <Grid.Column width={4}>
                    <StatisticGroup widths={2}>
                        <Statistic label="Followers" value={profile.followersCount}></Statistic>
                        <Statistic label="Following"  value={profile.followingCount}></Statistic>
                    </StatisticGroup>
                    <Divider></Divider>
                    <FollowButton profile={profile}/>
                </Grid.Column>
            </Grid>
        </Segment>
    )
};

export default observer(ProfileHeader);
