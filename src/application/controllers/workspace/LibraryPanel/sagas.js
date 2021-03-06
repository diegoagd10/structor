/*
 * Copyright 2015 Alexander Pustovalov
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { fork, take, call, put, race } from 'redux-saga/effects';
import * as actions from './actions.js';
import { actions as spinnerActions } from '../../app/AppSpinner/index.js';
import { actions as messageActions } from '../../app/AppMessage/index.js';
import { serverApi } from '../../../api';
//
//const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
//
function* loadComponents(){
    while(true){
        yield take(actions.LOAD_COMPONENTS);
        yield put(spinnerActions.started('Loading components'));
        try {
            const response = yield call(serverApi.loadComponentsTree);
            yield put(actions.setComponents(response));

        } catch(error) {
            yield put(messageActions.failed('Components loading has an error. ' + (error.message ? error.message : error.toString())));
        }
        yield put(spinnerActions.done('Loading components'));
    }
}

// main saga
export default function* mainSaga() {
    yield [fork(loadComponents)];

};
