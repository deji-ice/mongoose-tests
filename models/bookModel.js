import { model, Schema } from "mongoose";

const bookSchema = new Schema({
    title: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    ISBN: {
      type: String,
      required: true,
      unique: true
    },
    copiesAvailable: {
      type: Number,
      required: true,
      default: 1
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
  const Book = model('Book', bookSchema);
  
  export default Book;