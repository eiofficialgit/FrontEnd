var encryptedBase64Key = "bXVzdGJlMTZieXRlc2tleQ==";
var parsedBase64Key = CryptoJS.enc.Base64.parse(encryptedBase64Key);

function encryptMessage(data) {
  return CryptoJS.AES.encrypt(data, parsedBase64Key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();
}

function decryptMessage(data) {
  return CryptoJS.AES.decrypt(data, parsedBase64Key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  }).toString(CryptoJS.enc.Utf8);
}
function getUserid() {
  const currentUrl = window.location.pathname;
  const userid = currentUrl.split("/")[2];
  return userid;
}
function getBaseUrl() {
  const currentUrl = window.location.href;
  const urlObject = new URL(currentUrl);
  return urlObject.origin;
}
document
  .getElementById("accountsummary")
  .addEventListener("click", function () {
    const userid = getUserid();
    const baseurl = getBaseUrl();
    const updatedUrl = baseurl + "/userprofile/" + userid;
    window.location.href = updatedUrl;
  });

document
  .getElementById("bettinghistory")
  .addEventListener("click", function () {
    const userid = getUserid();
    const baseurl = getBaseUrl();
    const updatedUrl = baseurl + "/userbettinghistory/" + userid;
    window.location.href = updatedUrl;
  });

document
  .getElementById("bettingprofitloss")
  .addEventListener("click", function () {
    const userid = getUserid();
    const baseurl = getBaseUrl();
    const updatedUrl = baseurl + "/userprofitloss/" + userid;
    window.location.href = updatedUrl;
  });

document
  .getElementById("transactionhistory")
  .addEventListener("click", function () {
    const userid = getUserid();
    const baseurl = getBaseUrl();
    const updatedUrl = baseurl + "/useraccountstatement/" + userid;
    window.location.href = updatedUrl;
  });

document.getElementById("activitylog").addEventListener("click", function () {
  const userid = getUserid();
  const baseurl = getBaseUrl();
  const updatedUrl = baseurl + "/useractivitylog/" + userid;
  window.location.href = updatedUrl;
});

async function setOwnerData() {
  const userid = getUserid();
  const data = { userid: userid };
  const encryptMessageData = encryptMessage(JSON.stringify(data));
  const payload = { payload: encryptMessageData };
  try {
    const response = await fetch(`http://3.0.102.63:7074/exuser/searchUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    const decryptData = JSON.parse(decryptMessage(result.data));

    var sub = document.getElementById("profileSub");
    if (decryptData.usertype === 0) {
      sub.innerText = "O";
    } else if (decryptData.usertype === 1) {
      sub.innerText = "SUA";
    } else if (decryptData.usertype === 2) {
      sub.innerText = "MIA";
    } else if (decryptData.usertype === 3) {
      sub.innerText = "SUS";
    } else if (decryptData.usertype === 4) {
      sub.innerText = "SUM";
    } else if (decryptData.usertype === 5) {
      sub.innerText = "M";
    } else if (decryptData.usertype === 6) {
      sub.innerText = "U";
    }
    document.getElementById("fname").innerText = decryptData.firstName;
    document.getElementById("lname").innerText = decryptData.lastName;
    document.getElementById("email").innerText = decryptData.email;
    document.getElementById("ist").innerText = decryptData.timeZone;
    document.getElementById("number").innerText = decryptData.mobileNumber;
    document.getElementById("availableBet").innerText = decryptData.myBalance+decryptData.exposureLimit;
    document.getElementById("availableWithdraw").innerText = decryptData.myBalance+decryptData.exposureLimit;
    document.getElementById("currentExposure").innerText = decryptData.exposureLimit;
  } catch (error) {
    console.error("Error:", error);
  }
}
setOwnerData();
