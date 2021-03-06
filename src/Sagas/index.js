/**
 * What the hell are sagas?
 *
 * TL;DR:
 * Every time you need to trigger some actions as a consequence of another action
 * you can use Sagas to declare such dependencies.
 *
 * It's simpler than you may think.
 * redux-saga uses js ES6 iterators in order to pause and resume
 * tied operations.
 * Why shall we care about tied operations?
 * Side effects baby.
 * The simpler situation to think about is an htt request.
 * es, because it involves an OnRequest event, follwed by an onSuccess
 * or onError event.
 * This events must be treated as redux actions, since everything which
 * changes the store is in fact a redux action.
 * So we have an onRequest action that should immediately fire an
 * onSuccess action => collateral effect
 * redux-saga injects itself as a middleware in redux, inspecting dispatched
 * actions, and can immediately fire other actions if tied to the received one.
 * So in our example, you need only to manually dispatch the request action,
 * and saga will take care of dispatching the subsequent action after the request is complete.
 */
import { takeLatest, takeEvery, all } from 'redux-saga/effects'
// the majority of sagas regards api calls

/* ------------- Types ------------- */
import { STARTUP } from '../Redux/Startup'
import { LOGIN_REQUEST, LOGOUT, WHOAMI_REQUEST, REFRESH_REQUEST } from '../Redux/Auth'

/* ------------- Sagas ------------- */
import { startup } from './StartupSagas'
import { login, whoami, refresh, logout } from './AuthSagas'

/* ------------- API ------------- */
import API from '../Services/Api'
const api = API.create()

export default function * root (dispatch) {
  yield all([
    takeLatest(STARTUP, startup, api),
    takeLatest(LOGIN_REQUEST, login, api),
    takeLatest(LOGOUT, logout),
    takeLatest(REFRESH_REQUEST, refresh, api),
    takeLatest(WHOAMI_REQUEST, whoami, { api, dispatch }),
  ])
}

// export this api instance in order to be used elsewhere. This is the unique api instance which
// has the authorization token set
export { api }
