<template>
  <div class="admin-page">
    <header class="admin-header">
      <div>
        <h1>Admin Dashboard</h1>
        <p class="muted" v-if="admin">Signed in as {{ admin.name }}</p>
      </div>
      <button type="button" class="ghost" @click="loadAll" :disabled="loading">
        {{ loading ? 'Refreshing...' : 'Refresh' }}
      </button>
    </header>

    <p v-if="error" class="error">{{ error }}</p>

    <section class="stat-grid">
      <div class="stat">
        <span class="stat-label">Students</span>
        <strong>{{ stats.totalStudents }}</strong>
      </div>
      <div class="stat">
        <span class="stat-label">Tutors</span>
        <strong>{{ stats.totalTutors }}</strong>
      </div>
      <div class="stat">
        <span class="stat-label">Subjects</span>
        <strong>{{ stats.totalSubjects }}</strong>
      </div>
      <div class="stat">
        <span class="stat-label">Bookings</span>
        <strong>{{ stats.totalBookings }}</strong>
      </div>
      <div class="stat">
        <span class="stat-label">Pending payments</span>
        <strong>{{ stats.pendingPayments }}</strong>
      </div>
      <div class="stat">
        <span class="stat-label">Total revenue</span>
        <strong>{{ money(stats.totalRevenue) }}</strong>
      </div>
    </section>

    <nav class="tabs">
      <button
        v-for="t in tabs"
        :key="t"
        type="button"
        :class="{ active: tab === t }"
        @click="tab = t"
      >
        {{ t }}
      </button>
    </nav>

    <!-- Tutors -->
    <section v-if="tab === 'Tutors'" class="panel">
      <table class="table">
        <thead>
          <tr>
            <th>Tutor ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Hourly rate</th>
            <th>Subjects taught</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in tutorSubjects" :key="t.tutorId">
            <td>{{ t.tutorId }}</td>
            <td>{{ t.tutorName }}</td>
            <td>{{ t.email }}</td>
            <td>{{ t.phone }}</td>
            <td>{{ money(t.hourlyRate) }}</td>
            <td>
              <span v-if="!t.subjectsTaught || !t.subjectsTaught.length" class="muted">None</span>
              <span v-else class="chip" v-for="s in t.subjectsTaught" :key="s">{{ s }}</span>
            </td>
            <td class="row-actions">
              <button type="button" class="ghost small" @click="editTutor(t)">Edit</button>
              <button type="button" class="danger small" @click="removeTutor(t.tutorId)">Delete</button>
            </td>
          </tr>
          <tr v-if="!tutorSubjects.length">
            <td colspan="7" class="muted">No tutors found.</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Students -->
    <section v-if="tab === 'Students'" class="panel">
      <table class="table">
        <thead>
          <tr>
            <th>Student Number</th>
            <th>Name</th>
            <th>Email</th>
            <th>Level of Study</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in studentBookings" :key="s.studentNumber">
            <td>{{ s.studentNumber }}</td>
            <td>{{ s.studentName }}</td>
            <td>{{ s.email }}</td>
            <td>{{ s.levelOfStudy }}</td>
            <td class="row-actions">
              <button type="button" class="ghost small" @click="editStudent(s)">Edit</button>
              <button type="button" class="danger small" @click="removeStudent(s.studentNumber)">Delete</button>
            </td>
          </tr>
          <tr v-if="!studentBookings.length">
            <td colspan="5" class="muted">No students found.</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Subjects -->
    <section v-if="tab === 'Subjects'" class="panel">
      <form class="inline-form" @submit.prevent="addSubject">
        <input v-model.trim="newSubject.subjectCode" placeholder="Subject code" required />
        <input v-model.trim="newSubject.subjectName" placeholder="Subject name" required />
        <input v-model.trim="newSubject.gradeLevel" placeholder="Grade level" />
        <input v-model.trim="newSubject.subjectDescription" placeholder="Description" />
        <button type="submit" :disabled="saving">Add subject</button>
      </form>

      <table class="table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Grade</th>
            <th>Description</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in subjects" :key="s.subjectCode">
            <td>{{ s.subjectCode }}</td>
            <td>{{ s.subjectName }}</td>
            <td>{{ s.gradeLevel }}</td>
            <td>{{ s.subjectDescription }}</td>
            <td class="row-actions">
              <button type="button" class="ghost small" @click="editSubject(s)">Edit</button>
              <button type="button" class="danger small" @click="removeSubject(s.subjectCode)">Delete</button>
            </td>
          </tr>
          <tr v-if="!subjects.length">
            <td colspan="5" class="muted">No subjects yet.</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Bookings -->
    <section v-if="tab === 'Bookings'" class="panel">
      <table class="table">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Date</th>
            <th>Duration</th>
            <th>Session Type</th>
            <th>Subject Code</th>
            <th>Student </th>
            <th>Tutor</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in bookings" :key="b.bookingId">
            <td>{{ b.bookingId }}</td>
            <td>{{ date(b.date) }}</td>
            <td>{{ b.duration }}</td>
            <td>{{ b.sessionType }}</td>
            <td>{{ b.subjectCode }}</td>
            <td>{{ b.studentNumber || (b.student ? b.student.studentNumber : '—') }}</td>
            <td>{{ b.tutorId || (b.tutor ? b.tutor.tutorId : '—') }}</td>
            <td class="row-actions">
              <button type="button" class="ghost small" @click="editBooking(b)">Edit</button>
              <button type="button" class="danger small" @click="removeBooking(b.bookingId)">Delete</button>
            </td>
          </tr>
          <tr v-if="!bookings.length">
            <td colspan="8" class="muted">No bookings yet.</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Payments -->
    <section v-if="tab === 'Payments'" class="panel">
      <table class="table">
        <thead>
          <tr>
            <th>Reference</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in payments" :key="p.paymentRef">
            <td>{{ p.paymentRef }}</td>
            <td>{{ money(p.amount) }}</td>
            <td>{{ p.paymentMethod }}</td>
            <td>
              <span class="badge" :class="statusClass(p.status)">{{ p.status }}</span>
            </td>
            <td>{{ date(p.paymentDate) }}</td>
          </tr>
          <tr v-if="!payments.length">
            <td colspan="5" class="muted">No payments yet.</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Edit Modal -->
    <div v-if="editModal.show" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h3>{{ editModal.title }}</h3>
        <form @submit.prevent="saveEdit">
          <div v-for="(field, idx) in editModal.fields" :key="idx" class="modal-field">
            <label>{{ field.label }}</label>
            <input
              v-model="editModal.form[field.key]"
              :type="field.type || 'text'"
              :disabled="field.disabled"
              required
            />
          </div>
          <p v-if="editModal.error" class="error">{{ editModal.error }}</p>
          <div class="modal-actions">
            <button type="button" class="ghost" @click="closeModal">Cancel</button>
            <button type="submit" class="submit-btn" :disabled="saving">
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getAdminSession,
  getDashboard,
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  getBookings,
  updateBooking,
  deleteBooking,
  getPayments,
  deleteStudent,
  deleteTutor
} from '@/services/adminService'
import { updateStudent } from '@/services/studentService'
import { updateTutor } from '@/services/tutorService'

export default {
  name: 'AdminDashboard',
  data() {
    return {
      admin: getAdminSession(),
      tabs: ['Tutors', 'Students', 'Subjects', 'Bookings', 'Payments'],
      tab: 'Tutors',
      loading: false,
      saving: false,
      error: '',
      stats: {
        totalStudents: 0,
        totalTutors: 0,
        totalSubjects: 0,
        totalBookings: 0,
        pendingPayments: 0,
        totalRevenue: 0
      },
      tutorSubjects: [],
      studentBookings: [],
      subjects: [],
      bookings: [],
      payments: [],
      newSubject: {
        subjectCode: '',
        subjectName: '',
        gradeLevel: '',
        subjectDescription: ''
      },
      editModal: {
        show: false,
        title: '',
        fields: [],
        form: {},
        type: '',
        original: null,
        error: ''
      }
    }
  },
  created() {
    this.loadAll()
  },
  methods: {
    async loadAll() {
      this.loading = true
      this.error = ''
      try {
        const [dashboard, subjects, bookings, payments] = await Promise.all([
          getDashboard(),
          getSubjects(),
          getBookings(),
          getPayments()
        ])

        if (dashboard) {
          this.stats = dashboard.stats || this.stats
          this.tutorSubjects = dashboard.tutorSubjectSummaries || []
          this.studentBookings = dashboard.studentBookingSummaries || []
        }
        this.subjects = subjects || []
        this.payments = payments || []
        this.bookings = bookings || []
      } catch (e) {
        this.error = e.message || 'Could not load dashboard data'
      } finally {
        this.loading = false
      }
    },

    // --- Subjects ---
    async addSubject() {
      this.saving = true
      this.error = ''
      try {
        await createSubject({ ...this.newSubject })
        this.newSubject = { subjectCode: '', subjectName: '', gradeLevel: '', subjectDescription: '' }
        this.subjects = (await getSubjects()) || []
      } catch (e) {
        this.error = e.message || 'Could not create subject'
      } finally {
        this.saving = false
      }
    },
    editSubject(s) {
      this.openModal('Edit Subject', [
        { label: 'Code', key: 'subjectCode', disabled: true },
        { label: 'Name', key: 'subjectName' },
        { label: 'Grade', key: 'gradeLevel' },
        { label: 'Description', key: 'subjectDescription' }
      ], { ...s }, 'subject')
    },
    async removeSubject(subjectCode) {
      if (!window.confirm(`Delete subject ${subjectCode}?`)) return
      try {
        await deleteSubject(subjectCode)
        this.subjects = (await getSubjects()) || []
      } catch (e) {
        this.error = e.message || 'Could not delete subject'
      }
    },

    // --- Students ---
    editStudent(s) {
      this.openModal('Edit Student', [
        { label: 'Student Number', key: 'studentNumber', disabled: true },
        { label: 'Name', key: 'studentName' },
        { label: 'Email', key: 'email', type: 'email' },
        { label: 'Level of Study', key: 'levelOfStudy' }
      ], { ...s }, 'student')
    },
    async removeStudent(studentNumber) {
      if (!window.confirm(`Delete student ${studentNumber}?`)) return
      try {
        await deleteStudent(studentNumber)
        this.loadAll()
      } catch (e) {
        this.error = e.message || 'Could not delete student'
      }
    },

    // --- Tutors ---
    editTutor(t) {
      this.openModal('Edit Tutor', [
        { label: 'Tutor ID', key: 'tutorId', disabled: true },
        { label: 'Name', key: 'tutorName' },
        { label: 'Email', key: 'email', type: 'email' },
        { label: 'Phone', key: 'phone', type: 'tel' },
        { label: 'Hourly Rate', key: 'hourlyRate', type: 'number' }
      ], { ...t }, 'tutor')
    },
    async removeTutor(tutorId) {
      if (!window.confirm(`Delete tutor ${tutorId}?`)) return
      try {
        await deleteTutor(tutorId)
        this.loadAll()
      } catch (e) {
        this.error = e.message || 'Could not delete tutor'
      }
    },

    // --- Bookings ---
    editBooking(b) {
      this.openModal('Edit Booking', [
        { label: 'Booking ID', key: 'bookingId', disabled: true },
        { label: 'Subject Code', key: 'subjectCode' },
        { label: 'Session Type', key: 'sessionType' },
        { label: 'Duration', key: 'duration', type: 'number' },
        { label: 'Date', key: 'date', type: 'date' }
      ], { ...b }, 'booking')
    },
    async removeBooking(bookingId) {
      if (!window.confirm(`Delete booking ${bookingId}?`)) return
      try {
        await deleteBooking(bookingId)
        this.loadAll()
      } catch (e) {
        this.error = e.message || 'Could not delete booking'
      }
    },

    // --- Modal ---
    openModal(title, fields, form, type) {
      this.editModal = { show: true, title, fields, form: { ...form }, type, original: form, error: '' }
    },
    closeModal() {
      this.editModal.show = false
    },
    async saveEdit() {
      this.saving = true
      this.editModal.error = ''
      try {
        const form = this.editModal.form
        if (this.editModal.type === 'subject') {
          await updateSubject(form)
          this.subjects = (await getSubjects()) || []
        } else if (this.editModal.type === 'student') {
          await updateStudent({
            studentNumber: form.studentNumber,
            firstName: form.studentName.split(' ')[0] || '',
            lastName: form.studentName.split(' ').slice(1).join(' ') || '',
            email: form.email,
            levelOfStudy: form.levelOfStudy
          })
          this.loadAll()
        } else if (this.editModal.type === 'tutor') {
          await updateTutor({
            tutorId: form.tutorId,
            firstName: form.tutorName.split(' ')[0] || '',
            lastName: form.tutorName.split(' ').slice(1).join(' ') || '',
            email: form.email,
            hourlyRate: form.hourlyRate
          })
          this.loadAll()
        } else if (this.editModal.type === 'booking') {
          await updateBooking(form)
          this.loadAll()
        }
        this.closeModal()
      } catch (e) {
        this.editModal.error = e.message || 'Could not save'
      } finally {
        this.saving = false
      }
    },

    money(value) {
      const n = Number(value || 0)
      return `R ${n.toFixed(2)}`
    },
    date(value) {
      if (!value) return '—'
      const d = new Date(value)
      return isNaN(d.getTime()) ? String(value) : d.toLocaleString()
    },
    statusClass(status) {
      const s = String(status || '').toUpperCase()
      if (s.includes('PAID') || s.includes('COMPLETE')) return 'ok'
      if (s.includes('PEND')) return 'warn'
      if (s.includes('FAIL') || s.includes('CANCEL')) return 'bad'
      return ''
    }
  }
}
</script>

<style scoped>
.admin-page {
  max-width: 1100px;
  margin: 24px auto 64px;
  padding: 0 16px;
}

.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.admin-header h1 {
  margin: 0;
  font-size: 24px;
}

button.ghost {
  padding: 8px 14px;
  border: 1px solid #2c3e50;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
}

button.ghost.small {
  padding: 4px 10px;
  font-size: 12px;
}

button.danger {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  background: #c0392b;
  color: #fff;
  cursor: pointer;
}

button.danger.small {
  padding: 4px 10px;
  font-size: 12px;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin: 20px 0;
}

.stat {
  background: #fff;
  border-radius: 8px;
  padding: 14px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stat-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #7f8c8d;
}

.stat strong {
  font-size: 22px;
}

.tabs {
  justify-content: flex-start;
  flex-wrap: wrap;
}

.panel {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.table th,
.table td {
  text-align: left;
  padding: 10px 8px;
  border-bottom: 1px solid #eef2f6;
  vertical-align: top;
}

.table th {
  color: #7f8c8d;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.row-actions {
  white-space: nowrap;
  display: flex;
  gap: 6px;
}

.chip {
  display: inline-block;
  background: #eaf6f0;
  color: #1e7d54;
  border-radius: 999px;
  padding: 2px 10px;
  margin: 0 4px 4px 0;
  font-size: 12px;
}

.badge {
  display: inline-block;
  border-radius: 999px;
  padding: 2px 10px;
  font-size: 12px;
  background: #eef2f6;
}

.badge.ok {
  background: #eaf6f0;
  color: #1e7d54;
}

.badge.warn {
  background: #fdf3e2;
  color: #a86611;
}

.badge.bad {
  background: #fdecea;
  color: #a12c1e;
}

.inline-form {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.inline-form input {
  padding: 8px 10px;
  border: 1px solid #ccd4dd;
  border-radius: 4px;
  font-size: 14px;
}

.inline-form button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: #42b983;
  color: #fff;
  cursor: pointer;
}

.muted {
  color: #7f8c8d;
}

.error {
  color: #c0392b;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  border-radius: 10px;
  padding: 24px;
  width: 420px;
  max-width: 90vw;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
}

.modal h3 {
  margin: 0 0 16px;
}

.modal-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
}

.modal-field label {
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #55657a;
}

.modal-field input {
  padding: 10px;
  border: 1px solid #ccd4dd;
  border-radius: 4px;
  font-size: 14px;
}

.modal-field input:disabled {
  background: #f0f2f5;
  color: #7f8c8d;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
}

.submit-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 4px;
  background: #42b983;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
}

.submit-btn:disabled {
  background: #9fd8bf;
  cursor: not-allowed;
}
</style>
