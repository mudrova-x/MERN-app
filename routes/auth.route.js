const { Router, response } = require("express");
const jwt = require('jsonwebtoken')
const User = require("../models/User");
const config = require('config')
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator');
const router = Router();

// /api/auth/registration
router.post(
    "/registration", 
    [
        check('email', 'failed email').isEmail(),
        check('password', 'failed password - length')
        .isLength({min:6})
    ],
    async (req, res) => {
  try {
const errors = validationResult(req)

if (!errors.isEmpty()){
    return res.status(400).json({errors: errors.array() });
}

    const { email, password } = req.body;

    const candidate = await User.findOne({ email });

    if (candidate) {
      return res.status(400).json({ message: 'Такой пользователь существует' })
    }
    console.log('error.message')
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = new User({ email, password: hashedPassword })

    await user.save()

    res.status(201).json({ message: 'Пользователь создан' })
  } catch (error) {
    res.status(500).json({ message: "smth gone wrong in registration, try again" });
    console.log(error.message)
  }
});

// /api/auth/login
router.post(
  '/login',
  [
    check('email', 'Введите корректный email').normalizeEmail().isEmail(),
    check('password', 'Введите пароль').exists()
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некорректный данные при входе в систему'
      })
    }

    const {email, password} = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ message: 'Пользователь не найден' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: 'Неверный пароль, попробуйте снова' })
    }

    const token = jwt.sign(
      { userId: user.id },
      config.get('jwtSecret'),
      { expiresIn: '1h' }
    )

    res.json({ token, userId: user.id })

  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

module.exports = router;
