<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  let tasks = writable([]);
  let newTask = "";

  onMount(async () => {
    const res = await fetch("http://localhost:3000/tasks");
    tasks.set(await res.json());
  });

  async function addTask() {
    const res = await fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: newTask }),
    });
    const task = await res.json();
    tasks.update((tasks) => [...tasks, task]);
    newTask = "";
  }

  async function toggleTask(id, completed) {
    await fetch(`http://localhost:3000/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed }),
    });
    tasks.update((tasks) =>
      tasks.map((task) => (task.id === id ? { ...task, completed } : task))
    );
  }

  async function deleteTask(id) {
    await fetch(`http://localhost:3000/tasks/${id}`, {
      method: "DELETE",
    });
    tasks.update((tasks) => tasks.filter((task) => task.id !== id));
  }

  async function editTask(id, newTitle) {
    console.log("Editing task:", id, newTitle);
    await fetch(`http://localhost:3000/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: newTitle }),
    });
  }

  let editingTask = null;

  function startEditing(id) {
    editingTask = id;
  }

  function cancelEditing() {
    editingTask = null;
  }

  async function saveTask(id, newTitle) {
    try {
      console.log("Saving task:", id, newTitle);
      await editTask(id, newTitle); // Met à jour la tâche dans le backend

      // Met à jour la tâche localement
      tasks.update((tasks) =>
        tasks.map((task) =>
          task.id === id ? { ...task, title: newTitle } : task
        )
      );
    } catch (error) {
      console.error("Error saving task:", error);
      // Gérer les erreurs si nécessaire
    } finally {
      editingTask = null;
    }
  }
</script>

<main>
  <h1>To-Do List</h1>
  <input bind:value={newTask} placeholder="New task" />
  <button on:click={addTask}>Add Task</button>

  <ul>
    {#each $tasks as task}
      <li>
        {#if editingTask === task.id}
          <input type="text" bind:value={task.title} />
          <button on:click={() => saveTask(task.id, task.title)}>Save</button>
          <button on:click={cancelEditing}>Cancel</button>
        {:else}
          <input
            type="checkbox"
            checked={task.completed}
            on:change={() => toggleTask(task.id, !task.completed)}
          />
          <span on:click={() => startEditing(task.id)}>{task.title}</span>
          <button on:click={() => deleteTask(task.id)}>Delete</button>
          <button on:click={() => startEditing(task.id)}>Edit</button>
        {/if}
      </li>
    {/each}
  </ul>
</main>
