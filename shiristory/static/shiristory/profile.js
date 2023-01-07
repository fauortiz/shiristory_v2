document.addEventListener('DOMContentLoaded', () => {
    try {
        // profile mini navbar
        let attunementButton = document.querySelector('.show-attunement')
        let profileButton = document.querySelector('.show-profile')
        let leaderboardButton = document.querySelector('.show-leaderboards')
        attunementButton.addEventListener('click', () => {
            document.querySelector('.attunement-container').style.display = 'block'
            document.querySelector('.profile-container').style.display = 'none'
            document.querySelector('.leaderboards-container').style.display = 'none'
            document.querySelectorAll('button.submit').forEach(button => button.classList.remove('button-active'))
            attunementButton.classList.add('button-active')
        })
        profileButton.addEventListener('click', () => {
            document.querySelector('.attunement-container').style.display = 'none'
            document.querySelector('.profile-container').style.display = 'block'
            document.querySelector('.leaderboards-container').style.display = 'none'
            document.querySelectorAll('button.submit').forEach(button => button.classList.remove('button-active'))
            profileButton.classList.add('button-active')
        })
        leaderboardButton.addEventListener('click', () => {
            document.querySelector('.attunement-container').style.display = 'none'
            document.querySelector('.profile-container').style.display = 'none'
            document.querySelector('.leaderboards-container').style.display = 'block'
            document.querySelectorAll('button.submit').forEach(button => button.classList.remove('button-active'))
            leaderboardButton.classList.add('button-active')
        })
    } catch (e) {}

    try {
        // displays matching spell edit UI when clicking "attune" button
        document.querySelectorAll('.view-spell-button').forEach(button => {
            button.addEventListener('click', () => {
                const spell = button.classList[2]
                document.querySelectorAll('.view-spell').forEach(section => {
                    if (section.classList.contains(spell)) {
                        section.style.display = 'none'
                    } else {
                        section.style.display = 'block'
                    }
                })
                document.querySelectorAll('.edit-spell').forEach(section => {
                    if (section.classList.contains(spell)) {
                        section.style.display = 'block'
                    } else {
                        section.style.display = 'none'
                    }
                })
                document.querySelectorAll('input[type="text"]').forEach(field => {
                    if (field.classList.contains(spell)) {
                        field.focus()
                    } else {
                        field.value = ""
                    }
                })
            })
        })
        // displays matching spell view UI when clicking "cancel" button
        document.querySelectorAll('.edit-spell-button').forEach(button => {
            button.addEventListener('click', () => {
                const spell = button.classList[2]
                document.querySelectorAll('.view-spell').forEach(section => {
                    if (section.classList.contains(spell)) {
                        section.style.display = 'block'
                    }
                })
                document.querySelectorAll('.edit-spell').forEach(section => {
                    if (section.classList.contains(spell)) {
                        section.style.display = 'none'
                    }
                })
            })
        })
    } catch (e) {}















    function update_spellword(spell, word) {
        fetch(`/level/${spell}`, {
            method: 'PUT',
            body: JSON.stringify({word: word})
        })
        .then(response => {
            console.log(response)
            
            // divContent.innerHTML = textareaContent.value;
            // posts[i].content = textareaContent.value;
            // textareaContent.value = '';
            // divContent.style.display = 'block';
            // buttonEdit.style.display = 'inline-block';
            // textareaContent.style.display = 'none';
            // buttonSave.style.display = 'none';
        })
    }
})