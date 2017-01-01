import config from '~/config/';
import mongoose from 'mongoose';
import {Schema} from 'mongoose';

const ClassSchema = new Schema({
  name: {type: String, required: true, unique: true},
  count: {type: Number, required: true},
  users: [{
    user: {type: Schema.Types.ObjectId, ref: 'user'},
    height: {type: Number}
  }],
  users2: [{type: Schema.Types.ObjectId, ref: 'user'}]
});


export default mongoose.model('class', ClassSchema);
