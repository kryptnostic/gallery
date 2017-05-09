import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';
import {
  EntityDataModelApi,
  AnalysisApi
} from 'loom-data';

import * as actionTypes from './TopUtilizersActionTypes';
import * as actionFactory from './TopUtilizersActionFactory';
import FileService from '../../utils/FileService';
import FileConsts from '../../utils/Consts/FileConsts';

function getEntitySetEpic(action$) {
  return action$
    .ofType(actionTypes.GET_ENTITY_SET_REQUEST)
    .mergeMap((action) => {
      return Observable
        .from(
          EntityDataModelApi.getEntitySet(action.entitySetId)
        )
        .mergeMap((results) => {
          return Observable
            .of(
              actionFactory.getEntitySetSuccess(results),
              actionFactory.getAssociationsRequest(results.entityTypeId)
            );
        })
        .catch((err) => {
          actionFactory.getEntitySetFailure(err);
        });
    });
}

function getAssociationsEpic(action$) {
  return action$
    .ofType(actionTypes.GET_ASSOCIATIONS_REQUEST)
    .mergeMap((action) => {
      return Observable
        .from(
          EntityDataModelApi.getAllAvailableAssociationTypes(action.entityTypeId)
        )
        .mergeMap((results) => {
          return Observable
            .of(
              actionFactory.getAssociationsSuccess(results)
            );
        })
        .catch((err) => {
          actionFactory.getAssociationsFailure(err);
        });
    });
}

function getAssociationDetailsEpic(action$) {
  return action$
    .ofType(actionTypes.GET_ASSOCIATION_DETAILS_REQUEST)
    .mergeMap((action) => {
      return Observable
        .from(
          EntityDataModelApi.getAssociationTypeDetails(action.associationId)
        )
        .mergeMap((associationDetails) => {
          console.log('details!')
          console.log(associationDetails)
          return Observable
            .of(
              actionFactory.getAssociationDetailsSuccess(associationDetails)
            );
        })
        .catch((err) => {
          actionFactory.getAssociationDetailsFailure(err);
        });
    });
}

function getAllEntityTypesEpic(action$) {
  return action$
    .ofType(actionTypes.GET_ENTITY_TYPES_REQUEST)
    .mergeMap((action) => {
      return Observable
        .from(
          EntityDataModelApi.getAllEntityTypes()
        )
        .mergeMap((results) => {
          return Observable
            .of(
              actionFactory.getAllEntityTypesSuccess(results)
            );
        })
        .catch((err) => {
          actionFactory.getAllEntityTypesFailure(err);
        });
    });
}

function submitQueryEpic(action$, state) {
  return action$
    .ofType(actionTypes.SUBMIT_TOP_UTILIZERS_REQUEST)
    .mergeMap((action) => {
      const topUtilizersState = state.getState().get('topUtilizers');
      const entitySetId = topUtilizersState.get('entitySetId');
      const topUtilizersDetailsObj = topUtilizersState.get('topUtilizersDetailsList').toJS();
      const topUtilizersDetailsList = Object.values(topUtilizersDetailsObj);
      return Observable
        .from(
          AnalysisApi.getTopUtilizers(entitySetId, 100, topUtilizersDetailsList)
        )
        .mergeMap((results) => {
          return Observable
            .of(
              actionFactory.submitTopUtilizersSuccess(results)
            );
        })
        .catch((err) => {
          actionFactory.submitTopUtilizersFailure(err);
        });
    });
}

function downloadTopUtilizersEpic(action$, state) {
  return action$
    .ofType(actionTypes.DOWNLOAD_TOP_UTILIZERS_REQUEST)
    .mergeMap((action) => {
      const topUtilizersState = state.getState().get('topUtilizers');
      const entitySetId = topUtilizersState.get('entitySetId');
      const topUtilizersDetailsObj = topUtilizersState.get('topUtilizersDetailsList').toJS();
      const topUtilizersDetailsList = Object.values(topUtilizersDetailsObj);
      return Observable
        .from(
          AnalysisApi.getTopUtilizers(entitySetId, 100, topUtilizersDetailsList, FileConsts.CSV)
        )
        .mergeMap((topUtilizersData) => {
          FileService.saveFile(topUtilizersData, 'Top Utilizers', FileConsts.CSV, () => {
            return Observable
              .of(
                actionFactory.downloadTopUtilizersSuccess()
              );
          });
        })
        .catch((err) => {
          actionFactory.downloadTopUtilizersFailure(err);
        });
    });
}

export default combineEpics(
  getEntitySetEpic,
  getAssociationsEpic,
  getAssociationDetailsEpic,
  getAllEntityTypesEpic,
  submitQueryEpic,
  downloadTopUtilizersEpic
);
