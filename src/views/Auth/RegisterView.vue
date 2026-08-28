<template>
  <div class="register-shell">
    <div class="auth-card">
      <!-- HERO -->
      <header class="auth-hero">
        <brand-logo :size="68" class="hero-logo" />
        <h1>Create your account</h1>
        <p>Join our tutoring platform in under a minute.</p>
      </header>

      <!-- BODY -->
      <div class="auth-body">
        <p class="field-label">I'm registering as a</p>
        <nav class="role-tabs">
          <button type="button" :class="{ active: role === 'student' }" @click="switchRole('student')">
            Student
          </button>
          <button type="button" :class="{ active: role === 'tutor' }" @click="switchRole('tutor')">
            Tutor
          </button>
        </nav>

        <form @submit.prevent="submit">
          <label class="full">
            {{ role === 'student' ? 'Student Number' : 'Tutor ID' }}
            <input v-model.trim="form.id" :placeholder="role === 'student' ? 'e.g. STU12345' : 'e.g. TUT001'" required>
          </label>

          <div class="grid-2">
            <label>
              First Name
              <input v-model.trim="form.firstName" placeholder="Enter your first name">
            </label>
            <label>
              Last Name
              <input v-model.trim="form.lastName" placeholder="Enter your last name">
            </label>
          </div>

          <div class="grid-2">
            <label>
              Email
              <input v-model.trim="form.email" type="email" placeholder="you@example.com">
            </label>
            <label>
              Phone Number
              <input v-model.trim="form.phoneNumber" placeholder="072 123 4567">
            </label>
          </div>

          <transition name="fade" mode="out-in">
            <label v-if="role === 'student'" key="level">
              Level of Study
              <input v-model.trim="form.levelOfStudy" placeholder="e.g. 2nd Year, Undergraduate">
            </label>
            <label v-else key="rate">
              Hourly Rate (R)
              <input v-model.number="form.hourlyRate" type="number" min="0" step="0.01" placeholder="150.00">
            </label>
          </transition>

          <div class="grid-2">
            <label>
              Password
              <input v-model="form.password" type="password" placeholder="Min. 8 characters" minlength="8">
            </label>
            <label>
              Confirm Password
              <input v-model="confirmPassword" type="password" placeholder="Repeat password">
            </label>
          </div>

          <transition name="fade">
            <p v-if="error" class="banner error-banner">{{ error }}</p>
          </transition>

          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? 'Registering...' : 'Create Account' }}
          </button>
        </form>
      </div>

      <!-- FOOTER -->
      <footer class="auth-footer">
        <p>
          Already have an account?
          <router-link :to="loginLink">Login here</router-link>
        </p>
      </footer>
    </div>
  </div>
</template>

<script>
import { createStudent, getAllStudents } from '@/services/studentService'
import { createTutor, getAllTutors } from '@/services/tutorService'
import { loginStudent, loginTutor } from '@/services/authService'
import BrandLogo from '@/components/BrandLogo.vue'

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

const VALID_ROLES = ['student', 'tutor']

export default {
  name: 'RegisterView',
  components: {
    BrandLogo
  },
  data() {
    return {
      role: 'student',
      form: emptyForm(),
      confirmPassword: '',
      error: '',
      loading: false
    }
  },
  computed: {
    loginLink() {
      return { path: '/login', query: { role: this.role } }
    }
  },
  created() {
    const r = this.$route.query.role
    if (VALID_ROLES.includes(r) && r !== this.role) {
      this.switchRole(r)
    } else if (VALID_ROLES.includes(r)) {
      this.role = r
    }
  },
  watch: {
    '$route.query.role'(val) {
      if (VALID_ROLES.includes(val) && val !== this.role) {
        this.switchRole(val)
      }
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
      if (this.form.password.length < 8) {
        return 'Password must be at least 8 characters'
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

<style scoped>
.register-shell {
  min-height: calc(100vh - 58px);
  display: flex;
  justify-content: center;
  padding: 20px 16px;
  background:
    radial-gradient(circle at 12% 18%, rgba(66, 185, 131, 0.14), transparent 42%),
    radial-gradient(circle at 88% 82%, rgba(44, 62, 80, 0.12), transparent 45%),
    #f5f7fa;
}

.auth-card {
  display: flex;
  flex-direction: column;
  width: 640px;
  max-width: 100%;
  min-height: calc(100vh - 98px);
  background: #fff;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 18px 48px rgba(31, 59, 83, 0.22);
}

/* HERO */
.auth-hero {
  background: linear-gradient(120deg, #24435c 0%, #2c3e50 55%, #256d51 100%);
  color: #fff;
  text-align: center;
  padding: 38px 32px 34px;
  position: relative;
}

.auth-hero::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 26px;
  background: #fff;
  border-radius: 26px 26px 0 0;
}

.hero-logo {
  display: block;
  margin: 0 auto 18px;
  border-radius: 18px;
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.35);
}

.auth-hero h1 {
  margin: 0 0 8px;
  font-size: 30px;
}

.auth-hero p {
  margin: 0;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.78);
  position: relative;
  z-index: 1;
}

/* BODY */
.auth-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px 48px 34px;
}

.field-label {
  margin: 0 0 10px;
  font-size: 13px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #55657a;
  text-align: center;
}

/* ROLE TABS */
.role-tabs {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 28px;
}

.role-tabs button {
  padding: 11px 24px;
  border: 1px solid #d7dfe8;
  background: #fff;
  border-radius: 999px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  color: #2c3e50;
  transition: all 0.15s ease;
}

.role-tabs button:hover {
  border-color: #42b983;
  color: #1e7a58;
}

.role-tabs button.active {
  background: linear-gradient(120deg, #2f9e69, #256d51);
  border-color: transparent;
  color: #fff;
  box-shadow: 0 4px 12px rgba(47, 158, 105, 0.35);
}

/* FORM */
form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 560px) {
  .grid-2 {
    grid-template-columns: 1fr;
  }
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #55657a;
  text-align: left;
  margin-bottom: 0;
}

input {
  padding: 14px 16px;
  border: 1px solid #c5cfdc;
  border-radius: 9px;
  font-size: 15.5px;
  font-weight: normal;
  letter-spacing: normal;
  text-transform: none;
  color: #2c3e50;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

input::placeholder {
  color: #a5b1bf;
  letter-spacing: normal;
  text-transform: none;
  font-weight: normal;
}

input:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.18);
}

/* BANNERS */
.banner {
  margin: 0;
  padding: 12px 16px;
  border-radius: 9px;
  font-size: 14.5px;
  text-align: left;
}

.error-banner {
  background: #fce8e6;
  color: #96281b;
  border: 1px solid #f2b8b5;
}

/* SUBMIT */
.submit-btn {
  margin-top: 8px;
  padding: 15px;
  border: none;
  border-radius: 9px;
  background: linear-gradient(120deg, #2f9e69, #256d51);
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 4px 14px rgba(37, 109, 81, 0.28);
}

.submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 7px 18px rgba(37, 109, 81, 0.38);
}

.submit-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* FOOTER */
.auth-footer {
  background: #f2f6f9;
  border-top: 1px solid #e4e9ef;
  padding: 18px;
  text-align: center;
}

.auth-footer p {
  margin: 0;
  font-size: 14.5px;
  color: #6b7a89;
}

.auth-footer a {
  color: #1e7a58;
  font-weight: bold;
  text-decoration: none;
}

.auth-footer a:hover {
  text-decoration: underline;
}

/* TRANSITIONS */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
