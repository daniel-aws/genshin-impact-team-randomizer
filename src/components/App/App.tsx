import { Component, createSignal, For, Show, Switch, Match } from 'solid-js';
import styles from './App.module.css';
import { version } from '../../../package.json';
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
  const travelerList = [999,998,997,996]
  // Banned/removed characters
  if (selectedCharacters.selectedCharacters.includes(39)) {
    setSelectedCharacters(state => {
      return {
        ...state,
        selectedCharacters: [
          ...state.selectedCharacters.filter(
            selected => selected !== 39,
          ),
        ]
      };
    });
  }
  let currentSelectedCharacter: any = characters[0];
  let difficultyBtnArray = new Array<any>(5);
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

  function setElements(limit : boolean, healerlimit : number) {
    setLimit(limit);
    setHealerLimit(healerlimit);
    resetText();
  }

  function resetText () {
    let finaltext = "";
    const pretext = "Create a team where there will be ";
    const mainDPSpretext = ["any amount of Main DPS, even 0 Main DPS,", "exactly one Main DPS"];
    const supportpretext = ["any amount of Supports, even 0 Supports,", "exactly one Support", "at least one Support"]
    const posttext = " in the team."
    
    finaltext = pretext;

    switch (limit()) {
      case false:
        finaltext += mainDPSpretext[0];
        break;
      case true:
        finaltext += mainDPSpretext[1];
        break;
    }

    finaltext += " and ";

    switch (healerLimit()) {
      case 0:
        finaltext += supportpretext[0];
        break;
      case 1:
        finaltext += supportpretext[1];
        break;
      case 2:
        finaltext += supportpretext[2];
        break;
    }

    finaltext += posttext;
    setTeamCompText(finaltext);
  }

  const difficultyValues = ["Hardest","Harder","Medium","Easier","Easiest"]
  const [difficulty, setDifficulty] = createSignal(5); // 5 is easiest teams, 1 includes worse teams
  const DifficultyDisplay: Component = () => {
    return (
      <Show when={pro() == 1} fallback={" "}><div class={styles.difficultyBtnDiv}>Difficulty:&nbsp
      <select value={difficultyValues[difficulty()-1]} onInput={e => setDifficulty(difficultyValues.indexOf(e.currentTarget.value) + 1)}>
        <For each={difficultyValues}>{
          (val) => <option value={val}>{val}</option>
        }</For>
      </select>
    </div>
      </Show>)
  }

  const [teamCompText, setTeamCompText] = createSignal("");
  const TeamCompDisplay: Component = () => {
    resetText();
    return <Show when={pro() == 0} fallback={" "}>
    <p>{teamCompText()}</p>
    </Show>;
  }

  const [limit, setLimit] = createSignal(true);
  const MainDPSLimit: Component = () => {
    return (
      <Show when={pro() != 0} fallback={<Show when={limit()} fallback={<Options secondary onClick={() => setElements(!limit(), healerLimit())}>Main DPS Required: No</Options>}>
      <Options secondary onClick={() => setElements(!limit(), healerLimit())}>Main DPS Required: 1</Options>
    </Show>}> </Show>

    )
  }
  
  const [pro, setPro] = createSignal(1);
  const ProMode: Component = () => {
    return (
      <Switch fallback={" "}>
        <Match when={pro() == 1}>
          <Options secondary onClick={() => setPro(0)} title={"Click me to switch to Randomizer Mode"}>Preset Teams Mode</Options>
        </Match>
        <Match when={pro() == 0}>
          <Options secondary onClick={() => setPro(1)} title={"Click me to switch to Preset Teams Mode"}>Randomizer Mode</Options>
        </Match>
      </Switch>
    )
  }

  const [healerLimit, setHealerLimit] = createSignal(1);
  const HealLimit: Component = () => {
    return (
      <Show when={pro() != 0} fallback={
        <Switch fallback={" "}>
          <Match when={healerLimit() == 2}>
            <Options secondary onClick={() => setElements(limit(), 0)}>Supports Required: 1+</Options>
          </Match>
          <Match when={healerLimit() == 1}>
            <Options secondary onClick={() => setElements(limit(), 2)}>Supports Required: 1</Options>
          </Match>
          <Match when={healerLimit() == 0}>
            <Options secondary onClick={() => setElements(limit(), 1)}>Supports Required: No</Options>
          </Match>
        </Switch>}>
      </Show>

    )
  }

  const [characterText, setCharacterText] = createSignal(currentSelectedCharacter.fullName);
  const SelectedCharacterText: Component = () => {
    
    return <Show when={pro() == 0} fallback={" "}>
    <p>Selected Character: {characterText()}</p>
  </Show>;
  }
  const [mainDPS, setMainDPS] = createSignal(characterIsMainDPS());
  const SelectedMainDPS: Component = () => {
    return (
      <Show when={pro() == 0} fallback={" "}>
      <Show when={mainDPS()} fallback={<Options secondary onClick={selectMainDPS}>Main DPS</Options>}>
        <Options onClick={selectMainDPS}>Main DPS</Options>
        </Show>
      </Show>
    )
  }
  const [offDPS, setOffDPS] = createSignal(characterIsOffDPS());
  const SelectedOffDPS: Component = () => {
    return (
      <Show when={pro() == 0} fallback={" "}>
        <Show when={offDPS()} fallback={<Options secondary onClick={selectOffDPS}>Off DPS</Options>}>
          <Options onClick={selectOffDPS}>Off DPS</Options>
        </Show>
      </Show>
    )
  }
  const [support, setSupport] = createSignal(characterIsSupport());
  const SelectedSupport: Component = () => {
    return (
      <Show when={pro() == 0} fallback={" "}>
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
    
    /*if (pro() == 2) {
      const randomSelectedCharacters = shuffle(Array.from(selectedCharacters.selectedCharacters));
      let firstTeam: number[] = [];
      let secondTeam: number[] = [];
      const randomTeamPresets = shuffle(Array.from(teamPresets33FirstHalf));
      const randomTeamPresets2 = shuffle(Array.from(teamPresets33SecondHalf));
      let lastValidTeam: number[] = [];
      let randomCharacter2 : number = -1;
      for (let i: number = 1; i < randomSelectedCharacters.length; i++) {
        let found = false;
        firstTeam = [];
        const randomCharacter = randomSelectedCharacters[i];
        //console.log("Character 1: " + randomCharacter);
        for (let j: number = 0; j < randomTeamPresets.length; j++) {
          firstTeam = [];
          if (randomTeamPresets[j].includes(randomCharacter)) {
            let foundCount = 0;
            for (let k: number = 0; k < randomTeamPresets[j].length; k++) {
              if (selectedCharacters.selectedCharacters.includes(randomTeamPresets[j][k])) {
                foundCount++;
              }
            }
            if (foundCount == 4) {
              firstTeam = randomTeamPresets[j];
              lastValidTeam = firstTeam;
              break;
            }
          }
        }
        if (travelerList.some(r => firstTeam.includes(r))) {
          firstTeam = [...firstTeam, ...travelerList];
        }
        if (firstTeam.length == 0) {
          continue;
        }
        for (let l: number = 0; l < randomSelectedCharacters.length; l++) {
          secondTeam = [];
          randomCharacter2 = randomSelectedCharacters[l];
          //console.log("Character 2: " + randomCharacter2);
          for (let m: number = 0; m < randomTeamPresets2.length; m++) {
            if (randomTeamPresets2[m].includes(randomCharacter2)) {
              let foundCount = 0;
              for (let n: number = 0; n < randomTeamPresets2[m].length; n++) {
                if (selectedCharacters.selectedCharacters.includes(randomTeamPresets2[m][n]) && !firstTeam.includes(randomTeamPresets2[m][n])) {
                  foundCount++;
                }
              }
              if (foundCount == 4) {
                secondTeam = randomTeamPresets2[m];
                found = true;
                break;
              }
            }
            if (found) {
              break;
            }
          }
          if (found) {
            break;
          }
        }
        if (found) {
          break;
        }
      }
      firstTeam.splice(4);
      if (firstTeam.length == 0) {
        firstTeam = lastValidTeam;
      }
      //console.log(firstTeam);
      secondTeam.splice(4);
      //console.log(secondTeam);
      setTeams(() => [...firstTeam, ...secondTeam]);
    }
    else*/ if (pro() == 1) {
      const randomSelectedCharacters = shuffle(Array.from(selectedCharacters.selectedCharacters));
      let firstTeam: number[] = [];
      let secondTeam: number[] = [];
      const randomTeamPresets = shuffle(Array.from(teamPresets));
      let lastValidTeam: number[] = [];
      let randomCharacter2 : number = -1;
      for (let i: number = 1; i < randomSelectedCharacters.length; i++) {
        let found = false;
        firstTeam = [];
        const randomCharacter = randomSelectedCharacters[i];
        //console.log("Character 1: " + randomCharacter);
        for (let j: number = 0; j < randomTeamPresets.length; j++) {
          // if team preset does not fit difficulty filter, continue
          if (randomTeamPresets[j][4] != undefined && difficulty() > randomTeamPresets[j][4]) {
            continue;
          }
          firstTeam = [];
          if (randomTeamPresets[j].slice(0, 4).includes(randomCharacter)) {
            let foundCount = 0;
            for (let k: number = 0; k < 4; k++) {
              if (selectedCharacters.selectedCharacters.includes(randomTeamPresets[j][k])) {
                foundCount++;
              }
            }
            if (foundCount == 4) {
              firstTeam = randomTeamPresets[j].slice(0, 4);
              lastValidTeam = firstTeam;
              break;
            }
          }
        }
        if (travelerList.some(r => firstTeam.includes(r))) {
          firstTeam = [...firstTeam, ...travelerList];
        }
        if (firstTeam.length == 0) {
          continue;
        }
        for (let l: number = 0; l < randomSelectedCharacters.length; l++) {
          secondTeam = [];
          randomCharacter2 = randomSelectedCharacters[l];
          //console.log("Character 2: " + randomCharacter2);
          for (let m: number = 0; m < randomTeamPresets.length; m++) {
            if (randomTeamPresets[m][4] != undefined && difficulty() > randomTeamPresets[m][4]) {
              continue;
            }
            if (randomTeamPresets[m].slice(0, 4).includes(randomCharacter2)) {
              let foundCount = 0;
              for (let n: number = 0; n < 4; n++) {
                if (selectedCharacters.selectedCharacters.includes(randomTeamPresets[m][n]) && !firstTeam.includes(randomTeamPresets[m][n])) {
                  foundCount++;
                }
              }
              if (foundCount == 4) {
                secondTeam = randomTeamPresets[m].slice(0, 4);
                found = true;
                break;
              }
            }
            if (found) {
              break;
            }
          }
          if (found) {
            break;
          }
        }
        if (found) {
          break;
        }
      }
      firstTeam.splice(4);
      if (firstTeam.length == 0) {
        firstTeam = lastValidTeam;
      }
      //console.log(firstTeam);
      secondTeam.splice(4);
      //console.log(secondTeam);
      setTeams(() => [...firstTeam, ...secondTeam]);
    }
    else if (limit()) {
      //const selectedMainDPSCharacters = shuffle(Array.from(selectedCharacters.selectedCharacters.filter(value => mainDPSCharacters.mainDPSCharacters.includes(value))));
      let selectedOffDPSCharacters = shuffle(Array.from(selectedCharacters.selectedCharacters.filter(value => offDPSCharacters.offDPSCharacters.includes(value))));
      const selectedSupportCharacters = shuffle(Array.from(selectedCharacters.selectedCharacters.filter(value => supportCharacters.supportCharacters.includes(value))));
      let selectedOtherCharacters = shuffle([...Array.from(selectedCharacters.selectedCharacters.filter(value => mainDPSCharacters.mainDPSCharacters.includes(value))), ...Array.from(selectedCharacters.selectedCharacters.filter(value => offDPSCharacters.offDPSCharacters.includes(value)))]);

      const team1 : any = [];
      const team2 : any = [];

      let team1Count = 1;
      let team2Count = 1;
      let team1MainDPS = false;
      let team2MainDPS = false;

      if (healerLimit() != 0) {
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
      }
      if (team1MainDPS == true && team2MainDPS == true) {

        if (healerLimit() == 1) {
          selectedOffDPSCharacters = shuffle(Array.from(selectedOffDPSCharacters.filter(value => supportCharacters.supportCharacters.includes(value))));
        }
        for (let offDPS of selectedOffDPSCharacters) {
          if (team1Count + team2Count >= 8) {
            break;
          }
          if (team1.includes(offDPS) || team2.includes(offDPS)) {
            continue;
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
        if (healerLimit() != 1) {
          selectedSupportCharacters.splice(selectedSupportCharacters[0], 2);
          selectedOtherCharacters = shuffle([...selectedOtherCharacters, ...selectedSupportCharacters])
        }
        for (let character of selectedOtherCharacters) {
          if (team1Count + team2Count >= 8) {
            break;
          }
          if (team1.includes(character) || team2.includes(character)) {
            continue;
          }
          if (mainDPSCharacters.mainDPSCharacters.includes(character)) {
            if (team1MainDPS == true && team2MainDPS == true) {
              continue;
            }
            if (team1MainDPS == false) {
              
              team1MainDPS = true;
              team1.push(character);
            }
            else if (team2MainDPS == false) {
              team2MainDPS = true;
              team2.push(character);
            }
          }
          else {
            if (team1Count < 4) {
              team1.push(character);
              team1Count++;
            }
            else {
              team2.push(character);
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
    else if (healerLimit() > 0) {
      const selectedSupportCharacters: any[] = shuffle(Array.from(selectedCharacters.selectedCharacters.filter(value => supportCharacters.supportCharacters.includes(value)))).slice(0, 2);
      
      let otherCharacters: any[] = [];
      
      if (healerLimit() == 1) {
        otherCharacters = shuffle(Array.from(selectedCharacters.selectedCharacters.filter(value => !supportCharacters.supportCharacters.includes(value)))).slice(0, 6);
      }
      else {
        otherCharacters = shuffle(Array.from(selectedCharacters.selectedCharacters.filter(value => !selectedSupportCharacters.includes(value)))).slice(0, 6);
      }
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
    else {
      const rnd = shuffle(Array.from(selectedCharacters.selectedCharacters));
      setTeams(() => rnd.slice(0, 8));
    }
  }
  return (
    <>
      <header class={styles.header}>
        <div class={styles.support}>

          <p class={styles.affiliateText}>KeqingMains Affiliated</p>
          <a  class={styles.supportLink}
                href="https://discord.gg/keqing"
                title="KeqingMains"
                target="_blank"
              >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-discord" viewBox="0 0 16 16">
          <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z"/>
            </svg>
          </a>
          <p class={styles.affiliateText}>On Wangsheng Funeral Parlor: !!abyssrandomizer</p>
        </div>
        <h1 class={styles.title}>Genshin Impact Team Randomizer (Gottsmillk Version)</h1>
        <div>
        <div class={styles.support2}>
          <a class={styles.supportLink}
                  href="https://ko-fi.com/gottsmillk"
                  title="Ko-Fi"
                  target="_blank"
            >Click to support me for hosting costs</a>
            </div>
          <div class={styles.version}>

            <p class={styles.versionText}>Version {version}</p>
              <div class={styles.versionText2}>
              <a
                href="https://github.com/daniel-gmk/genshin-impact-team-randomizer"
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
            </div>
          </div>
        </div>
      </header>
      <h5 class={styles.title}>Choose between three modes:
        <p><b><u>Randomizer Mode:</u></b> Select roles for each character and whether to limit/require Main DPS or Supports. Then chooses randomly.</p>
        <p><b><u>Preset Teams Mode:</u></b> Teams and character modes are preset from well-known character guides and team databases.</p>
      </h5>
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
          <p>Current Mode:</p>
          <ProMode />
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
          <DifficultyDisplay />
        </Container>

        <Container>
          <Filters />
        </Container>
        
        <div class={styles.options}>
          <MainDPSLimit />
          <HealLimit />
        </div>
        <div class={styles.options}>
          <TeamCompDisplay />
        </div>

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
