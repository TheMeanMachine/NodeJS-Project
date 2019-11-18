
'use strict'

const Games = require('../modules/game.js');

const mock = require('mock-fs');
const fs = require('fs');
const mime = require('mime-types')



describe('uploadPicture()', ()=>{
    beforeEach(function() {
        console.log("");
        mock({
            public: {
                game:{

                }
                
            },
            'user/images/pictureUpload.png':  Buffer.from([8, 6, 7, 5, 3, 0, 9])
        });
    });
    
    afterEach(mock.restore);
    
    test('Valid game', async done => {
        expect.assertions(2);

        const game = await new Games();

        const path = 'user/images/pictureUpload.png';
        const type = "image/png";
        const newGame = await game.addNewGame(
            "title",
            "summary",
            "desc");
        const retreiveGame = await game.getGameByTitle("title");
        const gameID = retreiveGame.ID;
        
        expect(await game.uploadPicture(path,type,gameID)).toBe(true);
        const extension = await mime.extension(type);

        expect( await fs.existsSync(`public/game/${gameID}/picture_0.${extension}`)).toBe(true);
        
        

        done();
    })

    test('Error if game does not exist', async done => {
        expect.assertions(1);

        const game = await new Games();

        const path = 'user/images/pictureUpload.png';
        const type = ".png";

        const gameID = 2;
        
        await expect(game.uploadPicture(path,type,gameID))
            .rejects.toEqual(Error('Game not found'));
        done();
    })

    test('Error if gameID is null', async done => {
        expect.assertions(1);

        const game = await new Games();

        const path = 'user/images/pictureUpload.png';
        const type = ".png";
        
        await expect(game.uploadPicture(path,type,null))
            .rejects.toEqual(Error('Must supply gameID'));
        done();
    })

    test('Error if gameID is NaN', async done => {
        expect.assertions(1);

        const game = await new Games();

        const path = 'user/images/pictureUpload.png';
        const type = ".png";
        
        await expect(game.uploadPicture(path,type,"Not a Number"))
            .rejects.toEqual(Error('Must supply gameID'));
        done();
    })

    test('Error if path is null', async done => {
        expect.assertions(1);

        const game = await new Games();

        const path = 'user/images/pictureUpload.png';
        const type = ".png";
        
        await expect(game.uploadPicture(null,type,1))
            .rejects.toEqual(Error('Must supply path'));
        done();
    })

    test('Error if path is empty', async done => {
        expect.assertions(1);

        const game = await new Games();

        const path = 'user/images/pictureUpload.png';
        const type = ".png";
        
        await expect(game.uploadPicture('',type,1))
            .rejects.toEqual(Error('Must supply path'));
        done();
    })

    test('Error if type is null', async done => {
        expect.assertions(1);

        const game = await new Games();

        const path = 'user/images/pictureUpload.png';
        const type = ".png";
        
        await expect(game.uploadPicture(path,null,1))
            .rejects.toEqual(Error('Must supply type'));
        done();
    })

    test('Error if type is empty', async done => {
        expect.assertions(1);

        const game = await new Games();

        const path = 'user/images/pictureUpload.png';
        const type = ".png";
        
        await expect(game.uploadPicture(path,'',1))
            .rejects.toEqual(Error('Must supply type'));
        done();
    })
})


describe('checkGameFields()', ()=>{
    test('Valid fields', async done => {
        expect.assertions(1);
        const game = await new Games();
        let result = await game.checkGameFields('Red Jumper 4','Summary','Description');
        expect(result).toBe(true);
        done();
    })

    test('Error if empty _ title', async done =>{
        expect.assertions(1);
        const game = await new Games();
        try{
            await game.checkGameFields('');
        }catch(e){
            expect(e).toEqual(new Error('Must supply title'));
        }
        
        done();
    })

    test('Error if empty _ summary', async done =>{
        expect.assertions(1);
        const game = await new Games();
        try{
            await game.checkGameFields('Red','');
        }catch(e){
            expect(e).toEqual(new Error('Must supply summary'));
        }
        
        done();
    })

    test('Error if empty _ desc', async done =>{
        expect.assertions(1);
        const game = await new Games();
        try{
            await game.checkGameFields('Red','Summary', '');
        }catch(e){
            expect(e).toEqual(new Error('Must supply description'));
        }
        
        done();
    })

})

describe('associateToPublisher()', ()=>{
    test('Valid publisher and game', async done =>{
        expect.assertions(2);

        const game = await new Games();
        const publisher = await game.publisher;

        const newGame = await game.addNewGame(
            "title",
            "summary",
            "desc");
        const retreiveGame = await game.getGameByTitle("title");

        const publisherID = await publisher.addPublisher("Rockstar Games");

        expect(await game.associateToPublisher(retreiveGame.ID, publisherID))
            .toBe(true);
        
        expect(await game.getPublishers(retreiveGame.ID)).toMatchObject(
            {
                publishers:[1]
            }
        )

        done();
    })
    test('Error if gameID null', async done =>{
        expect.assertions(1);

        const game = await new Games();
        const publisher = await game.publisher;

        const newGame = await game.addNewGame(
            "title",
            "summary",
            "desc");
        const retreiveGame = await game.getGameByTitle("title");

        const publisherID = await publisher.addPublisher("Rockstar Games");

        await expect(game.associateToPublisher(null, publisherID))
            .rejects.toEqual(Error('Must supply gameID'));
        done();
    })

    test('Error if gameID NaN', async done =>{
        expect.assertions(1);

        const game = await new Games();
        const publisher = await game.publisher;

        const newGame = await game.addNewGame(
            "title",
            "summary",
            "desc");
        const retreiveGame = await game.getGameByTitle("title");

        const publisherID = await publisher.addPublisher("Rockstar Games");

        await expect(game.associateToPublisher("Not a number", publisherID))
            .rejects.toEqual(Error('Must supply gameID'));
        done();
    })

    test('Error if publisherID null', async done =>{
        expect.assertions(1);

        const game = await new Games();
        const publisher = await game.publisher;

        const newGame = await game.addNewGame(
            "title",
            "summary",
            "desc");
        const retreiveGame = await game.getGameByTitle("title");

        const publisherID = await publisher.addPublisher("Rockstar Games");

        await expect(game.associateToPublisher(retreiveGame.ID, null))
            .rejects.toEqual(Error('Must supply gameID'));
        done();
    })

    test('Error if publisherID NaN', async done =>{
        expect.assertions(1);

        const game = await new Games();
        const publisher = await game.publisher;

        const newGame = await game.addNewGame(
            "title",
            "summary",
            "desc");
        const retreiveGame = await game.getGameByTitle("title");

        const publisherID = await publisher.addPublisher("Rockstar Games");

        await expect(game.associateToPublisher(retreiveGame.ID, "Not a number"))
            .rejects.toEqual(Error('Must supply gameID'));
        done();
    })

    test('Error if publisher does not exist', async done =>{
        expect.assertions(1);

        const game = await new Games();
        const publisher = await game.publisher;

        const newGame = await game.addNewGame(
            "title",
            "summary",
            "desc");
        const retreiveGame = await game.getGameByTitle("title");

        const publisherID = await publisher.addPublisher("Rockstar Games");

        await expect(game.associateToPublisher(retreiveGame.ID, 3))
            .rejects.toEqual(Error('Publisher not found'));
        done();
    })

    test('Error if game does not exist', async done =>{
        expect.assertions(1);

        const game = await new Games();
        const publisher = await game.publisher;

        const newGame = await game.addNewGame(
            "title",
            "summary",
            "desc");
        const retreiveGame = await game.getGameByTitle("title");

        const publisherID = await publisher.addPublisher("Rockstar Games");

        await expect(game.associateToPublisher(4, publisherID))
            .rejects.toEqual(Error('Game not found'));
        done();
    })
})

describe('getPublishers()', ()=>{
    test('Valid gameID', async done =>{
        expect.assertions(1);

        const game = await new Games();
        const publisher = await game.publisher;

        const newGame = await game.addNewGame(
            "title",
            "summary",
            "desc");
        const retreiveGame = await game.getGameByTitle("title");
        const publisherID = await publisher.addPublisher("Rockstar Games");
        const publisherIDSecond = await publisher.addPublisher("Microsoft");
        await game.associateToPublisher(retreiveGame.ID, publisherID)
        await game.associateToPublisher(retreiveGame.ID, publisherIDSecond)
        
        expect(await game.getPublishers(retreiveGame.ID)).toMatchObject(
            {
                publishers:[1,2]
            }
        )


        done();
    })

    test('Error if gameID NaN', async done =>{
        expect.assertions(1);

        const game = await new Games();
        

        await expect(game.getPublishers("Not a number"))
            .rejects.toEqual(Error('Must supply gameID'));
        done();
    })

    test('Error if gameID null', async done =>{
        expect.assertions(1);

        const game = await new Games();
        

        await expect(game.getPublishers(null))
            .rejects.toEqual(Error('Must supply gameID'));
        done();
    })

    test('Error if game does not exist', async done =>{
        expect.assertions(1);

        const game = await new Games();
        

        await expect(game.getPublishers(4))
            .rejects.toEqual(Error('Game not found'));
        done();
    })
})



describe('deleteGameByID()', ()=>{
    test('Delete valid game', async done =>{
        expect.assertions(2);

        const game = await new Games();

        const newGame = await game.addNewGame(
            "title",
            "summary",
            "desc");
        const retreiveGame = await game.getGameByTitle("title");
        const deleteGame = await game.deleteGameByID(retreiveGame.ID);

        expect(deleteGame).toBe(true);

        await expect(game.getGameByTitle("title"))
            .rejects.toEqual(new Error('Game: "title" not found'));
        
        done();
    })

    test('Invalid nonexistant ID', async done =>{
        expect.assertions(1);

        const game = await new Games();

        await expect(game.deleteGameByID(0))
            .rejects.toEqual(new Error("ID doesn't exist"));

        done();
    })
    
    test('Invalid string ID', async done =>{
        expect.assertions(1);

        const game = await new Games();

        await expect(game.deleteGameByID("string"))
            .rejects.toEqual(new Error("Must supply ID"));

        done();
    })

    test('Invalid null ID', async done =>{
        expect.assertions(1);

        const game = await new Games();

        await expect(game.deleteGameByID(null))
            .rejects.toEqual(new Error("Must supply ID"));

        done();
    })
})

describe('updateGameByID()', () => {
    test('Update valid game _ title', async done =>{
        expect.assertions(2);

        const game = await new Games();
        const title = "Red";
        const summary = "A simple summary";
        const desc = "Lorem Ipsum and as such this is a game";

        const stringToUpdate = "No way! 2";

        const newGame = await game.addNewGame(title, summary, desc);
        const retreiveGame = await game.getGameByTitle(title);
        const updateGame = await game.updateGameByID(retreiveGame.ID,
            {title: stringToUpdate}
            );
        expect(updateGame).toBe(true);
        const retreiveUpdatedGame = await game.getGameByTitle(stringToUpdate);

        expect(retreiveUpdatedGame).toMatchObject(
            {
                ID: 1,
                title: stringToUpdate || '',
                summary: summary || '',
                desc: desc || ''
            }
        );

        done();
    })

    test('Error if invalid game _ title', async done =>{
        expect.assertions(1);

        const game = await new Games();
        const title = "Red";
        const summary = "A simple summary";
        const desc = "Lorem Ipsum and as such this is a game";

        const stringToUpdate = "";

        const newGame = await game.addNewGame(title, summary, desc);
        const retreiveGame = await game.getGameByTitle(title);
        await expect( game.updateGameByID(retreiveGame.ID,
            {title: stringToUpdate}
            )).rejects.toEqual(Error('Could not update field(s)'));

        done();
    })

    test('Update valid game _ summary', async done =>{
        expect.assertions(2);

        const game = await new Games();
        const title = "Red";
        const summary = "A simple summary";
        const desc = "Lorem Ipsum and as such this is a game";

        const stringToUpdate = "A new simple summary";

        const newGame = await game.addNewGame(title, summary, desc);
        const retreiveGame = await game.getGameByTitle(title);
        const updateGame = await game.updateGameByID(retreiveGame.ID,
            {summary: stringToUpdate}
            );
        expect(updateGame).toBe(true);
        const retreiveUpdatedGame = await game.getGameByTitle(title);

        expect(retreiveUpdatedGame).toMatchObject(
            {
                summary: stringToUpdate || '',
            }
        );

        done();
    })

    test('Error if invalid game _ summary', async done =>{
        expect.assertions(1);

        const game = await new Games();
        const title = "Red";
        const summary = "A simple summary";
        const desc = "Lorem Ipsum and as such this is a game";

        const stringToUpdate = "";

        const newGame = await game.addNewGame(title, summary, desc);
        const retreiveGame = await game.getGameByTitle(title);
        await expect( game.updateGameByID(retreiveGame.ID,
            {summary: stringToUpdate}
            )).rejects.toEqual(Error('Could not update field(s)'));

        done();
    })

    test('Update valid game _ desc', async done =>{
        expect.assertions(2);

        const game = await new Games();
        const title = "Red";
        const summary = "A simple summary";
        const desc = "Lorem Ipsum and as such this is a game";

        const stringToUpdate = "Lorem Ipsum and as such this is a game 2";

        const newGame = await game.addNewGame(title, summary, desc);
        const retreiveGame = await game.getGameByTitle(title);
        const updateGame = await game.updateGameByID(retreiveGame.ID,
            {desc: stringToUpdate}
            );
        expect(updateGame).toBe(true);
        const retreiveUpdatedGame = await game.getGameByTitle(title);

        expect(retreiveUpdatedGame).toMatchObject(
            {
                desc: stringToUpdate || '',
            }
        );

        done();
    })

    test('Error if invalid game _ desc', async done =>{
        expect.assertions(1);

        const game = await new Games();
        const title = "Red";
        const summary = "A simple summary";
        const desc = "Lorem Ipsum and as such this is a game";

        const stringToUpdate = "";

        const newGame = await game.addNewGame(title, summary, desc);
        const retreiveGame = await game.getGameByTitle(title);
        await expect( game.updateGameByID(retreiveGame.ID,
            {desc: stringToUpdate}
            )).rejects.toEqual(Error('Could not update field(s)'));

        done();
    })

    test('Error if invalid game _ ID', async done =>{
        expect.assertions(1);

        const game = await new Games();
        const title = "Red";
        const summary = "A simple summary";
        const desc = "Lorem Ipsum and as such this is a game";

        const stringToUpdate = "";

        const newGame = await game.addNewGame(title, summary, desc);
        const retreiveGame = await game.getGameByTitle(title);
        await expect( game.updateGameByID(20,
            {summary: stringToUpdate}
            )).rejects.toEqual(Error('Could not update field(s)'));

        done();
    })

    test('Error if duplicate title', async done =>{
        expect.assertions(1);

        const game = await new Games();
        const title = "Red";
        const summary = "A simple summary";
        const desc = "Lorem Ipsum and as such this is a game";

        const title2 = "Red Floor";
        const summary2 = "A game of Floors";
        const desc2 = "Lorem Ipsum and as such this is a game";

        const stringToUpdate = "Red Floor";

        const newGame = await game.addNewGame(title, summary, desc);
        await game.addNewGame(title2, summary2, desc2);
        const retreiveGame = await game.getGameByTitle(title2);
        await expect( game.updateGameByID(retreiveGame.ID,
            {title: stringToUpdate}
            )).rejects.toEqual(Error('Game: "'+stringToUpdate+'" already exists'));

        done();
    })

    test('Error if null ID', async done =>{
        expect.assertions(1);

        const game = await new Games();

        await expect( game.updateGameByID(null,null))
            .rejects.toEqual(Error('Must supply ID'));

        done();
    })

    test('Error if NaN ID', async done =>{
        expect.assertions(1);

        const game = await new Games();
        
        await expect( game.updateGameByID("string",null))
            .rejects.toEqual(Error('Must supply ID'));

        done();
    })
})

describe('getGameByTitle()', () => {
    test('Get valid game', async done =>{
        expect.assertions(1);

        const game = await new Games();
        const titleToTest = "Red";
        const summary = "A simple summary";
        const desc = "Lorem Ipsum and as such this is a game";

        const newGame = await game.addNewGame(titleToTest, summary, desc);
        const retreiveGame = await game.getGameByTitle(titleToTest);

        expect(retreiveGame).toMatchObject(
            {
                ID: 1,
                title: titleToTest || '',
                summary: summary || '',
                desc: desc || ''
            }
        );

        done();
    })

    test('Error if game does not exist', async done =>{
        expect.assertions(1);
        const game = await new Games();
        const title = "Red";
        await expect(game.getGameByTitle(title))
            .rejects.toEqual(Error('Game: "'+title+'" not found'));
        done();
    })
    
    test('Error if game is empty', async done =>{
        expect.assertions(1);
        const game = await new Games();

        await expect(game.getGameByTitle(''))
            .rejects.toEqual(Error("Must supply a valid title"));


        done();
    })

})

describe('getGameByID()', () => {
    test('Get valid game', async done =>{
        expect.assertions(1);

        const game = await new Games();
        const titleToTest = "Red";
        const summary = "A simple summary";
        const desc = "Lorem Ipsum and as such this is a game";

        const newGame = await game.addNewGame(titleToTest, summary, desc);
        const retreiveGameTitle = await game.getGameByTitle(titleToTest);
        const retreiveGame = await game.getGameByID(retreiveGameTitle.ID);

        expect(retreiveGame).toMatchObject(
            {
                ID: 1,
                title: titleToTest || '',
                summary: summary || '',
                desc: desc || ''
            }
        );

        done();
    })

    test('Error if game does not exist', async done =>{
        expect.assertions(1);
        const game = await new Games();
        
        await expect(game.getGameByID(0))
            .rejects.toEqual(Error('Game not found'));
        done();
    })
    
    test('Error if ID is null', async done =>{
        expect.assertions(1);
        const game = await new Games();
        await expect(game.getGameByID(null))
            .rejects.toEqual(Error("Must supply ID"));


        done();
    })

    test('Error if ID is NaN', async done =>{
        expect.assertions(1);
        const game = await new Games();
        await expect(game.getGameByID("string"))
            .rejects.toEqual(Error("Must supply ID"));


        done();
    })

})

describe('getGameByTitle()_returnObject', () => {
    test('setTitle() valid', async done=>{
        expect.assertions(1);

        const game = await new Games();

        const title = "Red";
        const summary = "A simple summary";
        const desc = "Lorem Ipsum and as such this is a game";

        const new_S = "A new title";

        const newGame = await game.addNewGame(title, summary, desc);
        let retreiveGame = await game.getGameByTitle(title);
        
        let re = retreiveGame.setTitle(new_S);
        
        expect(retreiveGame).toMatchObject(
            {
                title: new_S,
            }
        );

        done();
    })

    test('setTitle() empty', async done=>{
        expect.assertions(1);

        const game = await new Games();

        const title = "Red";
        const summary = "A simple summary";
        const desc = "Lorem Ipsum and as such this is a game";

        const newGame = await game.addNewGame(title, summary, desc);
        let retreiveGame = await game.getGameByTitle(title);
        
        try{
            retreiveGame.setTitle("");
        }catch(e){
            expect(e.message).toBe("Must supply title");
        }
        done();
    })
    

    test('setSummary() valid', async done=>{
        expect.assertions(1);

        const game = await new Games();

        const title = "Red";
        const summary = "A simple summary";
        const desc = "Lorem Ipsum and as such this is a game";

        const new_S = "A new summary";

        const newGame = await game.addNewGame(title, summary, desc);
        let retreiveGame = await game.getGameByTitle(title);
        
        let re = retreiveGame.setSummary(new_S);
        
        expect(retreiveGame).toMatchObject(
            {
                summary: new_S,
            }
        );

        done();
    })

    test('setSummary() empty', async done=>{
        expect.assertions(1);

        const game = await new Games();

        const title = "Red";
        const summary = "A simple summary";
        const desc = "Lorem Ipsum and as such this is a game";

        const newGame = await game.addNewGame(title, summary, desc);
        let retreiveGame = await game.getGameByTitle(title);
        
        try{
            retreiveGame.setSummary("");
        }catch(e){
            expect(e.message).toBe("Must supply summary");
        }
        done();
    })

    test('setDesc() valid', async done=>{
        expect.assertions(1);

        const game = await new Games();

        const title = "Red";
        const summary = "A simple summary";
        const desc = "Lorem Ipsum and as such this is a game";

        const new_S = "A new description";

        const newGame = await game.addNewGame(title, summary, desc);
        let retreiveGame = await game.getGameByTitle(title);
        
        let re = retreiveGame.setDesc(new_S);
        
        expect(retreiveGame).toMatchObject(
            {
                desc: new_S,
            }
        );

        done();
    })

    test('setDesc() empty', async done=>{
        expect.assertions(1);

        const game = await new Games();

        const title = "Red";
        const summary = "A simple summary";
        const desc = "Lorem Ipsum and as such this is a game";

        const newGame = await game.addNewGame(title, summary, desc);
        let retreiveGame = await game.getGameByTitle(title);
        
        try{
            retreiveGame.setDesc("");
        }catch(e){
            expect(e.message).toBe("Must supply description");
        }
        done();
    })
})

describe('getGameByID()_returnObject', () => {
    test('setTitle() valid', async done=>{
        expect.assertions(1);

        const game = await new Games();

        const title = "Red";
        const summary = "A simple summary";
        const desc = "Lorem Ipsum and as such this is a game";

        const new_S = "A new title";

        const newGame = await game.addNewGame(title, summary, desc);
        let retreiveGameTitle = await game.getGameByTitle(title);
        let retreiveGame = await game.getGameByID(retreiveGameTitle.ID);

        let re = retreiveGame.setTitle(new_S);
        
        expect(retreiveGame).toMatchObject(
            {
                title: new_S,
            }
        );

        done();
    })

    test('setTitle() empty', async done=>{
        expect.assertions(1);

        const game = await new Games();

        const title = "Red";
        const summary = "A simple summary";
        const desc = "Lorem Ipsum and as such this is a game";

        const newGame = await game.addNewGame(title, summary, desc);
        let retreiveGameTitle = await game.getGameByTitle(title);
        let retreiveGame = await game.getGameByID(retreiveGameTitle.ID);
        
        try{
            retreiveGame.setTitle("");
        }catch(e){
            expect(e.message).toBe("Must supply title");
        }
        done();
    })
    

    test('setSummary() valid', async done=>{
        expect.assertions(1);

        const game = await new Games();

        const title = "Red";
        const summary = "A simple summary";
        const desc = "Lorem Ipsum and as such this is a game";

        const new_S = "A new summary";

        const newGame = await game.addNewGame(title, summary, desc);
        let retreiveGameTitle = await game.getGameByTitle(title);
        let retreiveGame = await game.getGameByID(retreiveGameTitle.ID);
        
        let re = retreiveGame.setSummary(new_S);
        
        expect(retreiveGame).toMatchObject(
            {
                summary: new_S,
            }
        );

        done();
    })

    test('setSummary() empty', async done=>{
        expect.assertions(1);

        const game = await new Games();

        const title = "Red";
        const summary = "A simple summary";
        const desc = "Lorem Ipsum and as such this is a game";

        const newGame = await game.addNewGame(title, summary, desc);
        let retreiveGameTitle = await game.getGameByTitle(title);
        let retreiveGame = await game.getGameByID(retreiveGameTitle.ID);
        
        try{
            retreiveGame.setSummary("");
        }catch(e){
            expect(e.message).toBe("Must supply summary");
        }
        done();
    })

    test('setDesc() valid', async done=>{
        expect.assertions(1);

        const game = await new Games();

        const title = "Red";
        const summary = "A simple summary";
        const desc = "Lorem Ipsum and as such this is a game";

        const new_S = "A new description";

        const newGame = await game.addNewGame(title, summary, desc);
        let retreiveGameTitle = await game.getGameByTitle(title);
        let retreiveGame = await game.getGameByID(retreiveGameTitle.ID);
        
        let re = retreiveGame.setDesc(new_S);
        
        expect(retreiveGame).toMatchObject(
            {
                desc: new_S,
            }
        );

        done();
    })

    test('setDesc() empty', async done=>{
        expect.assertions(1);

        const game = await new Games();

        const title = "Red";
        const summary = "A simple summary";
        const desc = "Lorem Ipsum and as such this is a game";

        const newGame = await game.addNewGame(title, summary, desc);
        let retreiveGameTitle = await game.getGameByTitle(title);
        let retreiveGame = await game.getGameByID(retreiveGameTitle.ID);
        
        try{
            retreiveGame.setDesc("");
        }catch(e){
            expect(e.message).toBe("Must supply description");
        }
        done();
    })
})

describe('addNewGame()', () => {
    test('add a valid game', async done => {
        expect.assertions(1);
        
        const game = await new Games();
        const newGame = await game.addNewGame("Red", "A simple summary", "Lorem Ipsum and as such this is a game");
        expect(newGame).toBe(true);
    
		done();
    })
    
    test('add a duplicate game', async done =>{
        expect.assertions(1);
        
        const game = await new Games();
        await game.addNewGame("Red", "A simple summary", "Lorem Ipsum and as such this is a game");
        await expect(game.addNewGame("Red", "A simple summary", "Lorem Ipsum and as such this is a game"))
            .rejects.toEqual(Error('Game "Red" already exists'));
    
		done();
    })
    
    test('error if title empty', async done =>{
        expect.assertions(1);

        const game = await new Games();
        await expect(game.addNewGame('', 'Summary', 'Description'))
            .rejects.toEqual(Error('Must supply title'));

        done();
    })

    test('error if summary empty', async done =>{
        expect.assertions(1);

        const game = await new Games();
        await expect(game.addNewGame('Title', '', 'Description'))
            .rejects.toEqual(Error('Must supply summary'));

        done();
    })

    test('error if description empty', async done =>{
        expect.assertions(1);

        const game = await new Games();
        await expect(game.addNewGame('Title', 'Summary', ''))
            .rejects.toEqual(Error('Must supply description'));

        done();
    })
})

