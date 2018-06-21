import { fromJS, Map } from 'immutable'
import actionDefs from '../actions/actionDefs'

const setSession = (state, payload) =>
  state.merge(fromJS({ session: payload }))

const reducer = (state = Map(), action) => {
  switch (action.type) {
    case actionDefs.Security.Session.Set:
      return setSession(state, action.payload)

    case actionDefs.Security.Session.Clear:
      return Map()

    default:
      return state
  }
}

export default reducer