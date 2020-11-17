// Full reference 
const ShoppingListService = require("../src/shopping-list-service");
const knex = require("knex");

describe(`Shopping list service object`, function () {
  let db;
  let testItems = [
    {
      id: 1,
      name: 'Fish tricks', 
      price: "13.10", 
      category: 'Main',
      checked: false,  
      date_added: new Date("2100-05-22T16:28:32.615Z")
    },
    {
      id: 2,
      name: 'Not Dogs', 
      price: "4.99", 
      category: 'Snack',
      checked: true,  
      date_added: new Date("2100-05-22T16:28:32.615Z")
    },
    {
      id: 3,
      name: 'Bluffalo Wings',
      price: "5.50", 
      category:  'Snack',
      checked: false,  
      date_added: new Date("2100-05-22T16:28:32.615Z")
    },
  ];
  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL,
    });
  });

  before(() => db("shopping_list").truncate());
  afterEach(() => db("shopping_list").truncate());
  after(() => db.destroy());

  context(`Given 'shopping_list' has data`, () => {
    beforeEach(() => {
      return db.into("shopping_list").insert(testItems);
    });

    it(`getAllShoppingItems() resolves all articles from 'shopping_list' table`, () => {
      // test that ShoppingListService.getAllShoppingItems gets data from table
      return ShoppingListService.getAllShoppingItems(db).then((actual) => {
        expect(actual).to.eql(
          testItems.map((item) => ({
            ...item,
            date_added: new Date(item.date_added),
          }))
        );
      });
    });

    it(`getById() resolves an item by id from 'shopping_list' table`, () => {
      const thirdId = 3;
      const thirdTestArticle = testItems[thirdId - 1];
      return ShoppingListService.getById(db, thirdId).then((actual) => {
        expect(actual).to.eql({
          id: thirdId,
          name: thirdTestArticle.name,
          price: thirdTestArticle.price,
          category: thirdTestArticle.category,
          checked: thirdTestArticle.checked,
          date_added: thirdTestArticle.date_added,
        });
      });
    });

    it(`deleteItem() removes an item by id from 'shopping_list' table`, () => {
      const articleId = 3;
      return ShoppingListService.deleteItem(db, articleId)
        .then(() => ShoppingListService.getAllShoppingItems(db))
        .then((allArticles) => {
          // copy the test articles array without the "deleted" article
          const expected = testItems.filter(
            (article) => article.id !== articleId
          );
          expect(allArticles).to.eql(expected);
        });
    });

    it(`updateItem() updates an item from the 'shopping_list' table`, () => {
      const idOfArticleToUpdate = 3;
      const newArticleData =     {
      name: ' Wings',
      price: "5.00", 
      category:  'Lunch',
      checked: false,  
      date_added: new Date("2100-05-22T16:28:32.615Z")
    };
      return ShoppingListService.updateItem(
        db,
        idOfArticleToUpdate,
        newArticleData
      )
        .then(() => ShoppingListService.getById(db, idOfArticleToUpdate))
        .then((article) => {
          expect(article).to.eql({
            id: idOfArticleToUpdate,
            ...newArticleData,
          });
        });
    });
  });

  context(`Given 'shopping_list' has no data`, () => {
    it(`getAllShoppingItems() resolves an empty array`, () => {
      return ShoppingListService.getAllShoppingItems(db).then((actual) => {
        expect(actual).to.eql([]);
      });
    });

    it(`insertItem() inserts an item and resolves the article with an 'id'`, () => {
      const newArticle = {
      name: 'Wings',
      price: "5.00", 
      category:  'Lunch',
      checked: false,  
      date_added: new Date("2100-05-22T16:28:32.615Z")
    };
      return ShoppingListService.insertItem(db, newArticle).then((actual) => {
        expect(actual).to.eql({
      id: 1,
      name: newArticle.name,
      price: newArticle.price, 
      category:  newArticle.category,
      checked: newArticle.checked,  
      date_added: newArticle.date_added
        });
      });
    });
  });
});
