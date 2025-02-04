import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    completed: Boolean,
    comments: Number,
    date: Date
}, {timestamps: true});

taskSchema.set('toJSON', {
    transform: (_document: mongoose.Document, returnedObject: any) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const Task = mongoose.model('Task', taskSchema);

export {
    Task
}