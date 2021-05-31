# Minersweeper 2.0

A massively multiplayer version of the classic game Minesweeper. Instead of sweeping mines the goal is to sweep away those pesky altcoins!

This project was created during the mid 2018 Holo intern program to demonstrate the capabilities of Holochain-proto.
Now in 2021 it has been update to use Holochain-rsm

![GitHub last commit](https://img.shields.io/github/last-commit/zo-el/minersweeper.svg)
![GitHub](https://img.shields.io/github/license/zo-el/minersweeper.svg)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Ensure holochain-rsm (as of 6th Jan) is installed on your machine by running.

```
holochain
```

```
hc
```

Subsequent steps also assumes npm/yarn is installed.

### Installing

Install the javascript/typescript packages with

```
npm install
```
Build the Holochain dna using

```
make build
```
and build the UI with
```
npm run build
```

The happ can now be started for development purposes using
```
make gen-agent # to generate agents

make run-agent1 # to run a conductor that is running agent 1
```
and for the ui
```
npm run start
```
and opening the browser to http://localhost:4141

-----

## Running the tests

Run holochain test using

```
make build && make test
```

----

Run jest front-end tests using
```
npm run test
```

## Built With

* [Holochain](https://github.com/holochain/holochain)
* [Typescript](https://github.com/Microsoft/TypeScript)
* [React](https://reactjs.org/)
* [Redux](https://redux.js.org/)

## Authors

* **Joel U** - [zo-el](https://github.com/zo-el)
* **Michael Dougherty** - [maackle](https://github.com/maackle)
* **Willem Olding** - [willemolding](https://github.com/willemolding)
* **Lisa Jetton** - [JettTech](https://github.com/JettTech)
* **bifeitang** - [bifeitang](https://github.com/bifeitang)
* **dtholmes187** - [dtholmes187](https://github.com/dtholmes187)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the GPL-3 License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Credit to http://minesweeper.io/ for the original inspiration for MMO minesweeper
