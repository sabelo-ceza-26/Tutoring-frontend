<template>
    <div class="page-layout">

        <main class="page-content" :class="{ narrow: mode === 'form' }">

            <!-- FORM MODE -->
            <template v-if="mode === 'form'">

                <section class="page-header">
                    <div>
                        <p class="header-label">SESSIONS</p>
                        <h1>Book Session</h1>
                        <p class="header-description">
                            Pick a tutor, subject and time that suits you.
                        </p>
                    </div>
                </section>

                <div class="dashboard-card form-card">

                    <div class="card-header">
                        <div>
                            <h2>Make a Tutoring Booking</h2>
                            <p>Your session will be confirmed immediately</p>
                        </div>
                    </div>

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
                        <button type="submit" class="submit-button block" :disabled="loading">
                            {{ loading ? 'Booking...' : 'Confirm Booking' }}
                        </button>
                    </form>

                </div>

            </template>

            <!-- LIST MODE -->
            <template v-else>

                <section class="page-header">
                    <div>
                        <p class="header-label">SESSIONS</p>
                        <h1>My Bookings</h1>
                        <p class="header-description">
                            Manage your upcoming sessions and payments.
                        </p>
                    </div>

                    <button
                    type="button"
                    class="nav-action-button"
                    @click="changePage('book')"
                    >
                        + New Booking
                    </button>
                </section>

                <div class="dashboard-card">

                    <div class="card-header">
                        <div>
                            <h2>Upcoming Bookings</h2>
                            <p>Sessions you have scheduled</p>
                        </div>
                    </div>

                    <div v-if="!upcomingBookings.length" class="empty-state">
                        <div class="empty-circle">—</div>

                        <h3>Nothing scheduled yet</h3>

                        <p>Book a session with one of our tutors and it will show up here.</p>

                        <button
                        class="outline-button book-cta"
                        @click="changePage('book')"
                        >
                            Book Your First Session
                        </button>
                    </div>

                    <div v-else class="table-scroll">

                        <div class="table-header booking-columns">
                            <span>When</span>
                            <span>Subject</span>
                            <span>Tutor</span>
                            <span>Type</span>
                            <span>Duration</span>
                            <span>Status</span>
                            <span></span>
                        </div>

                        <div
                            v-for="b in upcomingBookings"
                            :key="b.bookingId"
                            class="table-row booking-columns"
                        >
                            <span class="cell-strong">{{ formatDate(b.date) }}</span>
                            <span>{{ subjectName(b.subjectCode) }}</span>
                            <span>{{ tutorName(b.bookingId) }}</span>
                            <span>{{ b.sessionType }}</span>
                            <span>{{ b.duration }} min</span>
                            <span :class="['status-chip', b.payment ? 'paid' : 'unpaid']">
                                {{ b.payment ? 'Paid' : 'Unpaid' }}
                            </span>
                            <span class="row-actions">
                                <button
                                    v-if="!b.payment"
                                    type="button"
                                    class="small-button"
                                    @click="openPay(b)"
                                >
                                    Pay Now
                                </button>
                                <button
                                    type="button"
                                    class="small-button danger-outline"
                                    @click="cancelBooking(b)"
                                >
                                    Cancel
                                </button>
                            </span>
                        </div>

                    </div>

                </div>

                <div class="dashboard-card">

                    <div class="card-header">
                        <div>
                            <h2>Past Bookings</h2>
                            <p>Completed and archived sessions</p>
                        </div>
                    </div>

                    <div v-if="!pastBookings.length" class="empty-state slim">
                        <p class="muted">Completed sessions will be archived here.</p>
                    </div>

                    <div v-else class="table-scroll">

                        <div class="table-header booking-columns">
                            <span>When</span>
                            <span>Subject</span>
                            <span>Tutor</span>
                            <span>Type</span>
                            <span>Duration</span>
                            <span>Status</span>
                            <span></span>
                        </div>

                        <div
                            v-for="b in pastBookings"
                            :key="b.bookingId"
                            class="table-row booking-columns row-dim"
                        >
                            <span class="cell-strong">{{ formatDate(b.date) }}</span>
                            <span>{{ subjectName(b.subjectCode) }}</span>
                            <span>{{ tutorName(b.bookingId) }}</span>
                            <span>{{ b.sessionType }}</span>
                            <span>{{ b.duration }} min</span>
                            <span :class="['status-chip', b.payment ? 'paid' : 'unpaid']">
                                {{ b.payment ? 'Paid' : 'Unpaid' }}
                            </span>
                            <span class="row-actions">
                                <button
                                    v-if="!b.payment"
                                    type="button"
                                    class="small-button"
                                    @click="openPay(b)"
                                >
                                    Pay Now
                                </button>
                            </span>
                        </div>

                    </div>

                </div>

            </template>

        </main>

        <!-- To pay for a booking -->
        <transition name="pop">
            <div v-if="payTarget" class="modal-backdrop" @click.self="closePay">
                <form class="modal" @submit.prevent="confirmPay">
                    <div class="modal-head">
                        <h3>Complete Payment</h3>
                        <button type="button" class="close-x" @click="closePay">&times;</button>
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
                    <p v-if="modalError" class="error">{{ modalError }}</p>
                    <button type="submit" class="submit-button block" :disabled="loading">
                        {{ loading ? 'Processing...' : 'Pay Now' }}
                    </button>
                </form>
            </div>
        </transition>

    </div>
</template>

<script>
import { getSession } from '@/services/authService'
import { createBooking, deleteBooking } from '@/services/bookingService'
import { createPayment } from '@/services/paymentService'

export default {
    name: "StudentBookings",

    props: {
        me: {
            type: Object,
            default: () => ({})
        },

        tutors: {
            type: Array,
            default: () => []
        },

        subjects: {
            type: Array,
            default: () => []
        },

        mode: {
            type: String,
            default: "list"
        },

        selectedTutorId: {
            type: String,
            default: ""
        }
    },

    data() {
        return {
            loading: false,
            error: "",
            modalError: "",
            session: getSession(),
            payTarget: null,
            paymentForm: { amount: 0, paymentMethod: "" },
            bookingForm: { tutorId: '', subjectCode: '', sessionType: '', duration: '', date: '' }
        }
    },

    computed: {
        myBookings() {
            return this.me.bookings || []
        },

        // bookings with a date in the future, soonest first
        upcomingBookings() {
            const now = Date.now()
            return this.myBookings
                .filter(b => new Date(b.date).getTime() >= now)
                .sort((a, b) => new Date(a.date) - new Date(b.date))
        },

        // bookings already done, newest first
        pastBookings() {
            const now = Date.now()
            return this.myBookings
                .filter(b => new Date(b.date).getTime() < now)
                .sort((a, b) => new Date(b.date) - new Date(a.date))
        },

        // live price based on the tutors rate and the minutes picked
        estimatedCost() {
            const tutor = this.tutors.find(t => t.tutorId === this.bookingForm.tutorId)
            if (!tutor || !this.bookingForm.duration) return null
            return (Number(tutor.hourlyRate || 0) * Number(this.bookingForm.duration)) / 60
        },

        minDateTime() {
            const d = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
            return d.toISOString().slice(0, 16)
        }
    },

    watch: {
        // fills the tutor in automatically when you came from a "book with" button
        selectedTutorId: {
            immediate: true,
            handler(value) {
                if (value) {
                    this.bookingForm.tutorId = value
                }
            }
        }
    },

    methods: {
        changePage(page) {
            this.$emit("change-page", page)
        },

        notify(type, message) {
            this.$emit("notify", { type, message })
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

        // checks the date, saves the booking then jumps back to the list
        async createNewBooking() {
            if (new Date(this.bookingForm.date).getTime() <= Date.now()) {
                this.notify('error', 'Please choose a future date and time.')
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
                this.$emit("refresh")
                this.notify('success', 'Booking confirmed!')
                this.changePage('bookings')
            } catch (e) {
                this.notify('error', e.message)
            } finally {
                this.loading = false
            }
        },

        // opens the pay pop up and works out the amount from the tutors rate
        openPay(booking) {
            this.modalError = ""
            const tutor = this.tutors.find(t => (t.bookings || []).some(b => b.bookingId === booking.bookingId))
            const hours = Number(booking.duration || 60) / 60
            this.paymentForm.amount = tutor ? Number((Number(tutor.hourlyRate || 0) * hours).toFixed(2)) : 0
            this.payTarget = booking
        },

        closePay() {
            this.payTarget = null
            this.modalError = ""
        },

        // double checks with the student first, then cancels on the backend
        async cancelBooking(booking) {
            if (!window.confirm(`Cancel your ${this.subjectName(booking.subjectCode)} booking on ${this.formatDate(booking.date)}?`)) return

            this.error = ""
            try {
                await deleteBooking(booking.bookingId)
                this.$emit("refresh")
                this.notify('success', 'Booking cancelled.')
            } catch (e) {
                this.error = e.message
            }
        },

        // sends the payment through to the backend
        async confirmPay() {
            this.modalError = ""
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
                this.closePay()
                this.$emit("refresh")
                this.notify('success', 'Payment successful!')
            } catch (e) {
                this.modalError = e.message
            } finally {
                this.loading = false
            }
        }
    }
}
</script>

<style scoped>
.page-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f7f8fa;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  text-align: left;
}

.page-content {
  flex: 1;
  padding: 30px;
  box-sizing: border-box;
}

.page-content.narrow {
  max-width: 820px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
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

.page-header h1 {
  font-size: 30px;
  margin: 0;
}

.header-description {
  color: #d7dde3;
  font-size: 14px;
  margin: 7px 0 0;
}

.dashboard-card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 22px;
  margin-bottom: 22px;
}

.form-card {
  border-top: 4px solid #f28c28;
  padding: 26px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 14px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 8px;
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

/* TABLES */
.table-scroll {
  overflow-x: auto;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 1.5fr 1.4fr 1.1fr 1fr 0.9fr 0.9fr 1.4fr;
  padding: 12px 5px;
  align-items: center;
  min-width: 820px;
}

.table-header {
  color: #8a94a3;
  font-size: 10px;
  font-weight: bold;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.table-row {
  border-top: 1px solid #edf1f5;
  font-size: 13px;
}

.row-dim {
  color: #8a94a3;
}

.cell-strong {
  font-weight: bold;
}

.row-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.status-chip {
  justify-self: start;
  padding: 3px 11px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: bold;
  white-space: nowrap;
}

.status-chip.paid {
  background: #e6f4ec;
  color: #1e7a58;
}

.status-chip.unpaid {
  background: #fce8e6;
  color: #c0392b;
}

/* EMPTY STATES */
.empty-state {
  min-height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.empty-state.slim {
  min-height: 80px;
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

.muted {
  color: #8a94a3;
}

.book-cta {
  width: auto;
  margin-top: 16px;
  padding: 10px 18px;
}

.outline-button {
  background-color: #ffffff;
  color: #b35c10;
  border: 1px solid #f28c28;
  border-radius: 7px;
  padding: 12px 18px;
  font-family: inherit;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
}

.outline-button:hover {
  background-color: #fff7ef;
}

/* BUTTONS */
.nav-action-button {
  background-color: rgba(255, 255, 255, 0.14);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: 7px;
  padding: 11px 22px;
  font-family: inherit;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
}

.nav-action-button:hover {
  background-color: #f28c28;
  border-color: #f28c28;
}

.small-button {
  background-color: #2c3e50;
  color: #ffffff;
  border: none;
  border-radius: 7px;
  padding: 7px 13px;
  font-family: inherit;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
}

.small-button:hover {
  background-color: #f28c28;
}

.small-button.danger-outline {
  background-color: #ffffff;
  color: #c0392b;
  border: 1px solid #e0a9a2;
}

.small-button.danger-outline:hover {
  background-color: #fbeae8;
}

.submit-button {
  background-color: #2c3e50;
  color: #ffffff;
  border: none;
  border-radius: 7px;
  padding: 12px 18px;
  font-family: inherit;
  font-size: 14px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #f28c28;
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit-button.block {
  display: block;
  width: 100%;
  margin-top: 6px;
}

.error {
  color: #c0392b;
  font-size: 13px;
  margin: 0 0 12px;
}

/* FORM */
form {
  margin-top: 20px;
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

label {
  display: flex;
  flex-direction: column;
  gap: 7px;
  font-size: 13px;
  font-weight: bold;
  color: #55657a;
  text-align: left;
  margin-bottom: 16px;
}

input,
select {
  padding: 11px 13px;
  border: 1px solid #c5cfdc;
  border-radius: 7px;
  font-size: 14px;
  font-weight: normal;
  font-family: inherit;
  color: #2c3e50;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

input:focus,
select:focus {
  outline: none;
  border-color: #f28c28;
  box-shadow: 0 0 0 3px rgba(242, 140, 40, 0.18);
}

.cost-estimate {
  background: #fff3e7;
  border: 1px solid #f9d4ae;
  color: #b35c10;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  margin-bottom: 18px;
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
  font-size: 20px;
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
  font-size: 14px;
  margin: 10px 0 18px;
  line-height: 1.5;
}

/* TRANSITIONS */
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
