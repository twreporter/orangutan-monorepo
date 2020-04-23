import * as yup from 'yup'
import elementTypes from './element-types'

const recordContent = yup
  .object()
  .shape({
    title: yup.string(),
    description: yup.string(),
    image: yup.object({
      src: yup.string(),
      caption: yup.string(),
      alt: yup.string(),
    }),
  })
  .noUnknown(true)

const flagContent = yup
  .object()
  .shape({
    label: yup.string(),
    title: yup.string(),
  })
  .noUnknown(true)

const elements = yup.array().of(
  yup.object().shape({
    index: yup
      .number()
      .integer()
      .min(0)
      .required(),
    type: yup
      .string()
      .oneOf([
        elementTypes.record,
        elementTypes.groupFlag,
        elementTypes.unitFlag,
      ])
      .required(),
    content: yup.object().when('type', {
      is: elementTypes.record,
      then: recordContent,
      otherwise: flagContent,
    }),
  })
)

// Enable validation of theme and appProps if needed
// const theme = yup.object().shape({})
// const appProps = yup.object().shape({})

export default {
  elements,
  // theme,
  // appProps,
}
