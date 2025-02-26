import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    tasks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task"
        }
    ],
    email: {
        unique: true,
        type: String,
        required: true
    }
});

userSchema.set('toJSON', {
    transform: (_document: mongoose.Document, returnedObject: any) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.password;
    }
});

const User = mongoose.model('User', userSchema);

export {
    userSchema,
    User
}