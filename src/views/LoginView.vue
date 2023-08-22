<script setup>
import { ref } from 'vue'
import LoginDialog from '../components/dialogs/LoginDialog.vue'
import RegisterDialog from '../components/dialogs/RegisterDialog.vue'
import WarningDialog from '../components/dialogs/WarningDialog.vue'

const isLogin = ref(true)
const dialogText = ref('Failed Failed Failed Failed Failed Failed Failed Failed Failed Failed')
const dialogRef = ref()

function showDialog(showMsg) {
  dialogText.value = showMsg
  dialogRef.value.open()
}
</script>

<template>
  <div id="container">
    <div :class="isLogin ? 'loginPage' : 'registerPage'">
      <LoginDialog id="login" @show-dialog="showDialog" @toggle="isLogin = !isLogin" />
      <RegisterDialog id="register" @show-dialog="showDialog" @toggle="isLogin = !isLogin" />
    </div>
  </div>
  <WarningDialog ref="dialogRef">
    <template v-slot:waringText>
      {{ dialogText }}
    </template>
  </WarningDialog>
</template>

<style scoped>
#container {
  background-color: darkgrey;
  display: grid;
  grid-template-columns: 25% 50% 25%;
  grid-template-rows: 15% 70% 15%;
  place-content: center;

  height: 100vh;
  font-size: 4vh;
}

#login,
#register {
  grid-column: 1/2;
  grid-row: 1/2;
  width: 100%;
  height: 100%;
  border-radius: 5vh;
  background-color: #eee;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 0 2vh 2vh 2vh;
}

#register {
  transform: translateZ(-1px) rotateY(-180deg);
}

.loginPage,
.registerPage {
  grid-column: 2/3;
  grid-row: 2/3;

  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 100%;
  place-items: center;

  transform-style: preserve-3d;
  transition: transform 0.5s ease-in-out;
}

.loginPage {
  transform: rotateY(0deg);
}

.registerPage {
  transform: rotateY(-180deg);
}
</style>

<style>
#app {
  background-color: darkgrey;
}
</style>