import { Schema, model } from 'mongoose';

const customerSchema = new Schema({
  userId: {
    type: String,
    require: true
  },
  serverId: {
    type: String,
    require: true
  },
  collabId: {
    type: Schema.Types.ObjectId,
    ref: 'collabs'
  },
});

const Winners = model('winner', customerSchema);

export default Winners;
