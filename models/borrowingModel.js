import { model, Schema } from "mongoose";

const borrowingSchema = new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    book: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true
    },
    borrowDate: {
      type: Date,
      default: Date.now,
      required: true
    },
    returnDate: {
      type: Date
    }
  });
  
  const Borrowing = model('Borrowing', borrowingSchema);
  
  export default Borrowing;