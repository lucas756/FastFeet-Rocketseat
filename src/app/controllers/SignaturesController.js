import Signatures from '../models/Signatures';

class SignaturesController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const signatures = await Signatures.create({
      name,
      path,
    });
    return res.json(signatures);
  }
}

export default new SignaturesController();
