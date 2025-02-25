<template>
    <div>
        <div>Enter the SoundCloud track id you want to play</div>
        <div><input v-model="trackId" type="text" /></div>
        <div v-if="!isValid" style="color: red">You must enter a valid track id number!</div>
        <div>
            Try these for example :
            <ul>
                <li v-for="t of examples" :key="t">{{ t }}</li>
            </ul>
        </div>
        <div>
            <input v-model="mini" type="checkbox" />
            Mini mode
        </div>
        <Moveable
            ref="moveable"
            class="moveable"
            v-bind="moveable"
            @drag="handleDrag"
            @resize="handleResize"
            @scale="handleScale"
            @rotate="handleRotate"
            @warp="handleWarp"
        >
            <div>You can move me around!</div>
            <sound-cloud v-if="isValid && !changed" :track="finalTrack" :mini="mini" />
        </Moveable>
    </div>
</template>

<script>
export default {
    props: ["track"],
    data: () => ({
        trackId: "",
        finalTrack: "",
        mini: true,
        changed: false,
        examples: ["10400738", "164055022", "660093476"],
        moveable: {
            draggable: true,
            throttleDrag: 1,
            resizable: false,
            throttleResize: 1,
            keepRatio: false,
            scalable: false,
            throttleScale: 0.01,
            rotatable: false,
            throttleRotate: 0.2,
            pinchable: false,
            origin: false
        }
    }),
    methods: {
        handleDrag({ target, transform }) {
            target.style.transform = transform;
        },
        handleResize({ target, width, height }) {
            target.style.width = `${width}px`;
            target.style.height = `${height}px`;
        },
        handleScale({ target, transform }) {
            target.style.transform = transform;
        },
        handleRotate({ target, transform }) {
            target.style.transform = transform;
        },
        handleWarp({ target, transform }) {
            target.style.transform = transform;
        }
    },
    computed: {
        isValid() {
            return this.trackId.length >= 5 && parseInt(this.trackId) == this.trackId;
        }
    },
    watch: {
        trackId() {
            if (this.isValid) {
                // Looks like SoundCloud component doesn't like changing the track dynamically
                this.finalTrack = this.trackId;
                this.changed = true;
                this.$nextTick(() => (this.changed = false));
            }
        }
    },
    mounted() {
        if (this.track) this.trackId = this.track;
    }
};
</script>
