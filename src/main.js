//CON TABLA
//Variables para jalar data
const allCohortsURL = '../data/cohorts.json';
const allUsersURL = '../data/cohorts/lim-2018-03-pre-core-pw/users.json';
const allProgressURL = '../data/cohorts/lim-2018-03-pre-core-pw/progress.json';
const allCohorts = [];
const allUsers = [];
const allProgress = [];
let currentCohort;
let users;
let progress;
let cohorts;
let courses;
let search;
//Variable para tabla
const mytable = document.getElementById('mytable');
//Variable para combobox Cohorts
const selectCohorts = document.getElementById('selectorOfCohorts');
//Variables para ocultar y mostrar contenedor
const home = document.getElementById('home');
const menu_cohorts = document.getElementById('menu_cohorts');
const listProgress = document.getElementById('containerListProgress');
const titleListStudent = document.getElementById('titleListStudent');
const containerListStudents = document.getElementById('listStudents');
const contenido = document.getElementById("contenido");
//Variable para las funciones
let searchName = document.getElementById('searchName');
const optionOrdenar = document.getElementById('ord');

const options = {
  cohort: null,
  cohortData: {
    users: null,
    progress: null
  },
  orderBy: 'nombre',
  orderDirection: 'asc',
  search: '',
}

//Dando funcionalidad a HOME del menú, para que muestre los graficos (primer div "contenido")
home.addEventListener('click', (e) => {
  e.preventDefault();
  containerListStudents.style.display = "none";
  contenido.style.display = "block";
});
//Dando funcionalidad a HOME del menú, para que muestre los graficos (primer div "contenido")
menu_cohorts.addEventListener('click', (e) => {
  e.preventDefault();
  contenido.style.display = "none";
  containerListStudents.style.display = "block";
  
});

//Mostrando select Cohorts al cargar la página
window.onload = () => {
  ListOfCohorts();
}

//Mostrando lista de cohorts en el select:
const ListOfCohorts = () => {
  fetch(allCohortsURL, { method: 'GET' })
    .then((response) => {
      if (response.status !== 200) {
        alert('Error')
      }
      return response.json();
    })
    .then((responseCohorts) => {
      responseCohorts.forEach(cohort => {
        allCohorts.push(cohort);
        let cohortName = document.createElement('option');
        cohortName.value = cohort.id;
        cohortName.innerText = cohort.id;
        selectCohorts.appendChild(cohortName);
      })
    });
}


const cursos = ["intro"];
//const dataUserProgress = (cursos) => {

const dataUserProgress = () => {
  fetch(allUsersURL, { method: 'GET' })
    .then((response) => {
      if (response.status !== 200) {
        alert('Error')
      }
      return response.json();
    })
    .then((users) => {
      console.log(users)
      options.cohortData.users = users
      fetch(allProgressURL, { method: 'GET' })
        .then((response) => {
          if (response.status !== 200) {
            alert('Error')
          }
          return response.json();
        })
        .then((progress) => {
          options.cohortData.progress = progress;
          options.cohort = cursos;
          options.search = searchName.value;
          //options.search = search;
          console.log(options);
          const listaEstudiantes = processCohortData(options);
          pintar(listaEstudiantes);

        })
    })
};

selectCohorts.addEventListener('change',()=>{
  console.log(selectCohorts.value)
  const nameCohort = selectCohorts.value;
  dataUserProgress();
})

searchName.addEventListener('input', (e) => {
  console.log(e.target.value);

  options.search = searchName.value;
  console.log(options);
  const listaEstudiantes= processCohortData(options)
  mytable.innerHTML = '';
  pintar(listaEstudiantes);
 
  
});

optionOrdenar.addEventListener('change', ()=>{

  
  //const valorOrden = optionOrdenar.options[optionOrdenar.selectedIndex].value;
  const valorOrden = optionOrdenar.value;
  
  const ordenar = valorOrden.split('|')
  
  options.orderBy = ordenar[0];
  options.orderDirection = ordenar[1];
    
  const listaEstudiantes = processCohortData(options)
  mytable.innerHTML = '';
  pintar(listaEstudiantes);
});


const pintar = (dataUserWithStats) => {
  mytable.innerHTML = "";
  dataUserWithStats.forEach((user) => {
    let totalPercent = (user.stats.percent === undefined || NaN) ? 0 : user.stats.percent;
    let readsPercent = isNaN(user.stats.reads.percent) ? 0 : user.stats.reads.percent;
    let exercisesPercent = isNaN(user.stats.exercises.percent) ? 0 : user.stats.exercises.percent;
    let quizzesPercent = isNaN(user.stats.quizzes.percent) ? 0 : user.stats.quizzes.percent;
    const row = document.createElement('tr')
    row.innerHTML = `<td>${user.name}</td><td>${totalPercent}%</td><td>${readsPercent}%</td><td>${exercisesPercent}%</td><td>${quizzesPercent}%</td><td>${user.stats.quizzes.scoreAvg}</td>`;
    mytable.appendChild(row)
  })
}



 






