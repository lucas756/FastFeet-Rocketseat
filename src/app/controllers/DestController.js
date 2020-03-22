import * as Yup from 'yup';
import Dest from '../models/Dest';
import User from '../models/User';

class DestController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .required()
        .min(3)
        .max(50),
      rua: Yup.string().required(),
      numero: Yup.string()
        .required()
        .min(1)
        .max(8),
      complemento: Yup.string().required(),
      estado: Yup.string()
        .required()
        .min(2)
        .max(2),
      cidade: Yup.string().required(),
      cep: Yup.string()
        .required()
        .min(8)
        .max(8),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const user = await User.findByPk(req.userId);

    if (user.dataValues.admin === false) {
      return res
        .status(401)
        .json({ error: 'Você não pode fazer isso idiotão' });
    }

    const {
      name,
      rua,
      numero,
      complemento,
      estado,
      cidade,
      cep,
    } = await Dest.create(req.body);

    return res.json({
      name,
      rua,
      numero,
      complemento,
      estado,
      cidade,
      cep,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      name: Yup.string().required(),
      rua: Yup.string().required(),
      numero: Yup.string().required(),
      complemento: Yup.string().required(),
      estado: Yup.string().required(),
      cidade: Yup.string().required(),
      cep: Yup.string().required(),
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

    const dest = await Dest.findOne({ where: { id } });

    if (dest === null) {
      return res.status(400).json({ message: 'Usuário nao existe' });
    }

    dest.update(req.body);

    return res.json({
      id,
    });
  }
}

export default new DestController();
