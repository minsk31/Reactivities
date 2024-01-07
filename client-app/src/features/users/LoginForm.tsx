import { Button, Header, Label, Segment } from "semantic-ui-react";
import { Login } from "../../app/models/login";
import { Formik, Form, FormikErrors, ErrorMessage } from "formik";
import MyTextInput from "../../app/common/form/MyTextInput";
import * as Yup from "yup";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";

const LoginForm = () => {
    const { userStore } = useStore();

    const validationSchema = Yup.object({
        email: Yup.string().required().email(),
        password: Yup.string().required()
    })

    function HandleFormSubmit(loginForm: Login, setErrors: { (errors: FormikErrors<{ email: string; password: string; error: string; }>): void; (arg0: { error: any; }): any; }) {
        userStore.login(loginForm)
            .catch(error => setErrors({error: 'Something wrong in your credentials' }))
    }

    return (
        <Segment clearing>
            <Formik
                validationSchema={validationSchema}
                initialValues={{ email: '', password: '', error: '' }}
                onSubmit={(values, { setErrors }) => HandleFormSubmit(values, setErrors)}>
                {({ handleSubmit, errors, isSubmitting}) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <Header as='h2' content='Login to Reactivities' color="teal" textAlign="center"></Header>
                        <MyTextInput placeholder='Email' name='email' ></MyTextInput>
                        <MyTextInput placeholder='Password' name='password' type="password" ></MyTextInput>
                        <ErrorMessage name='error' render={() =>
                            <Label style={{ marginBottom: 10 }} basic color='red' content={errors.error} />}
                        />
                        <Button loading={isSubmitting} fluid positive type="submit" content="Login"></Button>
                    </Form>
                )}
            </Formik>
        </Segment>
    )
};

export default observer(LoginForm);
