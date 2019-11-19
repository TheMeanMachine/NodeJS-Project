'use strict'

const Category = require('../modules/category.js')

describe('addCategory()', () => {
	test('Valid category', async done => {
	test('Valid name', async done => {
		expect.assertions(1)

		const category = await new Category()

		expect(await category.addCategory('Horror')).toBe(true)
		expect(await category.addCategory('Horror')).toBe(1)

		done()
	})

	test('Error if category null', async done => {
		expect.assertions(1)

		const category = await new Category()

		await expect( category.addCategory(null))
			.rejects(Error('Must supply category'))
	test('Error if duplicate', async done => {
		expect.assertions(1)

		const category = await new Category()
		await category.addCategory('Horror')

		await expect(category.addCategory('Horror'))
			.rejects.toEqual(Error('Category already exists'))

		done()
	})

	test('Error if category invalid', async done => {
	test('Error if name null', async done => {
		expect.assertions(1)

		const category = await new Category()

		await expect(category.addCategory(null))
			.rejects.toEqual(Error('Must supply name'))

		done()
	})

	test('Error if name invalid', async done => {
		expect.assertions(1)

		const category = await new Category()

		await expect( category.addCategory('~~@{}__)+'))
			.rejects(Error('Must supply category'))

		done()
	})
			.rejects.toEqual(Error('Must supply name'))

		done()
	})


})

describe('getCategoryByID()', () => {
	test('Valid ID', async done => {
		expect.assertions(1)

		const category = await new Category()
		const catID = await category.addCategory('Run')

		expect(await category.getCategoryByID(catID)).toMatchObject(
			{
				ID: 1,
				title: 'Run'
			}
		)

		done()
	})

	test('Error if category does not exist', async done => {
		expect.assertions(1)

		const category = await new Category()

		await expect( category.getCategoryByID(2))
			.rejects.toEqual(Error('Category not found'))

		done()
	})

	test('Error if catID is null', async done => {
		expect.assertions(1)

		const category = await new Category()

		await expect( category.getCategoryByID(null))
			.rejects.toEqual(Error('Must supply catID'))

		done()
	})

	test('Error if catID is NaN', async done => {
		expect.assertions(1)

		const category = await new Category()

		await expect( category.getCategoryByID('Not a number'))
			.rejects.toEqual(Error('Must supply catID'))

		done()
	})
})

describe('deleteByID()', () => {
	test('Valid catID', async done => {
		expect.assertions(1)

		const category = await new Category()
		const catID = await category.addCategory('Run')
		expect(await category.deleteByID(catID)).toBe(true)

		done()
	})

	test('Error if catID is null', async done => {
		expect.assertions(1)

		const category = await new Category()

		await expect(category.deleteByID(null))
			.rejects.toEqual(Error('Must supply catID'))

		done()
	})

	test('Error if catID is NaN', async done => {
		expect.assertions(1)

		const category = await new Category()

		await expect(category.deleteByID('Not a number'))
			.rejects.toEqual(Error('Must supply catID'))

		done()
	})

})
