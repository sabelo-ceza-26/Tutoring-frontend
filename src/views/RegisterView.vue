<template>
  <div class="auth-page">
    <h1>Register</h1>

    <div class="tabs">
      <button type="button" :class="{ active: role === 'student' }" @click="switchRole('student')">Student</button>
      <button type="button" :class="{ active: role === 'tutor' }" @click="switchRole('tutor')">Tutor</button>
    </div>

    <form class="card" @submit.prevent="submit">
      <input v-model.trim="form.id" :placeholder="role === 'student' ? 'Student Number' : 'Tutor ID'" required>
      <input v-model.trim="form.firstName" placeholder="First Name" required>
      <input v-model.trim="form.lastName" placeholder="Last Name" required>
      <input v-model.trim="form.email" type="email" placeholder="Email" required>
      <input v-model.trim="form.phoneNumber" placeholder="Phone Number" required>
      <input v-if="role === 'student'" v-model.trim="form.levelOfStudy" placeholder="Level of Study" required>
      <input v-else v-model.number="form.hourlyRate" type="number" min="0" step="0.01" placeholder="Hourly Rate (R)" required>
      <input v-model="form.password" type="password" placeholder="Password" minlength="4" required>
      <input v-model="confirmPassword" type="password" placeholder="Confirm Password" required>

      <p v-if="error" class="error">{{ error }}</p>
      <button type="submit" :disabled="loading">{{ loading ? 'Registering...' : 'Register' }}</button>
    </form>

    <p class="switch">
      Already have an account?
      <router-link to="/login">Login here</router-link>
    </p>
  </div>
</template>

<script>
import { createStudent } from '@/services/studentService'
import { createTutor } from '@/services/tutorService'
import { getAllStudents } from '@/services/studentService'
import { getAllTutors } from '@/services/tutorService'
import { loginStudent, loginTutor } from '@/services/authService'

function emptyForm() {
  return {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    levelOfStudy: '',
    hourlyRate: null,
    password: ''
  }
}

export default {
  name: 'RegisterView',
  data() {
    return {
      role: 'student',
      form: emptyForm(),
      confirmPassword: '',
      error: '',
      loading: false
    }
  },
  methods: {
    switchRole(role) {
      this.role = role
      this.form = emptyForm()
      this.confirmPassword = ''
      this.error = ''
    },
    validate() {
      if (this.form.password !== this.confirmPassword) {
        return 'Passwords do not match'
      }
      if (this.form.password.length < 4) {
        return 'Password must be at least 4 characters'
      }
      return ''
    },
    async idAlreadyUsed(id) {
      if (this.role === 'student') {
        const students = await getAllStudents()
        return students.some(s => s.studentNumber === id || s.email === this.form.email)
      }
      const tutors = await getAllTutors()
      return tutors.some(t => t.tutorId === id || t.email === this.form.email)
    },
    async submit() {
      this.error = this.validate()
      if (this.error) {
        return
      }
      this.loading = true
      try {
        if (await this.idAlreadyUsed(this.form.id)) {
          throw new Error('An account with this ID or email already exists')
        }
        let session
        if (this.role === 'student') {
          const student = {
            studentNumber: this.form.id,
            firstName: this.form.firstName,
            lastName: this.form.lastName,
            email: this.form.email,
            phoneNumber: this.form.phoneNumber,
            password: this.form.password,
            levelOfStudy: this.form.levelOfStudy
          }
          await createStudent(student)
          session = await loginStudent(student.email, student.password)
        } else {
          const tutor = {
            tutorId: this.form.id,
            firstName: this.form.firstName,
            lastName: this.form.lastName,
            email: this.form.email,
            phoneNumber: this.form.phoneNumber,
            password: this.form.password,
            hourlyRate: Number(this.form.hourlyRate)
          }
          await createTutor(tutor)
          session = await loginTutor(tutor.email, tutor.password)
        }
        this.$router.push(`/${session.role}-home`)
      } catch (e) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
