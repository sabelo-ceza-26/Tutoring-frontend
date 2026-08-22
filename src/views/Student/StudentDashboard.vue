<template>
  <div class="dashboard">
    <!-- HERO -->
    <header class="hero">
      <div class="hero-left">
        <div>
          <h1>Welcome back, {{ me.firstName }}</h1>
          <p class="hero-sub">
            <span class="pill">{{ me.studentNumber }}</span>
            <span v-if="me.levelOfStudy" class="pill subtle">{{ me.levelOfStudy }}</span>
          </p>
        </div>
      </div>
      <button type="button" class="btn ghost-light" @click="activeTab = 'profile'">
        Profile
      </button>
    </header>

    <!-- STATS -->
    <div class="stats-row">
      <div class="stat-card">
        <div><p class="stat-value">{{ upcomingBookings.length }}</p><p class="stat-label">Upcoming sessions</p></div>
      </div>
      <div class="stat-card">
        <div><p class="stat-value">{{ pastBookings.length }}</p><p class="stat-label">Sessions completed</p></div>
      </div>
      <div class="stat-card">
        <div><p class="stat-value">{{ fmtR(totalSpent) }}</p><p class="stat-label">Total spent</p></div>
      </div>
    </div>

    <!-- TABS -->
    <nav class="tabs">
      <button
        v-for="t in tabs"
        :key="t.id"
        type="button"
        :class="{ active: activeTab === t.id }"
        @click="activeTab = t.id"
      >
        {{ t.label }}
      </button>
    </nav>

    <transition name="fade" mode="out-in">
      <p v-if="error" key="err" class="banner error-banner">{{ error }}</p>
      <p v-else-if="success" key="ok" class="banner success-banner">{{ success }}</p>
    </transition>

    <!-- BOOKINGS -->
    <section v-if="activeTab === 'bookings'" class="panel">
      <div class="section-head">
        <h2>Upcoming Bookings</h2>
        <button type="button" class="btn" @click="activeTab = 'book'">+ New Booking</button>
      </div>

      <div v-if="!upcomingBookings.length" class="empty-state">
        <h3>Nothing scheduled yet</h3>
        <p class="muted">Book a session with one of our tutors and it will show up here.</p>
        <button type="button" class="btn" @click="activeTab = 'book'">Book your first session</button>
      </div>
      <div v-else class="table-wrap">
        <table class="data-table">
          <thead>
            <tr><th>When</th><th>Subject</th><th>Tutor</th><th>Type</th><th>Duration</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            <tr v-for="b in upcomingBookings" :key="b.bookingId">
              <td class="strong">{{ formatDate(b.date) }}</td>
              <td>{{ subjectName(b.subjectCode) }}</td>
              <td>{{ tutorName(b.bookingId) }}</td>
              <td><span class="chip neutral">{{ b.sessionType }}</span></td>
              <td>{{ b.duration }} min</td>
              <td><span :class="['chip', b.payment ? 'paid' : 'unpaid']">{{ b.payment ? 'Paid' : 'Unpaid' }}</span></td>
              <td class="actions">
                <button v-if="!b.payment" type="button" class="btn small" @click="openPay(b)">Pay now</button>
                <button type="button" class="btn small danger-outline" @click="cancelBooking(b)">Cancel</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 class="mt">Past Bookings</h2>
      <div v-if="!pastBookings.length" class="empty-state slim">
        <p class="muted">Completed sessions will be archived here.</p>
      </div>
      <div v-else class="table-wrap">
        <table class="data-table">
          <thead>
            <tr><th>When</th><th>Subject</th><th>Tutor</th><th>Type</th><th>Duration</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            <tr v-for="b in pastBookings" :key="b.bookingId" class="row-dim">
              <td class="strong">{{ formatDate(b.date) }}</td>
              <td>{{ subjectName(b.subjectCode) }}</td>
              <td>{{ tutorName(b.bookingId) }}</td>
              <td><span class="chip neutral">{{ b.sessionType }}</span></td>
              <td>{{ b.duration }} min</td>
              <td><span :class="['chip', b.payment ? 'paid' : 'unpaid']">{{ b.payment ? 'Paid' : 'Unpaid' }}</span></td>
              <td class="actions">
                <button v-if="!b.payment" type="button" class="btn small" @click="openPay(b)">Pay now</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- BOOK SESSION -->
    <section v-else-if="activeTab === 'book'" class="panel narrow">
      <div class="form-card">
        <h2>Make a Tutoring Booking</h2>
        <p class="muted">Pick a tutor, subject and time that suits you.</p>
        <form @submit.prevent="createNewBooking">
          <div class="grid-2">
            <label>Tutor
              <select v-model="bookingForm.tutorId" required>
                <option value="" disabled>Select a tutor</option>
                <option v-for="t in tutors" :key="t.tutorId" :value="t.tutorId">
                  {{ t.firstName }} {{ t.lastName }} &mdash; {{ fmtR(t.hourlyRate) }}/hr
                </option>
              </select>
            </label>
            <label>Subject
              <select v-model="bookingForm.subjectCode" required>
                <option value="" disabled>Select a subject</option>
                <option v-for="s in subjects" :key="s.subjectCode" :value="s.subjectCode">
                  {{ s.subjectName }} ({{ s.subjectCode }})
                </option>
              </select>
            </label>
            <label>Session Type
              <select v-model="bookingForm.sessionType" required>
                <option value="" disabled>Select type</option>
                <option>Online</option>
                <option>In-person</option>
              </select>
            </label>
            <label>Duration
              <select v-model="bookingForm.duration" required>
                <option value="" disabled>Select duration</option>
                <option value="30">30 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
                <option value="120">120 minutes</option>
              </select>
            </label>
          </div>
          <label>Date &amp; Time
            <input v-model="bookingForm.date" type="datetime-local" :min="minDateTime" required>
          </label>
          <div v-if="estimatedCost !== null" class="cost-estimate">
            Estimated cost <strong>{{ fmtR(estimatedCost) }}</strong>
          </div>
          <button type="submit" class="btn block" :disabled="loading">
            {{ loading ? 'Booking...' : 'Confirm Booking' }}
          </button>
        </form>
      </div>
    </section>

    <!-- PAYMENTS -->
    <section v-else-if="activeTab === 'payments'" class="panel">
      <div class="section-head"><h2>Recent Payments</h2></div>
      <div v-if="!recentPayments.length" class="empty-state">
        <h3>No payments yet</h3>
        <p class="muted">Payments you make for bookings will appear here.</p>
      </div>
      <div v-else class="table-wrap">
        <table class="data-table">
          <thead>
            <tr><th>Reference</th><th>Amount</th><th>Date Paid</th><th>Method</th><th>Status</th><th>For</th></tr>
          </thead>
          <tbody>
            <tr v-for="p in recentPayments" :key="p.paymentRef">
              <td class="mono">{{ p.paymentRef }}</td>
              <td class="strong green-text">{{ fmtR(p.amount) }}</td>
              <td>{{ formatDate(p.paymentDate) }}</td>
              <td><span class="chip neutral">{{ p.paymentMethod }}</span></td>
              <td><span class="chip paid">{{ p.status }}</span></td>
              <td>{{ subjectName(p._subjectCode) }} &mdash; {{ formatDate(p._bookingDate) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- TUTORS -->
    <section v-else-if="activeTab === 'tutors'" class="panel">
      <div class="section-head"><h2>Our Tutors</h2></div>
      <div v-if="!tutors.length" class="empty-state">
        <h3>No tutors listed yet</h3>
        <p class="muted">Check back soon - tutors appear here as they join.</p>
      </div>
      <div v-else class="tutor-grid">
        <div v-for="t in tutors" :key="t.tutorId" class="tutor-card">
          <div class="tutor-top">
            <div class="tutor-avatar">{{ t.firstName.charAt(0) }}{{ t.lastName.charAt(0) }}</div>
            <div>
              <h3>{{ t.firstName }} {{ t.lastName }}</h3>
              <p class="muted small-text">{{ t.tutorId }}</p>
            </div>
            <span class="rate-badge">{{ fmtR(t.hourlyRate) }}/hr</span>
          </div>
          <div class="tutor-meta">
            <p>&#9993; {{ t.email }}</p>
            <p>&#128222; {{ t.phoneNumber }}</p>
          </div>
          <button type="button" class="btn block" @click="bookWith(t)">Book with {{ t.firstName }}</button>
        </div>
      </div>
    </section>

    <!-- HISTORY -->
    <section v-else-if="activeTab === 'history'" class="panel">
      <div class="section-head"><h2>Full Booking History</h2></div>
      <div v-if="!allBookings.length" class="empty-state">
        <h3>No history yet</h3>
        <p class="muted">Every booking you make is recorded here.</p>
      </div>
      <div v-else class="table-wrap">
        <table class="data-table">
          <thead>
            <tr><th>Booking ID</th><th>Date</th><th>Subject</th><th>Tutor</th><th>Type</th><th>Duration</th><th>Amount</th><th>Status</th></tr>
          </thead>
          <tbody>
            <tr v-for="b in sortedHistory" :key="b.bookingId">
              <td class="mono">{{ b.bookingId }}</td>
              <td class="strong">{{ formatDate(b.date) }}</td>
              <td>{{ subjectName(b.subjectCode) }}</td>
              <td>{{ tutorName(b.bookingId) }}</td>
              <td><span class="chip neutral">{{ b.sessionType }}</span></td>
              <td>{{ b.duration }} min</td>
              <td class="strong">{{ b.payment ? fmtR(b.payment.amount) : '&mdash;' }}</td>
              <td><span :class="['chip', b.payment ? 'paid' : 'unpaid']">{{ b.payment ? 'Paid' : 'Unpaid' }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- PROFILE -->
    <section v-else-if="activeTab === 'profile'" class="panel narrow">
      <div class="form-card">
        <h2>Profile</h2>
        <p class="muted">Keep your details up to date.</p>
        <form @submit.prevent="saveProfile">
          <label>Student Number<input v-model="profileForm.studentNumber" type="text" disabled></label>
          <div class="grid-2">
            <label>First Name<input v-model.trim="profileForm.firstName" type="text" required></label>
            <label>Last Name<input v-model.trim="profileForm.lastName" type="text" required></label>
          </div>
          <label>Email<input v-model.trim="profileForm.email" type="email" required></label>
          <div class="grid-2">
            <label>Phone Number<input v-model.trim="profileForm.phoneNumber" type="text" required></label>
            <label>Level of Study<input v-model.trim="profileForm.levelOfStudy" type="text" required></label>
          </div>
          <button type="submit" class="btn block" :disabled="loading">
            {{ loading ? 'Saving...' : 'Update Profile' }}
          </button>
          <button type="button" class="btn ghost block pw-btn" @click="$router.push('/change-password')">
            Change Password
          </button>
        </form>
      </div>

      <div class="danger-zone">
        <h3>Danger Zone</h3>
        <p class="muted">Permanently delete your account and sign out. Your booking history will be removed.</p>
        <button type="button" class="btn danger" @click="deleteMyAccount">Delete My Account</button>
      </div>
    </section>

    <!-- PAY MODAL -->
    <transition name="pop">
      <div v-if="payTarget" class="modal-backdrop" @click.self="payTarget = null">
        <form class="modal" @submit.prevent="confirmPay">
          <div class="modal-head">
            <h3>Complete Payment</h3>
            <button type="button" class="close-x" @click="payTarget = null">&times;</button>
          </div>
          <p class="muted modal-context">
            {{ subjectName(payTarget.subjectCode) }} with {{ tutorName(payTarget.bookingId) }}<br>
            {{ formatDate(payTarget.date) }}
          </p>
          <label>Amount (ZAR)
            <input v-model.number="paymentForm.amount" type="number" step="0.01" min="0" required>
          </label>
          <label>Payment Method
            <select v-model="paymentForm.paymentMethod" required>
              <option value="" disabled>Select method</option>
              <option>Card</option>
              <option>EFT</option>
              <option>Cash</option>
            </select>
          </label>
          <p v-if="error" class="error">{{ error }}</p>
          <button type="submit" class="btn block" :disabled="loading">
            {{ loading ? 'Processing...' : 'Pay Now' }}
          </button>
        </form>
      </div>
    </transition>
  </div>
</template>

<script>
import { getSession, logout } from '@/services/authService'
import { getStudentById, updateStudent, deleteStudent } from '@/services/studentService'
import { getAllTutors } from '@/services/tutorService'
import { getAllSubjects } from '@/services/subjectService'
import { createBooking, deleteBooking } from '@/services/bookingService'
import { createPayment } from '@/services/paymentService'

export default {
  name: 'StudentDashboard',
  data() {
    return {
      tabs: [
        { id: 'bookings', label: 'My Bookings' },
        { id: 'book', label: 'Book Session' },
        { id: 'payments', label: 'Payments' },
        { id: 'tutors', label: 'Tutors' },
        { id: 'history', label: 'History' }
      ],
      activeTab: 'bookings',
      session: getSession(),
      me: {},
      tutors: [],
      subjects: [],
      error: '',
      success: '',
      loading: false,
      payTarget: null,
      paymentForm: { amount: 0, paymentMethod: '' },
      bookingForm: { tutorId: '', subjectCode: '', sessionType: '', duration: '', date: '' },
      profileForm: {}
    }
  },
  computed: {
    myBookings() {
      return this.me.bookings || []
    },
    allBookings() {
      return this.myBookings
    },
    upcomingBookings() {
      const now = Date.now()
      return this.myBookings
        .filter(b => new Date(b.date).getTime() >= now)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
    },
    pastBookings() {
      const now = Date.now()
      return this.myBookings
        .filter(b => new Date(b.date).getTime() < now)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
    },
    sortedHistory() {
      return [...this.myBookings].sort((a, b) => new Date(b.date) - new Date(a.date))
    },
    recentPayments() {
      return this.myBookings
        .filter(b => b.payment)
        .map(b => ({
          ...b.payment,
          _subjectCode: b.subjectCode,
          _bookingDate: b.date
        }))
        .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))
    },
    totalSpent() {
      return this.myBookings.reduce((sum, b) => sum + Number(b.payment ? b.payment.amount : 0), 0)
    },    estimatedCost() {
      const tutor = this.tutors.find(t => t.tutorId === this.bookingForm.tutorId)
      if (!tutor || !this.bookingForm.duration) return null
      return (Number(tutor.hourlyRate || 0) * Number(this.bookingForm.duration)) / 60
    },
    minDateTime() {
      const d = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      return d.toISOString().slice(0, 16)
    }
  },
  async created() {
    if (this.$route.name === 'profile') {
      this.activeTab = 'profile'
    }
    await this.loadAll()
  },
  watch: {
    $route(to) {
      if (to.name === 'profile') {
        this.activeTab = 'profile'
        this.error = ''
        this.success = ''
      }
    }
  },
  methods: {
    async loadAll() {
      this.error = ''
      try {
        const [me, tutors, subjects] = await Promise.all([
          getStudentById(this.session.id),
          getAllTutors(),
          getAllSubjects()
        ])
        this.me = me
        if (!me || !me.studentNumber) {
          logout()
          this.$router.push('/login')
          return
        }
        this.profileForm = {
          studentNumber: me.studentNumber,
          firstName: me.firstName,
          lastName: me.lastName,
          email: me.email,
          phoneNumber: me.phoneNumber,
          levelOfStudy: me.levelOfStudy
        }
        this.tutors = tutors
        this.subjects = subjects
      } catch (e) {
        this.error = e.message
      }
    },
    flash(message) {
      this.success = message
      setTimeout(() => { this.success = '' }, 3500)
    },
    fmtR(value) {
      return `R${Number(value || 0).toFixed(2)}`
    },
    subjectName(code) {
      const s = this.subjects.find(x => x.subjectCode === code)
      return s ? s.subjectName : code
    },
    tutorName(bookingId) {
      for (const t of this.tutors) {
        if ((t.bookings || []).some(b => b.bookingId === bookingId)) {
          return `${t.firstName} ${t.lastName}`
        }
      }
      return 'Unknown'
    },
    formatDate(value) {
      if (!value) return '-'
      return new Date(value).toLocaleString('en-ZA', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      })
    },
    bookWith(tutor) {
      this.bookingForm.tutorId = tutor.tutorId
      this.activeTab = 'book'
    },
    openPay(booking) {
      this.error = ''
      const tutor = this.tutors.find(t => (t.bookings || []).some(b => b.bookingId === booking.bookingId))
      const hours = Number(booking.duration || 60) / 60
      this.paymentForm.amount = tutor ? Number((Number(tutor.hourlyRate || 0) * hours).toFixed(2)) : 0
      this.payTarget = booking
    },
    async cancelBooking(booking) {
      if (!window.confirm(`Cancel your ${this.subjectName(booking.subjectCode)} booking on ${this.formatDate(booking.date)}?`)) return
      this.error = ''
      try {
        await deleteBooking(booking.bookingId)
        await this.loadAll()
        this.flash('Booking cancelled.')
      } catch (e) {
        this.error = e.message
      }
    },
    async createNewBooking() {
      this.error = ''
      if (new Date(this.bookingForm.date).getTime() <= Date.now()) {
        this.error = 'Please choose a future date and time.'
        return
      }
      this.loading = true
      try {
        await createBooking({
          bookingId: `BK-${Date.now()}`,
          subjectCode: this.bookingForm.subjectCode,
          sessionType: this.bookingForm.sessionType,
          duration: String(this.bookingForm.duration),
          date: `${this.bookingForm.date}:00`,
          student: { studentNumber: this.session.id },
          tutor: { tutorId: this.bookingForm.tutorId }
        })
        this.bookingForm = { tutorId: '', subjectCode: '', sessionType: '', duration: '', date: '' }
        this.activeTab = 'bookings'
        await this.loadAll()
        this.flash('Booking confirmed!')
      } catch (e) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    },
    async confirmPay() {
      this.error = ''
      this.loading = true
      try {
        await createPayment({
          paymentRef: `PM-${Date.now()}`,
          amount: this.paymentForm.amount,
          paymentDate: new Date().toISOString().slice(0, 19),
          paymentMethod: this.paymentForm.paymentMethod,
          status: 'PAID',
          booking: { bookingId: this.payTarget.bookingId }
        })
        this.payTarget = null
        await this.loadAll()
        this.flash('Payment successful!')
      } catch (e) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    },
    async saveProfile() {
      this.error = ''
      this.loading = true
      try {
        await updateStudent({
          ...this.profileForm,
          password: this.me.password
        })
        this.session.name = `${this.profileForm.firstName} ${this.profileForm.lastName}`
        localStorage.setItem('tutoring_session', JSON.stringify(this.session))
        await this.loadAll()
        this.flash('Profile updated.')
      } catch (e) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    },
    async deleteMyAccount() {
      const ok = window.confirm('This will permanently delete your account. Continue?')
      if (!ok) return
      this.error = ''
      try {
        await deleteStudent(this.me.studentNumber)
        logout()
        this.$router.push('/login')
      } catch (e) {
        this.error = e.message
      }
    }
  }
}
</script>

<style scoped>
.dashboard {
  max-width: 1100px;
  margin: 24px auto 60px;
  padding: 0 20px;
}

/* HERO */
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
  background: linear-gradient(120deg, #24435c 0%, #2c3e50 55%, #256d51 100%);
  border-radius: 16px;
  padding: 34px 36px;
  color: #fff;
  box-shadow: 0 8px 22px rgba(31, 59, 83, 0.28);
}

.hero-left {
  display: flex;
  align-items: center;
  gap: 18px;
}

.hero h1 {
  margin: 0 0 10px;
  font-size: 32px;
}

.hero-sub {
  margin: 0;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.pill {
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 4px 14px;
  border-radius: 999px;
  font-size: 14px;
}

.pill.subtle {
  background: transparent;
}

/* STATS */
.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin: 20px 0;
}

.stat-card {
  background: #fff;
  padding: 20px 22px;
  border-radius: 12px;
  border-left: 5px solid #42b983;
  box-shadow: 0 2px 10px rgba(44, 62, 80, 0.08);
}

.stat-value {
  margin: 0;
  font-size: 30px;
  font-weight: bold;
  color: #2c3e50;
}

.stat-label {
  margin: 4px 0 0;
  font-size: 15px;
  color: #6b7a89;
}

/* TABS */
.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 24px 0 8px;
}

.tabs button {
  padding: 11px 22px;
  border: 1px solid #d7dfe8;
  background: #fff;
  border-radius: 999px;
  cursor: pointer;
  font-size: 15.5px;
  color: #2c3e50;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}

.tabs button:hover {
  border-color: #42b983;
  color: #1e7a58;
}

.tabs button.active {
  background: #2c3e50;
  border-color: #2c3e50;
  color: #fff;
}

/* BANNERS */
.banner {
  padding: 13px 18px;
  border-radius: 10px;
  font-size: 15.5px;
}

.error-banner {
  background: #fce8e6;
  color: #96281b;
  border: 1px solid #f2b8b5;
}

.success-banner {
  background: #dff3e8;
  color: #1e7a58;
  border: 1px solid #b7e4cd;
}

/* PANELS */
.panel h2 {
  margin: 30px 0 14px;
  font-size: 22px;
  padding-bottom: 8px;
  border-bottom: 3px solid #42b983;
  display: inline-block;
}

.panel h2.mt {
  margin-top: 36px;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.section-head h2 {
  margin-bottom: 12px;
}

.panel.narrow {
  max-width: 660px;
}

/* TABLES */
.table-wrap {
  overflow-x: auto;
  border-radius: 10px;
  border: 1px solid #e4e9ef;
  box-shadow: 0 2px 10px rgba(44, 62, 80, 0.07);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  min-width: 720px;
}

.data-table th,
.data-table td {
  text-align: left;
  padding: 14px 16px;
  font-size: 15.5px;
  border-bottom: 1px solid #edf1f5;
}

.data-table th {
  background: #f2f6f9;
  font-size: 13.5px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #55657a;
}

.data-table tbody tr {
  transition: background 0.12s ease;
}

.data-table tbody tr:hover {
  background: #f5faf7;
}

.row-dim td {
  color: #8395a7;
}

.strong {
  font-weight: 600;
}

.mono {
  font-family: monospace;
  font-size: 14px;
  color: #61748a;
}

.green-text {
  color: #1e7a58;
  font-weight: bold;
}

.actions {
  white-space: nowrap;
}

/* CHIPS */
.chip {
  padding: 4px 13px;
  border-radius: 999px;
  font-size: 13.5px;
  font-weight: 600;
  white-space: nowrap;
}

.chip.paid {
  background: #dff3e8;
  color: #1e7a58;
}

.chip.unpaid {
  background: #fce8e6;
  color: #c0392b;
}

.chip.neutral {
  background: #eef2f7;
  color: #5d6d7e;
}

/* BUTTONS */
.btn {
  padding: 11px 20px;
  border: none;
  border-radius: 8px;
  background: #2f9e69;
  color: #fff;
  font-size: 15.5px;
  cursor: pointer;
  transition: background 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
  white-space: nowrap;
}

.btn:hover {
  background: #26855a;
  box-shadow: 0 4px 12px rgba(38, 133, 90, 0.3);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

.btn.small {
  padding: 7px 14px;
  font-size: 14px;
}

.btn.block {
  display: block;
  width: 100%;
  margin-top: 6px;
}

.btn.danger {
  background: #c74a3b;
}

.btn.danger:hover {
  background: #a83a2d;
  box-shadow: 0 4px 12px rgba(168, 58, 45, 0.3);
}

.btn.danger-outline {
  background: #fff;
  color: #c0392b;
  border: 1px solid #e0a9a2;
}

.btn.danger-outline:hover {
  background: #fbeae8;
  box-shadow: none;
}

.btn.ghost-light {
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.45);
  color: #fff;
}

.btn.ghost-light:hover {
  background: rgba(255, 255, 255, 0.26);
  box-shadow: none;
}

/* EMPTY STATES */
.empty-state {
  text-align: center;
  background: #fff;
  border: 2px dashed #cfd9e3;
  border-radius: 12px;
  padding: 44px 24px;
  margin-bottom: 8px;
}

.empty-state.slim {
  padding: 26px;
}

.empty-state h3 {
  margin: 4px 0 8px;
  font-size: 20px;
}

.empty-state .btn {
  margin-top: 14px;
}

/* FORM CARDS */
.form-card {
  background: #fff;
  border-radius: 12px;
  border-top: 4px solid #42b983;
  box-shadow: 0 2px 10px rgba(44, 62, 80, 0.08);
  padding: 28px 30px;
}

.form-card h2 {
  margin: 0 0 6px;
  font-size: 23px;
}

.form-card .muted {
  font-size: 15.5px;
}

.form-card form,
.modal form {
  margin-top: 16px;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 600px) {
  .grid-2 {
    grid-template-columns: 1fr;
  }
}

.form-card label,
.modal label {
  display: flex;
  flex-direction: column;
  gap: 7px;
  font-size: 14px;
  font-weight: bold;
  color: #55657a;
  text-align: left;
  margin-bottom: 16px;
}

.form-card input,
.form-card select,
.modal input,
.modal select {
  padding: 12px 14px;
  border: 1px solid #c5cfdc;
  border-radius: 7px;
  font-size: 15.5px;
  font-weight: normal;
  color: #2c3e50;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.form-card input:focus,
.form-card select:focus,
.modal input:focus,
.modal select:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.18);
}

.form-card input[disabled] {
  background: #f0f3f7;
  color: #7f8c8d;
}

.cost-estimate {
  background: #e7f4ef;
  border: 1px solid #bfe3d4;
  color: #17614a;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 15.5px;
  margin-bottom: 18px;
}

/* TUTORS */
.tutor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 18px;
}

.tutor-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(44, 62, 80, 0.08);
  padding: 22px;
}

.tutor-top {
  display: flex;
  align-items: center;
  gap: 14px;
}

.tutor-avatar {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: #2c3e50;
  color: #fff;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.tutor-top h3 {
  margin: 0;
  font-size: 19px;
}

.small-text {
  font-size: 13.5px;
  margin: 3px 0 0;
  color: #6b7a89;
}

.rate-badge {
  margin-left: auto;
  background: #e7f4ef;
  color: #1e7a58;
  font-weight: bold;
  font-size: 14px;
  padding: 5px 12px;
  border-radius: 999px;
  white-space: nowrap;
}

.tutor-meta {
  margin: 16px 0 18px;
}

.tutor-meta p {
  margin: 6px 0;
  font-size: 15px;
  color: #55657a;
  word-break: break-all;
}

.btn.ghost {
  background: #fff;
  color: #1e7a58;
  border: 1px solid #2f9e69;
}

.btn.ghost:hover {
  background: #edf8f3;
  box-shadow: none;
}

.pw-btn {
  margin-top: 12px;
}

/* PROFILE DANGER ZONE */
.danger-zone {
  background: #fdf4f3;
  border: 1px solid #eec7c3;
  border-radius: 12px;
  padding: 24px 26px;
  margin-top: 22px;
}

.danger-zone h3 {
  margin: 0 0 8px;
  font-size: 19px;
  color: #96281b;
}

.danger-zone p {
  font-size: 15px;
  margin: 0 0 16px;
}

/* MODAL */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(23, 37, 51, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 16px;
}

.modal {
  width: 440px;
  max-width: 100%;
  background: #fff;
  border-radius: 14px;
  padding: 28px 30px;
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.28);
}

.modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-head h3 {
  margin: 0;
  font-size: 22px;
}

.close-x {
  border: none;
  background: #eef2f7;
  color: #61748a;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
}

.close-x:hover {
  background: #fbeae8;
  color: #c0392b;
}

.modal-context {
  font-size: 15.5px;
  margin: 10px 0 18px;
  line-height: 1.5;
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

.pop-enter-active {
  transition: opacity 0.2s ease;
}

.pop-enter-active .modal {
  transition: transform 0.2s ease-out;
}

.pop-enter,
.pop-leave-to {
  opacity: 0;
}

.pop-enter .modal {
  transform: scale(0.92) translateY(10px);
}
</style>
