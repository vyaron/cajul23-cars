import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

const BASE_URL = '/api/car/'
const CAR_KEY = 'carDB'
_createCars()

export const carService = {
    query,
    get,
    remove,
    save,
    getEmptyCar,
    getDefaultFilter,
}

function query(filterBy = {}) {
    // return storageService.query(CAR_KEY)
    return axios.get(BASE_URL, { params: filterBy }).then(res => res.data)
}

function get(carId) {
    // return storageService.get(CAR_KEY, carId)
    return axios.get(BASE_URL + carId).then(res => res.data)
}

function remove(carId) {
    // return storageService.remove(CAR_KEY, carId)
    return axios.delete(BASE_URL + carId).then(res => res.data)
}

function save(car) {

    // if (car._id)   return storageService.put(CAR_KEY, car)
    // else            return storageService.post(CAR_KEY, car)

    const method = car._id ? 'put' : 'post'
    return axios[method](BASE_URL, car).then(res => res.data)
    
}

function getEmptyCar(vendor = '', speed = '') {
    return { vendor, speed }
}

function getDefaultFilter() {
    return {
        txt: '',
        minSpeed: '',
        pageIdx: 0
    }
}

function _createCars() {
    let cars = utilService.loadFromStorage(CAR_KEY)
    if (!cars || !cars.length) {
        cars = []
        cars.push(_createCar('audu', 300))
        cars.push(_createCar('fiak', 120))
        cars.push(_createCar('subali', 50))
        cars.push(_createCar('mitsu', 150))
        utilService.saveToStorage(CAR_KEY, cars)
    }
}

function _createCar(vendor, speed = 250) {
    const car = getEmptyCar(vendor, speed)
    car._id = utilService.makeId()
    return car
}