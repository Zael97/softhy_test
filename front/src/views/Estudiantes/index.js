import Datepicker from 'vue3-datepicker';
import { ref } from 'vue';
import axios from 'axios';
export default {
    components: {
        'datepicker': Datepicker
    },
    data: () => {
        return {
            selected: ref(new Date()),
            students: [],
            avatar: 'default-avatar.png',
            search: '',
            grados: [],
            user: {
                id: 0,
                nombre: 'Nombre',
                ap_paterno: 'Apellido',
                grado: 'Grado',
                edad: 'Edad',
                avatar: "http://localhost:9000/imgs/default-avatar.png",
                formatedDate: ''
            },
            FILE: null
        }
    },
    beforeMount() {
        axios
            .get('http://localhost:9000/estudiantes')
            .then(response => this.students = response.data.students);
        axios
            .get('http://localhost:9000/grados')
            .then(response => this.grados = response.data.grados);
    },
    computed: {
        filteredList() {
            return this.students.filter(student => {
                if (student.nombre.toLowerCase().includes(this.search.toLowerCase()) || student.ap_paterno.toLowerCase().includes(this.search.toLowerCase()) || student.ap_materno.toLowerCase().includes(this.search.toLowerCase())) {
                    return student;
                }
            });
        },
        formatDateDynamically() {
            return this.formatDate(this.selected);
        }
    },
    methods: {
        setUser(event) {
            let id = event.target.parentNode.childNodes[0].textContent;
            let student = this.students.find(element => element.id == id);
            this.user.id = student.id;
            this.user.nombre = student.nombre;
            this.user.ap_paterno = student.ap_paterno;
            this.user.grado = student.grado;
            this.user.edad = student.edad;
            this.user.avatar = `http://localhost:9000/imgs/${student.avatar}`;
        },
        deleteUser() {
            axios
                .delete(`http://localhost:9000/estudiantes?id=${this.user.id}`)
                .then(() => {
                    location.reload();
                });
        },
        formatDate(d) {
            let currentTime = new Date();
            let datePicker = new Date(d);
            let months = this.monthDiff(datePicker, currentTime);
            return this.monthsToYears(months);
        },
        monthDiff(d1, d2) {
            var months;
            months = (d2.getFullYear() - d1.getFullYear()) * 12;
            months -= d1.getMonth();
            months += d2.getMonth();
            return months <= 0 ? 0 : months;
        },
        monthsToYears(m) {
            let years = Math.floor(m / 12);
            let months = m % 12;
            let result_year = 'años';
            let result_month = 'meses';
            if (years == 1) {
                result_year = 'año';
            }
            if (months == 1) {
                result_month = 'mes';
            }
            return `${years} ${result_year} ${months} ${result_month}`;
        },
        onSubmit(event) {
            event.preventDefault();     
            let nombreValido=false;
            let paternoValido=false;
            let maternoValido=false;
            let gradoValido=false;
            const formData = new FormData();
            if((!event.target.nombre.value.trim()) || event.target.nombre.value.trim().length > 40 ){
                event.target.nombre.classList.add('is-invalid');
            }else{
                nombreValido=true;
                event.target.nombre.classList.remove('is-invalid');
                event.target.nombre.classList.add('is-valid');
            }
            if((!event.target.ap_paterno.value.trim()) || event.target.ap_paterno.value.trim().length > 40){
                event.target.ap_paterno.classList.add('is-invalid');
            }else{
                paternoValido=true;
                event.target.ap_paterno.classList.remove('is-invalid');
                event.target.ap_paterno.classList.add('is-valid');
            }
            if((!event.target.ap_materno.value.trim()) || event.target.ap_materno.value.trim().length > 40){
                event.target.ap_materno.classList.add('is-invalid');
            }else{
                maternoValido=true;
                event.target.ap_materno.classList.remove('is-invalid');
                event.target.ap_materno.classList.add('is-valid');
            }
            if(event.target.grado.value=='Grado'){
                event.target.grado.classList.add('is-invalid');
            }else{
                gradoValido=true;
                event.target.grado.classList.remove('is-invalid');
                event.target.grado.classList.add('is-valid');
            }
            if(!event.target.avatar.value){
                formData.append('avatar',null);
            }else{
                formData.append('avatar', this.FILE, this.FILE.name);
            }
            if(nombreValido && paternoValido && maternoValido && gradoValido){
                formData.append('nombre', event.target.nombre.value);
                formData.append('ap_paterno', event.target.ap_paterno.value);
                formData.append('ap_materno', event.target.ap_materno.value);
                formData.append('grado', event.target.grado.value);
                formData.append('edad', event.target.edad.value);
                axios.post('http://localhost:9000/estudiantes', formData, {}).then(res => {
                    console.log(res);
                })
            }
        },
        onFileUpload(event) {
            this.FILE = event.target.files[0];
        }
    }
}