<template>
    <aside class="tutor-navigation">
       
        <div class="profile-section">
            <div class="profile-image">
                TN
            </div>

            <div class="profile-details">
                <h3>Tutor Name</h3>
                <p>Tutor</p>
            </div>
        </div>

        <div class="navigation-section">
            <p class="section-title">MANAGEMENT</p>

            <button
            class="nav-item"
              :class="{ active: activePage === 'dashboard' }"
                @click="changePage('dashboard')"
            >
                Dashboard
        </button>
        </div>

        <div class="navigation-section">
            <p class="section-title">SESSIONS</p>

            <button
            class="nav-item"
              :class="{ active: activePage === 'today' }"
                @click="changePage('today')"
            >
                Today's Sessions
        </button>


        <button
            class="nav-item"
              :class="{ active: activePage === 'upcoming' }"
                @click="changePage('upcoming')"
            >
                Upcoming Sessions
        </button>

        <button
            class="nav-item"
              :class="{ active: activePage === 'completed' }"
                @click="changePage('completed')"
            >
                Completed Sessions
        </button>

        <button
            class="nav-item"
              :class="{ active: activePage === 'cancelled' }"
                @click="changePage('cancelled')"
            >
                Cancelled Sessions
        </button>
        </div>

        <div class="navigation-section">
            <p class="section-title">TUTOR</p>

            <button
                class="nav-item"
                :class="{ active: activePage === 'subjects' }"
                @click="changePage('subjects')"
            >
                Subjects Taught
            </button>

            <button
                class="nav-item"
                :class="{ active: activePage === 'availability' }"
                @click="changePage('availability')"
            >
                Availability
            </button>

            <button
                class="nav-item"
                :class="{ active: activePage === 'profile' }"
                @click="changePage('profile')"
            >
                Profile
            </button>
        </div>

    </aside>
</template>


<script>
export default {
    name: "TutorNavigation",

    props: {
        activePage: {
            type: String,
            default: "dashboard"
        }
    },

    methods: {
        changePage(page) {
            this.$emit("change-page", page)
        }
    }
}
</script>

<style scoped>

.tutor-navigation {
    width: 250px;
    min-height: 100vh;
    background-color: #ffffff;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    color: #2c3e50;
    border-right: 1px solid #e5e7eb;
    padding: 25px 15px;
    box-sizing: border-box;
    text-align: left;
}

.profile-section {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-bottom: 25px;
    margin-bottom: 25px;
    border-bottom: 1px solid #e5e7eb;
}

.profile-image {
    width: 48px;
    height: 48px;
    background-color: #2c3e50;
    color: #ffffff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 16px;
}

.profile-details h3 {
    margin: 0;
    font-size: 15px;
    color: #2c3e50;
}

.profile-details p {
    margin: 4px 0 0;
    font-size: 12px;
    color: #8a94a3;
}

.navigation-section {
    margin-bottom: 28px;
}

.section-title {
    font-size: 10px;
    font-weight: bold;
    color: #9ca3af;
    margin: 0 0 10px 10px;
    letter-spacing: 1px;
}

.nav-item {
    display: block;
    width: 100%;
    background: none;
    border: none;
    color: #2c3e50;
    padding: 11px 12px;
    margin-bottom: 5px;
    border-radius: 7px;
    font-family: inherit;
    font-size: 14px;
    text-align: left;
    cursor: pointer;
}

.nav-item:hover {
    background-color: #f7f8fa;
}

.nav-item.active {
    background-color: #f7f8fa;
    color: #2c3e50;
    border-left: 4px solid #f28c28;
    font-weight: bold;
}

</style>