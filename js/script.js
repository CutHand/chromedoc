'use strict';
const ctxWidth = 383
const app = new Vue({
    el: '.setting'
    , data: {
        message: ''
        , imgLogo: 'android'
        , addTxt: 'H\ne\nl\nl\no\n!'
        , txtColor: 'red'
        , txtFamily: '黑体'
        , txtSize: Math.round(ctxWidth * 0.05)
        , txtLineHeight: Math.round(ctxWidth * 0.00781)
        , txtLeft: Math.round(ctxWidth * 0.01827)
        , txtBottom: Math.round(ctxWidth * 0.01827)
        , logoRight: Math.round(ctxWidth * 0.01827)
        , logoBottom: Math.round(ctxWidth * 0.01827)
        , ctxWidth
        , ctxHeight: 0
        , ctx: document.querySelector('#canvas').getContext('2d')
        // 以base64的格式保存图片快照
        , imgData: document.querySelector('#canvas').toDataURL()
        // 带有文字的图片快照
        , imgDataText: null
    }
    , watch: {
        ctxWidth: function (val) {
            this.txtSize = Math.round(val * 0.05)
            this.txtLeft = Math.round(val * 0.01827)
            this.txtBottom = Math.round(val * 0.01827)
            this.logoRight = Math.round(val * 0.01827)
            this.logoBottom = Math.round(val * 0.01827)
            this.txtLineHeight = Math.round(val * 0.00781)
        }
    }
    , computed: {
        // txtSize: function () {
        //     return Math.round(this.ctxWidth * 0.05)
        // }
        // ,txtLeft: function () {
        //     return Math.round(this.ctxWidth * 0.01827)
        // }
        // ,txtBottom: function () {
        //     return Math.round(this.ctxWidth * 0.01827)
        // }
        // ,txtLineHeight: function () {
        //     return Math.round(this.ctxWidth * 0.00781)
        // }
        // ,logoRight: function () {
        //     return Math.round(this.ctxWidth * 0.01827)
        // }
        // ,logoBottom: function () {
        //     return Math.round(this.ctxWidth * 0.01827)
        // }
    }
    , methods: {
        addtext() {
            // 清空画布
            this.ctx.clearRect(0, 0, this.ctxWidth, this.ctxHeight)
            const imgObj = new Image()
            imgObj.onload = () => {
                this.ctx.drawImage(imgObj, 0, 0)
                this.ctx.fillStyle = this.txtColor
                this.ctx.font = `${this.txtSize}px ${this.txtFamily}`;
                this.ctx.textBaseline = "bottom"
                let arr = this.addTxt.split('\n')
                arr.forEach((e, i) => {
                    // 
                    this.ctx.fillText(e, this.txtLeft, this.ctxHeight - this.txtBottom - (arr.length - i - 1) * this.txtSize - (arr.length - i - 1) * this.txtLineHeight)
                });
                this.imgDataText = document.querySelector('#canvas').toDataURL()
            }
            imgObj.src = this.imgData
        }
        , addLogo() {
            // 清空画布
            this.ctx.clearRect(0, 0, this.ctxWidth, this.ctxHeight)
            const imgObj = new Image()
            imgObj.onload = () => {
                this.ctx.drawImage(imgObj, 0, 0)
                // 现场拍照
                let logoImg = new Image()
                if (this.imgLogo == 'android') {
                    logoImg.src = './img/android.png'
                }
                if (this.imgLogo == 'apple') {
                    logoImg.src = './img/apple.png'
                }
                logoImg.onload = () => {
                    let width = this.ctxWidth * 0.5
                    let height = width * logoImg.height / logoImg.width
                    this.ctx.drawImage(logoImg, (this.ctxWidth - width) / 2, (this.ctxHeight - height) / 2, width, height)
                }
                // brandImage
                let brandImg = new Image()
                if (this.imgLogo == 'android') {
                    brandImg.src = './img/androidBrand.png'
                }
                if (this.imgLogo == 'apple') {
                    brandImg.src = './img/appleBrand.png'
                }
                brandImg.onload = () => {
                    let width = this.ctxWidth * 0.1
                    let height = width * brandImg.height / brandImg.width
                    this.ctx.drawImage(brandImg, this.ctxWidth - width - this.logoRight, this.ctxHeight - height - this.logoBottom, width, height)
                }
            }
            imgObj.src = this.imgDataText == null ? this.imgData : this.imgDataText
        }
        /**
         * 图片处理
         * 先判断文件是不是图片
         * 设置画板的宽，高度为等比例
         * 将拖入的图片上板，大小和板子一样大
         * 
         * 设置板子的CSS样式与真实的大小一样
         */
        , handleFiles(files) {
            let file = files[0]
            if (!/^image\//.test(file.type)) return;
            let imgEl = new Image();
            imgEl.onload = () => {
                this.ctx.canvas.width = this.ctxWidth
                this.ctxHeight = this.ctxWidth / imgEl.width * imgEl.height
                this.ctx.canvas.height = this.ctxHeight
                this.ctx.drawImage(imgEl, 0, 0, this.ctxWidth, this.ctxHeight)
                this.ctx.canvas.style.width = '100%'
                this.imgData = document.querySelector('#canvas').toDataURL();
            }
            let reader = new FileReader()
            reader.onload = (aImg => e => aImg.src = e.target.result)(imgEl)
            reader.readAsDataURL(file)
        }
        , flash() {
            let r = confirm("点击确认所有数据将重置！");
            if (r == true) {
                location.reload()
            }
        }
    }
    , beforeCreate() {

    }
    , created() {

    }
    , beforeMount() {

    }
    , mounted() {
        // 挂在之后添加拖拽事件监听
        let dropbox = document.querySelector("#dropEl");
        dropbox.addEventListener("dragenter", function (e) {
            e.stopPropagation();
            e.preventDefault();
            if (e.target.className == "canvas") {
                e.target.style.background = "purple";
            }
        }, false);
        dropbox.addEventListener("dragover", function (e) {
            e.stopPropagation();
            e.preventDefault();
        }, false);
        dropbox.addEventListener("drop", event => {
            event.stopPropagation();
            event.preventDefault();
            let dt = event.dataTransfer;
            let files = dt.files;
            console.log('drop event has happend')
            document.querySelector('.handle-tip').classList.remove('handle-tip')
            document.querySelector('#ctxWidth').setAttribute('disabled', true)
            this.handleFiles(files);
        }, false);

        let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl)
        })
    }
})
