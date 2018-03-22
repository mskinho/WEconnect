import validator from 'email-validator';
import db from '../models';

const { User } = db;

/**
 * @description - This validates all the entries into the app
 */
class Validation {
  /**
   * @description Checks if request body contains required keys
   *
   * @param{Object} req - api request
   *
   * @param{Object} res - route response
   *
   * @param{Function} next - next middleware
   *
   * @return{undefined}
   */
  static checkBodyContains(...params) {
    return (req, res, next) => {
      /* eslint-disable no-restricted-syntax */
      for (const p of params) {
        if (req.body[p] === undefined) {
          return res.status(400).send({
            message: `${p} required in body!`
          });
        }
      }
      next();
    };
  }

  /**
   * @description Trims body values
   *
   * @param{Object} req - api request
   *
   * @param{Object} res - route response
   *
   * @param{Function} next - next middleware
   *
   * @return{undefined}
   */
  static trimBodyValues(req, res, next) {
    // trim body values
    if (req.body) {
      Object.keys(req.body).forEach((k) => {
        const value = req.body[k];
        if ((typeof value === 'string' || value instanceof String) && value !== undefined) req.body[k] = req.body[k].trim(); // trim value if body exist
      });
    }
    next();
  }

  /**
   * @description Chcecks if Email already exists before crestion
   *
   * @param{Object} req - api request
   *
   * @param{Object} res - route response
   *
   * @param{Function} next - next middleware
   *
   * @return{undefined}
   */
  static checkEmailExistence(req, res, next) {
    User
      .findOne({
        where: { email: req.body.email },
      })
      .then((user) => {
        if (user) {
          res.status(409).send({ message: 'Someone beat you to it. Email already taken! Sorry Champ!' });
        } else next();
      })
      .catch((err) => {
        res.status(400).send({ message: err.errors ? err.errors[0].message : err.message });
      });
  }

  /**
   * @description Chceks if an entered email is really an email
   *
   * @param{Object} req - api request
   *
   * @param{Object} res - route response
   *
   * @param{Function} next - next middleware
   *
   * @return{undefined}
   */
  static validateEmail(req, res, next) {
    if (validator.validate(req.body.email)) {
      next();
    } else {
      return res.status(400).json({
        message: 'Bad email format!'
      });
    }
  }
}

export default Validation;

