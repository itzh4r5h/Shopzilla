const app = require('./app')

// Handling uncaught exception
process.on('uncaughtException',(err)=>{
    console.log(err.message);
    console.log('Shutting down the server due to uncaught exception');
    process.exit(1)
})


// connecting to database
const connectDatabase = require('./config/database')
connectDatabase()

const {startUserDeletionWorker} = require('./jobs/userDeletion.job')


app.listen(process.env.PORT,()=>{
    console.log(`Server is listening on http://localhost:${process.env.PORT}`);
    startUserDeletionWorker()
})
