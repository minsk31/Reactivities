import { observer } from "mobx-react-lite";
import { CardGroup, Header, TabPane, Image, Card, Grid, GridColumn, Button, ButtonGroup } from "semantic-ui-react";
import { Photo, Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";
import { useState } from "react";
import PhotoUpload from "../../app/common/widgets/PhotoUploadWidget";

interface Props {
    profile: Profile
}

const ProfilePhotos = ({ profile }: Props) => {
    const { profileStore: { IsCurrentUser, uploadPhoto, uploading, loading, setMainPhoto, deletePhoto} } = useStore();
    const [addPhotoMode, setAddPhotoMode] = useState(false);
    const [target, setTarget] = useState('');

    function handlephotoUploade(file: Blob) {
        uploadPhoto(file).then(() => setAddPhotoMode(false))
    }

    function onSetMainClick(photo: Photo, e: React.SyntheticEvent<HTMLButtonElement>): void {
        setTarget(e.currentTarget.name);
        setMainPhoto(photo);
    }

    function onRemoveClick(photoId: string, e: React.SyntheticEvent<HTMLButtonElement>): void {
        setTarget(e.currentTarget.name);
        deletePhoto(photoId);
    }

    return (
        <TabPane>
            <Grid>
                <GridColumn width={16}>
                    <Header floated="left" icon='image' content='Photos'></Header>
                    {IsCurrentUser && (
                        <Button floated="right" basic
                            content={addPhotoMode ? 'Cancel' : 'Add Photo'}
                            onClick={() => setAddPhotoMode(!addPhotoMode)}
                        >
                        </Button>
                    )}
                </GridColumn>
                <GridColumn width={16}>
                    {addPhotoMode ? (
                        <PhotoUpload uploadPhoto={handlephotoUploade} loading={uploading}/>
                    ) : (

                        <CardGroup itemsPerRow={5}>
                            {profile.photos?.map(photo =>
                            (<Card key={photo.id}>
                                <Image src={photo.image || '/assets/user.png'} />
                                {IsCurrentUser && (
                                    <ButtonGroup fluid widths={2}>
                                        <Button
                                        basic
                                        color="green"
                                        content='Main'
                                        name={'setMain_' + photo.id}
                                        disabled={photo.isMain}
                                        onClick={e => onSetMainClick(photo, e)}
                                        loading={ (target === 'setMain_' + photo.id && loading)}
                                        >
                                        </Button>
                                        <Button
                                        basic
                                        color="red"
                                        icon='trash'
                                        name={'remove_'+ photo.id}
                                        disabled={photo.isMain}
                                        onClick={e => onRemoveClick(photo.id, e)}
                                        loading={ (target === 'remove_'+ photo.id && loading)}
                                        ></Button>
                                    </ButtonGroup>
                                )}
                            </Card>)
                            )}

                        </CardGroup>
                    )}
                </GridColumn>
            </Grid>
        </TabPane>
    )
};

export default observer(ProfilePhotos);
