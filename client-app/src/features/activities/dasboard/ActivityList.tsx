import { SyntheticEvent, useState } from "react";
import { IActivity } from "../../../app/models/activity";
import { Button, Item, ItemDescription, ItemExtra, Label, Segment } from "semantic-ui-react";

interface Props {
    activities: IActivity[];
    selectActivity: (id: string) => void;
    deleteActivity: (id: string) => void;
    submitting: boolean;
}
export default function ActivityList({ activities, selectActivity, deleteActivity, submitting }: Props) {

    const [target, setTarget] = useState('');

    function handleActivityDelete(event: SyntheticEvent<HTMLButtonElement>, id: string) {
        setTarget(event.currentTarget.name)
        deleteActivity(id);
    }
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
                                <Button
                                    name={activity.id}
                                    loading={submitting && target === activity.id}
                                    onClick={(e) => handleActivityDelete(e, activity.id)}
                                    floated="right" content="Delete" color="red"
                                />
                                <Label basic content={activity.category}></Label>
                            </ItemExtra>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    )
}