<template>
    <picker mode="multiSelector" :value="multiIndex" :range="multiArray" @change="handleValueChange"
        @columnchange="handleColumnChange">
        <slot></slot>
    </picker>
</template>

<script>
const CHINA_REGIONS = require('./regions.json')
export default {
    props: {
        defaultRegions: {
            type: Array,
            default() {
                return []
            }
        },
        defaultRegionCode: {
            type: String
        },
        defaultRegion: [String, Array]
    },
    data() {
        return {
            cityArr: CHINA_REGIONS[0].childs,
            districtArr: CHINA_REGIONS[0].childs[0].childs,
            multiIndex: [0, 0, 0],
            isInitMultiArray: true,
        }
    },
    watch: {
        defaultRegion: {
            handler(region, oldRegion) {
                if (Array.isArray(region) && Array.isArray(oldRegion)) {
                    // 避免传的是字面量的时候重复触发
                    oldRegion = oldRegion || [];
                    if (region.join('') !== oldRegion.join('')) {
                        this.handleDefaultRegion(region)
                    }
                } else if (region && region.length == 3) {
                    this.handleDefaultRegion(region)
                } else if(typeof region === 'string')
                {
                    this.handleDefaultRegion(region)
                }else {
                    console.warn('defaultRegion非有效格式')
                }
            },
            immediate: true,
        }
    },
    computed: {
        multiArray() {
            return this.pickedArr.map(arr => arr.map(item => item.name))
        },
        pickedArr() {
            // 进行初始化
            if (this.isInitMultiArray) {
                return [
                    CHINA_REGIONS,
                    CHINA_REGIONS[0].childs,
                    CHINA_REGIONS[0].childs[0].childs
                ]
            }
            return [CHINA_REGIONS, this.cityArr, this.districtArr];
        }
    },
    methods: {
        // 这是选择器的联动更新数据方法
        handleColumnChange(e) {
            this.isInitMultiArray = false;
            const that = this;
            let col = e.detail.column;
            let row = e.detail.value;
            that.multiIndex[col] = row;
            try {
                switch (col) {
                    case 0:
                        if (CHINA_REGIONS[that.multiIndex[0]].childs.length == 0) {
                            that.cityArr = that.districtArr = [CHINA_REGIONS[that.multiIndex[0]]]
                            break;
                        }
                        that.cityArr = CHINA_REGIONS[that.multiIndex[0]].childs
                        that.districtArr = CHINA_REGIONS[that.multiIndex[0]].childs[that.multiIndex[1]].childs
                        break;
                    case 1:
                        that.districtArr = CHINA_REGIONS[that.multiIndex[0]].childs[that.multiIndex[1]].childs
                        break;
                    case 2:
                        break;
                }
            } catch (e) {
                that.districtArr = CHINA_REGIONS[that.multiIndex[0]].childs[0].childs
            }

        },
        // 当选择地区触发更新数据的事件
        handleValueChange(e) {
            // 结构赋值
            let [index0, index1, index2] = e.detail.value;
            let [arr0, arr1, arr2] = this.pickedArr;
            let address = [arr0[index0], arr1[index1], arr2[index2]];
            this.$emit('getRegion', address)
        },
        // 设置默认数据的事件
        handleDefaultRegion(region) {
            // 传过来的默认数据是否不是数据
            const isCode = !Array.isArray(region)

            // 初始化时默认数组
            this.isInitMultiArray = false;

            // 获取所有的省数据
            let children = CHINA_REGIONS

            // 循环
            for (let i = 0; i < 3; i++) {
                // 根据父级的循环去匹配省市区
                for (let j = 0; j < children.length; j++) {
                    // 根据区划码匹配相应数据的code是否一致
                    let condition = isCode ? children[j].code.slice(0, (i + 1) * 2) == region.slice(0, (i + 1) * 2) : children[j].code.includes(region[i]);
                    
                    // 如果一致进入判断里
                    if (condition) {
                        // 匹配成功进行赋值
                        children = children[j].childs;
                        if (i == 0) {
                            this.cityArr = children
                        } else if (i == 1) {
                            this.districtArr = children
                        }
                        this.$set(this.multiIndex, i, j)
                        break;
                    } else {
                        // 首次匹配失败就用默认的初始化
                        if (i == 0 && j == (children.length - 1)) {
                            this.isInitMultiArray = true;
                        }
                    }
                }
            }
        }
    },
}
</script>
