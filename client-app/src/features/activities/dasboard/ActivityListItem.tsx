import { Link } from "react-router-dom";
import { Item, ItemDescription, Button, SegmentGroup, Segment, ItemGroup, ItemImage, ItemContent, ItemHeader, Icon } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import { SyntheticEvent, useState } from "react";
import { useStore } from "../../../app/stores/store";

interface Props {
    activity: IActivity
}

const ActivityListItem = ({ activity }: Props) => {
    const { activityStore } = useStore();
    const [target, setTarget] = useState('');

    function handleActivityDelete(event: SyntheticEvent<HTMLButtonElement>, id: string) {
        setTarget(event.currentTarget.name)
        activityStore.deleteActivity(id);
    }

    return (
        <SegmentGroup>
            <Segment>
                <ItemGroup>
                    <Item>
                        <ItemImage size='tiny' circular src='/assets/user.png'></ItemImage>
                        <ItemContent>
                            <ItemHeader as={Link} to={`/activities/${activity?.id}`}>
                                {activity.title}
                            </ItemHeader>
                            <ItemDescription>Hosted by Bob</ItemDescription>
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
            <Segment secondary>Attendees go here</Segment>
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

export default ActivityListItem;
