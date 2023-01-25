//to preserve scope
{
  //getting references in variables
  const currTime = document.getElementById("curr-time");
  const currDate = document.getElementById("curr-date");
  const selects = document.querySelectorAll("select");
  const setAlarmBtn = document.querySelector(".set-alarm-btn");
  const alarms = document.querySelector(".allAlarms");
  const delAll = document.querySelector(".delete-all");
  const myModal = document.querySelector("#my-modal");
  const mainCard = document.querySelector("#main-card");

  var audio = new Audio("./assests/alarm.mp3");

  //NOTE : localStorage stores only string hence used JSON. stringify and parse

  //INITIAL SETUP:
  //check if alarms is present in localstorage if not initalize as empty array
  let alarmsArray = JSON.parse(localStorage.getItem("alarmsArray"));
  alarmsArray = alarmsArray == null ? [] : alarmsArray;

  // fill options value for hour/min
  for (let i = 12; i > 0; i--) {
    i = i < 10 ? `0${i}` : i;
    let option = `<option value="${i}">${i}</option>`;
    selects[0].firstElementChild.insertAdjacentHTML("afterend", option);
  }
  for (let i = 59; i >= 0; i--) {
    i = i < 10 ? `0${i}` : i;
    let option = `<option value="${i}">${i}</option>`;
    selects[1].firstElementChild.insertAdjacentHTML("afterend", option);
    selects[2].firstElementChild.insertAdjacentHTML("afterend", option);
  }

  //Rendering all the alarms in array
  function renderAlarms() {
    localStorage.setItem("alarmsArray", JSON.stringify(alarmsArray));
    //update no of alarms
    document.querySelector(
      ".delete-all"
    ).innerHTML = `Delete All(${alarmsArray.length})`;

    if (alarmsArray.length == 0) {
      alarms.innerHTML =
        "<h5 style='color: rgb(107, 158, 206);text-align: center;'>No alarms for today !!</h5>";
      return;
    }
    let newEle = "";
    alarmsArray.map((alarm) => {
      let li = `<li class="alarm">
                <span><img class="clock-img" src="https://img.icons8.com/pulsar-color/2x/experimental-alarm-clock-pulsar-color.png" alt="alarm">
                 &nbsp;${alarm}</span>
                <i  onclick="delAlarm(event)" class="delete far fa-trash-alt"></i>
            </li>`;

      return (newEle += li);
    });
    alarms.innerHTML = newEle;
  }
  renderAlarms();

  // EVENT LISTENERS
  setAlarmBtn.addEventListener("click", () => {
    let hour = selects[0].value;
    let mins = selects[1].value;
    let sec = selects[2].value;
    let ampm = selects[3].value;

    if (hour == "HH" || mins == "MM" || sec == "SS") {
      alert("select valid time");
    } else {
      let alarmTime = `${hour}:${mins}:${sec} ${ampm}`;

      alarmsArray.push(alarmTime);
      alarmsArray.sort();

      renderAlarms();
      //reset values of select element
      selects.forEach((item) => {
        item.selectedIndex = 0;
      });
    }
  });

  delAll.addEventListener("click", (e) => {
    alarmsArray = [];
    renderAlarms();
  });
  //to delete individual alarm on clicked
  function delAlarm(e) {
    const item = e.target.parentElement.firstElementChild.innerText;
    alarmsArray.pop(item);
    renderAlarms();
  }
  //MODAL events
  let snoozed, delTime;
  function snooze() {
    alarmsArray.push(snoozed);
    closeModal();
    renderAlarms();
  }
  function closeModal() {
    myModal.removeAttribute("open");
    mainCard.style.opacity = "1";
    mainCard.style.pointerEvents = "";
    audio.pause();
    renderAlarms();
  }

  //ADDING setInterval to listen continously
  setInterval(() => {
    let date = new Date();

    // returns the date portion of a date object as a string, using locale conventions.
    let dT = date.toLocaleDateString();
    // format the time portion .
   let h = date.getHours(),
    m = date.getMinutes(),
    s = date.getSeconds(),
    ampm = "AM";
    if(h >= 12) {
        h=h-12;
        ampm = "PM";
    }
    h = h == 0 ? h = 12 : h;
    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;
    let time =`${h}:${m}:${s} ${ampm}`
    let t = time.split(":");
    
    //updating time evry second
    currTime.innerHTML = time;
    currDate.innerHTML = dT;

    if (alarmsArray.includes(time)) {
      myModal.setAttribute("open", "");
      mainCard.style.opacity = "0.5";
      mainCard.style.pointerEvents = "none";

      audio.play();
      audio.loop=true;
      t[1]=t[1] -0 +5;
      if(t[1]>=60){
        t[1] = t[1]-60;
        t[0] = t[0]- 0 +1;
        t[0] = t[0]>12?t[0]-12:t[0];
        t[0]= t[0]<10?'0'+t[0]:t[0];
      }
      
      t[1]= t[1]<10?'0'+t[1]:t[1];
      snoozed = `${t[0]}:${t[1]}:${t[2]}`;
      delTime = time;
      alarmsArray = alarmsArray.filter((alrm) => {
        return alrm != delTime;
      });
    }
    // if (confirm("click OK to SNOOZE for 5 mins | OR | CANCEL to DELETE alarm")) {
    //   let snoozed = t[0] < 10 ? "0" + `${t[0]}:${t[1] - 0 + 5}:${t[2]}`: `${t[0]}:${t[1] - 0 + 5}:${t[2]}`;
    //   alarmsArray.push(snoozed);
    // }
    // alarmsArray = alarmsArray.filter((alrm) => {
    //   return alrm != delTime;
    // });
    // audio.pause();
    // renderAlarms();
  });
}
