const clockInterval = setInterval(function () {
  clock();
}, 1000);

const clock = () => {
  const d = new Date();
  let hours = d.getHours();
  let minutes = d.getMinutes();
  let ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  hours = ('0' + hours).slice(-2); // single digit hours should have leading 0
  minutes = ('0' + minutes).slice(-2); // single digit minutes should have leading 0
  document.getElementById("hours").innerHTML = hours;
  document.getElementById("ampm").innerHTML = ampm;
  document.getElementById("minutes").innerHTML = minutes;
}

clock();