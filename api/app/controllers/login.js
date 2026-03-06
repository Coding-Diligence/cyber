const UserModel = require('../models/user.js')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const { authenticateToken } = require('../middleware.js')

const Login = class Login {
  /**
   * @constructor
   * @param {Object} app
   * @param {Object} config
   */
  constructor (app, connect) {
    this.app = app
    this.UserModel = connect.model('User', UserModel)

    this.run()
  }

  // Route GET pour vérifier la validité du token
  verifyToken() {
    this.app.get('/auth', authenticateToken, (req, res) => {
      try {
        res.status(200).json({ code: 200, message: 'Token valide', user: req.user })
      } catch (err) {
        console.error(`[ERROR] GET auth -> ${err}`)
        res.status(500).json({ code: 500, message: 'Internal server error' })
      }
    })
  }

  // ajout de reelle authentification
  auth() {
    this.app.post('/auth/', async (req, res) => {
      try {
        const schema = Joi.object({
          name: Joi.string().required(),
          password: Joi.string().required()
        })
        const { error } = schema.validate(req.body)
        if (error) return res.status(400).json({ code: 400, message: 'Invalid input' })

        const { name, password } = req.body
        const user = await this.UserModel.findOne({ name })
        if (!user || !(await user.comparePassword(password))) {
          return res.status(401).json({ code: 401, message: 'Invalid credentials' })
        }

        // creation du token jwt
        const token = jwt.sign({ id: user._id, name: user.name }, 'secret-key', { expiresIn: '1h' })
        res.status(200).json({ token })
      } catch (err) {
        console.error(`[ERROR] POST auth/ -> ${err}`)
        res.status(500).json({ code: 500, message: 'Internal server error' })
      }
    })
  }

  // route du login mis en post plutot que get pour empecher d'avoir les infos dans l'url
  getByLoginPassword () {
    this.app.post('/login/', async (req, res) => {
      try {
        const schema = Joi.object({
          name: Joi.string().required(),
          password: Joi.string().required()
        })
        const { error } = schema.validate(req.body)
        if (error) return res.status(400).json({ code: 400, message: 'Invalid input' })

        const { name, password } = req.body
        const user = await this.UserModel.findOne({ name })
        if (!user || !(await user.comparePassword(password))) {
          return res.status(401).json({ code: 401, message: 'Invalid credentials' })
        }

        const token = jwt.sign({ id: user._id, name: user.name }, 'secret-key', { expiresIn: '1h' })
        res.status(200).json({ token })
      } catch (err) {
        console.error(`[ERROR] POST login/ -> ${err}`)
        res.status(500).json({ code: 500, message: 'Internal server error' })
      }
    })
  }

  run () {
    this.verifyToken()
    this.auth()
    this.getByLoginPassword()
  }
}

module.exports = Login
