import { validateFirstDocument } from '../services/validate.service.js';
import { validateSecondDocument } from '../services/validate.service.js';

export const validateController = async (req, res, next) => {
  try {
    const file_1 = req.files?.file_1?.[0];
    const file_2 = req.files?.file_2?.[0];

    if (!file_1) {
      return res.status(400).json({
        valid: false,
        errors: ['file_1_required'],
      });
    }

    const result = await validateFirstDocument(file_1);
    const result2 =  await validateSecondDocument(file_2);
    return res.status(200).json({ result, result2 });

  } catch (err) {
    next(err); 
  }
};
