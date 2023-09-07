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