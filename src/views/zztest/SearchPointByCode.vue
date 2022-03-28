<template>
    <a-modal :title="title" :width="1000" :visible="visible" :confirmLoading="confirmLoading" switchFullscreen @ok="handleOK" @cancel="handleCancel" cancelText="关闭">
        <a-row>
            <a-col :span="6">
                <div>
                    <div>
                        <a-input-search style="margin-bottom: 8px" placeholder="Search" allowClear @search="handleTreeSearch" />
                    </div>
                    <div style="height: 400px">
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
            tablePager: {
                current: 0,
                totalCount: 0,
            },
            selectedList: [],
        }
    },
    mounted(){
        this.getTotalData().then(res => { 
			this.formatTotalData(res)
			this.initTreeData()
		})
    },
    methods: {
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

					debugger
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
			debugger
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
    }
}
</script>

<style>

</style>
