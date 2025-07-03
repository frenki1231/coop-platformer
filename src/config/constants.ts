import type { TileProperties, TileType } from "../types/types";

export const mapTiles = 1;
export const tileSize = 10;

export const TILE_TYPES: Record<TileType, TileProperties> = {
  g: { height: 0.3, color: 0x55aa55 },
  p: { height: 0, color: 0x222222 },
  l: { height: 0.1, color: 0xff4500 },
};

export const mapChunks: Record<string, string[]> = {
  "0,0": ['gppggggggg', 'gppglllggg', 'gpglllllll', 'gpglllglll', 'gggllgggll', 'lllllgpggg', 'llggggppgg', 'gggpggpppp', 'ggpppppggg', 'gggpggpggg'],
  "0,1": ['pppggggggg', 'gggpppgglg', 'lggpppgglg', 'lllggggglg', 'llllglllgg', 'ggllllllgg', 'ggglllgggg', 'ppggggggpp', 'pggpppgggg', 'gppppppggp'],
  "1,0": ['pgggpppppp', 'ppgppppppp', 'ppppggpggg', 'pgggggggpp', 'pggggppppp', 'ggggpppppp', 'gppppgggpg', 'gggggggggg', 'lllllgggll', 'lllllllllg'],
  "1,1": ['ggggggpppg', 'pppppppppg', 'gppgggppgg', 'gggggggggg', 'pppgggpppp', 'ggpppppppp', 'glggppgggp', 'lllggggggg', 'llllgggglg', 'gggllllllg'],
  "2,0": ['lgggllllgg', 'gggggggggg', 'ggppgggggg', 'pgpppppggg', 'pgggpppppp', 'pppgpppppp', 'pppgggpppp', 'ppppggpppg', 'ppppgggggg', 'pppppggggp'],
  "2,1": ['gggllggglg', 'gggggggggg', 'gggggggggg', 'ggggpppggg', 'pppppppppp', 'ppppgggppp', 'ppppgggppp', 'ggpggggggp', 'gggggpgggg', 'ppggppppgg'],
};