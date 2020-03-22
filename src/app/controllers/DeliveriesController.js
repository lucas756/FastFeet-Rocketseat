import * as Yup from 'yup';
import Deliveries from '../models/Deliveries';
import User from '../models/User';

class DeliveriesController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .required()
        .min(3)
        .max(50),
      email: Yup.string()
        .required()
        .email(),
    });

    const user = await User.findByPk(req.userId);

    if (user.dataValues.admin === false) {
      return res
        .status(401)
        .json({ error: 'Você não pode fazer isso idiotão' });
    }

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ message: 'Verifique os campos preenchidos!' });
    }

    const userExists = await Deliveries.findOne({
      where: { email: req.body.email },
    });

    if (userExists) {
      return res.status(400).json({ error: 'Delivery already exists.' });
    }

    const { name, email } = await Deliveries.create(req.body);

    return res.json({
      name,
      email,
    });
  }
  //-------------------------------------------------------------------------------------------

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      avatar_id: Yup.number(),
    });

    const user = await User.findByPk(req.userId);

    if (user.dataValues.admin === false) {
      return res
        .status(401)
        .json({ error: 'Você não pode fazer isso idiotão' });
    }

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { name, email } = req.body;

    const delivery = await Deliveries.findOne({ where: { email } });

    if (email && email !== delivery.email) {
      const DeliveryExists = await Deliveries.findOne({ where: { email } });
      if (DeliveryExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    delivery.update(req.body);
    return res.json({
      name,
      email,
    });
  }

  async index(req, res) {
    const user = await User.findByPk(req.userId);

    if (user.dataValues.admin === false) {
      return res
        .status(401)
        .json({ error: 'Você não pode fazer isso idiotão' });
    }
    const deliveries = await Deliveries.findAll();
    if (deliveries.length <= 0) {
      return res.status(201).json({ message: 'Nenhum entregador encontrado' });
    }
    return res.json(deliveries);
  }

  async delete(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
    });

    const user = await User.findByPk(req.userId);

    if (user.dataValues.admin === false) {
      return res
        .status(401)
        .json({ error: 'Você não pode fazer isso idiotão' });
    }
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email } = req.body;
    const delivery = await Deliveries.findOne({ where: { email } });
    if (delivery == null) {
      return res.status(404).json({ error: 'nenhum usuario encontrado' });
    }

    delivery.destroy(req.body);
    return res.json({ email });
  }
}

export default new DeliveriesController();
