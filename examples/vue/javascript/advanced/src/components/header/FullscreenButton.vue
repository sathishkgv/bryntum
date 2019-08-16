<!-- 
/**
 * @author Saki
 * @date 2019-03-28 13:49:57
 * @Last Modified by: Saki
 * @Last Modified time: 2019-04-28 21:00:11
 *
 * Fullscreen Button implementation (wrapper of Bryntum button)
 */
-->
<!--
/* <remove-on-release> */
/* cSpell: ignore toggleable */
/* </remove-on-release> */
-->
<template>
    <div></div>
</template>

<script>
    import { Fullscreen, WidgetHelper } from 'bryntum-gantt';
    
    // export the button
    export default {
        name : 'fullscreen-button',

        mounted() {
            const button = Fullscreen.enabled ? WidgetHelper.createWidget({
                type       : 'button',
                appendTo   : this.$el,
                icon       : 'b-icon b-icon-fullscreen',
                tooltip    : 'Fullscreen',
                toggleable : true,
                cls        : 'b-blue b-raised',
                onToggle   : ({ pressed }) => {
                    if (pressed) {
                        Fullscreen.request(document.documentElement);
                    }
                    else {
                        Fullscreen.exit();
                    }
                }
            }) : null; // eo button

            if(button) {
                Fullscreen.onFullscreenChange(() => {
                    this.button.pressed = Fullscreen.isFullscreen;
                });

                this.button = button;
            }
        }, // eo function mounted

        beforeDestroy() {
            if(this.button) {
                Fullscreen.onFullscreenChange(null);
            }
        } // eo function beforeDestroy

    } // eo export button

</script>

<!-- eof -->
