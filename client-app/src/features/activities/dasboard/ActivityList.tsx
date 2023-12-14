import { IActivity } from "../../../app/models/activity";
import { Button, ButtonGroup, Item, ItemDescription, ItemExtra, Label, Segment } from "semantic-ui-react";

interface Props {
    activities: IActivity[];
    selectActivity: (id: string) => void;
    deleteActivity: (id: string) => void;
}
export default function ActivityList({ activities, selectActivity, deleteActivity }: Props) {
    return (
        <Segment>
            <Item.Group divided>
                {activities.map(activity => (
                    <Item key={activity.id}>
                        <Item.Content>
                            <Item.Header as='a'>
                                {activity.title}
                            </Item.Header>
                            <Item.Meta>{activity.date}</Item.Meta>
                            <ItemDescription>
                                <div>{activity.description}</div>
                                <div>{activity.city}, {activity.venue}</div>
                            </ItemDescription>
                            <ItemExtra>
                                <Button onClick={() => selectActivity(activity.id)} floated="right" content="View" color="blue"></Button>
                                <Button onClick={() => deleteActivity(activity.id)} floated="right" content="Delete" color="red"></Button>
                                <Label basic content={activity.category}></Label>
                            </ItemExtra>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    )
}