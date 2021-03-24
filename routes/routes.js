const controllers = require('../controllers/controllers');
const { Router } = require('express');
const router = Router();



router.post('/estudiantes',controllers.estudiantes_post);
router.delete('/estudiantes', controllers.estudiantes_delete);
router.get('/grados',controllers.grados_get);
router.get('/reporte', controllers.reportes_get);



module.exports=router;