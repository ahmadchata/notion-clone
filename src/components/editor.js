import React from "react";
import ContentEditable from "react-contenteditable";
class EditableBlock extends React.Component {
  constructor(props) {
    super(props);
    this.contentEditable = React.createRef();
    this.state = {
      html: "",
      tag: "h1",
    };
  }

  componentDidMount() {
    this.setState({ html: this.props.html, tag: this.props.tag });
    console.log(this.props.html);
  }

  componentDidUpdate(prevProps, prevState) {
    const htmlChanged = prevState.html !== this.state.html;
    const tagChanged = prevState.tag !== this.state.tag;
    if (htmlChanged || tagChanged) {
      this.props.updatePage({
        html: this.state.html,
        tag: this.state.tag,
      });
    }
  }

  onChangeHandler = (e) => {
    this.setState({ html: e.target.value });
  };

  render() {
    return (
      <ContentEditable
        innerRef={this.contentEditable}
        html={this.state.html}
        tagName={this.state.tag}
        onChange={this.onChangeHandler}
      />
    );
  }
}

export default EditableBlock;
