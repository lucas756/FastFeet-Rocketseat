import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/User';
import authConfig from '../../config/auth';

class LoginController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .required()
        .email(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ message: 'Todos os campos devem ser preenchidos' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Email ou senha incorreto' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Verifique suas credenciais' });
    }
    const { id, name } = user;
    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new LoginController();
