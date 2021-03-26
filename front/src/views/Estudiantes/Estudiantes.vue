<template>
  <div>
    <div class="container-fluid d-flex justify-content-between mt-3">
      <p class="h3 ps-5">Estudiantes</p>
      <!-- Button trigger modal -->
      <!-- Button trigger modal -->
      <button
        type="button"
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#staticBackdrop"
      >
        Nuevo
      </button>
    </div>
    <div class="container-fluid mt-3 d-flex align-items-center">
      <input
        type="email"
        class="form-control w-75 me-3 ms-5"
        id="exampleFormControlInput1"
        placeholder="Buscar"
        v-model="search"
      />
      <i class="fas fa-search fa-lg"></i>
    </div>
    <div class="container-fluid mt-3">
      <div class="row">
        <div class="col-12 col-md-3 d-flex flex-column align-items-center pt-5">
          <img
            :src="user.avatar"
            class="rounded-circle d-block w-50"
            alt="User avatar"
          />
          <input type="hidden" id="studentId" />
          <p>{{ user.nombre + " " + user.ap_paterno }}</p>
          <p>{{ formatDate(user.edad) }}</p>
          <p>{{ user.grado }}</p>
          <button
            type="button"
            class="btn btn-danger"
            data-bs-toggle="modal"
            data-bs-target="#staticBackdrop2"
          >
            Borrar <i class="fas fa-trash"></i>
          </button>
        </div>
        <div class="col-12 col-md-9 pt-4 pe-5">
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">Id</th>
                <th scope="col">Nombre</th>
                <th scope="col">Apellido Paterno</th>
                <th scope="col">Apellido Materno</th>
                <th scope="col">Grado</th>
                <th scope="col">Edad</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="student in filteredList"
                :key="student.id"
                v-on:click="setUser"
              >
                <th scope="row">{{ student.id }}</th>
                <td>{{ student.nombre }}</td>
                <td>{{ student.ap_paterno }}</td>
                <td>{{ student.ap_materno }}</td>
                <td>{{ student.grado }}</td>
                <td>{{ formatDate(student.edad) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- Modal2 -->
    <div
      class="modal fade"
      id="staticBackdrop2"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="staticBackdropLabel2"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel2">Confirmación</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            Seguro que desea borrar al estudiante?
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              No
            </button>
            <button
              type="button"
              class="btn btn-primary"
              v-on:click="deleteUser()"
            >
              Sí
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal -->
    <div
      class="modal fade"
      id="staticBackdrop"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">Modal title</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <p>Nuevo Estudiante</p>
            </div>
            <form @submit.prevent="onSubmit" class="needs-validation g-3">
              <div class="row">
                <div class="col-6">
                  <div class="mt-3">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Ingresar Nombre"
                      name="nombre"
                    />
                    <div class="invalid-feedback">40 caracteres</div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="mt-3">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Apellido Paterno"
                      name="ap_paterno"
                    />
                    <div class="invalid-feedback">40 caracteres</div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-6">
                  <div class="mt-3">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Apellido Materno"
                      name="ap_materno"
                    />
                    <div class="invalid-feedback">40 caracteres</div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="mt-3">
                    <select
                      class="form-select"
                      aria-label="Default select example"
                      name="grado"
                    >
                      <option selected>Grado</option>
                      <option
                        v-for="grado in grados"
                        :value="grado.nombre"
                        :key="grado.orden"
                        >{{ grado.nombre }}</option
                      >
                    </select>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-6">
                  <div class="mt-3">
                    <datepicker
                      class="form-control"
                      v-model="selected"
                      name="edad"
                      @change="formatDateDynamically"
                    />
                  </div>
                </div>
                <div class="col-6">
                  <div class="mt-3">
                    <input
                      type="text"
                      v-model="formatDateDynamically"
                      class="form-control"
                      readonly
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="mt-3">
                    <input
                      class="form-control"
                      name="avatar"
                      type="file"
                      id="avatar"
                      @change="onFileUpload"
                    />
                  </div>
                </div>
              </div>
              <button class="btn btn-primary mt-3">
                Agregar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./index.js"></script>
<style scoped>
@import "./styles.css";
</style>
