class BaseDAO {
  constructor(Model) {
    this.Model = Model;
  }

  async findAll() {
    const entities = await this.Model.find();
    return entities.map(entity => this.formatEntity(entity));
  }

  async findById(id, options) {
    const populate = options && options.populate;
    let fields = '';
    let entity;
    if (populate) {
      fields = populate.join(' ');
      entity = await this.Model.findById(id).populate(fields);
    } else entity = await this.Model.findById(id);
    return this.formatEntity(entity);
  }

  async createEntity(entityData) {
    const entity = await this.Model.create(entityData);
    return this.formatEntity(entity);
  }

  async updateEntity(entityId, updateData) {
    const entity = await this.Model.findById(entityId);
    Object.entries(updateData).forEach(([key, value]) => {
      if (value) entity[key] = value;
    });
    const updatedEntity = await this.saveEntity(entity);
    return updatedEntity;
  }

  async deleteEntity(entityId) {
    const deletedEntity = await this.Model.findByIdAndRemove(entityId);
    return deletedEntity && this.formatEntity(deletedEntity);
  }

  async saveEntity(entity, withValidate) {
    const savedEntity = await entity.save({
      validateBeforeSave: withValidate,
    });
    return this.formatEntity(savedEntity);
  }

  formatEntity(entity) {
    if (!entity) return null;
    const formattedEntity = entity.toObject();
    formattedEntity.id = formattedEntity._id.toString();
    delete formattedEntity._id;
    delete formattedEntity.__v;
    return formattedEntity;
  }
}

module.exports = BaseDAO;
