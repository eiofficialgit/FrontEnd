var currentPage = 0;
var itemsPerPage = 10;
async function searchUser(id, usertype, currentPage, itemsPerPage, userId) {
    const response = await fetch(`http://localhost:7074/exuser/search/${id}/${usertype}?pageNumber=${currentPage}&pageSize=${itemsPerPage}&userid=${userId}`);
    const result = await response.json();
    const encryptedData = result.data;
    var decryptData = JSON.parse(decryptMessage(encryptedData));
    var stage = JSON.parse(decryptData.payload);
    showAllChild(stage.content);
  }

  function showAllChild(data) {
    let content = document.getElementById("content");
    content.innerHTML = "";
    for (let i = 0; i < data.length; i++) {
      let child = data[i];
      let decryptPassword=decryptMessage(child.password);
      content.innerHTML += `<tr>
                                <td>${child.userid}</td>
                                <td>${child.userid}(${decryptPassword})</td>
                                <td>--</td>
                                <td>--</td>
                                <td>--</td>
                                <td>--</td>
                                <td>--</td>
                            </tr>`;
    }
  };

  document.getElementById("userSearch").addEventListener("click", async function(){
    let userSearchVal=document.getElementById("userSearchVal").value;
    if(!userSearchVal){
      alert("Please enter ur user name!");
    }
    else{
      const response = await fetch("http://localhost:7074/exuser/loginUser");
      const result = await response.json();
      const data=JSON.parse(decryptMessage(result.data));
      let id=data.id;
      let usertype=parseInt(data.usertype)+1;
      searchUser(id, usertype, currentPage, itemsPerPage, userSearchVal);
    }
  });

  
  