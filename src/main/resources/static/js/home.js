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

function setData() {
let data = JSON.parse(sessionStorage?.getItem("data"));
if(data){
  document.getElementById("ownername").innerText = data.userid;
  let statusofuser=document.getElementById("statusofuser");
  let statusofUSER=document.getElementById("statusofUSER");
  if(data.usertype == 0 && statusofuser){
    statusofuser.innerHTML="Subadmin";
    statusofUSER.innerHTML="Subadmin";
  }
  else if(data.usertype === 1 && statusofuser){
    statusofuser.innerHTML="Miniadmin";
    statusofUSER.innerHTML="Miniadmin";
  }
  else if(data.usertype === 2 && statusofuser){
    statusofuser.innerHTML="Supersuper";
    statusofUSER.innerHTML="Supersuper";
  }
  else if(data.usertype === 3 && statusofuser){
    statusofuser.innerHTML="Supermaster";
    statusofUSER.innerHTML="Supermaster";
  }
  else if(data.usertype === 4 && statusofuser){
    statusofuser.innerHTML="Master";
    statusofUSER.innerHTML="Master";
  }
  else if(data.usertype === 5 && statusofuser){
    statusofuser.innerHTML="user";
    statusofUSER.innerHTML="user";
  }
}
}

setData();

function saveUser(){
const website=document.getElementById("websites").value;
const userName=document.getElementById("userName").value;
const email=document.getElementById("email").value;
const password=document.getElementById("userPassword").value;
const firstName=document.getElementById("firstName").value;
const lastName=document.getElementById("lastName").value;
const repeatPassword=document.getElementById("repeatPassword").value;
const mobileNumber=document.getElementById("phone").value;
const timeZone=document.getElementById("timezone").value;
let repeatPasswordErrorText=document.getElementById("repeatPasswordErrorText");
if(password !== repeatPassword){
  repeatPasswordErrorText.innerText="* Password doesn't match ! ";
  return;
}
else{
  repeatPasswordErrorText.innerText="";
  const data = { "websitename":`${website}`,
                "userid": `${userName}`,
                "email":`${email}`,
                "password": `${password}`,
                "firstName":`${firstName}`,
                "lastName":`${lastName}`,
                "mobileNumber":`${mobileNumber}`,
                "exposureLimit":2000,
                "timeZone":`${timeZone}`};
  var encryptData=encryptMessage(JSON.stringify(data));
  const payload={"payload": encryptData};
  saveUserInMongo(payload);
}
}

async function saveUserInMongo(payload) {
try {
  const response = await fetch("http://3.0.102.63:7074/exuser/validateUserCreation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  if(result.type === "success"){
    alert("User created successfully!");
    location.reload();
  }
  else if(result.type === "error"){
    console.log(result)
    let emailErrorText= document.getElementById("emailErrorText");
    let userNameErrorText=document.getElementById("userNameErrorText");
    let websiteErrorText=document.getElementById("websiteErrorText");
    let passwordErrorText=document.getElementById("passwordErrorText");
    let phoneErrorText=document.getElementById("phoneErrorText");
    let firstNameErrorText=document.getElementById("firstNameErrorText");
    let lastNameErrorText=document.getElementById("lastNameErrorText");
    emailErrorText.innerHTML="";
    userNameErrorText.innerHTML="";
    websiteErrorText.innerHTML="";
    passwordErrorText.innerHTML="";
    phoneErrorText.innerHTML="";
    firstNameErrorText.innerHTML="";
    lastNameErrorText.innerHTML="";
    if(result.message === "WebsiteName Must be Required"){
      websiteErrorText.innerHTML="WebsiteName Must be Required !";
    }
    else if(result.message === "Invalid Email Address"){
     emailErrorText.innerHTML="Invalid Email Address !";
    }
    else if(result.message === "User Id Must be Required"){
      userNameErrorText.innerHTML="User Id Must be Required !";
    }
    else if(result.message === "Password Must contains 1 Upper Case, 1 Lowe Case & 1 Numeric Value & in Between 8-15 Charachter"){
      passwordErrorText.innerHTML="Password Must contains 1 Upper Case, 1 Lowe Case & 1 Numeric Value & in Between 10-15 Charachter !";
    }
    else if(result.message === "Enter FirstName"){
      firstNameErrorText.innerHTML="Enter FirstName !";
    }
    else if(result.message === "Enter LastName"){
      lastNameErrorText.innerHTML="Enter LastName !";
    }
    else if(result.message === "Mobile Number Must Be Of 10 Digit"){
      phoneErrorText.innerHTML="Mobile Number Must Be Of 10 Digit !";
    }
  }
} catch (error) {
  console.error("Error:", error);
}
}

async function getAllWebsites() {
	const response = await fetch("http://3.0.102.63:7074/exuser/allWebsite");
	const websites = await response.json();
	const encryptedData=websites.data;
	var decryptData=JSON.parse(decryptMessage(encryptedData));
	var stage=JSON.parse(decryptData.payload);
	var data=JSON.parse(stage.data);
	return data;
}

async function  showAllWebsites() {
  let allWebsites = await  getAllWebsites();
  for (let i = 0; i < allWebsites.length; i++) {
    let website = allWebsites[i];
    let websites = document.getElementById("websites");
    websites.innerHTML+=`<option value="${website.name}">${website.name}</option>`;
  }
}

showAllWebsites();

var currentPage = 0;
var itemsPerPage = 10;

function nextPage() {
if (currentPage < 2) {
  currentPage++;
  getAllChild(currentPage,itemsPerPage);
}
}

function prevPage() {
if (currentPage > 0) {
  currentPage--;
  getAllChild(currentPage,itemsPerPage);
}
}

window.addEventListener("DOMContentLoaded", (event) => {
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const pageButtons = document.getElementsByClassName('page-btn');
if(nextBtn && prevBtn && pageButtons){
  nextBtn.addEventListener('click', nextPage);
  prevBtn.addEventListener('click', prevPage);
  for (let i = 0; i < pageButtons.length; i++) {
    pageButtons[i].addEventListener('click', function() {
        const page = parseInt(this.getAttribute('data-page'));
        if (page !== currentPage) {
            currentPage = page;
            getAllChild(currentPage,itemsPerPage);
        }
    });
  }
}
});

async function getAllChild(currentPage, itemsPerPage) {
const response = await fetch(`http://3.0.102.63:7074/exuser/allchildwithpagination?page=${currentPage}&size=${itemsPerPage}`);
const childs = await response.json();
if(childs){
  const encryptedData=childs.data;
  var decryptData=JSON.parse(decryptMessage(encryptedData));
  var stage=JSON.parse(decryptData.payload);
  var data=JSON.parse(stage.data);
  showAllChild(data);
}
else {
  console.log("Something went wrong to fetching child !");
}
}

async function  showAllChild(data) {
let childs = document.getElementById("childs");
childs.innerHTML="";
for (let i = 0; i < data.length; i++) {
  let child = data[i];
  childs.innerHTML+=`
      <tr id="sadmin" style="display: table-row;text-align: end;" main_userid="sadmin">
      <td id="accountCol" style="text-align: start;" class="align-L">
      <span class="lv_4" style="background:#568BC8; padding:1px">DIR</span><a id="userDataLink" href="${window.location.pathname}?userid=${child.id}&usertype=${child.usertype+1}">${child.userid}</a>
      </td>
      <td class="credit-amount-member">
        <a id="creditRefBtn" class="favor-set" href="#">0.00 </a>
      </td>
      <td id="balance1">
        <a href="#" class="link-open">758.86 </a>
      </td>
      <td style="color: red">
        <span style="cursor: pointer;width: 67px;text-align: center; display: inline-block;"class="status-suspend">20.99</span>
      </td>
      <td id="available1">737.87</td>
      <td id="exposureLimit1" style="display: none">0.00</td>
      <td id="available1" style="display: table-cell">165.40</td>
      <td id="refPL1" style=>758.86</td>
      <td id="statusCol">
        <span id="status1" class="status-active" >
          <img src="img/transparent.gif" />Active
        </span>
      </td>
      <td id="actionCol" class="actionCol">
        <ul class="action">
          <li>
            <a id="p_l1" class="p_l"><span><i class="fas fa-long-arrow-up"></i><i class="fas fa-long-arrow-down"></i></span></a>
          </li>
          <li>
            <a id="betting_history1" class="betting_history"><span><i class="fas fa-line-height"></i></span></a>
          </li>
          <li>
            <a class="status"><span><i class="fas fa-cog"></i></span></a>
          </li>
          <li>
            <a class="profile"><span><i class="fas fa-user-alt"></i></span></a>
          </li>
        </ul>
      </td>
    </tr>`;
}
}

getAllChild(currentPage,itemsPerPage);

async function userSearch(){
const response = await fetch("http://3.0.102.63:7074/exuser/allchild");
const allChilds = await response.json();
const encryptedData=allChilds.data;
var decryptData=JSON.parse(decryptMessage(encryptedData));
var stage=JSON.parse(decryptData.payload);
var data=JSON.parse(stage.data);
let childs = document.getElementById("childs");
childs.innerHTML="";
let userId=document.getElementById("userId").value.toLowerCase();
let filterUser=data.filter(child => child.userid === userId);
for (let i = 0; i < filterUser.length; i++) {
  let child = filterUser[i];
  childs.innerHTML+=`
      <tr id="sadmin" style="display: table-row;text-align: end;" main_userid="sadmin">
      <td id="accountCol" style="text-align: start;" class="align-L">
        <a id="account0" class="ico_account"><span class="lv_4" style="background:#568BC8;">DIR</span>${child.userid}</a>
      </td>
      <td class="credit-amount-member">
        <a id="creditRefBtn" class="favor-set" href="#">0.00 </a>
      </td>
      <td id="balance1">
        <a href="#" class="link-open">758.86 </a>
      </td>
      <td style="color: red">
        <span style="cursor: pointer;width: 67px;text-align: center; display: inline-block;"class="status-suspend">20.99</span>
      </td>
      <td id="available1">737.87</td>
      <td id="exposureLimit1" style="display: none">0.00</td>
      <td id="available1" style="display: table-cell">165.40</td>
      <td id="refPL1" style=>758.86</td>
      <td id="statusCol">
        <span id="status1" class="status-active" >
          <img src="img/transparent.gif" />Active
        </span>
      </td>
      <td id="actionCol" class="actionCol">
        <ul class="action">
          <li>
            <a id="p_l1" class="p_l"><span><i class="fas fa-long-arrow-up"></i><i class="fas fa-long-arrow-down"></i></span></a>
          </li>
          <li>
            <a id="betting_history1" class="betting_history"><span><i class="fas fa-line-height"></i></span></a>
          </li>
          <li>
            <a class="status"><span><i class="fas fa-cog"></i></span></a>
          </li>
          <li>
            <a class="profile"><span><i class="fas fa-user-alt"></i></span></a>
          </li>
        </ul>
      </td>
    </tr>`;
}
}

function checkUserAvailable(){
let userid=document.getElementById("userName").value;
const data = { "userid": `${userid}`};
var encryptData=encryptMessage(JSON.stringify(data));
const payload={"payload": encryptData};
checkOnDatabase(payload);
}

async function checkUserPassword(){
  let userPassword=document.getElementById("userPassword").value;
  let encryptPassword=encryptMessage(userPassword);
  const data = { "password": `${encryptPassword}`};
  try {
    const response = await fetch("http://3.0.102.63:7074/exuser/checkpassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if(result.type === "Error"){
      document.getElementById("passwordErrorText").innerHTML=`${result.message}`;
      return;
    }
    else if(result.type === "Success"){
      document.getElementById("userNameErrorText").innerHTML="";
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function checkOnDatabase(payload) {
try {
  const response = await fetch("http://3.0.102.63:7074/exuser/checkuser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  if(result.type === "Error"){
    document.getElementById("userNameErrorText").innerHTML=`${result.message}`;
    return;
  }
  else if(result.type === "Success"){
    document.getElementById("userNameErrorText").innerHTML="";
  }
} catch (error) {
  console.error("Error:", error);
}
}

async function logout() {
sessionStorage.removeItem("data");
const response = await fetch("http://3.0.102.63:7074/exuser/logout");
const data = await response.json();
console.log(data);
if(data.type === "success") {
  window.location.href = '/';
  return;
}
}

function getQueryParam(param) {
const urlParams = new URLSearchParams(window.location.search);
return urlParams.get(param);
}

window.addEventListener("DOMContentLoaded", (event) => {
const userDataLink = document.getElementById('userDataLink');
if (userDataLink) {
userDataLink.addEventListener('click', function(event) {
  event.preventDefault();

  // Extract userid and usertype from the href attribute
  const href = userDataLink.getAttribute('href');
  const urlParams = new URLSearchParams(href.split('?')[1]);
  const userid = urlParams.get('userid');
  const usertype = urlParams.get('usertype');

  // Append userid and usertype as request parameters to the current URL
  const currentUrl = window.location.pathname;
  const updatedUrl = `${currentUrl}?userid=${userid}&usertype=${usertype}`;

  // Redirect to the updated URL
  window.location.href = updatedUrl;
  showParentChild();
});
}
});

async function getParentChild(){
	const userid = getQueryParam('userid');
	const usertype = getQueryParam('usertype');
	const response = await fetch(`http://3.0.102.63:7074/exuser/${userid}/${usertype}`);
	const childs = await response.json();
	const encryptedData=childs.data;
	var decryptData=JSON.parse(decryptMessage(encryptedData));
	var stage=JSON.parse(decryptData.payload);
	var data=JSON.parse(stage.data);
	return data;
}

async function showParentChild(){
let allChilds = await  getParentChild();
let childs = document.getElementById("childs");
childs.innerHTML="";
for (let i = 0; i < allChilds.length; i++) {
  let child = filterUser[i];
  childs.innerHTML+=`
      <tr id="sadmin" style="display: table-row;text-align: end;" main_userid="sadmin">
      <td id="accountCol" style="text-align: start;" class="align-L">
        <a id="account0" class="ico_account"><span class="lv_4" style="background:#568BC8;">DIR</span>${child.userid}</a>
      </td>
      <td class="credit-amount-member">
        <a id="creditRefBtn" class="favor-set" href="#">0.00 </a>
      </td>
      <td id="balance1">
        <a href="#" class="link-open">758.86 </a>
      </td>
      <td style="color: red">
        <span style="cursor: pointer;width: 67px;text-align: center; display: inline-block;"class="status-suspend">20.99</span>
      </td>
      <td id="available1">737.87</td>
      <td id="exposureLimit1" style="display: none">0.00</td>
      <td id="available1" style="display: table-cell">165.40</td>
      <td id="refPL1" style=>758.86</td>
      <td id="statusCol">
        <span id="status1" class="status-active" >
          <img src="img/transparent.gif" />Active
        </span>
      </td>
      <td id="actionCol" class="actionCol">
        <ul class="action">
          <li>
            <a id="p_l1" class="p_l"><span><i class="fas fa-long-arrow-up"></i><i class="fas fa-long-arrow-down"></i></span></a>
          </li>
          <li>
            <a id="betting_history1" class="betting_history"><span><i class="fas fa-line-height"></i></span></a>
          </li>
          <li>
            <a class="status"><span><i class="fas fa-cog"></i></span></a>
          </li>
          <li>
            <a class="profile"><span><i class="fas fa-user-alt"></i></span></a>
          </li>
        </ul>
      </td>
    </tr>`;
}
}

/*function fetchData(id, userType) {
const apiUrl = 'https://your-api-endpoint.com/data'; // Replace with your API endpoint
const urlParams = new URLSearchParams({
    id: id,
    usertype: userType
});

fetch(apiUrl + '?' + urlParams.toString())
    .then(response => response.json())
    .then(data => {
        // Process the fetched data here
        console.log(data);
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });
}*/


/*if (id && userType) {
// Data already exists in the URL, fetch the data using the parameters
fetchData(id, userType);
} else {
// Data not available, fetch from the API and redirect to the same page with data as query parameters
fetch('https://your-api-endpoint.com/get-new-data') // Replace with your API endpoint to get new data
    .then(response => response.json())
    .then(data => {
        // Process the fetched data here
        // For demonstration purposes, assuming the data contains id and userType properties
        const { id, userType } = data;

        // Redirect to the same page with API data as query parameters
        redirectToSamePageWithData(id, userType);

        // Now, the page will reload, and the data will be fetched again using the query parameters
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });
}*/

function isUserLoggedIn() {
const userData = sessionStorage.getItem('data');
return userData ? true : false;
}

function handleRedirect() {
const currentPath = window.location.pathname;
if (!isUserLoggedIn() && currentPath.length > 1) {
    window.location.href = '/';
}
}

//document.addEventListener('DOMContentLoaded', handleRedirect);