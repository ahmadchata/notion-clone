import { useState, useEffect } from "react";
import { matchSorter } from "match-sorter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faT } from "@fortawesome/free-solid-svg-icons";

const MENU_HEIGHT = 150;
const allowedTags = [
  {
    id: "page-title",
    tag: "h1",
    label: "Heading 1",
    shortcut: "Shortcut: Type 1",
  },
  {
    id: "heading",
    tag: "h2",
    label: "Heading 2",
    shortcut: "Shortcut: Type 2",
  },
  {
    id: "subheading",
    tag: "h3",
    label: "Heading 3",
    shortcut: "Shortcut: Type 3",
  },
];

const TagSelectorMenu = ({ position, closeMenu, handleSelection }) => {
  const [tagList, setTagList] = useState(allowedTags);
  const [selectedTag, setSelectedTag] = useState(0);
  const [command, setCommand] = useState("");

  // If the tag selector menu is displayed outside the top viewport,
  // we display it below the block
  const isMenuOutsideOfTopViewport = position.y - MENU_HEIGHT < 0;
  const y = !isMenuOutsideOfTopViewport
    ? position.y - MENU_HEIGHT
    : position.y + MENU_HEIGHT / 3;
  const x = position.x;

  // Filter tagList based on given command
  useEffect(() => {
    setTagList(matchSorter(allowedTags, command, { keys: ["tag"] }));
  }, [command]);

  // Attach listener to allow tag selection via keyboard
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSelection(tagList[selectedTag].tag);
      } else if (e.key === "Tab" || e.key === "ArrowDown") {
        e.preventDefault();
        const newSelectedTag =
          selectedTag === tagList.length - 1 ? 0 : selectedTag + 1;
        setSelectedTag(newSelectedTag);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const newSelectedTag =
          selectedTag === 0 ? tagList.length - 1 : selectedTag - 1;
        setSelectedTag(newSelectedTag);
      } else if (e.key === "Backspace") {
        if (command) {
          setCommand(command.slice(0, -1));
        } else {
          closeMenu();
        }
      } else {
        setCommand(command + e.key);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [tagList, selectedTag, closeMenu, command, handleSelection]);

  return (
    <div
      className="select-menu border text-start p-2 shadow"
      style={{
        top: y,
        left: x,
        justifyContent: !isMenuOutsideOfTopViewport ? "flex-end" : "flex-start",
      }}
    >
      <div className="">
        <h6 className="normalText">Add blocks</h6>
        <p className="smallText fw-bold grayText">
          Keep typing to filter, or escape to exit
        </p>
        {tagList.map((tag, key) => {
          return (
            <div
              className="d-flex mb-2 ps-2"
              key={key}
              data-tag={tag.tag}
              role="button"
              tabIndex="0"
              onClick={() => handleSelection(tag.tag)}
            >
              <span>
                <FontAwesomeIcon icon={faT} className="icon" />
              </span>
              <div className="ms-2">
                <p className="m-0 fw-bold">{tag.label}</p>
                <p className="m-0 smallText grayText">{tag.shortcut}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TagSelectorMenu;
