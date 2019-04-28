module.exports = class Transform {
    randomize(items, count) {
        let indexes=[]
        let item
        for(let i=0;i<count;i++){
            item = items[Math.floor(Math.random() * items.length)]
            if(indexes.includes(item))
                i--
            else
                indexes.push(item)
        }
        return indexes
    }
}