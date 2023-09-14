async function getAllActiveMatches() {
  const response = await fetch("http://3.0.102.63:7074/exuser/allSaveMatches/true");
  const matches = await response.json();
  return matches;
}

function showLoadingSpinner() {
  let content = document.getElementById("content");
  content.innerHTML = `<tr>
                        <td colspan="9">
                          <div class="d-flex justify-content-center">
                            <div class="spinner-border  text-warning"></div>
                            <p class="blink text-warning">Loading...</p>
                          </div>
                          </td>
                        </tr>`;
}

function showAllMatches(data) {
  let content = document.getElementById("content");
  content.innerHTML = "";
  for (let i = 0; i < data.length; i++) {
    let child = data[i];
    content.innerHTML += `<tr>
                            <td>${child.sportName}</td>
                            <td>${child.eventId}</td>
                            <td>${child.marketId}</td>
                            <td>${child.eventName}</td>
                            <td>${child.createdAt}</td>
                            <td>${child.isActive}</td>
                            <td><button style="width: 100px;" class="websiteAdd" id="inactiveMatchBtn" data-match='${JSON.stringify(child)}'>Mark Inactive</button> 
                                <button style="width: 110px;" class="websiteAdd">Suspend Match</button>
                                <button style="width: 100px;" class="websiteAdd">Update Date</button></td>
                        </tr>`;
  }
}



document.addEventListener('DOMContentLoaded', async function(){
    showLoadingSpinner();
    let data = await getAllActiveMatches();
    showAllMatches(data);
});
async function handleInactiveMatchButtonClick(event) {
    const matchData = JSON.parse(event.target.getAttribute("data-match"));
    const data={
      "eventId" : `${matchData.eventId}`,
      "isActive" : false
      };
    try {
      const shouldProceed = window.confirm(
        `Are you sure you want to Inactive ${matchData.eventName} (${matchData.eventId}) ?`
      );
      if (shouldProceed) {
        const response = await fetch("http://3.0.102.63:7074/exuser/activeInactiveMatches", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
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
    if (event.target.id === "inactiveMatchBtn") {
        handleInactiveMatchButtonClick(event);
    }
  });
