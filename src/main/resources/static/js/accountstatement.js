/*account-statement page*/
var encryptedBase64Key = "bXVzdGJlMTZieXRlc2tleQ==";
var parsedBase64Key = CryptoJS.enc.Base64.parse(encryptedBase64Key);

function encryptMessage (data){
return CryptoJS.AES.encrypt(data, parsedBase64Key, {
  mode: CryptoJS.mode.ECB,
  padding: CryptoJS.pad.Pkcs7
  }).toString();
}

function decryptMessage (data){
return CryptoJS.AES.decrypt( data, parsedBase64Key, {
  mode: CryptoJS.mode.ECB,
  padding: CryptoJS.pad.Pkcs7
  } ).toString( CryptoJS.enc.Utf8 );
}

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

async function showAccountStatement(currentPage, itemsPerPage){
  const response = await fetch(`http://3.0.102.63:7074/exuser/transactionHistory?pageNumber=${currentPage}&pageSize=${itemsPerPage}`);
  const activityData = await response.json();
  const encryptedData=activityData.data;
  var decryptData = JSON.parse(decryptMessage(encryptedData));
  var stage = JSON.parse(decryptData.payload);
  showAllTransactoion(stage.content);
  totalPages = stage.totalPages;
}

function showAllTransactoion(data){
  let content = document.getElementById("content");
  content.innerHTML="";
    for (let i = 0; i < data.length; i++) {
    let child = data[i];
    content.innerHTML+=`<tr>
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
  getAllTransactoionLog(currentPage, itemsPerPage);
});