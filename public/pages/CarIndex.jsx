import { CarFilter } from "../cmps/CarFilter.jsx"
import { CarList } from "../cmps/CarList.jsx"
import { carService } from "../services/car.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { utilService } from "../services/util.service.js"
import { CarDetails } from "./CarDetails.jsx"

const { useState, useEffect, useRef } = React
const { Link } = ReactRouterDOM


export function CarIndex() {

    const [cars, setCars] = useState(null)
    const [filterBy, setFilterBy] = useState(carService.getDefaultFilter())
    const debouncedSetFilter = useRef(utilService.debounce(onSetFilterBy, 500))
    useEffect(() => {
        // console.log('mount')
        carService.query(filterBy)
            .then(cars => setCars(cars))
            .catch(err => console.log('err:', err))
    }, [filterBy])

    function onRemoveCar(carId) {
        carService.remove(carId)
            .then(() => {
                console.log('carId:', carId)
                setCars(prevCars => prevCars.filter(car => car._id !== carId))
                showSuccessMsg(`Car Removed! ${carId}`)
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Problem Removing ' + carId)
            })
    }

    function onSetFilterBy(filterBy) {
        // console.log('filterBy:', filterBy)
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    function onChangePageIdx(diff) {
        setFilterBy(prevFilter => ({ ...prevFilter, pageIdx: prevFilter.pageIdx + diff }))
    }



    console.log('render')
    if (!cars) return <div>Loading...</div>
    return (
        <section className="car-index">
            <button onClick={() => { onChangePageIdx(1) }}>+</button>
            {filterBy.pageIdx + 1}
            <button onClick={() => { onChangePageIdx(-1) }}>-</button>
            <button onClick={() => setFilterBy(prevFilter => ({ ...prevFilter, pageIdx: undefined }))}>Cancel pagination</button>
            <CarFilter filterBy={filterBy} onSetFilterBy={debouncedSetFilter.current} />
            <Link to="/car/edit" >Add Car</Link>
            <CarList cars={cars} onRemoveCar={onRemoveCar} />
        </section>
    )
}