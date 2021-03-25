const controllers = require('../controllers/controllers');
const { Router } = require('express');
const router = Router();
const multer = require('multer');
const upload = multer({dest:'../uploads/'});


router.post('/estudiante',upload.single('avatar'),controllers.estudiante_post);
router.delete('/estudiante', controllers.estudiante_delete);
router.get('/grados',controllers.grados_get);
router.get('/reporte', controllers.reportes_get);



module.exports=router;