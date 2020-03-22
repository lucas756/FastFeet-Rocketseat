import * as Yup from 'yup';
import Sequelize from 'sequelize';
import Orders from '../models/Orders';
import User from '../models/User';
import Deliveries from '../models/Deliveries';
import Dest from '../models/Dest';

const nodemailer = require('nodemailer');

const moment = require('moment');

class OrdersController {
  async store(req, res) {
    const schema = Yup.object().shape({
      delivery_id: Yup.number().required(),
      recipient_id: Yup.number().required(),
      product: Yup.string().required(),
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

    const recipient = await Dest.findByPk(req.body.recipient_id);

    if (recipient == null) {
      return res.status(404).json({ error: 'Destinatario nao encontrado' });
    }

    const delivery = await Deliveries.findByPk(req.body.delivery_id);

    if (delivery == null) {
      return res.status(404).json({ error: 'entregador nao encontrado' });
    }

    Orders.create(req.body);

    const detailsOrders = await Dest.findAll({
      where: { id: req.body.recipient_id },
    });

    const reg = detailsOrders[0].dataValues;
    const emailDelivery = delivery.dataValues.email;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'souzasandre21@gmail.com',
        pass: 'wweb wptn dowb wgsq',
      },
    });

    const mailOptions = {
      from: 'souzasandre21@gmail.com',
      to: emailDelivery,
      subject: 'Nova Entrega para Você',
      text: `A entrega: ${reg.id} foi direcionada para você. Retire o quanto antes.
      endereço de entrega:
      ${reg.rua},
      ${reg.numero}
      ${reg.cidade}
      ${reg.estado}
      ${reg.cep}.
      Cliente: ${reg.name}`,
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent: ${info.response}`);
        console.log('email enviado com sucesso');
      }
    });
    return res.json({ ok: true });
  }

  async index(req, res) {
    const delivery = await Orders.findAll({
      where: {
        delivery_id: req.params.id,
        end_date: null,
        canceled_at: null,
      },
    });

    return res.json(delivery);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      start_date: Yup.date(),
      end_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails aaaaaaaaaaaa' });
    }
    const dateInitial = `${moment(new Date())
      .format()
      .substr(0, 10)}T00:00:00.000Z`;

    const dateFinal = `${moment(new Date())
      .format()
      .substr(0, 10)}T23:59:59.000Z`;

    const { Op } = Sequelize;
    const deliveries = await Orders.findAll({
      where: {
        delivery_id: req.body.delivery_id,
        start_date: {
          [Op.ne]: null,
          [Op.gte]: new Date(dateInitial),
          [Op.lte]: new Date(dateFinal),
        },
      },
    });

    if (deliveries.length < 0 || deliveries.length >= 5) {
      return res.status(400).json({ error: 'nao pode ser mais q 5' });
    }

    const { id } = req.body;
    const orders = await Orders.findOne({
      where: { id },
    });

    if (orders === null) {
      return res.status(400).json({ message: 'Encomenda nao existe' });
    }
    orders.update(req.body);
    return res.json({
      id,
    });
  }

  async delete(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
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
    const { id } = req.body;

    const orders = await Orders.findOne({ where: { id } });

    if (orders === null) {
      return res.status(401).json({ error: 'Encomenda nao encontrada' });
    }

    orders.destroy(req.body);
    return res.json({
      id,
    });
  }
}

export default new OrdersController();
