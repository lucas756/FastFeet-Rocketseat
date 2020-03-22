import Sequelize, { Model } from 'sequelize';

class Orders extends Model {
  static init(sequelize) {
    super.init(
      {
        delivery_id: Sequelize.INTEGER,
        recipient_id: Sequelize.INTEGER,
        product: Sequelize.STRING,
        canceled_at: Sequelize.DATE,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Signatures, { foreignKey: 'signature_id' });
  }
}

export default Orders;
