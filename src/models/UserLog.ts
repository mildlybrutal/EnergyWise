import mongoose, { Schema, Document } from "mongoose";

export interface UserLog extends Document {
    _id: string;
    userId: mongoose.Types.ObjectId;
    unitsUsed: number;
    perUnitCost: number;
    totalBill: number;
    createdAt: Date;
}

const UserLogSchema: Schema<UserLog> = new Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: [true, "Please provide the user ID"],
    },
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
    mongoose.model<UserLog>("UserLog", UserLogSchema);

export default UserLogModel;
