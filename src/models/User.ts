import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
    _id: string;
    username: string;
    email: string;
    createdAt: Date;
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        trim: true,
        unique: true,
    }
});

const UserModel =
    (mongoose.models.User as mongoose.Model<User>) ||
    mongoose.model<User>("User", UserSchema);

export default UserModel;
