// ==UserScript==
// @name         Aceable Autoanswer and video player script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://driving.aceable.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @exclude      https://driving.aceable.com/acetest/*
// @grant        none
// ==/UserScript==

setInterval(() => {

 if(document.getElementById("arrow-next").disabled == false){
   document.getElementById("arrow-next").click()
 }

 if(document.querySelector(".vjs-big-play-button")){
     console.log("lol")
    document.querySelector(".vjs-big-play-button").click()
    }

async function autoAnswerQuestions() {
  const answerButtonList = document.querySelector(".gritCourseflowNode__answerButtonList");

  for (const answerButton of answerButtonList.querySelectorAll(".gritCourseflowNode__answerButtonListItem > button")) {

    answerButton.click();
  }

    setTimeout(() => {
    document.querySelector("[courseflow-forward]").click();}, 200)

  await waitUntilCheckAnswerButtonIsEnabled();

  // Click the "next" button.
  setTimeout(() => {
  document.getElementById("arrow-next").click();}, 300)

}

async function waitUntilCheckAnswerButtonIsEnabled() {

}

autoAnswerQuestions();


}, 500)
