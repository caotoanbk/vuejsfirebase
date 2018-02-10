<template>
<div class="example-full">
  <h2 id="example-title" class="example-title" style="text-align: left; padding-left: 1rem;">Upload files
    <div class="btn-group" style="margin-left: 0.5rem;">
      <file-upload
        class="btn btn-primary"
        :extensions="extensions"
        :accept="accept"
        :multiple="multiple"
        :directory="directory"
        :size="size || 0"
        :thread="thread < 1 ? 1 : (thread > 5 ? 5 : thread)"
        :drop="drop"
        :drop-directory="dropDirectory"
        :add-index="addIndex"
        v-model="files"
        @input-filter="inputFilter"
        @input-file="inputFile"
        ref="upload">
        <i class="fa fa-plus"></i>
        Add files
      </file-upload>
    </div></h2>
  <br>
  <div v-show="$refs.upload && $refs.upload.dropActive" class="drop-active">
		<h3>Drop files to upload</h3>
  </div>
  <div class="upload" v-show="true">
    <div class="table-responsive" style="min-height: 500px;">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th>Thumb</th>
            <th>Name</th>
            <th>Description</th>
            <th>Type</th>
            <th>Size</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!files.length">
            <td colspan="8" style="height: 440px;" class="p-5">
              <div class="text-center p-5">
                <h4>Drop files anywhere to upload<br/>or</h4>
                <label :for="name" class="btn btn-lg btn-primary"><i class="fa fa-plus"></i> Add Files</label>
              </div>
            </td>
          </tr>
          <tr v-for="(file, index) in files" :key="file.id">
            <td>{{index+1}}</td>
            <td>
              <img v-if="file.thumb" :src="file.thumb" width="40" height="auto" />
              <span v-else>No Image</span>
            </td>
            <td>
              <div class="filename">
                {{file.name}}
              </div>

              <div class="progress" v-if="file.active || file.progress !== '0.00'">
                <div :class="{'progress-bar': true, 'progress-bar-striped': true, 'bg-danger': file.error, 'progress-bar-animated': file.active}" role="progressbar" :style="{width: file.progress + '%'}">{{file.progress}}%</div>
              </div>
            </td>
            <td v-if="!file.success" ><input type="text" class="form-control" v-model="file.description"></td>
            <td v-else>{{file.description}}</td>
            <td>{{file.type}}</td>
            <td>{{file.size | formatSize}}</td>
            <td v-if="file.error" class="text-danger"><strong v-if="file.error == 'cancel'">canceled</strong></td>
            <td v-else-if="file.success" class="text-success"><strong>success</strong></td>
            <td v-else-if="file.active">active</td>
            <td v-else></td>
            <td>
              <div class="btn-group">
                <button class="btn btn-secondary btn-sm dropdown-toggle" type="button">
                  Action
                </button>
                <div class="dropdown-menu">
                  <a :class="{'dropdown-item': true, disabled: file.active || file.success || file.error === 'compressing'}" href="#" @click.prevent="file.active || file.success || file.error === 'compressing' ? false :  onEditFileShow(file)">Edit</a>
                  <a :class="{'dropdown-item': true, disabled: !file.active}" href="#" @click.prevent="file.active ? file.error = 'cancel' : false">Cancel</a>
                  <a :class="{'dropdown-item': true, disabled: file.active}" v-if="file.error && file.error !== 'compressing' && $refs.upload.features.html5" @click.prevent="uploadFileToFirebase(file, {active: true, reupload: true})">Reupload</a>
                  <a :class="{'dropdown-item': true, disabled: file.active || file.success || file.error === 'compressing'}" href="#" v-else @click.prevent="file.success || file.error === 'compressing' ? false : uploadFileToFirebase(file, {active: true, reupload: false})">Upload</a>

                  <div class="dropdown-divider"></div>
                  <a class="dropdown-item" href="#" @click.prevent="$refs.upload.remove(file)">Remove</a>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>


  <div :class="{'modal-backdrop': true, 'fade': true, show: editFile.show}"></div>
   <div :class="{modal: true, fade: true, show: editFile.show}" id="modal-edit-file" tabindex="-1" role="dialog">
     <div class="modal-dialog modal-lg" role="document">
       <div class="modal-content">
         <div class="modal-header">
           <h5 class="modal-title">Edit file</h5>
           <button type="button" class="close"  @click.prevent="editFile.show = false">
             <span>&times;</span>
           </button>
         </div>
         <form @submit.prevent="onEditorFile">
           <div class="modal-body">
             <div class="form-group" style="text-align: left;">
               <label for="name" style="margin-bottom: .5rem;">Name:</label>
               <input type="text" class="form-control" required id="name"  placeholder="File font-awesome" v-model="editFile.name">
             </div>
             <div class="form-group" style="text-align: left;">
               <label for="description" style="margin-bottom: 0.5rem;">Description:</label>
               <input type="text" class="form-control" id="description"  placeholder="File description" v-model="editFile.description">
             </div>
             <div class="form-group" style="text-align: left;" v-if="editFile.show && editFile.blob && editFile.type && editFile.type.substr(0, 6) === 'image/'">
               <label style="margin-bottom: .5rem;">Image: </label>
               <div class="edit-image">
                 <img :src="editFile.blob" ref="editImage" />
               </div>

               <div class="edit-image-tool">
                 <div class="btn-group" role="group">
                   <button type="button" class="btn btn-primary" @click="editFile.cropper.rotate(-90)" title="cropper.rotate(-90)"><i class="fa fa-undo" aria-hidden="true"></i></button>
                   <button type="button" class="btn btn-primary" @click="editFile.cropper.rotate(90)"  title="cropper.rotate(90)"><i class="fa fa-repeat" aria-hidden="true"></i></button>
                 </div>
                 <div class="btn-group" role="group">
                   <button type="button" class="btn btn-primary" @click="editFile.cropper.crop()" title="cropper.crop()"><i class="fa fa-check" aria-hidden="true"></i></button>
                   <button type="button" class="btn btn-primary" @click="editFile.cropper.clear()" title="cropper.clear()"><i class="fa fa-remove" aria-hidden="true"></i></button>
                 </div>
               </div>
             </div>
           </div>
           <div class="modal-footer">
             <button type="button" class="btn btn-secondary" @click.prevent="editFile.show = false">Close</button>
             <button type="submit" class="btn btn-primary">Save</button>
           </div>
         </form>
       </div>
     </div>
   </div>

</div>
</template>
<style scoped>
  table th, table td{
    text-align: left;
    vertical-align: middle;
  }
  .example-full .btn-group .dropdown-menu {
    display: block;
    visibility: hidden;
    transition: all .2s
  }
  div.upload{
    padding-bottom: 0.5rem;
    border-bottom: 2px solid rgb(222, 226, 230);
  }
  .example-full .btn-group:hover > .dropdown-menu {
    visibility: visible;
  }
  .example-full label.dropdown-item {
    margin-bottom: 0;
  }
  .example-full .btn-group .dropdown-toggle {
    margin-right: .6rem
  }
  a.dropdown-item{
    cursor: pointer;
  }
  .example-full .filename {
    margin-bottom: .3rem
  }
  .example-full .btn-is-option {
    margin-top: 0.25rem;
  }
  .example-full .example-foorer {
    padding: .7rem 0;
    border-top: 1px solid #e9ecef;
    border-bottom: 1px solid #e9ecef;
  }
  .example-full .edit-image{
    max-height: 380px;
  }
  .example-full .edit-image img {
    max-width: 100%;
  }
  .example-full .edit-image-tool {
    margin-top: .6rem;
  }
  .example-full .edit-image-tool .btn-group{
    margin-right: .6rem;
  }
  .example-full .footer-status {
    padding-top: .4rem;
  }
  .example-full .drop-active {
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    position: fixed;
    z-index: 9999;
    opacity: .6;
    text-align: center;
    background: #000;
  }
  .example-full .drop-active h3 {
    margin: -.5em 0 0;
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    -webkit-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
    font-size: 40px;
    color: #fff;
    padding: 0;
  }
  label{
    margin-bottom: 0;
  }
</style>

<script>
import Cropper from 'cropperjs'
import ImageCompressor from '@xkeshi/image-compressor'
import FileUpload from 'vue-upload-component'
import { app, filesRef } from '../firebaseConfig'
import firebase from 'firebase'

export default {
  firebase: {
    filesDb: filesRef
  },
  components: {
    FileUpload,
  },
  data() {
    return {
      files: [],
      accept: 'image/png,image/gif,image/jpeg,image/webp',
      extensions: 'gif,jpg,jpeg,png,webp',
      // extensions: ['gif', 'jpg', 'jpeg','png', 'webp'],
      // extensions: /\.(gif|jpe?g|png|webp)$/i,
      minSize: 1024,
      size: 1024 * 1024 * 10,
      multiple: true,
      directory: false,
      drop: true,
      dropDirectory: true,
      addIndex: false,
      thread: 3,
      name: 'file',
      autoCompress: 1024 * 1024,
      uploadAuto: false,
      isOption: false,
      addData: {
        show: false,
        name: '',
        type: '',
        content: '',
      },
      editFile: {
        show: false,
        name: '',
      }
    }
  },
  watch: {
    'editFile.show'(newValue, oldValue) {
      // 关闭了 自动删除 error
      if (!newValue && oldValue) {
        this.$refs.upload.update(this.editFile.id, { error: this.editFile.error || '' })
      }
      if (newValue) {
        this.$nextTick(function () {
          if (!this.$refs.editImage) {
            return
          }
          let cropper = new Cropper(this.$refs.editImage, {
            autoCrop: false,
          })
          this.editFile = {
            ...this.editFile,
            cropper
          }
        })
      }
    },
    'addData.show'(show) {
      if (show) {
        this.addData.name = ''
        this.addData.type = ''
        this.addData.content = ''
      }
    },
  },
  methods: {
    uploadFileToFirebase(file, data){
      // this.$refs.upload.update(file, data)
      let fileUrl
      let key
      const filename = file.name
      const ext = filename.slice(filename.lastIndexOf('.'))

      filesRef.push({name: file.name, description: file.description || '', size: file.size, type: file.type, extension: ext})
      .then((data) => {
        key = data.key
        return key
      })
      .then(key => {

        let uploadTask = app.storage().ref('files/'+key+ext).put(file.file)
        file.active = true
        if(data.reupload){
          file.error = ''
          file.progress = '0.00'
        }
        // if(file.error == 'cancel') {
        //   console.log('cancel')
        //   uploadTask.cancel()
        //   filesRef.child(key).remove()
        // }else{
        //   return uploadTask
        // }
        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
          function(snapshot) {
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
              file.progress = progress
              // uploadTask.cancel()
              switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                  break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                  console.log('Upload is running');
                  if(file.error == 'cancel'){
                    uploadTask.cancel()
                  }
                  break;
              }
            },
            function(error) {

              // A full list of error codes is available at
              // https://firebase.google.com/docs/storage/web/handle-errors
              switch (error.code) {
                case 'storage/unauthorized':
                  // User doesn't have permission to access the object
                  break;

                case 'storage/canceled':
                  // User canceled the upload

                  console.log('Upload is canceled')
                  break;

                case 'storage/unknown':
                  // Unknown error occurred, inspect error.serverResponse
                  break;
              }
              filesRef.child(key).remove()
              file.active = false
              file.success = false
          },
          function() {
            // Upload completed successfully, now we can get the download URL
            let fileUrl = uploadTask.snapshot.downloadURL;
            // fileUrl = fileData.metadata.downloadURLs[0]
            filesRef.child(key).update({fileUrl: fileUrl})
            .then((data) => {
              // this.$refs.upload.update(file, {success: true, active: false})
              file.success = true
              file.active = false
              file.error =''
            })
            .catch((error) => {
              // this.$refs.upload.update(file, {error: 'error', active: false})
              file.active = false
              file.error = 'unknown error'
              file.success = false
              console.log('error')
            })
          }
        );

      })

    },
    inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // Before adding a file
        // 添加文件前
        // Filter system files or hide files
        // 过滤系统文件 和隐藏文件
        if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
          return prevent()
        }
        // Filter php html js file
        // 过滤 php html js 文件
        if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
          return prevent()
        }
        // Automatic compression
        // 自动压缩
        if (newFile.file && newFile.type.substr(0, 6) === 'image/' && this.autoCompress > 0 && this.autoCompress < newFile.size) {
          newFile.error = 'compressing'
          const imageCompressor = new ImageCompressor(null, {
            convertSize: Infinity,
            maxWidth: 512,
            maxHeight: 512,
          })
          imageCompressor.compress(newFile.file)
            .then((file) => {
              this.$refs.upload.update(newFile, { error: '', file, size: file.size, type: file.type })
            })
            .catch((err) => {
              this.$refs.upload.update(newFile, { error: err.message || 'compress' })
            })
        }
      }
      if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
        // Create a blob field
        // 创建 blob 字段
        newFile.blob = ''
        let URL = window.URL || window.webkitURL
        if (URL && URL.createObjectURL) {
          newFile.blob = URL.createObjectURL(newFile.file)
        }
        // Thumbnails
        // 缩略图
        newFile.thumb = ''
        if (newFile.blob && newFile.type.substr(0, 6) === 'image/') {
          newFile.thumb = newFile.blob
        }
      }
    },
    // add, update, remove File Event
    inputFile(newFile, oldFile) {
      if (newFile && oldFile) {
        // update
        if (newFile.active && !oldFile.active) {
          // beforeSend
          // min size
          if (newFile.size >= 0 && this.minSize > 0 && newFile.size < this.minSize) {
            this.$refs.upload.update(newFile, { error: 'size' })
          }
        }
        if (newFile.progress !== oldFile.progress) {
          // progress
        }
        if (newFile.error && !oldFile.error) {
          // error
        }
        if (newFile.success && !oldFile.success) {
          // success
        }
      }
      if (!newFile && oldFile) {
        // remove
        if (oldFile.success && oldFile.response.id) {
          // $.ajax({
          //   type: 'DELETE',
          //   url: '/upload/delete?id=' + oldFile.response.id,
          // })
        }
      }
      // Automatically activate upload
      if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {
        if (this.uploadAuto && !this.$refs.upload.active) {
          this.$refs.upload.active = true
        }
      }
    },
    alert(message) {
      alert(message)
    },
    onEditFileShow(file) {
      this.editFile = { ...file, show: true }
      this.$refs.upload.update(file, { error: 'edit' })
    },
    onEditorFile() {
      if (!this.$refs.upload.features.html5) {
        this.alert('Your browser does not support')
        this.editFile.show = false
        return
      }
      let data = {
        name: this.editFile.name,
        description: this.editFile.description
      }
      if (this.editFile.cropper) {
        let binStr = atob(this.editFile.cropper.getCroppedCanvas().toDataURL(this.editFile.type).split(',')[1])
        let arr = new Uint8Array(binStr.length)
        for (let i = 0; i < binStr.length; i++) {
          arr[i] = binStr.charCodeAt(i)
        }
        data.file = new File([arr], data.name, { type: this.editFile.type })
        data.size = data.file.size
      }
      this.$refs.upload.update(this.editFile.id, data)
      this.editFile.error = ''
      this.editFile.show = false
    },
    onAddData() {
      this.addData.show = false
      if (!this.$refs.upload.features.html5) {
        this.alert('Your browser does not support')
        return
      }
      let file = new window.File([this.addData.content], this.addData.name, {
        type: this.addData.type,
      })
      this.$refs.upload.add(file)
    }
  }
}
</script>
