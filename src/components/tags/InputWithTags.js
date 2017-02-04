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

const KEY_CODES = {
  BACKSPACE: 8,
  TAB: 9,
  CLEAR: 12,
  ENTER: 13,
  SHIFT: 16,
  CONTROL: 17,
  ALT: 18,
  PAUSE: 19,
  CAPS_LOCK: 20,
  ESCAPE: 27,
  SPACE: 32,
  PAGE_UP: 33,
  PAGE_DOWN: 34,
  END: 35,
  HOME: 36,
  ARROW_LEFT: 37,
  ARROW_UP: 38,
  ARROW_RIGHT: 39,
  ARROW_DOWN: 40,
  INSERT: 45,
  DELETE: 46,
  F1: 112,
  F2: 113,
  F3: 114,
  F4: 115,
  F5: 116,
  F6: 117,
  F7: 118,
  F8: 119,
  F9: 120,
  F10: 121,
  F11: 122,
  F12: 123,
  NUM_LOCK: 144,
  SCROLL_LOCK: 145,
  META: 224
};

let idCounter = 0;
function getUniqueTagKey() {

  idCounter += 1;
  return `tag_${idCounter}`;
}

export default class InputWithTags extends React.Component {

  static propTypes = {
    placeholder: React.PropTypes.string
  };

  static defaultProps = {
    placeholder: 'Add new tag...'
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
