import express from 'express'
import { Liquid } from 'liquidjs'

const app = express()
const engine = new Liquid()

app.use(express.static('public'))
app.engine('liquid', engine.express()) 
app.set('views', './views')

app.get('/', async function (request, response) {
  const pizzasResponse = await fetch('https://fdnd-agency.directus.app/items/demo_pizzas?sort[]=-ordered&limit=4')
  const pizzasJSON = await pizzasResponse.json()

  response.render('index.liquid', {pizzas: pizzasJSON.data})
})

app.get('/pizzas', async function (request, response) {
  const params = new URLSearchParams()

  const type = request.query.type || ''
  const sort = request.query.sort || ''   
  
  let sortField = 'name' 

  if (sort === 'low-high') {
    sortField = 'price'      
  } else if (sort === 'high-low') {
    sortField = '-price'    
  }

  params.set('sort', sortField)

  if (type) {
    params.set('filter[type][_eq]', type)
  }

  params.set('meta', 'total_count,filter_count')

  const url = 'https://fdnd-agency.directus.app/items/demo_pizzas?' + params.toString()
  const pizzasResponse = await fetch(url)
  const pizzasJSON = await pizzasResponse.json()
  
  response.render('pizzas.liquid', {
    pizzas: pizzasJSON.data,
    selectedType: type,
    selectedSort: sort,
    meta: pizzasJSON.meta
  })
})

app.get('/pizzas/:slug', async function (request, response) { 
  const pizzaResponse = await fetch('https://fdnd-agency.directus.app/items/demo_pizzas?filter[slug][_eq]=' + request.params.slug)
  const pizzaJSON = await pizzaResponse.json()

  response.render('pizza.liquid', {pizza: pizzaJSON.data[0]})
})

app.set('port', process.env.PORT || 8001)
app.listen(app.get('port'), function () {
  console.log(`Application started on http://localhost:${app.get('port')}`)
})
