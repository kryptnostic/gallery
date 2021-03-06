import React from 'react';
import { IndexRedirect, IndexRoute, Route } from 'react-router';
import Lattice from 'lattice';
import AuthService from '../../utils/AuthService';
import Container from './Container';
import Login from './Login/Login';
import HomeComponent from '../../containers/home/HomeComponent';
import Visualize from '../../containers/visualizations/Visualize';
import { Link } from './Link/Link';
import Apps from '../../containers/app/Apps';
import CatalogComponent from '../../containers/catalog/CatalogComponent';
import EntitySetDataSearch from '../../containers/entitysetsearch/EntitySetDataSearch';
import AdvancedDataSearch from '../../containers/entitysetsearch/AdvancedDataSearch';
import EntitySetDetailContainer from '../../containers/entitysetdetail/EntitySetDetailContainer';
import EntitySetDetailComponent from '../../containers/entitysetdetail/EntitySetDetailComponent';
import DatasetsComponent from '../../containers/datasets/DatasetsComponent';
import PageConsts from '../../utils/Consts/PageConsts';
import { ADMIN } from '../../utils/Consts/UserRoleConsts';
import { getDisplayName } from '../../containers/principals/PrincipalUtils';
import AllPermissions from '../../containers/permissionssummary/components/AllPermissions';
import EditProfile from '../../containers/profile/containers/EditProfileContainer';

import TopUtilizersContainer from '../../containers/toputilizers/components/TopUtilizersPage';
import TopUtilizersFormContainer from '../../containers/toputilizers/containers/TopUtilizersFormContainer';

import OrganizationsContainerComponent from '../../containers/organizations/components/OrganizationsContainerComponent';
import OrganizationDetailsComponent from '../../containers/organizations/components/OrganizationDetailsComponent';
import OrganizationsListComponent from '../../containers/organizations/components/OrganizationsListComponent';

import FlightGenerator from '../../containers/flightgenerator/FlightGenerator';

// injected by Webpack.DefinePlugin
declare var __AUTH0_CLIENT_ID__;
declare var __AUTH0_DOMAIN__;
declare var __DEV__;

const auth = new AuthService(__AUTH0_CLIENT_ID__, __AUTH0_DOMAIN__);

// onEnter callback to validate authentication in private routes
const requireAuth = (nextState, replace) => {
  if (!auth.loggedIn()) {
    replace({ pathname: `/${PageConsts.LOGIN}` });
  }
  else {
    const authToken = auth.getToken();
    const host = window.location.host;
    const hostName = (host.startsWith('www.')) ? host.substring('www.'.length) : host;
    const baseUrl = (__DEV__) ? 'http://localhost:8080' : `https://api.${hostName}`;
    Lattice.configure({ baseUrl, authToken });
  }
};

const isAdmin = () => {
  return (auth.loggedIn() && auth.getProfile().hasOwnProperty('roles') && auth.getProfile().roles.includes(ADMIN));
};

const getName = () => {
  if (auth.loggedIn()) {
    return getDisplayName(auth.getProfile());
  }
  return null;
};

const getProfileStatus = () => {
  return {
    isAdmin: isAdmin(),
    name: getName()
  };
};

export const makeMainRoutes = () => {
  return (
    <Route path={'/'} component={Container} auth={auth} profileFn={getProfileStatus}>
      <IndexRedirect to={`/${PageConsts.HOME}`} />
      <Route path={PageConsts.HOME} component={HomeComponent} onEnter={requireAuth} />
      <Route path={PageConsts.CATALOG} component={CatalogComponent} onEnter={requireAuth} />
      <Route path={`${PageConsts.SEARCH}/:entitySetId`} component={EntitySetDataSearch} onEnter={requireAuth} />
      <Route path={`${PageConsts.ADVANCED_SEARCH}/:entitySetId`} component={AdvancedDataSearch} onEnter={requireAuth} />
      <Route path={'entitysets/:id'} component={EntitySetDetailContainer} onEnter={requireAuth}>
        <IndexRoute component={EntitySetDetailComponent} />
        <Route path={'allpermissions'} component={AllPermissions} onEnter={requireAuth} />
        <Route path={'toputilizers'} component={TopUtilizersContainer} onEnter={requireAuth}>
          <IndexRoute component={TopUtilizersFormContainer} />
        </Route>
      </Route>
      <Route path={PageConsts.VISUALIZE} component={Visualize} onEnter={requireAuth} />
      <Route path={PageConsts.DATASETS} component={DatasetsComponent} onEnter={requireAuth} />
      <Route path={'orgs'} component={OrganizationsContainerComponent} onEnter={requireAuth}>
        <IndexRoute component={OrganizationsListComponent} />
        <Route path=":orgId" component={OrganizationDetailsComponent} onEnter={requireAuth} />
      </Route>
      <Route path={PageConsts.LOGIN} component={Login} />
      <Route path={'access_token=:token'} component={Login} /> {/* to prevent router errors */}
      <Route path={PageConsts.LINK} component={Link} onEnter={requireAuth} />
      <Route path={'entitysets/:id/allpermissions'} component={AllPermissions} onEnter={requireAuth} />
      <Route path={PageConsts.EDIT_ACCOUNT} component={EditProfile} onEnter={requireAuth} />
      <Route path={PageConsts.FLIGHT} component={FlightGenerator} onEnter={requireAuth} />
      <Route path={PageConsts.APP} component={Apps} onEnter={requireAuth} />
      <Route path="*" component={HomeComponent} onEnter={requireAuth} />
    </Route>
  );
};

export default makeMainRoutes;
