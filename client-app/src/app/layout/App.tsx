import { useEffect, useState } from 'react'
import { Container } from 'semantic-ui-react';
import { IActivity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dasboard/ActivityDashboard';
import { v4 as uuid } from 'uuid';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';

function App() {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | undefined>();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    agent.Activities.list()
      .then(response => {
        response.forEach(activity => activity.date = activity.date.split('T')[0]);
        setActivities(response);
        setLoading(false);
      })
  }, [])

  function handleSelectedActivity(id: string) {
    setSelectedActivity(activities.find(x => x.id == id))
  }

  function handleCancelSelectedActivity() {
    setSelectedActivity(undefined);
  }

  function handleFormOpen(id?: string) {
    id ? handleSelectedActivity(id) : handleCancelSelectedActivity();
    setEditMode(true);
  }

  function handleFormClose() {
    setEditMode(false);
  }

  function handleCreateOrEditActivity(activity: IActivity) {
    setSubmitting(true);
    let prom: Promise<any>;

    if (activity.id) {
      prom = agent.Activities.update(activity.id, activity).then(() => {
        setActivities([...activities.filter(x => x.id !== activity.id), activity]);
      })
    } else {
      activity.id = uuid();
      prom = agent.Activities.create(activity).then(() => {
        setActivities([...activities, activity])
      })
    }
    prom.then(() => {
      setSelectedActivity(activity);  
      setSubmitting(false);
      setEditMode(false);
    })
  }

  function handleDeleteActivity(id: string) {
    setSubmitting(true);
    agent.Activities.delete(id).then(() => {
      if (selectedActivity?.id === id) {
        setSelectedActivity(undefined);
      }
      setActivities([...activities.filter(x => x.id !== id)])
      setSubmitting(false);
    });

  }

  if (loading) return <LoadingComponent content='Loading app'></LoadingComponent>

  return (
    <>
      <NavBar openForm={handleFormOpen} />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={handleSelectedActivity}
          cancelActivity={handleCancelSelectedActivity}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateOrEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
        />
      </Container>
    </>
  )
}

export default App

