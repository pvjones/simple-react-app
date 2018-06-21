import fetch from 'isomorphic-fetch'
import { Map } from 'immutable'
import config from '../../utils/config'

const apiUrl = config.api.baseUrl
const token = config.api.token

const standardHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
}

let requestMap = Map()
const throttledRequestTimeLimit = 100

const processResponse = (response, method, url) => {
  if (response.ok) {
    return response.status === 204 ? Promise.resolve('') : response.json()
  }

  return response.text()
    .then(error => JSON.parse(error))
    .then(error => {
      throw new Error(error.message)
    })
}

const getEmptyPromise = () => new Promise(() => {
  // Need to return an empty promise so that only the first promise can be resolved.
  // Otherwise multiple unnecessary rerenders will result.
})

const getFetchPromise = (method, url, payload, dispatch) => new Promise(resolve => {
  fetch(`${apiUrl}${url}`, payload)
    .then(response => resolve(processResponse(response, method, url, dispatch)))
  // .catch(error => dispatch(setAlertError(error.message)))
})

const getThrottledFetchPromise = (method, url, payload, dispatch) => new Promise(resolve => {
  fetch(`${apiUrl}${url}`, payload)
    .then(response => {
      setTimeout(() => {
        requestMap = requestMap.deleteIn([method, url])
      }, throttledRequestTimeLimit)
      return resolve(processResponse(response, method, url, dispatch))
    })
    .catch(error => {
      // dispatch(setAlertError(error.message))
      requestMap = requestMap.deleteIn([method, url])
    })
})

const getHeaders = (authToken, extraHeaders = {}) => {
  const authHeader = authToken ? { Authorization: authToken } : {}

  const init = {
    ...standardHeaders,
    ...extraHeaders,
    ...authHeader,
  }

  return new Headers(init)
}

const requestWithBody = (method, url, body, extraHeaders) =>
  dispatch => {
    const headers = getHeaders(token, extraHeaders)
    const bodyProp = body ? { body: JSON.stringify(body) } : {}

    const payload = {
      method,
      headers,
      ...bodyProp,
    }

    const promise = getFetchPromise(method, url, payload, dispatch)
    return promise
  }

const get = url =>
  dispatch => {
    const method = 'GET'

    if (requestMap.getIn([method, url])) {
      return getEmptyPromise()
    }

    const headers = getHeaders(token)

    const payload = {
      method,
      headers,
    }

    const promise = getThrottledFetchPromise(method, url, payload, dispatch)
    requestMap = requestMap.setIn([method, url], promise)

    return promise
  }

export default {
  get,
  post: (url, body, extraHeaders) => requestWithBody('POST', url, body, extraHeaders),
  put: (url, body, extraHeaders) => requestWithBody('PUT', url, body, extraHeaders),
  delete: (url, body, extraHeaders) => requestWithBody('DELETE', url, body, extraHeaders),
}
