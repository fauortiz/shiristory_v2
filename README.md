![SHIRISTORY](readme.gif)

## SHIRISTORY v2

#### Overview

SHIRISTORY is a browser game I made, loosely based on [word chain](https://en.wikipedia.org/wiki/Word_chain) games. Users can play a video game on the app, create accounts, level up, purchase customizable upgrades, and climb leaderboards. This readme will not cover how to play. Learn to play in game via the links below, or by running the game locally!

This project was made using React and Django, with a live demo on Heroku. It's a new iteration of my previous attempt at making this game using only Flask. It was created using more fitting frameworks that I've learned how to use since.

### [Live demo on Heroku](https://shiristory.herokuapp.com)
### [Screencast demonstration for CS50 Web](https://www.youtube.com/watch?v=uYyL5pzbJX0)

#### Wordlist

The game requires a long chain of valid english words to be inputted by the player as fast as they can type, which requires the app to have access to a way to validate each string submitted quickly. 

Instead of using a dictionary with definitions, I used [SCOWL](http://wordlist.aspell.net/scowl-readme/) (Spell Checker Oriented Word Lists), which let me create a custom wordlist for the game that I turned into a compact JSON file that is saved in the user's localStorage. The wordlist is verified on every page load.

I also used the data [here](https://norvig.com/mayzner.html) in designing the game balance for the game's bonus point objectives.

#### Mobile-responsive

The game can be played on mobile, tablet, and desktop. The UI of the game will organize and resize itself based on the size of the viewport. The rest of the app is also responsive.

#### Live demo on Heroku

This same project was configured to be hosted on Heroku, as shown in the [live demo](https://shiristory.herokuapp.com). However, that version differs from what is committed here.

On Heroku, `DEBUG=False` same as here, however the `SECRET_KEY` used there was generated using `get_random_secret_key`.

The `Procfile` wasn't committed here, however the various packages used for hosting the app, such as `gunicorn`, were left in the `requirements.txt` file. `whitenoise` is used to serve static files from Django.

However, the database used was left as `sqlite3` to save on resources. The live demo therefore cannot retain any changes to the sample database, due to Heroku's ephemeral filesystem. The very same `db.sqlite3` file here is used on that demo to provide sample data, for ease of showcasing features. The authentication views also have a notice on the Heroku app regarding the database, which is omitted here. 

## How to run SHIRISTORY

First, ensure you have `git`, `python3`, and `npm` installed.

Navigate to where you want to place this project and clone this git repository there, as below:

```
$ git clone https://github.com/fauortiz/shiristory_v2.git
$ cd shiristory_v2
```

While this is a Django project, the view containing the game itself was built using React. The Django project has been configured to detect the React app as one of its views. Proceed with the instructions below to install dependencies and create a production build for this React app:

```
$ cd frontend
$ npm install
$ npm run build
$ cd ..
```

Moving on to the Django project, set up and activate your python virtual environment of choice, or refer to the sample Windows Powershell commands below:

```
$ python -m venv .venv
$ & .venv\Scripts\Activate.ps1
```

Then, initialize and run the Django project with the following commands:

```
$ python -m pip install -r requirements.txt
$ python manage.py makemigrations
$ python manage.py migrate
$ python manage.py collectstatic
$ python manage.py runserver
```
Finally, open your browser to `http://127.0.0.1:8000/` and try it out!


## Credits and Thanks

SHIRISTORY was made by me, Francis Ortiz, for CS50 Web.

- Music is [2:23am by Sharou](https://www.youtube.com/watch?v=slt_Bav8nsQ)
- SFX from [Freesound](https://freesound.org/)
- Logo font is [Salbabida Sans](https://www.instagram.com/p/CHiXkLRnSYP/)
- Creatures are Digimon (for now)

Thanks to my friends for supporting me and helping playtest the game, and thank you for reading!