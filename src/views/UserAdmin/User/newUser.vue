<template>
  <div>
    <!--//This is new User Page//-->
    <user-details-edit :data="newUserData" status="new"></user-details-edit>
  </div>
</template>

<script>
import {Person} from '../../../utils/SpavaObj'
import UserDetailsEdit from './userDetailsEdit'

export default {
  name: 'NewUser',
  components: {UserDetailsEdit},
  data: () => ({
    newUserData: new Person()
  }),
  created () {
    console.log('new user create')
  },
}
</script>

<style scoped>

</style>
