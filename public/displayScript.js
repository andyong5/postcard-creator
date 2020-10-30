"use strict";


var url = window.location.href;
var id = url.substring(url.lastIndexOf('=') + 1);
console.log("this is the id"+id);

display();
function display() {
  let baseURL = "display/id?"+id;
  console.log("THIS IS BASE URL" +baseURL);
  let xhr = new XMLHttpRequest;
  xhr.open("GET",baseURL);

  xhr.addEventListener("load", function() {
      if (xhr.status == 200) {
        console.log(xhr.responseText);


      let data = JSON.parse(xhr.responseText);
      console.log(data);
      console.log(data[0].image);


      let postcardImage = document.getElementById("cardImg");
      postcardImage.style.display = 'block';
      postcardImage.src = data[0].image;
      let postcardMessage = document.getElementById("message");

      postcardMessage.innerText = data[0].message; 
      postcardMessage.className = data[0].font;
      document.querySelector(".postcard").style.backgroundColor = data[0].color; 
      } else {
        console.log("Error fetching table");
        console.log(xhr.responseText);
      }
  });
  xhr.send();
}