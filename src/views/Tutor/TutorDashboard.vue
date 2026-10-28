<template>
  <div class="dashboard-layout">
    <main class="dashboard-content">
      <section class="dashboard-header">
        <h1>Welcome back, {{ fullName }}</h1>
        <p class="header-description">
          Manage your sessions and tutoring activity.
        </p>
      </section>

      <section class="summary-cards">
        <div class="summary-card clickable-card" @click="changePage('today')">
          <span class="summary-label">TODAY</span>
          <h2>{{ todaysSessions.length }}</h2>
          <p>Today's Sessions</p>
        </div>

        <div class="summary-card clickable-card" @click="changePage('upcoming')">
          <span class="summary-label">UPCOMING</span>
          <h2>{{ upcomingSessions.length }}</h2>
          <p>Upcoming Sessions</p>
        </div>

        <div class="summary-card clickable-card" @click="changePage('completed')">
          <span class="summary-label">COMPLETED</span>
          <h2>{{ completedSessions.length }}</h2>
          <p>Completed Sessions</p>
        </div>

        <div class="summary-card clickable-card" @click="changePage('cancelled')">
          <span class="summary-label">CANCELLED</span>
          <h2>{{ cancelledSessions.length }}</h2>
          <p>Cancelled Sessions</p>
        </div>
      </section>

      <section class="dashboard-card">
        <div class="card-header">
          <div>
            <h2>Today's Sessions</h2>
            <p>Your tutoring schedule for today</p>
          </div>

          <button class="text-button" @click="changePage('today')">
            View All
          </button>
        </div>

        <div v-if="todaysSessions.length === 0" class="empty-state">
          <div class="empty-circle">—</div>
          <h3>No sessions scheduled</h3>
          <p>You don't have any tutoring sessions scheduled for today.</p>
        </div>

        <div v-else class="session-list">
          <div
            v-for="session in todaysSessions"
            :key="session.bookingId"
            class="session-row"
          >
            <div>
              <strong>{{ session.subjectCode }}</strong>
              <p>{{ session.sessionType }}</p>
            </div>

            <div class="session-time">
              {{ formatTime(session.date) }}
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import { getSession } from '@/services/authService'
import { getTutorById, getTutorSessions } from '@/services/tutorService'

const CANCELLED_STORAGE_KEY = 'tutorCancelledSessions'
const DELETED_STORAGE_KEY = 'tutorDeletedBookingIds'

export default {
  name: 'TutorDashboard',

  data() {
    return {
      session: null,
      tutor: {
        tutorId: '',
        firstName: '',
        lastName: '',
        email: ''
      },
      todaysSessions: [],
      upcomingSessions: [],
      completedSessions: [],
      cancelledSessions: []
    }
  },

  computed: {
    fullName() {
      const name =
        `${this.tutor.firstName} ${this.tutor.lastName}`.trim()

      if (name) return name

      return this.session && this.session.name
        ? this.session.name
        : 'Tutor'
    }
  },

  async created() {
    const session = getSession()

    if (!session || session.role !== 'tutor' || !session.id) {
      return
    }

    this.session = session

    try {
      const tutor = await getTutorById(session.id)

      if (tutor && Object.keys(tutor).length) {
        this.tutor = {
          tutorId: tutor.tutorId || '',
          firstName: tutor.firstName || '',
          lastName: tutor.lastName || '',
          email: tutor.email || ''
        }
      }
    } catch (error) {
      console.error('Could not load tutor details:', error)
    }

    await this.loadDashboardBookings()
  },

  mounted() {
    window.addEventListener(
      'tutor-cancellations-updated',
      this.loadDashboardBookings
    )
  },

  beforeUnmount() {
    window.removeEventListener(
      'tutor-cancellations-updated',
      this.loadDashboardBookings
    )
  },

  methods: {
    changePage(page) {
      this.$emit('change-page', page)
    },

    getStoredSessions() {
      try {
        const saved = JSON.parse(
          localStorage.getItem(CANCELLED_STORAGE_KEY) || '[]'
        )

        return Array.isArray(saved) ? saved : []
      } catch {
        return []
      }
    },

    getStoredIds(key) {
      try {
        const saved = JSON.parse(localStorage.getItem(key) || '[]')
        return Array.isArray(saved) ? saved.map(String) : []
      } catch {
        return []
      }
    },

    async loadDashboardBookings() {
      try {
        if (!this.session || !this.session.id) return

        this.cancelledSessions = this.getStoredSessions()

        const bookings = await getTutorSessions(this.session.id)
        const allBookings = Array.isArray(bookings) ? bookings : []

        const excludedIds = new Set([
          ...this.cancelledSessions.map(
            booking => String(booking.bookingId)
          ),
          ...this.getStoredIds(DELETED_STORAGE_KEY)
        ])

        const activeBookings = allBookings.filter(booking =>
          !excludedIds.has(String(booking.bookingId)) &&
          booking.payment &&
          String(booking.payment.status).trim().toUpperCase() === 'PAID'
        )

        const now = new Date()

        this.todaysSessions = activeBookings.filter(booking => {
          if (!booking.date) return false

          const date = new Date(booking.date)

          return (
            !Number.isNaN(date.getTime()) &&
            date.toDateString() === now.toDateString()
          )
        })

        this.upcomingSessions = activeBookings.filter(booking => {
          if (!booking.date) return false

          const date = new Date(booking.date)

          return !Number.isNaN(date.getTime()) && date > now
        })

        this.completedSessions = allBookings.filter(booking => {
  if (!booking.date) return false

  const date = new Date(booking.date)

  return !Number.isNaN(date.getTime()) && date < now
})
      } catch (error) {
        console.error('Could not load dashboard bookings:', error)
        this.todaysSessions = []
        this.upcomingSessions = []
        this.completedSessions = []
        this.cancelledSessions = this.getStoredSessions()
      }
    },

    formatTime(date) {
      if (!date) return ''

      const parsedDate = new Date(date)

      if (Number.isNaN(parsedDate.getTime())) return ''

      return parsedDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }
}
</script>

<style scoped>
.dashboard-layout {
  min-height: 100vh;
  background-color: #f7f8fa;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  text-align: left;
}

.dashboard-content {
  padding: 30px;
  box-sizing: border-box;
}

.dashboard-header {
  background-color: #2c3e50;
  color: #ffffff;
  padding: 32px;
  border-radius: 12px;
  margin-bottom: 22px;
}

.dashboard-header h1 {
  font-size: 30px;
  margin: 0;
}

.header-description {
  color: #d7dde3;
  font-size: 14px;
  margin: 7px 0 0;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 22px;
}

.summary-card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-top: 4px solid #f28c28;
  border-radius: 10px;
  padding: 20px;
}

.summary-label {
  color: #8a94a3;
  font-size: 10px;
  font-weight: bold;
  letter-spacing: 1px;
}

.summary-card h2 {
  color: #2c3e50;
  font-size: 32px;
  margin: 15px 0 2px;
}

.summary-card p {
  color: #8a94a3;
  font-size: 13px;
  margin: 0;
}

.clickable-card {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.clickable-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(44, 62, 80, 0.12);
}

.dashboard-card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 22px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 14px;
  border-bottom: 1px solid #e5e7eb;
}

.card-header h2 {
  font-size: 17px;
  margin: 0;
}

.card-header p {
  color: #8a94a3;
  font-size: 12px;
  margin: 4px 0 0;
}

.text-button {
  border: none;
  background: none;
  color: #f28c28;
  font-family: inherit;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
}

.text-button:hover {
  text-decoration: underline;
}

.empty-state {
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.empty-circle {
  width: 38px;
  height: 38px;
  background-color: #fff3e7;
  color: #f28c28;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 10px;
}

.empty-state h3 {
  margin: 0 0 5px;
  font-size: 14px;
}

.empty-state p {
  color: #8a94a3;
  font-size: 12px;
  margin: 0;
}

.session-list {
  padding-top: 8px;
}

.session-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid #e5e7eb;
}

.session-row:last-child {
  border-bottom: none;
}

.session-row strong {
  font-size: 14px;
}

.session-row p {
  margin: 5px 0 0;
  color: #8a94a3;
  font-size: 12px;
}

.session-time {
  font-size: 13px;
  font-weight: bold;
}

@media (max-width: 1050px) {
  .summary-cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .dashboard-content {
    padding: 16px;
  }

  .summary-cards {
    grid-template-columns: 1fr;
  }

  .dashboard-header {
    padding: 24px;
  }

  .dashboard-header h1 {
    font-size: 24px;
  }
}
</style>