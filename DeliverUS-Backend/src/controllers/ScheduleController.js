import { Schedule } from '../models/models.js'

const indexRestaurant = async function (req, res) {
  try{
    const schedule = await Schedule.findAll(
      { where:{
        restaurantId: req.params.restaurantId
      }
    }
    )
    res.json(schedule)
  } catch(err){
    res.status(404).send('Restaurante no existe')
  }
}

const create = async function (req, res) {
  try{
    const schedule = await Schedule.create({
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      // productoId: req.params.productoId, NO SE PONE PORQUE NO ESTÁ
      // DEFINIDO EN ROUTES
      restaurantId: req.params.restaurantId
    })
    res.json(schedule)
  } catch(err){
    res.status(500).send(err.message)
  }
}

const update = async function (req, res) {
  try{
    const schedule = await schedule.findByPk(req.params.scheduleId)
    await schedule.update(req.body)
    res.json(schedule)
  }catch(err){
    res.status(500).send(err.message)
  }
}

const destroy = async function (req, res) {
  try{
    const schedule = await Schedule.destroy({
      where: {id: req.params.scheduleId}
    })
    let message = ''
    if(schedule === 1){
      message = 'Sucessfully deleted schedule id' + req.params.scheduleId
    } else{
      message = 'Could not delete schedule'
    }
    res.json(message)
  } catch(err){
    res.status(500).send(err.message)
  }
}

const ScheduleController = {
  indexRestaurant,
  create,
  update,
  destroy
}

export default ScheduleController
