import { getDispatch } from '../store'
import { fetchAllReviews } from '../actions/reviews.actions'

export const selectReviews = store => {
  const reviews = store.reviews

  if (reviews.size === 0) {
    getDispatch()(fetchAllReviews())
  }
}