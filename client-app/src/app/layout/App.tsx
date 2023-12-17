import { useEffect, useState } from 'react'
import { Container } from 'semantic-ui-react';
import { IActivity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dasboard/ActivityDashboard';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite'

function App() {
  const { activityStore } = useStore();
  const [] = useState<IActivity | undefined>();
  const [] = useState(false);

  useEffect(() => {
    activityStore.loadActicitvies()
  }, [activityStore])

  if (activityStore.loadInitial) return <LoadingComponent content='Loading app'></LoadingComponent>

  return (
    <>
      <NavBar/>
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard />
      </Container>
    </>
  )
}

export default observer(App)

