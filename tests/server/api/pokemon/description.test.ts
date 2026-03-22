import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { PokeAPIPokemonSpecies } from "../../../../app/types/pokeapi";

const mockFetch = vi.fn();
const mockGetRouterParam = vi.fn();

beforeAll(() => {
  vi.stubGlobal("$fetch", mockFetch);
  vi.stubGlobal("getRouterParam", mockGetRouterParam);
  vi.stubGlobal("defineEventHandler", (fn: (event: unknown) => unknown) => fn);
  vi.stubGlobal(
    "createError",
    (opts: { statusCode: number; statusMessage: string }) => {
      const err = new Error(opts.statusMessage);
      return Object.assign(err, opts);
    },
  );
});

afterEach(() => {
  vi.clearAllMocks();
});

const mockSpecies: PokeAPIPokemonSpecies = {
  id: 1,
  name: "bulbasaur",
  flavor_text_entries: [
    {
      flavor_text: "Une plante étrange\fa été semée.",
      language: { name: "fr", url: "" },
      version: { name: "red", url: "" },
    },
    {
      flavor_text: "A strange seed was planted.",
      language: { name: "en", url: "" },
      version: { name: "red", url: "" },
    },
  ],
};

describe("GET /api/pokemon/[id]/description", () => {
  let handler: (event: unknown) => Promise<unknown>;

  beforeEach(async () => {
    vi.resetModules();
    const mod = await import("../../../../server/api/pokemon/[id]/description.get");
    handler = mod.default as (event: unknown) => Promise<unknown>;
  });

  it("returns the French description for a valid pokémon", async () => {
    mockGetRouterParam.mockReturnValue("1");
    mockFetch.mockResolvedValue(mockSpecies);

    const result = (await handler({})) as { description: string };

    expect(result.description).toBe("Une plante étrange a été semée.");
  });

  it("normalizes form-feed and newline characters in the description", async () => {
    mockGetRouterParam.mockReturnValue("1");
    const speciesWithFormatting: PokeAPIPokemonSpecies = {
      ...mockSpecies,
      flavor_text_entries: [
        {
          flavor_text: "Ligne\fune.\nLigne  deux.",
          language: { name: "fr", url: "" },
          version: { name: "red", url: "" },
        },
      ],
    };
    mockFetch.mockResolvedValue(speciesWithFormatting);

    const result = (await handler({})) as { description: string };

    expect(result.description).toBe("Ligne une. Ligne deux.");
  });

  it("throws 404 when no French description is available", async () => {
    mockGetRouterParam.mockReturnValue("1");
    const speciesNoFr: PokeAPIPokemonSpecies = {
      ...mockSpecies,
      flavor_text_entries: [
        {
          flavor_text: "English only.",
          language: { name: "en", url: "" },
          version: { name: "red", url: "" },
        },
      ],
    };
    mockFetch.mockResolvedValue(speciesNoFr);

    await expect(handler({})).rejects.toMatchObject({ statusCode: 404 });
  });

  it("throws 404 when the pokémon does not exist", async () => {
    mockGetRouterParam.mockReturnValue("9999");
    mockFetch.mockRejectedValue(new Error("Not Found"));

    await expect(handler({})).rejects.toMatchObject({ statusCode: 404 });
  });

  it("re-throws a 404 createError thrown internally without wrapping it again", async () => {
    mockGetRouterParam.mockReturnValue("1");
    const speciesNoFr: PokeAPIPokemonSpecies = {
      ...mockSpecies,
      flavor_text_entries: [],
    };
    mockFetch.mockResolvedValue(speciesNoFr);

    const result = await handler({}).catch((e: unknown) => e);

    expect(result).toMatchObject({ statusCode: 404 });
  });
});
