<script lang="ts">
    import type { PageData } from "./$types";
    let {data}:{data:PageData}=$props();
    let id = data.productId;
</script>

<p>
    {id}
</p>