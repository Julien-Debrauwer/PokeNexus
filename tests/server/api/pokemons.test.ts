import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { PokeAPIPokemon, PokeAPIPokemonList } from "../../../app/types/pokeapi";

// Mock Nitro globals before any dynamic import of the handler
const mockFetch = vi.fn();

beforeAll(() => {
  vi.stubGlobal("$fetch", mockFetch);
  // Bypass Nitro caching in tests: execute the handler function directly
  vi.stubGlobal("defineCachedEventHandler", (fn: () => unknown) => fn);
});

afterEach(() => {
  vi.clearAllMocks();
});

const makePokemon = (id: number, name: string): PokeAPIPokemon => ({
  id,
  name,
  height: 7,
  weight: 69,
  types: [{ slot: 1, type: { name: "grass", url: "" } }],
  stats: [{ base_stat: 45, effort: 0, stat: { name: "hp", url: "" } }],
  cries: { latest: "cry.ogg", legacy: null },
});

describe("GET /api/pokemons", () => {
  let handler: () => Promise<unknown>;

  beforeEach(async () => {
    vi.resetModules();
    const mod = await import("../../../server/api/pokemons.get");
    handler = mod.default as () => Promise<unknown>;
  });

  it("returns a list of 151 pokémon with correct shape", async () => {
    const listResponse: PokeAPIPokemonList = {
      count: 151,
      next: null,
      previous: null,
      results: [
        { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
        { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
      ],
    };

    mockFetch
      .mockResolvedValueOnce(listResponse)
      .mockResolvedValueOnce(makePokemon(1, "bulbasaur"))
      .mockResolvedValueOnce(makePokemon(2, "ivysaur"));

    const result = await handler();

    expect(result).toHaveLength(2);
    expect(result).toMatchObject([
      { id: 1, name: "Bulbasaur", types: ["grass"] },
      { id: 2, name: "Ivysaur", types: ["grass"] },
    ]);
  });

  it("includes the official artwork image URL", async () => {
    const listResponse: PokeAPIPokemonList = {
      count: 1,
      next: null,
      previous: null,
      results: [{ name: "charmander", url: "https://pokeapi.co/api/v2/pokemon/4/" }],
    };

    mockFetch
      .mockResolvedValueOnce(listResponse)
      .mockResolvedValueOnce(makePokemon(4, "charmander"));

    const result = (await handler()) as Array<{ image: string }>;

    expect(result[0].image).toBe(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png",
    );
  });

  it("propagates PokeAPI errors", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    await expect(handler()).rejects.toThrow("Network error");
  });
});
