<template>
    <a-modal :title="title" width="85%" :visible="visible" :confirmLoading="confirmLoading" switchFullscreen @ok="handleOK" @cancel="handleCancel" cancelText="关闭">
        <a-row :gutter="16">
            <a-col :span="6">
                <div>
                    <div>
                        <a-input-search style="margin-bottom: 8px" placeholder="Search" allowClear @search="handleTreeSearch" />
                    </div>
                    <div style="height: 35rem">
                        <a-tree
                            v-model="treeSelecedNodeKeys"
                            :tree-data="currentTreeData"
                            :auto-expand-parent="treeAutoExpandParent"
                            :expanded-keys="treeExpandedKeys"
							@select="handleTreeSelected"
                            @expand="handleTreeOnExpand">
                        </a-tree>
                    </div>
                </div>
            </a-col>
            <a-col :span="18">
				<div>
					<a-input-search
					  placeholder=""
					  onSearch=''
					  enterButton
					  allowClear
					  @search="handleTableSearch"
					/>
				</div>
				<div style="margin-top: 1rem;">
					<a-table size="middle" :columns="columns" rowKey="key" :data-source="currentTableData" bordered>
						<template slot="action" slot-scope="text,record">
							<a href="" @click.prevent="handleSelectedPoint(record)">添加</a>
						</template>
					</a-table>
				</div>
            </a-col>
			<a-col :span="24">
				<div class="selected-points-container">
					<a-tag v-for="(item, index) in selectedPointList" closable :key="item.key"  color="blue"
						@close="handleAfterClose(index)">
						{{ item.title }}
					</a-tag>
				</div>
			</a-col>
        </a-row>
    </a-modal>
</template>

<script>
import {Tree as ATree} from 'ant-design-vue'

export default {
    name: 'SearchPointByCode',
	components: {
		ATree,
	},
    data() {
        return {
            title: 'SearchPointByCode',
            visible: true,
            confirmLoading: false,
			totalData: [],
            treeExpandedKeys: [],
            treeAutoExpandParent: false,
            treeData: [],
			currentTreeData: [],
            treeSelecedNodeKeys: [],
            treeSelecedNodes: [],
            tableData: [],
			currentTableData: [],
            tablePager: {
                current: 0,
                totalCount: 0,
            },
			columns: [],
            selectedPointList: [],
        }
    },
	created() {
		this.initColumns()
	},
    mounted(){
        this.getTotalData().then(res => { 
			this.formatTotalData(res)
			this.initTreeData()
		})
    },
    methods: {
		initColumns() {
			this.columns = [
				{
					title: 'Index',
					customRender: (text, record, index) => {
						return index + 1
					}
				},
				{
					title: 'Title',
					dataIndex: 'title',
					width: '40%',
				},
				{
					title: 'Key',
					dataIndex: 'key',
					width: '40%',
				},
				{
					title: 'Action',
					width: '15%',
					scopedSlots: { customRender: 'action' }
				}
			]
		},
        showModal() {
            this.visible = true
        },
        closeModal() {

        },
        resetData() {

        },
		handleTreeSearch(value) {
			this.isLoading = true
			new Promise((resolve) => {
				let data = _.cloneDeep(this.treeData)
				if (value === undefined || value === null || value  === '') {
					this.currentTreeData = data
				} else {
					const hitCheck = (node, searchValue) => {
						node.hit = node.key.includes(searchValue)
						if ((!node.hit) && (!node.isLeaf)) {
							let flag = false
							node.children.forEach(cNode => {
								const temp = hitCheck(cNode, searchValue)
								if ((!flag) && temp) {
									flag = temp
								}
							})
							node.hit = flag
						}
						return node.hit
					}

					data.forEach(node => {
						hitCheck(node, value)
					})

					const removeNotHit = (arrayValue) => {
						if (arrayValue && arrayValue.length > 0) {
							const result = arrayValue.filter(item => item.hit)

							arrayValue.forEach(item => {
								item.children = removeNotHit(item.children)
							})
							return result
						} else {
							return []
						}
					}

					let filteredData = removeNotHit(data)

					this.currentTreeData = filteredData
					resolve()
				}
			}).then((error) => {
				console.log('handleTreeSearch', error)
			}).finally(() => {
				this.isLoading = false
			})
		},
        // handleTreeSearch(searchValue) {
        //     let needExpandKeys = new Set()
        //     const findParentKey = (node, searchValue) => {
        //         debugger
        //         let tempLength = node.children.length
        //         let flag = false
        //         for (let i = 0; i < tempLength ; i++) {
        //             let tempNode = node.children[i]
        //             if (tempNode.title.includes(searchValue) && (!needExpandKeys.has(node.key))){
        //                 needExpandKeys.add(node.key)
        //                 break
        //             }
        //         }
        //     }
        //     const traversalNode = (node, searchValue) => {
        //         if (node.children && node.children.length > 0) {
        //             findParentKey(node, searchValue)
        //             node.children.forEach(item => {
        //                 traversalNode(item, searchValue)
        //             })
        //         }
        //     }
        //     if (searchValue) {
        //         this.treeData.forEach(item => {
        //             traversalNode(item, searchValue)
        //         })
        //         this.treeExpandedKeys = [...needExpandKeys]
        //     } else {
        //         this.treeExpandedKeys = []
        //     }
        // },
		handleTreeSelected(keyArray) {
			if(keyArray && keyArray.length > 0) {
				const searchKey = keyArray[0]
				this.isLoading = true
				new Promise((resolve, reject) => {
					let flag = false
					let target = _.cloneDeep(this.totalData)
					let result = []
					while(!flag && target) {
						const findItem = target.find(item => searchKey.startsWith(item.key))
						if (findItem) {
							if (findItem.key === searchKey) {
								flag = true
								target = null
								result = findItem.children
							} else {
								target = findItem.children
							}
						} else {
							target = null
						}
					}
					resolve(result)
				}).then((data) => {
					this.tableData = data
					this.currentTableData = data
					this.tablePager.current = 0
					this.tablePager.totalCount = 0
				}).finally(() => {
					this.isLoading = false
				})
			}
		},
        handleTreeOnExpand(expandedKeys) {
            this.treeExpandedKeys = expandedKeys;
            this.treeAutoExpandParent = false;
        },
		handleTableSelected() {

        },
        handleSelectedListClear() {

        },
        handleOK() {
            console.log('handleOK')
			console.log(this.selectedPointList)
			alert(this.selectedPointList.length)
        },
        handleCancel() {
            this.visible = false
        },
		getTotalData() {
            const totalData = [
                {
                    title: '0-0',
                    key: '0-0',
                    isLeaf: false,
                    children: [
                        {
                            title: '0-0-0',
                            key: '0-0-0',
                            isLeaf: false,
                            children: [
								{
                                    title: '0-0-0-0',
                                    key: '0-0-0-0',
                                    isLeaf: true,
                                },
                                {
                                    title: '0-0-0-1',
                                    key: '0-0-0-1',
                                    isLeaf: true,
                                },
                                {
                                    title: '0-0-0-2',
                                    key: '0-0-0-2',
                                    isLeaf: true,
                                },
								{
                                    title: '0-0-0-3',
                                    key: '0-0-0-3',
                                    isLeaf: true,
                                },
                                {
                                    title: '0-0-0-4',
                                    key: '0-0-0-4',
                                    isLeaf: true,
                                },
                                {
                                    title: '0-0-0-5',
                                    key: '0-0-0-5',
                                    isLeaf: true,
                                },
								{
                                    title: '0-0-0-6',
                                    key: '0-0-0-6',
                                    isLeaf: true,
                                },
                                {
                                    title: '0-0-0-7',
                                    key: '0-0-0-7',
                                    isLeaf: true,
                                },
                                {
                                    title: '0-0-0-8',
                                    key: '0-0-0-8',
                                    isLeaf: true,
                                },
								{
                                    title: '0-0-0-9',
                                    key: '0-0-0-9',
                                    isLeaf: true,
                                },
                                {
                                    title: '0-0-0-10',
                                    key: '0-0-0-10',
                                    isLeaf: true,
                                },
                                {
                                    title: '0-0-0-11',
                                    key: '0-0-0-11',
                                    isLeaf: true,
                                },
								{
                                    title: '0-0-0-12',
                                    key: '0-0-0-12',
                                    isLeaf: true,
                                },
                                {
                                    title: '0-0-0-13',
                                    key: '0-0-0-13',
                                    isLeaf: true,
                                },
                                {
                                    title: '0-0-0-14',
                                    key: '0-0-0-14',
                                    isLeaf: true,
                                },
								{
                                    title: '0-0-0-15',
                                    key: '0-0-0-15',
                                    isLeaf: true,
                                },
                                {
                                    title: '0-0-0-16',
                                    key: '0-0-0-16',
                                    isLeaf: true,
                                },
                            ],
                        },
                        {
                            title: '0-0-1',
                            key: '0-0-1',
                            isLeaf: false,
                            children: [{
                                    title: '0-0-1-0',
                                    key: '0-0-1-0',
                                    isLeaf: true,
                                },
                                {
                                    title: '0-0-1-1',
                                    key: '0-0-1-1',
                                    isLeaf: true,
                                },
                                {
                                    title: '0-0-1-2',
                                    key: '0-0-1-2',
                                    isLeaf: true,
                                },
                            ],
                        },
                        {
                            title: '0-0-2',
                            key: '0-0-2',
                            isLeaf: true,
                        },
                    ],
                },
                {
                    title: '0-1',
                    key: '0-1',
                    isLeaf: false,
                    children: [{
                            title: '0-1-0-0',
                            key: '0-1-0-0',
                            isLeaf: true,
                        },
                        {
                            title: '0-1-0-1',
                            key: '0-1-0-1',
                            isLeaf: true,
                        },
                        {
                            title: '0-1-0-2',
                            key: '0-1-0-2',
                            isLeaf: true,
                        },
                    ],
                },
                {
                    title: '0-2',
                    key: '0-2',
                    isLeaf: true,
                },
            ];

            return Promise.resolve({
                success: true,
                result: totalData,
            })
        },
        formatTotalData(res) {
            if (res && res.success) {
                this.totalData = res.result
            }
        },
        initTreeData() {
			const data = _.cloneDeep(this.totalData)
			const tempFunction = (node) => {
				if ((!node.isLeaf) && node.children && node.children.length > 0) {
					node.children = node.children.filter(item => !item.isLeaf)
					if (node.children && node.children.length > 0) {
						node.isLeaf = false
						node.disabled = true
						node.children.forEach(item => {
							tempFunction(item)
						})
					} else {
						node.isLeaf = true
						node.disabled = false
					}
				} else {
					node.disabled = true
					node.children = null
				}
			}

			data.forEach(item => {
				tempFunction(item)
			})
			// this.treeData = this.totalData
			this.treeData = data
			this.currentTreeData = _.cloneDeep(data)
		},
		handleSelectedPoint(record) {
			const data = _.cloneDeep(record)
			const findItem = this.selectedPointList.find(item => item.key === data.key)
			if (findItem) {
				this.$message.warning('当前点已经选择了.')
			} else {
				this.selectedPointList.push(data)
			}
		},
		handleAfterClose(index) {
			this.selectedPointList.splice(index, 1)
		},
		handleTableSearch(value) {
			debugger
			if (value) {
				this.currentTableData = this.tableData.filter(item => item.title.includes(value))
			} else {
				this.currentTableData = this.tableData
			}
		}
    }
}
</script>

<style lang="less" scoped>
.selected-points-container{
	min-height: 5rem;
	border: 1px solid lightgrey;
	border-radius: .25rem;
	padding: .5rem;
}
</style>
