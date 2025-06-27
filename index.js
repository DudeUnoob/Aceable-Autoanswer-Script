// ==UserScript==
// @name         Aceable Autoanswer and video player script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  An autoanswer script for questions, pages, going next
// @author       Created by DudeUnoob on GitHub: https://github.com/DudeUnoob
// @match        https://driving.aceable.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @exclude      https://driving.aceable.com/acetest/*
// @grant        none
// @license      MIT
// @downloadURL  https://update.greasyfork.org/scripts/472147/Aceable%20Autoanswer%20and%20video%20player%20script.user.js
// @updateURL    https://update.greasyfork.org/scripts/472147/Aceable%20Autoanswer%20and%20video%20player%20script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(() => {
        // Click the next arrow if it's enabled
        const nextArrow = document.getElementById("arrow-next");
        if (nextArrow && !nextArrow.disabled) {
            nextArrow.click();
        }

        // Click the play button on the video if it exists
        const playButton = document.querySelector(".vjs-big-play-button");
        if (playButton) {
            console.log("Playing video...");
            playButton.click();
        }

        // Click the button for Play Facts if it exists
        const playBtn = document.getElementById("play-btn");
        if (playBtn) {
            console.log("Clicking Play Facts of a Feather button...");
            playBtn.click();
        }

        // Click the button with continue course button
        const continueButton = document.querySelector(".grit.continue-learning-button");
        if (continueButton) {
            console.log("Clicking Continue Your Course button...");
            continueButton.click();
        }

        // Click the button skip button if it exists
        const resultsContinueBtn = document.getElementById("results-continue-btn");
        if (resultsContinueBtn) {
            console.log("Clicking Continue After Play Facts");
            resultsContinueBtn.click();
        }

        // Click the Take the Level 8 Assessment button if it exists
        const assessmentButton = document.querySelector(".gritTestReady__button .controls__button-label[data-test='startAssessmentButton']");
        if (assessmentButton) {
            console.log("Clicking Take the Level 8 Assessment button...");
            assessmentButton.click();
        }

        // Click the Continue button in modal if it exists
        const continueModalButton = document.querySelector(".grit.button.controls__button-label.solid.primary[data-test='modalPrimaryButton']");
        if (continueModalButton) {
            console.log("Clicking Continue button in modal...");
            continueModalButton.click();
        }

        // Click the Continue Test button if it exists
        const continueTestButton = document.querySelector(".grit.button.controls__button-label.solid.primary[data-test='continueTest']");
        if (continueTestButton) {
            console.log("Clicking Continue Test button...");
            continueTestButton.click();
        }

        // Automatically answer category questions
        autoAnswerCategoryQuestions();

        // Automatically answer PlayFact questions
        autoAnswerPlayFactQuestions();

        // Automatically handle Test questions
        autoAnswerTestQuestions();

        // Save review test questions and correct answers
        saveReviewQuestions();
    }, 500);

    async function autoAnswerCategoryQuestions() {
        const categoryList = document.querySelector(".category-list");
        if (categoryList) {
            const buttons = categoryList.querySelectorAll(".grit.foafButton.fields__answer");
            for (let i = 0; i < buttons.length; i++) {
                const button = buttons[i];
                while (!areAllDotsComplete(button)) {
                    button.click();
                    await waitFor(500); // Wait for 500ms before next click
                }
            }
        }
    }

    function areAllDotsComplete(button) {
        const dots = button.querySelectorAll(".bucket-dot");
        for (const dot of dots) {
            if (!dot.classList.contains("complete")) {
                return false;
            }
        }
        return true;
    }

    async function autoAnswerPlayFactQuestions() {
        const answerButtonList = document.querySelector(".gritCourseflowNode__answerButtonList");
        if (answerButtonList) {
            for (const answerButton of answerButtonList.querySelectorAll(".gritCourseflowNode__answerButtonListItem > button")) {
                answerButton.click();
            }

            await waitUntilCheckAnswerButtonIsEnabled();

            // Click the "Check Answer" button if it exists
            const checkAnswerButton = document.querySelector("[courseflow-forward]");
            if (checkAnswerButton) {
                setTimeout(() => {
                    checkAnswerButton.click();
                }, 200);
            }

            // Click the next arrow again to move forward
            setTimeout(() => {
                const nextArrow = document.getElementById("arrow-next");
                if (nextArrow) {
                    nextArrow.click();
                }
            }, 300);
        }
    }

    async function waitUntilCheckAnswerButtonIsEnabled() {
        return new Promise(resolve => {
            const checkInterval = setInterval(() => {
                const checkAnswerButton = document.querySelector("[courseflow-forward]");
                if (checkAnswerButton && !checkAnswerButton.disabled) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);
        });
    }

    function waitFor(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function autoAnswerTestQuestions() {
        const questionContainer = document.querySelector("[data-test='questionContainer']");
        if (questionContainer) {
            const questionTitle = questionContainer.querySelector("[data-test='questionTitle']").innerText;
            const answers = questionContainer.querySelectorAll(".gritCourseflowNode__answerButtonListItem .grit.answerButton");

            // Check if question is in local storage
            const storedQuestions = JSON.parse(localStorage.getItem('questions')) || {};
            if (storedQuestions[questionTitle]) {
                // If the question is found, click the correct answer
                const correctAnswerText = storedQuestions[questionTitle];
                const correctAnswerButton = Array.from(answers).find(answer => answer.innerText.trim() === correctAnswerText.trim());
                if (correctAnswerButton) {
                    correctAnswerButton.click();
                }
            } else {
                // Click the first answer
                if (answers.length > 0) {
                    answers[0].click();
                }
            }
        }
    }

    function saveReviewQuestions() {
        const reviewCards = document.querySelectorAll(".grit.question-review-card");

        if (reviewCards.length > 0) {
            const storedQuestions = JSON.parse(localStorage.getItem('questions')) || {};

            reviewCards.forEach(card => {
                const question = card.querySelector(".paragraph__question").innerText;
                const correctAnswer = card.querySelector(".grit.answerButton.fields__answer.selected.correct") ||
                                      card.querySelector(".grit.answerButton.fields__answer.missed");

                if (correctAnswer) {
                    storedQuestions[question] = correctAnswer.innerText;
                }
            });

            localStorage.setItem('questions', JSON.stringify(storedQuestions));
        }
    }
})();
