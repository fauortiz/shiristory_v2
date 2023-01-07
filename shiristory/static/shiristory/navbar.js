document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll(".menu-toggler").forEach(
        element => element.addEventListener(
            'click', () => {
                document.querySelector('.menu-game').classList.toggle('hide')
                document.querySelector('.navbar-game-closer').classList.toggle('show')
            }
        )
    )
})

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}
