import ContentEditable from "react-contenteditable";
import React from "react";
import TagSelectorMenu from "./selectMenu";
import setCaretToEnd from "../utils/caret";
import getCaretCoordinates from "../utils/cord";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const CMD_KEY = "/";

// library does not work with hooks
class EditableBlock extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.openTagSelectorMenu = this.openTagSelectorMenu.bind(this);
    this.closeTagSelectorMenu = this.closeTagSelectorMenu.bind(this);
    this.handleTagSelection = this.handleTagSelection.bind(this);
    this.addPlaceholder = this.addPlaceholder.bind(this);
    this.calculateTagSelectorMenuPosition =
      this.calculateTagSelectorMenuPosition.bind(this);
    this.contentEditable = React.createRef();
    this.fileInput = null;
    this.state = {
      htmlBackup: null,
      html: "",
      tag: "p",
      placeholder: false,
      previousKey: null,
      isTyping: false,
      tagSelectorMenuOpen: false,
      tagSelectorMenuPosition: {
        x: null,
        y: null,
      },
    };
  }

  componentDidMount() {
    // Add a placeholder if the first block has no sibling elements and no content
    const hasPlaceholder = this.addPlaceholder({
      block: this.contentEditable.current,
      position: this.props.position,
      content: this.props.html,
    });
    if (!hasPlaceholder) {
      this.setState({
        ...this.state,
        html: this.props.html,
        tag: this.props.tag,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const stoppedTyping = prevState.isTyping && !this.state.isTyping;
    const hasNoPlaceholder = !this.state.placeholder;
    const htmlChanged = this.props.html !== this.state.html;
    const tagChanged = this.props.tag !== this.state.tag;
    if (((stoppedTyping && htmlChanged) || tagChanged) && hasNoPlaceholder) {
      this.props.updateBlock({
        id: this.props.id,
        html: this.state.html,
        tag: this.state.tag,
      });
    }
  }

  handleChange(e) {
    this.setState({ ...this.state, html: e.target.value });
  }

  handleFocus() {
    // If a placeholder is set, we remove it when the block gets focused
    if (this.state.placeholder) {
      this.setState({
        ...this.state,
        html: "",
        placeholder: false,
        isTyping: true,
      });
    } else {
      this.setState({ ...this.state, isTyping: true });
    }
  }

  handleBlur() {
    // Show placeholder if block is still the only one and empty
    const hasPlaceholder = this.addPlaceholder({
      block: this.contentEditable.current,
      position: this.props.position,
      content: this.state.html,
    });
    if (!hasPlaceholder) {
      this.setState({ ...this.state, isTyping: false });
    }
  }

  handleKeyDown(e) {
    if (e.key === CMD_KEY) {
      // If the user starts to enter a command, we store a backup copy of
      // the html. We need this to restore a clean version of the content
      // after the content type selection was finished.
      this.setState({ htmlBackup: this.state.html });
    } else if (e.key === "Backspace" && !this.state.html) {
      this.props.deleteBlock({ id: this.props.id });
    } else if (
      e.key === "Enter" &&
      this.state.previousKey !== "Shift" &&
      !this.state.tagSelectorMenuOpen
    ) {
      // If the user presses Enter, we want to add a new block
      // Only the Shift-Enter-combination should add a new paragraph,
      // i.e. Shift-Enter acts as the default enter behaviour
      e.preventDefault();
      this.props.addBlock({
        id: this.props.id,
        html: this.state.html,
        tag: this.state.tag,
        ref: this.contentEditable.current,
      });
    }
    // We need the previousKey to detect a Shift-Enter-combination
    this.setState({ previousKey: e.key });
  }

  // The openTagSelectorMenu function needs to be invoked on key up. Otherwise
  // the calculation of the caret coordinates does not work properly.
  handleKeyUp(e) {
    if (e.key === CMD_KEY) {
      this.openTagSelectorMenu("KEY_CMD");
    }
  }

  openTagSelectorMenu(trigger) {
    const { x, y } = this.calculateTagSelectorMenuPosition(trigger);
    this.setState({
      ...this.state,
      tagSelectorMenuPosition: { x: x, y: y },
      tagSelectorMenuOpen: true,
    });
    document.addEventListener("click", this.closeTagSelectorMenu, false);
  }

  closeTagSelectorMenu() {
    this.setState({
      ...this.state,
      htmlBackup: null,
      tagSelectorMenuPosition: { x: null, y: null },
      tagSelectorMenuOpen: false,
    });
    document.removeEventListener("click", this.closeTagSelectorMenu, false);
  }

  // Convert editableBlock shape based on the chosen tag
  // i.e. every other tag = <ContentEditable /> with its tag and html content
  handleTagSelection(tag) {
    if (this.state.isTyping) {
      // Update the tag and restore the html backup without the command
      this.setState({ tag: tag, html: this.state.htmlBackup }, () => {
        setCaretToEnd(this.contentEditable.current);
        this.closeTagSelectorMenu();
      });
    } else {
      this.setState({ ...this.state, tag: tag }, () => {
        this.closeTagSelectorMenu();
      });
    }
  }

  // Show a placeholder for blank pages
  addPlaceholder({ block, position, content }) {
    const isFirstBlockWithoutHtml = position === 1 && !content;
    const isFirstBlockWithoutSibling = !block.parentElement.nextElementSibling;
    if (isFirstBlockWithoutHtml && isFirstBlockWithoutSibling) {
      this.setState({
        ...this.state,
        html: "Type / for blocks, @ to link docs or people",
        tag: "p",
        placeholder: true,
        isTyping: false,
      });
      return true;
    } else {
      return false;
    }
  }

  // If the user types the "/" command, the tag selector menu should be displayed above
  calculateTagSelectorMenuPosition(initiator) {
    if (initiator === "KEY_CMD") {
      const { x: caretLeft, y: caretTop } = getCaretCoordinates(true);
      return { x: caretLeft, y: caretTop };
    } else {
      return { x: null, y: null };
    }
  }

  render() {
    return (
      <>
        {this.state.tagSelectorMenuOpen && (
          <TagSelectorMenu
            position={this.state.tagSelectorMenuPosition}
            closeMenu={this.closeTagSelectorMenu}
            handleSelection={this.handleTagSelection}
          />
        )}

        <div className="d-flex">
          {this.state.isTyping ? (
            <span role="button" className="pt-1 me-2">
              <FontAwesomeIcon icon={faBars} color="#aeaeae" />
            </span>
          ) : null}
          <ContentEditable
            innerRef={this.contentEditable}
            data-position={this.props.position}
            data-tag={this.state.tag}
            html={this.state.html}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onKeyDown={this.handleKeyDown}
            onKeyUp={this.handleKeyUp}
            tagName={this.state.tag}
            className={this.state.placeholder ? "place-holder" : null}
          />
        </div>
      </>
    );
  }
}

export default EditableBlock;
