import { createLocalStore } from '../utils/utils';
import { GenshinCharacter } from '../types/types';
import { createStore } from 'solid-js/store';

const preselectedCharacters: GenshinCharacter['id'][] = [
  4, 5, 18, 25, 41, 39, 28,
];

const [mainDPSCharacters, setMainDPSCharacters] = createLocalStore(
  'mainDPSCharacters',
  {
    mainDPSCharacters: [1, 56, 9, 11, 13, 15, 19, 20, 21, 22, 27, 57, 28, 30, 31, 33, 37, 53, 42, 46, 48, 62, 63, 65]
  }
);

const [offDPSCharacters, setOffDPSCharacters] = createLocalStore(
  'offDPSCharacters',
  {
    offDPSCharacters: [2, 3, 4, 6, 55, 8, 52, 12, 14, 17, 18, 23, 25, 26, 59, 32, 35, 51, 36, 38, 39, 40, 41, 43, 44, 45, 47, 49, 60, 61]
  }
);

const [supportCharacters, setSupportCharacters] = createLocalStore(
  'supportCharacters',
  {
    supportCharacters: [5, 7, 10, 54, 16, 24, 28, 29, 33, 34, 50, 64]
  }
);

const [filterElements, setFilterElements] = createStore<string[]>([]);

const [filterRarity, setFilterRarity] = createStore<number[]>([]);

const [selectedCharacters, setSelectedCharacters] = createLocalStore(
  'selectedCharacters',
  {
    selectedCharacters: preselectedCharacters,
  },
);

export {
  mainDPSCharacters,
  setMainDPSCharacters,
  offDPSCharacters,
  setOffDPSCharacters,
  supportCharacters,
  setSupportCharacters,
  selectedCharacters,
  setSelectedCharacters,
  filterElements,
  setFilterElements,
  filterRarity,
  setFilterRarity,
};
