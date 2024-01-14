import { Link } from "react-router-dom";
import { Item, ItemDescription, Button, SegmentGroup, Segment, ItemGroup, ItemImage, ItemContent, ItemHeader, Icon, Label } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import ActivityListItemAtendees from "./ActivityListItemAtendees";
import { observer } from "mobx-react-lite";

interface Props {
    activity: IActivity
}

const ActivityListItem = ({ activity }: Props) => {

    return (
        <SegmentGroup>
            <Segment>
                {activity.isCancelled && (
                    <Label attached="top" color="red" content="Canceled" style={{ position: top }}>

                    </Label>
                )}
                <ItemGroup>
                    <Item>
                        <ItemImage style={{marginBottom: 5}} size='tiny' circular src='/assets/user.png'></ItemImage>
                        <ItemContent>
                            <ItemHeader as={Link} to={`/activities/${activity?.id}`}>
                                {activity.title}
                            </ItemHeader>
                            <ItemDescription>Hosted by {activity.host?.displayName}</ItemDescription>
                            {activity.isHost && (
                                <ItemDescription>
                                    <Label basic color="orange">
                                        You are hosting this activity
                                    </Label>
                                </ItemDescription>
                            )}
                            {activity.isGoing && !activity.isHost && (
                                <ItemDescription>
                                    <Label basic color="green">
                                        You are going to this activity
                                    </Label>
                                </ItemDescription>
                            )}
                        </ItemContent>
                    </Item>
                </ItemGroup>
            </Segment>
            <Segment>
                <span>
                    <Icon name="clock" /> {activity.date?.toDateString()}
                    <Icon name="marker" /> {activity.venue}
                </span>
            </Segment>
            <Segment secondary>
                <ActivityListItemAtendees attendees={activity.attendees!} />
            </Segment>
            <Segment clearing>
                <span>{activity.description}</span>
                <Button as={Link}
                    to={`/activities/${activity?.id}`}
                    floated="right"
                    content="View"
                    color="blue"></Button>
            </Segment>
        </SegmentGroup>
    )
};

export default observer(ActivityListItem);
