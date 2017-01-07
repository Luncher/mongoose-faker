import faker from 'faker';
import jsf from 'json-schema-faker';
import mongoose from 'mongoose';
import models from '../models';
import Parser from './parser';


export default function loadModels(models) {
  Object.keys(models).forEach(name => {
    let parser = new Parser();
    let json = parser.parse(name, models[name]);
    console.log('=========');
    let ret = jsf(json);
    console.log(JSON.stringify(ret, null, 4));
    let instance = new models[name](ret);
    instance.save(err => {
      console.log(err);
    });
  });
}

mongoose.connect('mongodb://127.0.0.1/local_test');
mongoose.set('debug', true);


loadModels(models);