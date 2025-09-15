function countdownToChristmas() {
    const today = new Date();
    const christmas = new Date(today.getFullYear(), 11, 25);

    if (today.getMonth() === 11 && today.getDate() > 25) {
        // Si llegamos a la fecha cambiamos al año + 1
        christmas.setFullYear(christmas.getFullYear() + 1);
    }

    const oneDay = 1000 * 60 * 60 * 24;
    const oneHour = 1000 * 60 * 60;
    const oneMinute = 1000 * 60;
    const oneSecond = 1000;
    const timeUntilChristmas = christmas.getTime() - today.getTime()

    const daysLeft = Math.floor(timeUntilChristmas / oneDay);
    const hoursLeft = Math.floor(timeUntilChristmas % oneDay / oneHour)
    const minutesLeft = Math.floor(timeUntilChristmas % oneHour / oneMinute)
    const secondsLeft = Math.floor(timeUntilChristmas % oneMinute / oneSecond)

    document.getElementById('dias').innerText = daysLeft;
    document.getElementById('horas').innerText = hoursLeft;
    document.getElementById('minutos').innerText = minutesLeft;
    document.getElementById('segundos').innerText = secondsLeft;

}

// Inicializar el countdown
countdownToChristmas();

// Actualizar el coundown cada segundo
setInterval(countdownToChristmas, 1000);