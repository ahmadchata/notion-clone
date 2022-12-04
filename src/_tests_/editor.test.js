import { render, screen } from "@testing-library/react";
import Editor from "../components/editorPage";

test("renders the homepage", () => {
  render(<Editor />);

  expect(screen.getByRole("heading")).toHaveTextContent("Motiom");
});
