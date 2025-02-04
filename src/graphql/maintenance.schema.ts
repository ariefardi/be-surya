import { MaintenanceRequest } from "../models/MaintenanceRequest";
import { Op } from "sequelize";
export const typeDefs = `

  type MaintenanceRequest {
    id: Int!
    title: String!
    status: String!
    statusDisplay: String!
    description: String!
    isResolved: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    requests: [MaintenanceRequest!]!
    request(id: Int!): MaintenanceRequest
    openRequests: Int!
    averageResolutionTime: Float
    openUrgentRequests: Int!
  }

  type Mutation {
    createRequest(
      title: String!
      description: String!
      status: String!
      isResolved: Boolean
    ): MaintenanceRequest!
    
    updateRequest(
      id: Int!
      title: String
      description: String
      status: String
      isResolved: Boolean
      statusDisplay: String
    ): MaintenanceRequest!
  }
`;

export const resolvers = {
    // MaintenanceRequest: {
    //     statusDisplay: (parent: MaintenanceRequest) => parent.statusDisplay,
    // },
    Query: {
        requests: async () => {
            const requests = await MaintenanceRequest.findAll({
                order: [
                    ["isResolved", "ASC"], // Sort false (0) first, then true (1)
                    ["createdAt", "DESC"], // Optional: Sort by creation date as a secondary order
                ],
            });
            requests.forEach(request => request.escalateUrgency());
            return requests;
        },
        request: async (_: any, { id }: { id: number }) => {
            const request = await MaintenanceRequest.findByPk(id);
            if (request) request.escalateUrgency();
            return request;
        },
        openRequests: async () => {
            return MaintenanceRequest.count({
                where: { isResolved: false }, // Count only unresolved requests
            });
        },
        openUrgentRequests: async () => {
            return MaintenanceRequest.count({
                where: {
                    isResolved: false,
                    status: {
                        [Op.or]: ["emergency", "urgent"],
                    },
                },
            });
        },
        averageResolutionTime: async () => {
            const resolvedRequests = await MaintenanceRequest.findAll({
                where: { isResolved: true }, // Only include resolved requests
            });

            if (resolvedRequests.length === 0) {
                return 0; // No resolved requests, return 0
            }

            // Calculate total resolution time in milliseconds
            const totalResolutionTime = resolvedRequests.reduce(
                (sum, request) => {
                    if (request.resolvedAt && request.createdAt) {
                        return (
                            sum +
                            (request.resolvedAt.getTime() -
                                request.createdAt.getTime())
                        );
                    }
                    return sum;
                },
                0,
            );

            // Calculate average resolution time in hours
            const averageResolutionTimeMs =
                totalResolutionTime / resolvedRequests.length;
            const averageResolutionTimeHours =
                averageResolutionTimeMs / (1000 * 60 * 60);

            return averageResolutionTimeHours.toFixed(1);
        },
    },
    Mutation: {
        createRequest: async (
            _: any,
            {
                title,
                status,
                description,
                isResolved,
            }: {
                title: string;
                status: string;
                description: string;
                isResolved?: boolean;
            },
        ) => {
            return MaintenanceRequest.create({
                title,
                status,
                description,
                isResolved: isResolved || false,
            });
        },
        updateRequest: async (
            _: any,
            {
                id,
                title,
                status,
                isResolved,
            }: {
                id: number;
                title?: string;
                description?: string;
                status?: "non_urgent" | "less_urgent" | "urgent" | "emergency";
                isResolved?: boolean;
            },
        ) => {
            const request = await MaintenanceRequest.findByPk(id);
            if (!request) throw new Error("Request not found");

            if (title) request.title = title;
            if (status) request.status = status;

            // Update resolvedAt when isResolved changes to true
            if (typeof isResolved !== "undefined") {
                request.isResolved = isResolved;
                if (isResolved && !request.resolvedAt) {
                    request.resolvedAt = new Date(); // Set resolvedAt to current time
                } else if (!isResolved) {
                    request.resolvedAt = null; // Clear resolvedAt if request is reopened
                }
            }

            await request.save();
            return request;
        },
    },
};
