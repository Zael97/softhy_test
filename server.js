const app = require('./app');
const port = process.env.port || 9000;


app.listen(port, ()=>{
    console.log(`Server running at port ${port}. Press CTrl+C to stop.`);
});