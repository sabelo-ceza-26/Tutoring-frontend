<template>
  <div class="dashboard-layout">
    <main class="dashboard-content">

      <section class="dashboard-header">
        <div>
          <h1>Welcome back, {{ fullName }}</h1>
          <p class="header-description">
            Manage your sessions and tutoring activity.
          </p>
        </div>
      </section>

      <section class="summary-cards">
        <div class="summary-card clickable-card" @click="changePage('today')">
          <div class="summary-top">
            <span class="summary-label">TODAY</span>
            <span class="summary-dot"></span>
          </div>
          <h2>{{ todaysSessions.length }}</h2>
          <p>Today's Sessions</p>
        </div>

        <div class="summary-card clickable-card" @click="changePage('upcoming')">
          <div class="summary-top">
            <span class="summary-label">UPCOMING</span>
            <span class="summary-dot"></span>
          </div>
          <h2>{{ upcomingSessions.length }}</h2>
          <p>Upcoming Sessions</p>
        </div>

        <div class="summary-card clickable-card" @click="changePage('completed')">
          <div class="summary-top">
            <span class="summary-label">COMPLETED</span>
            <span class="summary-dot"></span>
          </div>
          <h2>{{ completedSessions.length }}</h2>
          <p>Completed Sessions</p>
        </div>

        <div class="summary-card clickable-card" @click="changePage('cancelled')">
          <div class="summary-top">
            <span class="summary-label">CANCELLED</span>
            <span class="summary-dot"></span>
          </div>
          <h2>{{ cancelledSessions.length }}</h2>
          <p>Cancelled Sessions</p>
        </div>
      </section>

      <section class="dashboard-row">
        <div class="dashboard-card large-card">
          <div class="card-header">
            <div>
              <h2>Today's Sessions</h2>
              <p>Your tutoring schedule for today</p>
            </div>
            <button class="text-button" @click="changePage('today')">
              View All
            </button>
          </div>

          <div
         v-if="todaysSessions.length === 0"
         class="empty-state"
          >
            <div class="empty-circle">—</div>
            <h3>No sessions scheduled</h3>
            <p>
              You don't have any tutoring sessions scheduled for today.
            </p>
          </div>
        </div>

        <div class="dashboard-card side-card">
          <div class="card-header">
            <div>
              <h2>Profile Summary</h2>
              <p>Your tutor information</p>
            </div>
          </div>

          <div class="profile-summary">
            <div class="profile-avatar">
              {{ initials }}
            </div>
            <div class="profile-name">
              <h3>{{ fullName }}</h3>
              <p>Tutor</p>
            </div>
          </div>

          <div class="profile-information">
            <div class="information-row">
              <span>Email</span>
              <strong>{{ displayEmail || 'Not available' }}</strong>
            </div>
            <div class="information-row">
              <span>Phone</span>
              <strong>{{ tutor.phoneNumber || 'Not available' }}</strong>
            </div>
            <div class="information-row">
              <span>Hourly Rate</span>
              <strong>{{ formattedHourlyRate || 'Not set' }}</strong>
            </div>
          </div>

          <button class="outline-button" @click="changePage('profile')">
            Edit Profile
          </button>
        </div>
      </section>

      <section class="dashboard-row">
        <div class="dashboard-card large-card">
          <div class="card-header">
            <div>
              <h2>Upcoming Sessions</h2>
              <p>Your next scheduled tutoring sessions</p>
            </div>
            <button class="text-button" @click="changePage('upcoming')">
              View All
            </button>
          </div>

          <div class="session-table">
            <div class="table-header">
              <span>Date</span>
              <span>Subject</span>
              <span>Time</span>
              <span>Session Type</span>
            </div>
            <div
            v-if="upcomingSessions.length === 0"
            class="table-empty"
             >
             No upcoming sessions.
            </div>
          </div>
        </div>

        <div class="dashboard-card side-card">
          <div class="card-header">
            <div>
              <h2>Availability</h2>
              <p>Your current tutoring schedule</p>
            </div>
          </div>

          <div class="small-empty-state">
            <div class="empty-circle small-circle">—</div>
            <h3>No availability set</h3>
            <p>
              Set the days and times you're available to tutor.
            </p>
          </div>

          <button class="outline-button" @click="changePage('availability')">
            Set Availability
          </button>
        </div>
      </section>

      <section class="dashboard-row">
        <div class="dashboard-card large-card">
          <div class="card-header">
            <div>
              <h2>Subjects Taught</h2>
              <p>Manage the subjects you currently teach</p>
            </div>
            <button class="text-button" @click="changePage('subjects')">
              Manage Subjects
            </button>
          </div>

          <div class="subject-header">
            <span>Subject Code</span>
            <span>Subject Name</span>
            <span>Years Taught</span>
          </div>

          <div v-if="subjects.length">
            <div
              v-for="s in subjects"
              :key="s.subjectCode"
              class="subject-row"
            >
              <strong>{{ s.subjectCode }}</strong>
              <span>{{ s.subjectName }}</span>
              <span>{{ s.yearsTaught }} {{ s.yearsTaught === 1 ? 'year' : 'years' }}</span>
            </div>
          </div>

          <div v-else class="table-empty">
            No subjects added yet.
          </div>
        </div>

        <div class="dashboard-card side-card">
          <div class="card-header">
            <div>
              <h2>Session Overview</h2>
              <p>Your tutoring activity</p>
            </div>
          </div>

          <div class="overview-list">
            <div class="overview-item">
              <div>
                <span class="overview-dot"></span>
                <span>Upcoming</span>
              </div>
              <strong>{{ upcomingSessions.length }}</strong>
            </div>
            <div class="overview-item">
              <div>
                <span class="overview-dot"></span>
                <span>Completed</span>
              </div>
              <strong>{{ completedSessions.length }}</strong>
            </div>
            <div class="overview-item">
              <div>
                <span class="overview-dot"></span>
                <span>Cancelled</span>
              </div>
              <strong>{{ cancelledSessions.length }}</strong>
            </div>
          </div>
        </div>
      </section>


      <section class="quick-actions">
        <div class="quick-actions-heading">
          <h2>Quick Actions</h2>
          <p>Quickly manage your tutor information and schedule.</p>
        </div>

        <div class="action-buttons">
          <button class="action-button" @click="changePage('profile')">
            Update Profile
          </button>

          <button class="action-button" @click="changePage('subjects')">
            Add Subject
          </button>

          <button class="action-button" @click="changePage('availability')">
            Set Availability
          </button>
        </div>
      </section>

    </main>
  </div>
</template>

<script>
import { getSession } from '@/services/authService'
import { getTutorById } from '@/services/tutorService'
import { getAllSubjects } from '@/services/subjectService'

export default {
    name: "TutorDashboard",

    data() {
        return {
            session: null,
            tutor: {
                tutorId: "",
                firstName: "",
                lastName: "",
                email: "",
                phoneNumber: "",
                hourlyRate: null
            },
            subjects: [],
            todaysSessions: [],
            upcomingSessions: [],
            completedSessions: [],
            cancelledSessions: []
        }
    },

    computed: {
        fullName() {
            const name = `${this.tutor.firstName} ${this.tutor.lastName}`.trim()

            if (name) {
                return name
            }

           return this.session && this.session.name
        ? this.session.name
        : ""
         },          

        initials() {
            const words = this.fullName.trim().split(" ").filter(Boolean)

            if (words.length === 0) {
           return ""
           }

            if (words.length === 1) {
                return words[0].charAt(0).toUpperCase()
            }

            return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase()
        },

        displayEmail() {
            if (this.tutor.email) {
                return this.tutor.email
            }

            return this.session ? this.session.email : ""
        },

        formattedHourlyRate() {
            const rate = Number(this.tutor.hourlyRate)

            if (this.tutor.hourlyRate === null || this.tutor.hourlyRate === "" || isNaN(rate)) {
                return ""
            }

            return `R${rate.toFixed(2)}`
        }
    },

    async created() {
        const session = getSession()

        if (!session) {
            return
        }

        this.session = session

        if (!session.id) {
            return
        }

        try {
            const tutor = await getTutorById(session.id)

            if (tutor && Object.keys(tutor).length) {
                this.tutor = {
                    tutorId: tutor.tutorId || "",
                    firstName: tutor.firstName || "",
                    lastName: tutor.lastName || "",
                    email: tutor.email || "",
                    phoneNumber: tutor.phoneNumber || "",
                    hourlyRate: tutor.hourlyRate != null ? tutor.hourlyRate : null
                }
            }

            await this.loadSubjects()
        } catch (error) {
            this.tutor.email = session.email || ""
        }
    },

    methods: {
        changePage(page) {
            this.$emit("change-page", page)
        },

        async loadSubjects() {
            try {
                const [allSubjects, tutorSubjectsRes] = await Promise.all([
                    getAllSubjects(),
                    fetch('/tutoring/tutorsubject/getAll').then(r => r.json())
                ])

                const myRecords = tutorSubjectsRes.filter(r => r.tutorId === this.tutor.tutorId)

                this.subjects = myRecords.map(record => {
                    const details = allSubjects.find(s => s.subjectCode === record.subjectCode)
                    return {
                        subjectCode: record.subjectCode,
                        subjectName: details ? details.subjectName : record.subjectCode,
                        yearsTaught: record.yearsTaught
                    }
                })
            } catch (e) {
                this.subjects = []
            }
        }
    }
}
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f7f8fa;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  text-align: left;
}

.dashboard-content {
  flex: 1;
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
  grid-template-columns: repeat(4, 1fr);
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

.summary-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-label {
  color: #8a94a3;
  font-size: 10px;
  font-weight: bold;
  letter-spacing: 1px;
}

.summary-dot {
  width: 8px;
  height: 8px;
  background-color: #f28c28;
  border-radius: 50%;
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

.dashboard-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 22px;
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

.empty-state h3,
.small-empty-state h3 {
  margin: 0 0 5px;
  font-size: 14px;
}

.empty-state p,
.small-empty-state p {
  color: #8a94a3;
  font-size: 12px;
  margin: 0;
}

.small-empty-state {
  min-height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.small-circle {
  width: 32px;
  height: 32px;
}

.profile-summary {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 0;
}

.profile-avatar {
  width: 45px;
  height: 45px;
  background-color: #2c3e50;
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.profile-name h3 {
  margin: 0;
  font-size: 14px;
}

.profile-name p {
  margin: 3px 0 0;
  color: #8a94a3;
  font-size: 11px;
}

.profile-information {
  border-top: 1px solid #e5e7eb;
}

.information-row {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  padding: 11px 0;
  border-bottom: 1px solid #e5e7eb;
  font-size: 12px;
}

.information-row span {
  color: #8a94a3;
}

.information-row strong {
  text-align: right;
}

.table-header,
.subject-header {
  display: grid;
  padding: 12px 5px;
  color: #8a94a3;
  font-size: 10px;
  font-weight: bold;
}

.table-header {
  grid-template-columns: 1fr 1.3fr 1fr 1fr;
}

.subject-header {
  grid-template-columns: 1fr 2fr 1fr;
}

.subject-row {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  padding: 12px 5px;
  border-top: 1px solid #e5e7eb;
  font-size: 13px;
  align-items: center;
}

.table-empty {
  min-height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #e5e7eb;
  color: #8a94a3;
  font-size: 12px;
}

.overview-list {
  padding-top: 10px;
}

.overview-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #e5e7eb;
  font-size: 12px;
}

.overview-item div {
  display: flex;
  align-items: center;
  gap: 8px;
}

.overview-dot {
  width: 8px;
  height: 8px;
  background-color: #f28c28;
  border-radius: 50%;
}

.overview-item strong {
  font-size: 15px;
}

.clickable-card {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.clickable-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(44, 62, 80, 0.12);
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

.outline-button {
  width: 100%;
  background-color: #ffffff;
  color: #f28c28;
  border: 1px solid #f28c28;
  border-radius: 7px;
  padding: 10px;
  font-family: inherit;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
}

.outline-button:hover {
  background-color: #fff7ef;
}

.quick-actions {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 22px;
  margin-bottom: 30px;
}

.quick-actions-heading h2 {
  margin: 0;
  font-size: 17px;
}

.quick-actions-heading p {
  margin: 5px 0 18px;
  color: #8a94a3;
  font-size: 12px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.action-button {
  background-color: #2c3e50;
  color: #ffffff;
  border: none;
  border-radius: 7px;
  padding: 11px 18px;
  font-family: inherit;
  font-size: 12px;
  cursor: pointer;
}

.action-button:hover {
  background-color: #f28c28;
}

@media (max-width: 1050px) {

  .summary-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .dashboard-row {
    grid-template-columns: 1fr;
  }
}




</style>
