const pool = require('../db');
const Excel = require('exceljs');
exports.estudiantes_post = async (req, res, next) => {
    const { nombre, ap_paterno, ap_materno, grado, edad } = req.body;
    let filename = 'default-avatar.png';
    if (req.file) {
        filename = req.file.filename;
    }
    pool.connect((err, client, done) => {
        //const query ='call register('Anthony', 'Muñante', 'Chávez', 'segundo', '1995-11-06', '/uploads/avatar.png');'
        const query = 'SELECT register($1, $2, $3, $4,$5, $6)';
        const values = [nombre, ap_paterno, ap_materno, grado, edad, filename];
        client.query(query, values, (error, result) => {
            if (error) {
                res.status(400).json({ error: error.message });
            }
            let id = result.rows[0].register;
            res.status(202).json({
                status: 'Successful',
                result: {
                    id, nombre, ap_paterno, ap_materno, grado, edad, filename
                },
            });
        })
    })
}

exports.estudiantes_delete = async (req, res, next) => {
    const id = req.query.id;
    pool.connect((err, client, done) => {
        const query = 'DELETE FROM estudiantes WHERE id = $1';
        const values = [id,];
        client.query(query, values, (error, result) => {
            //done();
            console.log(query);
            if (error) {
                res.status(400).json({ error: error.message });
            }
            res.status(202).json({
                status: 'Successful'
            });
        })
    });
}

exports.grados_get = async (req, res, next) => {
    pool.connect((err, client, done) => {
        const query = 'SELECT * FROM grados';
        client.query(query, (error, result) => {
            //done();
            if (error) {
                res.status(400).json({ error: error.message });
            }
            if (result.rows < '1') {
                res.status(404).json({ status: 'Failed' });
            } else {
                res.status(200).json({
                    status: 'Successful',
                    grados: result.rows
                });
            }
        })
    });
}

exports.reporte_get = async (req, res, next) => {
    let query = "select concat(es.nombre, ' ',es.ap_paterno ,' ',es.ap_materno ) as estudiante, es.grado, mo.tipo as pension, mo.monto as monto from estudiantes as es inner join movimientos as mo on es.id=mo.estudiante";
    pool.connect((err, client, done) => {
        client.query(query, (error, result) => {
            if (error) {
                res.status(400).json({ error: error.message });
            }
            if (result.rows < '1') {
                res.status(404).json({
                    status: 'Failed'
                });
            } else {
                const workbook = new Excel.Workbook();
                const workSheet = workbook.addWorksheet('Reporte');
                workSheet.columns = [
                    { header: 'Estudiante', key: 'estudiante', width: 40 },
                    { header: 'Grado - nivel', key: 'grado', width: 10 },
                    { header: 'Pensión', key: 'pension', width: 10 },
                    { header: 'Monto', key: 'monto', width: 10 }
                ]
                workSheet.addRows(result.rows);
                res.setHeader(
                    "Content-Type",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                );
                res.setHeader(
                    "Content-Disposition",
                    "attachment; filename=" + "reporte.xlsx"
                );
                return workbook.xlsx.write(res).then(() => {
                    res.status(200).end();
                }).catch(e => {
                    res.status(400).json({ error: e.message });
                });
            }
        })
    })
}
exports.estudiantes_get = async (req, res, next) => {
    const id = req.query.id;
    let query = 'SELECT * FROM estudiantes';
    const values = []
    if (id) {
        query = 'SELECT * FROM estudiantes WHERE id = $1';
        values.push(id);
    }
    pool.connect((err, client, done) => {
        client.query(query, values, (error, result) => {
            if (error) {
                res.status(400).json({ error: error.message });
            }
            if (result.rows < '1') {
                res.status(404).json({
                    status: 'Failed'
                });
            } else {
                res.status(200).json({
                    status: 'Successful',
                    students: result.rows,
                });
            }
        })
    });
}