require("dotenv").config();
const knex = require("knex");

console.log(process.env.DB_URL);
const knexInstance = knex({
  client: "pg",
  connection: process.env.DB_URL,
});

/** Uncomment to get all items that contain text
 * A function that takes one parameter for searchTerm which will be any string
 * The function will query the shopping_list table using Knex methods and select
 * the rows which have a name that contains the searchTerm using a case insensitive match.
 */
function searchByName(searchTerm) {
  knexInstance
    .select("id", "name", "price", "date_added", "checked", "category")
    .from("shopping_list")
    .where("name", "ILIKE", `%${searchTerm}%`)
    .then((result) => {
      console.log(result);
    });
}
// searchByName("beef");

/** Get all items paginated
 * A function that takes one parameter for pageNumber which will be a number
 * The function will query the shopping_list table using Knex methods and
 * select the pageNumber page of rows paginated to 6 items per page.
 */
function paginateProducts(pageNumber) {
  const productsPerPage = 6;
  const offset = productsPerPage * (pageNumber - 1);
  knexInstance
    .select("id", "name", "price", "date_added", "checked", "category")
    .from("shopping_list")
    .limit(productsPerPage)
    .offset(offset)
    .then((result) => {
      console.log(result);
    });
}
// paginateProducts(2)

/**
 * Get all items added after date
 * A function that takes one parameter for daysAgo which will be a number
 * representing a number of days.
 * This function will query the shopping_list table using Knex methods and
 * select the rows which have a date_added that is greater than the daysAgo.
 */
function itemsAddedNumberOfDaysAgo(daysAgo) {
  knexInstance
    .select("id", "name", "price", "date_added", "checked", "category")
    .where(
      "date_added",
      ">",
      knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
    )
    .from("shopping_list")
    .orderBy([{ column: "date_added", order: "DESC" }])
    .then((result) => {
      console.log(result);
    });
}
// itemsAddedNumberOfDaysAgo(10);

/** Get the total cost for each category
 * A function that takes no parameters
 * The function will query the shopping_list table using Knex methods
 * and select the rows grouped by their category and showing the total
 * price for each category.
 */
function totalCostPerCatergory() {
  knexInstance
    .select("category")
    .sum("price as total_price")
    .from("shopping_list")
    .groupBy("category")
    .then((result) => {
      console.log(result);
    });
}
totalCostPerCatergory()