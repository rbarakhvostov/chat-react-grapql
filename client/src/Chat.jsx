import React from 'react'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from '@apollo/client'
import { Container, Row, Col, FormInput, Button } from 'shards-react'

const client = new ApolloClient({
  uri: 'http://0.0.0.0:4000/graphql',
  cache: new InMemoryCache(),
});

const GET_MESSAGES = gql`
query {
  messages {
    id
    content
    user
  }
}
`

const Messages = ({ user }) => {
  const { data } = useQuery(GET_MESSAGES)

  if (!data) {
    return null;
  }

  return (
    <>
      {data.messages.map(({id, user: messageUser, content}) => (
        <div
          key={id}
          style={{
            display: "flex",
            justifyContent: user === messageUser ? "flex-end" : "flex-start",
            alignItems: "center",
            paddingBottom: "1em",
          }}
        >
          {user !== messageUser && (
            <div
              style={{
                height: 50,
                width: 50,
                marginRight: "0.5em",
                border: "2px solid #e5e6ea",
                borderRadius: 25,
                textAlign: "center",
                fontSize: "18px",
                paddingTop: "10px"
              }}
            >
              {messageUser.slice(0,2).toUpperCase()}
            </div>
          )}
          <div
            style={{
              background: user === messageUser ? "#58bf56" : "#e5e6ea",
              color: user === messageUser ? "white" : "#black",
              padding: "1em",
              borderRadius: "1em",
              maxWidth: "60%"
            }}
          >
            {content}
          </div>
        </div>
      ))}
    </>
  )
}

const Chat = () => {
  const [state, setState] = React.useState({
    user: '',
    content: ''
  })

  const onSend = () => {
    if (state.content.length) {

    }

    setState({
      ...state,
      content: ''
    })
  }

  return (
    <Container>
      <Messages user="Roman" />
      <Row>
        <Col xs="2" style={{padding: 0}}>
          <FormInput
            label="User"
            value={state.user}
            placeholder="name"
            onChange={evt => setState({
              ...state,
              user: evt.target.value
            })}
          />
        </Col>
        <Col>
          <FormInput
            label="Content"
            value={state.content}
            placeholder="message"
            onChange={evt => setState({
              ...state,
              content: evt.target.value
            })}
            onKeyUp={evt => {
              if (evt.keyCode === 13) {
                onSend()
              }
            }}
          />
        </Col>
        <Col xs="2" style={{padding: 0}}>
          <Button onClick={() => onSend()}>Send</Button>
        </Col>
      </Row>
    </Container>
  )
}

export default () => (
  <ApolloProvider client={client}>
    <Chat />
  </ApolloProvider>
)
