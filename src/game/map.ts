import { Group } from "three";
import { mapChunks, mapTiles, tileSize } from "../config/constants";
import { createBlock } from "./block";

// MAP CONFIG
export const map = new Group();

export const generateMap = () => {
  for (const chunkCoord in mapChunks) {
    const [chunkX, chunkZ] = chunkCoord.split(',').map(Number);
    const rows = mapChunks[chunkCoord];

    rows.forEach((row, rowIndex) => {
      for (let colIndex = 0; colIndex < row.length; colIndex++) {
        const tileType = row[colIndex];

        const globalX = chunkX * mapTiles * tileSize + colIndex;
        const globalZ = chunkZ * mapTiles * tileSize + rowIndex;

        const block = createBlock(tileType, globalX, globalZ);
        map.add(block);
      }
    });
  }
};