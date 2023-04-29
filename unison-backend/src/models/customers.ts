import { Schema, model } from 'mongoose';

const customerSchema = new Schema({
  userId: {
    type: String,
    require: true
  },
  collabId: {
    type: Schema.Types.ObjectId,
    ref: 'collabs'
  },
  username: {
    type: String,
    require: true
  },
  discriminator: {
    type: String,
    require: true
  }
});

const Customer = model('customer', customerSchema);

export default Customer;
