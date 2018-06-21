import React from 'react'
import { connect } from 'react-redux'
import { selectReviews } from '../store/selectors/reviews.selectors'

const PrimaryRoute = ({
  shows,
  reviews,
}) => (
    <div>
      Hello World
  </div>
  )

const mapStoreToProps = store => ({
  reviews: selectReviews(store),
})

export default connect(mapStoreToProps)(PrimaryRoute)