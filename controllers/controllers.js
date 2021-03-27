const pool = require('../db');
const Excel = require('exceljs');
exports.estudiantes_post = async (req, res, next) => {
    const { nombre, ap_paterno, ap_materno, grado, edad } = req.body;
    let avatar = 'default-avatar.png';
    if (req.file) {
        avatar = req.file.filename;
    }
    pool.connect((err, client, done) => {
        const query = 'SELECT registrar_estudiante($1, $2, $3, $4,$5, $6)';
        const values = [nombre, ap_paterno, ap_materno, grado, edad, avatar];
        client.query(query, values, (error, result) => {
            if (error) {
                res.status(400).json({ error: error.message });
            }
            let id = result.rows[0].registrar_estudiante;
            res.status(202).json({
                status: 'Successful',
                result: {
                    id, nombre, ap_paterno, ap_materno, grado, edad, avatar
                },
            });
        })
    })
}

exports.estudiantes_delete = async (req, res, next) => {
    const nid_persona = req.query.id;
    pool.connect((err, client, done) => {
        const query = "DELETE FROM persona WHERE nid_persona = $1";
        const values = [nid_persona,];
        client.query(query, values, (error, result) => {
            //done();
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
        const query = "SELECT concat(gra.desc_grado,'-',gra.nivel) AS nombre, gra.nid_grado AS orden FROM grado AS gra ORDER BY orden ASC";
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

/*exports.reporte_get = async (req, res, next) => {
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
}*/
exports.estudiantes_get = async (req, res, next) => {
    const nid_persona = req.query.id;
    let query = "SELECT per.nid_persona AS id, per.nom_persona AS nombre, per.ape_pate_pers AS ap_paterno, per.ape_mate_pers AS ap_materno, concat(gra.desc_grado,'-',gra.nivel) AS grado, PER.fecha_naci AS edad, per.foto_ruta AS avatar FROM persona AS per INNER join grado AS gra ON per.nid_grado =gra.nid_grado ORDER BY nid_persona ASC";
    const values = []
    if (nid_persona) {
        //query = 'SELECT nid_persona AS id, nom_persona AS nombre, ape_pate_pers AS ap_paterno, ape_mate_pers AS ap_materno,  FROM estudiantes WHERE id = $1';
        query ="SELECT per.nid_persona AS id, per.nom_persona AS nombre, per.ape_pate_pers AS ap_paterno, per.ape_mate_pers AS ap_materno, concat(gra.desc_grado,'-',gra.nivel) AS grado, per.fecha_naci AS edad, per.foto_ruta AS avatar FROM persona AS per INNER join grado AS gra ON per.nid_grado =gra.nid_grado WHERE nid_persona = $1 ORDER BY nid_persona ASC";
        values.push(nid_persona); 
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