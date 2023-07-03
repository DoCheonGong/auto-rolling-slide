const frame = document.querySelector("#visual");
const panels = frame.querySelectorAll(".panel li");
const btns = frame.querySelectorAll(".btns li");
const btnPlay = frame.querySelector(".fa-play");
const btnStop = frame.querySelector(".fa-stop");
const bar = frame.querySelector(".bar");

const interval = 5000;
const len = panels.length - 1;

let num = 0;
let timer = null;

startRolling(); // 롤링을 자동 실행

btns.forEach((el, index) => {
    el.addEventListener("click", () => {
        activation(index);
        stopRolling();
    })
})
// 함수를 호출한다

// play 버튼이 활성화 되어있을 때는 return으로 클릭을 막고
// 그렇지 않을 때는 startRolling 진행
btnPlay.addEventListener("click", (e) => {
    if (e.target.classList.contains("on")) {
        return;
    } else {
        startRolling();
    }
});

/* btnPlay.addEventListener("click", startRolling())
    함수의 결과값 - 버튼 클릭 시 결과값을
    이벤트 리스너에 전달한다; 쓰지 않는다
*/
btnStop.addEventListener("click", stopRolling);

function startRolling() {
    bar.style.display = "block";
    setTimeout(progress, 0); // 비동기 실행
    activation(num);
    // 지정한 시간에 맞춰서 rolling 함수 실행
    timer = setInterval(rolling, interval);

    btnPlay.classList.add("on");
    btnStop.classList.remove("on");
}
function stopRolling() {
    bar.style.display = "none";
    clearInterval(timer); // startRolling으로 만든 setInterval 정리
    btnPlay.classList.remove("on");
    btnStop.classList.add("on");
}

// 버튼과 패널 활성화
function activation(index) {
    for (let el of panels) el.classList.remove("on");
    for (let el of btns) el.classList.remove("on");
    panels[index].classList.add("on");
    btns[index].classList.add("on");
    num = index;
    // 인수로 전달받은 순번을 전역 변수로 순번갱신을 한다
    // activation 함수는 rolling에서도 호출되며
    // rolling에서 변경되기 때문에 싱크를 맞춘다

    // 패널이 활성화 될 때 진행바의 너비 초기화
    bar.style.width = "0%";
}

// 롤링 종합 진행
function rolling() {
    if (num < len) {
        num++;
    } else {
        num = 0;
    }
    activation(num);
    progress();
}

// bar로 진행상황을 보여준다
function progress() {
    const init = parseInt(bar.style.width) || 0; // 언제나 0으로
    const targetValue = 100;
    const unit = "%";
    const startTime = performance.now();

    function animate(time) {
        const realTime = time - startTime;
        const prog = realTime / interval;
        const currentValue = init + ((targetValue - init) * prog);
        bar.style.width = `${currentValue}${unit}` // (value)%
        if (prog < 1) {
            requestAnimationFrame(animate);
        } else {
            bar.style.width = "0%";
            if (typeof callback === "function") callback();
        }
    }
    requestAnimationFrame(animate);
}