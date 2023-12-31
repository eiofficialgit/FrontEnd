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
  await getAllTransactoionLog(currentPage, itemsPerPage);
}

async function prevPage() {
  currentPage--;
  pageButtons.innerHTML = currentPage + 1;
  await getAllTransactoionLog(currentPage, itemsPerPage);
}

async function firstPage() {
  currentPage = 0;
  pageButtons.innerHTML = currentPage + 1;
  await getAllTransactoionLog(currentPage, itemsPerPage);
}

async function lastPage() {
  currentPage = totalPages - 1;
  pageButtons.innerHTML = currentPage + 1;
  await getAllTransactoionLog(currentPage, itemsPerPage);
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
  await getAllTransactoionLog(currentPage, itemsPerPage);
}

async function getIdAndUsertype() {
  const response = await fetch("http://3.0.102.63:7074/exuser/loginUser");
  const result = await response.json();
  const decryptData=JSON.parse(decryptMessage(result.data));
  return decryptData;
}

async function showAccountStatement(currentPage, itemsPerPage){
  let idAndUsertype=await getIdAndUsertype();
  document.getElementById("accountStatementOwner").innerText = idAndUsertype.userid;
  var sub=document.getElementById("accountSub");
  if(idAndUsertype.usertype === 0){
      sub.innerText="O";
  }
  else if(idAndUsertype.usertype === 1){
      sub.innerText="SUA";
  }
  else if(idAndUsertype.usertype === 2){
      sub.innerText="MIA";
  }
  else if(idAndUsertype.usertype === 3){
      sub.innerText="SUS";
  }
  else if(idAndUsertype.usertype === 4){
      sub.innerText="SUM";
  }
  else if(idAndUsertype.usertype === 5){
      sub.innerText="M";
  }
  else if(idAndUsertype.usertype === 6){
      sub.innerText="U";
  }
  const data={"userid": `${idAndUsertype.userid}`};
  const payload={"payload": encryptMessage(JSON.stringify(data))};
  try {
    const response = await fetch(`http://3.0.102.63:7074/exuser/transactionHistory?pageNumber=${currentPage}&pageSize=${itemsPerPage}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const activityData = await response.json();
  const encryptedData=activityData.data;
  var decryptData = JSON.parse(decryptMessage(encryptedData));
  var stage = JSON.parse(decryptData.payload);
  console.log(stage.content);
  showAllTransactoion(stage.content);
  totalPages = stage.totalPages;
  } catch (error) {
    console.error("Error:", error);
  }
}

function showAllTransactoion(data){
  let content = document.getElementById("content");
  content.innerHTML="";
    for (let i = 0; i < data.length; i++) {
    let child = data[i];
    content.innerHTML+=`<tr style="height: 30px !important;">
    <td>${child.date_time}</td>
    <td>${child.depositFromUpline}</td>
    <td>-</td>
    <td>${child.withdrawByUpline}</td>
    <td>-</td>
    <td>${child.balance}</td>
    <td>-</td>
    <td>${child.from} -> ${child.to}</td>
    </tr>`;
    }
}

async function getAllTransactoionLog(currentPage, itemsPerPage) {
  await showAccountStatement(currentPage, itemsPerPage);
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
        getAllTransactoionLog(currentPage, itemsPerPage);
      }
    });
    prevBtn.addEventListener('click', function () {
      if (currentPage > 0) {
        prevPage();
        getAllTransactoionLog(currentPage, itemsPerPage);
      }
    });
    firstpageBtn.addEventListener('click', function () {
      firstPage();
      getAllTransactoionLog(currentPage, itemsPerPage);
    });
    lastpageBtn.addEventListener('click', function () {
      lastPage();
      getAllTransactoionLog(currentPage, itemsPerPage);
    });
    pageButtons.innerHTML = currentPage + 1;
  }
  setOwnerData();
  getAllTransactoionLog(currentPage, itemsPerPage);
});
