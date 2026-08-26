<template>
  <div class="admin-page">
    <header class="admin-header">
      <div>
        <h1>Admin Dashboard</h1>
        <p class="muted" v-if="admin">Signed in as {{ admin.firstName }} {{ admin.lastName }}</p>
      </div>
      <button type="button" class="ghost" @click="loadAll" :disabled="loading">
        {{ loading ? 'Refreshing...' : 'Refresh' }}
      </button>
    </header>
 
    <p v-if="error" class="error">{{ error }}</p>
 
    <!-- Stats: DashboardStats DTO -->
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
 
    <!-- Tutors & subjects: TutorSubjectSummary DTO -->
    <section v-if="tab === 'Tutors'" class="panel">
      <table class="table">
        <thead>
          <tr>
            <th>Tutor ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Hourly rate</th>
            <th>Subjects taught</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in tutorSubjects" :key="t.tutorId">
            <td>{{ t.tutorId }}</td>
            <td>{{ t.tutorName }}</td>
            <td>{{ t.email }}</td>
            <td>{{ money(t.hourlyRate) }}</td>
            <td>
              <span v-if="!t.subjectsTaught || !t.subjectsTaught.length" class="muted">None</span>
              <span v-else class="chip" v-for="s in t.subjectsTaught" :key="s">{{ s }}</span>
            </td>
          </tr>
          <tr v-if="!tutorSubjects.length">
            <td colspan="5" class="muted">No tutors found.</td>
          </tr>
        </tbody>
      </table>
    </section>
 
    <!-- Students & bookings: StudentBookingSummary + BookingDetail DTOs -->
    <section v-if="tab === 'Students'" class="panel">
      <article v-for="s in studentBookings" :key="s.studentNumber" class="student-card">
        <div class="student-head">
          <div>
            <strong>{{ s.studentName }}</strong>
            <span class="muted"> · {{ s.studentNumber }}</span>
          </div>
          <div class="muted">{{ s.email }} · {{ s.levelOfStudy }}</div>
        </div>
 
        <table class="table" v-if="s.bookings && s.bookings.length">
          <thead>
            <tr>
              <th>Booking</th>
              <th>Subject</th>
              <th>Tutor</th>
              <th>Session</th>
              <th>Duration</th>
              <th>Date</th>
              <th>Payment</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="b in s.bookings" :key="b.bookingId">
              <td>{{ b.bookingId }}</td>
              <td>{{ b.subjectName }} <span class="muted">({{ b.subjectCode }})</span></td>
              <td>{{ b.tutorName }}</td>
              <td>{{ b.sessionType }}</td>
              <td>{{ b.duration }}</td>
              <td>{{ date(b.date) }}</td>
              <td>
                <span class="badge" :class="statusClass(b.paymentStatus)">
                  {{ b.paymentStatus || 'UNPAID' }}
                </span>
              </td>
              <td>{{ money(b.paymentAmount) }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else class="muted">No bookings yet.</p>
      </article>
      <p v-if="!studentBookings.length" class="muted">No students found.</p>
    </section>
 
    <!-- Subjects CRUD: SubjectController -->
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
            <td>
              <button type="button" class="danger" @click="removeSubject(s.subjectCode)">
                Delete
              </button>
            </td>
          </tr>
          <tr v-if="!subjects.length">
            <td colspan="5" class="muted">No subjects yet.</td>
          </tr>
        </tbody>
      </table>
    </section>
 
    <!-- Bookings: BookingController -->
    <section v-if="tab === 'Bookings'" class="panel">
      <table class="table">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Subject code</th>
            <th>Session type</th>
            <th>Duration</th>
            <th>Date</th>
            <th>Student</th>
            <th>Tutor</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in bookings" :key="b.bookingId">
            <td>{{ b.bookingId }}</td>
            <td>{{ b.subjectCode }}</td>
            <td>{{ b.sessionType }}</td>
            <td>{{ b.duration }}</td>
            <td>{{ date(b.date) }}</td>
            <td>{{ b.student ? b.student.studentNumber : '—' }}</td>
            <td>{{ b.tutor ? b.tutor.tutorId : '—' }}</td>
            <td>
              <button type="button" class="danger" @click="removeBooking(b.bookingId)">
                Delete
              </button>
            </td>
          </tr>
          <tr v-if="!bookings.length">
            <td colspan="8" class="muted">No bookings yet.</td>
          </tr>
        </tbody>
      </table>
    </section>
 
    <!-- Payments: PaymentController -->
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
  </div>
</template>
 
<script>
import {
  getAdminSession,
  getDashboard,
  getSubjects,
  createSubject,
  deleteSubject,
  getBookings,
  deleteBooking,
  getPayments
} from '@/services/adminService'
 
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
        this.bookings = bookings || []
        this.payments = payments || []
      } catch (e) {
        this.error = e.message || 'Could not load dashboard data'
      } finally {
        this.loading = false
      }
    },
    async addSubject() {
      this.saving = true
      this.error = ''
      try {
        await createSubject({ ...this.newSubject })
        this.newSubject = {
          subjectCode: '',
          subjectName: '',
          gradeLevel: '',
          subjectDescription: ''
        }
        this.subjects = (await getSubjects()) || []
      } catch (e) {
        this.error = e.message || 'Could not create subject'
      } finally {
        this.saving = false
      }
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
    async removeBooking(bookingId) {
      if (!window.confirm(`Delete booking ${bookingId}?`)) return
      try {
        await deleteBooking(bookingId)
        this.bookings = (await getBookings()) || []
      } catch (e) {
        this.error = e.message || 'Could not delete booking'
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
 
button.danger {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  background: #c0392b;
  color: #fff;
  cursor: pointer;
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
 
.student-card {
  border: 1px solid #eef2f6;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
}
 
.student-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 8px;
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
</style>