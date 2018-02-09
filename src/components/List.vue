<template lang="html">
  <div>
    <h2 id="example-title" class="example-title" style="text-align: left; padding-left: 1rem;">List files</h2>
    <input type="text" class="form-control" v-model="descFilter" placeholder="Enter description to search .." style="max-width: 25%; display: inline-block">
    <select class="form-control" style="max-width: 25%; display: inline-block" v-model="typeFilter"><option value="">Type</option><option>image</option><option>audio</option><option>video</option></select>
    <br>
    <br>
    <div class="table-responsive" style="min-height: 350px;">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Description</th>
            <th>Type</th>
            <th>Size</th>
            <th style="text-align: center;">Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(file, index) in filteredFiles">
            <td>{{index+1}}</td>
            <td><i v-if="file.type.match('image')" class="fa fa-picture-o"></i><i v-if="file.type.match('video')" class="fa fa-video-camera"></i><i v-if="file.type.match('audio')" class="fa fa-music"></i><a :href="file.fileUrl" target="_blank"> {{ file.name }}</a></td>
            <td>{{ file.description }}</td>
            <td>{{ file.type }}</td>
            <td>{{ file.size | formatSize }}</td>
            <td style="text-align: center; cursor: pointer;"><i class="fa fa-trash" v-on:click="removeFile(file)"></i></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { app, filesRef } from '../firebaseConfig'
import toastr from 'toastr'
export default {
  data(){
    return {
      descFilter: '',
      typeFilter: '',
      files: [],
      removeKeys: [],
    }
  },
  created(){
    this.$http.get('https://vuejs-firebase-02-ded5b.firebaseio.com/files.json')
    .then(function(data){
      let contents = $.map(data.body, function(value, index){
        return [value]
      })
      let indexs = $.map(data.body, function(value, index){
        return [index]
      })
      for (var i = 0; i < contents.length; i++) {
        contents[i].key = indexs[i]
      }
      this.files = contents
    })
  },
  computed: {
    filteredFiles: function(){
      var reDesc = new RegExp(this.descFilter, 'i')
      var reType = new RegExp(this.typeFilter, 'i')
      return this.files.filter((file) => {
        return file.description.match(reDesc) && file.type.match(reType) && ($.inArray(file.key, this.removeKeys) == -1)
      });
    }
  },
  methods: {
    removeFile(file){
      app.storage().ref().child('files/'+file.key+file.extension).delete().then(() => {
        filesRef.child(file.key).remove()
        this.removeKeys.push(file.key)
        toastr.success('File removed')
      }).catch((error) => {
        alert('Error when delete file on firebase storage')
      })
    }
  }

}
</script>

<style scoped>
  table th, table td {
    text-align: left;
  }
</style>
