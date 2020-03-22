import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .required()
        .min(3)
        .max(50),
      login: Yup.string()
        .required()
        .min(3)
        .max(10),
      email: Yup.string()
        .required()
        .email(),
      password: Yup.string()
        .required()
        .min(8)
        .max(15),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const { id, name, login, email } = await User.create(req.body);

    return res.json({
      id,
      name,
      login,
      email,
    });
  }

  async index(req, res) {
    const user = await User.findAll();
    return res.json(user);
  }

  // update de dados do usuario

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email && email !== user.email) {
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Senha antiga incorreta' });
    }

    const { id, name } = await user.update(req.body);
    console.log(req.body);

    return res.json({
      id,
      name,
    });
  }
}

export default new UserController();
