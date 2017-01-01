import assert from 'assert';


class MongooseFakerSchema {
  constructor(parser) {
    this.parser = parser;
  }

  parseValidate(name, path, parent) {
    let validates = {};

    if(path.enumValues && path.enumValues.length > 0) {
      validates.enum = path.enumValues;
    }

    if(path.isRequired) {
      parent.required.push(name);
    }

    return validates;
  }

  parse(name, path) {
    let type;
    let json;
    let current;
    let validates;
    
    type = path.instance.toLowerCase();
    current = this.ensureNestedField(name);
    name = name.split('.').pop();

    if(type === 'object') {
      json = MongooseFakerSchema.createDefaultObjectSchema(name);
    }
    else {
      json = MongooseFakerSchema.createNormalSchema(name, type);
    }

    validates = this.parseValidate(name, path, current);
    Object.assign(json, validates);
    console.log('parent: ', current);
    console.log('name', name);
    console.log(json);
    console.log('------------------');

    current.properties[name] = json;

    return;
  }

  ensureNestedField(name, path) {
    let seps = name.split('.');
    let target = seps.pop();
    let parent = this.parser.json;

    seps.forEach(it => {
      parent.properties[it] = MongooseFakerSchema.createDefaultObjectSchema(it);
      parent = parent.properties[it];
    });

    return parent;
  }

  static createNormalSchema(field, type) {
    return {
      type,
      description: 'A ' + field + ' normal schema. '
    };
  }

  static createDefaultObjectSchema(field, preset) {
    return (preset && preset[field]) || {
      title: field,
      properties: {},
      type: 'object',
      description: 'A ' + field + ' object schema.',
      required: []
    };
  }
}

class MongooseSchemaParser {
  constructor() {
    this.exceptions = ['_id', '__v'];
  }

  mockObjectSchema(name) {
    return MongooseFakerSchema.createDefaultObjectSchema(name);
  }

  parse(name, model) {
    const schema = model.schema;    

    this.json = this.mockObjectSchema(name);
    this.json.description = 'A ' + name + " JSON model schema.";

    schema.eachPath((name, path) => {
      if(-1 === this.exceptions.indexOf(name)) {
        let field = new MongooseFakerSchema(this);
        field.parse(name, path);
      }
    });

    // console.dir(this.json.properties, { colors: true });
    console.log(JSON.stringify(this.json, null, 4));

    return;
  }
}

export default function loadModels(models) {
  Object.keys(models).forEach(name => {
    let parser = new MongooseSchemaParser();
    parser.parse(name, models[name]);
  });
}