<template>
    <h1>Admin Dashboard</h1>
    <button @click="viewUsers">View users</button>
    <button @click="editEventsAsAdmin">Edit events</button>
    <button @click="editCodesAsAdmin">Edit QR codes</button>
    <button @click="editMealsAsAdmin">Edit meal suggestions</button>
    <button @click="editExercisesAsAdmin">Edit exercise suggestions</button>
</template>

<script>
export default {
    methods: {
        editEventsAsAdmin() {
            this.$router.push({ path: '/admin-events' });
        },
        editCodesAsAdmin() { 
            this.$router.push({ path: '/qr-codes-admin' });
        },
        viewUsers() {
            this.$router.push({ path: '/user-panel' });
        },
        editMealsAsAdmin() { 
            this.$router.push({ path: '/default-meals' });
        },
        editExercisesAsAdmin() {
            this.$router.push({ path: '/default-exercises' });
        }
    }
}
</script>
