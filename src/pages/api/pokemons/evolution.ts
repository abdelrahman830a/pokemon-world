import { NextApiRequest, NextApiResponse } from 'next';

import { PokemonEvolution } from '@/types/pokemon';
import evolutions from '~/generated/pokemon-evolution.json';

export type PokemonEvolutionFilter = {
  generationId?: number;
  type?: string;
};

const LIMIT = 28;

export const getEvolutions = (
  { generationId, type }: PokemonEvolutionFilter,
  page: number = 0,
): PokemonEvolution[] => {
  let data = evolutions;

  if (generationId) {
    data = data.filter((pokemons) =>
      pokemons.some((pokemon) => pokemon.generationId === generationId),
    );
  }

  if (type) {
    data = data.filter((pokemons) => pokemons.some((pokemon) => pokemon.types.includes(type)));
  }

  const start = LIMIT * page;
  const end = Math.min(start + LIMIT, data.length);
  
  // Ensure we don't exceed the length of the data
  if (start >= data.length) {
    return []; // Return an empty array if the start index is beyond the data length
  }

  return data.slice(start, end);
};


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req;
  const data = getEvolutions(
    {
      generationId: Number(query.generationId || 0),
      type: query.type as string,
    },
    Number(query.page || 0),
  );
  res.status(200).json(data);
}
