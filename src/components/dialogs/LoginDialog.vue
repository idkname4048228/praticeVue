<script setup>
import { ref, onMounted } from 'vue'
import router from '../../router'

const emit = defineEmits(['show-dialog', 'toggle'])

let current_verificationCode = 0
const account = ref('')
const password = ref('')
const verificationCode = ref('')
const question = ref('1 + 1 = ')

const passwordInput = ref(null)
const questionInput = ref(null)

function getVerificationCode() {
  fetch('http://localhost:3000/api/verification', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify()
  })
    .then((response) => response.json())
    .then((result) => {
      current_verificationCode = result.current_verificationCode
      question.value = result.question
    })
    .catch((error) => {
      console.log(error)
    })
}

function loginSubmit() {
  if (verificationCode.value != current_verificationCode) {
    emit('show-dialog', 'incorrect verification code')
    getVerificationCode()
    verificationCode.value = ''
    return
  }

  var data = {
    account: account.value,
    password: password.value
  }

  fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        sessionStorage.setItem('token', result.token)
        router.push('/')
      } else {
        emit('show-dialog', 'Login Fail')
        getVerificationCode()
        verificationCode.value = ''
      }
    })
    .catch((error) => {
      console.error(error)
    })
}

onMounted(() => {
  getVerificationCode()
})
</script>

<template>
  <div id="login">
    <div class="flex100 title-text">Login</div>
    <form class="flex100" @submit.prevent="$refs.passwordInput.focus()">
      <label for="login-account">Account</label>
      <input id="login-account" type="text" v-model="account" />
    </form>
    <form class="flex100" @submit.prevent="$refs.questionInput.focus()">
      <label for="login-password">Password</label>
      <input
        id="login-password"
        type="password"
        v-model="password"
        ref="passwordInput"
        autocomplete="off"
      />
    </form>
    <form class="flex100" @submit.prevent="loginSubmit">
      <label for="login-question"
        ><span id="question">{{ question }}</span></label
      >
      <input id="login-question" type="text" ref="questionInput" v-model="verificationCode" />
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
          Register
        </button>
      </div>
      <div class="flex50">
        <button id="login-submit" @click="loginSubmit">Login</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../../assets/DialogForm.css';

label[for='login-account'],
label[for='login-password'],
label[for='login-question'] {
  width: 30%;
}

#login-account,
#login-password,
#login-question {
  width: 70%;
  height: 5vh;
  padding-left: 0.5vh;
}

#login-submit {
  width: 70%;
  padding: 1.5vh;
  font-size: 2.5vh;
}
</style>
