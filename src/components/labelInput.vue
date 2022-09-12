<template>
    <p class="label">{{ label }}</p>
    <div class="content">
        <input :type="type" :disabled="disabled || false" :value="modelValue" @input="inputChange" :placeholder="placeholder || '请输入'">
        <span class="suffix">{{ suffix }}</span>
        <slot name="afterSlot"></slot>
    </div>
    <slot name="bottom" />
</template>

<script lang="ts" setup>
interface Props {
    label?: string,
    placeholder?: string,
    suffix?: string, // 后缀
    modelValue?: string | number,
    disabled?: boolean,
    type?: string
}
const props = withDefaults(defineProps<Props>(), {
    type: 'text'
});

const emits = defineEmits(['update:modelValue'])

const inputChange = (event: Event) => {
    // 半个小时解决这个 HTMLInputElement，
    // 还是通过 element 的 input 组件源码中找到，累了
    let { value } = event.target as HTMLInputElement
    emits("update:modelValue", value)
}


</script>

<style scoped lang="less">
@import url('@/assets/css/base.less');
.label {
    font-size: 1.4rem;
    font-weight: 500;
    margin-top: 2rem;
}

.content {
    display: flex;
    align-items: center;
    border-bottom: 1px solid @border-color;
    padding: .5rem 2rem .5rem;
    box-sizing: border-box;

    input {
        flex: 1;
        border: none;
        line-height: 3rem;
        height: 3rem;
        font-size: 1.4rem;
        background-color: white;
    }

    ::-webkit-input-placeholder {
        color: @tip-text-color;
        font-size: 1.4rem;
    }

    .suffix {
        color: @tip-text-color;
        margin-right: 1rem;
        margin-left: 1rem;
    }
}
</style>