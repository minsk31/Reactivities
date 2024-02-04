import { Grid, GridColumn } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { useParams } from "react-router-dom";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import ActivityDetailedSidebar from "./ActivityDetailedSidebar";
import ActivityDetailedHeader from "./ActivityDetailedHeader";
import ActivityDetailedInfo from "./ActivityDetailedInfo";
import ActivityDetailedChat from "./ActivityDetailedChat";

export default observer(function ActivityDetails() {
    const { activityStore } = useStore();
    const { selectedActivity, loadActivity, loadInitial, clearSelectedActivity } = activityStore;
    const { id } = useParams();

    useEffect(() => {

        if (id) {
            setTimeout(() => { loadActivity(id) }, 500)
        }

        return () => clearSelectedActivity();

    }, [id, loadActivity, clearSelectedActivity]);

    if (loadInitial || !selectedActivity) return <LoadingComponent content='Loading activity details'></LoadingComponent>

    return (
        <Grid>
            <GridColumn width={10}>
                <ActivityDetailedHeader activity={selectedActivity!}/>
                <ActivityDetailedInfo activity={selectedActivity!}/>
                <ActivityDetailedChat activityId={selectedActivity.id} />
            </GridColumn>
            <GridColumn width={6}>
                    <ActivityDetailedSidebar activity={selectedActivity!}/>
            </GridColumn>
        </Grid>
    )
})