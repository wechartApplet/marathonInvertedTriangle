Component({
    properties: {
        label: {
            type: String,
            value: ''
        },
        options: {
            type: Array,
            value: []
        },
        selectedIndex: {
            type: Number,
            value: 0
        },
        type: {
            type: String,
            value: ''
        }
    },
    methods: {
        onPickerChange(e) {
            this.triggerEvent('change', { type: this.data.type, value: e.detail.value }, { bubbles: true, composed: true });
        }
    }
});