import { type SchemaTypeDefinition } from 'sanity'
import restaurant from './restaurant'
import menu from './menu'
import dish from './dish'
import stats from './stats'
import testimonial from './testimonial'
import contact from './contact'
import payment from './payment'
import qrcode from './qrcode'
import view from './view'
import dailyStats from './dailyStats'


export const schema: { types: SchemaTypeDefinition[] } = {
  types:[restaurant, menu, dish, stats, testimonial, contact, payment, qrcode, view, dailyStats],
}
