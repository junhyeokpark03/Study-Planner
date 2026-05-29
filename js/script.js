const taskList = document.getElementById("taskList");
const progressBar = document.getElementById("progressBar");
const alarmSound = document.getElementById("alarmSound");

let alarmActive = false;


// =========================
// 명언
// =========================

const quotes = [

    "오늘의 노력이 내일의 결과를 만든다.",
    "포기하지 않는 것이 가장 큰 재능이다.",
    "꾸준함은 최고의 실력이다.",
    "천천히 가도 멈추지 않으면 된다.",
    "실패는 성공의 과정이다.",
    "노력은 절대 배신하지 않는다.",
    "성공은 작은 습관의 반복이다.",
    "지금의 공부가 미래를 만든다.",
    "어제보다 성장하면 성공이다.",
    "끝까지 버티는 사람이 이긴다.",
    "작은 발전도 발전이다.",
    "오늘 하지 않으면 내일도 하지 않는다.",
    "공부는 미래의 나에게 주는 선물이다.",
    "시작이 반이다.",
    "집중은 최고의 무기다."

];

function changeQuote() {

    document.getElementById("quote").innerText =
        quotes[Math.floor(Math.random() * quotes.length)];
}

changeQuote();

setInterval(changeQuote, 10000);


// =========================
// 날짜 시간
// =========================

function updateDateTime() {

    const now = new Date();

    document.getElementById("date").innerText =
        now.toLocaleDateString();

    document.getElementById("time").innerText =
        now.toLocaleTimeString();
}

setInterval(updateDateTime, 1000);

updateDateTime();


// =========================
// 엔터 추가
// =========================

function handleEnter(event) {

    if (event.key === "Enter") {

        addTask();
    }
}


// =========================
// 공부 추가
// =========================

function addTask() {

    const taskInput =
        document.getElementById("taskInput");

    const priority =
        document.getElementById("priority");

    const category =
        document.getElementById("category");

    const taskDate =
        document.getElementById("taskDate");

    if (taskInput.value.trim() === "") {

        alert("공부 내용을 입력하세요.");

        return;
    }

    const li = document.createElement("li");

    li.classList.add(priority.value);

    li.draggable = true;

    addDragEvents(li);

    const dateValue =
        taskDate.value ||
        new Date().toISOString().split("T")[0];

    li.innerHTML = `

        <div>

            <strong>[${category.value || "기타"}]</strong>

            ${taskInput.value}

            <br>

            📅 ${dateValue}

        </div>

        <div>

            <button onclick="completeTask(this)">
                완료
            </button>

            <button onclick="deleteTask(this)">
                삭제
            </button>

        </div>

    `;

    taskList.appendChild(li);

    sortByPriority();

    saveTasks();

    updateProgress();

    taskInput.value = "";
    category.value = "";
    taskDate.value = "";
}


// =========================
// 중요도 정렬
// =========================

function sortByPriority() {

    const tasks =
        Array.from(taskList.children);

    const order = {

        important: 0,
        normal: 1,
        low: 2
    };

    tasks.sort((a, b) => {

        const aPriority =
            a.classList.contains("important")
            ? "important"
            : a.classList.contains("normal")
            ? "normal"
            : "low";

        const bPriority =
            b.classList.contains("important")
            ? "important"
            : b.classList.contains("normal")
            ? "normal"
            : "low";

        return order[aPriority]
             - order[bPriority];
    });

    taskList.innerHTML = "";

    tasks.forEach(task => {

        taskList.appendChild(task);
    });
}


// =========================
// 완료
// =========================

function completeTask(button) {

    const li =
        button.parentElement.parentElement;

    li.classList.toggle("completed");

    saveTasks();

    updateProgress();
}


// =========================
// 삭제
// =========================

function deleteTask(button) {

    button.parentElement.parentElement.remove();

    saveTasks();

    updateProgress();
}


// =========================
// 전체 삭제
// =========================

function deleteAll() {

    if (confirm("전체 삭제하시겠습니까?")) {

        taskList.innerHTML = "";

        saveTasks();

        updateProgress();

        alert("삭제되었습니다.");
    }
}


// =========================
// 진행률
// =========================

function updateProgress() {

    const tasks =
        document.querySelectorAll("#taskList li");

    const completed =
        document.querySelectorAll(
            "#taskList li.completed"
        );

    const percent =
        tasks.length === 0
        ? 0
        : Math.floor(
            completed.length / tasks.length * 100
        );

    progressBar.style.width =
        percent + "%";

    document.getElementById("progressText")
        .innerText = `진행률 ${percent}%`;
}


// =========================
// 저장
// =========================

function saveTasks() {

    localStorage.setItem(
        "tasks",
        taskList.innerHTML
    );
}

function loadTasks() {

    const saved =
        localStorage.getItem("tasks");

    if (saved) {

        taskList.innerHTML = saved;

        const tasks =
            document.querySelectorAll("#taskList li");

        tasks.forEach(task => {

            task.draggable = true;

            addDragEvents(task);
        });
    }

    updateProgress();
}

loadTasks();


// =========================
// 검색
// =========================

function searchTask() {

    const keyword =
        document.getElementById("searchInput")
        .value
        .toLowerCase();

    const tasks =
        document.querySelectorAll("#taskList li");

    tasks.forEach(task => {

        task.style.display =
            task.innerText
            .toLowerCase()
            .includes(keyword)
            ? "flex"
            : "none";
    });
}


// =========================
// 완료만 보기
// =========================

function showCompleted() {

    const tasks =
        document.querySelectorAll("#taskList li");

    tasks.forEach(task => {

        task.style.display =
            task.classList.contains("completed")
            ? "flex"
            : "none";
    });
}


// =========================
// 전체 보기
// =========================

function showAll() {

    const tasks =
        document.querySelectorAll("#taskList li");

    tasks.forEach(task => {

        task.style.display = "flex";
    });

    sortByPriority();

    saveTasks();
}


// =========================
// 최신순
// =========================

function sortNewest() {

    const tasks =
        Array.from(taskList.children);

    tasks.sort((a, b) => {

        const dateA =
            a.innerText.match(/\d{4}-\d{2}-\d{2}/)?.[0]
            || "2000-01-01";

        const dateB =
            b.innerText.match(/\d{4}-\d{2}-\d{2}/)?.[0]
            || "2000-01-01";

        return new Date(dateB) - new Date(dateA);
    });

    taskList.innerHTML = "";

    tasks.forEach(task => {

        task.style.display = "flex";

        taskList.appendChild(task);
    });

    saveTasks();
}


// =========================
// 오래된순
// =========================

function sortOldest() {

    const tasks =
        Array.from(taskList.children);

    tasks.sort((a, b) => {

        const dateA =
            a.innerText.match(/\d{4}-\d{2}-\d{2}/)?.[0]
            || "2000-01-01";

        const dateB =
            b.innerText.match(/\d{4}-\d{2}-\d{2}/)?.[0]
            || "2000-01-01";

        return new Date(dateA) - new Date(dateB);
    });

    taskList.innerHTML = "";

    tasks.forEach(task => {

        task.style.display = "flex";

        taskList.appendChild(task);
    });

    saveTasks();
}


// =========================
// 드래그 기능
// =========================

let draggedItem = null;

function addDragEvents(item) {

    item.addEventListener("dragstart", () => {

        draggedItem = item;

        setTimeout(() => {

            item.style.opacity = "0.5";

        }, 0);
    });

    item.addEventListener("dragend", () => {

        item.style.opacity = "1";

        draggedItem = null;

        saveTasks();
    });

    item.addEventListener("dragover", (e) => {

        e.preventDefault();
    });

    item.addEventListener("drop", (e) => {

        e.preventDefault();

        if (draggedItem && draggedItem !== item) {

            const allItems =
                [...taskList.children];

            const draggedIndex =
                allItems.indexOf(draggedItem);

            const targetIndex =
                allItems.indexOf(item);

            if (draggedIndex < targetIndex) {

                item.after(draggedItem);

            } else {

                item.before(draggedItem);
            }
        }
    });
}


// =========================
// 테마 변경
// =========================

function changeTheme() {

    const theme =
        document.getElementById("themeSelect").value;

    document.body.className = "";

    switch(theme) {

        case "dark":
            document.body.classList.add("dark-mode");
            break;

        case "blue":
            document.body.classList.add("blue-mode");
            break;

        case "purple":
            document.body.classList.add("purple-mode");
            break;

        case "green":
            document.body.classList.add("green-mode");
            break;

        case "pink":
            document.body.classList.add("pink-mode");
            break;

        case "orange":
            document.body.classList.add("orange-mode");
            break;

        case "sky":
            document.body.classList.add("sky-mode");
            break;

        case "red":
            document.body.classList.add("red-mode");
            break;

        case "system":

            if (
                window.matchMedia(
                    "(prefers-color-scheme: dark)"
                ).matches
            ) {

                document.body.classList.add(
                    "dark-mode"
                );
            }

            break;
    }
}


// =========================
// 공부 시간
// =========================

let studySeconds = 0;
let studyInterval = null;
let studying = false;

function toggleStudy() {

    const btn =
        document.getElementById("studyBtn");

    if (!studying) {

        studying = true;

        btn.innerText = "종료";

        studyInterval = setInterval(() => {

            studySeconds++;

            updateStudyTime();

        }, 1000);

    } else {

        studying = false;

        btn.innerText = "시작";

        clearInterval(studyInterval);
    }
}

function updateStudyTime() {

    const h =
        String(
            Math.floor(studySeconds / 3600)
        ).padStart(2, "0");

    const m =
        String(
            Math.floor(
                (studySeconds % 3600) / 60
            )
        ).padStart(2, "0");

    const s =
        String(
            studySeconds % 60
        ).padStart(2, "0");

    document.getElementById("studyTime")
        .innerText = `${h}:${m}:${s}`;
}

function resetStudyTime() {

    clearInterval(studyInterval);

    studySeconds = 0;

    studying = false;

    document.getElementById("studyBtn")
        .innerText = "시작";

    updateStudyTime();
}


// =========================
// D-Day
// =========================

function setDday() {

    const examDate =
        document.getElementById("examDate")
        .value;

    if (!examDate) return;

    const today = new Date();

    const target = new Date(examDate);

    today.setHours(0,0,0,0);
    target.setHours(0,0,0,0);

    const diff =
        Math.ceil(
            (target - today)
            / (1000 * 60 * 60 * 24)
        );

    if (diff === 0) {

        document.getElementById("dDay")
            .innerText = "D-Day";
    }

    else if (diff < 0) {

        document.getElementById("dDay")
            .innerText =
            `${Math.abs(diff)}일 지남`;
    }

    else {

        document.getElementById("dDay")
            .innerText =
            `시험 D-${diff}`;
    }
}


// =========================
// 포모도로
// =========================

let pomodoroInterval = null;
let pomodoroTime = 1500;
let pomodoroRunning = false;


function handlePomodoroEnter(event) {

    if (event.key === "Enter") {

        const custom =
            document.getElementById(
                "customPomodoro"
            ).value;

        if (custom && custom > 0) {

            pomodoroTime = parseInt(custom) * 60;

            updatePomodoro();
        }
    }
}


function setPomodoroFromSelect() {

    pomodoroTime =
        parseInt(
            document.getElementById(
                "pomodoroSelect"
            ).value
        );

    updatePomodoro();
}


function togglePomodoro() {

    const btn =
        document.getElementById(
            "pomodoroBtn"
        );

    if (!pomodoroRunning) {

        pomodoroRunning = true;

        btn.innerText = "정지";

        pomodoroInterval = setInterval(() => {

            pomodoroTime--;

            updatePomodoro();

            if (pomodoroTime <= 0) {

                clearInterval(
                    pomodoroInterval
                );

                pomodoroRunning = false;

                btn.innerText = "시작";

                startAlarm();

                showPomodoroComplete();
            }

        }, 1000);
    }

    else {

        pomodoroRunning = false;

        btn.innerText = "시작";

        clearInterval(pomodoroInterval);

        stopAlarm();
    }
}


function resetPomodoro() {

    clearInterval(pomodoroInterval);

    pomodoroRunning = false;

    document.getElementById(
        "pomodoroBtn"
    ).innerText = "시작";

    pomodoroTime = 1500;

    stopAlarm();

    updatePomodoro();
}


function updatePomodoro() {

    const m =
        String(
            Math.floor(pomodoroTime / 60)
        ).padStart(2, "0");

    const s =
        String(
            pomodoroTime % 60
        ).padStart(2, "0");

    document.getElementById(
        "pomodoroTime"
    ).innerText = `${m}:${s}`;
}

updatePomodoro();


// =========================
// 알람 반복
// =========================

function startAlarm() {

    alarmActive = true;

    alarmSound.currentTime = 0;

    alarmSound.play();
}


alarmSound.addEventListener("ended", () => {

    if (alarmActive) {

        alarmSound.currentTime = 0;

        alarmSound.play();
    }
});


function stopAlarm() {

    alarmActive = false;

    alarmSound.pause();

    alarmSound.currentTime = 0;
}


// =========================
// 완료 팝업
// =========================

function showPomodoroComplete() {

    if (document.getElementById("pomodoroPopup")) {

        return;
    }

    const popup = document.createElement("div");

    popup.id = "pomodoroPopup";

    popup.style.position = "fixed";
    popup.style.top = "0";
    popup.style.left = "0";
    popup.style.width = "100%";
    popup.style.height = "100%";
    popup.style.background = "rgba(0,0,0,0.5)";
    popup.style.display = "flex";
    popup.style.justifyContent = "center";
    popup.style.alignItems = "center";
    popup.style.zIndex = "9999";

    popup.innerHTML = `

        <div style="
            background:white;
            padding:30px;
            border-radius:15px;
            text-align:center;
            width:300px;
        ">

            <h2>
                🍅 포모도로 집중 시간이 종료되었습니다!
            </h2>

            <button id="confirmPomodoro"
                    style="
                        margin-top:20px;
                        padding:10px 20px;
                        border:none;
                        border-radius:10px;
                        cursor:pointer;
                    ">

                확인

            </button>

        </div>

    `;

    document.body.appendChild(popup);

    document.getElementById(
        "confirmPomodoro"
    ).onclick = function () {

        stopAlarm();

        popup.remove();
    };
}