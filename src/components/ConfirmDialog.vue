<template>
    <transition name="confirm-fade">
        <div class="confirm-backdrop" @click.self="$emit('cancel')">
            <div class="confirm-box">
                <h3>Log Out</h3>
                <p>{{ message }}</p>

                <div class="confirm-actions">
                    <button
                        type="button"
                        class="cancel-button"
                        @click="$emit('cancel')"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        class="confirm-button"
                        @click="$emit('confirm')"
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: "ConfirmDialog",

    props: {
        message: {
            type: String,
            default: "Are you sure?"
        }
    }
}
</script>

<style scoped>
.confirm-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(44, 62, 80, 0.55);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    padding: 20px;
}

.confirm-box {
    width: 100%;
    max-width: 380px;
    background: #ffffff;
    border-radius: 12px;
    padding: 26px;
    box-sizing: border-box;
    text-align: left;
    font-family: Avenir, Helvetica, Arial, sans-serif;
}

.confirm-box h3 {
    margin: 0 0 8px;
    font-size: 18px;
    color: #2c3e50;
}

.confirm-box p {
    margin: 0 0 22px;
    color: #55657a;
    font-size: 14px;
    line-height: 1.5;
}

.confirm-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.cancel-button {
    background-color: #ffffff;
    color: #2c3e50;
    border: 1px solid #d5dbe2;
    border-radius: 7px;
    padding: 10px 20px;
    font-family: inherit;
    font-size: 13px;
    cursor: pointer;
}

.cancel-button:hover {
    background-color: #f7f8fa;
}

.confirm-button {
    background-color: #c0392b;
    color: #ffffff;
    border: none;
    border-radius: 7px;
    padding: 10px 20px;
    font-family: inherit;
    font-size: 13px;
    font-weight: bold;
    cursor: pointer;
}

.confirm-button:hover {
    background-color: #96281b;
}

.confirm-fade-enter-active,
.confirm-fade-leave-active {
    transition: opacity 0.2s ease;
}

.confirm-fade-enter,
.confirm-fade-leave-to {
    opacity: 0;
}
</style>
