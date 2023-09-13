import express from 'express'
import cookieParser from 'cookie-parser'
import path from 'path'

import { carService } from './services/car.service.js'
import { loggerService } from './services/logger.service.js'
import { userService } from './services/user.service.js'
const app = express()

// Express Config:
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())


// Express Routing:

app.get('/puki', (req, res) => {
    let visitedCount = req.cookies.visitedCount || 0
    visitedCount++
    res.cookie('visitedCount', visitedCount, { maxAge: 1000 * 60 * 5 })
    console.log('visitedCount:', visitedCount)
    res.send('<h1>Hello Puki</h1>')
})

app.get('/nono', (req, res) => {
    res.redirect('/')
})

// Get Cars (READ)
app.get('/api/car', (req, res) => {
    console.log('req.query', req.query)
    const filterBy = {
        txt: req.query.txt || '',
        minSpeed: req.query.minSpeed || 0,
        pageIdx: req.query.pageIdx ? +req.query.pageIdx : undefined
    }
    carService.query(filterBy)
        .then(cars => {
            res.send(cars)
        })
        .catch(err => {
            loggerService.error('Cannot get cars', err)
            res.status(400).send('Cannot get cars')
        })
})

// Add Car 
app.post('/api/car', (req, res) => {

    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add car')


    const car = {
        vendor: req.body.vendor,
        speed: +req.body.speed,
    }

    carService.save(car, loggedinUser)
        .then(car => {
            res.send(car)
        })
        .catch((err) => {
            loggerService.error('Cannot save car', err)
            res.status(400).send('Cannot save car')
        })
})



// Update
app.put('/api/car', (req, res) => {

    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot update car')

    const car = {
        _id: req.body._id,
        vendor: req.body.vendor,
        speed: +req.body.speed,
    }

    carService.save(car, loggedinUser)
        .then(car => {
            res.send(car)
        })
        .catch((err) => {
            loggerService.error('Cannot save car', err)
            res.status(400).send('Cannot save car')
        })
})

// Get Car (READ)
app.get('/api/car/:carId', (req, res) => {
    const { carId } = req.params
    carService.getById(carId)
        .then(car => {
            res.send(car)
        })
        .catch((err) => {
            loggerService.error('Cannot get car', err)
            res.status(400).send('Cannot get car')
        })
})

// Remove Car (Delete)
app.delete('/api/car/:carId', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot delete car')

    const carId = req.params.carId

    carService.remove(carId, loggedinUser)
        .then(() => {
            console.log(`Car ${carId} removed!`);
            // res.redirect('/api/car')
            res.send('Car removed successfully')
        })
        .catch((err) => {
            loggerService.error('Cannot remove car', err)
            res.status(400).send('Cannot remove car')
        })
})


// Get Users (READ)
app.get('/api/user', (req, res) => {

    userService.query()
        .then(users => {
            res.send(users)
        })
        .catch(err => {
            loggerService.error('Cannot get users', err)
            res.status(400).send('Cannot get users')
        })
})

// Get Users (READ)
app.get('/api/user/:userId', (req, res) => {

    const { userId } = req.params

    userService.getById(userId)
        .then(user => {
            res.send(user)
        })
        .catch(err => {
            loggerService.error('Cannot get user', err)
            res.status(400).send('Cannot get user')
        })
})

app.post('/api/auth/login', (req, res) => {
    const credentials = req.body
    userService.checkLogin(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        })
})



app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    userService.add(credentials)
        .then(user => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            loggerService.error('Cannot signup', err)
            res.status(400).send('Cannot signup')
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('Loggedout..')
})

// app.get('/api/car/pdf', (req, res) => {

// // })

app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})



const port = 3030
app.listen(port, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
)

