/*
 * @flow
 */

import { SearchApi } from 'loom-data';
import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs';

import * as actionTypes from './HomeActionTypes';
import * as actionFactories from './HomeActionFactories';

import { updateEntitySets } from '../edm/EdmActionFactory';

function loadHomeEntitySetsEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(actionTypes.HOME_ENTITY_SETS_REQUEST)
    .mergeMap((action :Action) => {
      let numHits = 0;
      const searchOptions = {
        start: action.start,
        maxHits: action.maxHits
      };
      return Observable
        .from(SearchApi.getEntitySets(searchOptions))
        .map((rawResult) => {
          numHits = rawResult.numHits;
          return rawResult.hits.map((result) => {
            return result.entitySet;
          });
        })
        .mergeMap((results) => {
          const entitySetIds :string[] = [];
          results.forEach((entitySet :Object) => {
            if (entitySet) {
              entitySetIds.push(entitySet.id);
            }
          });
          return Observable.of(
            actionFactories.homeEntitySetsSuccess(entitySetIds, numHits),
            updateEntitySets(results)
          );
        })
        .catch((e) => {
          console.error(e);
          return Observable.of(
            actionFactories.homeEntitySetsFailure('Unable to load home page entity sets.')
          );
        });
    });
}

export default combineEpics(
  loadHomeEntitySetsEpic
);
