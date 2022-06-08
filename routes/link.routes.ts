//генерация ссылок для сокращения - функционал

//const { Router } = require('express')
//const config = require('config')
const Link = require('../models/Link')
const auth = require('../milddleware/auth.middleware')
//const router = Router()
const shortid = require('shortid')



router.post('/generate', auth, async (req:any, res:any) => {
    try {
      //генерация ссылки
    const baseUrl = config.get('baseUrl')
    const {from} = req.body

        // получаем уникальный код
    const code = shortid.generate()

        //есть ли такая ссылка
    const existing = await Link.findOne({ from })

    if (existing) {
      return res.json({ link: existing })
    }

    const to = baseUrl + '/t/' + code

    const link = new Link({
      code, to, from, owner: req.user.userId
    })

    await link.save()

    res.status(201).json({ link })
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

router.get('/', auth, async (req:any, res:any) => {
    try {
       // поиск по owner всех ссылок
    const links = await Link.find({ owner: req.user.userId })
    res.json(links)
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

router.get('/:id', auth, async (req:any, res:any) => {
    try {
      // поиск по айдишнику
    const link = await Link.findById(req.params.id)
    res.json(link)
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

module.exports = router