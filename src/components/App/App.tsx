import { Component, createSignal, For, Show } from 'solid-js';
import styles from './App.module.css';

import { Card } from '../Card';
import { teamPresets } from '../../data/teampresets';
import { Button } from '../Button';
import { Container } from '../Container';
import { Filters } from '../Filters';
import { Options } from '../Options';
import { characters } from '../../data/characters';
import {
  filterElements,
  filterRarity,
  selectedCharacters,
  mainDPSCharacters,
  offDPSCharacters,
  supportCharacters,
  setSelectedCharacters,
  setMainDPSCharacters,
  setOffDPSCharacters,
  setSupportCharacters,
} from '../../data/store';
import { GenshinCharacter, GenshinElement } from '../../types/types';
import { shuffle } from '../../utils/utils';

const idToCard =
  (offset: number = 0) =>
  (id: GenshinCharacter['id'], index: number) =>
    (
      <Card
        index={index + offset}
        character={characters.find(c => c.id === id)}
      />
    );

const App: Component = () => {
  //localStorage.clear();
  let currentSelectedCharacter: any = characters[0];
  const characterIsMainDPS = () => {
    return mainDPSCharacters.mainDPSCharacters.includes(currentSelectedCharacter.id);
  }
  const characterIsOffDPS = () => {
    return offDPSCharacters.offDPSCharacters.includes(currentSelectedCharacter.id);
  }
  const characterIsSupport = () => {
    return supportCharacters.supportCharacters.includes(currentSelectedCharacter.id);
  }
  const selectMainDPS = () => {
    setMainDPSCharacters(state => {
      if (characterIsMainDPS()) {
        return {
          ...state,
          mainDPSCharacters: [
            ...state.mainDPSCharacters.filter(
              selected => selected !== currentSelectedCharacter.id,
            ),
          ],
        };
      }
      return {
        ...state,
        mainDPSCharacters: [
          ...state.mainDPSCharacters,
          currentSelectedCharacter.id,
        ],
      };
    });
    setMainDPS(characterIsMainDPS());
  }
  const selectOffDPS = () => {
    setOffDPSCharacters(state => {
      if (characterIsOffDPS()) {
        return {
          ...state,
          offDPSCharacters: [
            ...state.offDPSCharacters.filter(
              selected => selected !== currentSelectedCharacter.id,
            ),
          ],
        };
      }
      return {
        ...state,
        offDPSCharacters: [
          ...state.offDPSCharacters,
          currentSelectedCharacter.id,
        ],
      };
    });
    setOffDPS(characterIsOffDPS());
  }
  const selectSupport = () => {
    setSupportCharacters(state => {
      if (characterIsSupport()) {
        return {
          ...state,
          supportCharacters: [
            ...state.supportCharacters.filter(
              selected => selected !== currentSelectedCharacter.id,
            ),
          ],
        };
      }
      return {
        ...state,
        supportCharacters: [
          ...state.supportCharacters,
          currentSelectedCharacter.id,
        ],
      };
    });
    setSupport(characterIsSupport());
  }

  const [limit, setLimit] = createSignal(true);
  const MainDPSLimit: Component = () => {
    return (
      <Show when={pro()} fallback={<Show when={limit()} fallback={<Options secondary onClick={() => setLimit(!limit())}>Limit to 1 Main DPS</Options>}>
      <Options onClick={() => setLimit(!limit())}>Limit to 1 Main DPS</Options>
    </Show>}> </Show>

    )
  }
  
  const [pro, setPro] = createSignal(false);
  const ProMode: Component = () => {
    return (
      <Show when={pro()} fallback={<Options secondary onClick={() => setPro(!pro())}>Use Preset Teams</Options>}>
        <Options onClick={() => setPro(!pro())}>Use Preset Teams</Options>
      </Show>
    )
  }

  const [characterText, setCharacterText] = createSignal(currentSelectedCharacter.fullName);
  const SelectedCharacterText: Component = () => {
    
    return <Show when={!pro()} fallback={" "}>
    <p>Selected Character: {characterText()}</p>
  </Show>;
  }
  const [mainDPS, setMainDPS] = createSignal(characterIsMainDPS());
  const SelectedMainDPS: Component = () => {
    return (
      <Show when={!pro()} fallback={" "}>
      <Show when={mainDPS()} fallback={<Options secondary onClick={selectMainDPS}>Main DPS</Options>}>
        <Options onClick={selectMainDPS}>Main DPS</Options>
        </Show>
      </Show>
    )
  }
  const [offDPS, setOffDPS] = createSignal(characterIsOffDPS());
  const SelectedOffDPS: Component = () => {
    return (
      <Show when={!pro()} fallback={" "}>
        <Show when={offDPS()} fallback={<Options secondary onClick={selectOffDPS}>Off DPS</Options>}>
          <Options onClick={selectOffDPS}>Off DPS</Options>
        </Show>
      </Show>
    )
  }
  const [support, setSupport] = createSignal(characterIsSupport());
  const SelectedSupport: Component = () => {
    return (
      <Show when={!pro()} fallback={" "}>
        <Show when={support()} fallback={<Options secondary onClick={selectSupport}>Support</Options>}>
          <Options onClick={selectSupport}>Support</Options>
        </Show>
      </Show>
    )
  }
  const [teams, setTeams] = createSignal<GenshinCharacter['id'][]>([]);
  const areAllCharatersSelected = () =>
    selectedCharacters.selectedCharacters.length === characters.length;
  const team1 = () => Array.from({ length: 4 }, (_, i) => teams()[i]);
  const team2 = () => Array.from({ length: 4 }, (_, i) => teams()[i + 4]);
  const generateTeams = () => {
    if (pro()) {
      if (selectedCharacters.selectedCharacters.includes(39)) {
        selectedCharacters.selectedCharacters.splice(39, 1);
        if (!selectedCharacters.selectedCharacters.includes(999)) {
          selectedCharacters.selectedCharacters.push(999);
        }
        if (!selectedCharacters.selectedCharacters.includes(998)) {
          selectedCharacters.selectedCharacters.push(998);
        }
        if (!selectedCharacters.selectedCharacters.includes(997)) {
          selectedCharacters.selectedCharacters.push(997);
        }
        if (!selectedCharacters.selectedCharacters.includes(996)) {
          selectedCharacters.selectedCharacters.push(996);
        }
      }
      const randomSelectedCharacters = shuffle(Array.from(selectedCharacters.selectedCharacters));
      const randomCharacter = randomSelectedCharacters[0];
      const randomTeamPresets = shuffle(Array.from(teamPresets));
      let firstTeam: number[] = [];
      let secondTeam: number[] = [];
      for (let i: number = 0; i < randomTeamPresets.length; i++) {
        if (randomTeamPresets[i].includes(randomCharacter)) {
          let foundCount = 0;
          for (let j: number = 0; j < randomTeamPresets[i].length; j++) {
            if (selectedCharacters.selectedCharacters.includes(randomTeamPresets[i][j])) {
              foundCount++;
            }
          }
          if (foundCount == 4) {
            firstTeam = randomTeamPresets[i];
            break;
          }
        }
      }
      let randomCharacter2 : number = -1;
      for (let i: number = 1; i < randomSelectedCharacters.length; i++) {
        if (firstTeam.length != 0 && !firstTeam.includes(randomSelectedCharacters[i])) {
          randomCharacter2 = randomSelectedCharacters[i];
          break;
        }
      }
      if (randomCharacter2 != -1) {
        for (let i: number = 0; i < randomTeamPresets.length; i++) {
          if (randomTeamPresets[i].includes(randomCharacter2)) {
            let foundCount = 0;
            for (let j: number = 0; j < randomTeamPresets[i].length; j++) {
              if (selectedCharacters.selectedCharacters.includes(randomTeamPresets[i][j]) && !firstTeam.includes(randomTeamPresets[i][j])) {
                foundCount++;
              }
            }
            if (foundCount == 4) {
              secondTeam = randomTeamPresets[i];
              break;
            }
          }
        }
      }
      setTeams(() => [...firstTeam, ...secondTeam]);
    }
    else if (limit()) {
      //const selectedMainDPSCharacters = shuffle(Array.from(selectedCharacters.selectedCharacters.filter(value => mainDPSCharacters.mainDPSCharacters.includes(value))));
      const selectedOffDPSCharacters = shuffle(Array.from(selectedCharacters.selectedCharacters.filter(value => offDPSCharacters.offDPSCharacters.includes(value))));
      const selectedSupportCharacters = shuffle(Array.from(selectedCharacters.selectedCharacters.filter(value => supportCharacters.supportCharacters.includes(value))));
      const selectedMainAndOffDPSCharacters = shuffle([...Array.from(selectedCharacters.selectedCharacters.filter(value => mainDPSCharacters.mainDPSCharacters.includes(value))), ...Array.from(selectedCharacters.selectedCharacters.filter(value => offDPSCharacters.offDPSCharacters.includes(value)))]);

      const team1 : any = [];
      const team2 : any = [];

      let team1Count = 1;
      let team2Count = 1;
      let team1MainDPS = false;
      let team2MainDPS = false;

      const healer1 = selectedSupportCharacters[0];
      const healer2 = selectedSupportCharacters[1];

      if (healer1 != undefined) { 
        team1[0] = selectedSupportCharacters[0];
      }
      if (healer2! != undefined) {
        team2[0] = selectedSupportCharacters[1];        
      }
      if (mainDPSCharacters.mainDPSCharacters.includes(selectedSupportCharacters[0])) {
        team1MainDPS = true;
      }
      if (mainDPSCharacters.mainDPSCharacters.includes(selectedSupportCharacters[1])) {
        team2MainDPS = true;
      }

      if (team1MainDPS == true && team2MainDPS == true) {
        for (let offDPS of selectedOffDPSCharacters) {
          if (team1Count + team2Count >= 8) {
            break;
          }
          if (team1Count < 4) {
            team1.push(offDPS);
            team1Count++;
          }
          else {
            team2.push(offDPS);
            team2Count++;
          }
        }
      }
      else {
        for (let dps of selectedMainAndOffDPSCharacters) {
          if (team1Count + team2Count >= 8) {
            break;
          }
          if (team1.includes(dps) || team2.includes(dps)) {
            continue;
          }
          if (mainDPSCharacters.mainDPSCharacters.includes(dps)) {
            if (team1MainDPS == true && team2MainDPS == true) {
              continue;
            }
            if (team1MainDPS == false) {
              
              team1MainDPS = true;
              team1.push(dps);
            }
            else if (team2MainDPS == false) {
              team2MainDPS = true;
              team2.push(dps);
            }
          }
          else {
            if (team1Count < 4) {
              team1.push(dps);
              team1Count++;
            }
            else {
              team2.push(dps);
              team2Count++;
            }
          }
        }
      }
      if (team1Count + team2Count < 8) {
        
        if (team2.length < 4) {
          for (let character of team1) {
            if (Math.abs(team2.length - team1.length) <= 1) {
              break;
            }
            if (team2MainDPS && mainDPSCharacters.mainDPSCharacters.includes(character) || supportCharacters.supportCharacters.includes(character)) {
              continue;
            } 
            team2.push(character);
            team1.splice(team1.indexOf(character, 0), 1);
            team1.push(undefined);
          }
        }
      }
      const parseLength = 4 - team1.length;
      if (team1.length < 4) {
        for (let i : number = 0; i < parseLength; i++) {
          team1.push(undefined);
        }
      }
      setTeams(() => [...team1, ...team2]);
    }
    else {
      const selectedSupportCharacters : any[] = shuffle(Array.from(selectedCharacters.selectedCharacters.filter(value => supportCharacters.supportCharacters.includes(value)))).slice(0, 2);
      const otherCharacters : any[] = shuffle(Array.from(selectedCharacters.selectedCharacters.filter(value => !supportCharacters.supportCharacters.includes(value)))).slice(0, 6);
      const otherCharactersSplit1 = otherCharacters.slice(0, otherCharacters.length / 2);
      otherCharactersSplit1.push(selectedSupportCharacters[0]);
      const parseCount = 4 - otherCharactersSplit1.length;
      for (let i: number = 0; i < (parseCount); i++) {
        otherCharactersSplit1.push(undefined);
      }
      const otherCharactersSplit2 = otherCharacters.slice(otherCharacters.length / 2);
      otherCharactersSplit2.push(selectedSupportCharacters[1]);
      setTeams(() => [...otherCharactersSplit1, ...otherCharactersSplit2]);
    }
  }
  return (
    <>
      <header class={styles.header}>
        <h1 class={styles.title}>Genshin Impact Spiral Abyss Drafter</h1>
        <a
          class={styles.githubIcon}
          href="https://github.com/daniel-aws/genshin-impact-team-randomizer"
          title="GitHub Repository"
          target="_blank"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              class={styles.githubIconPath}
              d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
            />
          </svg>
        </a>
      </header>
      <main>
        <div class={styles.teams}>
          <div class={`${styles.grid} ${styles.team}`}>
            {team1().map(idToCard())}
          </div>
          <div class={`${styles.grid} ${styles.team}`}>
            {team2().map(idToCard(4))}
          </div>
        </div>
        <div class={styles.buttons}>
          <ProMode />
          <MainDPSLimit />
          <Button
            secondary
            onClick={() =>
              setSelectedCharacters(state => ({
                ...state,
                selectedCharacters: areAllCharatersSelected()
                  ? []
                  : characters.map(c => c.id),
              }))
            }
          >
            {areAllCharatersSelected() ? 'Deselect' : 'Select'} all
          </Button>
          <Button onClick={generateTeams}>Generate teams</Button>

        </div>
        <Container>
          <Filters />
        </Container>
        <div class={styles.options}>
          <SelectedCharacterText />
          <SelectedMainDPS />
          <SelectedOffDPS />
          <SelectedSupport />
        </div>
        <div class={`${styles.grid} ${styles.mainGrid}`}>
          <For
            each={characters.filter(
              character =>
                (filterElements.length === 0 ||
                  filterElements.some(elem =>
                    character.elements.includes(elem as GenshinElement),
                  )) &&
                (filterRarity.length === 0 ||
                  filterRarity.includes(character.stars)),
            )}
          >
            {character => (
              <Card
                onClick={() => {
                  setSelectedCharacters(state => {
                    if (state.selectedCharacters.includes(character.id)) {
                      return {
                        ...state,
                        selectedCharacters: [
                          ...state.selectedCharacters.filter(
                            selected => selected !== character.id,
                          ),
                        ],
                      };
                    }
                    currentSelectedCharacter = character;
                    setCharacterText(currentSelectedCharacter.fullName);
                    setMainDPS(characterIsMainDPS());
                    setOffDPS(characterIsOffDPS());
                    setSupport(characterIsSupport());
                    return {
                      ...state,
                      selectedCharacters: [
                        ...state.selectedCharacters,
                        character.id,
                      ],
                    };
                  });
                }}
                character={character}
              />
            )}
          </For>
        </div>
      </main>
    </>
  );
};

export { App };
