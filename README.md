## Serialised

Discord.js is a pain to work with. The most updated code will be in the Java-Rework Branch
If any of the code is usefull, feel free to copy/paste.

A Discrod bot that can look through your follows list on MangaDex to check if a manga is still being updated on the site.</br>
This poject was made with: [TypeScript](https://www.typescriptlang.org/), [Mongoose](https://mongoosejs.com/), [Discord.js](https://discord.js.org/)

<details>
<summary>Table of Contents</summary>
<ul> 
    <li><a href='#getting-started'>Getting Started</a></li>
    <li><a href="#installation">Installation</a></li>
    <li><a href="#setup">Setup</a></li>
    <li><a href="#start">Start</a></li>
    <li><a href="#note">Note</a></li>
    <li><a href='#known-issues'>Known Issues</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li> 
</details>

_______

## Getting Started
Currently you will need to install this bot and run it locally.
</br>Once some bugs are ironed out, you will be able to invite the bot.

## Installation

After cloning the repo make sure you install all dependencies.
  ```sh
    in your terminal, run
        yarn
    or
        npm i
  ```

## Setup

Once all dependencies are installed, find the ***.env.example*** and update the following fields;

  ```sh
    DISCORD_TOKEN=<your discord bot token here>
  ```

Then rename the file to ***.env***

## Start

Use
  ```sh
        yarn dev
    or
        npm run dev
  ```
to start the dev enviroment.

_______

## Note

This bot uses a web scraper to fetch the latest chapter of a given manga. It sources data from Manganato. If a manga isn't available or hasn't been updated on Manganato, it will be added to the **Error** array.
</br>Depending on how big your follow list is, the bot can take a few minutes to run the /check-follow command. The bot also has a timeout function of 5 minutes. If your follow list is too long or if your internet connection is not great, you may trigger the timeout function and encounter an error.


## Known Issues

<details>
<summary>Issues</summary>
<ul> 
    <li>The MangaDex API sometimes returns an unexpected value, causing a manga to be filtered into the Error array</li>
    <li>The tinmeout function around the modal submit function (src>config>discord>index>line 132) causes the server to crash.</li>
</details>

_______

## License

![badge](https://img.shields.io/badge/license-MIT-brightgreen)
<br />
This application is covered by the MIT license.


## Contact

If you have any questions, you can contact me from [here](https://www.miran-yasunori.com/contact)
