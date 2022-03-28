<template>
	<div>
		<a-card>
			<h2>
				This is bkp Test
			</h2>

			<div style="border: 1px solid skyblue;">
				<equip-instance-selector-new v-model="testModel" :equip-models="equipModels"></equip-instance-selector-new>
			</div>


			<div>
				<a-icon class="circle-clear"></a-icon>
			</div>

			<div>
				<a-button @click="handleTest">Test</a-button>
				<a-button @click="handleTest2">Test2</a-button>
			</div>
			<div>
				{{ JSON.stringify(testModel)}}
			</div>

			<div>
				<a-button type="primary" @click="handleSearchPointByCode">
					searchPointByCode
				</a-button>
			</div>

		</a-card>

		<search-point-by-code ref="searchPointByCode"/>
	</div>
</template>

<script>
import EquipInstanceSelectorNew from './EquipInstanceSelectorNew/EquipInstanceSelectorNew.vue'
import SearchPointByCode from './SearchPointByCode'

export default {
    components: {
		EquipInstanceSelectorNew,
		SearchPointByCode,
	},
	name: 'BKPTest',
	data() {
		return {
			equipModels: [4],
			testModel: [
				{
					moduleName: 'CR400BF-3',
					instances: ['3001','3003'],
					units: [1,3],
				},
			],
		}
	},
	created() {

	},
	methods: {
		handleTest() {
			this.testModel = [
				{
					moduleName: 'CR400BF-3',
					instances: ['3001', '3002','3003'],
					units: [1,2,3],
				},
				{
					moduleName: 'CR400BF-5',
					instances: ['5001', '5003'],
					units: [],
				}
			]
		},
		handleTest2() {
			this.equipModels = [1,2,3]
		},
		handleSearchPointByCode() {
            this.$refs.searchPointByCode.showModal()
        },
	}
}
</script>

<style lang="less" scoped>

</style>