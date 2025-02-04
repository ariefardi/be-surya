import { graphqlHTTP } from "express-graphql";
import { schema } from "../graphql/schema";

export const graphqlController = graphqlHTTP({
    schema,
    graphiql: true, // Enable GraphiQL for testing
});
