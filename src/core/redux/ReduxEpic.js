/*
 * @flow
 */

import {
  combineEpics
} from 'redux-observable';

import CatalogEpic from '../../containers/catalog/CatalogEpic';
import CreateEntitySetEpic from '../../containers/entitysetforms/CreateEntitySetEpic';
import EdmEpic from '../../containers/edm/EdmEpic';
import PermissionsEpic from '../../containers/permissions/PermissionsEpic';
import PermissionsSummaryEpic from '../../containers/permissionssummary/PermissionsSummaryEpic';

import OrganizationEpic from '../../containers/organizations/epics/OrganizationEpic';
import OrganizationsEpic from '../../containers/organizations/epics/OrganizationsEpic';
import PrincipalsEpic from '../../containers/principals/PrincipalsEpic';
import DatasetsEpic from '../../containers/datasets/DatasetsEpic';
import VisualizationEpic from '../../containers/visualizations/VisualizationEpic';
import TopUtilizersEpic from '../../containers/toputilizers/TopUtilizersEpic';
import ProfileEpic from '../../containers/profile/ProfileEpic';

export default function reduxEpic() {
  return combineEpics(
    CatalogEpic,
    CreateEntitySetEpic,
    EdmEpic,
    PermissionsEpic,
    PermissionsSummaryEpic,
    PrincipalsEpic,

    OrganizationEpic,
    OrganizationsEpic,
    DatasetsEpic,
    VisualizationEpic,
    TopUtilizersEpic,
    ProfileEpic
  );
}
