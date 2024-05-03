const mongoose = require('mongoose')




const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://dejentesfaldet16:${password}@cluster0.chkqbww.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: name,
  number: number
})

if (process.argv.length===5) {
    person.save().then(result => {
        console.log('person saved')
        mongoose.connection.close()
      })

  
  }else if(process.argv.length === 3){
    Person.find({}).then(result => {
        result.forEach(person =>{
            console.log(person)
        })
        mongoose.connection.close()
    })

  }else{
    console.log('give password as argument')
    process.exit(1)
  }

  


 
