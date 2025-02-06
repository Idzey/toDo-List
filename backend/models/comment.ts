import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    taskId: mongoose.Schema.Types.ObjectId,
}, {timestamps: true});

commentSchema.set('toJSON', {
    transform: (_document: mongoose.Document, returnedObject: any) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const Comment = mongoose.model('Comment', commentSchema);

export {
    commentSchema,
    Comment
}