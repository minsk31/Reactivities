import { Link } from "react-router-dom";
import { Button, Header, Icon, Segment, SegmentInline } from "semantic-ui-react";

const NotFound = () => {
  return (
    <Segment placeholder>
      <Header icon>
        <Icon name="search"></Icon>
        Oops - we've looked everywhere but could not find what are you looking for!
      </Header>
      <SegmentInline>
        <Button as={Link} to='/activities'>Return to activities page</Button>
      </SegmentInline>
    </Segment>
  )
};

export default NotFound;
