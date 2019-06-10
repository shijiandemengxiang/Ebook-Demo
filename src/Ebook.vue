<template>
  <div class="ebook">
    <title-bar :ifTitleAndMenuShow="ifTitleAndMenuShow"></title-bar>
    <menu-bar  ref="menuBar" :ifTitleAndMenuShow="ifTitleAndMenuShow"
               :fontSizeList="fontSizeList"
               :defaultFontSize="defaultFontSize"
               :themeList="themeList"
               :defaultTheme="defaultTheme"
               :bookAvailable="bookAvailable"
               :navigation="navigation"
    ></menu-bar>
    <div class="read-wrapper">
      <div id="read"></div>
      <div class="mask">
        <div class="left" @click="prevPage"></div>
        <div class="center" @click="toggleTitleAndMenu"></div>
        <div class="right" @click="nextPage"></div>
      </div>
    </div>
  </div>
</template>

<script>

  import Epub from 'epubjs';
  import TitleBar from "@/components/TitleBar";
  import MenuBar from "@/components/MenuBar";

  const DOWNLOAD_URL = '/static/2018_Book_AgileProcessesInSoftwareEngine.epub';
  global.ePub = Epub

  export default {
    components: {MenuBar, TitleBar},
    data() {
      return {
        ifTitleAndMenuShow: false,
        fontSizeList:[
          {fontSize:12},
          {fontSize:14},
          {fontSize:16},
          {fontSize:18},
          {fontSize:20},
          {fontSize:22},
          {fontSize:24},
        ],
        defaultFontSize:16,
        themeList:[
          {
            name:'default',
            style:{
              body:{
                'color':'#000000','background':'#ffffff'
              }
            }
          },
          {
            name:'eye',
            style:{
              body:{
                'color':'#000000','background':'#ceeaba'
              }
            }
          },
          {
            name:'night',
            style:{
              body:{
                'color':'#ffffff','background':'#000000'
              }
            }
          },
          {
            name:'gold',
            style:{
              body:{
                'color':'#000000','background':'rgb(246,236,226)'
              }
            }
          }
        ],
        defaultTheme:0,
        bookAvailable:false,
        navigation:Object
      }
    },
    methods: {
      //电子书的解析和渲染
      showEpub() {
        //生成book
        this.book = new Epub(DOWNLOAD_URL);
        //生成Redition
        this.rendition = this.book.renderTo('read', {
          width: window.innerWidth,
          height: window.innerHeight
        })
        //通过Rendtion.display渲染电子书
        this.rendition.display();
        this.themes = this.rendition.themes
        //设置默认字体
        this.setFontSize(this.defaultFontSize)
        this.registerTheme()
        this.setTheme(this.defaultTheme)
        //获取locations对象
        this.book.ready.then(()=>{
          this.navigation = this.book.navigation
          return this.book.locations.generate()
        }).then(result => {
          this.locations = this.book.locations
          this.bookAvailable = true
        })

      },
      prevPage() {
        if (this.rendition) {
          this.rendition.prev()
        }
      },
      nextPage() {
        if (this.rendition) {
          this.rendition.next()
        }
      },
      toggleTitleAndMenu() {
        this.ifTitleAndMenuShow = !this.ifTitleAndMenuShow
        if (!this.ifTitleAndMenuShow) {
          this.$refs.menuBar.hideSetting();
        }
      },
      setFontSize(fontSize){
        this.defaultFontSize = fontSize
        if (this.themes){
          this.themes.fontSize(fontSize + 'px')
        }
      },
      registerTheme(){
        this.themeList.forEach(theme => {
          this.themes.register(theme.name,theme.style)
        })
      },
      setTheme(index){
        this.themes.select(this.themeList[index].name)
        this.defaultTheme = index
      },
      onProgressChange(progress){
        const percentage = progress / 100;
        const location = percentage > 0?this.locations.cfiFromPercentage(percentage) :0
        this.rendition.display(location)
      },
      jumpTo(href){
        this.rendition.display(href)
        this.hideTitleAndMenu()
      },
      hideTitleAndMenu(){
        this.ifTitleAndMenuShow = false
        this.$refs.menuBar.hideSetting()
        this.$refs.menuBar.hideContent()
      }
    },
    mounted() {
      this.showEpub();
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/global.scss";

  .ebook {
    position: relative;

    .read-wrapper {
      .mask {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 100;
        width: 100%;
        height: 100%;
        display: flex;

        .left {
          flex: 0 0 px2rem(100);
        }

        .center {
          flex: 1;
        }

        .right {
          flex: 0 0 px2rem(100);
        }
      }
    }
  }
</style>
