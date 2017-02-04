/*
 * @flow
 */

import React from 'react';

import styled from 'styled-components';

const TagWrapper = styled.div`
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  color: white;
  background-color: #4203c5;
  border: 1px solid #4203c5;
  border-radius: 4px;
  margin: 2px;
  display: inline-flex;
  align-items: center;
`;

const TagRemoveButton = styled.span`
  cursor: pointer;
  border-right: 1px solid #ffffff;
  border-bottom-left-radius: 4px;
  border-top-left-radius: 4px;
  padding: 2px 8px;

  &:hover {
    background-color: #2e0289;
  }
`;

const TagLabel = styled.span`
  cursor: default;
  border-bottom-right-radius: 4px;
  border-top-right-radius: 4px;
  padding: 2px 8px;
`;

export default class Tag extends React.Component {

  static propTypes = {
    label: React.PropTypes.string.isRequired,
    onRemoveTag: React.PropTypes.func.isRequired
  };

  renderTagRemoveButton = () => {

    return (
      <TagRemoveButton
          onClick={() => {
            this.props.onRemoveTag(this.props.label);
          }}>
        x
      </TagRemoveButton>
    );
  }

  renderTagLabel = () => {

    return (
      <TagLabel>{this.props.label}</TagLabel>
    );
  }

  render() {

    return (
      <TagWrapper>
        { this.renderTagRemoveButton() }
        { this.renderTagLabel() }
      </TagWrapper>
    );
  }
}
