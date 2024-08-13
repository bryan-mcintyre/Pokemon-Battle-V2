# Pokemon-Battle-V2

## Table of Contents
- [Description](#description)
- [User Story](#user-story)
- [Acceptance Criteria](#acceptance-criteria)
- [Usage](#usage)
- [Visuals](#visuals)
- [Repository-Link](#repository-link)
- [Deployed-Application](#deployed-application)
- [Credits](#deployed-application)
- [License](#license)
- [Future](#future-development)


## Description

This is a full-stack web application that allows you to play Pokémon in a brand new way! It uses Node.js and Express.js to create a RESTful API, Handlebars.js as the template engine, PostgreSQL and the Sequelize ORM for the database, and GSAP for animations.

This application prompts you to log in or sign up on the home page. When you create an account, you are presented with 3 options to choose a starter Pokémon. When you choose your starter, you are taken to the dashboard where you can see your Pokémon storage and a nav bar for navigating to other areas of the application such as store, backpack and battle. The main function of this application is to battle Pokémon, enjoy finding wild Pokémon with a chance to catch them if you defeat them in battle and be able to level your Pokémon up to earn abilities through battling.

## User Story

AS A user,
I WANT to collect Pokémon 
SO THAT I can battle them

AS A user,
I WANT to be able to heal my Pokémon after battle
SO THAT I can continue to use them in more battles

AS A user,
I WANT to be able to earn currency
SO THAT I can buy and sell items for use in the game

AS A user,
I WANT to see an animated battle
SO THAT I know which Pokémon is attacking and which is being attacked

AS A user, 
I WANT to be able to catch Pokémon
SO THAT I can keep adding to my collection

AS A user,
I WANT to level up my Pokémon
SO THAT they will get stronger


## Acceptance Criteria

GIVEN a web application
WHEN I load the home page
THEN I am presented with a choice of 3 starter Pokémon to choose from
WHEN I select a Pokémon
THEN it stores to my storage box and takes me to the dashboard where I see my stored starter
WHEN I toggle view my storage box
THEN I can see or hide all of my owned Pokémon
WHEN I go to the store view
THEN I am able to purchase items with earned currency
WHEN I navigate to my backpack
THEN I am presented with all the items I own and the ability to use them
WHEN I am on dashboard, backpack or store views
THEN I can see my currency amount with a way to understand what it is (tooltip)
WHEN I navigate to the battle view
THEN I am presented with a wild Pokémon and the option to battle it or not
WHEN I choose no
THEN I am presented with a new wild Pokémon and the choice to battle
WHEN I choose yes
THEN I am asked to select my Pokémon for battle
WHEN I select my Pokémon for battle
THEN I am taken to the battle
WHEN I start the battle
THEN I am given an attack button
WHEN I press the attack button
THEN the game calculates Pokémon speed stat to determine who goes first and animates attacks accordingly
WHEN a Pokémon is damaged by an attack
THEN I see its current HP go down
WHEN a Pokémon reaches 0 current HP
THEN the battle ends and I am shown whether I won or lost
WHEN I win
THEN I am presented with options to battle again, go to dashboard or catch Pokémon
WHEN I choose battle again
THEN I am taken back to a wild Pokémon appeared
WHEN I choose dashboard
THEN I am taken to the dashboard view
WHEN I choose catch Pokémon
THEN I am able to use a Poké ball to add the Pokémon to my collection
WHEN I lose
THEN I am presented with try again or go to dashboard
WHEN I win a battle
THEN my Pokémon earns exp toward leveling up and I earn currency
WHEN my Pokémon levels up to certain thresholds
THEN it earns abilities that will make it stronger in battle


## Usage

As a new user, create an account by registering your information on the signup screen. As an existing user you'll only need to log in for future visits.

Once logged in you will be presented with 3 options for your very first Pokémon! Choose one of them to continue. Upon selecting a starter you will be taken to the dashboard where you can see your Pokémon storage. (and toggle it open or closed)

From the dashboard you can use the nav bar at the top to navigate to different areas of the application. 

Dashboard, Store and Backpack all have your wallet at the top with a tooltip that gives more information on Pokédollars.

Store will take you to the store where you can purchase items such as potions, revives and pokéballs. There is a dropdown so you can purchase more than 1 of an item at a time. On purchase these items are sent to your backpack.

Backpack will take you to your backpack where you will see items you own and be able to use them on your Pokémon to heal them, sell the items back to the store for Pokédollars in the event you have run out.

Battle will take you to a wild Pokémon! Here you will see a wild Pokémon on the battlefield. You are asked "Do you want to battle this Pokémon?" If you choose "No," a new wild Pokémon appears. If you choose "Yes," you are prompted to select one of your Pokémon for battle.

When you select one of your Pokémon for battle you are brought to the Battle Begins! view where you will see your chosen Pokémon on the left and the Pokémon you chose to battle on the right with "Start Battle!" and "Quit Battle" buttons in-between them.

On your Pokémon's card, there are clickable icons to learn about abilities.

When you click Quit Battle, you are taken back to the dashboard.

When you click Start Battle, an Attack! button appears on your Pokémon's card, click this Attack! button to start. This will trigger our code to figure out which Pokémon has the higher speed stat, determining which one goes first.

The faster Pokémon will attack by moving to the other Pokémon and hitting it, the injured Pokémon will blink to represent taking damage.

Continue this until either your Pokémon or the opponent Pokémon reach 0 current HP which means they are knocked out.

If yours is knocked out, you will be given a small amount of Pokédollars and options to quit to dashboard or try again which sends you back to the wild Pokémon appeared view.

If you knocked the opponent out, you will be given a larger amount of Pokédollars and options to quit to dashboard, battle again or catch the Pokémon you just defeated. 

If you choose battle again / try again, make sure you have a Pokémon that is healthy enough to battle! If you don't, be sure to use items from your backpack or visit the store to purchase more.

Refer to [Deployed-Application](#deployed-application) for link to the deployed application.


## Visuals

Home Page:

![1 Home page](https://github.com/user-attachments/assets/cc1ac5cd-9e43-4a69-afdb-d0278d7444f7)

Choose starter view:

![1 1 choose starter on sign up view](https://github.com/user-attachments/assets/0b86c3ed-b5d0-4171-9814-5418e43a4dfa)

Dashboard:

![2 Dashboard view with pokemon storage](https://github.com/user-attachments/assets/bad4973a-5352-4371-a668-4a4c1efc1ea1)

Store:

![3 Store view](https://github.com/user-attachments/assets/3ede3c5c-dde0-4cd6-b576-ebc2b703e957)

A wild Pokémon appeared!

![5 wild pokemon view](https://github.com/user-attachments/assets/082a4903-277d-48c9-a30d-a74b1bd9a946)

Battle!

![6 battle view](https://github.com/user-attachments/assets/864efae2-71cd-4fcb-a197-2958439f8258)


## Future Development

Add a chance to recieve items on battle win including Pokémon eggs.

Add more items to the store for specific usage.

Add more ways to catch Pokémon for your collection.

Increase the max level of Pokémon and add more abilities.

Add Daycare view with egg incubators for hatching eggs to a random Pokémon for your collection.

Add Pokémon "type" logic, example: fire, water, grass and so on.

Add different battlefield views based on opponent Pokémon type.

Add Pokémon attacks that can be chosen during battle, example: slash, bite, tackle and so on.

Add individual animations for specific attacks.

Add Pokémon center for faster healing of all Pokémon.

## Repository Link

GitHub Repository:
https://github.com/iKeyToLife/Pokemon-Battle-V2

## Deployed Application

https://pokemon-battle-bfgc.onrender.com

## License

This project is licensed under the terms of the [MIT License](LICENSE).

## Credits

Aleksandr Polbennikov [Aleksandr Polbennikov](https://github.com/iKeyToLife)
Colin Taaffe [Colin Taaffe](https://github.com/ColinBurner)
Bryan McIntyre [Bryan McIntyre](https://github.com/bryan-mcintyre)
Leena Cruz [Leena Cruz](https://github.com/LeenaCruz)


