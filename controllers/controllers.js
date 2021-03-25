const pool=require('../db');
exports.estudiante_post = async(req, res, next)=>{
    const filename = req.file.filename;
    const { nombre, ap_paterno, ap_materno, grado, edad }= req.body;
    pool.connect((err, client, done)=>{
        //const query ='call register('Anthony', 'Muñante', 'Chávez', 'segundo', '1995-11-06', '/uploads/avatar.png');'
        const query = 'CALL register($1, $2, $3, $4,$5, $6) returning *';
        const values =[nombre, ap_paterno, ap_materno, grado, edad, filename];
        client.query(query, values, (error, result)=>{
            done();
            if(error){
                res.status(400).json({error: error.message});
            }
            res.status(202).send({
                status: 'SUccessful',
                result: result.rows[0],
            });
        })
    })
}

exports.estudiante_delete = async(req, res, next)=>{

}

exports.grados_get = async(req, res, next)=>{
    pool.connect((err,client,done)=>{
        const query='SELECT * FROM grados';
        client.query(query, (error, result)=>{
            done();
            if(error){
                res.status(400).json({error: error.message});
            }
            if(result.rows<'1'){
                   res.status(404).send({status: 'Failed',
                   message: 'No student information found'}); 
            }else{
                res.status(200).send({status: 'Successful',
                message: 'Students Information retrieved',
                students: result.rows});
            }  
        })
    });
}

exports.reportes_get=async (req, res, next)=>{

}