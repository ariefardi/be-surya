import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";
import {
    typeDefs as maintenanceTypeDefs,
    resolvers as maintenanceResolvers,
} from "./maintenance.schema";
import {
    typeDefs as userTypeDefs,
    resolvers as userResolvers,
} from "./user.schema";

// Merge type definitions
const typeDefs = mergeTypeDefs([maintenanceTypeDefs, userTypeDefs]);

// Merge resolvers
const resolvers = mergeResolvers([maintenanceResolvers, userResolvers]);

// Create executable schema
export const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});
