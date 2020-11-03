import bottomSide from './bottom-side-caption'
import leftSide from './left-side-caption'
import noCaption from './no-caption'
import rightSide from './right-side-caption'
import topSide from './top-side-caption'

const captionSide = {
  left: 'left',
  right: 'right',
  bottom: 'bottom',
  top: 'top',
}

export default {
  [captionSide.top]: topSide,
  [captionSide.bottom]: bottomSide,
  [captionSide.right]: rightSide,
  [captionSide.left]: leftSide,
  default: noCaption,
}
