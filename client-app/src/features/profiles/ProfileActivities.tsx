import { observer } from "mobx-react-lite";
import { Card, CardGroup, Grid, GridColumn, Header, TabPane, Image, Menu, MenuItem, CardHeader, CardDescription, CardMeta, CardContent, Tab, TabProps } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { Link } from "react-router-dom";
import { SyntheticEvent, useEffect, useState } from "react";
import { Profile } from "../../app/models/profile";
import { format } from "date-fns";

interface Props {
  profile: Profile
}

const ProfileActivities = ({ profile }: Props) => {
  const { profileStore: { loadActivities, loadingActivities, activities } } = useStore();
  useEffect(() => {
    loadActivities(profile.userName, undefined)
  }, [])

  const handleTabChange = (e: SyntheticEvent, data: TabProps) => {
    loadActivities(profile!.userName, panes[data.activeIndex as
    number].pane.key);
    };

  const panes = [
    { menuItem: 'Future Events', pane: { key: 'future' } },
    { menuItem: 'Past Events', pane: { key: 'past' } },
    { menuItem: 'Hosting', pane: { key: 'hosting' } }
  ];

  return (
    <TabPane loading={loadingActivities}>
      <Grid>
        <GridColumn width={16}>
          <Header
            floated="left"
            icon='calendar'
            content={"Activities"}
          />
        </GridColumn>
        <GridColumn width={16}>
          <Tab
            panes={panes}
            menu={{ secondary: true, pointing: true }}
            onTabChange={(e, data) => handleTabChange(e, data)}
          />
          <br />
          <CardGroup itemsPerRow={4}>
            {activities.map(activity => (
              <Card as={Link} to={`/activities/${activity?.id}`} key={activity?.id}>
                <Image src={`/assets/categoryImages/${activity?.category}.jpg`} wrapped ui={false} />
                <CardContent>
                  <CardHeader textAlign="center">{activity?.title}</CardHeader>
                  <CardMeta textAlign="center">
                    <div>{format(new Date(activity.date!),
                      'do LLL')}</div>
                    <div>{format(new Date(activity.date!),
                      'h:mm a')}</div>
                  </CardMeta>
                </CardContent>
              </Card>
            ))}
          </CardGroup>
        </GridColumn>
      </Grid>
    </TabPane>
  )
};

export default observer(ProfileActivities);
