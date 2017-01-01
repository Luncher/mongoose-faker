import config from '~/config/';
import mongoose from 'mongoose';
import {Schema, ObjectId} from 'mongoose';


const UserSchema = new Schema({
  age: {type: Number, required: true},
  name: {type: String, required: true, unique: true},
  gender: {type: String, enum: config.gender, required: true},
  profile: {
    field1: {type: String},
    field2: {type: String},
    field3: [{type: Boolean}],
    field4: {
      k: {type: String, required: true, unique: true}
    }
  }
});


export default mongoose.model('user', UserSchema);