# js实现线性数据转树形数据

#### 线性数据转树形数据
js实现一个线性数据转树形数据的方法（line2tree），该方法的传递原始数据lineData和prop（包含key和parentKey，用来指定父子的关联字段）。
```javascript
//线性结构数据转树形结构数据(prop:key  parentKey)
function line2tree(lineData, prop) {
    let map = new Map()
    for (let line of lineData) {
        if (map.has(line[prop.parentKey])) {
            let array = map.get(line[prop.parentKey])
            array.push(line)
        } else {
            map.set(line[prop.parentKey], [line])
        }
    }
    for (let item of map) {
        for (let line of lineData) {
            if (item[0] === line[prop.key]) {
                line.children = item[1];
                for (let child of item[1]) {
                    child.isChild = true
                }
            }
        }
    }
	//去除掉不是根节点的节点
    lineData = lineData.filter(line => {
        return line.isChild != true
    })
    return lineData
}

//测试数据
let lineData = [
    { pid: 0, id: 1, value: '总公司' },
    { pid: 3, id: 2, value: '人事部-1' },
    { pid: 1, id: 3, value: '人事部' },
    { pid: 1, id: 4, value: '采购部' },
    { pid: 1, id: 5, value: '组织部' },
]

//调用line2tree
lineData = line2tree(lineData, { key: 'id', parentKey: 'pid' })

//打印被处理的数据结果
console.log(lineData)
//打印结果
[
    {
        "pid": 0, 
        "id": 1, 
        "value": "总公司", 
        "children": [
            {
                "pid": 1, 
                "id": 3, 
                "value": "人事部", 
                "children": [
                    {
                        "pid": 3, 
                        "id": 2, 
                        "value": "人事部-1", 
                        "isChild": true
                    }
                ], 
                "isChild": true
            }, 
            {
                "pid": 1, 
                "id": 4, 
                "value": "采购部", 
                "isChild": true
            }, 
            {
                "pid": 1, 
                "id": 5, 
                "value": "组织部", 
                "isChild": true
            }
        ]
    }
]
```