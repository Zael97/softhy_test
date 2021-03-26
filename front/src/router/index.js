import { createRouter, createWebHashHistory } from 'vue-router';
import Pagos from '../views/Pagos/Pagos.vue';
import Estudiantes from '../views/Estudiantes/Estudiantes.vue';
import Reportes from '../views/Reportes/Reportes.vue';

const routes =[{
    path:'/estudiantes',
    name:'Estudiantes',
    component: Estudiantes
},{
    path:'/pagos',
    name:'Pagos',
    component:Pagos
},{
    path:'/reportes',
    name:'Reportes',
    component: Reportes
}]


export default createRouter({
    history: createWebHashHistory(),
    routes
});