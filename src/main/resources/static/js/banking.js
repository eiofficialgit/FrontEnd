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
async function nextPage() {
  if(currentPage < totalPages){
    currentPage++;
  }
  pageButtons.innerHTML=currentPage+1;
  await getAllChildAndSetListeners(currentPage, itemsPerPage);
}

async function prevPage() {
  currentPage--;
  pageButtons.innerHTML=currentPage+1;
  await getAllChildAndSetListeners(currentPage, itemsPerPage);
}

async function firstPage() {
  currentPage=0;
  pageButtons.innerHTML=currentPage+1;
  await getAllChildAndSetListeners(currentPage, itemsPerPage);
}

async function lastPage() {
  currentPage=totalPages-1;
  pageButtons.innerHTML=currentPage+1;
  await getAllChildAndSetListeners(currentPage, itemsPerPage);
}

async function pageFind(){
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
  await getAllChildAndSetListeners(currentPage, itemsPerPage);
}

const inputArray = [];
let inputCount = 0;

function clearAll() {
  inputArray.length = 0;
  const inputFields = document.querySelectorAll('.amountInput');
  inputFields.forEach(function (inputField) {
    inputField.value = "";
  });
  inputCount = 0;
  document.getElementById("submitCount").innerText = inputCount;
}

async function submitForm() {
  var paymentPassword=document.getElementById("paymentPassword").value;
  if(paymentPassword === "") {
    alert("Please Enter Password !");
    return;
  }
  else if(inputArray.length === 0){
    console.log(inputArray);
    alert("Please make transactions !");
    return;
  }
  else if(inputArray.length > 0 && paymentPassword !==""){
    const data={ "password": paymentPassword, "transactions": inputArray};
    var encryptData=encryptMessage(JSON.stringify(data));
    const payload={"payload": encryptData};
    try {
      const response = await fetch("http://3.0.102.63:7074/exuser/depositWithdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if(result){
        alert(result.message);
        location.reload();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

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
let childs = document.getElementById("childs");
childs.innerHTML="";
for (let i = 0; i < data.length; i++) {
  let child = data[i];
  childs.innerHTML+=`
  <tr class="dataofAccount">
  <td id="ad">${child.userid}</td>
  <td id="sa">${child.myBalance+child.exposureLimit}</td>
  <td id="ma">${child.myBalance}</td>
  <td id="exp" style="color:red;">${child.exposureLimit}</td>
  <td id="sm" class="d-flex">
    <button class="dbtn">D</button>
    <button class="wbtn">W</button>
    <div style="position: relative;">
      <input type="number" class="amountInput" dir="rtl" placeholder="0" disabled>
      <span class="sign"></span>
    </div>
    <button class="dpWdFullBtn" disabled style="opacity: 0.5;">Full</button> 
  </td>
  <td id="mm"><a href="" id="usercreditrefrencemain">${child.fixLimit}</a><button id="editcreditbtrefrenacemain" data-toggle="modal" data-target="#credRefModal" class="but_suspend openchangepwdmodal icon tdd">Edit</button></td>
  <td id="agm">
    <p>${(child.myBalance+child.exposureLimit)-child.fixLimit}</p>
  </td>
  <td id="client"><input type="text" placeholder="Remark" class="remarkInput"></td>
  <td id="client"><button id="log" onclick="buttonLog()">Log</button></td>
</tr>`;
}
}

async function setPageListeners() {
    const containers = document.querySelectorAll(".dataofAccount");
    containers.forEach((row, i) => {
      const depositBtn = row.querySelector(".dbtn");
      const withdrawBtn = row.querySelector(".wbtn");
      const amountInput = row.querySelector(".amountInput");
      const sign = row.querySelector(".sign");
      const fullBtn = row.querySelector(".dpWdFullBtn");
      const useridElement = row.querySelector("#ad");
      const myBalanceField = row.querySelector("#ma");
      const userid = useridElement.textContent;
      const editCreditBtn = row.querySelector("#editcreditbtrefrenacemain");
      const currentBalance = parseFloat(row.querySelector("#usercreditrefrencemain").textContent);
      const logButton = row.querySelector("#log");
      
      logButton.addEventListener("click", function () {
        window.location.href = "/accountstatement";
      });
  
      editCreditBtn.addEventListener("click", function () {
        showPopup(currentBalance, userid);
      });
  
      depositBtn.addEventListener("click", function () {
        depositBtn.classList.add("depositGreen");
        withdrawBtn.classList.remove("depositRed");
        sign.innerText = "+";
        enableDeposit();
      });
  
      withdrawBtn.addEventListener("click", function () {
        withdrawBtn.classList.add("depositRed");
        depositBtn.classList.remove("depositGreen");
        sign.innerText = "-";
        enableWithdraw();
      });
  
      fullBtn.addEventListener("click", function () {
        const myBalance = parseFloat(myBalanceField.innerText);
        updateInputArray(userid, myBalance);
      });
  
      function enableDeposit() {
        amountInput.disabled = false;
        fullBtn.disabled = true;
        fullBtn.style.opacity = 0.5;
        amountInput.classList.remove("danger");
        amountInput.classList.add("black");
        sign.style.color = "green";
      }
  
      function enableWithdraw() {
        amountInput.disabled = false;
        amountInput.classList.remove("black");
        amountInput.classList.add("danger");
        fullBtn.disabled = false;
        fullBtn.style.opacity = 1;
        sign.style.color = "red";
      }
  
      amountInput.addEventListener("input", function () {
        const updatedMyBalance = parseFloat(amountInput.value);
        updateInputArray(userid, updatedMyBalance);
      });
  
      function updateInputArray(userid, updatedMyBalance) {
        if (updatedMyBalance !== 0) {
          const existingEntryIndex = inputArray.findIndex(item => item.userid === userid);
          if (existingEntryIndex !== -1) {
            inputArray[existingEntryIndex] = {
              userid: userid,
              myBalance: updatedMyBalance,
              type: depositBtn.classList.contains("depositGreen") ? "deposit" : "withdraw"
            };
          } else {
            inputArray.push({
              userid: userid,
              myBalance: updatedMyBalance,
              type: depositBtn.classList.contains("depositGreen") ? "deposit" : "withdraw"
            });
          }
          inputCount = inputArray.length;
          document.getElementById("submitCount").innerText = inputCount;
        }
      }
    });
  };

  function showOverlay() {
    const overlay = document.querySelector('.overlayBanking');
    overlay.style.display = 'block';
  }

  function hideOverlay() {
    const overlay = document.querySelector('.overlayBanking');
    overlay.style.display = 'none';
  }

async function showPopup(currentBalance, userid) {
  const popup = document.getElementById("popup");
  const currentBalanceSpan = document.getElementById("currentBalance");
  const field1 = document.getElementById("field1");
  const field2 = document.getElementById("field2");
  const submitBtn = document.getElementById("submitBtn");
  const closeBtn = document.getElementById("closeBtn");

  currentBalanceSpan.innerHTML = currentBalance;
  field1.value = "";
  field2.value = "";

  popup.style.display = "block";
  showOverlay();

  submitBtn.addEventListener("click", async function () {
    const newValue = field1.value;
    const password = field2.value;
    if (newValue !== "" && password !== "") {
      const data = {
        "userid": userid,
        "fixLimit": newValue,
        "password": password
      };
      var encryptData=encryptMessage(JSON.stringify(data));
      const payload={"payload": encryptData};
      try {
        const response = await fetch("http://3.0.102.63:7074/exuser/creditReference", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (result.status==="success") {
          popup.style.display = "none";
          hideOverlay();
          alert(result.message);
          location.reload();
        }
        else{
          alert(result.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else if(newValue==="") {
      alert("Please enter a valid value!");
    }
    else if(password=="") {
      alert("Please enter your password!");
    }
  });

  closeBtn.addEventListener("click", function () {
    popup.style.display = "none";
    hideOverlay();
  });

  window.addEventListener("click", function (event) {
    if (event.target === popup) {
      popup.style.display = "none";
    }
  });
}

  async function getAllChildAndSetListeners(currentPage, itemsPerPage) {
    await getAllChild(currentPage, itemsPerPage);
    setPageListeners();
  }

  document.addEventListener("DOMContentLoaded", function () {
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const firstpageBtn = document.getElementById('firstpage-btn');
    const lastpageBtn = document.getElementById('lastpage-btn');
    pageButtons.innerHTML="";
    
    if (nextBtn && prevBtn && firstpageBtn && lastpageBtn) {
      nextBtn.addEventListener('click', function () {
        if (currentPage < totalPages - 1) {
          nextPage();
          getAllChildAndSetListeners(currentPage, itemsPerPage);
        }
      });
      prevBtn.addEventListener('click', function () {
        if (currentPage > 0) {
          prevPage();
          getAllChildAndSetListeners(currentPage, itemsPerPage);
        }
      });
      firstpageBtn.addEventListener('click', function () {
        firstPage();
        getAllChildAndSetListeners(currentPage, itemsPerPage);
      });
      lastpageBtn.addEventListener('click', function () {
        lastPage();
        getAllChildAndSetListeners(currentPage, itemsPerPage);
      });
      pageButtons.innerHTML = currentPage + 1;
    }
    getAllChildAndSetListeners(currentPage, itemsPerPage);
    });

