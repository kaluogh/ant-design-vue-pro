<template>
	<div>
		<a-spin :spinning="isLoading">
			<div>
				This is EquipInstanceSelectorNew
			</div>

			<div>
				<a-button @click="handleDebugger">Test</a-button>
			</div>

			<a-table
				size="small"
				:columns="columns"
           		:data-source="typesData"
           		rowKey="index"
           		:pagination="false"
           		bordered>
				<template slot="modelInfo" slot-scope="modelInfo">
					<div>
						{{ modelInfo.modelName }}
					</div>
				</template>
				<template slot="instanceInfo" slot-scope="instanceInfo, record">
					<div>
						<div :class="['tag-row', isReadonly ? 'align-center' : 'align-left']">
							<a-tag
								class="info-tag"
								:closable="!isReadonly"
								color="blue"
								v-for="item in instanceInfo.items.filter(item => item.isSelected)"
								:key="'group_name_' + item.label"
								@close="handleUnSelectInstanceItem(instanceInfo, item.label)">
									{{ item.label }}
							</a-tag>
						</div>
						<div v-show="!isReadonly" class="align-right">
							<a-tag
								class="info-tag"
								color="#2db7f5"
								@click="handleShowInstanceSelector(instanceInfo, record)">
									选择车组
							</a-tag>
							<a-tag
								class="info-tag"
								color="#87d068"
								@click="handleSelectAllInstanceItems(instanceInfo)">
									全部选择
							</a-tag>
							<a-tag
								class="info-tag"
								color="#f50"
								@click="handleUnSelectAllInstanceItems(instanceInfo)">
									全部取消
							</a-tag>
						</div>
						<div v-show="!isReadonly && instanceInfo.selectorVisible">
							<a-select
								v-model="instanceInfo.selectedLabelArray"
								:id="record.modelInfo.modelName + 'selector'"
								:ref="record.modelInfo.modelName + 'selector'"
								showArrow
								mode="multiple"
								style="width: 100%"
								@blur="handleInstanceInfoSelectorHide(instanceInfo)"
								@change="(arrayData) => { handleInstanceInfoSelectedLabelArray(arrayData, instanceInfo)}"
								>
							  		<a-select-option
									  	v-for="(item, index) in instanceInfo.items"
										:key="index"
										:value="item.label"
										>
											{{ item.label }}
									</a-select-option>
							</a-select>
						</div>
					</div>
				</template>
				<template slot="unitInfo" slot-scope="unitInfo">
					<div>
						<div v-show="isReadonly" class="tag-row align-center">
							<a-tag
								v-for="(item, index) in unitInfo.items.filter(item => item.isSelected)"
								:key="index"
								color="purple"
								>
									{{ item.label }}车
							</a-tag>
						</div>
						<div v-show="!isReadonly" class="tag-row align-left">
							<a-checkable-tag
								class="info-tag"
								:color="item.isSelected ? 'purple' : '#cccccc'"
								v-for="(item, index) in unitInfo.items"
								:key="item.label + '_' + index"
								v-model="item.isSelected"
								@change="(flag) => { handleSelectedUnitItem(unitInfo, flag)}">
									{{ item.label }}车
							</a-checkable-tag>
						</div>
						<div v-show="!isReadonly" class="align-right">
							<a-tag
								class="info-tag"
								color="#87d068"
								@click="handleSelectAllUnitItems(unitInfo)">
									全部选择
							</a-tag>
							<a-tag
								class="info-tag"
								color="#f50"
								@click="handleUnSelectAllUnitItems(unitInfo)">
									全部取消
							</a-tag>
						</div>
					</div>
				</template>

			</a-table>
		</a-spin>
	</div>
</template>

<script>
export default {
	name: 'BKPTest',
	props: {
		value: Array,
		readonly: {
			type: Boolean,
			default: false,
		},
		equipModels: {
			type: Array,
			default: () => [],
		}
	},
	data() {
		return {
			isLoading: false,
			isReadonly: false,
			typesData: [],
			columns: [],
		}
	},
	created() {
		this.isReadonly = this.$props.readonly
		this.initTableColumns()
	},	
	mounted() {
		this.initTypesDataAndUpdateByModelValue(this.$props.equipModels, this.$props.value)
	},
	watch: {
		equipModels(newEquipModels) {
			this.initTypesDataAndUpdateByModelValue(newEquipModels, this.$props.value)
		},
		value(modelValue) {
			this.updateTypesDataByModelValue(modelValue)
		}
	},
	methods: {
		getDemotypesData() {
			return [
				{
					index: 0,
					modelInfo: {
						modelName: ''
					},
					instanceInfo: {
						isSelectedAll: false,
						selectorVisible: false,
						selectedLabelArray: [],
						items: [
							{
								label: '',
								isSelected: false,
							}
						]
					},
					unitInfo: {
						isSelectedAll: false,
						selectorVisible: false,
						items: [
							{
								label: 1,
								isSelected: false,
							}
						]
					}
				}
			]
		},
		initTableColumns() {
			this.columns = [
				{
					title: '车型',
					width: '20%',
					align: 'center',
					dataIndex: 'modelInfo',
					scopedSlots: {
						customRender: 'modelInfo'
					}
				},
				{
					title: '车组',
					width: '40%',
					align: 'center',
					dataIndex: 'instanceInfo',
					scopedSlots: {
						customRender: 'instanceInfo'
					}
				},
				{
					title: '车厢',
					width: '40%',
					align: 'center',
					dataIndex: 'unitInfo',
					scopedSlots: {
						customRender: 'unitInfo'
					}
				},
			]
		},
		initTypesData(equipModels) {
			this.isLoading = true
			this.gettypesData().then(res => {
				this.formattypesData(res)
			}).finally(() => {
				this.isLoading = false
			})
		},
		initTypesDataAndUpdateByModelValue(equipModels, modelValue) {
			this.isLoading = true
			this.gettypesData().then(res => {
				this.formattypesData(res)
				this.updateTypesDataByModelValue(modelValue)
			}).finally(() => {
				this.isLoading = false
			})
		},
		updateTypesDataByModelValue(modelValue) {
			this.typesData.forEach(typesItem => {
				const findModelItem = modelValue.find(item => item.moduleName === typesItem.modelInfo.modelName)
				if (findModelItem) {
					typesItem.instanceInfo.items.forEach(item => {
						item.isSelected = findModelItem.instances.includes(item.label)
					})
					typesItem.instanceInfo.selectorVisible = false
					typesItem.instanceInfo.isSelectedAll = typesItem.instanceInfo.items.every(item => item.isSelected)
					typesItem.instanceInfo.selectedLabelArray = typesItem.instanceInfo.items.filter(item => item.isSelected).map(item => item.label)

					typesItem.unitInfo.items.forEach(item => {
						item.isSelected = findModelItem.units.includes(item.label)
					})
					typesItem.unitInfo.selectorVisible = false
					typesItem.unitInfo.isSelectedAll = typesItem.unitInfo.items.every(item => item.isSelected)
				} else {
					typesItem.instanceInfo.isSelectedAll = false
					typesItem.instanceInfo.selectorVisible = false
					typesItem.instanceInfo.selectedLabelArray = []
					typesItem.instanceInfo.items.forEach(item => item.isSelected = false)

					typesItem.unitInfo.isSelectedAll = false
					typesItem.unitInfo.selectorVisible = false
					typesItem.unitInfo.items.forEach(item => item.isSelected = false)
				}
			})
		},
		gettypesData() {
			const data = [
				{
					index: 0,
					modelInfo: {
						modelName: 'CR400BF-3'
					},
					instanceInfo: {
						isSelectedAll: false,
						selectorVisible: false,
						selectedLabelArray: ['3001', '3002', '3003'],
						items: [
							{
								label: '3001',
								isSelected: false,
							},
							{
								label: '3002',
								isSelected: false,
							},
							{
								label: '3003',
								isSelected: false,
							}
						]
					},
					unitInfo: {
						isSelectedAll: false,
						selectorVisible: false,
						items: [
							{
								label: 1,
								isSelected: false,
							},
							{
								label: 2,
								isSelected: false,
							},
							{
								label: 3,
								isSelected: false,
							},
						]
					}
				},
				{
					index: 1,
					modelInfo: {
						modelName: 'CR400BF-5'
					},
					instanceInfo: {
						isSelectedAll: false,
						selectorVisible: false,
						selectedLabelArray: [],
						items: [
							{
								label: '5001',
								isSelected: false,
							},
							{
								label: '5002',
								isSelected: false,
							},
							{
								label: '5003',
								isSelected: false,
							},
							{
								label: '5004',
								isSelected: false,
							},
							{
								label: '5005',
								isSelected: false,
							},
						]
					},
					unitInfo: {
						isSelectedAll: false,
						selectorVisible: false,
						items: [
							{
								label: 1,
								isSelected: false,
							},
							{
								label: 2,
								isSelected: false,
							},
							{
								label: 3,
								isSelected: false,
							},
							{
								label: 4,
								isSelected: false,
							},
							{
								label: 5,
								isSelected: false,
							},
						]
					}
				},
			]
			return new Promise(resolve => {
				setTimeout(() => {
					resolve({
						success: true,
						result: data,
					})
				}, 1500)
			})
		},
		formattypesData(res) {
			if (res && res.success) {
				this.typesData = res.result
			}
		},
		handleUnSelectInstanceItem(instanceInfo, label) {
			debugger
			instanceInfo.isSelectedAll = false
			instanceInfo.items.find(item => item.label === label).isSelected = false
			this.updateInstanceInfoSelectedLabelArray(instanceInfo)
			this.updateModelValue()
		},
		handleShowInstanceSelector(instanceInfo, record) {
			instanceInfo.selectorVisible = !instanceInfo.selectorVisible
			if (instanceInfo.selectorVisible) {
				this.$nextTick(() => {
					this.$refs[record.modelInfo.modelName + 'selector'].focus()
				})
			}
		},
		handleSelectAllInstanceItems(instanceInfo) {
			instanceInfo.isSelectedAll = true
			instanceInfo.items.forEach(item => item.isSelected = true)
			this.updateInstanceInfoSelectedLabelArray(instanceInfo)
			this.updateModelValue()
		},
		handleUnSelectAllInstanceItems(instanceInfo) {
			instanceInfo.isSelectedAll = false
			instanceInfo.items.forEach(item => item.isSelected = false)
			this.updateInstanceInfoSelectedLabelArray(instanceInfo)
			this.updateModelValue()
		},
		updateInstanceInfoSelectedLabelArray(instanceInfo) {
			instanceInfo.selectedLabelArray = instanceInfo.items
				.filter(item => item.isSelected).map(item => item.label)
		},
		handleInstanceInfoSelectedLabelArray(arrayData, instanceInfo) {
			this.updateInstanceInfoItemIsSelected(arrayData, instanceInfo)
			// this.updateModelValue()
		},
		updateInstanceInfoItemIsSelected(arrayData, instanceInfo) {
			instanceInfo.items.forEach(item => {
				item.isSelected = arrayData.includes(item.label)
			})
			instanceInfo.isSelectedAll = instanceInfo.items.every(item => item.isSelected)
		},
		handleInstanceInfoSelectorHide(instanceInfo) {
			instanceInfo.selectorVisible = false
			this.updateModelValue()
		},
		// handleSelectUnitItem(unitInfo, index) {
		// 	unitInfo.items[index].isSelected = !(unitInfo.items[index].isSelected)
		// },
		// handleUnSelectUnitItem(unitInfo, index) {
		// 	unitInfo.items[index].isSelected = false
		// },
		handleSelectedUnitItem(unitInfo, flag) {
			if (this.isReadonly) {
				return
			}
			if (flag) {
				unitInfo.isSelectedAll = unitInfo.items.every(item => item.isSelected)
			} else {
				unitInfo.isSelectedAll = false
			}
			this.updateModelValue()
		},
		handleSelectAllUnitItems(unitInfo) {
			unitInfo.isSelectedAll = true
			unitInfo.items.forEach(item => item.isSelected = true)
			this.updateModelValue()
		},
		handleUnSelectAllUnitItems(unitInfo) {
			unitInfo.isSelectedAll = false
			unitInfo.items.forEach(item => item.isSelected = false)
			this.updateModelValue()
		},
		updateModelValue() {
			const data =  this.typesData.filter(typesItem => {
				return typesItem.instanceInfo.items.some(item => item.isSelected) ||
					typesItem.unitInfo.items.some(item => item.isSelected)
			}).map(typesItem => {
				return {
					moduleName: typesItem.modelInfo.modelName,
					instances: typesItem.instanceInfo.items.filter(item => item.isSelected).map(item => item.label),
					units: typesItem.unitInfo.items.filter(item => item.isSelected).map(item => item.label),
				}
			})
			debugger
			this.$emit('input', data)
		},

		handleDebugger() {
			console.log(this.typesData)
			console.log(JSON.stringify(this.typesData))
		}
	}
}
</script>

<style lang="less" scoped>

</style>
<style lang="less" scoped>
.tag-row{
	min-height: 1.8rem;
}
.align-left{
	text-align: left;
}
.align-center{
	text-align: center;
}
.align-right{
	text-align: right;
}
.info-tag{
	margin-top: .2rem;
	margin-bottom: .2rem;
}
.info-tag.ant-tag.ant-tag-checkable{
	border-color: #dddddd;
	background-color: #cccccc;
	color: #ffffff;
}
.info-tag.ant-tag.ant-tag-checkable.ant-tag-checkable-checked{
	border-color: #d3adf7;
	background-color: #f9f0ff;
	color: #722ed1;
}
</style>