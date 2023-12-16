import { Button, Form, FormInput, FormTextArea, Segment } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import { useState } from "react";

interface Props {
    activity: IActivity | undefined
    closeForm: () => void;
    createOrEdit: (activity: IActivity) => void;
    submitting: boolean;
}

const ActivityForm = ({ activity: selectedActivity, closeForm , createOrEdit, submitting}: Props) => {

    const initialState = selectedActivity ?? {
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    }

    const [activity, setActivity] = useState(initialState);

    function HandleSubmit(){
        createOrEdit(activity);
    }

    function HandleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>){
        const {name, value} = event.target;
        setActivity({...activity, [name]: value})
    }

    return (
        <Segment clearing>
            <Form onSubmit={HandleSubmit} autoComplete='off'>
                <Form.Input placeholder='Title' name='title' value={activity?.title} onChange={HandleInputChange}></Form.Input>
                <FormTextArea placeholder='Description' name='description' value={activity?.description} onChange={HandleInputChange}></FormTextArea>
                <FormInput placeholder='Category' name='category' value={activity?.category} onChange={HandleInputChange}></FormInput>
                <FormInput  type='date' placeholder='Date' name='date' value={activity?.date} onChange={HandleInputChange}></FormInput>
                <FormInput placeholder='City' name='city' value={activity?.city} onChange={HandleInputChange}></FormInput>
                <FormInput placeholder='Venue' name='venue' value={activity?.venue} onChange={HandleInputChange}></FormInput>
                <Button loading={submitting} disabled={submitting} floated="right" positive type="submit" content="Submit"></Button>
                <Button loading={submitting} disabled={submitting} onClick={closeForm} floated="right" type="button" content="Cancel"></Button>
            </Form>
        </Segment>
    )
};

export default ActivityForm;
