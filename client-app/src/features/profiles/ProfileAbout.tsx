import { useState } from "react";
import { Profile, ProfileFormValues } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";
import { Button, Grid, GridColumn, Header, TabPane } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import ProfileEditForm from "./ProfileEditForm";

interface Props {
  profile: Profile
}

const ProfileAbout = ({ profile }: Props) => {
  const { profileStore: { IsCurrentUser, editProfile } } = useStore();
  const [editMode, setEditMode] = useState(false);

  function handlephotoUploade(profileFormValues: ProfileFormValues) {
    editProfile(profileFormValues).then(() => setEditMode(false));
  }

  return (
    <TabPane>
      <Grid>
        <GridColumn width={16}>
          <Header floated="left" icon='user' content={`About ${profile.displayName}`}></Header>
          {IsCurrentUser && (
            <Button floated="right" basic
              content={editMode ? 'Cancel' : 'Edit Profile'}
              onClick={() => setEditMode(!editMode)}
            >
            </Button>
          )
          }
        </GridColumn>
        <GridColumn width={16}>
          {IsCurrentUser && editMode ? (
            <ProfileEditForm submit={handlephotoUploade} profile={profile} />
          ) : (
            <span style={{ whiteSpace: 'pre-wrap' }}>
              {profile.bio}
            </span>
          )}
        </GridColumn>
      </Grid>
    </TabPane>
  )
};

export default observer(ProfileAbout);
