import fetch from './fetch.actions'

export const fetchAllReviews = () => dispatch => {
  dispatch(fetch.get('/reviews'))
    .then(reviews => {
      console.log('reviews', reviews)
    })
}