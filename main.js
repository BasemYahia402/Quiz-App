let count = document.querySelector(".count span");
let degree_final = document.querySelector(".final");
let bullets = document.querySelector(".bullets");
let num_question = document.querySelector(".num_questtion");
let num_questions = document.querySelector(".num_questtions");
let countdownelement = document.querySelector(".countdown");
let results = document.querySelector(".results");
let Quiz_Area = document.querySelector(".Quiz-Area");
let Answer_Area = document.querySelector(".Answer-Area");
let submit = document.querySelector(".submit");
let number_answer = 1;
// number of questions
let index = 0;
// get question from object json
function GetQuestion() {
    let request = new XMLHttpRequest();
    // remove quiz arear
    Quiz_Area.innerHTML = '';

    // remove Answer Area
    Answer_Area.innerHTML = '';

    request.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questionsobject = JSON.parse(this.responseText);
            let countquestions = questionsobject.length;

            // function of number questions
            count_of_questions(countquestions);

            // function questions
            add_question(questionsobject[index], countquestions);

            // time quiz 
            startcount(20, countquestions, questionsobject);

            submit.onclick = function () {

                // get right answer
                let rightanswer = questionsobject[index]["right_answer"];
                // increase index
                if (index < countquestions) {
                    index++;
                }

                // check right answer
                check_answer(rightanswer, countquestions);

                // remove quiz arear
                Quiz_Area.innerHTML = '';

                // remove Answer Area
                Answer_Area.innerHTML = '';

                // add another questions
                add_question(questionsobject[index], countquestions);

                // calc mark
                mark(countquestions);

                clearInterval(countdown);
                // when click button submit must time of quiz reset 
                startcount(20, countquestions, questionsobject);

                // change bullets
                handle(countquestions);
            }
        }
    }
    request.open("GET", "questions_html.json", true);
    request.send();
}

// bullets of question and count of question and final degree
function count_of_questions(num) {
    count.innerHTML = num;
    degree_final.innerHTML = num;
    num_questions.innerHTML = num;
    num_question.innerHTML = 1;
}
GetQuestion();

// create array show answer random
function random_num() {
    let randomnumber;
    const numbers = [1, 2, 3, 4];
    const usednumbrs = [];
    do {
        randomnumber = numbers[Math.floor(Math.random() * numbers.length)];
        if (!usednumbrs.includes(randomnumber)) {
            usednumbrs.push(randomnumber);
            if (usednumbrs.length === 4)
                break;
        }
    } while (true);
    return usednumbrs;
}


// add question to quiz area
function add_question(object, count) {
    if (index < count) {
        // create h2 
        let h2 = document.createElement("h2");
        // create text of h2
        let text = document.createTextNode(`${object.title}`);
        // append text to h2 
        h2.appendChild(text);
        // append h2 to quiz_area
        Quiz_Area.appendChild(h2);
        let x = random_num();
        // create answers
        for (let i = 0; i < 4; i++) {
            // create main div 
            let mainDiv = document.createElement("div");
            // add class answer
            mainDiv.classList.add("answer");
            // create radio input
            let radio = document.createElement("input");
            // add type + add name add data-attribute to radio
            radio.name = "Question";
            radio.type = "radio";
            radio.id = `answer_${i + 1}`;
            radio.dataset.answer = object[`answer_${x[i]}`];
            // fisrt radio is checked
            if (i === 1) {
                radio.checked = true;
            }
            // create label
            let label = document.createElement("label");
            // add for attribute
            label.htmlFor = `answer_${i + 1}`;
            // create text of label
            let text_label = document.createTextNode(`${object[`answer_${x[i]}`]}`);
            // append text to lebel
            label.appendChild(text_label);
            // append radio to maindiv
            mainDiv.appendChild(radio);
            // append label to maindiv
            mainDiv.appendChild(label);
            // append maindiv to answer area
            Answer_Area.appendChild(mainDiv);
        }
    }
    else {
        Quiz_Area.remove();
        Answer_Area.remove();
        submit.remove();
        bullets.remove();
        countdownelement.remove();
    }
}

// number of answers is right
let num_answers = 0;

// check answer function
function check_answer(rightanswer, countquestions) {
    let answers = document.getElementsByName("Question");
    for (let i = 0; i < 4; i++) {
        // answer is checked 
        if (answers[i].checked) {
            // if answer is checked is right answer
            if (answers[i].dataset.answer === rightanswer) {
                num_answers++;

            }
        }
    }
}

// calc mark of answers
function mark(countquestions) {
    let degree = document.querySelector(".Degree");
    let status_full = document.querySelector(".status_Full");
    let status_good = document.querySelector(".status_good");
    let status_fail = document.querySelector(".status_fail");
    if (index === countquestions) {
        results.style.display = "block";
        if (num_answers > countquestions / 2 && num_answers < countquestions) {
            status_good.style.display = "block";
        }
        else if (num_answers === countquestions) {
            status_full.style.display = "block";
        }
        else {
            status_fail.style.display = "block";
        }
    }
    degree.innerHTML = num_answers + ' ';
}

// handle bullets
function handle(countquestions) {
    if (index < countquestions) {
        num_question.innerHTML = index + 1;
    }
}

// time
function startcount(time, countquestions, questionsobject) {
    if (index < countquestions) {
        countdown = setInterval(function () {

            // calc minutes 
            let mintues = parseInt(time / 60);

            // calc seconds
            let seconds = parseInt(time % 60);

            // add time to quiz
            countdownelement.innerHTML = `${mintues}:${seconds}`;

            if (--time < 0) {

                clearInterval(countdown);
                submit.click();
            }
            if (mintues < 10) {
                countdownelement.innerHTML = `0${mintues}:${seconds}`;
            }
            if (seconds < 10) {
                countdownelement.innerHTML = `0${mintues}:0${seconds}`;
            }
        }, 1000);
    }
}

