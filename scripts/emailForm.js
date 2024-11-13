import emailJs from "@emailjs/browser";

import { formToggle, formState } from "/scripts/formAnims.js";

export function listenToForm() {
  document.getElementById("mailForm").addEventListener("submit", (e) => {
    e.preventDefault();
    handleSubmit(e);
  });

  document.getElementById("closeButton").addEventListener("click", () => {
    formToggle();
  });
}

export function checkHandleSubmit() {
  document.getElementById("mailForm").addEventListener("submit", (e) => {
    e.preventDefault();
  });
}

function handleSubmit(e) {
  console.log("§ SUBMITTED FORM §");
  const form = {
    Name: e.target.name.value,
    Email: e.target.email.value,
    Message: e.target.message.value,
  };
  console.log(form);

  const serviceID = "string";
  const templateID = "template_96et0s4";
  const publicKey = "HGRBfY6kZJDUteYUu";

  const sendButton = document.getElementById("sendButton");
  sendButton.innerText = "Sent!";
  setTimeout(() => {
    formToggle();
    setTimeout(() => {
      sendButton.innerText = "Send";
    }, 2000);
  }, 1000);

  // emailJs
  // .send(serviceID, templateID, form, publicKey)
  // .then((res) => {
  // return res;
  // })
  // .then((data) => {
  // console.log(data);
  // if (data.status < 299) {
  // console.log("SUCCESS");
  //
  // e.target.name.value = "";
  // e.target.email.value = "";
  // e.target.message.value = "";
  // }
  // })
  // .catch((error) => {
  // console.log("ERROR: " + JSON.stringify(error));
  // });
}
