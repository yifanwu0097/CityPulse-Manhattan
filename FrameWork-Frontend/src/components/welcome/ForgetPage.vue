<script setup>
import { reactive, ref } from "vue";
import { EditPen, Lock, Message } from "@element-plus/icons-vue";
import { post } from "@/net/axios";
import { ElMessage } from "element-plus";
import router from "@/router";

const active = ref(0);

const form = reactive({
  email: "",
  code: "",
  password: "",
  password_repeat: "",
});

const validatePass = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("Please input the password again"));
  } else if (value !== form.password) {
    callback(new Error("Two inputs don't match!"));
  } else {
    callback();
  }
};

const rules = {
  email: [
    { required: true, message: "Please input email address", trigger: "blur" },
    {
      type: "email",
      message: "Not Valid Email",
      trigger: ["blur", "change"],
    },
  ],
  code: [{ required: true, message: "Please input verification code", trigger: "blur" }],
  password: [
    { required: true, message: "Please input password", trigger: "blur" },
    {
      min: 8,
      max: 20,
      message: "Password must be between 8 and 20 characters in length",
      trigger: ["blur", "change"],
    },
  ],
  password_repeat: [{ validator: validatePass, trigger: ["blur", "change"] }],
};

const formRef = ref();
const isEmailValid = ref(false);
const coldTime = ref(0);

const onValidate = (prop, isValid) => {
  if (prop === "email") isEmailValid.value = isValid;
};

const validateEmail = () => {
  coldTime.value = 60;
  post(
    "/api/auth/valid-reset-email",
    {
      email: form.email,
    },
    (message) => {
      ElMessage.success(message);
      setInterval(() => coldTime.value--, 1000);
    },
    (message) => {
      ElMessage.warning(message);
      coldTime.value = 0;
    }
  );
};

const startReset = () => {
  formRef.value.validate((isValid) => {
    if (isValid) {
      post(
        "/api/auth/start-reset",
        {
          email: form.email,
          code: form.code,
        },
        () => {
          active.value++;
        }
      );
    } else {
      ElMessage.warning("Please Input the Email and Code");
    }
  });
};

const doReset = () => {
  formRef.value.validate((isValid) => {
    if (isValid) {
      post(
        "/api/auth/do-reset",
        {
          password: form.password,
        },
        (message) => {
          ElMessage.success(message);
          router.push("/");
        }
      );
    } else {
      ElMessage.warning("Please Input New Password");
    }
  });
};
</script>

<template>
  <div style="text-align: center; margin:0 20px; position: relative; top: -5vh">
    <div style="margin-top: -20px;">
      <img
        src="../../assets/logo/logo_icon.png"
        alt="ucd"
        style="width: 40px; padding-bottom: 10px"
      />&nbsp
      <img
        src="../../assets/logo/logo_text.png"
        alt="ucd"
        style="width: 130px; padding-bottom: 20px"
      />
    </div>
    <hr style="margin-bottom: 20px;" />
    <div style="margin: 0px 20px">
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="Verify Email " />
        <el-step title="Reset Password" />
      </el-steps>
    </div>
    <div style="text-align: center; margin: 50px 20px; height: 100%" v-if="active === 0">
      <div style="font-size: 25px; font-weight: bold; color: #ff914d">Reset Password</div>
      <div style="font-size: 14px; color: rgb(227, 227, 227)">Please Input Email to Verify</div>
      <div style="margin-top: 30px"></div>
      <el-form :model="form" :rules="rules" @validate="onValidate" ref="formRef">
        <el-form-item prop="email">
          <el-input v-model="form.email" type="email" placeholder="Email">
            <template #prefix>
              <el-icon><Message /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-row :gutter="10" style="width: 100%">
            <el-col :span="17">
              <el-input
                v-model="form.code"
                :maxlength="6"
                type="text"
                placeholder="Verification Code"
              >
                <template #prefix>
                  <el-icon><EditPen /></el-icon>
                </template>
              </el-input>
            </el-col>
            <el-col :span="5">
              <el-button
                color="#FF914d"
                @click="validateEmail"
                :disabled="!isEmailValid || coldTime > 0"
              >
                {{ coldTime > 0 ? "Wait " + coldTime + " S" : "Get Code" }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div style="margin-top: 70px">
        <el-button @click="startReset()" style="width: 270px" color="#FF914d" plain
          >Password Reset</el-button
        >
      </div>
    </div>
    <div style="text-align: center; margin: 40px 20px; height: 100%" v-if="active === 1">
      <div style="font-size: 25px; font-weight: bold; color: #ff914d;">Reset Password</div>
      <div style="font-size: 14px; color: rgb(227, 227, 227)">Please Input New Password</div>
      <div style="margin-top: 30px">
        <el-form :model="form" :rules="rules" @validate="onValidate" ref="formRef">
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              :maxlength="20"
              type="password"
              placeholder="New Password"
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password_repeat">
            <el-input
              v-model="form.password_repeat"
              :maxlength="16"
              type="password"
              placeholder="Repeat New Password"
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div style="margin-top: 70px">
        <el-button @click="doReset()" style="width: 270px" type="danger" plain
          >Reset Password Now</el-button
        >
      </div>
    </div>
    <div style="margin-top: 20px; text-align: center; color: #dedede">
      ------
      <span style="font-size: 14px; line-height: 15px; color: rgb(233, 233, 233)"
        >Have a Account?
      </span>
      <el-link type="warning" style="translate: 0 -2px" @click.stop="router.push('/')"
        >Sign In</el-link
      >
      ------
    </div>
  </div>
</template>

<style lang="scss">
.el-step__title.is-process {
  color: #ff914d;
}
.el-step__head.is-process {
  color: #ff914d;
  border-color: #ff914d;
}
</style>
