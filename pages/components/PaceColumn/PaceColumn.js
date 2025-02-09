Component({
    properties: {
        containerClass: {
            type: String,
            value: ''
        },
        show: {
            type: Boolean,
            value: true
        },
        texts: {
            type: Array,
            value: []
        }
    },
    attached() {
        // console.log(this.data.containerClass);
        // console.log(this.data.show);
        // console.log(this.data.texts);
    }
});