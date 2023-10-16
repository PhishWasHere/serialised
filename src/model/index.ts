import mongoose, { Schema, Document } from 'mongoose';

const updatedSchema = new Schema(
    {
        title: {type: String, required: true},
        latest_chapter: {type: Schema.Types.Decimal128, required: false},
    }
)

const notUpdatedSchema = new Schema(
    {
        title: {type: String, required: true},
        latest_chapter: {type: Schema.Types.Decimal128, required: false},
    }
)

const notFoundSchema = new Schema(
    {
        title: {type: String, required: true},
    }
)

const errSchema = new Schema(
    {
        title: {type: String, required: true},
    }
)

const followSchema = new Schema(
    {
        title: {type: String, required: true},
        md_chapter: {type: Schema.Types.Decimal128, required: false},
        latest_chapter: {type: Schema.Types.Decimal128, required: false},
        created_at: {type: Date, default: Date.now},
    }
);

const userSchema = new Schema(
    {
        user_id: {type: String, required: true},
        error: {type: String, required: false},
        follow_list: {type: [followSchema], required: false},
        updated_list: {type: [updatedSchema], required: false},
        not_updated_list: {type: [notUpdatedSchema], required: false},
        not_found_list: {type: [notFoundSchema], required: false},
        error_list: {type: [errSchema], required: false},
        created_at: {type: Date, default: Date.now},
    },
    {   
        expireAfterSeconds: 300, // 5 minutes
    }
);

interface IUser extends Document {
    user_id: string;
    error: string
    follow_list: Array<{
        title: string;
        md_chapter: number | undefined; 
        latest_chapter: number | undefined;
    }>;
    updated_list: Array<{
        title: string;
        latest_chapter: number;
    }>;
    not_updated_list: Array<{
        title: string;
        latest_chapter: number;
    }>;
    not_found_list: Array<{
        title: string;
    }>;
    error_list: Array<{
        title: string;
    }>;
    created_at: Date;
}

const User = mongoose.model<IUser>('User', userSchema);
export default User;