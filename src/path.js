import mongoose from 'mongoose';


const MONGOOSE_TYPES = mongoose.Schema.Types;
const JSONSCHEMA_TYPES = ['boolean', 'integer', 'string', 'object', 'array'];


//not support buffer type
const MONGOOSETYPES_MAPPING = {
  'Array': 'array',
  'Date': 'string',
  'Mixed': 'string',
  'String': 'string',
  'Number': 'integer',
  'Boolean': 'boolean',
  'ObjectId': 'string',
  'Object': 'object'
};

class PathBase {
  constructor(path, options) {
    this.type;        
    this.path = path;
    this.options = options;
  }

  toJSON() {

  }

  makeExtFeature() {

  }

  parse() {
    this.mockPath();
    this.parseAttribute();
    this.makeExtFeature();
  }
}

class IntegerPath extends PathBase {
  constructor() {
    super.constructor();
  }
}

class StringPath extends PathBase {
  constructor() {

  }
}

class ObjectPath extends PathBase {
  constructor() {

  }
}

class ArrayPath extends PathBase {
  constructor() {

  }
}

class MockMongoosePath {
  constructor(path) {
    this.path = path;
  }

  type() {
    return this.type || 
      (this.type = this.path.instance.toLowerCase());
  }

  jsonPathName() {
    
  }

  isRequired() {

  }

  isEnumrable() {

  }

  isValidatePath() {

  }

  attribute() {

  }
}

export default function makePath(path, options) {
  const mongoPath = new MockMongoosePath(path);
  const jsonPathName = mongoPath.jsonPathName();
  return new jsonPathName(mongoPath, options);
}