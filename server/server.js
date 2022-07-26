import { createServer } from '@graphql-yoga/node'
import { PubSub } from 'graphql-subscriptions'

const messages = []

const pubsub = new PubSub()

const subscribers = []
const onMessagesUpdates = fn => subscribers.push(fn)

const typeDefs = `  
  type Message {
    id: ID! 
    user: String!
    content: String!
  }

  type Query {
    messages: [Message!]
  }

  type Mutation {
    postMessage(user: String!, content: String!): ID!
  }

  type Subscription {
    messages: [Message!]
  }
`
const resolvers = {
  Query: {
    messages() { return messages },
  },
  Mutation: {
    postMessage(_parent, {user, content}) {
      const id = messages.length;
      messages.push({
        id,
        user,
        content
      })

      subscribers.forEach(fn => fn())

      return id
    }
  },
  Subscription: {
    messages: {
      subscribe() { 
        const channel = Math.random().toString(36).slice(2, 15)
        onMessagesUpdates(() => pubsub.publish(channel, { messages }))
        setTimeout(() => pubsub.publish(channel, { messages }), 0)

        return pubsub.asyncIterator(channel)
      }
    }
  }
}

const server = createServer({
  schema: {
    typeDefs,
    resolvers
  },
})

server.start()
