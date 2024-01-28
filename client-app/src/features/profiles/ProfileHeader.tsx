import { Button, Divider, Grid, Header, Item, ItemImage, Reveal, RevealContent, Segment, Statistic, StatisticGroup } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import { observer } from "mobx-react-lite";

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
                        <Statistic label="Followers" value='5'></Statistic>
                        <Statistic label="Following" value='42'></Statistic>
                    </StatisticGroup>
                    <Divider></Divider>
                    <Reveal animated="move">
                        <RevealContent visible style={{ width: '100%' }}>
                            <Button fluid color="teal" content="Following"></Button>
                        </RevealContent>
                        <RevealContent hidden style={{ width: '100%' }}>
                            <Button fluid basic color={true? 'red': 'green'} content={true? 'Unfollow': 'Follow'}></Button>
                        </RevealContent>
                    </Reveal>
                </Grid.Column>
            </Grid>
        </Segment>
    )
};

export default observer(ProfileHeader);
