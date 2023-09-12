async function getAllActiveMatches() {
  const response = await fetch(
    "http://3.0.102.63:7074/exuser/allSaveMatches/false"
  );
  const matches = await response.json();
  return matches;
}

function showAllMatches(data) {
  let content = document.getElementById("content");
  content.innerHTML = "";
  if (data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      let child = data[i];
      content.innerHTML += `<tr>
                                    <td>${child.sportName}</td>
                                    <td>${child.eventId}</td>
                                    <td>${child.marketId}</td>
                                    <td>${child.eventName}</td>
                                    <td>${child.createdAt}</td>
                                    <td>${child.isActive}</td>
                                    <td><button style="width: 100px;" class="websiteAdd" data-match='${JSON.stringify(
                                      child
                                    )}'>Mark Active</button></td>
                                </tr>`;
    }
  } else {
    content.innerHTML += `<tr>
                                <td>--</td>
                                <td>--</td>
                                <td>--</td>
                                <td>--</td>
                                <td>--</td>
                                <td>--</td>
                                <td><button style="width: 100px;" class="websiteAdd">Mark Active</button></td>
                            </tr>`;
  }
}
document.addEventListener("DOMContentLoaded", async function () {
  let data = await getAllActiveMatches();
  showAllMatches(data);
});
async function handleActiveMatchButtonClick(event) {
  const matchData = JSON.parse(event.target.getAttribute("data-match"));
  const data = {
    eventId: `${matchData.eventId}`,
    isActive: true,
  };
  try {
    const shouldProceed = window.confirm(
      `Are you sure you want to Active ${matchData.eventName} (${matchData.eventId}) ?`
    );
    if (shouldProceed) {
      const response = await fetch(
        "http://3.0.102.63:7074/exuser/activeInactiveMatches",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      if (result.status === "success") {
        alert(result.message);
        location.reload();
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("websiteAdd")) {
    handleActiveMatchButtonClick(event);
  }
});
