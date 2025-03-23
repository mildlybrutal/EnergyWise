import mongoose, { Schema, Document } from "mongoose";

export interface UserLog extends Document {
    _id: string;
    userId: string;
    unitsUsed: number;
    perUnitCost: number;
    totalBill: number;
    createdAt: Date;
}

const UserLogSchema: Schema<UserLog> = new Schema({
    unitsUsed: {
        type: Number,
        required: [true, "Please provide the units used"],
    },
    perUnitCost: {
        type: Number,
        required: [true, "Please provide the per unit cost"],
    },
    totalBill: {
        type: Number,
        required: [true, "Please provide the total bill"],
    },
});

const UserLogModel =
    (mongoose.models.UserLog as mongoose.Model<UserLog>) ||
    mongoose.model<UserLog>("User", UserLogSchema);

export default UserLogModel;
