<!--
/**
 * @author Saki
 * @date 2019-04-21 19:02:52
 * @Last Modified by: Saki
 * @Last Modified time: 2019-04-23 12:37:16
 */
-->
<template>
    <div id="container">
        <app-header title="Gantt Advanced Vue demo"></app-header>
        <app-panel></app-panel>
    </div>
</template>

<script>
    import 'bryntum-gantt/gantt.stockholm.css';
    import AppHeader from './components/header/Header.vue';
    import AppPanel from './components/Panel.vue';

    export default {
        name: 'app',

        components: {
            AppHeader,
            AppPanel
        } // eo components
    } // eo export default App

</script>

<style lang="scss">
    @import './App.scss';
</style>

<!-- eof -->
