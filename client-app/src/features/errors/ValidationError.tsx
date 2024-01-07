import { Message, MessageList } from "semantic-ui-react";

interface Props{
    errors: string[];
}
const ValidationError = ({errors}: Props) => {
  return (
    <Message error>
      {errors  && (
        <MessageList>
          
            { errors.map((error: string, i) => 
                (<Message.Item key={i}>{error}</Message.Item>)
            )}
        </MessageList>
      )}
    </Message>
  )
};

export default ValidationError;
