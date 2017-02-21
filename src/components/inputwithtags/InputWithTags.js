/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';
import styled from 'styled-components';

import isEmpty from 'lodash/isEmpty';

import Tag from './Tag';

const TagsWrapper = styled.div`
  border: 2px solid #a3a8ab;
  border-radius: 4px;
  min-height: 36px;
  padding: 2px;
  display: inline-flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
`;

const TagInputFieldWrapper = styled.div`
  margin: 2px 8px;
  display: flex;
  flex: 1 0 auto;
`;

const TagInputField = styled.input`
  border: none;
  outline: none;
  width: 100%;
`;

// TODO: consider moving to a shared location to promote reusability
// TODO: leaving out many key codes for now, since we're only relying on the ENTER key
const KEY_CODES = {
  ENTER: 13
};

let idCounter = 0;
function getUniqueTagKey() {

  idCounter += 1;
  return `tag_${idCounter}`;
}

export default class InputWithTags extends React.Component {

  static propTypes = {
    placeholder: React.PropTypes.string,
    isValidNewTag: React.PropTypes.func
  };

  static defaultProps = {
    placeholder: 'Add new tag...',
    isValidNewTag: (tagLabel :string) => {
      return !!tagLabel;
    }
  }

  state :{
    inputValue :string,
    tags :Immutable.OrderedSet
  };

  constructor(props :Object) {

    super(props);

    this.state = {
      inputValue: '',
      tags: Immutable.OrderedSet()
    };
  }

  addTag = (tagLabel :string) => {

    if (isEmpty(tagLabel) || isEmpty(tagLabel.trim()) || this.state.tags.has(tagLabel)) {
      return;
    }

    if (!this.props.isValidNewTag(tagLabel)) {
      return;
    }

    const tags :Immutable.Map = this.state.tags.add(tagLabel);

    this.setState({
      tags,
      inputValue: ''
    });
  }

  removeTag = (tagLabel :string) => {

    const tags :Immutable.Map = this.state.tags.delete(tagLabel);

    this.setState({
      tags
    });
  }

  handleTagInputOnChange = (event) => {

    // TODO - this causes re-render for every keystroke, not ideal
    this.setState({
      inputValue: event.target.value
    });
  }

  handleKeyDown = (event) => {

    switch (event.keyCode) {

      case KEY_CODES.ENTER:
        this.addTag(event.target.value);
        break;

      default:
        break;
    }
  }

  renderTags = () => {

    return this.state.tags.map((tagLabel) => {
      return (
        <Tag
            key={getUniqueTagKey()}
            label={tagLabel}
            onRemoveTag={this.removeTag} />
      );
    }).valueSeq();
  }

  renderInputField = () => {

    return (
      <TagInputFieldWrapper>
        <TagInputField
            type="text"
            value={this.state.inputValue}
            placeholder={this.props.placeholder}
            onChange={this.handleTagInputOnChange}
            onKeyDown={this.handleKeyDown} />
      </TagInputFieldWrapper>
    );
  }

  render() {

    return (
      <TagsWrapper>
        { this.renderTags() }
        { this.renderInputField() }
      </TagsWrapper>
    );
  }
}
