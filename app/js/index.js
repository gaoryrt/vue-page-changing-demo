var vue = new Vue({
    el: '#app',
    data: {
        CRT: 0
    },
    methods: {
        to: function(to){
            scrollTo(0,0)
            this.CRT = to
        },
        secClass: function(index){
            if (this.CRT == index) {
                return 'displaying'
            } else if (this.CRT > index) {
                return 'passed'
            } else {
                return 'waiting'
            }
        }
    }
})