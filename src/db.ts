import mongoose, { Schema, model, Types } from "mongoose";
mongoose.connect("mongodb+srv://mandadijaideep:s3I2jEqtIMkMQumA@second-brain.qcrx6we.mongodb.net/secondbrain");

const User = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
})
const tagschema = new Schema({
    title: {
        type: String, required: true, unique: true
    }
})
const enumobj = ['youtube', 'twitter'];
const contentSchema = new Schema({
    link: { type: String, required: true },
    type: { type: String, enum: enumobj, required: true },
    title: { type: String, required: true },
    tags: [{ type: String }],
    description: { type: String },
    userid: { type: Types.ObjectId, ref: 'users', required: true }
})
const linkSchema = new Schema({
    hash: {
        type: String, required: true, unique: true
    },
    userid: { type: Types.ObjectId, ref: 'users', required: true, unique: true }
})

export const TagModel = model('tags', tagschema);
export const ContentModel = model('content', contentSchema);
export const LinkModel = model('links', linkSchema);

export const UserModel = model('users', User);

