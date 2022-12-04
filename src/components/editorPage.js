import React from "react";
import uid from "../utils/id";
import setCaretToEnd from "../utils/caret";
import EditableBlock from "./editor";
import Moment from "react-moment";

const initialBlock = { id: uid(), html: "", tag: "p" };

class EditablePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { blocks: [initialBlock] };
  }

  updatePageHandler = (updatedBlock) => {
    const blocks = this.state.blocks;
    const index = blocks.map((b) => b.id).indexOf(updatedBlock.id);
    const updatedBlocks = [...blocks];
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      tag: updatedBlock.tag,
      html: updatedBlock.html,
    };
    this.setState({ blocks: updatedBlocks });
  };

  addBlockHandler = (currentBlock) => {
    const newBlock = { id: uid(), html: "", tag: "p" };
    const blocks = this.state.blocks;
    const index = blocks.map((b) => b.id).indexOf(currentBlock.id);
    const updatedBlocks = [...blocks];
    updatedBlocks.splice(index + 1, 0, newBlock);
    this.setState({ blocks: updatedBlocks }, () => {
      currentBlock.ref.nextElementSibling.focus();
    });
  };

  deleteBlockHandler = (currentBlock) => {
    const previousBlock = currentBlock.ref.previousElementSibling;
    if (previousBlock) {
      const blocks = this.state.blocks;
      const index = blocks.map((b) => b.id).indexOf(currentBlock.id);
      const updatedBlocks = [...blocks];
      updatedBlocks.splice(index, 1);
      this.setState({ blocks: updatedBlocks }, () => {
        setCaretToEnd(previousBlock);
        previousBlock.focus();
      });
    }
  };

  render() {
    return (
      <div className="editor-frame">
        <div className="my-5 text-start">
          <h2 className="fw-bold">
            Welcome to Motiom, It's like Notion but better 😀
          </h2>
          <p>
            To create a text, type{" "}
            <span className="text-bg py-1 px-2 rounded">/</span> then{" "}
            <span className="text-bg py-1 px-2 rounded">1</span> then hit{" "}
            <span className="text-bg py-1 px-2 rounded">Enter</span> to select
            heading 1
          </p>
        </div>

        {this.state.blocks.map((block) => {
          return (
            <>
              {block.html !== "" ? (
                <div className="border text-start">
                  <span className="fw-bold time-post p-1">P</span>
                  <span>
                    <Moment fromNow>{block.id}</Moment>
                  </span>
                </div>
              ) : null}
              <EditableBlock
                key={block.id}
                id={block.id}
                tag={block.tag}
                html={block.html}
                updatePage={this.updatePageHandler}
                addBlock={this.addBlockHandler}
                deleteBlock={this.deleteBlockHandler}
              />
            </>
          );
        })}
      </div>
    );
  }
}

export default EditablePage;
