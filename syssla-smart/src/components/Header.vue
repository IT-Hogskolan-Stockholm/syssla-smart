<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';


/* STICKY HEADER */
const isSticky = ref(false);

const handleScroll = () => {
    isSticky.value = window.scrollY > 0;
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
    <div class="header-wrapper">
        <header :class="{ 'sticky': isSticky }">
            <img id="logo" src="../assets/logo.svg" alt="Logo Syssla Smart">
            <img id="avatar" src="../assets/avatarIcon.svg" alt="User icon">

        </header>
    </div>
</template>


<style scoped>
h1 {
    font-size: 1rem;
}

.header-wrapper {
    height: 60px;
    /* höjd wrapper/headern */
}

header {
    background-color: #F1F6FF;
    color: white;
    padding: 10px 20px;
    width: 100%;
    position: fixed;
    /* sitter fast */
    top: 0;
    left: 0;
    z-index: 10;
    display: flex;
    justify-content: space-between;
    /* gör så logo är till vänster och avataren till höger, med utrymme emellan*/
    align-items: center;
    border-radius: 0 0 8px 8px;
    box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px;
    /* skugga under header */

}

#avatar {
    padding-right: 40px;
    /* avatar img får padding right */
}

.sticky {
    /* position: fixed;*/
    top: 0;
    left: 0;
    width: 100%;
    z-index: 10;

}
</style>