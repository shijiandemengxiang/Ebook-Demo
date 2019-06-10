<template>
  <div class="menu-bar">
    <transition name="slide-up">
      <div class="menu-wrapper" :class="{'hide-box-shadow':ifSettingShow || !ifTitleAndMenuShow}" v-show="ifTitleAndMenuShow">
        <div class="icon-wrapper">
          <span class="icon-menu icon" @click="showSetting(3)"></span>
        </div>
        <div class="icon-wrapper" @click="showSetting(2)">
          <span class="icon-progress icon"></span>
        </div>
        <div class="icon-wrapper" @click="showSetting(1)">
          <span class="icon-bright icon"></span>
        </div>
        <div class="icon-wrapper" @click="showSetting(0)">
          <span class="icon-a icon">A</span>
        </div>
      </div>
    </transition>
    <transition name="slide-up">
      <div class="setting-wrapper"  v-show="ifSettingShow">
        <div class="setting-font-size" v-if="showTag===0">
          <div class="preview" :style="{fontSize:fontSizeList[0].fontSize + 'px'}">A</div>
          <div class="select">
            <div class="select-wrapper" v-for="(item,index) in fontSizeList" :key="index" @click="setFontSize(item.fontSize)">
              <div class="line"></div>
              <div class="point-wrapper">
                <div class="point" v-show="defaultFontSize===item.fontSize">
                  <div class="small-point"></div>
                </div>
              </div>
              <div class="line"></div>
            </div>
          </div>
          <div class="preview" :style="{fontSize:fontSizeList[fontSizeList.length - 1].fontSize + 'px'}">A</div>
        </div>
        <div class="setting-theme" v-else-if="showTag===1">
          <div class="setting-theme-item" v-for="(item,index) in themeList" :key="index" @click="setTheme(index)">
            <div class="preview" :style="{background:item.style.body.background}" :class="{'no-border':item.style.body.background !== '#ffffff'}"></div>
            <div class="text" :class="{'selected':index===defaultTheme}">{{item.name}}</div>
          </div>
        </div>
        <div class="setting-progress" v-else-if="showTag===2">
          <div class="progress-wrapper">
            <input class="progress" type="range"
                                    max="100"
                                    min="0"
                                    step="1"
                                    @change="onProgressChange($event.target.value)"
                                    @input="onProgressInput($event.target.value)"
                                    :value="progress"
                                    :disabled="!bookAvailable"
                                    ref="progress"
            >
          </div>
          <div class="text-wrapper">
            <span>{{bookAvailable?progress + '%':'加载中...'}}</span>
          </div>
        </div>
      </div>
    </transition>
    <content-view :isShowContent="isShowContent"
                  v-show="isShowContent"
                  :navigation="navigation"
                  :bookAvailable="bookAvailable"
    >
    </content-view>
    <transition name="fade">
      <div class="content-mask" v-show="isShowContent" @click="hideContent()"></div>
    </transition>
  </div>
</template>

<script>
    import ContentView from "@/components/ContentView";
    export default {
      components: {ContentView},
      data(){
        return{
          ifSettingShow:false,
          showTag:0,
          progress:0,
          isShowContent:false
        }
      },
      methods:{
        showSetting(tag){
          this.showTag = tag
          this.ifSettingShow = true
          if (this.showTag == 3){
            this.isShowContent = true
          }
          this.ifSettingShow = true
        },
        hideSetting(){
          this.ifSettingShow = false
        },
        setFontSize(fontSize){
          this.$parent.setFontSize(fontSize)
        },
        setTheme(index){
          this.$parent.setTheme(index)
        },
        onProgressChange(progress){
          this.$parent.onProgressChange(progress)
        },
        onProgressInput(progress){
          this.progress = progress
          this.$refs.progress.style.backgroundSize = '${this.progress}% 100%'
        },
        hideContent(){
          this.isShowContent = false
        },
        jumpTo(href){
          this.$parent.jumpTo(href)
        }
      },
      props:{
        ifTitleAndMenuShow:{
          type:Boolean,
          default:false
        },
        fontSizeList:Array,
        defaultFontSize:Number,
        themeList:Array,
        defaultTheme:Number,
        bookAvailable:{
          type: Boolean,
          default: false
        },
        navigation:Object
      }
    }
</script>

<style lang="scss" scoped>
  @import "../assets/styles/global";

  .menu-bar{
    .menu-wrapper {
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 101;
      width: 100%;
      height: px2rem(48);
      background: white;
      display: flex;
      box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);

      &.hide-box-shadow{
        box-shadow: none;
      }

      .icon-wrapper {
        flex: 1;
        @include center;
      }
    }

    .setting-wrapper{
      position:absolute;
      bottom: px2rem(48);
      left: 0;
      width: 100%;
      height: px2rem(60);
      background: white;
      z-index: 101;
      box-shadow: 0 px2rem(-8) px2rem(8) rgba(0,0,0,.15);
      .setting-font-size{
        display: flex;
        height: 100%;
        .preview{
          flex:  0 0 px2rem(40);
          @include center;
        }
        .select{
            flex: 1;
            display: flex;
          .select-wrapper{
            flex: 1;
            display: flex;
            align-items: center;

            &:first-child{
              .line{
                &:first-child{
                  border-top: none;
                }
              }
            }

            &:last-child{
              .line{
                &:last-child{
                  border-top: none;
                }
              }
            }
            .line{
              flex: 1;
              height: 0;
              border-top: px2rem(1) solid #cccccc ;
            }
            .point-wrapper{
              position: relative;
              flex: 0 0 0;
              width: 0;
              height: px2rem(7);
              border-left: px2rem(1) solid #cccccc;
              .point{
                position: absolute;
                top: px2rem(-8);
                left:px2rem(-10);
                width: px2rem(20);
                height: px2rem(20);
                background: white;
                border-radius: 50%;
                border:  px2rem(1) solid #cccccc;
                box-shadow: 0 px2rem(4) px2rem(4) rgba(0,0,0,.15);
                @include center;
                .small-point{
                  width: px2rem(5);
                  height: px2rem(5);
                  background: black;
                  border-radius: 50%;
                }
              }
            }
          }
        }
      }
      .setting-theme{
        height: 100%;
        display: flex;
        .setting-theme-item{
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: px2rem(5);
          .preview{
            flex: 1;
            border: px2rem(1) solid #cccccc;
            box-sizing: border-box;
            &.no-border{
              border: none;
            }
          }
          .text{
            flex:  0 0 px2rem(30);
            font-size: px2rem(16);
            color: #999999;
            @include center;
            &.selected{
              color: #333333;
            }
          }
        }
      }
      .setting-progress{
        position: relative;
        width: 100%;
        height: 100%;
        .progress-wrapper{
          width: 100%;
          height: 100%;
          @include center;
          padding: 0 px2rem(30);
          box-sizing: border-box;
          .progress{
            width: 100%;
            -webkit-appearance: none;
            height: px2rem(2);
            background: -webkit-linear-gradient(#999999,#999999) no-repeat #dddddd;
            background-size: 0 100%;
            &:focus{
              outline: none;
            }
            &::-webkit-slider-thumb{
              -webkit-appearance: none;
              height: px2rem(20);
              width: px2rem(20);
              border-radius: 50%;
              background: white;
              box-shadow: 0 4px 4px 0 rgba(0,0,0,.15);
            }
          }
        }
        .text-wrapper {
          position: absolute;
          left:0;
          bottom:0;
          width:100%;
          color:#333;
          font-size: px2rem(12);
          text-align: center;
        }
      }
    }

    .content-mask{
      position: absolute;
      top: 0;
      left: 0;
      z-index: 101;
      display: flex;
      width: 100%;
      height: 100%;
      background: rgba(51,51,51,.8);
    }
  }

</style>
