import { Button, Form, FormInput, FormTextArea, Segment } from "semantic-ui-react";
import { useEffect, useState } from "react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IActivity } from "../../../app/models/activity";
import LoadingComponent from "../../../app/layout/LoadingComponent";

const ActivityForm = () => {

    const { activityStore } = useStore();
    const { loading, loadActivity, loadInitial } = activityStore;
    const { id } = useParams();
    const navigate = useNavigate();
    const [activity, setActivity] = useState<IActivity>({
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    });

    useEffect(() => {

        if (id) {
            loadActivity(id).then(activity => setActivity(activity!))
        }

    }, [id, loadActivity]);


    function HandleSubmit() {
        activityStore.upsertActivity(activity)
            .then((activityId: string) => navigate(`/activities/${activityId}`));
    }

    function HandleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target;
        setActivity({ ...activity, [name]: value })
    }

    if (loadInitial) return <LoadingComponent content='Loading activity form'></LoadingComponent>

    return (
        <Segment clearing>
            <Form onSubmit={HandleSubmit} autoComplete='off'>
                <Form.Input placeholder='Title' name='title' value={activity?.title} onChange={HandleInputChange}></Form.Input>
                <FormTextArea placeholder='Description' name='description' value={activity?.description} onChange={HandleInputChange}></FormTextArea>
                <FormInput placeholder='Category' name='category' value={activity?.category} onChange={HandleInputChange}></FormInput>
                <FormInput type='date' placeholder='Date' name='date' value={activity?.date} onChange={HandleInputChange}></FormInput>
                <FormInput placeholder='City' name='city' value={activity?.city} onChange={HandleInputChange}></FormInput>
                <FormInput placeholder='Venue' name='venue' value={activity?.venue} onChange={HandleInputChange}></FormInput>
                <Button loading={loading} disabled={loading} floated="right" positive type="submit" content="Submit"></Button>
                <Button  as={Link} to='/activities' loading={loading} disabled={loading} floated="right" type="button" content="Cancel"></Button>
            </Form>
        </Segment>
    )
};

export default observer(ActivityForm);
