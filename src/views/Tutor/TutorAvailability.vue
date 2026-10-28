<template>
  <main class="availability-content">

    <section class="availability-header">
      <div>
        <p class="header-label">TUTOR MANAGEMENT</p>
        <h1>Availability</h1>
        <p class="header-description">
          Set the days and times you're available for tutoring sessions.
        </p>
      </div>

      <button
        class="header-button"
        @click="openAddForm"
      >
        + Add Availability
      </button>
    </section>

    <section class="availability-summary">

      <div class="summary-card">
        <p class="summary-label">AVAILABLE DAYS</p>
        <h2>{{ availability.length }}</h2>
        <p>Days currently available</p>
      </div>

    </section>

    <section class="availability-card">

      <div class="card-header">
        <div>
          <h2>Your Availability</h2>
          <p>Manage your weekly tutoring schedule</p>
        </div>
      </div>


      <div class="table-header">
        <span>Day</span>
        <span>Start Time</span>
        <span>End Time</span>
        <span>Actions</span>
      </div>


      <div
        v-for="slot in availability"
        :key="slot.day"
        class="availability-row"
      >
        <strong>{{ slot.day }}</strong>

        <span>{{ slot.startTime }}</span>

        <span>{{ slot.endTime }}</span>

        <div class="row-actions">

          <button
            class="edit-button"
            @click="openEditForm(slot)"
          >
            Edit
          </button>

          <button
            class="remove-button"
            @click="removeAvailability(slot.day)"
          >
            Remove
          </button>

        </div>

      </div>
      <div
        v-if="availability.length === 0"
        class="empty-state"
      >

        <div class="empty-circle">
          +
        </div>

        <h3>No availability set</h3>

        <p>
          Add the days and times you're available to tutor.
        </p>

        <button
          class="add-button"
          @click="openAddForm"
        >
          Set Availability
        </button>

      </div>

    </section>

    <div
      v-if="showForm"
      class="form-overlay"
    >

      <div class="availability-form">

        <div class="form-header">

          <div>
            <h2>
              {{ editing ? 'Edit Availability' : 'Add Availability' }}
            </h2>

            <p>
              Choose the day and times you're available.
            </p>
          </div>

          <button
            class="close-button"
            @click="closeForm"
          >
            ×
          </button>

        </div>
        <div class="form-group">

          <label>Day</label>

          <select
            v-model="form.day"
            :disabled="editing"
          >

            <option value="">
              Select a day
            </option>

            <option>Monday</option>
            <option>Tuesday</option>
            <option>Wednesday</option>
            <option>Thursday</option>
            <option>Friday</option>
            <option>Saturday</option>
            <option>Sunday</option>

          </select>

        </div>

        <div class="form-group">

          <label>Start Time</label>

          <input
            v-model="form.startTime"
            type="time"
          >

        </div>

        <div class="form-group">

          <label>End Time</label>

          <input
            v-model="form.endTime"
            type="time"
          >

        </div>
        <p
          v-if="errorMessage"
          class="error-message"
        >
          {{ errorMessage }}
        </p>

        <div class="form-actions">

          <button
            class="cancel-button"
            @click="closeForm"
          >
            Cancel
          </button>

          <button
            class="save-button"
            @click="saveAvailability"
          >
            {{ editing ? 'Save Changes' : 'Add Availability' }}
          </button>

        </div>

      </div>

    </div>

  </main>
</template>



<script>
import { getSession } from '@/services/authService'

export default {
  name: "TutorAvailability",

  data() {
    return {
      session: getSession(),
      availability: [],
      showForm: false,
      editing: false,
      errorMessage: "",
      form: {
        day: "",
        startTime: "",
        endTime: ""
      }
    }
  },

  computed: {
    tutorId() {
      return this.session?.tutorId ||
        this.session?.id ||
        this.session?.user?.tutorId ||
        ""
    },

    storageKey() {
      return this.tutorId
        ? `tutorAvailability_${this.tutorId}`
        : ""
    }
  },

  mounted() {
    this.loadAvailability()
  },

  methods: {
    loadAvailability() {
      if (!this.storageKey) {
        this.errorMessage =
          "Could not identify the logged-in tutor."
        return
      }

      try {
        this.availability = JSON.parse(
          localStorage.getItem(this.storageKey) || "[]"
        )
      } catch {
        this.availability = []
      }
    },

    saveToStorage() {
      if (!this.storageKey) {
        this.errorMessage =
          "Could not identify the logged-in tutor."
        return false
      }

      localStorage.setItem(
        this.storageKey,
        JSON.stringify(this.availability)
      )

      window.dispatchEvent(
        new Event("tutor-availability-updated")
      )

      return true
    },

    openAddForm() {
      this.editing = false
      this.errorMessage = ""
      this.form = {
        day: "",
        startTime: "",
        endTime: ""
      }
      this.showForm = true
    },

    openEditForm(slot) {
      this.editing = true
      this.errorMessage = ""
      this.form = { ...slot }
      this.showForm = true
    },

    closeForm() {
      this.showForm = false
      this.errorMessage = ""
    },

    saveAvailability() {
      if (
        !this.form.day ||
        !this.form.startTime ||
        !this.form.endTime
      ) {
        this.errorMessage = "Please complete all fields."
        return
      }

      if (this.form.startTime >= this.form.endTime) {
        this.errorMessage =
          "End time must be later than start time."
        return
      }

      const index = this.availability.findIndex(
        slot => slot.day === this.form.day
      )

      if (this.editing) {
        if (index !== -1) {
          this.availability.splice(index, 1, {
            ...this.form
          })
        }
      } else {
        if (index !== -1) {
          this.errorMessage =
            "Availability for this day already exists."
          return
        }

        this.availability.push({ ...this.form })
      }

      if (this.saveToStorage()) {
        this.closeForm()
      }
    },

    removeAvailability(day) {
      this.availability = this.availability.filter(
        slot => slot.day !== day
      )

      this.saveToStorage()
    }
  }
}
</script>



<style scoped>

.availability-content {
  min-height: 100vh;
  padding: 30px;
  box-sizing: border-box;
  background-color: #f7f8fa;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  text-align: left;
}


.availability-header {
  background-color: #2c3e50;
  color: #ffffff;
  padding: 32px;
  border-radius: 12px;
  margin-bottom: 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-label {
  color: #f28c28;
  font-size: 11px;
  font-weight: bold;
  letter-spacing: 1.5px;
  margin: 0 0 7px;
}

.availability-header h1 {
  margin: 0;
  font-size: 30px;
}

.header-description {
  color: #d7dde3;
  font-size: 14px;
  margin: 7px 0 0;
}

.header-button {
  background-color: #f28c28;
  color: #ffffff;
  border: none;
  border-radius: 7px;
  padding: 11px 17px;
  font-family: inherit;
  font-weight: bold;
  cursor: pointer;
}

.availability-summary {
  margin-bottom: 22px;
}

.summary-card {
  width: 240px;
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
  margin: 14px 0 2px;
  font-size: 32px;
}

.summary-card p {
  margin: 0;
  color: #8a94a3;
  font-size: 13px;
}


.availability-card {
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
  margin: 4px 0 0;
  color: #8a94a3;
  font-size: 12px;
}

.table-header,
.availability-row {
  display: grid;
  grid-template-columns:
    1.5fr
    1fr
    1fr
    1.3fr;
  align-items: center;
}

.table-header {
  padding: 14px 5px;
  color: #8a94a3;
  font-size: 10px;
  font-weight: bold;
}

.availability-row {
  padding: 15px 5px;
  border-top: 1px solid #e5e7eb;
  font-size: 13px;
}

.row-actions {
  display: flex;
  gap: 8px;
}

.edit-button {
  background-color: #ffffff;
  color: #f28c28;
  border: 1px solid #f28c28;
  border-radius: 6px;
  padding: 7px 11px;
  font-family: inherit;
  font-size: 11px;
  font-weight: bold;
  cursor: pointer;
}

.remove-button {
  background-color: #ffffff;
  color: #8a94a3;
  border: 1px solid #d9dee5;
  border-radius: 6px;
  padding: 7px 11px;
  font-family: inherit;
  font-size: 11px;
  cursor: pointer;
}

.edit-button:hover {
  background-color: #fff7ef;
}

.remove-button:hover {
  background-color: #f7f8fa;
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
  margin: 0 0 15px;
  color: #8a94a3;
  font-size: 12px;
}

.add-button,
.save-button {
  background-color: #2c3e50;
  color: #ffffff;
  border: none;
  border-radius: 7px;
  padding: 10px 16px;
  font-family: inherit;
  font-weight: bold;
  cursor: pointer;
}

.add-button:hover,
.save-button:hover {
  background-color: #f28c28;
}

.form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(44, 62, 80, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.availability-form {
  width: 430px;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 25px;
  box-sizing: border-box;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 15px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 20px;
}

.form-header h2 {
  margin: 0;
  font-size: 19px;
}

.form-header p {
  margin: 4px 0 0;
  color: #8a94a3;
  font-size: 12px;
}

.close-button {
  border: none;
  background: none;
  color: #8a94a3;
  font-size: 24px;
  cursor: pointer;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-bottom: 17px;
}

.form-group label {
  font-size: 12px;
  font-weight: bold;
}

.form-group input,
.form-group select {
  border: 1px solid #d9dee5;
  border-radius: 7px;
  padding: 11px;
  font-family: inherit;
  color: #2c3e50;
  outline: none;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #f28c28;
}

.form-group select:disabled {
  background-color: #f7f8fa;
}

.error-message {
  color: #d9534f;
  font-size: 12px;
  margin: 0 0 15px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 10px;
}

.cancel-button {
  background-color: #ffffff;
  color: #2c3e50;
  border: 1px solid #d9dee5;
  border-radius: 7px;
  padding: 10px 16px;
  font-family: inherit;
  cursor: pointer;
}

@media (max-width: 700px) {

  .availability-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .summary-card {
    width: auto;
  }

  .availability-form {
    width: 90%;
  }

}

</style>