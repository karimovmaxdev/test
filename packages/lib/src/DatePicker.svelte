<script context="module">
    export function iso(date) {
        const pad = n => n < 10 ? "0" + n : n;
        return date.getFullYear() + "-" + pad(date.getMonth()+1) + "-" + pad(date.getDate());
    }
</script>
  
<script>
    import {getContext} from 'svelte'
    export let lastPicker = false;
    export let value = iso(new Date());
    export let days = 'Su|Mo|Tu|We|Th|Fr|Sa'.split('|');
    export let months = 'Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec'.split('|');
    export let start = 0; // first day of the week (0 = Sunday, 1 = Monday)
    export let offset = 0; // offset in months from currently selected date
    
    let date = iso(new Date());
    const startDate = getContext('startDate')
    const endDate = getContext('endDate')
    const counter = getContext('counter')
    $: acceptDate(value);
    
    function acceptDate(value) {
      const newDate = new Date(value);
      
      if (!isNaN(newDate)) {
        date = iso(newDate);
      }
    }
    
    function go(direction) {
      offset = offset + direction;
    }
    
    function selectDate(newValue) {
      date = newValue;
      value = newValue;
      offset = 0;
    }
    
    $: viewDate = viewDateFrom(date, offset);
    
    $: month = months[viewDate.getMonth()];
    
    $: year = viewDate.getFullYear();
    
    $: weeks = weeksFrom(viewDate, date, start);
    
    function viewDateFrom(date, offset) {
      var viewDate = new Date(date);
      viewDate.setMonth(viewDate.getMonth() + offset);
      return viewDate;
    }
  
    function weeksFrom(viewDate, date, start) {
      var first = new Date(viewDate.getTime());
      first.setDate(1);
      first.setDate(first.getDate() + ((start - first.getDay() - 7) % 7));
  
      var last = new Date(viewDate.getTime());
      last.setDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate());
      last.setDate(last.getDate() + ((start - last.getDay() + 6) % 7));
      
      var d = new Date(first.getTime()),
          M = viewDate.getMonth(),
          Y = viewDate.getFullYear(),
          D = viewDate.getDate(),
          week = [],
          weeks = [week];
      while (d.getTime() <= last.getTime()) {
        var dd = d.getDate(),
            mm = d.getMonth(),
            yy = d.getFullYear(),
            value = iso(d);

        week.push({
          date: dd,
          value,
          class: [
            date === value ? "selected" : "",
            lastPicker && date === value ? 'lastPick' : '',
            d.getTime() >= new Date($startDate).getTime() && d.getTime() < new Date($endDate).getTime() ? 'da' : 'net',
            // mm == M ? "" : ((mm > M ? yy >= Y : yy > Y) ? "future" : "past")
            // dd < D ? (mm <= M ? 'past' : 'future') : (mm < M ? 'past' : 'future')
            d.getTime() < new Date().getTime() ? 'past' : 'future',

          ].join(' ')
        });
  
        d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
  
        if (d.getDay() === start) {
          week = [];
          weeks.push(week);
        }
      }
  
      return weeks;
    }
    
</script>
  
<table>
<tr>
    <td class="btn" on:click={() => go(-1)}>&#9664;</td>
    <td colspan=5>{month} {year}</td>
    <td class="btn" on:click={() => go(+1)}>&#9654;</td>
</tr>
<tr>
    {#each days as day}
    <th>{day}</th>
    {/each}
</tr>
{#each weeks as week}
<tr>
    {#each week as day}
    <td class="btn {day.class}" on:click={() => {
      $counter++;
      const currentDate = new Date();
      const clickedDate = new Date(day.value);
      if(currentDate.toLocaleString().split(',')[0] === clickedDate.toLocaleString().split(',')[0]) {
        selectDate(day.value)
        return
      }
      if(clickedDate < currentDate) return;

      selectDate(day.value)
    }}>{day.date}</td>
    {/each}
</tr>
{/each}
</table>
  
<style global>
    .btn.da:not(.lastPick) {
      background-color: #333333;
      color: #F2F2F2;
    }
    td, th {
      width: 28px;
      text-align: center;
      border-radius: 4px;
      line-height: 24px;
      margin: 0;
      padding: 0;
      color: #333333;
    }
    td.past, td.future {
      /* opacity: 0.5; */
    }
    td.past {
      /* pointer-events: none; */
      /* opacity: 0.9; */
      color: #E0E0E0;
    }
    .btn {
      cursor: pointer;
      color: #333333;
    }
    .btn:hover:not(.past) {
      background: gray;
      color: white;
    }
    td.selected {
      color: #ffffff;
      font-weight: bold;
      /* background-color: #006dcc;
      border-color: #002a80; */
      background-color: #333333;
      color: #F2F2F2;
    }

  </style>
  