import Sequelize from 'sequelize';

import User from '../app/models/User';
import Dest from '../app/models/Dest';
import Deliveries from '../app/models/Deliveries';
import File from '../app/models/File';
import Orders from '../app/models/Orders';
import Signatures from '../app/models/Signatures';
import Problems from '../app/models/Problems';

import databaseConfig from '../config/database';

const models = [User, Dest, Deliveries, File, Orders, Signatures, Problems];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
