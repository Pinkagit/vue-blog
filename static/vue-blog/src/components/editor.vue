<template>
  <div>
    <textarea :id= "Id"></textarea>
  </div>
</template>
<script>
  import '../../static/tinymce/tinymce.min.js'
  export default {
    data () {
      const Id = Date.now()
      return {
        Id: Id,
        Editor: null,
        DefaultConfig: {
          // GLOBAL
          language: 'zh_CN',
          height: 500,
          theme: 'modern',
          menubar: false,
          toolbar: `styleselect | fontselect | formatselect | fontsizeselect | forecolor backcolor | bold italic underline strikethrough charmap | image selectimg table | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | removeformat  hr | code  link | undo redo | preview fullscreen codesample`,
          plugins: `
            importcss
            image
            selectimg
            code
            table
            advlist
            fullscreen
            link
            lists
            textcolor
            colorpicker
            hr
            preview
            charmap
            codesample
          `,
          
          // CONFIG
          forced_root_block: 'p',
          force_p_newlines: true,
          importcss_append: true,

            // CONFIG: ContentStyle 这块很重要， 在最后呈现的页面也要写入这个基本样式保证前后一致， `table`和`img`的问题基本就靠这个来填坑了
          content_style: `
            *                         { padding:0px; margin:0; }
			      html, body                { height:100%; }
		      	body					  { margin:10px }
            img                       { max-width:100%; display:block;height:auto; }
            a                         { text-decoration: none; }
            iframe                    { width: 100%; }
            p                         { line-height:1.6; margin: 0px; }
            table                     { word-wrap:break-word; word-break:break-all; max-width:100%; border:none; border-color:#999; }
            .mce-object-iframe        { width:100%; box-sizing:border-box; margin:0; padding:0; }
            ul,ol                     { list-style-position:inside; }
          `,

          insert_button_items: 'image link | inserttable',

          // CONFIG: Paste							//(需要购买服务))
          paste_retain_style_properties: 'all',
          paste_word_valid_elements: '*[*]',        // word需要它
          paste_data_images: true,                  // 粘贴的同时能把内容里的图片自动上传
          paste_convert_word_fake_lists: false,     // 插入word文档需要该属性
          paste_webkit_styles: 'all',
          paste_merge_formats: true,
          nonbreaking_force_tab: false,
          paste_auto_cleanup_on_paste: false,
		  
          // CONFIG: Font
          fontsize_formats: '10px 11px 12px 14px 16px 18px 20px 24px',

          // CONFIG: StyleSelect
          style_formats: [
            {
              title: '首行缩进',
              block: 'p',
              styles: { 'text-indent': '2em' }
            },
            {
              title: '行高',
              items: [
                {title: '1', styles: { 'line-height': '1' }, inline: 'span'},
                {title: '1.5', styles: { 'line-height': '1.5' }, inline: 'span'},
                {title: '2', styles: { 'line-height': '2' }, inline: 'span'},
                {title: '2.5', styles: { 'line-height': '2.5' }, inline: 'span'},
                {title: '3', styles: { 'line-height': '3' }, inline: 'span'}
              ]
            }
          ],

          // FontSelect
          font_formats: `
            微软雅黑=微软雅黑;
            宋体=宋体;
            黑体=黑体;
            仿宋=仿宋;
            楷体=楷体;
            隶书=隶书;
            幼圆=幼圆;
            Andale Mono=andale mono,times;
            Arial=arial, helvetica,
            sans-serif;
            Arial Black=arial black, avant garde;
            Book Antiqua=book antiqua,palatino;
            Comic Sans MS=comic sans ms,sans-serif;
            Courier New=courier new,courier;
            Georgia=georgia,palatino;
            Helvetica=helvetica;
            Impact=impact,chicago;
            Symbol=symbol;
            Tahoma=tahoma,arial,helvetica,sans-serif;
            Terminal=terminal,monaco;
            Times New Roman=times new roman,times;
            Trebuchet MS=trebuchet ms,geneva;
            Verdana=verdana,geneva;
            Webdings=webdings;
            Wingdings=wingdings,zapf dingbats`,

          // Tab
          tabfocus_elements: ':prev,:next',
          object_resizing: true,

          // Image
          imagetools_toolbar: 'rotateleft rotateright | flipv fliph | editimage imageoptions'
        },
        edObj: '',
      }
    },
    props: {
      byValue: 0,           // 通过该值的改变来判断父组件是否传值
      value: {
        default: '',        //编辑器内容
        type: String
      },
      config: {
        type: Object,
        default: () => {
          return {
            theme: 'modern',
            height: 300,
            toolbar: '',
            menubar: false,
          }
        }
      },
      url: {
        default: '',        // 图片上传地址
        type: String
      },
      accept: {
        default: 'image/jpeg, image/png, image/gif',
        type: String
      },
      maxSize: {
        default: 1024 * 1024 * 5,       // 5M
        type: Number
      },
      withCredentials: {
        default: false,
        type: Boolean
      }
    },
    mounted () {
      this.init()
    },
    beforeDestroy () {
      // 销毁tinymce
      this.$emit('on-destroy')
      // window.tinymce.remove(`$#{this.Id}`)
    },
    methods: {
       init () {
        const self = this
        window.tinymce.baseURL = '/static/tinymce'
        window.tinymce.suffix = '.min'

        this.Editor = window.tinymce.init({
          // 默认配置
          ...this.DefaultConfig,
          
          // 图片上传
          images_upload_handler: function (blobInfo, success, failure) {
            if (blobInfo.blob().size > self.maxSize) {
              failure('文件体积过大')
            }
            
            if (self.accept.indexOf(blobInfo.blob().type) >= 0) {
              uploadPic()
            } else {
              failure('图片格式错误')
            }
            function uploadPic () {
                let formdata = new FormData()
                let userid = self.$store.state.USERID;
                if (!userid) {
                    failure('用户id获取失败！')
                }
                
                formdata.set(userid, blobInfo.blob())

                self.$ajax.upload_file(formdata).then(response => {
                    console.log(response)
                    success(response.data.img_path)
                }).catch(err => {
                    failure('上传失败！')
                })
            }
          },

          // prop内传入的的config
          ...this.config, 
          
          // 挂载的DOM对象
          selector: `#${this.Id}`,
          setup: (editor) => {
            // 抛出 'on-ready' 事件钩子
            this.edObj = editor;
            editor.on(
              'init', () => {
                self.loading = false
                self.$emit('on-ready')
                
                editor.setContent(self.value)
              }
            )
            // 抛出 'input' 事件钩子，同步value数据
            editor.on(
              'input change undo redo', () => {
                self.$emit('input', editor.getContent())
              }
            )
          }
        })
      }
    },
    watch: {
      // 监听编辑器内容是否有传值变化
      byValue(val) {
        this.edObj.setContent(this.value)
      }
    }
  }
</script>

<style>
.mce-statusbar>div>span{
	display: none;
}
</style>
