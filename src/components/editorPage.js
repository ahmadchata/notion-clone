import Editor from "./editor";
import { useState } from "react";
import moveCaret from "../utils/caret";

const EditorPage = () => {
  const [block, setBlock] = useState([{ html: "", tag: "h1" }]);

  const updatePageHandler = (updatedBlock) => {
    const index = block.map((b, i) => i).indexOf(updatedBlock);
    const updatedBlocks = [...block];
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      tag: updatedBlock.tag,
      html: updatedBlock.html,
    };
    setBlock(updatedBlocks);
  };

  const addBlockHandler = (currentBlock) => {
    const newBlock = { html: "", tag: "h1" };
    const index = block.map((b, i) => i).indexOf(currentBlock);
    const updatedBlocks = [...block];
    updatedBlocks.splice(index + 1, 0, newBlock);
    setBlock(updatedBlocks, () => {
      currentBlock.ref.nextElementSibling.focus();
    });
  };

  const deleteBlockHandler = (currentBlock) => {
    const previousBlock = currentBlock.ref.previousElementSibling;
    if (previousBlock) {
      const index = block.map((b, i) => i).indexOf(currentBlock);
      const updatedBlocks = [...block];
      updatedBlocks.splice(index, 1);
      setBlock(updatedBlocks, () => {
        moveCaret(previousBlock);
        previousBlock.focus();
      });
    }
  };
  return (
    <div className="editor-frame mt-5">
      <h2 className="fw-bold">
        Welcome to Notiom. It's like Notion but not as good 😀
      </h2>
      <p>You can add a text by typing / then 1</p>
      <div>
        {block.map((block, key) => (
          <Editor
            key={key}
            tag={block.tag}
            html={block.html}
            updatePage={updatePageHandler}
            addBlock={addBlockHandler}
            deleteBlock={deleteBlockHandler}
          />
        ))}
      </div>
    </div>
  );
};

export default EditorPage;
