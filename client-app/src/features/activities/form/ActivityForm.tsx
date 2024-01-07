import { Button, Header, Segment } from "semantic-ui-react";
import { useEffect, useState } from "react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IActivity } from "../../../app/models/activity";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Formik, Form } from "formik";
import MyTextInput from "../../../app/common/form/MyTextInput";
import * as Yup from "yup";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import categoryOptions from "../../../app/common/options/categoryOptions";
import MyDateTimeInput from "../../../app/common/form/MyDateTimeInput";

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
        date: null,
        city: '',
        venue: ''
    });

    const validationSchema = Yup.object({
        title: Yup.string().required('The activity title is required'),
        category: Yup.string().required(),
        description: Yup.string().required(),
        city: Yup.string().required(),
        venue: Yup.string().required(),
        date: Yup.date().required()
    })

    useEffect(() => {

        if (id) {
            loadActivity(id).then(activity => setActivity(activity!))
        }

    }, [id, loadActivity]);


    function HandleFormSubmit(activity: IActivity) {
        activityStore.upsertActivity(activity)
            .then((activityId: string) => navigate(`/activities/${activityId}`));
    }

    if (loadInitial) return <LoadingComponent content='Loading activity form'></LoadingComponent>

    return (
        <Segment clearing>
            <Header  content='Activity Details' sub color="teal"/>
            <Formik
                validationSchema={validationSchema}
                enableReinitialize
                initialValues={activity}
                onSubmit={values => HandleFormSubmit(values)}>
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <MyTextInput placeholder='Title' name='title' ></MyTextInput>
                        <MyTextArea rows={3} placeholder='Description' name='description' ></MyTextArea>
                        <MySelectInput options={categoryOptions} placeholder='Category' name='category' ></MySelectInput>
                        <MyDateTimeInput
                         placeholderText='Date'
                         name='date'
                         showTimeSelect
                         timeCaption="time"
                         dateFormat='MMMM d, yyyy h:mm aa'  ></MyDateTimeInput>
                          <Header  content='Location Details' sub color="teal"/>
                        <MyTextInput placeholder='City' name='city' ></MyTextInput>
                        <MyTextInput placeholder='Venue' name='venue' ></MyTextInput>
                        <Button loading={loading} disabled={isSubmitting || !dirty || !isValid} floated="right" positive type="submit" content="Submit"></Button>
                        <Button as={Link} to='/activities' loading={loading} disabled={loading} floated="right" type="button" content="Cancel"></Button>
                    </Form>
                )}
            </Formik>
        </Segment>
    )
};

export default observer(ActivityForm);
