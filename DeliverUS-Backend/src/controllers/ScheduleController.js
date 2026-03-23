import { Schedule } from '../models/models.js'

const indexRestaurant = async function (req, res) {
  try{
    const schedules = await Schedule.findAll(
      {where: {
        restaurantId: req.params.restaurantId
      }}
    )
    res.json(schedules)
  } catch(err){
    res.status(500).send(err)
  }
}

const create = async function (req, res) {
  try{
    const newSchedule = await Schedule.build(req.body)
    newSchedule.restaurantId = req.params.restaurantId

    const createRestaurant = await newSchedule.save()
    res.json(createRestaurant)
  } catch(err){
    res.status(500).send(err)
  }
}

const update = async function (req, res) {
  try{
    const currentSchedules = await Schedule.findByPK(
      req.params.scheduleId
    )

    currentSchedules.startTime = req.body.startTime
    currentSchedules.endTime = req.body.endTime

    const updatedSchedules = await currentSchedules.save()
    
    res.json(updatedSchedules)
  } catch(err){
    res.status(500).send(err)
  }
}

const destroy = async function (req, res) {
  try{
    const result = await Schedule.destroy(
      {
        where: {
          id: req.params.scheduleId
        }
      }
    )
    let message = ''
    if(result === 1){
      message = 'Succesfully deleted schedule id' + req.params.scheduleId
    }
    else{
      message = 'Could not delete schedule'
    }
    res.json(message)
  } catch(err){
    res.status(500).send(err)
  }
}

const ScheduleController = {
  indexRestaurant,
  create,
  update,
  destroy
}

export default ScheduleController
