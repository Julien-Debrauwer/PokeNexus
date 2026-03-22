import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { PokeAPIPokemon } from "../../../../app/types/pokeapi";

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

const mockPokemon: PokeAPIPokemon = {
  id: 6,
  name: "charizard",
  height: 17,
  weight: 905,
  types: [
    { slot: 1, type: { name: "fire", url: "" } },
    { slot: 2, type: { name: "flying", url: "" } },
  ],
  stats: [
    { base_stat: 78, effort: 0, stat: { name: "hp", url: "" } },
    { base_stat: 84, effort: 0, stat: { name: "attack", url: "" } },
  ],
  cries: { latest: "charizard.ogg", legacy: null },
};

describe("GET /api/pokemon/[id]", () => {
  let handler: (event: unknown) => Promise<unknown>;

  beforeEach(async () => {
    vi.resetModules();
    const mod = await import("../../../../server/api/pokemon/[id].get");
    handler = mod.default as (event: unknown) => Promise<unknown>;
  });

  it("returns the pokémon detail for a valid id", async () => {
    mockGetRouterParam.mockReturnValue("6");
    mockFetch.mockResolvedValue(mockPokemon);

    const result = await handler({});

    expect(result).toMatchObject({
      id: 6,
      name: "Charizard",
      types: ["fire", "flying"],
    });
  });

  it("converts height from decimetres to metres", async () => {
    mockGetRouterParam.mockReturnValue("6");
    mockFetch.mockResolvedValue(mockPokemon);

    const result = (await handler({})) as { height: number };

    expect(result.height).toBe(1.7);
  });

  it("converts weight from hectograms to kilograms", async () => {
    mockGetRouterParam.mockReturnValue("6");
    mockFetch.mockResolvedValue(mockPokemon);

    const result = (await handler({})) as { weight: number };

    expect(result.weight).toBe(90.5);
  });

  it("includes mapped stats", async () => {
    mockGetRouterParam.mockReturnValue("6");
    mockFetch.mockResolvedValue(mockPokemon);

    const result = (await handler({})) as { stats: Array<{ name: string; value: number }> };

    expect(result.stats).toEqual([
      { name: "hp", value: 78 },
      { name: "attack", value: 84 },
    ]);
  });

  it("includes the official artwork image URL", async () => {
    mockGetRouterParam.mockReturnValue("6");
    mockFetch.mockResolvedValue(mockPokemon);

    const result = (await handler({})) as { image: string };

    expect(result.image).toBe(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
    );
  });

  it("throws a 404 error when PokeAPI returns an error", async () => {
    mockGetRouterParam.mockReturnValue("9999");
    mockFetch.mockRejectedValue(new Error("Not Found"));

    await expect(handler({})).rejects.toMatchObject({ statusCode: 404 });
  });
});
