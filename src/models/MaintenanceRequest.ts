import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
} from "sequelize-typescript";

@Table({ tableName: "maintenance_requests" })
export class MaintenanceRequest extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    title!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    description!: string;

    @Column({
        type: DataType.ENUM("non_urgent", "less_urgent", "urgent", "emergency"),
        defaultValue: "non_urgent",
    })
    status!: "non_urgent" | "less_urgent" | "urgent" | "emergency";

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    isResolved!: boolean;

    @Column({
        type: DataType.STRING,
        get() {
            const statusConfig: any = {
                non_urgent: "🙂 Non Urgent",
                less_urgent: "🔨 Less Urgent",
                urgent: "⚡ Urgent",
                emergency: "🔥 Emergency",
            };
            return statusConfig[this.getDataValue("status")];
        },
    })
    statusDisplay!: string;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    resolvedAt!: Date | null; // New column to track resolution time

    @CreatedAt
    createdAt!: Date;

    @UpdatedAt
    updatedAt!: Date;

    // Method to escalate urgency
    escalateUrgency(): void {
        const now = new Date();
        const timeDiff = now.getTime() - this.createdAt.getTime();

        if (
            this.status === "less_urgent" &&
            timeDiff > 3 * 24 * 60 * 60 * 1000
        ) {
            this.status = "urgent";
        } else if (this.status === "urgent" && timeDiff > 6 * 60 * 60 * 1000) {
            this.status = "emergency";
        }
    }
}
