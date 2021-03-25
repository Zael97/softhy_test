const controllers = require('../controllers/controllers');
const { Router } = require('express');
const router = Router();
const multer = require('multer');
const upload = multer({dest:'uploads/imgs/'});


router.post('/estudiantes',upload.single('avatar'),controllers.estudiantes_post);
router.delete('/estudiantes', controllers.estudiantes_delete);
router.get('/estudiantes', controllers.estudiantes_get);
router.get('/grados',controllers.grados_get);
router.get('/reporte', controllers.reporte_get);



module.exports=router;