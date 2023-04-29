import { Schema, model } from 'mongoose';

const customerSchema = new Schema({
  userId: {
    type: String,
    require: true
  },
  serverId: {
    type: String,
    require: true
  }
});

const Winners = model('winner', customerSchema);

export default Winners;
