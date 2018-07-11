window.computeUsersStats = (users, progress, courses) => {

  //recorrer el array de users y a cada uno agregarle el atributo stats
  let userWithStats = users.map((user) => {

    user.stats = {
      percent: 0,
      exercises: {
        total: 0,
        completed: 0,
        percent: 0
      },
      reads: {
        total: 0,
        completed: 0,
        percent: 0
      },
      quizzes: {
        total: 0,
        completed: 0,
        percent: 0,
        scoreSum: 0,
        scoreAvg: 0
      }
    };

   
    let totalExercices = 0, totalReads = 0, totalQuizzes = 0
    let completedExercices = 0, completedReads = 0, completedQuizzes = 0;
    let sumCoursePercent = 0, scoreSum = 0;

    //obtener el progreso del usuario desde el array progress
    let userProgress = progress[user.id];

    if (userProgress) {

      //actualizar exercises, reads y quizzes
      courses.map((course) => {

        if (!userProgress.hasOwnProperty(course)) {
          return;
        }

        sumCoursePercent += userProgress[course].percent;

        if (userProgress[course].hasOwnProperty('units')) {
          const units = Object.keys(userProgress[course].units);

          units.map((unit) => {

            if (userProgress[course].units[unit].hasOwnProperty('parts')) {
              const parts = Object.keys(userProgress[course].units[unit].parts);

              parts.map((part) => {

                const newPart = userProgress[course].units[unit].parts[part];

                if (newPart.type === 'practice') {
                  totalExercices++;
                  if (newPart.completed == 1) {
                    completedExercices++;
                  }

                } else if (newPart.type === 'read') {
                  totalReads++;

                  if (newPart.completed == 1) {
                    completedReads++;
                  }

                } else if (newPart.type === 'quiz') {
                  totalQuizzes++;

                  if (newPart.completed == 1) {
                    completedQuizzes++;
                    scoreSum = scoreSum + newPart.score;
                  }
                }

              });
            }

          });
        }

      });

      user.stats.percent = sumCoursePercent / courses.length;

      user.stats.exercises.total = totalExercices;
      user.stats.reads.total = totalReads;
      user.stats.quizzes.total = totalQuizzes;

      user.stats.exercises.completed = completedExercices;
      user.stats.reads.completed = completedReads;
      user.stats.quizzes.completed = completedQuizzes;

      user.stats.exercises.percent = totalExercices > 0 ? Math.round((completedExercices / totalExercices) * 100) : 0;
      user.stats.reads.percent = totalReads > 0 ? Math.round((completedReads / totalReads) * 100) : 0;
      user.stats.quizzes.percent = totalQuizzes > 0 ? Math.round((completedQuizzes / totalQuizzes) * 100) : 0;

      user.stats.quizzes.scoreSum = scoreSum;
      user.stats.quizzes.scoreAvg = completedQuizzes > 0 ? Math.round(scoreSum / completedQuizzes) : 0;
    }

    return user;
  });

  //console.log('userWithStats: ',userWithStats);
  return userWithStats;
}

window.sortUsers = (users, orderBy, orderDirection) => {
  let sortedUsers;
  if (orderDirection === 'asc') {
    if (orderBy === 'nombre') {
      sortedUsers = users.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    }
  }
  if (orderDirection === 'desc') {
    if (orderBy === 'nombre') {
      sortedUsers = users.sort((a, b) => {
        return b.name.localeCompare(a.name);
      });
    }
  }
  if (orderDirection === 'asc') {
    if (orderBy === 'porcentaje') {
      sortedUsers = users.sort((a, b) => {
        return a.stats.percent - b.stats.percent;
      });
    }
  }
  if (orderDirection === 'desc') {
    if (orderBy === 'porcentaje') {
      sortedUsers = users.sort((a, b) => {
        return b.stats.percent - a.stats.percent;
      });
    }
  }
  if (orderDirection === 'asc') {
    if (orderBy === 'ejercicios') {
      sortedUsers = users.sort((a, b) => {
        return a.stats.exercises.completed - b.stats.exercises.completed;
      });
    }
  }
  if (orderDirection === 'desc') {
    if (orderBy === 'ejercicios') {
      sortedUsers = users.sort((a, b) => {
        return b.stats.exercises.completed - a.stats.exercises.completed;
      });
    }
  }
  if (orderDirection === 'asc') {
    if (orderBy === 'lecturas') {
      sortedUsers = users.sort((a, b) => {
        return a.stats.reads.completed - b.stats.reads.completed;
      });
    }
  }
  if (orderDirection === 'desc') {
    if (orderBy === 'lecturas') {
      sortedUsers = users.sort((a, b) => {
        return b.stats.reads.completed - a.stats.reads.completed;
      });
    }
  }
  if (orderDirection === 'asc') {
    if (orderBy === 'quizzes') {
      sortedUsers = users.sort((a, b) => {
        return a.stats.quizzes.completed - b.stats.quizzes.completed;
      });
    }
  }
  if (orderDirection === 'desc') {
    if (orderBy === 'quizzes') {
      sortedUsers = users.sort((a, b) => {
        return b.stats.quizzes.completed - a.stats.quizzes.completed;
      });
    }
  }
  if (orderDirection === 'asc') {
    if (orderBy === 'scoreAvg') {
      sortedUsers = users.sort((a, b) => {
        return a.stats.quizzes.scoreAvg - b.stats.quizzes.scoreAvg;
      });
    }
  }
  if (orderDirection === 'desc') {
    if (orderBy === 'scoreAvg') {
      sortedUsers = users.sort((a, b) => {
        return b.stats.quizzes.scoreAvg - a.stats.quizzes.scoreAvg;
      });
    }
  }

  return sortedUsers ? sortedUsers : users;
}

window.filterUsers = (users, search) => {
  // let listFiltrar = users;
 
    let listFiltrar = users.filter((user)=>{
          return user.name.toUpperCase().indexOf(search.toUpperCase()) > -1;
      });
  
  return listFiltrar;
}

window.processCohortData = (options) => {

  let users = options.cohortData.users;
  let progress = options.cohortData.progress;
  let search = options.search;


  let usersP = computeUsersStats(users, progress, options.cohort);
  usersP = sortUsers(usersP, options.orderBy, options.orderDirection);
  if (options.search !== '') {
    usersP = filterUsers(usersP, search);
  }
  return usersP;
}


