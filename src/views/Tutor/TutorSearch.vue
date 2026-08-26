<template>
  <div class="page">
   
    <div class="header-banner">
      <div class="small-label">TUTOR DISCOVERY</div>
      <h1>Find a Tutor</h1>
      <p>Search and filter tutors by subject, name, experience and hourly rate.</p>
    </div>

    <div class="card">
      <h2>Search Tutors</h2>
      <p class="subtitle">Find a tutor that matches your learning needs.</p>

      <div class="filter-grid">
        <div class="field">
          <label>Subject Code</label>
          <select v-model="filters.subject">
            <option value="">All Subjects</option>
            <option v-for="s in subjects" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>

        <div class="field">
          <label>Name</label>
          <input v-model="filters.name" placeholder="Search by name" />
        </div>

        <div class="field">
          <label>Surname</label>
          <input v-model="filters.surname" placeholder="Search by surname" />
        </div>

        <div class="field">
          <label>Years of Experience</label>
          <select v-model="filters.experience">
            <option value="">Any experience</option>
            <option value="1">1+ years</option>
            <option value="2">2+ years</option>
            <option value="3">3+ years</option>
            <option value="5">5+ years</option>
            <option value="8">8+ years</option>
          </select>
        </div>

        <div class="field">
          <label>Maximum Hourly Rate</label>
          <select v-model="filters.price">
            <option value="">Any price</option>
            <option value="100">Up to R100/hr</option>
            <option value="150">Up to R150/hr</option>
            <option value="200">Up to R200/hr</option>
            <option value="300">Up to R300/hr</option>
            <option value="500">Up to R500/hr</option>
          </select>
        </div>

        <div class="field">
          <label>&nbsp;</label>
          <button class="clear-btn" @click="clearFilters">Clear Filters</button>
        </div>
      </div>

      <div class="stats">
        <div class="stat-box">
          <div class="stat-num">{{ tutors.length }}</div>
          <div class="stat-title">TOTAL TUTORS</div>
          <div class="stat-sub">Available tutors</div>
        </div>
        <div class="stat-box">
          <div class="stat-num">{{ filteredTutors.length }}</div>
          <div class="stat-title">MATCHING TUTORS</div>
          <div class="stat-sub">Tutors matching your filters</div>
        </div>
        <div class="stat-box">
          <div class="stat-num">{{ subjects.length }}</div>
          <div class="stat-title">SUBJECTS</div>
          <div class="stat-sub">Available subject codes</div>
        </div>
      </div>

      <div class="tutor-section">
        <h3>Tutors</h3>
        <p class="found">{{ filteredTutors.length }} tutors found</p>

        <div v-if="filteredTutors.length > 0" class="tutor-list">
          <div v-for="tutor in filteredTutors" :key="tutor.id" class="tutor-card">
            <h4>{{ tutor.name }} {{ tutor.surname }}</h4>
            <p>{{ tutor.subject }} | R{{ tutor.price }}/hr | {{ tutor.experience }} yrs</p>
          </div>
        </div>

        <div v-else class="empty">
          <p>No tutors available</p>
          <span>Tutor management page - add tutors who are added<br/>their occupations and assigned subjects and are active</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
  name: "App",
  data() {
    return {
      filters: { subject: "", name: "", surname: "", experience: "", price: "" },
      subjects: ["ADP3", "CNF1", "PFP3", "PRM3", "ADF1"],
      tutors: [] 
    };
  },
  computed: {
    filteredTutors() {
      return this.tutors.filter(t => {
        const m1 = !this.filters.subject || t.subject === this.filters.subject;
        const m2 = !this.filters.name || t.name.toLowerCase().includes(this.filters.name.toLowerCase());
        const m3 = !this.filters.surname || t.surname.toLowerCase().includes(this.filters.surname.toLowerCase());
        const m4 = !this.filters.experience || t.experience >= Number(this.filters.experience);
        const m5 = !this.filters.price || t.price <= Number(this.filters.price);
        return m1 && m2 && m3 && m4 && m5;
      });
    }
  },
  methods: {
    clearFilters() {
      this.filters = { subject: "", name: "", surname: "", experience: "", price: "" };
    }
  }
};
</script>

<style scoped>
  .page {
    background: #f5f6f8;
    min-height: 100vh;
    padding: 20px;
    font-family: Arial, sans-serif;
  }

  .header-banner {
    background: #0f172a;
    color: white;
    padding: 25px;
    border-radius: 12px;
    margin-bottom: 20px;
  }

  .small-label {
    color: #f97316;
    font-size: 11px;
    letter-spacing: 1px;
    font-weight: bold;
  }

  .header-banner h1 {
    margin: 5px 0;
  }

  .header-banner p {
    color: #cbd5e1;
    font-size: 14px;
  }

  .card {
    background: white;
    padding: 25px;
    border-radius: 12px;
  }

  .subtitle {
    color: #64748b;
    font-size: 13px;
    margin-top: -10px;
  }

  .filter-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-top: 20px;
  }

  .field label {
    display: block;
    font-size: 12px;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .field input,
  .field select {
    width: 100%;
    padding: 10px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: #f8fafc;
    box-sizing: border-box
  }

  .clear-btn {
    width: 100%;
    padding: 10px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: white;
    cursor: pointer;
  }

  .clear-btn:hover {
    background: #0f172a;
    color: white;
  }

  .stats {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 15px;
    margin: 25px 0;
  }

  .stat-box {
    border: 1px solid #e2e8f0;
    border-top: 3px solid #f59e0b;
    padding: 15px;
    border-radius: 8px;
    text-align: center;
    background: #fff;
  }

  .stat-num {
    font-size: 24px;
    font-weight: bold;
  }

  .stat-title {
    font-size: 10px;
    font-weight: bold;
    color: #64748b;
    margin-top: 5px;
  }

  .stat-sub {
    font-size: 11px;
    color: #94a3b8;
  }

  .tutor-section {
    margin-top: 20px;
  }

  .found {
    font-size: 12px;
    color: #64748b;
  }

  .empty {
    text-align: center;
    padding: 40px;
    color: #94a3b8;
  }

  .empty p {
    font-weight: bold;
    color: #475569;
  }
</style>