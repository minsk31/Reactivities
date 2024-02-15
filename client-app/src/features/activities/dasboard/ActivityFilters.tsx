import Calendar from "react-calendar";
import { Header, Menu, MenuItem } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";

const ActivityFilters = () => {
  const { activityStore: { predicate, setPredicate } } = useStore();

  return (
    <>
      <Menu vertical size='large' style={{ width: '100%', marginTop: 25 }}>
        <Header icon='filter' attached color="teal" content='filters' />
        <MenuItem
          content='All activities'
          active={predicate.has('all')}
          onClick={() => setPredicate('all', 'true')}
        />
        <MenuItem content="I'm going"
          active={predicate.has('isGoing')}
          onClick={() => setPredicate('isGoing', 'true')}
        />
        <MenuItem content="I'm hosting"
          active={predicate.has('isHost')}
          onClick={() => setPredicate('isHost', 'true')}
        />
      </Menu>
      <Calendar
        onChange={(value) => setPredicate('startDate', value as Date) }
        value={predicate.get('startDate') || new Date()}
      ></Calendar>
    </>
  )
};

export default observer(ActivityFilters);
