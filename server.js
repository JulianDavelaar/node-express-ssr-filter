import express from 'express'
import { Liquid } from 'liquidjs'

const app = express()
const engine = new Liquid()

app.use(express.static('public'))
app.engine('liquid', engine.express()) 
app.set('views', './views')

// URL's & Endpoints
// HOME (/)
// https://fdnd-agency.directus.app/items/demo_pizzas?sort[]=-ordered&limit=4

// PIZZAS (/pizzas)
// https://fdnd-agency.directus.app/items/demo_pizzas?sort=name&meta=total_count,filter_count

// PIZZAS FILTERED (/pizzas?type=vegetarisch)
// https://fdnd-agency.directus.app/items/demo_pizzas?sort=name&meta=total_count,filter_count&filter[type][_eq]=vegetarisch

// PIZZA (/pizzas/caprese-captioni)
// https://fdnd-agency.directus.app/items/demo_pizzas?filter[slug][_eq]=caprese-captioni

app.get('/', async function(request, response){
  const pizzasResponse = await fetch('https://fdnd-agency.directus.app/items/demo_pizzas?sort=-ordered&limit=4')
  const pizzasJSON = await pizzasResponse.json()

  response.render('index.liquid', { pizza:pizzasResponse })

})














// URL's & Endpoints
// HOME (/)
// https://fdnd-agency.directus.app/items/demo_pizzas?sort[]=-ordered&limit=4
// app.get('/', async function(request, response){
//   const pizzasResponse = await fetch('https://fdnd-agency.directus.app/items/demo_pizzas?sort=-ordered&limit=4')
//   const pizzasJson = await pizzasResponse.json()

//   response.render('index.liquid', { pizzas:pizzasJson.data } )
// })

// PIZZAS (/pizzas)
// https://fdnd-agency.directus.app/items/demo_pizzas?sort=name&meta=total_count,filter_count

// PIZZAS FILTERED (/pizzas?type=vegetarisch)
// 

// app.get('/pizzas', async function(request, response){
//   const params = new URLSearchParams()
  
//   params.set('sort', 'name')
//   params.set('meta', 'total_count,filter_count')

//   if (request.query.type) {
//     params.set('filter[type][_eq]', request.query.type)
//   }

//   const pizzasResponse = await fetch('https://fdnd-agency.directus.app/items/demo_pizzas?' + params.toString())
//   const pizzasJSON = await pizzasResponse.json()
  
//   response.render('pizzas.liquid', {pizzas: pizzasJSON.data, selectedType: request.query.type || '', meta: pizzasJSON.meta})
// })

// PIZZA (/pizzas/caprese-captioni)
// https://fdnd-agency.directus.app/items/demo_pizzas?filter[slug][_eq]=caprese-captioni
// app.get('/pizzas/:slug', async function(request, response){
//   const pizzaResponse = await fetch('https://fdnd-agency.directus.app/items/demo_pizzas?filter[slug][_eq]=' + request.params.slug)
//   const pizzaJson = await pizzaResponse.json()

//   response.render('pizza.liquid', { pizza:pizzaJson.data[0] } )
// })

app.set('port', process.env.PORT || 8001)
app.listen(app.get('port'), function () {
  console.log(`Application started on http://localhost:${app.get('port')}`)
})
