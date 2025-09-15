const canvas = $('#LanzaNievesJuego')[0];
const context = canvas.getContext('2d');
let canvas_w = $('#JuegaContenedor').width();
let canvas_h = $('#JuegaContenedor').height();
let proportion = Math.round(Math.min(canvas_w,canvas_h) /28);


let circle = {
    x: canvas_w / 2,
    y: canvas_h / 2,
    x_dir: 1,
    y_dir: 1,
    y_speed: proportion * 0.3,
    x_speed: proportion * 0.3,
    radius: proportion*3,
    color: 'red',
};

let countdownTime = 15000; // 150 segundos
let countdownInterval;
let points = 0;
let state = 'not_started';

function countDown() {
    drawMarco();
    if (state !== 'not_started') {
        if (countdownTime > 0) {
            countdownTime--;
            drawBackground();
            ballDrawMove();
        } else {
            clearInterval(countdownInterval);
            drawEnd();
        }
    } else {

        context.font = `${proportion*3}px fontHeader`;
        context.fillStyle = '#c2b38d';

        context.fillText(`Click para empezar!`, canvas_w / 2, canvas_h / 2);
    }
}

function drawMarco() {
    context.clearRect(0, 0, canvas_w, canvas_h);
    context.lineWidth = proportion * 2;
    context.strokeStyle = "#CD5C5C";
    context.strokeRect(0, 0, canvas_w, canvas_h);
}

function drawEnd() {
    context.fillStyle = '#FFFFDF';
    context.fillStyle = '#c2b38d';
    context.font = '49px fontHeader';
    context.fillText(`Puntuacion: ${points}`, canvas_w / 2, canvas_h / 2);
}


function changePelotaColor() {
    // Para cambiar el color de la pelota.
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    circle.color = `rgb(${r}, ${g}, ${b})`;
}

function drawBackground() {
    context.fillStyle = '#CD5C5C';
    context.font = '24px fontHeader ';
    context.fillText(`Time: ${countdownTime/100}`, canvas_w / 2, canvas_h / 2);
}

function ballDrawMove() {
    // Para mover la pelota y dibujarla.
    // Queremos que cambie su angulo cuando llegue a un borde.
    if ((circle.x - circle.radius) < 0 || (circle.x + circle.radius) >= canvas_w) {
        circle.x_dir *= -1;
    }
    if ((circle.y - circle.radius) < 0 || (circle.y + circle.radius) >= canvas_h) {
        circle.y_dir *= -1;
    }

    circle.x += circle.x_speed * circle.x_dir;
    circle.y += circle.y_speed * circle.y_dir;
    context.fillStyle = circle.color;
    context.beginPath();
    context.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    context.fill();
}

function inCircle(x, y, circle) {
    const distance = Math.sqrt((x - circle.x) ** 2 + (y - circle.y) ** 2);
    return distance <= circle.radius;
}


canvas.addEventListener('click', (event) => {
    // Con esto gestionamos todos los clicks en el canvas.
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (state === 'not_started') {
        state = 'started';
    }

    if (inCircle(mouseX, mouseY, circle) && state === 'started') {
        points++;
        changePelotaColor();
    }
});

function setContextoPropierties(){
    context.textAlign = "center";
    context.textBaseline = "middle";
}

$(document).ready(function() {
    function iniciarJuego() {
        resizeCanvas();
        countdownInterval = setInterval(countDown, 10);
    }
    function resizeCanvas() {
        // Ajustamos canvas para que coincida con el css y además le hacemos el escalado para que se vea bien.
        const container = $('#JuegaContenedor');

        const devicePixelRatio = window.devicePixelRatio || 1;
        canvas.width = container.width() * devicePixelRatio;
        canvas.height = container.height() * devicePixelRatio;
        canvas.style.width = container.width() + 'px';
        canvas.style.height = container.height() + 'px';
        context.scale(devicePixelRatio, devicePixelRatio);


        // Estos let son importantes porque si usamos el canvas.width las cosas ya no funcionan bien con el scale.
        canvas_w = container.width();
        canvas_h = container.height();

        circle.x = canvas_w / 2;
        circle.y = canvas_h / 2;
        setContextoPropierties();
    }

    function changeImage() {
        $('.juega-juegos').hide();

        if ($('#LanzaNieves').is(':checked')) {
            $('#LanzaNievesJuego').show();
        } else if ($('#CarreraDeTrineos').is(':checked')) {
            $('#CarreraDeTrineosJuego').show();
        } else if ($('#ReparteRegalos').is(':checked')) {
            $('#ReparteRegalosJuego').show();
        }
    }
    $('input[name="juegos"]').on('change', changeImage);

    iniciarJuego();
    changeImage();

    $(window).on("resize", resizeCanvas);
});



