import { Button, ButtonGroup, Card, Image } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { Link, useParams } from "react-router-dom";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";

export default observer(function ActivityDetails() {
    const {activityStore} = useStore();
    const {selectedActivity: activity, loadActivity, loadInitial} = activityStore;
    const {id} = useParams();
   
    useEffect(() => {
       
        if(id){
            setTimeout(() => { loadActivity(id)}, 500)            
        }
        
    }, [id, loadActivity]);

    if (loadInitial) return <LoadingComponent content='Loading activity details'></LoadingComponent>
    
    return (
        <Card>
            <Image src={`/assets/categoryImages/${activity ?.category}.jpg`} />
            <Card.Content>
                <Card.Header>{activity?.title}</Card.Header>
                <Card.Meta>
                    <span>{activity?.date}</span>
                </Card.Meta>
                <Card.Description>
                    {activity?.description}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <ButtonGroup widths='2'>
                    <Button as={Link} to={`/manage/${activity?.id}`} basic color='blue' content='Edit'></Button>
                    <Button as={Link} to='/activities' basic color='grey' content='Cancel'></Button>
                </ButtonGroup>
            </Card.Content>
        </Card>
    )
})