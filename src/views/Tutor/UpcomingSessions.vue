<template>
  <div class="sessions-layout">
    <main class="sessions-content">

      <section class="sessions-header">
        <div>
          <p class="header-label">SESSIONS</p>
          <h1>Upcoming Sessions</h1>
          <p class="header-description">
            View your upcoming tutoring sessions and scheduled bookings.
          </p>
        </div>
      </section>

      <section class="session-summary">
        <div class="summary-card">
          <p class="summary-label">TOTAL UPCOMING</p>
          <h2>{{ upcomingSessions.length }}</h2>
          <p>Upcoming sessions</p>
        </div>

        <div class="summary-card">
          <p class="summary-label">ONLINE</p>
          <h2>{{ onlineUpcoming }}</h2>
          <p>Online sessions</p>
        </div>

        <div class="summary-card">
          <p class="summary-label">IN PERSON</p>
          <h2>{{ inPersonUpcoming }}</h2>
          <p>In-person sessions</p>
        </div>
      </section>

      <section class="sessions-card">
        <div class="card-header">
          <div>
            <h2>Upcoming Schedule</h2>
            <p>Your scheduled tutoring sessions</p>
          </div>
        </div>

        <div class="table-header">
          <span>Date</span>
          <span>Time</span>
          <span>Student Number</span>
          <span>Subject</span>
          <span>Duration</span>
          <span>Session Type</span>
        </div>

        <div
          v-for="session in upcomingSessions"
          :key="session.bookingId"
          class="session-row"
        >
          <span>{{ formatDate(session.date) }}</span>
          <span>{{ formatTime(session.date) }}</span>
          <span>{{ getStudentNumber(session) }}</span>
          <span>{{ session.subjectCode }}</span>
          <span>{{ session.duration }} min</span>
          <span>{{ session.sessionType }}</span>
        </div>

        <div
          v-if="upcomingSessions.length === 0"
          class="empty-state"
        >
          <div class="empty-circle">—</div>
          <h3>No upcoming sessions</h3>
          <p>You don't have any upcoming tutoring sessions scheduled.</p>
        </div>
      </section>

    </main>
  </div>
</template>

<script>
export default {
  name: "UpcomingSessions",

  data() {
    return {
      upcomingSessions: [],
      students: []
    }
  },

  computed: {
    onlineUpcoming() {
      return this.upcomingSessions.filter(session =>
        this.normalizeSessionType(session.sessionType) === "online"
      ).length
    },

    inPersonUpcoming() {
      return this.upcomingSessions.filter(session =>
        this.normalizeSessionType(session.sessionType) === "in person"
      ).length
    }
  },

  async mounted() {
    await this.loadUpcomingSessions()
  },

  methods: {
    getStudentNumber(session) {
      const matchingStudent = this.students.find(student =>
        Array.isArray(student.bookings) &&
        student.bookings.some(booking =>
          booking.bookingId === session.bookingId
        )
      )

      if (matchingStudent) {
        return matchingStudent.studentNumber
      }

      return "Student not found"
    },

    normalizeSessionType(type) {
      return (type || "")
        .toLowerCase()
        .trim()
        .replace(/[_-]/g, " ")
    },

    async loadUpcomingSessions() {
      try {
        const [bookingResponse, studentResponse] = await Promise.all([
          fetch("/tutoring/booking/getAll"),
          fetch("/tutoring/student/getAll")
        ])

        if (!bookingResponse.ok) {
          throw new Error("Failed to load bookings")
        }

        if (!studentResponse.ok) {
          throw new Error("Failed to load students")
        }

        const bookings = await bookingResponse.json()
        this.students = await studentResponse.json()

        const now = new Date()

        this.upcomingSessions = bookings.filter(booking => {
          const bookingDate = new Date(booking.date)
          return bookingDate > now
        })

      } catch (error) {
        console.error("Failed to load upcoming sessions:", error)
        this.upcomingSessions = []
        this.students = []
      }
    },

    formatDate(date) {
      if (!date) return ""

      return new Date(date).toLocaleDateString()
    },

    formatTime(date) {
      if (!date) return ""

      return new Date(date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    }
  }
}
</script>
<style scoped>
.sessions-content {
  flex: 1;
  padding: 30px;
  box-sizing: border-box;
}

.sessions-header {
  background-color: #2c3e50;
  color: #ffffff;
  padding: 32px;
  border-radius: 12px;
  margin-bottom: 22px;
}

.header-label {
  color: #f28c28;
  font-size: 11px;
  font-weight: bold;
  letter-spacing: 1.5px;
  margin: 0 0 7px;
}

.sessions-header h1 {
  font-size: 30px;
  margin: 0;
}

.header-description {
  color: #d7dde3;
  font-size: 14px;
  margin: 7px 0 0;
}

.session-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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
  margin: 0;
}

.summary-card h2 {
  color: #2c3e50;
  font-size: 32px;
  margin: 14px 0 2px;
}

.summary-card p {
  color: #8a94a3;
  font-size: 13px;
  margin: 0;
}

.sessions-card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 22px;
}

.sessions-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f7f8fa;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  text-align: left;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 14px;
  border-bottom: 1px solid #e5e7eb;
}

.card-header h2 {
  margin: 0;
  font-size: 17px;
}

.card-header p {
  color: #8a94a3;
  font-size: 12px;
  margin: 4px 0 0;
}

.table-header,
.session-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1.4fr 1.4fr 1fr 1fr;
}

.table-header {
  padding: 14px 5px;
  color: #8a94a3;
  font-size: 10px;
  font-weight: bold;
}

.session-row {
  padding: 15px 5px;
  border-top: 1px solid #e5e7eb;
  font-size: 13px;
  align-items: center;
}

.empty-state {
  min-height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #e5e7eb;
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
  margin: 0;
  color: #8a94a3;
  font-size: 12px;
}

@media (max-width: 900px) {
  .session-summary {
    grid-template-columns: 1fr;
  }
}
</style>