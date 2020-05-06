import mongoose from 'mongoose';

const QuestionsSchema = new mongoose.Schema({

    rating: { type: Number, min: 0, max: 5, required: true },
    userId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }

});

const Questions = mongoose.model('Questions', QuestionsSchema, 'Questions');
console.log(`debug: Questions Model getting registered`);
export default Questions;