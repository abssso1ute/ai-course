import { defineStore } from 'pinia'

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: []
  }),

  actions: {
    addTask(title) {
      this.tasks.push({
        id: Date.now(),
        title,
        done: false
      })
    },

    removeTask(id) {
      this.tasks = this.tasks.filter(t => t.id !== id)
    },

    toggleTask(id) {
      const task = this.tasks.find(t => t.id === id)
      if (task) task.done = !task.done
    }
  }
})