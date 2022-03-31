<template>
	<div class="main">
		<a-form-model
			id="formLogin"
			ref="formLogin"
			class="user-layout-login"
			:model="form"
			:rules="rules"
			@submit.prevent="handleSubmit"
		>
			<div class="form-item-wrap" style="text-align: center;">
				<a href="#" style="font-size: 1rem;" @click.prevent>账号密码登录</a>
			</div>
			<div class="form-item-wrap">
				<a-form-model-item ref="username" label="" prop="username">
					<a-input
						v-model="form.username"
						:placeholder="$t('user.login.username.placeholder')"
						size="large"/>
				</a-form-model-item>
			</div>
			<div class="form-item-wrap">
				<a-form-model-item ref="password" label="" prop="password">
					<a-input
						v-model="form.password"
						type="password"
						:placeholder="$t('user.login.password.placeholder')"
						size="large"
						/>
				</a-form-model-item>
			</div>

			<div>
				<a-button
					size="large"
					type="primary"
					htmlType="submit"
					block
					:loading="loading"
					:disabled="loading"
					>
						{{ $t('user.login.login') }}
					</a-button>
			</div>
		</a-form-model>
	</div>
</template>

<script>
import { timeFix } from '@/utils/util'

export default {
	name: 'LoginNew',
	data() {
		return {
			loading: false,
			form: {
				username: '',
				password: '',
			},
			rules: {
				username: [
					{ required: true, message: 'Please input username', trigger: 'blur' },
				],
				password: [
					{ required: true, message: 'Please input password', trigger: 'blur' },
				],
			}
		}
	},
	methods: {
		handleSubmit() {
			this.$refs.formLogin.validate(valid => {
				if (valid) {
					const {username, password} = this.form
					const requestData = {
						username,
						password,
						remember_me: true,
						captcha: 'abcd'
					}
					this.loading = true
					this.$store.dispatch('Login', requestData).then(() => {
						this.$router.push({ path: '/dashboard/workplace' })
						// 延迟 1 秒显示欢迎信息
						setTimeout(() => {
							this.$notification.success({
							message: '欢迎',
							description: `${timeFix()}，欢迎回来`
							})
						}, 1000)
					}).finally(() => {
						this.loading = false
					})

					// postAction('/sys/login', requestData).then((data) => {
					// 	debugger
					// }).finally(() => {
					// 	debugger
					// 	this.loading = false
					// })
				}
			})
		},
	}
}
</script>

<style lang="less" scoped>
.form-item-wrap{
	margin-bottom: 1rem;
}
</style>