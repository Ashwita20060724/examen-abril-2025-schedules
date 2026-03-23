import { check } from 'express-validator'
import { Product, Restaurant, Schedule } from '../../models/models.js'
import { checkFileIsImage, checkFileMaxSize } from './FileValidationHelper.js'

const maxFileSize = 2000000 // around 2Mb

const checkRestaurantExists = async (value, { req }) => {
  try {
    const restaurant = await Restaurant.findByPk(req.body.restaurantId)
    if (restaurant === null) {
      return Promise.reject(new Error('The restaurantId does not exist.'))
    } else { return Promise.resolve() }
  } catch (err) {
    return Promise.reject(new Error(err))
  }
}

const checkScheduleBelongsToRestaurantOnCreate = async (value, { req }) => {
  try {
    const scheduleId = req.body.scheduleId
    const restaurantId = req.body.restaurantId
    const schedule = await Schedule.findByPk(scheduleId)

    //SI EL VALUE QUE ME DAN ESTÁ VACÍO NO SE VALIDA
    if(!value){
      return Promise.resolve()
    }

    //SI NO EXISTE HORARIO
    if(schedule === null) {
      return Promise.reject(new Error('The scheduleId does not exist'))
    }
    //SI EXISTE HORARIO PERO NO PERTENECE A ESE RESTAURANTE
    if(schedule.restaurantId !== restaurantId){
      return Promise.reject(new Error('This schedule does not belong to this restaurant'))
    }

    return Promise.resolve()

  } catch(err) {
    return Promise.reject(new Error(err))
  }
}

const checkScheduleBelongsToRestaurantOnUpdate = async (value, { req }) => {
    try {
      const scheduleId = req.body.scheduleId
      const productoId = req.params.productoId
      const schedule = await Schedule.findByPk(scheduleId)
      const products = await Product.findByPk(productoId)
      const restauranteId = products.restaurantId

      //SI NO ME PASAN HORARIO POR PARÁMETRO
     if(!scheduleId) {
      return Promise.resolve()
     }

      //SI EL PRODUCT QUE ME DAN ESTÁ VACÍO NO SE VALIDA
      if(!products){
       return Promise.reject(new Error('This product does not exist'))
     }

      //SI NO EXISTE HORARIO
      if(schedule === null) {
        return Promise.reject(new Error('The scheduleId does not exist'))
      }
      //SI EXISTE HORARIO PERO NO PERTENECE AL
      // PRODUCTO DEL RESTAURANTE
      if(schedule.restaurantId !== restauranteId){
        return Promise.reject(new Error('This schedule does not belong to this restaurant'))
      }

      return Promise.resolve()
    } catch(err){
      return Promise.reject(new Error(err))
    }
}

const create = [
  check('name').exists().isString().isLength({ min: 1, max: 255 }).trim(),
  check('description').optional({ checkNull: true, checkFalsy: true }).isString().isLength({ min: 1 }).trim(),
  check('price').exists().isFloat({ min: 0 }).toFloat(),
  check('order').default(null).optional({ nullable: true }).isInt().toInt(),
  check('availability').optional().isBoolean().toBoolean(),
  check('productCategoryId').exists().isInt({ min: 1 }).toInt(),
  check('restaurantId').exists().isInt({ min: 1 }).toInt(),
  check('restaurantId').custom(checkRestaurantExists),
  check('image').custom((value, { req }) => {
    return checkFileIsImage(req, 'image')
  }).withMessage('Please upload an image with format (jpeg, png).'),
  check('image').custom((value, { req }) => {
    return checkFileMaxSize(req, 'image', maxFileSize)
  }).withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB'),
  check('scheduleId').optional({ nullable: true, checkFalsy: true }).isInt({ min: 1 }).toInt().custom(checkScheduleBelongsToRestaurantOnCreate)

]

const update = [
  check('name').exists().isString().isLength({ min: 1, max: 255 }),
  check('description').optional({ nullable: true, checkFalsy: true }).isString().isLength({ min: 1 }).trim(),
  check('price').exists().isFloat({ min: 0 }).toFloat(),
  check('order').default(null).optional({ nullable: true }).isInt().toInt(),
  check('availability').optional().isBoolean().toBoolean(),
  check('productCategoryId').exists().isInt({ min: 1 }).toInt(),
  check('restaurantId').not().exists(),
  check('image').custom((value, { req }) => {
    return checkFileIsImage(req, 'image')
  }).withMessage('Please upload an image with format (jpeg, png).'),
  check('image').custom((value, { req }) => {
    return checkFileMaxSize(req, 'image', maxFileSize)
  }).withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB'),
  check('restaurantId').not().exists(),
  check('scheduleId').optional({ nullable: true, checkFalsy: true }).isInt({ min: 1 }).toInt().custom(checkScheduleBelongsToRestaurantOnUpdate)
]

export { create, update }
