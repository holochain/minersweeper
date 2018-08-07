# Holochain Minersweeper

A massively multiplayer version of the classic game Minesweeper. Instead of sweeping mines the goal is to sweep away those pesky altcoins!

This project was created during the mid 2018 Holo intern program to demonstrate the capabilities of Holochain-proto.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Ensure holochain-proto (at least version 26) is installed on your machine by running. 

```
hcd -v
```

Subsequent steps also assumes npm/yarn is installed.

### Installing

Install the javascript/typescript packages with

```
npm install
```
Build the Holochain dna using

```
npm run hc:build
```
and build the UI with
```
npm run build
```

The app can now be started for development purposes using
```
npm run hc:dev
```
and opening the browser to http://localhost:4141 

-----

If you would like to persist data between sessions install to the local holochain directory by running the following from the project root directory:
```
hcadmin init <id/name string>
hcadmin join ./build/ minesweeper
hcd minesweeper
```

## Running the tests

Run holochain test using

```
npm run hc:build && npm run hc:test
```

----

Run jest front-end tests using 
```
npm run test
```

## Built With

* [Holochain](https://github.com/holochain/holochain-proto)
* [Typescript](https://github.com/Microsoft/TypeScript)
* [React](https://reactjs.org/)
* [Redux](https://redux.js.org/)

## Authors

* **Michael Dougherty** - [maackle](https://github.com/maackle)
* **Willem Olding** - [willemolding](https://github.com/willemolding)
* **Lisa Jetton** - [JettTech](https://github.com/JettTech)
* **bifeitang** - [bifeitang](https://github.com/bifeitang)
* **Joel U** - [zo-el](https://github.com/zo-el)
* **dtholmes187** - [dtholmes187](https://github.com/dtholmes187)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the GPL-3 License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Credit to http://minesweeper.io/ for the original inspiration for MMO minesweeper

