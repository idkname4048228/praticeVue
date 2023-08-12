<script setup>
import { ref } from 'vue'
const emit = defineEmits(['show-dialog', 'toggle'])

const account = ref('')
const password = ref('')
const checkPassword = ref('')

const passwordInput = ref(null)
const checkpwInput = ref(null)

function registerSubmit() {
  var data = {
    account: account.value,
    password: password.value,
    registerPW: checkPassword.value
  }

  fetch('http://localhost:3000/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then((response) => response.json())
    .then((result) => {
      emit('show-dialog', `${result.resultString}`)
      if (result.success) {
        account.value = ''
        password.value = ''
        checkPassword.value = ''
        emit('toggle')
      }
    })
    .catch((error) => {
      console.log(error)
    })
}
</script>

<template>
  <div id="register">
    <div class="flex100 title-text">Register</div>
    <form class="flex100" @submit.prevent="$refs.passwordInput.focus()">
      <label for="register-account">Account</label>
      <input id="register-account" type="text" v-model="account" />
    </form>
    <form class="flex100" @submit.prevent="$refs.checkpwInput.focus()">
      <label for="register-password">Password</label>
      <input
        id="register-password"
        type="password"
        v-model="password"
        ref="passwordInput"
        autocomplete="off"
      />
    </form>
    <form class="flex100" @submit.prevent="registerSubmit">
      <label for="register-question">Check Password</label>
      <input
        id="register-question"
        type="password"
        v-model="checkPassword"
        ref="checkpwInput"
        autocomplete="off"
      />
    </form>

    <div class="flex100">
      <div class="flex50">
        <button
          id="toggle-button"
          @click="
            () => {
              emit('toggle')
            }
          "
        >
          Login
        </button>
      </div>
      <div class="flex50">
        <button id="register-submit" @click="registerSubmit">Register</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../../assets/DialogForm.css';

label[for='register-account'],
label[for='register-password'],
label[for='register-question'] {
  width: 30%;
}

#register-account,
#register-password,
#register-question {
  width: 70%;
  height: 5vh;
  padding-left: 0.5vh;
}

#register-submit {
  width: 70%;
  padding: 1.5vh;
  font-size: 2.5vh;
}
</style>
