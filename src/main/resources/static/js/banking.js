/*Banking Page*/
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
var itemsPerPage = 7;
var totalPages=0;
var pageButtons = document.getElementById('page-btn');
pageButtons.innerHTML=currentPage+1;
function nextPage() {
  if(currentPage < totalPages){
    currentPage++;
  }
  pageButtons.innerHTML=currentPage+1;
  getAllChild(currentPage,itemsPerPage);
}

function prevPage() {
  if(currentPage > 0) {
    currentPage--;
  }
  pageButtons.innerHTML=currentPage+1;
  getAllChild(currentPage,itemsPerPage);
}

function firstPage() {
  currentPage=0;
  pageButtons.innerHTML=currentPage+1;
  getAllChild(currentPage,itemsPerPage);
}

function lastPage() {
  currentPage=totalPages;
  pageButtons.innerHTML=currentPage;
  getAllChild(currentPage-1,itemsPerPage);
}

function pageFind(){
  var pageSearch=document.getElementById("page-search").value;
  if(pageSearch === "" || pageSearch < 1){
    alert("Please Enter a valid page number!");
    return;
  }
  else{
    if(pageSearch <= totalPages){
      currentPage=pageSearch-1;
    } else {
      alert("Maximum number of pages is : " + totalPages);
      return;
    }
  }
  pageButtons.innerHTML=currentPage+1;
  getAllChild(currentPage,itemsPerPage);
}

window.addEventListener("DOMContentLoaded", (event) => {
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const firstpageBtn = document.getElementById('firstpage-btn');
const lastpageBtn = document.getElementById('lastpage-btn');
pageButtons.innerHTML="";
if(nextBtn && prevBtn && firstpageBtn && lastpageBtn){
  nextBtn.addEventListener('click', nextPage);
  prevBtn.addEventListener('click', prevPage);
  firstpageBtn.addEventListener('click', firstPage);
  lastpageBtn.addEventListener('click', lastPage);
  pageButtons.innerHTML=currentPage+1;
}
});

async function getAllChild(currentPage, itemsPerPage) {
const response = await fetch(`http://3.0.102.63:7074/exuser/allchildwithpagination?pageNumber=${currentPage}&pageSize=${itemsPerPage}`);
const childs = await response.json();
  const encryptedData=childs.data;
  var decryptData=JSON.parse(decryptMessage(encryptedData));
  var stage=JSON.parse(decryptData.payload);
  showAllChild(stage.content);
  totalPages=stage.totalPages;
}

function  showAllChild(data) {
/*let totalExposureField=document.getElementById("totalExposure");
let totalAvailBal=document.getElementById("totalAvailBal");
let totalBalance=document.getElementById("totalBalance");
let availableBalance=document.getElementById("mastersAvailBal");
var totalExposureData=0;
var totalAvailableBalanceData=0;
var availableBalanceData=0;*/
let childs = document.getElementById("childs");
childs.innerHTML="";
for (let i = 0; i < data.length; i++) {
  let child = data[i];
  //totalExposureData=totalExposureData+child.exposureLimit;
  //totalAvailableBalanceData=totalAvailableBalanceData+child.myBalance;
  childs.innerHTML+=`<tr class="dataofAccount">
  <td id="ad" class="align-L"><span class="order" style="margin-right: 10px;">${i+1}.</span>${child.userid}</td>
  <td id="sa" class="align-L">71,690.41</td>
  <td id="ma" class="align-L">67,750.07</td>
  <td id="exp" class="align-L red">3,940.34</td>
  <td id="sm" class="align-L DW-amount">
    <button id="dbtn" class="dn">D</button><button id="wbtn" class="wd">W</button>
    <div class="amblock">
        <span class="amn"></span><input type="text" name="amount" id="amountmain" maxlength="8" placeholder="0" disabled="">
    </div>
    <button _ngcontent-fus name="amount" id="amountmain" maxlength="8" placeholder="0" disabled="">
    </div>
        <button _ngcontent-xla-c42="" id="dpWdFullBtn" disabled="" style="opacity: 0.5;">Full</button>
  </td>
  <td id="mm" class="align-L credit-amount"><a href="" id="usercreditrefrencemain">0</a><button id="editcreditbtrefrenacemain" data-toggle="modal" data-target="#credRefModal" class="but_suspend openchangepwdmodal icon tdd">Edit</button></td>
  <td id="agm" class="align-L">
    <p>1,000.00</p>
  </td>
  <td id="client" class="align-L"><input type="text" placeholder="Remark" class="remarkInput"></td>
  <td id="client" class="align-L"><button id="log">Log</button></td>
</tr>
<tr class="lastTr"></tr>`;
}
/*totalExposureField.innerHTML=totalExposureData;
totalAvailBal.innerHTML=totalAvailableBalanceData;
totalBalance.innerHTML=totalExposureData+totalAvailableBalanceData;
availableBalanceData=balanceData;
availableBalance.innerHTML=availableBalanceData;*/
}

getAllChild(currentPage,itemsPerPage);
