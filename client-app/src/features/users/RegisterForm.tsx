import { Button, Header } from "semantic-ui-react";
import { Formik, Form, ErrorMessage } from "formik";
import MyTextInput from "../../app/common/form/MyTextInput";
import * as Yup from "yup";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import ValidationError from "../errors/ValidationError";

const RegisterForm = () => {
    const { userStore } = useStore();

    const validationSchema = Yup.object({
        userName: Yup.string().required(),
        displayName: Yup.string().required(),
        email: Yup.string().required().email(),
        password: Yup.string().required()
    })

    return (
            <Formik
                validationSchema={validationSchema}
                initialValues={{ email: '', password: '', error: '', displayName: '', userName: '' }}
                onSubmit={(values, { setErrors }) => userStore.register(values).catch(error => setErrors({error}))}>
                {({ handleSubmit, errors, isSubmitting, isValid, dirty}) => (
                    <Form className='ui form error' onSubmit={handleSubmit} autoComplete='off'>
                        <Header as='h2' content='Sign up' color="teal" textAlign="center"></Header>
                        <MyTextInput placeholder='Display Name' name='displayName' ></MyTextInput>
                        <MyTextInput placeholder='User Name' name='userName' ></MyTextInput>
                        <MyTextInput placeholder='Email' name='email' ></MyTextInput>
                        <MyTextInput placeholder='Password' name='password' type="password" ></MyTextInput>
                        <ErrorMessage
                         name='error' render={() =>
                            <ValidationError errors={errors.error as unknown as string[]} />}
                        />
                        <Button loading={isSubmitting} 
                        disabled={!isValid || !dirty || isSubmitting}
                         fluid positive type="submit" content="Register"></Button>
                    </Form>
                )}
            </Formik>
    )
};

export default observer(RegisterForm);
