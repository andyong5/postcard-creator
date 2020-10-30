"use strict";

const diamond = "\u27e1";
const cross = "\u2756";

let currentFontIcon = document.querySelector("#fonts span");

document.querySelectorAll("#fonts input").forEach(i => {
  i.addEventListener("change", () => {
    if (i.checked) {
      console.log("checked");
      i.previousElementSibling.textContent = cross;
      currentFontIcon.textContent = diamond;
      currentFontIcon = i.previousElementSibling;
      document.querySelector("#message").className = i.value;
    }
  });
});


const colors = [
  "#e6e2cf",
  "#dbcaac",
  "#c9cbb3",
  "#bbc9ca",
  "#A6A5B5",
  "#B5A6AB",
  "#ECCFCF",
  "#eceeeb",
  "#BAB9B5"
];


const colorBoxes = document.querySelectorAll(".color-box");

colorBoxes.item(0).style.border = "1px solid black";
let currentColor = colorBoxes.item(0);

colorBoxes.forEach((b, i) => {
  b.style.backgroundColor = colors[i];

  
  b.addEventListener("click", () => {
    currentColor.style.border = "none";
    b.style.border = "1px solid black";
    document.querySelector(".postcard").style.backgroundColor = colors[i];
    currentColor = b;
  });

  b.addEventListener("mouseover", () => {
    b.style.border = "1px dashed black";
    document.querySelector(".postcard").style.backgroundColor = colors[i];
  });
  b.addEventListener("mouseout", () => {
    if (b != currentColor) {
      b.style.border = "none";
      document.querySelector(".postcard").style.backgroundColor =
        currentColor.style.backgroundColor;
    } else {
      b.style.border = "1px solid black";
    }
  });
});

document.getElementById("close").addEventListener('click',() =>{
  var popup = document.getElementById("popup");
  popup.style.display = "none";
})


document.querySelector('#save').addEventListener('click', () => {
  let msg = document.querySelector('#message');
  let img = document.querySelector('#cardImg');
  let data = {
    image: img.src,
    color: currentColor.style.backgroundColor,
    font: msg.className,
    message: msg.innerText
  }
  console.log(data);
  
  var popup = document.getElementById("popup");
   var linkHTML = document.getElementById("link");
  

  var xmlhttp = new XMLHttpRequest();   
  xmlhttp.open("POST", '/saveDisplay');

  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  xmlhttp.onloadend = function(e) {
    console.log(xmlhttp.responseText);
    popup.style.display = "block";
    let link = "https://courageous-skitter-alamosaurus.glitch.me/display.html?id="+xmlhttp.responseText;
    console.log(link);
    linkHTML.innerHTML = link;
    linkHTML.setAttribute('href', link);
    console.log(link);

  }

  xmlhttp.send(JSON.stringify(data));
})


document.querySelector('#imgUpload').addEventListener('change', () => {
  
    const selectedFile = document.querySelector('#imgUpload').files[0];
   
    const formData = new FormData();
    formData.append('newImage',selectedFile, selectedFile.name);
  
    let button = document.querySelector('.btn');

  
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/upload", true);
    xhr.onloadend = function(e) {
       
        console.log(xhr.responseText);
        let newImage = document.querySelector("#cardImg");
        newImage.src = "http://ecs162.org:3000/images/acnguye/"+selectedFile.name;
        newImage.style.display = 'block';
        document.querySelector('.image').classList.remove('upload');
        button.textContent = 'Replace Image';
    }
  
    button.textContent = 'Uploading...';

    xhr.send(formData);
});

