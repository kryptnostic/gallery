/*
 * @flow
 */

/*
 * simple actions
 */

export const CLEAR_USER_SEARCH_RESULTS :string = 'CLEAR_USER_SEARCH_RESULTS';
export const SHOW_DELETE_MODAL :string = 'SHOW_DELETE_MODAL';
export const HIDE_DELETE_MODAL :string = 'HIDE_DELETE_MODAL';

/*
 * HTTP request actions
 */

export const CREATE_ORG_REQUEST :string = 'CREATE_ORG_REQUEST';
export const CREATE_ORG_SUCCESS :string = 'CREATE_ORG_SUCCESS';
export const CREATE_ORG_FAILURE :string = 'CREATE_ORG_FAILURE';

export const DELETE_ORG_REQUEST :string = 'DELETE_ORG_REQUEST';
export const DELETE_ORG_SUCCESS :string = 'DELETE_ORG_SUCCESS';
export const DELETE_ORG_FAILURE :string = 'DELETE_ORG_FAILURE';

export const UPDATE_ORG_DESCRIPTION_REQUEST :string = 'UPDATE_ORG_DESCRIPTION_REQUEST';
export const UPDATE_ORG_DESCRIPTION_SUCCESS :string = 'UPDATE_ORG_DESCRIPTION_SUCCESS';
export const UPDATE_ORG_DESCRIPTION_FAILURE :string = 'UPDATE_ORG_DESCRIPTION_FAILURE';

export const UPDATE_ORG_NAME_REQUEST :string = 'UPDATE_ORG_NAME_REQUEST';
export const UPDATE_ORG_NAME_SUCCESS :string = 'UPDATE_ORG_NAME_SUCCESS';
export const UPDATE_ORG_NAME_FAILURE :string = 'UPDATE_ORG_NAME_FAILURE';

export const UPDATE_ORG_TITLE_REQUEST :string = 'UPDATE_ORG_TITLE_REQUEST';
export const UPDATE_ORG_TITLE_SUCCESS :string = 'UPDATE_ORG_TITLE_SUCCESS';
export const UPDATE_ORG_TITLE_FAILURE :string = 'UPDATE_ORG_TITLE_FAILURE';

export const ADD_DOMAIN_TO_ORG_REQUEST :string = 'ADD_DOMAIN_TO_ORG_REQUEST';
export const ADD_DOMAIN_TO_ORG_SUCCESS :string = 'ADD_DOMAIN_TO_ORG_SUCCESS';
export const ADD_DOMAIN_TO_ORG_FAILURE :string = 'ADD_DOMAIN_TO_ORG_FAILURE';

export const REMOVE_DOMAIN_FROM_ORG_REQUEST :string = 'REMOVE_DOMAIN_FROM_ORG_REQUEST';
export const REMOVE_DOMAIN_FROM_ORG_SUCCESS :string = 'REMOVE_DOMAIN_FROM_ORG_SUCCESS';
export const REMOVE_DOMAIN_FROM_ORG_FAILURE :string = 'REMOVE_DOMAIN_FROM_ORG_FAILURE';

export const ADD_ROLE_TO_ORG_REQUEST :string = 'ADD_ROLE_TO_ORG_REQUEST';
export const ADD_ROLE_TO_ORG_SUCCESS :string = 'ADD_ROLE_TO_ORG_SUCCESS';
export const ADD_ROLE_TO_ORG_FAILURE :string = 'ADD_ROLE_TO_ORG_FAILURE';

export const REMOVE_ROLE_FROM_ORG_REQUEST :string = 'REMOVE_ROLE_FROM_ORG_REQUEST';
export const REMOVE_ROLE_FROM_ORG_SUCCESS :string = 'REMOVE_ROLE_FROM_ORG_SUCCESS';
export const REMOVE_ROLE_FROM_ORG_FAILURE :string = 'REMOVE_ROLE_FROM_ORG_FAILURE';

export const ADD_MEMBER_TO_ORG_REQUEST :string = 'ADD_MEMBER_TO_ORG_REQUEST';
export const ADD_MEMBER_TO_ORG_SUCCESS :string = 'ADD_MEMBER_TO_ORG_SUCCESS';
export const ADD_MEMBER_TO_ORG_FAILURE :string = 'ADD_MEMBER_TO_ORG_FAILURE';

export const REMOVE_MEMBER_FROM_ORG_REQUEST :string = 'REMOVE_MEMBER_FROM_ORG_REQUEST';
export const REMOVE_MEMBER_FROM_ORG_SUCCESS :string = 'REMOVE_MEMBER_FROM_ORG_SUCCESS';
export const REMOVE_MEMBER_FROM_ORG_FAILURE :string = 'REMOVE_MEMBER_FROM_ORG_FAILURE';

export const ADD_ROLE_TO_MEMBER_REQUEST :string = 'ADD_ROLE_TO_MEMBER_REQUEST';
export const ADD_ROLE_TO_MEMBER_SUCCESS :string = 'ADD_ROLE_TO_MEMBER_SUCCESS';
export const ADD_ROLE_TO_MEMBER_FAILURE :string = 'ADD_ROLE_TO_MEMBER_FAILURE';

export const REMOVE_ROLE_FROM_MEMBER_REQUEST :string = 'REMOVE_ROLE_FROM_MEMBER_REQUEST';
export const REMOVE_ROLE_FROM_MEMBER_SUCCESS :string = 'REMOVE_ROLE_FROM_MEMBER_SUCCESS';
export const REMOVE_ROLE_FROM_MEMBER_FAILURE :string = 'REMOVE_ROLE_FROM_MEMBER_FAILURE';

export const FETCH_MEMBERS_REQUEST :string = 'FETCH_MEMBERS_REQUEST';
export const FETCH_MEMBERS_SUCCESS :string = 'FETCH_MEMBERS_SUCCESS';
export const FETCH_MEMBERS_FAILURE :string = 'FETCH_MEMBERS_FAILURE';

export const FETCH_ROLES_REQUEST :string = 'FETCH_ROLES_REQUEST';
export const FETCH_ROLES_SUCCESS :string = 'FETCH_ROLES_SUCCESS';
export const FETCH_ROLES_FAILURE :string = 'FETCH_ROLES_FAILURE';

export const LOAD_TRUSTED_ORGS_REQUEST :string = 'LOAD_TRUSTED_ORGS_REQUEST';
export const LOAD_TRUSTED_ORGS_SUCCESS :string = 'LOAD_TRUSTED_ORGS_SUCCESS';
export const LOAD_TRUSTED_ORGS_FAILURE :string = 'LOAD_TRUSTED_ORGS_FAILURE';

export const TRUST_ORG_REQUEST :string = 'TRUST_ORG_REQUEST';
export const TRUST_ORG_SUCCESS :string = 'TRUST_ORG_SUCCESS';
export const TRUST_ORG_FAILURE :string = 'TRUST_ORG_FAILURE';
