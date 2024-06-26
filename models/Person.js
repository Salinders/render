const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error =>{
    console.log('error connecting to database', error.message)
  })

const personSchema = new mongoose.Schema({
    name: {
    type:String,
    minLength: 5,
    required: true
    },

    number: {
      type: String,
      minLength: 8,
      required:true,
      validate: {
        validator:function(v){
            return /\d{3}|d{2}-\d{+}/.test(v);
        }
      },
    },
  })

  personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
  


module.exports = mongoose.model('Person', personSchema)