class MongooseFakerSchema {
  constructor(parser) {
    this.parser = parser;
  }

  isObject(path) {
    return path.instance && path.instance === 'Array';
  }

  normalizeType(origin, obj = {}) {
    let target;

    origin = origin.toLowerCase();
    
    if(origin === 'date') {
      target = 'string';
      obj.type = 'string';
      obj.format = 'date-time';
    }
    else {
      obj.type = origin;
    }

    return obj;
  }

  parseValidate(type, name, path, parent) {
    let validates = {};
    
    if(type === 'date') {
      validates.type = 'string';
      validates.format = 'date-time';
    }
    else if(type === 'array') {
      let subtype = path.options.type[0];
      validates.minItems = 2;
      validates.uniqueItems = true;
      validates.items = MongooseFakerSchema.createDefaultObjectSchema(name);
      if(subtype.type) {
        validates.items.type = subtype.type.name.toLowerCase();
      }
      else {
        Object.keys(subtype).forEach(k => {
          validates.items.properties[k] = this.normalizeType(subtype[k].type.name.toLowerCase());
        });
      }
    }

    if(path.enumValues && path.enumValues.length > 0) {
      validates.enum = path.enumValues;
    }

    if(path.isRequired || this.isObject(path)) {
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

    validates = this.parseValidate(type, name, path, current);
    Object.assign(json, validates);

    if(current.required) {
      current.required = [...new Set(current.required)];
    }

    current.properties[name] = json;

    return;
  }

  ensureNestedField(name, path) {
    let seps = name.split('.');
    let target = seps.pop();
    let parent = this.parser.json;

    seps.forEach(it => {
      parent.required.push(it);      
      parent.properties[it] = parent.properties[it] || 
        MongooseFakerSchema.createDefaultObjectSchema(it);
      parent = parent.properties[it];
    });

    //The nested prop default required
    if(seps.length > 0) {
      parent.required.push(target);
    }

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

export default class MongooseSchemaParser {
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

    if(this.json.required) {
      this.json.required = [...new Set(this.json.required)];
    }

    console.log(JSON.stringify(this.json, null, 4));

    return this.json;
  }
}

