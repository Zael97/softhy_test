const pg = require('pg');

const config = {
    user: 'zael', //this is the db user credential
    database: 'postgres',
    password: 'scorpio1995-',
    port: 5432,
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000,
  };


  const pool = new pg.Pool(config);

  pool.on('connect', ()=>{
      console.log('connected to the database');
  });
  pool.on('remove', ()=>{
      console.log('cliente removed');
      process.exit(0);
  });


  module.exports=pool;