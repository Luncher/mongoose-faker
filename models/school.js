import config from '~/config/';
import mongoose from 'mongoose';
import {Schema} from 'mongoose';


const SchoolSchema = new Schema({
  name: {type: String, required: true, unique: true},
  classes: [{type: Schema.Types.ObjectId, ref: 'class'}]
});


export default mongoose.model('school', SchoolSchema);
