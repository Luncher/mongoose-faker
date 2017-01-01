import faker from 'faker';
import jsf from 'json-schema-faker';
import mongoose from 'mongoose';
import models from './models';
import loadModels from './parse_mongo_schema';


loadModels(models);
// mongoose.connect('mongodb://localhost/local_test');

