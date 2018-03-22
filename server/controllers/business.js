import db from '../models';

const { Business, Reviews } = db;

/**
 * @description - creates the BUsiness components for creation, updating and deleting businesses
 */
class BusinessController {
  /**
   * @description - Creates a new Business
   *
   * @param{Object} req - api request
   *
   * @param{Object} res - route response
   *
   * @return{json} registered business details
   */
  static createBusiness(req, res) {
    Business
      .create({
        name: req.body.name,
        address: req.body.address,
        website: req.body.website || null,
        phoneno: req.body.phoneno,
        details: req.body.details,
        location: req.body.details,
        category: req.body.category,
        services: req.body.services,
        userId: req.user.id
      })
      .then((business) => {
        res.status(201).send({ message: 'Your business has been created!', center });
      })
      .catch((err) => {
        res.status(400).send({ message: err.errors ? err.errors[0].message : err.message });
      });
  }

  /**
   * @description - Modifies an existing Business
   *
   * @param{Object} req - api request
   *
   * @param{Object} res - route response
   *
   * @return{json} edited Business response
   */
  static modifyBusiness(req, res) {
    Business
      .findOne({ where: { id: req.params.businessId } })
      .then((business) => {
        if (business) {
          business
            .update({
              name = req.body.name || Business.name,
              address = req.body.address || business.address,
              website = req.body.website || business.website,
              phoneno = req.body.phoneno || business.phoneno,
              details = req.body.details || business.details,
              location = req.body.details || business.location,
              category = req.body.category || business.category,
              services = req.body.services || business.services
            })
            .then((modifiedBusiness) => {
              res.status(200).send({ message: 'Business updated successfully!', business: modifiedBusiness });
            });
        } else {
          res.status(404).send({ message: 'Business not found!' });
        }
      })
      .catch((err) => {
        res.status(400).send({ message: err.errors ? err.errors[0].message : err.message });
      });
  }

  /**
   * @description - Deletes a specific Business
   *
   * @param{Object} req - api request
   *
   * @param{Object} res - route response
   *
   * @return{json} status of the request
   */
  static deleteBusiness(req, res) {
    Business
      .findOne({ where: { id: req.params.businessId } })
      .then((business) => {
        if (business) {
          business.destroy().then(res.status(200).send({ message: 'Business deleted successfully' }));
        } else {
          res.status(404).send({ message: 'Business not found!' });
        }
      })
      .catch((err) => {
        res.status(400).send({ message: err.errors ? err.errors[0].message : err.message });
      });
  }

  /**
   * @description - Get a Business' detail with the associated reviews
   *
   * @param{Object} req - api request
   *
   * @param{Object} res - route response
   *
   * @return{json} Registered business details
   */
  static getBusiness(req, res) {
    Business
      .findById(req.params.businessId, {
        include: [
          { model: Reviews, as: 'reviews' },
        ],
      })
      .then((business) => {
        if (business) {
          res.status(200).send({ message: 'Business delivered', business });
        } else {
          res.status(404).send({ message: 'Business not found!' });
        }
      })
      .catch((err) => {
        res.status(400).send({ message: err.errors ? err.errors[0].message : err.message });
      });
  }

  /**
   * @description - Get all Businesses
   *
   * @param{Object} req - api request
   *
   * @param{Object} res - route response
   *
   * @return{json} Details of all the business
   */
  static getAllBusiness(req, res) {
    Business
      .all()
      .then((businesses) => {
        if (businesses) {
          res.status(200).send({ message: 'All businesses delivered', businesses });
        } else {
          res.status(404).send({ message: 'No Business found!'});
        }
      })
      .catch((err) => {
        res.status(400).send({ message: err.errors ? err.errors : err.message });
      });
  }
}

export default BusinessController;
