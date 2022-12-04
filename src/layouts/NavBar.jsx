import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faBookOpen,
  faLock,
} from "@fortawesome/free-solid-svg-icons";

const NavBar = () => {
  return (
    <>
      <div className="d-flex justify-content-between text-muted smallText pt-2 px-2">
        <div>
          <ul className="list-unstyled d-flex">
            <li className="me-4">
              <FontAwesomeIcon icon={faChevronRight} />
              <FontAwesomeIcon icon={faChevronRight} />
            </li>
            <li className="me-2">
              <FontAwesomeIcon icon={faBookOpen} />
            </li>
            <li className="px-1">Main /</li>
            <li className="px-1">Getting Started /</li>
            <li className="px-1">Front-end developer</li>
          </ul>
        </div>
        <div className="d-flex">
          <ul className="list-unstyled d-flex">
            <li className="border-end px-3">
              <span className="me-1">
                <FontAwesomeIcon icon={faLock} />
              </span>
              Editing
            </li>
            <li className="ps-3">Publish Space</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default NavBar;
