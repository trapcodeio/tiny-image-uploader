<template>
    <div id="app" class="container">
        <section class="section">
            <div class="has-text-centered mb-3">
                <h3 class="is-size-3 has-text-centered">Tiny Image Upload</h3>
                <input v-model="showUploader" type="checkbox" name="" id=""> show uploader
            </div>
            <div v-show="showUploader" class="file is-boxed is-centered mb-3">
                <label class="file-label">
                    <input @change="onImageUpload" ref="imageUploader" class="file-input" type="file" name="resume">
                    <span class="file-cta">
                          <span class="file-icon">
                            <i class="fas fa-upload"></i>
                          </span>
                          <span class="file-label">
                            Choose a file…
                          </span>
                        </span>
                </label>
            </div>
            <Editor v-model="form.message" class="textarea" :api-key="editor.key"
                    :init="editor.init"></Editor>
        </section>
    </div>
</template>

<script>
    import Axios from "axios";
    import Editor from '@tinymce/tinymce-vue';

    // Initialize Axios
    const axios = Axios.create({baseURL: 'http://localhost:2000'})

    // Default Image Uploader Callback
    let imageUploaderCallback = () => false;

    export default {
        name: 'App',
        components: {Editor},
        data() {
            // get component instance
            const self = this;

            // Return Data
            return {
                showUploader: false,
                editor: {
                    key: "mjn2m1hx6pbfs37natw7ciecx6bzkakn31ru8md9ekz773m9",
                    init: {
                        plugins: [
                            'autolink',
                            'image imagetools',
                            'help spellchecker wordcount',
                            'preview fullscreen'
                        ],
                        toolbar: 'bold italic | preview fullscreen | help',

                        file_picker_callback: async (callback, value, meta) => {

                            if (meta.filetype === 'image') {
                                // set imageUploaderCallback to this callback
                                imageUploaderCallback = callback;
                                // Open file picker
                                self.$refs.imageUploader.click();
                            }


                        }
                    },
                },
                form: {message: ''}
            }
        },

        methods: {
            onImageUpload(event) {
                if (event.target.files.length) {
                    // Get selected file
                    let image = event.target.files[0];

                    const postData = new FormData()
                    postData.append('image', image);

                    // Send to server...
                    axios.post('/upload_image', postData).then(({data}) => {
                        // Call imageUploaderCallback
                        imageUploaderCallback(data.file.path, {alt: data.file.name})
                        console.log(data)
                    }).catch(({response}) => {
                        alert(response.data.message)
                    })
                } else {
                    alert("Select a file");
                }
            }
        }
    }
</script>
