import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({

    profile: [
        {
            key: { type: String, default: '', maxlength: 30 },
            value: { type: String, default: '', maxlength: 200 }
        }
    ]

});
const User =  mongoose.model('User', UserSchema, 'User');
console.log(`debug: User Model getting registered`);
export default User;