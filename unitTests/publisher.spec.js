
'use strict'

const Publishers = require('../modules/publisher.js')
const Games = require('../modules/game')

let game
let gameSpy
let gamesList = {games: []}

beforeEach(async() => {

	//Mock Games
	gamesList = {games: []}
	game = await new Games()
	gamesList.games.push()

	gameSpy = jest.spyOn(game, 'addNewGame').mockImplementation((a,b,c) => {
		gamesList.games.push(
			{
				ID: gamesList.games.length+1,
				title: a,
				summary: b,
				desc: c
			}
		)

		return true
	})
	gameSpy = jest.spyOn(game, 'getGameByTitle').mockImplementation((title) => {
		for(let i = 0; i < gamesList.games.length; i++) {
			if(gamesList.games[i].title === title) return gamesList.games[i]

		}
	})
	gameSpy = jest.spyOn(Games.prototype, 'getGameByID').mockImplementation((ID) => {
		for(let i = 0; i < gamesList.games.length; i++) {
			if(gamesList.games[i].ID === ID) return gamesList.games[i]

		}
	})
})

afterEach(async() => {
	gameSpy.mockRestore()
})

describe('game - publisher intergration', () => {

	test('New games, adding into game_publisher', async done => {
		expect.assertions(1)


		const publisher = await new Publishers()


		const catID = await publisher.addPublisher('Runner')

		await game.addNewGame('Green', 'Summary', 'Description')
		await game.addNewGame('Red', 'Summary', 'Description')
		const retGame = await game.getGameByTitle('Red')

		await publisher.associateToPublisher(retGame.ID, catID)

		const result = await publisher.getGamesOfPublisher(catID)

		expect(result).toMatchObject(
			{
				gameID: [
					2
				]
			}
		)
		done()
	})

	test('New games, removing into game_publisher', async done => {
		expect.assertions(1)

		const publisher = await new Publishers()

		const catID = await publisher.addPublisher('Rocky')

		await game.addNewGame('Red', 'Summary', 'Description')
		const retGame = await game.getGameByTitle('Red')

		await publisher.associateToPublisher(retGame.ID, catID)

		const result = await publisher.unassociateToPublisher(retGame.ID, catID)

		expect(result)
			.toBe(true)

		done()
	})

})

describe('searchPublishers()', () => {
	test('valid name', async done => {
		expect.assertions(1)

		const publisher = await new Publishers()

		await publisher.addPublisher('Rockstar Games')
		await publisher.addPublisher('Pop Star Games')

		const result = await publisher.searchPublishers('star')

		expect(result).toMatchObject({
			publishers: [
				{name: 'Rockstar Games'},
				{name: 'Pop Star Games'}

			]
		})

		done()
	})
})

describe('getAllPublishers()', () => {
	test('Gets all Publishers', async done => {
		expect.assertions(1)

		const publisher = await new Publishers()

		await publisher.addPublisher('Rockstar Games')
		await publisher.addPublisher('Pop Star Games')
		const allPubishers = await publisher.getAllPublishers()

		expect(allPubishers).toMatchObject({
			publishers: [
				{name: 'Rockstar Games'},
				{name: 'Pop Star Games'},

			]
		})

		done()
	})

})

describe('getGamesOfPublisher()', () => {
	test('Valid publisherID', async done => {
		expect.assertions(1)

		const publisher = await new Publishers()

		const pubID = await publisher.addPublisher('Rockstar Games')
		await publisher.addPublisher('Pop Star Games')

		await game.addNewGame('Green', 'Summary', 'Description')
		await game.addNewGame('Red', 'Summary', 'Description')
		const retGame = await game.getGameByTitle('Red')
		await publisher.associateToPublisher(retGame.ID, pubID)

		const result = await publisher.getGamesOfPublisher(pubID)

		expect(result).toMatchObject(
			{
				gameID: [2]
			}
		)
		done()
	})

})

describe('unassociateToPublisher', () => {
	test('Valid gameID and publisherID', async done => {
		expect.assertions(1)

		const publisher = await new Publishers()

		const pubID = await publisher.addPublisher('Rocky Games')

		await game.addNewGame('Red', 'Summary', 'Description')
		const retGame = await game.getGameByTitle('Red')

		await publisher.associateToPublisher(retGame.ID, pubID)

		const result = await publisher.unassociateToPublisher(retGame.ID, pubID)

		expect(result)
			.toBe(true)

		done()
	})
})

describe('associateToPublisher()', () => {
	test('Valid publisher and game', async done => {
		expect.assertions(2)

		const publisher = await new Publishers()

		await game.addNewGame(
			'title',
			'summary',
			'desc')
		const retreiveGame = await game.getGameByTitle('title')

		const publisherID = await publisher.addPublisher('Rockstar Games')

		expect(await publisher.associateToPublisher(retreiveGame.ID, publisherID))
			.toBe(true)

		expect(await publisher.getPublishers(retreiveGame.ID)).toMatchObject(
			{
				publishers: [{ID: 1}]
			}
		)

		done()
	})
	test('Error if gameID null', async done => {
		expect.assertions(1)

		const publisher = await new Publishers()

		await game.addNewGame(
			'title',
			'summary',
			'desc')
		await game.getGameByTitle('title')

		const publisherID = await publisher.addPublisher('Rockstar Games')

		await expect(publisher.associateToPublisher(null, publisherID))
			.rejects.toEqual(Error('Must supply gameID'))
		done()
	})

	test('Error if gameID NaN', async done => {
		expect.assertions(1)

		const publisher = await new Publishers()

		await game.addNewGame(
			'title',
			'summary',
			'desc')
		await game.getGameByTitle('title')

		const publisherID = await publisher.addPublisher('Rockstar Games')

		await expect(publisher.associateToPublisher('Not a number', publisherID))
			.rejects.toEqual(Error('Must supply gameID'))
		done()
	})

	test('Error if publisherID null', async done => {
		expect.assertions(1)

		const publisher = await new Publishers()

		await game.addNewGame(
			'title',
			'summary',
			'desc')
		const retreiveGame = await game.getGameByTitle('title')

		await publisher.addPublisher('Rockstar Games')

		await expect(publisher.associateToPublisher(retreiveGame.ID, null))
			.rejects.toEqual(Error('Must supply publisherID'))
		done()
	})

	test('Error if publisherID NaN', async done => {
		expect.assertions(1)

		const publisher = await new Publishers()

		await game.addNewGame(
			'title',
			'summary',
			'desc')
		const retreiveGame = await game.getGameByTitle('title')

		await publisher.addPublisher('Rockstar Games')

		await expect(publisher.associateToPublisher(retreiveGame.ID, 'Not a number'))
			.rejects.toEqual(Error('Must supply publisherID'))
		done()
	})

})

describe('getPublishers()', () => {
	test('Valid gameID', async done => {
		expect.assertions(1)

		const publisher = await new Publishers()

		await game.addNewGame(
			'title',
			'summary',
			'desc')
		const retreiveGame = await game.getGameByTitle('title')
		const publisherID = await publisher.addPublisher('Rockstar Games')
		const publisherIDSecond = await publisher.addPublisher('Microsoft')
		await publisher.associateToPublisher(retreiveGame.ID, publisherID)
		await publisher.associateToPublisher(retreiveGame.ID, publisherIDSecond)

		expect(await publisher.getPublishers(retreiveGame.ID)).toMatchObject(
			{
				publishers: [{ID: 1}, {ID: 2}]
			}
		)


		done()
	})

	test('Error if gameID NaN', async done => {
		expect.assertions(1)

		const publisher = await new Publishers()

		await expect(publisher.getPublishers('Not a number'))
			.rejects.toEqual(Error('Must supply gameID'))
		done()
	})

	test('Error if gameID null', async done => {
		expect.assertions(1)

		const publisher = await new Publishers()

		await expect(publisher.getPublishers(null))
			.rejects.toEqual(Error('Must supply gameID'))
		done()
	})

})


describe('deletePublisherByID()', () => {
	test('Valid publisher', async done => {
		expect.assertions(2)

		const publisher = await new Publishers()

		const id = await publisher.addPublisher('Rockstar Games')

		const result = await publisher.deletePublisherByID(id)
		expect(result).toBe(true)
		await expect(publisher.getPublisherByID(1))
			.rejects.toEqual(Error('Publisher not found'))


		done()
	})

	test('Error if ID is null', async done => {
		expect.assertions(1)

		const publisher = await new Publishers()

		await publisher.addPublisher('Rockstar Games')

		await expect(publisher.deletePublisherByID(null))
			.rejects.toEqual(Error('Must supply ID'))

		done()
	})
	test('Error if ID is NaN', async done => {
		expect.assertions(1)

		const publisher = await new Publishers()


		await expect(publisher.deletePublisherByID('Not a number'))
			.rejects.toEqual(Error('Must supply ID'))

		done()
	})
})

describe('getPublisherByID()', () => {
	test('Valid publisher', async done => {
		expect.assertions(1)

		const publisher = await new Publishers()

		const id = await publisher.addPublisher('Rockstar Games')

		const result = await publisher.getPublisherByID(id)

		expect(result).toMatchObject(
			{
				ID: id,
				name: 'Rockstar Games'
			}
		)

		done()
	})

	test('Error if ID is null', async done => {
		expect.assertions(1)

		const publisher = await new Publishers()

		await publisher.addPublisher('Rockstar Games')

		await expect(publisher.getPublisherByID(null))
			.rejects.toEqual(Error('Must supply ID'))

		done()
	})

	test('Error if ID is NaN', async done => {
		expect.assertions(1)

		const publisher = await new Publishers()


		await expect(publisher.getPublisherByID('Not a number'))
			.rejects.toEqual(Error('Must supply ID'))

		done()
	})
})

describe('addPublisher()', () => {
	test('Valid publisher', async done => {
		expect.assertions(1)

		const publisher = await new Publishers()

		const result = await publisher.addPublisher('Rockstar Games')
		expect(result).toEqual(1)//Returns ID of publisher

		done()
	})

	test('Error if invalid publisher', async done => {
		expect.assertions(1)

		const publisher = await new Publishers()

		await expect(publisher.addPublisher(''))
			.rejects.toEqual(Error('Must supply name'))


		done()
	})


})


describe('checkPublisherFields()', () => {
	test('Valid name', async done => {
		expect.assertions(1)

		const publisher = await new Publishers()

		expect(
			publisher.checkPublisherFields('Rockstar Games')
		).toBe(true)
		done()
	})

	test('Error if: invalid name', async done => {
		expect.assertions(1)

		const publisher = await new Publishers()

		try{
			publisher.checkPublisherFields('R%(*""@#')
		}catch(e) {
			expect(e).toEqual(Error('Must supply name'))
		}
		done()
	})

	test('Error if: empty name', async done => {
		expect.assertions(1)

		const publisher = await new Publishers()

		try{
			publisher.checkPublisherFields('')
		}catch(e) {
			expect(e).toEqual(Error('Must supply name'))
		}
		done()
	})

	test('Error if: null name', async done => {
		expect.assertions(1)

		const publisher = await new Publishers()

		try{
			publisher.checkPublisherFields(null)
		}catch(e) {
			expect(e).toEqual(Error('Must supply name'))
		}
		done()
	})
})
