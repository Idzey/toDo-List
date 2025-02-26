import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        required: true,
        default: false,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true,
    },
}, {timestamps: true});

todoSchema.set('toJSON', {
    transform: (_document: mongoose.Document, returnedObject: any) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const Todo = mongoose.model('Todo', todoSchema);

export {
    todoSchema,
    Todo
}