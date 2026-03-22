import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { PokeAPIPokemon, PokeAPIPokemonSpecies } from "../../../../app/types/pokeapi";

const mockFetch = vi.fn();

beforeAll(() => {
  vi.stubGlobal("$fetch", mockFetch);
  vi.stubGlobal("defineEventHandler", (fn: (event: unknown) => unknown) => fn);
  vi.stubGlobal(
    "createError",
    (opts: { statusCode: number; statusMessage: string; message?: string }) => {
      const err = new Error(opts.message ?? opts.statusMessage);
      return Object.assign(err, opts);
    },
  );
});

afterEach(() => {
  vi.clearAllMocks();
});

const mockPokemon: PokeAPIPokemon = {
  id: 25,
  name: "pikachu",
  height: 4,
  weight: 60,
  types: [{ slot: 1, type: { name: "electric", url: "" } }],
  stats: [{ base_stat: 35, effort: 0, stat: { name: "hp", url: "" } }],
  cries: { latest: "pikachu-latest.ogg", legacy: "pikachu-legacy.ogg" },
};

const mockSpecies: PokeAPIPokemonSpecies = {
  id: 25,
  name: "pikachu",
  flavor_text_entries: [
    {
      flavor_text: "Quand plusieurs Pikachu se rassemblent.",
      language: { name: "fr", url: "" },
      version: { name: "red", url: "" },
    },
    {
      flavor_text: "When several of these Pokémon gather.",
      language: { name: "en", url: "" },
      version: { name: "red", url: "" },
    },
  ],
};

describe("GET /api/pokemon/random", () => {
  let handler: (event: unknown) => Promise<unknown>;

  beforeEach(async () => {
    vi.resetModules();
    const mod = await import("../../../../server/api/pokemon/random.get");
    handler = mod.default as (event: unknown) => Promise<unknown>;
  });

  it("returns a random pokémon with the correct shape", async () => {
    mockFetch.mockResolvedValueOnce(mockPokemon).mockResolvedValueOnce(mockSpecies);

    const result = await handler({});

    expect(result).toMatchObject({
      id: 25,
      name: "Pikachu",
      types: ["electric"],
      image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
    });
  });

  it("includes the French description when available", async () => {
    mockFetch.mockResolvedValueOnce(mockPokemon).mockResolvedValueOnce(mockSpecies);

    const result = (await handler({})) as { description: string };

    expect(result.description).toBe("Quand plusieurs Pikachu se rassemblent.");
  });

  it("returns null description when no French entry exists", async () => {
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
    mockFetch.mockResolvedValueOnce(mockPokemon).mockResolvedValueOnce(speciesNoFr);

    const result = (await handler({})) as { description: string | null };

    expect(result.description).toBeNull();
  });

  it("returns null description when species fetch fails", async () => {
    mockFetch
      .mockResolvedValueOnce(mockPokemon)
      .mockRejectedValueOnce(new Error("Species unavailable"));

    const result = (await handler({})) as { description: string | null };

    expect(result.description).toBeNull();
  });

  it("throws a 503 error when the pokemon fetch fails", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Connect Timeout"));

    await expect(handler({})).rejects.toMatchObject({ statusCode: 503 });
  });

  it("normalizes whitespace and form-feed characters in descriptions", async () => {
    const speciesWithFormFeed: PokeAPIPokemonSpecies = {
      ...mockSpecies,
      flavor_text_entries: [
        {
          flavor_text: "Ligne\fune.\nLigne deux.",
          language: { name: "fr", url: "" },
          version: { name: "red", url: "" },
        },
      ],
    };
    mockFetch.mockResolvedValueOnce(mockPokemon).mockResolvedValueOnce(speciesWithFormFeed);

    const result = (await handler({})) as { description: string };

    expect(result.description).toBe("Ligne une. Ligne deux.");
  });

  it("returns cries when present", async () => {
    mockFetch.mockResolvedValueOnce(mockPokemon).mockResolvedValueOnce(mockSpecies);

    const result = (await handler({})) as { cries: { latest: string; legacy: string } };

    expect(result.cries).toEqual({ latest: "pikachu-latest.ogg", legacy: "pikachu-legacy.ogg" });
  });
});
