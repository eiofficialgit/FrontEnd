const cricketButton = document.getElementById("cricketButton");
const soccerButton = document.getElementById("soccerButton");
const tennisButton = document.getElementById("tennisButton");
let activeButton = null;

function setActiveButton(button, sport) {
  if (activeButton) {
    activeButton.classList.remove("active");
  }
  button.classList.add("active");
  activeButton = button;
  filterMatches(sport);
}

cricketButton.addEventListener("click", () => {
  setActiveButton(cricketButton, "Cricket");
});

soccerButton.addEventListener("click", () => {
  setActiveButton(soccerButton, "Soccer");
});

tennisButton.addEventListener("click", () => {
  setActiveButton(tennisButton, "Tennis");
});

async function getAllMatches() {
  const response = await fetch("http://3.0.102.63:7074/exuser/allMatches");
  const matches = await response.json();
  return matches.result;
}

function showAllMatches(data, sportName) {
  const sportNameData = data.filter((match) => {
    return match.sportName === sportName;
  });
  let content = document.getElementById("content");
  content.innerHTML = "";
  for (let i = 0; i < sportNameData.length; i++) {
    let child = sportNameData[i];
    handleAddMatchButtonClick(child);
    content.innerHTML += `<tr>
                                        <td>${child.eventId}</td>
                                        <td>${child.marketId}</td>
                                        <td>${child.createdAt}</td>
                                        <td>${child.eventName}</td>
                                        <td><button style="width: 100px;" class="status-active" id="addMatch" disabled>Match Added</button></td>
                                    </tr>`;
  }
}

async function filterMatches(sportName) {
  let data = await getAllMatches();
  showAllMatches(data, sportName);
}

async function handleAddMatchButtonClick(data) {
  try {
    const response = await fetch(
      "http://3.0.102.63:7074/exuser/saveMatch",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
  } catch (error) {
    console.error("Error:", error);
  }
}

setActiveButton(cricketButton, "Cricket");
