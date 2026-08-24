<template>
     <div class="sessions-layout">

        <main class="sessions-content">

            <section class="sessions-header">
                <div>
                    <p class="header-label">SESSIONS</p>
                    <h1>Cancelled Sessions</h1>
                    <p class="header-description">
                        View tutoring that have been cancelled.
                    </p>
                </div>
            </section>

            <section class="session-summary">

                <div class="summary-card">
                    <p class="summary-label">TOTAL CANCELLED</p>
                    <h2>0</h2>
                    <p>Cancelled sessions</p>
                </div>

                <div class="summary-card">
                    <p class="summary-label">ONLINE</p>
                    <h2>0</h2>
                    <p>Cancelled online sessions</p>
                </div>

                <div class="summary-card">
                    <p class="summary-label">IN PERSON</p>
                    <h2>0</h2>
                    <p>Cancelled in-person sessions</p>
                </div>
            </section>

            <section class="sessions-card">
                <div class="card-header">
                <div>
                <h2>Cancelled Session History</h2>
                <p>Your cancelled tutoring sessions</p>
                </div>
                </div>

                <div class="table-header">
          <span>Date</span>
          <span>Student</span>
          <span>Subject</span>
          <span>Duration</span>
          <span>Session Type</span>
        </div>

        <div class="empty-state">
          <div class="empty-circle">✓</div>
          <h3>No cancelled sessions</h3>
          <p> Your cancelled tutoring sessions will appear here.</p>
        </div>
            </section>
        </main>
    </div>
</template>

<script>
export default {
    name: "CancelledSessions",
}
</script>

<style scoped>
.sessions-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f7f8fa;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  text-align: left;
}

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

.card-header {
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

.table-header {
  display: grid;
  grid-template-columns: 1fr 1.5fr 1.5fr 1fr 1fr;
  padding: 14px 5px;
  color: #8a94a3;
  font-size: 10px;
  font-weight: bold;
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