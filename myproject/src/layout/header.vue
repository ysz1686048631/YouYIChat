<template>
      <div class="container_header">
                 <div class="container_header-title">
                        聊天器(1)
                 </div>
                 <div class="container_header-adduser">
                        <van-icon name="add-o" size='23'/>
                 </div>
         </div>
</template>

<script>
export default {
    name:'header'
}
</script>

<style lang="less" scoped>
.container_header{
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            background: #fff;
            border-bottom: 1px solid #eeeeee;
            padding: 1rem .5rem;
            box-sizing: border-box;
            position: fixed;
            top: 0;
            &-title{
                 font-size: .9rem;
                 font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
            }
       }
</style>