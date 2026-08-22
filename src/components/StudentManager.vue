<template>
  <div class="student-manager">
    <h1>{{ msg }}</h1>

    <p v-if="error" class="error">{{ error }}</p>

    <form class="create-form" @submit.prevent="saveStudent">
      <h3>Create Student</h3>
      <input v-model="newStudent.studentNumber" placeholder="Student Number" required>
      <input v-model="newStudent.firstName" placeholder="First Name" required>
      <input v-model="newStudent.lastName" placeholder="Last Name" required>
      <input v-model="newStudent.email" type="email" placeholder="Email" required>
      <input v-model="newStudent.phoneNumber" placeholder="Phone Number" required>
      <input v-model="newStudent.password" type="password" placeholder="Password" required>
      <input v-model="newStudent.levelOfStudy" placeholder="Level of Study" required>
      <button type="submit">Create</button>
    </form>

    <h3>Students ({{ students.length }})</h3>
    <ul>
      <li v-for="s in students" :key="s.studentNumber">
        {{ s.firstName }} {{ s.lastName }} ({{ s.studentNumber }}) - {{ s.email }}
      </li>
    </ul>
  </div>
</template>

<script>
import { getAllStudents, createStudent } from '@/services/studentService'

export default {
  name: 'StudentManager',
  props: {
    msg: String
  },
  data() {
    return {
      students: [],
      error: '',
      newStudent: {
        studentNumber: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        levelOfStudy: ''
      }
    }
  },
  methods: {
    async loadStudents() {
      try {
        this.students = await getAllStudents()
        this.error = ''
      } catch (e) {
        this.error = e.message
      }
    },
    async saveStudent() {
      try {
        await createStudent(this.newStudent)
        this.newStudent = {
          studentNumber: '',
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          password: '',
          levelOfStudy: ''
        }
        await this.loadStudents()
      } catch (e) {
        this.error = e.message
      }
    }
  },
  mounted() {
    this.loadStudents()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: block;
  margin: 5px 0;
}
a {
  color: #42b983;
}
.error {
  color: red;
}
.create-form input {
  display: block;
  margin: 6px auto;
  padding: 6px;
  width: 240px;
}
.create-form button {
  margin-top: 8px;
  padding: 6px 16px;
  cursor: pointer;
}
</style>
