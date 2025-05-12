<script lang="ts">
  interface CurrentDate {
    day: string;
    month: string;
    date: number;
    year: number;
  }

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const d = new Date();
  const date: CurrentDate = {
    day: days[d.getDay()],
    month: months[d.getMonth()],
    date: d.getDate(),
    year: d.getFullYear(),
  };
</script>

<div class="date-wrapper">
  <p class="date">{date.day}, {date.month} {date.date}, {date.year}</p>
  <p class="paper">Today's Paper</p>
</div>

<style>
  .date-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    font-family:"Helvetica Neue", Arial, Helvetica, sans-serif;
  }

  .date {
    font-size: 0.75rem;
    color: #666;
    margin: 0;
    line-height: 1;
  }

  .paper {
    font-size: 0.875rem;
    font-weight: bold;
    margin: 0;
    line-height: 1;
  }
</style>