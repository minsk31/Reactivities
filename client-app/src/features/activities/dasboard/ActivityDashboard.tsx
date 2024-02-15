import { Grid, Loader } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import ActivityFilters from "./ActivityFilters";
import { PagingParams } from "../../../app/models/pagination";
import InfiniteScroll from "react-infinite-scroller";
import ActivityListItemPlaceholder from "./ActivityListItemPlaceholder";

export default observer(function ActivityDashboard() {
    const { activityStore } = useStore();
    const { loadActicitvies, activitiesRegistry, setPagingParams, pagination } = activityStore;
    const [loadingNext, setLoadingNext] = useState(false);

    function handleGetNext() {
        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.currentPage + 1));
        loadActicitvies(false).then(() => setLoadingNext(false));
    }

    useEffect(() => {
        if (activitiesRegistry.size <= 1) activityStore.loadActicitvies();
    }, [loadActicitvies, activitiesRegistry.size])

    //if (activityStore.loadInitial) return <LoadingComponent content='Loading app'></LoadingComponent>

    return (
        <Grid>
            <Grid.Column width='10'>
                {activityStore.loadInitial && !loadingNext && activitiesRegistry.size === 0 ? (
                    <>
                        <ActivityListItemPlaceholder></ActivityListItemPlaceholder>
                        <ActivityListItemPlaceholder></ActivityListItemPlaceholder>
                    </>
                ) : (
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={handleGetNext}
                            hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
                            initialLoad={false}
                        >
                            <ActivityList />
                        </InfiniteScroll>
                )}

            </Grid.Column>
            <Grid.Column width='6'>
                <ActivityFilters></ActivityFilters>
            </Grid.Column>
            <Grid.Column width={10}>
                <Loader active={loadingNext} />
            </Grid.Column>
        </Grid>
    )
})