/*
 * @flow
 */

import { combineEpics } from 'redux-observable';

import AppEpic from '../../containers/app/AppEpic';
import CatalogEpic from '../../containers/catalog/CatalogEpic';
import CreateEntitySetEpic from '../../containers/entitysetforms/CreateEntitySetEpic';
import DatasetsEpic from '../../containers/datasets/DatasetsEpic';
import EdmEpic from '../../containers/edm/EdmEpic';
import EntitySetDetailEpic from '../../containers/entitysetdetail/EntitySetDetailEpic';
import HomeEpic from '../../containers/home/HomeEpic';
import OrganizationEpic from '../../containers/organizations/epics/OrganizationEpic';
import OrganizationsEpic from '../../containers/organizations/epics/OrganizationsEpic';
import PermissionsEpic from '../../containers/permissions/PermissionsEpic';
import PermissionsPanelEpic from '../../containers/permissionspanel/PermissionsPanelEpic';
import PrincipalsEpic from '../../containers/principals/PrincipalsEpic';
import VisualizationEpic from '../../containers/visualizations/VisualizationEpic';
import TopUtilizersEpic from '../../containers/toputilizers/TopUtilizersEpic';

import NeuronEpic from '../neuron/NeuronEpic';

export default function reduxEpic() {
  return combineEpics(
    AppEpic,
    CatalogEpic,
    CreateEntitySetEpic,
    DatasetsEpic,
    EdmEpic,
    EntitySetDetailEpic,
    HomeEpic,
    NeuronEpic,
    PermissionsEpic,
    PermissionsPanelEpic,
    PrincipalsEpic,
    OrganizationEpic,
    OrganizationsEpic,
    TopUtilizersEpic,
    VisualizationEpic
  );
}
