import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import actionDefs from '../actions/actionDefs'
import reviewsReducer from './reviews.reducer'

const appReducer = combineReducers({
  router: routerReducer,
  reviews: reviewsReducer,
})

export default (state, action) => {
  if (action.type === actionDefs.Security.Session.Clear) appReducer(undefined, action)
  return appReducer(state, action)
}
