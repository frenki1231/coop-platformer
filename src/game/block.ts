import { BoxGeometry, Mesh, MeshStandardMaterial } from "three";
import { TILE_TYPES, tileSize } from "../config/constants";

export const createBlock = (type: string, x: number, z: number) => {
  const tile = TILE_TYPES[type as keyof typeof TILE_TYPES];

  const geometry = new BoxGeometry(tileSize, tile.height * tileSize, tileSize);
  const material = new MeshStandardMaterial({ color: tile.color });
  const mesh = new Mesh(geometry, material);

  mesh.position.set(
    x * tileSize + tileSize / 2,
    0,
    z * tileSize + tileSize / 2
  );

  mesh.receiveShadow = true;
  mesh.castShadow = true;

  return mesh;
}