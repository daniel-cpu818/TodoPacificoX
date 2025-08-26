import Joi from "joi";

export const packageSchema = Joi.object({
  trackingNumber: Joi.string().required(),
  sender: Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.string().required()
  }).required(),
  recipient: Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.string().required()
  }).required(),
  status: Joi.string().valid("pendiente", "en reparto", "entregado").default("pendiente")
});
