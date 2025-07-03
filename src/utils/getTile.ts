import { TILE_TYPES } from "../config/constants";
import type { TileProperties, TileType } from "../types/types";

export const getTile = (char: string): TileProperties => {
  return TILE_TYPES[char as TileType] ?? TILE_TYPES.g;
};