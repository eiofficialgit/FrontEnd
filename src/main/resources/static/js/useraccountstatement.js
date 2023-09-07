function getUserid(){
    const currentUrl = window.location.pathname;
    const userid=currentUrl.split("/")[2];
    return userid;
  }
  
  function getBaseUrl(){
    const currentUrl = window.location.href;
  const urlObject = new URL(currentUrl);
  return urlObject.origin;
  }
  
  document.getElementById("accountsummary").addEventListener("click", function(){
    const userid=getUserid();
    const baseurl=getBaseUrl();
    const updatedUrl=baseurl+"/userprofile/"+userid;
    window.location.href = updatedUrl;
  });
  
  document.getElementById("bettinghistory").addEventListener("click", function(){
    const userid=getUserid();
    const baseurl=getBaseUrl();
    const updatedUrl=baseurl+"/userbettinghistory/"+userid;
    window.location.href = updatedUrl;
  });
  
  document.getElementById("bettingprofitloss").addEventListener("click", function(){
    const userid=getUserid();
    const baseurl=getBaseUrl();
    const updatedUrl=baseurl+"/userprofitloss/"+userid;
    window.location.href = updatedUrl;
  });
  
  document.getElementById("transactionhistory").addEventListener("click", function(){
    const userid=getUserid();
    const baseurl=getBaseUrl();
    const updatedUrl=baseurl+"/useraccountstatement/"+userid;
    window.location.href = updatedUrl;
  });
  
  document.getElementById("activitylog").addEventListener("click", function(){
    const userid=getUserid();
    const baseurl=getBaseUrl();
    const updatedUrl=baseurl+"/useractivitylog/"+userid;
    window.location.href = updatedUrl;
  });

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

async function setOwnerData() {
  try {
    const response = await fetch("http://3.0.102.63:7074/exuser/loginUser");
  const result = await response.json();
  const decryptData=JSON.parse(decryptMessage(result.data));
  document.getElementById("accountStatementOwner").innerText = decryptData.userid;
  var sub=document.getElementById("accountSub");
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
  } catch (error) {
    console.error("Error:", error);
  }
}

async function showAccountStatement(currentPage, itemsPerPage){
    const userid=getUserid();
    const data={"userid": userid};
    console.log(data);
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
