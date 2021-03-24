const pool=require('../db');
exports.estudiantes_post = async(req, res, next)=>{
}

exports.estudiantes_delete = async(req, res, next)=>{

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