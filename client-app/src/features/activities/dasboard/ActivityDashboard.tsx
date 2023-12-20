import { Button, Grid } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import LoadingComponent from "../../../app/layout/LoadingComponent";

export default observer(function ActivityDashboard() {
    const { activityStore } = useStore();
    const [counter, setCounter] = useState<number>(5);
    useEffect(() => {
        activityStore.loadActicitvies()
    }, [counter])

    if (activityStore.loadInitial) return <LoadingComponent content='Loading app'></LoadingComponent>

    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width='6'>
                <h2>Activity filters</h2>
                <Button onClick={() => setCounter(counter+1)}>Count</Button>
                <h2>{counter}</h2>
            </Grid.Column>
        </Grid>
    )
})