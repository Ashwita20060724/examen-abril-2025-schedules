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
  try{
    //CASO 1: SI NO SE ENVÍA SCHEDULEID, NO VALIDAMOS NADA
    if(!value){
      return Promise.resolve()
    }


    // EL VALUE ES EL SCHEDULE ID 
    const schedule = await Schedule.findByPk(value)
    //CASO 2: SI EL HORARIO ESTÁ VACÍO
    if(schedule === null){
      return Promise.reject(new Error('The scheduleId does not exist.'))
    }

    //CASO 3: COMPROBAR QUE PERTENECE AL RESTAURANTE ENVIADO DESDE BODY
    if(schedule.restaurantId !== req.body.restaurantId){
      return Promise.reject(new Error('The schedule does not belong to the restaurant'))
    }

    return Promise.resolve()

  }catch(err){
    return Promise.reject(new Error(err))
  }
}

const checkScheduleBelongsToRestaurantOnUpdate = async (value, { req }) => {
    try{
    //CASO 1: SI NO SE ENVÍA SCHEDULEID, NO VALIDAMOS NADA
    if(!value){
      return Promise.resolve()
    }

    //CASO 2: OBTENER EL PRODUCTO PARA SABER SU RESTAURANTEID
    const product = await Product.findByPk(req.params.productId)
    if(product === null){
      return Promise.reject(new Error('Product not found'))
    }

    // EL VALUE ES EL SCHEDULE ID 
    const schedule = await Schedule.findByPk(value)
    //CASO 3: SI EL HORARIO ESTÁ VACÍO
    if(schedule === null){
      return Promise.reject(new Error('The scheduleId does not exist.'))
    }

    //CASO 3: COMPROBAR QUE PERTENECE AL RESTAURANTE ENVIADO DESDE BODY
    if(schedule.restaurantId !== product.restaurantId){
      return Promise.reject(new Error('The schedule does not belong to the restaurant'))
    }

    return Promise.resolve()

  }catch(err){
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
