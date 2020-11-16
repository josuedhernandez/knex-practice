const ShoppingListService = {
  getAllArticles(knex) {
    return knex.select("*").from("shopping_list");
  },
  insertArticle(knex, newItem) {
    return knex
      .insert(newItem)
      .into("shopping_list")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  getById(knex, id) {
    return knex.from("shopping_list").select("*").where("id", id).first();
  },
  deleteArticle(knex, id) {
    return knex("shopping_list").where({ id }).delete();
  },
   updateArticle(knex, id, newItemFields) {
   return knex('shopping_list')
     .where({ id })
     .update(newItemFields)
 },
};

module.exports = ShoppingListService;
