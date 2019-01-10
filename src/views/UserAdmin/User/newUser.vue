<template>
  <div>
    <user-details-edit :data="newUserData" status="new"></user-details-edit>
  </div>
</template>

<script>
import UserDetailsEdit from './userDetailsEdit'

export default {
  name: 'NewUser',
  components: {UserDetailsEdit},
  data: () => ({
    newUserData: null
  }),
  created () {
    this.newUserData = this.$store.getters['userAdmin/getNewPerson']()
  },
}
</script>

<style scoped>

</style>
