<template>
  <div class="payment-page">
    <div class="page-header">
      <button class="back-btn" @click="goBack">
        <i class="bi bi-arrow-left"></i>
      </button>
      <h2>Payment</h2>
    </div>

    <div class="row g-4">
      <!-- LEFT SIDE -->
      <div class="col-12 col-lg-6">
        <div class="payment-card">
          <div class="section-title">Booking Details</div>

          <div v-if="loadingBooking" class="text-center py-3">
            <div class="spinner-border" role="status"></div>
            <p class="loading-text">Loading booking...</p>
          </div>

          <div v-else-if="booking" class="booking-info">
            <div class="info-row">
              <span class="info-label">Booking ID</span>
              <span class="info-value">{{ booking.bookingId }}</span>
            </div>

            <div class="info-row">
              <span class="info-label">Subject</span>
              <span class="info-value">{{ booking.subjectCode }}</span>
            </div>

            <div class="info-row">
              <span class="info-label">Date</span>
              <span class="info-value">{{ formatDate(booking.date) }}</span>
            </div>

            <div class="info-row">
              <span class="info-label">Duration</span>
              <span class="info-value">{{ booking.duration }} minutes</span>
            </div>

            <div class="info-row">
              <span class="info-label">Tutor</span>
              <span class="info-value">
                {{ tutor ? `${tutor.firstName} ${tutor.lastName}` : 'Not available' }}
              </span>
            </div>

            <div class="info-row">
              <span class="info-label">Hourly Rate</span>
              <span class="info-value">R{{ hourlyRate.toFixed(2) }}</span>
            </div>

            <div class="info-row">
              <span class="info-label">Session</span>
              <span class="session-badge">
                {{ formatSessionType(booking.sessionType) }}
              </span>
            </div>
          </div>

          <div v-else class="alert alert-warning">
            Booking information could not be loaded.
          </div>
        </div>

        <div class="payment-card">
          <div class="section-title">Payment Summary</div>

          <div class="price-row">
            <span class="price-label">Tutor hourly rate</span>
            <span class="price-value">R{{ hourlyRate.toFixed(2) }}</span>
          </div>

          <div class="price-row">
            <span class="price-label">Duration</span>
            <span class="price-value">{{ durationHours.toFixed(2) }} hour(s)</span>
          </div>

          <div class="price-summary">
            <div class="total-row">
              <span class="total-label">Total</span>
              <span class="total-amount">
                R{{ payment.amount.toFixed(2) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-6">
        <div class="payment-card">
          <div class="section-title">Payment Method</div>

          <div
            v-if="isInPerson"
            class="payment-option"
            :class="{ selected: payment.paymentMethod === 'IN_PERSON' }"
            @click="selectPaymentMethod('IN_PERSON')"
          >
            <div class="payment-option-content">
              <input
                type="radio"
                value="IN_PERSON"
                v-model="payment.paymentMethod"
              >

              <div class="payment-icon">
                <i class="bi bi-cash"></i>
              </div>

              <div>
                <div class="payment-option-title">Pay in Person</div>
                <p class="payment-option-text">
                  Pay the tutor directly during your session.
                </p>
              </div>
            </div>
          </div>

          <div
            class="payment-option"
            :class="{ selected: payment.paymentMethod === 'ONLINE' }"
            @click="selectPaymentMethod('ONLINE')"
          >
            <div class="payment-option-content">
              <input
                type="radio"
                value="ONLINE"
                v-model="payment.paymentMethod"
              >

              <div class="payment-icon">
                <i class="bi bi-credit-card"></i>
              </div>

              <div>
                <div class="payment-option-title">Online Payment</div>
                <p class="payment-option-text">
                  Pay securely using your card.
                </p>
              </div>
            </div>
          </div>

          <div
            v-if="payment.paymentMethod === 'IN_PERSON'"
            class="in-person-info"
          >
            <div class="d-flex gap-3">
              <i class="bi bi-info-circle"></i>

              <div>
                <h6>Pay the tutor in person</h6>
                <p>
                  You will pay the tutor directly during your session.
                  The payment will remain pending until the tutor
                  confirms that payment has been received.
                </p>
              </div>
            </div>
          </div>

          <div
            v-if="payment.paymentMethod === 'ONLINE'"
            class="card-details"
          >
            <div class="mb-3">
              <label class="form-label">Cardholder Name</label>
              <input
                type="text"
                class="form-control"
                v-model="cardName"
                placeholder="Enter cardholder name"
              >
            </div>

            <div class="mb-3">
              <label class="form-label">Card Number</label>
              <input
                type="text"
                class="form-control"
                v-model="cardNumber"
                placeholder="1234 5678 9012 3456"
              >
            </div>

            <div class="row">
              <div class="col-6">
                <label class="form-label">Expiry Date</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="expiryDate"
                  placeholder="MM / YY"
                >
              </div>

              <div class="col-6">
                <label class="form-label">CVV</label>
                <input
                  type="password"
                  class="form-control"
                  v-model="cvv"
                  placeholder="•••"
                >
              </div>
            </div>
          </div>

          <div v-if="errorMessage" class="alert alert-danger mt-3">
            {{ errorMessage }}
          </div>

          <div v-if="successMessage" class="alert alert-success mt-3">
            {{ successMessage }}
          </div>

          <button
            class="payment-btn"
            @click="createPayment"
            :disabled="processing"
          >
            <span v-if="processing">
              <span class="spinner-border spinner-border-sm me-2"></span>
              Processing...
            </span>

            <span v-else>
              <i
                v-if="payment.paymentMethod === 'ONLINE'"
                class="bi bi-lock-fill me-2"
              ></i>

              <i
                v-else
                class="bi bi-check-circle me-2"
              ></i>

              {{ buttonText }}
            </span>
          </button>

          <div
            v-if="payment.paymentMethod === 'ONLINE'"
            class="secure-text"
          >
            <i class="bi bi-shield-check"></i>
            Your payment information is secure.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getBookingById } from '@/services/bookingService'
import { getTutorById } from '@/services/tutorService'
import { createPayment } from '@/services/paymentService'

export default {
  name: 'Payment',

  props: {
    bookingId: {
      type: String,
      required: true
    },
    tutorId: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      booking: null,
      tutor: null,
      loadingBooking: false,
      processing: false,
      errorMessage: '',
      successMessage: '',

      payment: {
        paymentRef: '',
        amount: 0,
        paymentDate: '',
        paymentMethod: '',
        status: 'PENDING',
        booking: {
          bookingId: this.bookingId
        }
      },

      cardName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: ''
    }
  },

  computed: {
    isInPerson() {
      return this.booking &&
        this.booking.sessionType === 'IN_PERSON'
    },

    hourlyRate() {
      return this.tutor
        ? Number(this.tutor.hourlyRate || 0)
        : 0
    },

    durationHours() {
      if (!this.booking || !this.booking.duration) return 0

      return Number(this.booking.duration) / 60
    },

    totalAmount() {
      return this.hourlyRate * this.durationHours
    },

    buttonText() {
      if (this.payment.paymentMethod === 'ONLINE') {
        return `Pay R${this.payment.amount.toFixed(2)}`
      }

      return 'Confirm Payment'
    }
  },

  async created() {
    this.generatePaymentReference()
    await this.loadBooking()
  },

  methods: {
    async loadBooking() {
      this.loadingBooking = true
      this.errorMessage = ''

      try {
        this.booking = await getBookingById(this.bookingId)
        this.tutor = await getTutorById(this.tutorId)

        this.payment.amount = this.totalAmount

        if (this.isInPerson) {
          this.payment.paymentMethod = 'IN_PERSON'
        } else {
          this.payment.paymentMethod = 'ONLINE'
        }
      } catch (e) {
        console.error(e)
        this.errorMessage = e.message || 'Unable to load booking information.'
      } finally {
        this.loadingBooking = false
      }
    },

    generatePaymentReference() {
      this.payment.paymentRef = `PM-${Date.now()}`
    },

    selectPaymentMethod(method) {
      if (method === 'IN_PERSON' && !this.isInPerson) return

      this.payment.paymentMethod = method
    },

    async createPayment() {
      this.errorMessage = ''
      this.successMessage = ''

      if (!this.payment.paymentMethod) {
        this.errorMessage = 'Please select a payment method.'
        return
      }

      if (this.payment.amount <= 0) {
        this.errorMessage = 'The payment amount could not be calculated.'
        return
      }

      if (this.payment.paymentMethod === 'ONLINE') {
        if (!this.cardName || !this.cardNumber || !this.expiryDate || !this.cvv) {
          this.errorMessage = 'Please complete your card details.'
          return
        }
      }

      this.processing = true

      try {
        const paymentData = {
          paymentRef: this.payment.paymentRef,
          amount: this.payment.amount,
          paymentDate: new Date().toISOString().slice(0, 19),
          paymentMethod: this.payment.paymentMethod,
          status: this.payment.paymentMethod === 'IN_PERSON'
            ? 'PENDING'
            : 'PAID',
          booking: {
            bookingId: this.bookingId
          }
        }

        await createPayment(paymentData)

        if (this.payment.paymentMethod === 'IN_PERSON') {
          this.successMessage =
            'Payment recorded. The tutor will confirm the payment once it has been received.'
        } else {
          this.successMessage = 'Payment successful.'
        }
      } catch (e) {
        console.error(e)
        this.errorMessage = e.message || 'Payment could not be processed.'
      } finally {
        this.processing = false
      }
    },

    formatDate(value) {
      if (!value) return 'Not available'

      return new Date(value).toLocaleString('en-ZA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    formatSessionType(type) {
      if (!type) return 'Not specified'

      return type === 'IN_PERSON'
        ? 'In-person'
        : 'Online'
    },

    goBack() {
      this.$router.back()
    }
  }
}
</script>

<style scoped>
.payment-page {
  min-height: 100vh;
  background-color: #f7f7f7;
  font-family: Arial, sans-serif;
  color: #222;
  padding: 25px 20px 40px;
}

.page-header {
  max-width: 1000px;
  margin: 0 auto 25px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.page-header h2 {
  margin: 0;
  color: #062b67;
  font-size: 22px;
  font-weight: 700;
}

.back-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background-color: white;
  color: #062b67;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
}

.row {
  max-width: 1000px;
  margin: auto;
}

.payment-card {
  background-color: white;
  border-radius: 15px;
  padding: 22px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
}

.section-title {
  color: #062b67;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 18px;
}

.loading-text {
  color: #777;
  font-size: 13px;
  margin-top: 10px;
}

.booking-info {
  background-color: #f1f1f1;
  border-radius: 10px;
  padding: 15px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
  font-size: 13px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  color: #777;
}

.info-value {
  font-weight: 600;
  text-align: right;
}

.session-badge {
  background-color: #e4edff;
  color: #062b67;
  border-radius: 20px;
  padding: 5px 12px;
  font-size: 11px;
  font-weight: 600;
}

.payment-option {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: 0.2s;
}

.payment-option:hover {
  border-color: #2563eb;
}

.payment-option.selected {
  border: 2px solid #2563eb;
  background-color: #f4f7ff;
}

.payment-option-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.payment-option input {
  accent-color: #062b67;
}

.payment-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: #e9efff;
  color: #062b67;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
}

.payment-option-title {
  font-size: 14px;
  font-weight: 600;
}

.payment-option-text {
  font-size: 11px;
  color: #777;
  margin: 2px 0 0;
}

.in-person-info {
  background-color: #f4f7ff;
  border-radius: 10px;
  padding: 15px;
  margin-top: 18px;
}

.in-person-info i {
  color: #2563eb;
  font-size: 22px;
}

.in-person-info h6 {
  color: #062b67;
  font-size: 14px;
  font-weight: 700;
}

.in-person-info p {
  color: #666;
  font-size: 12px;
  margin: 0;
  line-height: 1.5;
}

.card-details {
  margin-top: 20px;
}

.form-label {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 6px;
}

.form-control {
  background-color: #f1f1f1;
  border: none;
  border-radius: 8px;
  padding: 11px;
  font-size: 13px;
}

.form-control:focus {
  background-color: #f1f1f1;
  border: 1px solid #2563eb;
  box-shadow: none;
}

.price-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin-bottom: 10px;
}

.price-label {
  color: #777;
}

.price-value {
  font-weight: 600;
}

.price-summary {
  border-top: 1px solid #ddd;
  padding-top: 18px;
  margin-top: 20px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-label {
  font-size: 15px;
  font-weight: 700;
}

.total-amount {
  color: #062b67;
  font-size: 22px;
  font-weight: 700;
}

.payment-btn {
  width: 100%;
  border: none;
  border-radius: 8px;
  background-color: #062b67;
  color: white;
  padding: 13px;
  margin-top: 18px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.payment-btn:hover {
  background-color: #041f4d;
}

.payment-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.secure-text {
  text-align: center;
  color: #888;
  font-size: 11px;
  margin-top: 12px;
}

@media (max-width: 767px) {
  .payment-page {
    padding: 20px 15px 30px;
  }

  .page-header h2 {
    font-size: 20px;
  }

  .payment-card {
    padding: 18px;
  }

  .info-row {
    font-size: 12px;
  }
}
</style>