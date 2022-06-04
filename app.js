const express = require('express') //глобальная функция для подключения пакетов
const config = require('config')
const path = require('path')
const mongoose = require('mongoose')

const app = express()

app.use(express.json({ extended: true }))

app.use('/api/auth', require('./routes/auth.route'))
app.use('/api/link', require('./routes/link.routes'))
app.use('/t', require('./routes/redirect.routes'))

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))
  
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
  }

const PORT = config.get('port')||5000

// оборачиваем в асинхронную функцию для исп acync await
async function start(){
try {
   await mongoose.connect(config.get('mongoUri'), {
    useNewUrlParser: true,
    useUnifiedTopology: true
   } )
   app.listen(PORT,()=>console.log(`my app has been started...on ${PORT}`))
} catch (error) {
    console.log('smth has happen: ', error.message)
    process.exit(1)
}
}

start()
