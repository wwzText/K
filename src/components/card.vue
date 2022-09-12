<template>
    <div class="card-content">
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>

</script>

<style scoped lang="less">
.card-content {
    width: 100%;
    height: 16rem;
    background-size: 100%;
    box-sizing: border-box;
    background-repeat: no-repeat;
    background-image: url("./../assets/img/messagebg.jpg");
}
</style>