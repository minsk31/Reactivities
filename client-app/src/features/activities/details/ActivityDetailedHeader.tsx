import { observer } from 'mobx-react-lite';
import { Button, Header, Item, Segment, Image, Label } from 'semantic-ui-react'
import { IActivity } from "../../../app/models/activity";
import { Link } from 'react-router-dom';
import { useStore } from '../../../app/stores/store';

const activityImageStyle = {
    filter: 'brightness(30%)'
};

const activityImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white'
};

interface Props {
    activity: IActivity | undefined
}

export default observer(function ActivityDetailedHeader({ activity }: Props) {
    const { activityStore: { updateAttendance, loading, cancelActivity } } = useStore();

    return (
        <Segment.Group>
            <Segment basic attached='top' style={{ padding: '0' }}>
                {activity?.isCancelled &&
                    <Label content='Canceled' ribbon color='red'
                        style={{ postion: 'absolute', zIndex: 10, left: -14, top: 20 }}>
                    </Label>
                }
                <Image src={`/assets/categoryImages/${activity?.category}.jpg`} fluid style={activityImageStyle} />
                <Segment style={activityImageTextStyle} basic>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header
                                    size='huge'
                                    content={activity?.title}
                                    style={{ color: 'white' }}
                                />
                                <p>{activity?.date?.toString()}</p>
                                <p>
                                    Hosted by <strong>
                                        <Link to={`/profiles/${activity?.host?.userName}`}>
                                            {activity?.host?.displayName}
                                        </Link>
                                    </strong>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
            <Segment clearing attached='bottom'>
                {activity?.isHost ?
                    (
                        <>
                            <Button 
                            color={activity.isCancelled ? 'red' : 'green'}
                            floated='left'
                            basic
                            content={activity.isCancelled ? 'Re-activate' : 'Cancel'}
                            loading={loading}
                            onClick={cancelActivity} />
                            <Button 
                            as={Link}
                             to={`/manage/${activity?.id}`}
                              color='orange'
                               floated='right'
                               disabled={activity.isCancelled}>
                                Manage Event
                            </Button>
                        </>
                    ) : activity?.isGoing ?
                        (<Button disabled={activity.isCancelled} onClick={updateAttendance} loading={loading}>Cancel attendance</Button>)
                        : (<Button disabled={activity!.isCancelled} onClick={updateAttendance} loading={loading} color='teal'>Join Activity</Button>)}
            </Segment>
        </Segment.Group>
    )
})
