import { useState, useEffect } from "react";
import EditableBlock from "./editor";
import usePrevious from "../hooks/usePrevious";
import objectId from "../utils/id";
import setCaretToEnd from "../utils/caret";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faCircle,
  faArrowDown,
  faCircleCheck,
  faCloud,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";

// A page is represented by an array containing several blocks
const fetchedBlocks = [
  {
    _id: objectId(),
    html: "",
    tag: "p",
  },
];

const EditablePage = () => {
  const [blocks, setBlocks] = useState(fetchedBlocks);
  const [currentBlockId, setCurrentBlockId] = useState(null);

  const prevBlocks = usePrevious(blocks);

  // Handling the cursor and focus on adding and deleting blocks
  useEffect(() => {
    // If a new block was added, move the caret to it
    if (prevBlocks && prevBlocks.length + 1 === blocks.length) {
      const nextBlockPosition =
        blocks.map((b) => b._id).indexOf(currentBlockId) + 1 + 1;
      const nextBlock = document.querySelector(
        `[data-position="${nextBlockPosition}"]`
      );
      if (nextBlock) {
        nextBlock.focus();
      }
    }

    // If a block was deleted, move the caret to the end of the last block
    if (prevBlocks && prevBlocks.length - 1 === blocks.length) {
      const lastBlockPosition = prevBlocks
        .map((b) => b._id)
        .indexOf(currentBlockId);
      const lastBlock = document.querySelector(
        `[data-position="${lastBlockPosition}"]`
      );
      if (lastBlock) {
        setCaretToEnd(lastBlock);
      }
    }
  }, [blocks, prevBlocks, currentBlockId]);

  const updateBlockHandler = (currentBlock) => {
    const index = blocks.map((b) => b._id).indexOf(currentBlock.id);
    const updatedBlocks = [...blocks];
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      tag: currentBlock.tag,
      html: currentBlock.html,
    };
    setBlocks(updatedBlocks);
  };

  const addBlockHandler = (currentBlock) => {
    setCurrentBlockId(currentBlock.id);
    const index = blocks.map((b) => b._id).indexOf(currentBlock.id);
    const updatedBlocks = [...blocks];
    const newBlock = { _id: objectId(), tag: "p", html: "" };
    updatedBlocks.splice(index + 1, 0, newBlock);
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      tag: currentBlock.tag,
      html: currentBlock.html,
    };
    setBlocks(updatedBlocks);
  };

  const deleteBlockHandler = (currentBlock) => {
    if (blocks.length > 1) {
      setCurrentBlockId(currentBlock.id);
      const index = blocks.map((b) => b._id).indexOf(currentBlock.id);
      const updatedBlocks = [...blocks];
      updatedBlocks.splice(index, 1);
      setBlocks(updatedBlocks);
    }
  };

  return (
    <>
      <div className="editor-frame mt-4">
        <div className="d-flex justify-content-between border rounded py-2 px-1 text-muted fw-bold smallText">
          <div>
            <span className="fw-bold time-post p-1">P</span>
            <span className="border-start border-end px-2 ms-2">
              <FontAwesomeIcon icon={faClock} /> 0min
            </span>
            <span className="border-end px-2">
              <FontAwesomeIcon icon={faCircle} color="#ff6170" size="lg" />
            </span>
            <span className="px-2">
              <FontAwesomeIcon icon={faArrowDown} /> 0
            </span>
          </div>
          <div>
            <span>
              <FontAwesomeIcon icon={faCircleCheck} />
            </span>
            <span className="mx-2">
              <FontAwesomeIcon icon={faCloud} color="#cffae7" />
            </span>
            <span>
              <FontAwesomeIcon icon={faEllipsisVertical} />
            </span>
          </div>
        </div>
        <div className="text-start mb-5">
          <h1 className="fw-bold mt-4 border-bottom pb-2">
            Front-end developer test project
          </h1>
          <p className="smallText fw-bold text-muted">
            Your goal is to make a page that looks exactly like this one, one
            has the ability to create H1 simply by typing / then 1, then typing
            text, and hitting enter
          </p>
        </div>
        {blocks.map((block) => {
          const position = blocks.map((b) => b._id).indexOf(block._id) + 1;
          return (
            <EditableBlock
              key={block._id}
              position={position}
              id={block._id}
              tag={block.tag}
              html={block.html}
              addBlock={addBlockHandler}
              deleteBlock={deleteBlockHandler}
              updateBlock={updateBlockHandler}
            />
          );
        })}
      </div>
    </>
  );
};

export default EditablePage;
