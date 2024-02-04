import { observer } from 'mobx-react-lite'
import { Segment, Header, Comment, Loader } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store';
import { useEffect } from 'react';
import { ChatComment } from '../../../app/models/comments';
import { Link } from 'react-router-dom';
import { Field, FieldProps, Form, Formik } from 'formik';
import * as Yup from "yup";
import {formatDistanceToNow} from 'date-fns'

interface Props {
    activityId: string;
}

export default observer(function ActivityDetailedChat({ activityId }: Props) {
    const { commentStore } = useStore();

    const validationSchema = Yup.object({
        body: Yup.string().required('Message is required'),
    })

    useEffect(() => {
        if (activityId) {
            commentStore.createHubConnection(activityId);
        }

        return () => {
            commentStore.clearComments();
        }

    }, [commentStore, activityId])

    return (
        <>
            <Segment
                textAlign='center'
                attached='top'
                inverted
                color='teal'
                style={{ border: 'none' }}
            >
                <Header>Chat about this event</Header>
            </Segment>
            <Segment attached clearing>
                <Comment.Group>
                    {commentStore.comments.map((comment: ChatComment) => (
                        <Comment key={comment.id}>
                            <Comment.Avatar src={comment.image || '/assets/user.png'} />
                            <Comment.Content>
                                <Comment.Author as={Link} to={`/profiles/${comment.userName}`}>
                                    {comment.displayName}
                                </Comment.Author>
                                <Comment.Metadata>
                                    <div>{formatDistanceToNow(comment.createdAt)}</div>
                                </Comment.Metadata>
                                <Comment.Text style={{ whiteSpace: 'pre-wrap' }}>{comment.body}</Comment.Text>
                            </Comment.Content>
                        </Comment>
                    ))}
                    <Formik
                        onSubmit={(values, { resetForm }) => commentStore.addComment(values.body).then(() => resetForm())}
                        initialValues={{ body: '' }}
                        validationSchema={validationSchema}
                    >
                        {({ isValid, isSubmitting, handleSubmit }) => (
                            <Form className='ui form'>
                                <Field name='body'>
                                    {(props: FieldProps) => (
                                        <div style={{ position: 'relative' }}>
                                            <Loader active={isSubmitting} />
                                            <textarea
                                                placeholder='Enter your comment'
                                                rows={2}
                                                {...props.field}
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter' && e.shiftKey) return;

                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault;
                                                        isValid && handleSubmit();
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                </Field>
                            </Form>
                        )}
                    </Formik>
                </Comment.Group>
            </Segment>
        </>
    )
})