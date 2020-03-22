import * as Yup from 'yup';
import Problems from '../models/Problems';
import User from '../models/User';
import Orders from '../models/Orders';

class ProblemsController {
  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;
    const { description } = req.body;
    const problem = await Problems.create({
      delivery_id: id,
      description,
    });
    return res.json(problem);
  }

  async index(req, res) {
    const user = await User.findByPk(req.userId);

    if (user.dataValues.admin === false) {
      return res
        .status(401)
        .json({ error: 'Você não pode fazer isso idiotão' });
    }

    const problemsList = await Problems.findAll({
      where: { delivery_id: req.params.id },
    });

    return res.json(problemsList);
  }

  async delete(req, res) {
    const user = await User.findByPk(req.userId);

    if (user.dataValues.admin === false) {
      return res
        .status(401)
        .json({ error: 'Você não pode fazer isso idiotão' });
    }

    const cancel = await Problems.destroy({
      where: { id: req.params.id },
    });

    return res.json(cancel);
  }
}

export default new ProblemsController();
