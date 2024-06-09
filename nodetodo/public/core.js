var nodeTodo = angular.module("nodeTodo", []);


function mainController($scope, $http) {
  $scope.formData = {};
  $scope.todos = [];
  $scope.cos = "Foo";

  // when landing on the page, get all todos and show them
  $http
    .get("/api/todos")
    .success(function (data) {
      $scope.todos = data;
    })
    .error(function (data) {
      console.log("Error: " + data);
    });

  // when submitting the add form, send the text to the node API
  $scope.createTodo = function () {
    $http
      .post("/api/todos", $scope.formData)
      .success(function (data) {
        document.getElementById("newTodo").value = "";
        $scope.todos = data;
      })
      .error(function (data) {
        console.log("Error: " + data);
      });
  };

  // update a todo after checking it
  $scope.updateTodo = function (id) {};

  // Ajoutez une nouvelle fonction pour mettre à jour une tâche
$scope.updateTodo = function (todo) {
  $http
    .put("/api/todos/" + todo.id, todo)
    .success(function (data) {
      // Mettez à jour la liste des todos avec les données renvoyées par le serveur
      $scope.todos = data;
    })
    .error(function (data) {
      console.log("Error: " + data);
    });
};
// delete a todo after checking it
$scope.deleteTodo = function(todo) {
  $http.delete("/api/todos/" + todo.id)
    .then(function(response) {
      // Supprimer la tâche de la liste todos
      var index = $scope.todos.indexOf(todo);
      if (index !== -1) {
        $scope.todos.splice(index, 1);
      }
    })
    .catch(function(error) {
      console.error("Error deleting todo: ", error);
    });
};

$scope.deleteSelectedTodos = function() {
  // Supprimer toutes les tâches sélectionnées
  $scope.todos.forEach(function(todo) {
    if (todo.selected) {
      $scope.deleteTodo(todo);
    }
  });
};
$scope.isAnyTodoSelected = false;

$scope.selectTodo = function(todo) {
  todo.selected = !todo.selected;
  updateIsAnyTodoSelected(); // Mettre à jour la variable isAnyTodoSelected
};

$scope.deselectAllTodos = function() {
  $scope.todos.forEach(function(todo) {
    todo.selected = false;
  });
  updateIsAnyTodoSelected(); // Mettre à jour la variable isAnyTodoSelected
};

function updateIsAnyTodoSelected() {
  $scope.isAnyTodoSelected = $scope.todos.some(function(todo) {
    return todo.selected;
  });
}
}