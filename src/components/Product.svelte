<script lang="ts">
    import {goto} from "$app/navigation";

    export let id;

    const click = () => {
        goto(`/product/${id}`);
    }
</script>

<button onclick={click}>
    zidan
</button>

<style>
    button {
        width: 100px;
        height: 100px;
        background-color: red;
    }
</style>