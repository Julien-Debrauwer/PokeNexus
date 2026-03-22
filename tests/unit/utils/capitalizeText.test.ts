import { describe, expect, it } from "vitest";
import { capitalizeText } from "../../../app/utils/capitalizeText";

describe("capitalizeText", () => {
  it("capitalizes the first letter of a lowercase string", () => {
    expect(capitalizeText("bulbasaur")).toBe("Bulbasaur");
  });

  it("does not alter an already-capitalized string", () => {
    expect(capitalizeText("Pikachu")).toBe("Pikachu");
  });

  it("capitalizes a single character", () => {
    expect(capitalizeText("a")).toBe("A");
  });

  it("returns an empty string unchanged", () => {
    expect(capitalizeText("")).toBe("");
  });

  it("only capitalizes the first letter, leaving the rest unchanged", () => {
    expect(capitalizeText("mEWtwo")).toBe("MEWtwo");
  });
});
