const ContactModel = require('../models/contact.js')
const Joi = require('joi')
const { authenticateToken } = require('../middleware.js')

const Contact = class Contact {
  /**
   * @constructor
   * @param {Object} app
   * @param {Object} config
   */
  constructor (app, connect) {
    this.app = app
    this.ContactModel = connect.model('Contact', ContactModel)

    this.run()
  }

  create () {
    this.app.post('/contact/', (req, res) => {
      try {
        const schema = Joi.object({
          firstName: Joi.string().required(),
          lastName: Joi.string().required(),
          mobilePhone: Joi.string().pattern(/^0[6-7][0-9]{8}$/).required(),
          email: Joi.string().email().required(),
          arrivedAt: Joi.date().required(),
          departureAt: Joi.date().greater(Joi.ref('arrivedAt')).required(),
          message: Joi.string().required()
        })
        const { error } = schema.validate(req.body)
        if (error) return res.status(400).json({ code: 400, message: 'Invalid input' })

        const contactModel = new this.ContactModel(req.body);

        contactModel.save().then((contact) => {
          res.status(200).json(contact || {})
        }).catch(() => {
          res.status(403).json({
            code: 403,
            message: 'Bad request'
          })
        })
      } catch (err) {
        console.error(`[ERROR] POST contacts/ -> ${err}`)

        res.status(500).json({
          code: 500,
          message: 'Internal server error'
        })
      }
    })
  }

    all () {
      this.app.get('/contacts/', authenticateToken, (req, res) => {
        try {
          this.ContactModel.find().sort({ createdAt: -1 }).then((contact) => {
            res.status(200).json(contact || {})
          }).catch(() => {
            res.status(403).json({
              code: 403,
              message: 'Bad request'
            })
          })
        } catch (err) {
          console.error(`[ERROR] GET contacts/ -> ${err}`)
  
          res.status(500).json({
            code: 500,
            message: 'Internal server error'
          })
        }
      })
    }

    delete () {
      this.app.delete('/contact/:id', authenticateToken, (req, res) => {
        try {
          this.ContactModel.findByIdAndDelete(req.params.id).then((contact) => {
            res.status(200).json(contact || {})
          }).catch(() => {
            res.status(403).json({
              code: 403,
              message: 'Bad request'
            })
          })
        } catch (err) {
          console.error(`[ERROR] DELETE contact/:id -> ${err}`)
  
          res.status(500).json({
            code: 500,
            message: 'Internal server error'
          })
        }
      })
    }

  run () {
    this.delete()
    this.all()
    this.create()
  }
}

module.exports = Contact
