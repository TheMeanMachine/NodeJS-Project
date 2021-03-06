'use strict'
const Reviews = require('../modules/review.js')
const Comments = require('../modules/comment.js')
const Users = require('../modules/user.js')
const sqlite = require('sqlite-async')

describe('comment - review intergration', () => {
	test('Test review returns comment along', async done => {
		const db = await sqlite.open(':memory:')
		const spy = jest.spyOn(sqlite, 'open').mockImplementation(() => db)
		const comment = await new Comments()
		const review = await new Reviews()
		const user = await new Users()
		spy.mockRestore()

		const userID = await user.register('Aaron', '123')
		const userID2 = await user.register('Lewis', '123')
		const reviewID = await review.addReview(1, {fullText: 'sa', rating: 3}, userID)
		const reviewID2 = await review.addReview(1, {fullText: 'sa', rating: 3}, userID2)
		const commentID = await comment.addComment(reviewID, userID, 'This is a comment')
		await comment.addComment(reviewID2, userID, 'This is a bad review')
		const result = await review.getReviewsByGameID(1, true, userID)


		expect(result).toMatchObject({
			reviews: [
				{
					comments: [
						{
							fullText: 'This is a bad review'
						}
					]
				}
			],
			userReview: {
				comments:
                [
                	{
                		ID: commentID,
                		fullText: 'This is a comment'
                	}
                ]
			}


		})

		done()
	})
})


describe('getCommentsByReviewID()', () => {
	test('Valid comment', async done => {
		expect.assertions(1)

		const comment = await new Comments()
		const review = await new Reviews()
		const user = await new Users()
		const userSpy = jest.spyOn(user, 'register').mockImplementation(() => 1)
		const reviewSpy = jest.spyOn(review, 'addReview').mockImplementation(() => 1)

		const userID = await user.register()

		const reviewID = await review.addReview()

		const fullText = 'I do not think this review is true'
		const fullText2 = 'Well I do!'

		await comment.addComment(reviewID, userID, fullText)
		await comment.addComment(reviewID, userID, fullText2)
		const comments = await comment.getCommentsByReviewID(reviewID)

		expect(comments).toMatchObject(
			{
				comments: [{
					fullText: fullText
				},
				{
					fullText: fullText2
				}]
			}
		)

		userSpy.mockRestore()
		reviewSpy.mockRestore()
		done()
	})

	test('Error if reviewID is null', async done => {
		expect.assertions(1)

		const comment = await new Comments()
		const review = await new Reviews()
		const user = await new Users()
		const userSpy = jest.spyOn(user, 'register').mockImplementation(() => 1)
		const reviewSpy = jest.spyOn(review, 'addReview').mockImplementation(() => 1)

		const userID = await user.register()

		const reviewID = null

		await expect( comment.getCommentsByReviewID(reviewID, userID))
			.rejects.toEqual(Error('Must supply reviewID'))


		userSpy.mockRestore()
		reviewSpy.mockRestore()
		done()
	})

	test('Error if reviewID is NaN', async done => {
		expect.assertions(1)

		const comment = await new Comments()
		const review = await new Reviews()
		const user = await new Users()
		const userSpy = jest.spyOn(user, 'register').mockImplementation(() => 1)
		const reviewSpy = jest.spyOn(review, 'addReview').mockImplementation(() => 1)

		const userID = await user.register()

		const reviewID = 'not a number'

		await expect( comment.getCommentsByReviewID(reviewID, userID))
			.rejects.toEqual(Error('Must supply reviewID'))


		userSpy.mockRestore()
		reviewSpy.mockRestore()
		done()
	})

	test('Error if reviewID is undefined', async done => {
		expect.assertions(1)

		const comment = await new Comments()
		const review = await new Reviews()
		const user = await new Users()
		const userSpy = jest.spyOn(user, 'register').mockImplementation(() => 1)
		const reviewSpy = jest.spyOn(review, 'addReview').mockImplementation(() => 1)

		const userID = await user.register()

		const reviewID = undefined

		await expect( comment.getCommentsByReviewID(reviewID, userID))
			.rejects.toEqual(Error('Must supply reviewID'))


		userSpy.mockRestore()
		reviewSpy.mockRestore()
		done()
	})
})

describe('deleteCommentByID()', () => {
	test('Valid comment', async done => {
		expect.assertions(2)

		const comment = await new Comments()
		const review = await new Reviews()
		const user = await new Users()
		const userSpy = jest.spyOn(user, 'register').mockImplementation(() => 1)
		const reviewSpy = jest.spyOn(review, 'addReview').mockImplementation(() => 1)

		const userID = await user.register()

		const reviewID = await review.addReview()

		const fullText = 'I do not think this review is true'

		const commentID = await comment.addComment(reviewID, userID, fullText)

		const result = await comment.deleteCommentByID(commentID)

		const comments = await comment.getCommentsByReviewID(reviewID)

		expect(result).toBe(true)
		expect(comments).toMatchObject(
			{
				comments: []
			}
		)

		userSpy.mockRestore()
		reviewSpy.mockRestore()
		done()
	})

	test('Error if commentID is undefined', async done => {
		expect.assertions(1)

		const comment = await new Comments()


		const commentID = undefined

		await expect(comment.deleteCommentByID(commentID))
			.rejects.toEqual(Error('Must supply commentID'))

		done()
	})

	test('Error if commentID is null', async done => {
		expect.assertions(1)

		const comment = await new Comments()

		const commentID = null

		await expect(comment.deleteCommentByID(commentID))
			.rejects.toEqual(Error('Must supply commentID'))


		done()
	})

	test('Error if commentID is NaN', async done => {
		expect.assertions(1)

		const comment = await new Comments()

		const commentID = 'not a number'

		await expect(comment.deleteCommentByID(commentID))
			.rejects.toEqual(Error('Must supply commentID'))

		done()
	})

})

describe('addComment()', () => {
	test('Valid comment', async done => {
		expect.assertions(1)

		const comment = await new Comments()
		const review = await new Reviews()
		const user = await new Users()
		const userSpy = jest.spyOn(user, 'register').mockImplementation(() => 1)
		const reviewSpy = jest.spyOn(review, 'addReview').mockImplementation(() => 1)

		const userID = await user.register()

		const reviewID = await review.addReview()

		const fullText = 'I do not think this review is true'

		const result = await comment.addComment(reviewID, userID, fullText)

		expect(result).toBe(1)

		userSpy.mockRestore()
		reviewSpy.mockRestore()
		done()
	})

	test('Error if reviewID is null', async done => {
		expect.assertions(1)

		const comment = await new Comments()
		const review = await new Reviews()
		const user = await new Users()
		const userSpy = jest.spyOn(user, 'register').mockImplementation(() => 1)
		const reviewSpy = jest.spyOn(review, 'addReview').mockImplementation(() => 1)

		const userID = await user.register()

		const reviewID = null

		const fullText = 'I do not think this review is true'

		await expect( comment.addComment(reviewID, userID, fullText))
			.rejects.toEqual(Error('Must supply reviewID'))


		userSpy.mockRestore()
		reviewSpy.mockRestore()
		done()
	})

	test('Error if reviewID is NaN', async done => {
		expect.assertions(1)

		const comment = await new Comments()
		const review = await new Reviews()
		const user = await new Users()
		const userSpy = jest.spyOn(user, 'register').mockImplementation(() => 1)
		const reviewSpy = jest.spyOn(review, 'addReview').mockImplementation(() => 1)

		const userID = await user.register()

		const reviewID = 'Not a number'

		const fullText = 'I do not think this review is true'

		await expect( comment.addComment(reviewID, userID, fullText))
			.rejects.toEqual(Error('Must supply reviewID'))


		userSpy.mockRestore()
		reviewSpy.mockRestore()
		done()
	})

	test('Error if reviewID is undefined', async done => {
		expect.assertions(1)

		const comment = await new Comments()
		const review = await new Reviews()
		const user = await new Users()
		const userSpy = jest.spyOn(user, 'register').mockImplementation(() => 1)
		const reviewSpy = jest.spyOn(review, 'addReview').mockImplementation(() => 1)

		const userID = await user.register()

		const reviewID = undefined

		const fullText = 'I do not think this review is true'

		await expect( comment.addComment(reviewID, userID, fullText))
			.rejects.toEqual(Error('Must supply reviewID'))


		userSpy.mockRestore()
		reviewSpy.mockRestore()
		done()
	})

	test('Error if userID is null', async done => {
		expect.assertions(1)

		const comment = await new Comments()
		const review = await new Reviews()
		const user = await new Users()
		const userSpy = jest.spyOn(user, 'register').mockImplementation(() => 1)
		const reviewSpy = jest.spyOn(review, 'addReview').mockImplementation(() => 1)

		const reviewID = await review.addReview()

		const userID = null

		const fullText = 'I do not think this review is true'

		await expect( comment.addComment(reviewID, userID, fullText))
			.rejects.toEqual(Error('Must supply userID'))


		userSpy.mockRestore()
		reviewSpy.mockRestore()
		done()
	})

	test('Error if userID is NaN', async done => {
		expect.assertions(1)

		const comment = await new Comments()
		const review = await new Reviews()
		const user = await new Users()
		const userSpy = jest.spyOn(user, 'register').mockImplementation(() => 1)
		const reviewSpy = jest.spyOn(review, 'addReview').mockImplementation(() => 1)

		const reviewID = await review.addReview()

		const userID = 'Not a number'

		const fullText = 'I do not think this review is true'

		await expect( comment.addComment(reviewID, userID, fullText))
			.rejects.toEqual(Error('Must supply userID'))


		userSpy.mockRestore()
		reviewSpy.mockRestore()
		done()
	})

	test('Error if userID is undefined', async done => {
		expect.assertions(1)

		const comment = await new Comments()
		const review = await new Reviews()
		const user = await new Users()
		const userSpy = jest.spyOn(user, 'register').mockImplementation(() => 1)
		const reviewSpy = jest.spyOn(review, 'addReview').mockImplementation(() => 1)
		const reviewID = await review.addReview()
		const userID = undefined

		const fullText = 'I do not think this review is true'

		await expect( comment.addComment(reviewID, userID, fullText))
			.rejects.toEqual(Error('Must supply userID'))


		userSpy.mockRestore()
		reviewSpy.mockRestore()
		done()
	})

	test('Error if fullText is null', async done => {
		expect.assertions(1)

		const comment = await new Comments()
		const review = await new Reviews()
		const user = await new Users()
		const userSpy = jest.spyOn(user, 'register').mockImplementation(() => 1)
		const reviewSpy = jest.spyOn(review, 'addReview').mockImplementation(() => 1)
		const reviewID = await review.addReview()
		const userID = await user.register()

		const fullText = null

		await expect( comment.addComment(reviewID, userID, fullText))
			.rejects.toEqual(Error('Must supply fulltext'))


		userSpy.mockRestore()
		reviewSpy.mockRestore()
		done()
	})

	test('Error if fullText is empty', async done => {
		expect.assertions(1)

		const comment = await new Comments()
		const review = await new Reviews()
		const user = await new Users()
		const userSpy = jest.spyOn(user, 'register').mockImplementation(() => 1)
		const reviewSpy = jest.spyOn(review, 'addReview').mockImplementation(() => 1)
		const reviewID = await review.addReview()
		const userID = await user.register()

		const fullText = ''

		await expect( comment.addComment(reviewID, userID, fullText))
			.rejects.toEqual(Error('Must supply fulltext'))


		userSpy.mockRestore()
		reviewSpy.mockRestore()
		done()
	})
})
