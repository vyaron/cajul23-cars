import { utilService } from "./utils.service.js";
import fs from 'fs'

export const carService = {
    query,
    getById,
    remove,
    save
}
const PAGE_SIZE = 3
const cars = utilService.readJsonFile('data/car.json')


function query(filterBy) {
    let carsToReturn = cars
    console.log('filterBy', filterBy)

    // console.log('cars:', cars)
    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        carsToReturn = carsToReturn.filter(car => regExp.test(car.vendor))
    }

    if (filterBy.minSpeed) {
        carsToReturn = carsToReturn.filter(car => car.speed >= filterBy.minSpeed)
    }

    if (filterBy.pageIdx !== undefined) {
        const startIdx = filterBy.pageIdx * PAGE_SIZE
        carsToReturn = carsToReturn.slice(startIdx, startIdx + PAGE_SIZE)
    }

    return Promise.resolve(carsToReturn)
}

function getById(carId) {
    const car = cars.find(car => car._id === carId)
    return Promise.resolve(car)
}

function remove(carId, loggedinUser) {
    const idx = cars.findIndex(car => car._id === carId)
    if (idx === -1) return Promise.reject('No Such Car')
    const car = cars[idx]
    if (!loggedinUser.isAdmin &&
        car.owner._id !== loggedinUser._id) {
        return Promise.reject('Not your car')
    }

    cars.splice(idx, 1)
    return _saveCarsToFile()

}

function save(car, loggedinUser) {
    if (car._id) {
        const carIdx = cars.findIndex(currCar => currCar._id === car._id)
        if (cars[carIdx].owner._id !== loggedinUser._id) return Promise.reject('Not your Car')
        cars[carIdx].vendor = car.vendor
        cars[carIdx].speed = car.speed
    } else {
        car = {
            _id : utilService.makeId(),
            vendor: car.vendor,
            speed: car.speed,
            owner : loggedinUser
        }
        cars.unshift(car)
    }

    return _saveCarsToFile().then(() => car)
}



function _saveCarsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(cars, null, 2)
        fs.writeFile('data/car.json', data, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}