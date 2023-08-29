var currentPage = 0;
var itemsPerPage = 10;
var totalPages = 0;
var pageButtons = document.getElementById('page-btn');
pageButtons.innerHTML = currentPage + 1;
async function nextPage() {
  if (currentPage < totalPages) {
    currentPage++;
  }
  pageButtons.innerHTML = currentPage + 1;
  await getAllActivityLog(currentPage, itemsPerPage);
}

async function prevPage() {
  currentPage--;
  pageButtons.innerHTML = currentPage + 1;
  await getAllActivityLog(currentPage, itemsPerPage);
}

async function firstPage() {
  currentPage = 0;
  pageButtons.innerHTML = currentPage + 1;
  await getAllActivityLog(currentPage, itemsPerPage);
}

async function lastPage() {
  currentPage = totalPages - 1;
  pageButtons.innerHTML = currentPage + 1;
  await getAllActivityLog(currentPage, itemsPerPage);
}

async function pageFind() {
  var pageSearch = document.getElementById("page-search").value;
  if (pageSearch === "" || pageSearch < 1) {
    alert("Please Enter a valid page number!");
    return;
  }
  else {
    if (pageSearch <= totalPages) {
      currentPage = pageSearch - 1;
    } else {
      alert("Maximum number of pages is : " + totalPages);
      return;
    }
  }
  pageButtons.innerHTML = currentPage + 1;
  await getAllActivityLog(currentPage, itemsPerPage);
}

async function showActivityLog(currentPage, itemsPerPage){
    const response = await fetch(`http://localhost:7074/exuser/activityLog?pageNumber=${currentPage}&pageSize=${itemsPerPage}`);
  const activityData = await response.json();
  const encryptedData=activityData.data;
  var decryptData = JSON.parse(decryptMessage(encryptedData));
  var stage = JSON.parse(decryptData.payload);
  showAllChild(stage.content);
  totalPages = stage.totalPages;
}

function showAllChild(data){
  let content = document.getElementById("content");
  content.innerHTML="";
    for (let i = 0; i < data.length; i++) {
    let child = data[i];
    content.innerHTML+=`<tr id="tempTr" style="height: 30px;">
    <td class="align-L" id="loginDate">${child.date_time}</td>
    <td class="align-L green" id="loginMessage">${child.loginStatus}</td>
    <td id="ipAddress">${child.ipAddress}</td>
    <td id="isp">-</td>
    <td id="location">-</td>
    <td id="userAgentType">Browser</td>
    </tr>`;
    }
}

async function getAllActivityLog(currentPage, itemsPerPage) {
  await showActivityLog(currentPage, itemsPerPage);
}

document.addEventListener("DOMContentLoaded", function () {
  const nextBtn = document.getElementById('next-btn');
  const prevBtn = document.getElementById('prev-btn');
  const firstpageBtn = document.getElementById('firstpage-btn');
  const lastpageBtn = document.getElementById('lastpage-btn');
  pageButtons.innerHTML = "";

  if (nextBtn && prevBtn && firstpageBtn && lastpageBtn) {
    nextBtn.addEventListener('click', function () {
      if (currentPage < totalPages - 1) {
        nextPage();
        getAllActivityLog(currentPage, itemsPerPage);
      }
    });
    prevBtn.addEventListener('click', function () {
      if (currentPage > 0) {
        prevPage();
        getAllActivityLog(currentPage, itemsPerPage);
      }
    });
    firstpageBtn.addEventListener('click', function () {
      firstPage();
      getAllActivityLog(currentPage, itemsPerPage);
    });
    lastpageBtn.addEventListener('click', function () {
      lastPage();
      getAllActivityLog(currentPage, itemsPerPage);
    });
    pageButtons.innerHTML = currentPage + 1;
  }
  getAllActivityLog(currentPage, itemsPerPage);
});

async function setOwnerData() {
  const response = await fetch("http://localhost:7074/exuser/loginUser");
  const result = await response.json();
  const decryptData=JSON.parse(decryptMessage(result.data));
  console.log(decryptData);
  document.getElementById("activityOwner").innerText = decryptData.userid;
  var sub=document.getElementById("activitySub");
  if(decryptData.usertype === 0){
      sub.innerText="O";
  }
  else if(decryptData.usertype === 1){
      sub.innerText="SUA";
  }
  else if(decryptData.usertype === 2){
      sub.innerText="MIA";
  }
  else if(decryptData.usertype === 3){
      sub.innerText="SUS";
  }
  else if(decryptData.usertype === 4){
      sub.innerText="SUM";
  }
  else if(decryptData.usertype === 5){
      sub.innerText="M";
  }
  else if(decryptData.usertype === 6){
      sub.innerText="U";
  }
}
setOwnerData();