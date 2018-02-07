<template lang="html">
  <div>
    <h2 id="example-title" class="example-title" style="text-align: left; padding-left: 1rem;">List files</h2>
    <input type="text" class="form-control" v-model="descFilter" placeholder="Enter description to search .." style="max-width: 30%; display: inline-block">
    <select class="form-control" style="max-width: 30%; display: inline-block"><option>Type</option><option>image</option><option>audio</option><option>video</option></select>
    <br>
    <br>
    <div class="table-responsive" style="min-height: 350px;">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th>Thumb</th>
            <th>Name</th>
            <th>Description</th>
            <th>Type</th>
            <th>Size</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="css">
</style>
