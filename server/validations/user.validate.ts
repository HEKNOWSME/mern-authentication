import Joi from 'joi';
import { UserInterface } from '../models/User';
function validateUser(user: UserInterface) {
   return Joi.object({
      username: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
   }).validate(user)
}
function ValidateLogin(user: UserInterface) {
   return Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
   }).validate(user);
}
function ValidateOtp(user: UserInterface) {
   return Joi.object({
      userId: Joi.string().required(),
   }).validate(user);
}

export { validateUser, ValidateLogin, ValidateOtp };