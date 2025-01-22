import { render, screen } from "@testing-library/react";
import Home from "../../pages/index";

describe("Home page", () => {
  it("renders the hero text", () => {
    render(<Home />);
    const heading = screen.getByText(/Find Your Next Adventure/i);
    expect(heading).toBeInTheDocument();
  });
});
