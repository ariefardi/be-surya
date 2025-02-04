import { User } from "../models/User";
import { isEmail } from "validator";
export const typeDefs = `
  type User {
    id: Int!
    name: String!
    email: String!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    users: [User!]!
    user(id: Int!): User
  }

  type Mutation {
    createUser(name: String!, email: String!): User!
    updateUser(id: Int!, name: String, email: String): User!
  }
`;

export const resolvers = {
    Query: {
        users: async () => {
            return User.findAll();
        },
        user: async (_: any, { id }: { id: number }) => {
            return User.findByPk(id);
        },
    },
    Mutation: {
        createUser: async (
            _: any,
            { name, email }: { name: string; email: string },
        ) => {
            if (!isEmail(email)) {
                throw new Error("Invalid email address");
            }
            return User.create({ name, email });
        },
        updateUser: async (
            _: any,
            { id, name, email }: { id: number; name?: string; email?: string },
        ) => {
            const user = await User.findByPk(id);
            if (!user) throw new Error("User not found");
            if (name) user.name = name;
            if (email) user.email = email;
            await user.save();
            return user;
        },
    },
};
