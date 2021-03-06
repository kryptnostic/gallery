// import React from 'react';
// import { expect } from 'chai';
// import { shallow, mount } from 'enzyme';
// import '../../../../config/chai/chai.config';
// import Immutable from 'immutable';
// import RolePermissionsTable from './RolePermissionsTable';
//
// describe('RolePermissionsTable', function() {
//   const headers = ['Roles', 'Permissions'];
//   const rolePermissions = Immutable.fromJS({
//     AuthenticatedUser: ['Read', 'Link', 'Discover'],
//     Admin: ['Read'],
//     User: []
//   });
//   const defaultProps = {
//     headers,
//     rolePermissions
//   }
//
//   it('Should render', function() {
//     const wrapper = shallow(
//       <RolePermissionsTable {...defaultProps} />
//     );
//
//     expect(wrapper.length).to.eql(1);
//   })
//
//   it('Renders headers', function() {
//     const wrapper = shallow(
//       <RolePermissionsTable {...defaultProps} />
//     );
//
//     expect(wrapper.find('th')).to.have.length(2);
//   });
//
//   it('Renders a row for each role', function() {
//     const wrapper = mount(
//       <RolePermissionsTable {...defaultProps} />
//     );
//
//     expect(wrapper.find('.roleRow')).to.have.length(3);
//   });
// });
