import { render, screen } from "@testing-library/react";
import Loader from "../games/Loader";
import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

describe("Loader component", () => {
  it("should include expected text", async () => {
    render(<Loader />);
    expect(screen.getByText("Waiting for other player")).toBeInTheDocument();
  });
});
