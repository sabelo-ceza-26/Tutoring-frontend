<template>
  <main class="subjects-content">

  
    <section class="subjects-header">
      <div>
        <p class="header-label">TUTOR MANAGEMENT</p>
        <h1>Subjects Taught</h1>
        <p class="header-description">
          Manage the subjects you currently teach.
        </p>
      </div>

      <button
        class="header-button"
        @click="openAddForm"
      >
        + Add Subject
      </button>
    </section>

    <section class="subject-summary">

      <div class="summary-card">
        <p class="summary-label">TOTAL SUBJECTS</p>
        <h2>{{ subjects.length }}</h2>
        <p>Subjects currently taught</p>
      </div>

    </section>


    <section class="subjects-card">

      <div class="card-header">
        <div>
          <h2>Your Subjects</h2>
          <p>View and edit the subjects you teach</p>
        </div>
      </div>


      <div class="table-header">
        <span>Subject Code</span>
        <span>Subject Name</span>
        <span>Years Taught</span>
        <span>Action</span>
      </div>


      <div
        v-for="subject in subjects"
        :key="subject.subjectCode"
        class="subject-row"
      >
        <strong>{{ subject.subjectCode }}</strong>

        <span>{{ subject.subjectName }}</span>

        <span>{{ subject.yearsTaught }} years</span>

        <button
          class="edit-button"
          @click="openEditForm(subject)"
        >
          Edit
        </button>
      </div>

      <div
        v-if="subjects.length === 0"
        class="empty-state"
      >
        <div class="empty-circle">+</div>

        <h3>No subjects added yet</h3>

        <p>
          Add the subjects you currently teach.
        </p>

        <button
          class="add-button"
          @click="openAddForm"
        >
          Add Subject
        </button>
      </div>

    </section>

    <div
      v-if="showForm"
      class="form-overlay"
    >

      <div class="subject-form">

        <div class="form-header">
          <div>
            <h2>
              {{ editing ? 'Edit Subject' : 'Add Subject' }}
            </h2>

            <p>
              {{ editing
                ? 'Update your subject information.'
                : 'Add a subject to your tutoring profile.'
              }}
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
          <label>Subject Code</label>

          <input
            v-model="form.subjectCode"
            type="text"
            placeholder="Enter subject code"
            :disabled="editing"
          >
        </div>


        <div class="form-group">
          <label>Subject Name</label>

          <input
            v-model="form.subjectName"
            type="text"
            placeholder="Enter subject name"
          >
        </div>


        <div class="form-group">
          <label>Years Taught</label>

          <input
            v-model.number="form.yearsTaught"
            type="number"
            min="0"
            placeholder="Enter number of years"
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
            @click="saveSubject"
          >
            {{ editing ? 'Save Changes' : 'Add Subject' }}
          </button>

        </div>

      </div>

    </div>

  </main>
</template>


<script>
export default {
  name: "TutorSubjects",

  data() {
    return {

      subjects: [],

      showForm: false,

      editing: false,

      errorMessage: "",

      form: {
        subjectCode: "",
        subjectName: "",
        yearsTaught: null
      }
    }
  },


  methods: {

    openAddForm() {
      this.editing = false
      this.errorMessage = ""

      this.form = {
        subjectCode: "",
        subjectName: "",
        yearsTaught: null
      }

      this.showForm = true
    },


    openEditForm(subject) {
      this.editing = true
      this.errorMessage = ""

      this.form = {
        subjectCode: subject.subjectCode,
        subjectName: subject.subjectName,
        yearsTaught: subject.yearsTaught
      }

      this.showForm = true
    },


    closeForm() {
      this.showForm = false
      this.errorMessage = ""
    },


    saveSubject() {

      if (
        !this.form.subjectCode ||
        !this.form.subjectName ||
        this.form.yearsTaught === null
      ) {
        this.errorMessage = "Please complete all fields."
        return
      }


      if (this.form.yearsTaught < 0) {
        this.errorMessage = "Years taught cannot be negative."
        return
      }


      if (this.editing) {

        const index = this.subjects.findIndex(
          subject =>
            subject.subjectCode === this.form.subjectCode
        )

        if (index !== -1) {
          this.subjects.splice(index, 1, {
            ...this.form
          })
        }

      } else {

        const alreadyExists = this.subjects.some(
          subject =>
            subject.subjectCode === this.form.subjectCode
        )

        if (alreadyExists) {
          this.errorMessage = "This subject has already been added."
          return
        }

        this.subjects.push({
          ...this.form
        })
      }


      this.closeForm()
    }

  }
}
</script>


<style scoped>

.subjects-content {
  min-height: 100vh;
  padding: 30px;
  box-sizing: border-box;
  background-color: #f7f8fa;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  text-align: left;
}

.subjects-header {
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

.subjects-header h1 {
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

.subject-summary {
  display: grid;
  grid-template-columns: 1fr;
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
  color: #8a94a3;
  font-size: 13px;
  margin: 0;
}

.subjects-card {
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
.subject-row {
  display: grid;
  grid-template-columns:
    1fr
    2fr
    1fr
    0.7fr;
  align-items: center;
}

.table-header {
  padding: 14px 5px;
  color: #8a94a3;
  font-size: 10px;
  font-weight: bold;
}

.subject-row {
  padding: 15px 5px;
  border-top: 1px solid #e5e7eb;
  font-size: 13px;
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

.edit-button {
  background-color: #ffffff;
  color: #f28c28;
  border: 1px solid #f28c28;
  border-radius: 6px;
  padding: 7px 12px;
  font-family: inherit;
  font-size: 11px;
  font-weight: bold;
  cursor: pointer;
}

.edit-button:hover {
  background-color: #fff7ef;
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

.subject-form {
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
  color: #8a94a3;
  font-size: 12px;
  margin: 4px 0 0;
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

.form-group input {
  border: 1px solid #d9dee5;
  border-radius: 7px;
  padding: 11px;
  font-family: inherit;
  color: #2c3e50;
  outline: none;
}

.form-group input:focus {
  border-color: #f28c28;
}

.form-group input:disabled {
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

  .subjects-header {
    flex-direction: column;
    align-items: flex-start;

    gap: 20px;
  }

  .summary-card {
    width: auto;
  }

  .subject-form {
    width: 90%;
  }

}

</style>