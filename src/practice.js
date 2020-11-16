require("dotenv").config();
const knex = require("knex");

console.log(process.env.DB_URL);
const knexInstance = knex({
  client: "pg",
  connection: process.env.DB_URL,
});

console.log("knex and driver installed correctly");

// const q1 = knexInstance('amazong_products').select('*').toQuery()
// const q2 = knexInstance.from('amazong_products').select('*').toQuery()

// console.log('q1:', q1)
// console.log('q2:', q2)

// knexInstance
//   .select('product_id', 'name', 'price', 'category')
//   .from('amazong_products')
//   .where({ name: 'Point of view gun' })
//   .first()
//   .then(result => {
//     console.log(result)
//   })

//   const qry = knexInstance
//   .select('product_id', 'name', 'price', 'category')
//   .from('amazong_products')
//   .where({ name: 'Point of view gun' })
//   .first()
//   .toQuery()
//   // .then(result => {
//   //   console.log(result)
//   // })

// console.log(qry)

function searchByProduceName(searchTerm) {
  knexInstance
    .select('product_id', 'name', 'price', 'category')
    .from('amazong_products')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
      console.log(result)
    })
}

// searchByProduceName('holo')

function paginateProducts(page) {
  const productsPerPage = 10
  const offset = productsPerPage * (page - 1)
  knexInstance
    .select('product_id', 'name', 'price', 'category')
    .from('amazong_products')
    .limit(productsPerPage)
    .offset(offset)
    .then(result => {
      console.log(result)
    })
}

// paginateProducts(2)

 function getProductsWithImages() {
  knexInstance
    .select('product_id', 'name', 'price', 'category', 'image')
    .from('amazong_products')
    .whereNotNull('image')
    .then(result => {
      console.log(result)
    })
}

getProductsWithImages()
