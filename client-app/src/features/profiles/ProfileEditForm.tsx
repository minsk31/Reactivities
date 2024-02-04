import { Button, Segment } from "semantic-ui-react";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Formik, Form } from "formik";
import MyTextInput from "../../app/common/form/MyTextInput";
import * as Yup from "yup";
import MyTextArea from "../../app/common/form/MyTextArea";
import { useStore } from "../../app/stores/store";
import { Profile, ProfileFormValues } from "../../app/models/profile";

interface Props {
    profile: Profile,
    submit: (profileValues: ProfileFormValues) => void
}
const ProfileEditForm = ({ profile, submit}: Props) => {
    const { profileStore } = useStore();
    const { loading } = profileStore;
    const [, setProfileValues] = useState<ProfileFormValues>(new ProfileFormValues());

    const validationSchema = Yup.object({
        displayName: Yup.string().required('The profile display name is required'),
    })

    useEffect(() => {

        if (profile) {
            setProfileValues(new ProfileFormValues(profile))
        }
    }, [profile]);

    function HandleFormSubmit(profileValues: ProfileFormValues) {
        submit(profileValues);
    }

    return (
        <Segment clearing>
            <Formik
                validationSchema={validationSchema}
                enableReinitialize
                initialValues={profile}
                onSubmit={values => HandleFormSubmit(values)}>
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <MyTextInput placeholder='Display name' name='displayName' ></MyTextInput>
                        <MyTextArea rows={3} placeholder='Bio' name='bio' ></MyTextArea>
                        <Button loading={loading} disabled={isSubmitting || !dirty || !isValid} floated="right" positive type="submit" content="Update profile"></Button>
                    </Form>
                )}
            </Formik>
        </Segment>
    )
};

export default observer(ProfileEditForm);
