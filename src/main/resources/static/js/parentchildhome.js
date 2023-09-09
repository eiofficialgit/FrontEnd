// Get the modal
var ebModal = document.getElementById('mySizeChartModal');

// Get the button that opens the modal
var ebBtn = document.getElementById("mySizeChart");

// Get the <span> element that closes the modal
var ebSpan = document.getElementsByClassName("ebcf_close")[0];

// When the user clicks the button, open the modal 
ebBtn.onclick = function () {
    ebModal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
ebSpan.onclick = function () {
    ebModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == ebModal) {
        ebModal.style.display = "none";
    }
}

var balanceData = 0;

function saveUser() {
    const website = document.getElementById("websites").value;
    const userName = document.getElementById("userName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("userPassword").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const repeatPassword = document.getElementById("repeatPassword").value;
    const mobileNumber = document.getElementById("phone").value;
    const timeZone = document.getElementById("timezone").value;
    let repeatPasswordErrorText = document.getElementById("repeatPasswordErrorText");
    if (password !== repeatPassword) {
        repeatPasswordErrorText.innerText = "* Password doesn't match ! ";
        return;
    }
    else {
        repeatPasswordErrorText.innerText = "";
        const data = {
            "websitename": `${website}`,
            "userid": `${userName}`,
            "email": `${email}`,
            "password": `${password}`,
            "firstName": `${firstName}`,
            "lastName": `${lastName}`,
            "mobileNumber": `${mobileNumber}`,
            "exposureLimit": 2000,
            "timeZone": `${timeZone}`
        };
        var encryptData = encryptMessage(JSON.stringify(data));
        const payload = { "payload": encryptData };
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
        if (result.status === "Success") {
            alert("User created successfully!");
            location.reload();
        }
        else if (result.status === "error") {
            console.log(result)
            let emailErrorText = document.getElementById("emailErrorText");
            let userNameErrorText = document.getElementById("userNameErrorText");
            let websiteErrorText = document.getElementById("websiteErrorText");
            let passwordErrorText = document.getElementById("passwordErrorText");
            let phoneErrorText = document.getElementById("phoneErrorText");
            let firstNameErrorText = document.getElementById("firstNameErrorText");
            let lastNameErrorText = document.getElementById("lastNameErrorText");
            emailErrorText.innerHTML = "";
            userNameErrorText.innerHTML = "";
            websiteErrorText.innerHTML = "";
            passwordErrorText.innerHTML = "";
            phoneErrorText.innerHTML = "";
            firstNameErrorText.innerHTML = "";
            lastNameErrorText.innerHTML = "";
            if (result.message === "WebsiteName Must be Required") {
                websiteErrorText.innerHTML = "WebsiteName Must be Required !";
            }
            else if (result.message === "Invalid Email Address") {
                emailErrorText.innerHTML = "Invalid Email Address !";
            }
            else if (result.message === "User Id Must be Required") {
                userNameErrorText.innerHTML = "User Id Must be Required !";
            }
            else if (result.message === "Password Must contains 1 Upper Case, 1 Lowe Case & 1 Numeric Value & in Between 8-15 Charachter") {
                passwordErrorText.innerHTML = "Password Must contains 1 Upper Case, 1 Lowe Case & 1 Numeric Value & in Between 10-15 Charachter !";
            }
            else if (result.message === "Enter FirstName") {
                firstNameErrorText.innerHTML = "Enter FirstName !";
            }
            else if (result.message === "Enter LastName") {
                lastNameErrorText.innerHTML = "Enter LastName !";
            }
            else if (result.message === "Mobile Number Must Be Of 10 Digit") {
                phoneErrorText.innerHTML = "Mobile Number Must Be Of 10 Digit !";
            }
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

var currentPage = 0;
var itemsPerPage = 7;
var totalPages = 0;
var pageButtons = document.getElementById('page-btn');
pageButtons.innerHTML = currentPage + 1;
async function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
    }
    pageButtons.innerHTML = currentPage + 1;
    await getAllChildAndSetListeners(id, usertype, currentPage, itemsPerPage);
}

async function prevPage() {
    currentPage--;
    pageButtons.innerHTML = currentPage + 1;
    await getAllChildAndSetListeners(id, usertype, currentPage, itemsPerPage);
}

async function firstPage() {
    currentPage = 0;
    pageButtons.innerHTML = currentPage + 1;
    await getAllChildAndSetListeners(id, usertype, currentPage, itemsPerPage);
}

async function lastPage() {
    currentPage = totalPages - 1;
    pageButtons.innerHTML = currentPage + 1;
    await getAllChildAndSetListeners(id, usertype, currentPage, itemsPerPage);
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
    await getAllChildAndSetListeners(id, usertype, currentPage, itemsPerPage);
}

async function getAllChild(id, usertype, currentPage, itemsPerPage) {
    const response = await fetch(`http://3.0.102.63:7074/exuser/${id}/${usertype}?pageNumber=${currentPage}&pageSize=${itemsPerPage}`);
    const childs = await response.json();
    const encryptedData = childs.data;
    var decryptData = JSON.parse(decryptMessage(encryptedData));
    var stage = JSON.parse(decryptData.payload);
    showAllChild(stage.content);
    totalPages = stage.totalPages;
}

function showAllChild(data) {
    let totalExposureField = document.getElementById("totalExposure");
    let totalAvailBal = document.getElementById("totalAvailBal");
    let totalBalance = document.getElementById("totalBalance");
    let availableBalance = document.getElementById("mastersAvailBal");
    var totalExposureData = 0;
    var totalAvailableBalanceData = 0;
    var availableBalanceData = 0;
    let childs = document.getElementById("childs");
    childs.innerHTML = "";
    for (let i = 0; i < data.length; i++) {
        let child = data[i];
        totalExposureData = totalExposureData + child.exposureLimit;
        totalAvailableBalanceData = totalAvailableBalanceData + child.myBalance;
        childs.innerHTML += `
          <tr id="sadmin" class="dataofAccount" style="display: table-row;text-align: end;">
          <td id="accountCol" style="text-align: start;" class="align-L">
          <span class="lv_4" style="background:#568BC8; padding:1px;">DIR</span><span style="cursor:pointer;" id="userDataLink" data-userid="${child.id}" data-usertype="${child.usertype}" class="user-link">${child.userid}</span>
          </td>
          <td class="credit-amount-member">
            <span style="cursor:pointer; color: #0d6efd;" id="creditRefBtn" class="favor-set">${child.fixLimit}<i class="fas fa-pen ms-1"></i></span>
          </td>
          <td id="balance1">
            <a href="#" class="link-open">${child.myBalance + child.exposureLimit}</a>
          </td>
          <td style="color: red">
            <span style="cursor: pointer;width: 67px;text-align: center; display: inline-block;"class="status-suspend">${child.exposureLimit}</span>
          </td>
          <td id="available1">${child.myBalance}</td>
          <td id="exposureLimit1" style="display: none">0.00</td>
          <td id="available1" style="display: table-cell">165.40</td>
          <td id="refPL1">${(child.myBalance + child.exposureLimit) - child.fixLimit}</td>
          <td id="statusCol">
            <span id="status1" class="${child.isActive ? "status-active" : "status-suspend"}">
            ${child.isActive ? "Active" : "Lock"}
            </span>
          </td>
          <td id="actionCol" class="actionCol">
          <ul class="action">
          <li id="userprofitloss" style="cursor: pointer;">
            <a id="p_l1" class="p_l"><span><i class="fas fa-long-arrow-up"></i><i class="fas fa-long-arrow-down"></i></span></a>
          </li>
          <li id="userbettinghistory" style="cursor: pointer;">
            <a id="betting_history1" class="betting_history"><span><i class="fas fa-line-height"></i></span></a>
          </li>
          <li>
            <button style="border:none;" id="settingPopup" class="status"><span><i class="fas fa-cog"></i></span></button>
          </li>
          <li id="userprofile" style="cursor: pointer;">
            <a class="profile"><span><i class="fas fa-user-alt"></i></span></a>
          </li>
        </ul>
          </td>
        </tr>`;
    }
    totalExposureField.innerHTML = totalExposureData;
    totalAvailBal.innerHTML = totalAvailableBalanceData;
    totalBalance.innerHTML = totalExposureData + totalAvailableBalanceData;
    availableBalanceData = balanceData;
    availableBalance.innerHTML = availableBalanceData;
}

async function setPageListeners() {
    const containers = document.querySelectorAll(".dataofAccount");
    containers.forEach((row, i) => {
        const useridElement = row.querySelector("#userDataLink");
        const userid = useridElement.textContent;
        const editCreditBtn = row.querySelector("#creditRefBtn");
        const settingBtn = row.querySelector("#settingPopup");
        const profileBtn = row.querySelector("#userprofile");
        const profitLossBtn = row.querySelector("#userprofitloss");
        const bettingHistoryBtn = row.querySelector("#userbettinghistory");
        const currentBalance = parseFloat(row.querySelector("#creditRefBtn").textContent);

        editCreditBtn.addEventListener("click", function () {
            showPopup(currentBalance, userid);
        });
        settingBtn.addEventListener("click", function () {
            showSettingPopup(userid);
          });
      
          profileBtn.addEventListener("click", function () {
            const currentUrl = window.location.pathname;
            const baseUrl=currentUrl.split("/")[0]+"/userprofile";
            const updatedUrl = `${baseUrl}/${userid}`;
            window.location.href = updatedUrl;
          });
      
          profitLossBtn.addEventListener("click", function () {
            const currentUrl = window.location.pathname;
            const baseUrl=currentUrl.split("/")[0]+"/userprofitloss";
            const updatedUrl = `${baseUrl}/${userid}`;
            window.location.href = updatedUrl;
          });
      
          bettingHistoryBtn.addEventListener("click", function () {
            const currentUrl = window.location.pathname;
            const baseUrl=currentUrl.split("/")[0]+"/userbettinghistory";
            const updatedUrl = `${baseUrl}/${userid}`;
            window.location.href = updatedUrl;
          });
    });
    const userLinks = document.querySelectorAll(".user-link");
    userLinks.forEach((userLink) => {
        userLink.addEventListener("click", async function (event) {
            event.preventDefault();
            const userid = userLink.getAttribute("data-userid");
            const usertype = parseInt(userLink.getAttribute("data-usertype")) + 1;
            const currentUrl = window.location.pathname;
            const baseUrl=currentUrl.split("/")[0]+"/"+currentUrl.split("/")[1];
            const updatedUrl = `${baseUrl}/${userid}/${usertype}`;
            window.location.href = updatedUrl;
        });
    });
};

async function getAllChildAndSetListeners(id, usertype, currentPage, itemsPerPage) {
    await getAllChild(id, usertype, currentPage, itemsPerPage);
    setPageListeners();
}

const userLinksArray = [];

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("websiteField").style.display="none";
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const firstpageBtn = document.getElementById('firstpage-btn');
    const lastpageBtn = document.getElementById('lastpage-btn');
    pageButtons.innerHTML = "";

    if (nextBtn && prevBtn && firstpageBtn && lastpageBtn) {
        nextBtn.addEventListener('click', function () {
            if (currentPage < totalPages - 1) {
                nextPage();
                getAllChildAndSetListeners(id, usertype, currentPage, itemsPerPage);
            }
        });
        prevBtn.addEventListener('click', function () {
            if (currentPage > 0) {
                prevPage();
                getAllChildAndSetListeners(id, usertype, currentPage, itemsPerPage);
            }
        });
        firstpageBtn.addEventListener('click', function () {
            firstPage();
            getAllChildAndSetListeners(id, usertype, currentPage, itemsPerPage);
        });
        lastpageBtn.addEventListener('click', function () {
            lastPage();
            getAllChildAndSetListeners(id, usertype, currentPage, itemsPerPage);
        });
        pageButtons.innerHTML = currentPage + 1;
    }
    const href = window.location.href;
    var pattern = /\/home\/([^\/]+)\/([^\/]+)/;
    var matches = href.match(pattern);
    if (matches) {
        var id = matches[1];
        var usertype = parseInt(matches[2]);
        let statusofuser = document.getElementById("statusofuser");
        let statusofUSER = document.getElementById("statusofUSER");
        if (usertype === 2 && statusofuser) {
            statusofuser.innerHTML = "Miniadmin";
            statusofUSER.innerHTML = "Miniadmin";
        }
        else if (usertype === 3 && statusofuser) {
            statusofuser.innerHTML = "Supersuper";
            statusofUSER.innerHTML = "Supersuper";
        }
        else if (usertype === 4 && statusofuser) {
            statusofuser.innerHTML = "Supermaster";
            statusofUSER.innerHTML = "Supermaster";
        }
        else if (usertype === 5 && statusofuser) {
            statusofuser.innerHTML = "Master";
            statusofUSER.innerHTML = "Master";
        }
        else if (usertype === 6 && statusofuser) {
            statusofuser.innerHTML = "user";
            statusofUSER.innerHTML = "user";
        }
        switch (usertype) {
            case 2:
                userTypeButtons = [
                    { name: "O", id: "owner", userType: 0 },
                    { name: "SUA", id: "subadmin", userType: 1 }
                ];
                break;
            case 3:
                userTypeButtons = [
                    { name: "O", id: "owner", userType: 0 },
                    { name: "SUA", id: "subadmin", userType: 1 },
                    { name: "MIA", id: "miniadmin", userType: 2 }
                ];
                break;
            case 4:
                userTypeButtons = [
                    { name: "O", id: "owner", userType: 0 },
                    { name: "SUA", id: "subadmin", userType: 1 },
                    { name: "MIA", id: "miniadmin", userType: 2 },
                    { name: "SUS", id: "supersuper", userType: 3 }
                ];
                break;
            case 5:
                userTypeButtons = [
                    { name: "O", id: "owner", userType: 0 },
                    { name: "SUA", id: "subadmin", userType: 1 },
                    { name: "MIA", id: "miniadmin", userType: 2 },
                    { name: "SUS", id: "supersuper", userType: 3 },
                    { name: "SUM", id: "supermaster", userType: 4 }
                ];
                break;
            case 6:
                userTypeButtons = [
                    { name: "O", id: "owner", userType: 0 },
                    { name: "SUA", id: "subadmin", userType: 1 },
                    { name: "MIA", id: "miniadmin", userType: 2 },
                    { name: "SUS", id: "supersuper", userType: 3 },
                    { name: "SUM", id: "supermaster", userType: 4 },
                    { name: "M", id: "master", userType: 5 }
                ];
                break;
            default:
                console.log("User type not recognized");
                break;
        }
        appendUserTypeButtons(userTypeButtons);
        getAllChildAndSetListeners(id, usertype, currentPage, itemsPerPage);
    }
});

function appendUserTypeButtons(buttonsArray) {
    const userTypeButtonsContainer = document.getElementById('userTypeButtonsContainer');
    userTypeButtonsContainer.innerHTML = '';
    buttonsArray.forEach(buttonInfo => {
        const button = document.createElement('button');
        button.className="downlinelistBtn"
        button.id = buttonInfo.id;
        button.innerText = buttonInfo.name;
        button.addEventListener('click', function() {
            const redirectUrl = `/${buttonInfo.id}/${buttonInfo.userType}`;
            window.location.href = redirectUrl;
        });
        userTypeButtonsContainer.appendChild(button);
    });
}

async function showSettingPopup(userid){
    const popup = document.getElementById("settingpopup");
    const settPasField = document.getElementById("settPasField");
    const settUserid = document.getElementById("settUserid");
    const submitBtn = document.getElementById("settSubmitBtn");
    const closeBtn = document.getElementById("settCloseBtn");
    const activeBtn = document.getElementById("activeBtn");
    const suspendBtn = document.getElementById("suspendBtn");
    const LockedBtn = document.getElementById("LockedBtn");
    let action = ""
    activeBtn.addEventListener("click", function () {
        action = "active";
        activeBtn.classList.add("setting-active");
        suspendBtn.classList.remove("setting-suspend");
        LockedBtn.classList.remove("setting-locked");
    });
  
    suspendBtn.addEventListener("click", function () {
        action = "suspend";
        suspendBtn.classList.add("setting-suspend");
        activeBtn.classList.remove("setting-active");
        LockedBtn.classList.remove("setting-locked");
    });
  
    LockedBtn.addEventListener("click", function () {
        action = "suspend";
        LockedBtn.classList.add("setting-locked");
        activeBtn.classList.remove("setting-active");
        suspendBtn.classList.remove("setting-suspend");
    });
  
    settUserid.innerHTML =userid;
  
    popup.style.display = "block";
    showOverlay();
  
    submitBtn.addEventListener("click", async function () {
      const password = settPasField.value;
      if (password !== "") {
        const data = {
          "userid": userid,
          "password": password
        };
        console.log(data);
        var encryptData = encryptMessage(JSON.stringify(data));
        const payload = { "payload": encryptData };
        try {
          const response = await fetch(`http://3.0.102.63:7074/exuser/action/${action}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
          const result = await response.json();
          if (result.status === "success") {
            popup.style.display = "none";
            hideOverlay();
            alert(result.message);
            location.reload();
          }
          else {
            alert(result.message);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      } else if (password === "") {
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

async function showPopup(currentBalance, userid) {
    const popup = document.getElementById("popup");
    const currentBalanceSpan = document.getElementById("currentBalance");
    const field1 = document.getElementById("field1");
    const field2 = document.getElementById("field2");
    const submitBtn = document.getElementById("submitBtn");
    const closeBtn = document.getElementById("closeBtn");
    const logbutton = document.getElementById("logbutton");

    logbutton.addEventListener("click", function () {
        const currentUrl = window.location.pathname;
        const baseUrl=currentUrl.split("/")[0]+"/creditReferenceLog";
        const updatedUrl = `${baseUrl}/${userid}`;
        window.open(updatedUrl, "mywindow","menubar=1,resizable=1,width='50%',height='80vh'");
      });

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
            var encryptData = encryptMessage(JSON.stringify(data));
            const payload = { "payload": encryptData };
            try {
                const response = await fetch("http://3.0.102.63:7074/exuser/creditReference", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });
                const result = await response.json();
                if (result.status === "success") {
                    popup.style.display = "none";
                    hideOverlay();
                    alert(result.message);
                    location.reload();
                }
                else {
                    alert(result.message);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        } else if (newValue === "") {
            alert("Please enter a valid value!");
        }
        else if (password == "") {
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

function showOverlay() {
    const overlay = document.querySelector('.overlayBanking');
    overlay.style.display = 'block';
}

function hideOverlay() {
    const overlay = document.querySelector('.overlayBanking');
    overlay.style.display = 'none';
}

