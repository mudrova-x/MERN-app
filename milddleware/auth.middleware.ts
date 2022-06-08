//import jwt from 'jsonwebtoken';
//const config = require('config')

module.exports = (req: any, res: any, next: any) => {
  if (req.method === 'OPTIONS') {
    return next()
  }

    // если пост или гет запросы
  try {
    
    // нужно распарсить строку для получения токена
    const token = req.headers.authorization.split(' ')[1] 

    if (!token) {
      return res.status(401).json({ message: 'Нет авторизации' })
    }

    // декодирование токена с помощью библиотеки (второй параметр - секретный ключ из конфига)
    const decoded = jwt.verify(token, config.get('jwtSecret'))
    req.user = decoded
    next()

  } catch (e) {
    res.status(401).json({ message: 'Нет авторизации' })
  }
}