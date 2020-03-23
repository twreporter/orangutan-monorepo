import assign from 'lodash/assign'
import { Waypoint } from 'react-waypoint'

export const position = {
  state: {
    currentChapter: -1,
    currentSection: -1,
  },
  reducers: {
    update: (state, payload) => assign({}, state, payload),
  },
}

export const sectionsPositionRelativeToViewport = {
  // Sections is below the Browser viewport
  state: Waypoint.below,
  reducers: {
    update: (state, payload) => payload,
  },
}
