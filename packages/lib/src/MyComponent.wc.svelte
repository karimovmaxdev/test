<svelte:options tag="my-component"/>

<script lang="js">
  import DatePicker from "./DatePicker.svelte";


  import { setContext } from 'svelte';
	import { fade } from "svelte/transition";
	import { writable } from "svelte/store";




  let startDate = writable("2023-04-21");
  let endDate = writable("2023-04-30");
  let counter = writable(0);
  setContext('startDate', startDate)
  setContext('endDate', endDate)
  setContext('counter', counter)
  

  const RU_DAYS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

  
  const locale = {
    en: {
      days: "Su|Mo|Tu|We|Th|Fr|Sa".split("|"),
      months: "Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec".split('|'),
      start: 0,
    },
    da: {
      days: "Sø|Ma|Ti|On|To|Fr|Lø".split("|"),
      months: "Jan|Feb|Mar|Apr|Maj|Jun|Jul|Aug|Sep|Okt|Nov|Dec".split('|'),
      start: 1,
    }
  }
  
  let culture = "en";

  // import { get_current_component } from "svelte/internal";

  // const component = get_current_component()



  
  // --------------------------------
  export let cities = [];
  export let addEventListener = (type, fn) => {
    if(type !== 'submit') return
    callSubmit = fn;
  };
  let selectedCityName = '';
  let cityFrom = '';
  let cityWhere = '';
  let focusedInput = '';
  let showList = true;
  let showCalendar = false;
  
  let wrapperEl;

  let callSubmit = () => {
    console.log('static callback')
  }
  
  function cityFromClicker(e) {
    selectedCityName = e.target.textContent;
    cityFrom = selectedCityName;
    showList = false;
  }
  function cityWhereClicker(e) {
    selectedCityName = e.target.textContent;
    cityWhere = selectedCityName;
    showList = false;
  }
  function validateFrom() {
    const key = cityFrom || selectedCityName;
    if(!key) return false;
    return cities.includes(key)
  }
  function validateWhere() {
    const key = cityWhere || selectedCityName;
    if(!key) return false;
    return cities.includes(key)
  }
  function inputHandler(e) {
    // if(!e.target.value) {
    //   cityFrom = '';
    // }

    const type = e.target.id;
    const value = e.target.value.toLowerCase();

    if(type === 'from') cityFrom = value;
    if(type === 'where') cityWhere = value;
  }
  function dateToLocale(string) {
    const date = new Date(string);
    const dayOfWeek = RU_DAYS[date.getDay()];
    const dayOfWeekNumber = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth()+1).toString().padStart(2, "0");

    return `${dayOfWeek} ${dayOfWeekNumber}/${month}`

  }
  function filtredCities(name) {
    if(!name) return cities;
    return cities.filter(it => it.includes(name))
  }
  let validFrom;
  let validWhere;
  $: validFrom = validateFrom(), cityFrom, selectedCityName;
  $: validWhere = validateWhere(), cityWhere, selectedCityName;

  $: if(typeof cities === 'string') {
    cities = cities.split(',')
  }


  // fix for index.html version
  // let body = document.querySelector('body')
  // body.addEventListener('click', (e) => {
  //   console.log('click')
  //   if(e.currentTarget === e.target) {
  //     showCalendar = false;
  //     showList = false;
  // } 
  // })


</script>

<svelte:window on:submit={callSubmit}/>
<svelte:body on:click={(e) => {
    if(e.currentTarget === e.target) {
    showCalendar = false;
    showList = false;
  } 
}}/>

<div 
  bind:this={wrapperEl}
  on:click={(e) => {
  if(e.target === wrapperEl) {
    showCalendar = false;
    showList = false;
  }


}} class="wrapper">
  <!-- <Icon name={"./svelte.svg"}/> -->
  <!-- <div class="icon">
    <Icon name={"./vector.svg"}/>
  </div> -->
  <div class="citySelector">
    <div class="inputSelectItem">
      <label for='from'>Откуда</label>
      <input 
        on:focus={() => {
          focusedInput = 'from';
          showList = true;
          if(showCalendar) showCalendar = false;
        }}
        on:input={inputHandler}
        id='from'
        value={cityFrom}
        class:notValid={!validFrom && cityFrom.length > 0}>
      {#if focusedInput === 'from' && filtredCities(cityFrom).length && showList}
        <div transition:fade>
          <div class='rect'/>
          <div class="list">
            {#each filtredCities(cityFrom) as item}
              <div on:click={cityFromClicker} class="listItem">{item}</div>
            {/each}
          </div>
        </div>
      {/if}


    </div>

    <div class="inputSelectItem">
      <label for='where'>Куда</label>
      <input 
        on:focus={() => {
          focusedInput = 'where'
          showList = true;
          if(showCalendar) showCalendar = false;
        }} 
        on:input={inputHandler}
        value={cityWhere}
        id='where'
        class:notValid={!validWhere && cityWhere.length > 0}>

      {#if focusedInput === 'where' && filtredCities(cityWhere).length && showList}
        <div transition:fade>
          <div class='rect'/>
          <div class="list">
            {#each filtredCities(cityWhere) as item}
              <div on:click={cityWhereClicker} class="listItem">{item}</div>
            {/each}
          </div>
        </div>
      {/if} 

    </div>
  </div>
  

  <div class="date">
    <div on:click={(e) => {
      if(showCalendar && e.target === e.currentTarget) showCalendar = false;
      if(showList && e.target === e.currentTarget) showList = false;
      }} 
      class="dateWrapper">
      <div class="title">Даты</div>
      <div class="values">
        <span on:click={() => {
          showCalendar = true;
          if(showList) showList = false;
        }} class="startData">{dateToLocale($startDate)}</span>
        <span on:click={() => {
          showCalendar = true;
          if(showList) showList = false;
        }} class="startData">{dateToLocale($endDate)}</span>
      </div>
    </div>

  </div>

  <div class="submit" class:notDisabled={validFrom && validWhere && cityFrom && cityWhere}>
    <button on:click={() => {
        showList = false;
        window.dispatchEvent(
          new CustomEvent("submit", {
            detail: {},
          }),
        );
    }}>Найти</button>
  </div>
{#if showCalendar}
  {#key $counter}
  <div transition:fade class="dateSelector">
      <div class="calendarWrapper">
        <!-- <input type="text" bind:value={startDate}/> -->
        <DatePicker bind:value={$startDate} {...locale[culture]}/>
      </div>

      <div class="calendarWrapper">
        <!-- <input type="text" bind:value={endDate}/> -->
        <DatePicker bind:value={$endDate} {...locale[culture]} lastPicker={true}/>
      </div>
  </div>
  {/key}
{/if}

</div>


<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .startData {
    position: relative;
    pointer-events: all;
    cursor: pointer;
    padding-left: 24px;
  }

  .startData:before {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    left: 0;
    background-image: url('./public/calendar.svg');
    background-repeat: no-repeat;
    background-position: center;
  }

  .wrapper {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 1032px;
    height: 101px;
    padding: 5px 23px;
    background-color: #F2F2F2;
    border-radius: 10px;
  }
  .citySelector {
    display: flex;
    align-items: center;
  }

  .inputSelectItem {
    position: relative;
    display: flex;
    flex-direction: column;
    text-align: start;
  }

  .inputSelectItem label {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    display: flex;
    max-width: 50px;
    align-items: center;
    color: #333333;
    cursor: pointer;
  }

  .inputSelectItem input {
    background: #E0E0E0;
    color: #333333;
    padding: 0 18px;
    padding-left: 37px;
    margin-top: 5px;
    height: 43px;
    width: 201px;
    border-radius: 5px;
    border: none;
    outline: none;
    transition: all .2s;
  }

  input.notValid {
    outline: 1px solid red;
  }

  .inputSelectItem input:focus {
    outline: 1px solid #0d99ff;
    transition: all .2s;
    
  }

  .inputSelectItem:first-child {
    margin-right: 10px;
  }

  .inputSelectItem:before {
    position: absolute;
    top: 36px;
    left: 18px;
    content: '';
    /* background-color: red; */
    width: 11px;
    height: 12px;
    background-image: url('/public/vector.svg');
    background-repeat: no-repeat;
    background-position: center;
  }

  .list {
    position: absolute;
    top: calc(100% + 23px);
    overflow: scroll;
    overflow-x: hidden;
    width: 415px;
    max-height: 232.5px;
    background: #F2F2F2;
    color: #333333;
    /* border: 2px solid #C4C4C4; */
    border-radius: 5px;
    z-index: 999;
  }

  .list::-webkit-scrollbar{
    display: none;
    /* width:4px; */
  }
  .list::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }

  .listItem {
    display: flex;
    align-items: center;
    height: 37px;
    padding: 0 20px;
    cursor: pointer;
    background-color: transparent;
  }

  .listItem:hover {
    background-color: #E0E0E0;
    transition: background-color .3s;
  }
  .rect {
    position: absolute;
    top: calc(100% + 17px);
    left: 10px;
    content: '';
    width: 25px;
    height: 25px;
    background-color: #F2F2F2;
    border: 1px solid #C4C4C4;
    border-radius: 5px;
    transform: rotate(45deg);
    z-index: 0;
  }
  .date {
    width: 386px;
    text-align: start;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    display: flex;
    align-items: center;
    color: #333333;
  }
  .dateWrapper {
    /* height: 64px; */
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .dateWrapper .title {
    max-width: 40px;
  }
  .values {
    position: relative;
    height: 43px;
    border-radius: 5px;
    margin-top: 5px;
    padding: 0 64px;
    background-color: #E0E0E0;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    display: flex;
    align-items: center;
  }
  .values span:last-child {
    margin-left: auto;
  }
  .values::before {
    content: '';
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    width: 20px;
    height: 1px;
    background-color: #BDBDBD;
  }
  .submit {
    display: flex;
    align-items: flex-end;
    width: 153px;
    height: 64px;
  }
  .submit button {
    width: 100%;
    height: 43px;
    border: none;
    border-radius: 5px;
    outline: none;
    cursor: pointer;
    background-color: #7A7878;
    color: #B0B0B0;
    pointer-events: none;

    transition: background-color .3s;
  }
  .submit.notDisabled button:hover {
    background-color: #333444;
  }

  .submit.notDisabled button {
    background-color: #333333;
    color: #F2F2F2;
    pointer-events: all;

  }
  .dateSelector {
    position: absolute;
    display: flex;
    top: calc(100% + 10px);
    right: calc(-220px);
    justify-content: space-between;
    width: 802px;
    gap: 50px;
    text-align: start;
    /* border: 1px solid red; */
    border-radius: 5px;
    background-color: #F2F2F2;
  }
  .calendarWrapper {
    display: flex;
  }


</style>
