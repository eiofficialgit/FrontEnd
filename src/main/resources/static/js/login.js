$('.support-wrap .support-service a').hover( function () {
  var index = $('.support-service a').index(this);
  $('.support-service a').not($(this)).removeClass('open');
  $(this).addClass('open');
  $('.support-wrap .support-info .support-detail').removeClass('open');
  $( ".support-wrap .support-info .support-detail" ).eq( index ).addClass("open");
});

function editpage(){
  document.getElementById('changePasswordModal').classList.toggle('show')
}

var captcha;
var usernamep=document.getElementById("usernamep");
var passwordp=document.getElementById("passwordp");
var captchap=document.getElementById("captchap");

function generate() {
document.getElementById("captcha").value = "";
captcha = document.getElementById("image");
const random = Math.floor(Math.random() * 9000 + 1000);
captcha.innerHTML = random;
}

function printmsg() {
const captcha_input = document.getElementById("captcha").value;
if(captcha_input === ""){
  captchap.innerHTML = "* Captcha must be required !";
  return;
}
else if (captcha_input !== captcha.innerHTML) {
  captchap.innerHTML = "* Captcha not Matched !";
  generate();
}
}

function login(){
let username=document.getElementById("username").value;
if(username === "" || username === "null"){
  usernamep.innerHTML="* Username must be required !";
}
let password=document.getElementById("password").value;
if(password === "" || password === "null"){
  passwordp.innerHTML="* Password must be required !";
}
printmsg();
authorizeToHome();
}

function checkUsername(){
  usernamep.innerHTML="";
}
function checkPassword(){
  passwordp.innerHTML="";
}
function checkCaptcha(){
  captchap.innerHTML="";
}

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

function authorizeToHome(){
let username=document.getElementById("username").value;
let password=document.getElementById("password").value;
const captcha = document.getElementById("captcha").value;

if(username !== "" && username !== "null" && password !== "" && password !== "null" && captcha !=="" && captcha !== "null"){
  var data = { "userid": `${username}`, "password": `${password}`};
  var encryptData=encryptMessage(JSON.stringify(data));
  const payload={"payload": encryptData};
  fetchLogin(payload);
}
}

async function fetchLogin(payload) {
try {
  const response = await fetch("http://3.0.102.63:7074/exuser/managementHome", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  if(result.message === "Wrong UserId!!!"){
    usernamep.innerHTML = "* Invalid Username !";
  }
  else if(result.message === "Wrong password!!!"){
    passwordp.innerHTML = "* Invalid Password !";
  }
  else if(result.status === "success"){
	const decryptData=JSON.parse(decryptMessage(result.data));
    sessionStorage.setItem("data",JSON.stringify(decryptData));
    window.location.href = "/home";
  }
} catch (error) {
  console.error("Error:", error);
}
}

